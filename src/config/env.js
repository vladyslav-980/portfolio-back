import "dotenv/config";

export const env = {
  port: Number(process.env.PORT) || 4000,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT) || 465,
  smtpSecure: process.env.SMTP_SECURE !== "false",
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  contactTo: process.env.CONTACT_TO || "vldgum@gmail.com",
};
