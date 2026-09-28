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

export async function sendContactEmails({ name, email, message, language = "uk" }) {
  const transporter = getTransporter();
  const ownerEmail = transporter.sendMail({
    from: `Portfolio contact <${env.smtpUser}>`,
    to: env.contactTo,
    replyTo: email,
    subject: `Portfolio message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    html: `<h2>New portfolio message</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><hr><p>${escapeHtml(message).replaceAll("\n", "<br>")}</p>`,
  });

  const isUkrainian = language === "uk";
  const confirmationEmail = transporter.sendMail({
    from: `Vladyslav Huminiuk <${env.smtpUser}>`,
    to: email,
    replyTo: env.contactTo,
    subject: isUkrainian ? "Ваше повідомлення отримано" : "Your message has been received",
    text: isUkrainian
      ? `Вітаю, ${name}!\n\nДякую за повідомлення. Я отримав ваш запит і відповім найближчим часом.\n\nЗ повагою,\nВладислав Гумінюк`
      : `Hi ${name},\n\nThank you for your message. I have received your request and will reply as soon as possible.\n\nBest regards,\nVladyslav Huminiuk`,
    html: isUkrainian
      ? `<h2>Дякую за повідомлення!</h2><p>Вітаю, ${escapeHtml(name)}!</p><p>Я отримав ваш запит і відповім найближчим часом.</p><p>З повагою,<br>Владислав Гумінюк</p>`
      : `<h2>Thank you for your message!</h2><p>Hi ${escapeHtml(name)},</p><p>I have received your request and will reply as soon as possible.</p><p>Best regards,<br>Vladyslav Huminiuk</p>`,
  });

  return Promise.allSettled([ownerEmail, confirmationEmail]);
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}
