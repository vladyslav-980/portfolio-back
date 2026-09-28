import "dotenv/config";

export const env = {
  port: Number(process.env.PORT) || 4000,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  mongodbUri: process.env.MONGODB_URI,
  adminApiKey: process.env.ADMIN_API_KEY,
  brevoApiKey: process.env.BREVO_API_KEY,
  brevoSenderEmail: process.env.BREVO_SENDER_EMAIL || "vldgum@gmail.com",
  brevoSenderName: process.env.BREVO_SENDER_NAME || "Vladyslav Huminiuk",
  contactTo: process.env.CONTACT_TO || "vldgum@gmail.com",
};

export function validateRequiredEnv() {
  const missing = [];
  if (!env.mongodbUri) missing.push("MONGODB_URI");
  if (!env.adminApiKey) missing.push("ADMIN_API_KEY");
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}
