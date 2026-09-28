import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { sendContactEmails } from "../services/mail.js";
import { ContactMessage } from "../models/contactMessage.js";

const router = Router();
const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(20).max(3000),
  language: z.enum(["uk", "en"]).optional().default("uk"),
  company: z.string().max(0).optional().default(""),
});

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: "draft-8", legacyHeaders: false });

router.post("/", limiter, async (req, res, next) => {
  try {
    const result = schema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ message: "Invalid form data", errors: result.error.flatten().fieldErrors });
    if (result.data.company) return res.status(200).json({ message: "Message sent" });
    const contact = await ContactMessage.create(result.data);
    const [ownerResult, confirmationResult] = await sendContactEmails(result.data);
    const ownerEmailSent = ownerResult.status === "fulfilled";
    const confirmationEmailSent = confirmationResult.status === "fulfilled";
    const status = ownerEmailSent && confirmationEmailSent ? "sent" : ownerEmailSent || confirmationEmailSent ? "partially_sent" : "failed";

    await ContactMessage.findByIdAndUpdate(contact._id, { status, ownerEmailSent, confirmationEmailSent });
    if (!ownerEmailSent) return res.status(502).json({ message: "Message saved, but email delivery failed" });

    return res.status(201).json({ message: "Message sent", confirmationSent: confirmationEmailSent });
  } catch (error) { next(error); }
});

export default router;
