import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { sendContactEmail } from "../services/mail.js";

const router = Router();
const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(20).max(3000),
  company: z.string().max(0).optional().default(""),
});

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: "draft-8", legacyHeaders: false });

router.post("/", limiter, async (req, res, next) => {
  try {
    const result = schema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ message: "Invalid form data", errors: result.error.flatten().fieldErrors });
    if (result.data.company) return res.status(200).json({ message: "Message sent" });
    await sendContactEmail(result.data);
    return res.status(201).json({ message: "Message sent" });
  } catch (error) { next(error); }
});

export default router;
