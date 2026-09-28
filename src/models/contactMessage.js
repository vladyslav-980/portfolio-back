import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    message: { type: String, required: true, trim: true },
    language: { type: String, enum: ["uk", "en"], default: "uk" },
    status: { type: String, enum: ["pending", "sent", "partially_sent", "failed"], default: "pending", index: true },
    ownerEmailSent: { type: Boolean, default: false },
    confirmationEmailSent: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

export const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);
