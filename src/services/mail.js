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

export async function sendContactEmails({ name, email, message, language = "uk" }) {
  const sender = { email: env.brevoSenderEmail, name: env.brevoSenderName };
  const ownerEmail = sendBrevoEmail({
    sender,
    to: [{ email: env.contactTo }],
    replyTo: { email, name },
    subject: `Portfolio message from ${name}`,
    textContent: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    htmlContent: `<h2>New portfolio message</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><hr><p>${escapeHtml(message).replaceAll("\n", "<br>")}</p>`,
  });

  const isUkrainian = language === "uk";
  const confirmationEmail = sendBrevoEmail({
    sender,
    to: [{ email, name }],
    replyTo: { email: env.contactTo, name: env.brevoSenderName },
    subject: isUkrainian ? "Ваше повідомлення отримано" : "Your message has been received",
    textContent: isUkrainian
      ? `Вітаю, ${name}!\n\nДякую за повідомлення. Я отримав ваш запит і відповім найближчим часом.\n\nЗ повагою,\nВладислав Гумінюк`
      : `Hi ${name},\n\nThank you for your message. I have received your request and will reply as soon as possible.\n\nBest regards,\nVladyslav Huminiuk`,
    htmlContent: isUkrainian
      ? `<h2>Дякую за повідомлення!</h2><p>Вітаю, ${escapeHtml(name)}!</p><p>Я отримав ваш запит і відповім найближчим часом.</p><p>З повагою,<br>Владислав Гумінюк</p>`
      : `<h2>Thank you for your message!</h2><p>Hi ${escapeHtml(name)},</p><p>I have received your request and will reply as soon as possible.</p><p>Best regards,<br>Vladyslav Huminiuk</p>`,
  });

  return Promise.allSettled([ownerEmail, confirmationEmail]);
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}
