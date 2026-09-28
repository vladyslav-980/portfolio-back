import { env } from "../config/env.js";

const BREVO_EMAIL_URL = "https://api.brevo.com/v3/smtp/email";

async function sendBrevoEmail(payload) {
  if (!env.brevoApiKey) {
    throw new Error("Brevo API is not configured");
  }

  const response = await fetch(BREVO_EMAIL_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": env.brevoApiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(`Brevo email API failed with status ${response.status}: ${responseBody}`);
  }

  return response.json();
}

export async function sendContactEmails({ name, email, message }) {
  const sender = { email: env.brevoSenderEmail, name: env.brevoSenderName };
  const ownerEmail = sendBrevoEmail({
    sender,
    to: [{ email: env.contactTo }],
    replyTo: { email, name },
    subject: `Portfolio message from ${name}`,
    textContent: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    htmlContent: `<h2>New portfolio message</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><hr><p>${escapeHtml(message).replaceAll("\n", "<br>")}</p>`,
  });

  const confirmationEmail = sendBrevoEmail({
    sender,
    to: [{ email, name }],
    replyTo: { email: env.contactTo, name: env.brevoSenderName },
    subject: "Thank you for contacting me",
    textContent: `Hello, ${name},\n\nThank you for getting in touch. I have received your message and appreciate your interest in working with me.\n\nI will review the details and respond as soon as possible.\n\nBest regards,\nVladyslav Huminiuk`,
    htmlContent: `<img src="https://portfolio-front-dun-nine.vercel.app/images/email-confirmation.png" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;" alt="Thank you for contacting me. Your message has been received, and I will respond as soon as possible."><p>Hello, ${escapeHtml(name)},</p><p>Thank you for getting in touch. I have received your message and appreciate your interest in working with me.</p><p>I will review the details and respond as soon as possible.</p><p>Best regards,<br>Vladyslav Huminiuk</p>`,
  });

  return Promise.allSettled([ownerEmail, confirmationEmail]);
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}
