import crypto from "node:crypto";
import { env } from "../config/env.js";

export function authenticateAdmin(req, res, next) {
  const receivedKey = req.get("x-admin-key") || "";
  const expectedKey = env.adminApiKey || "";
  const received = Buffer.from(receivedKey);
  const expected = Buffer.from(expectedKey);

  if (!receivedKey || received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
}
