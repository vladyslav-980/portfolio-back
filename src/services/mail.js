import nodemailer from "nodemailer";
import { env } from "../config/env.js";

function getTransporter() {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    throw new Error("SMTP is not configured");
  }

  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: { user: env.smtpUser, pass: env.smtpPass },
  });
}

export async function sendContactEmail({ name, email, message }) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `Portfolio contact <${env.smtpUser}>`,
    to: env.contactTo,
    replyTo: email,
    subject: `Portfolio message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    html: `<h2>New portfolio message</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><hr><p>${escapeHtml(message).replaceAll("\n", "<br>")}</p>`,
  });
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}
