import mongoose from "mongoose";

const localizedTextSchema = new mongoose.Schema(
  { uk: { type: String, required: true, trim: true }, en: { type: String, required: true, trim: true } },
  { _id: false },
);

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    title: { type: localizedTextSchema, required: true },
    description: { type: localizedTextSchema, required: true },
    type: { type: String, required: true, trim: true, index: true },
    stack: [{ type: String, trim: true }],
    imageUrl: { type: String, default: "", trim: true },
    liveUrl: { type: String, default: "", trim: true },
    githubUrl: { type: String, default: "", trim: true },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

projectSchema.index({ "title.uk": "text", "title.en": "text", "description.uk": "text", "description.en": "text", stack: "text" });

export const Project = mongoose.model("Project", projectSchema);
