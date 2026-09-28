import { z } from "zod";

const optionalUrl = z.union([z.string().trim().url(), z.literal("")]).default("");
const localizedText = z.object({
  uk: z.string().trim().min(2).max(5000),
  en: z.string().trim().min(2).max(5000),
});

export const createProjectSchema = z.object({
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).min(2).max(80),
  title: localizedText,
  description: localizedText,
  type: z.string().trim().min(2).max(60),
  stack: z.array(z.string().trim().min(1).max(40)).min(1).max(30),
  imageUrl: optionalUrl,
  liveUrl: optionalUrl,
  githubUrl: optionalUrl,
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sortOrder: z.number().int().min(-1000).max(1000).default(0),
});

export const updateProjectSchema = createProjectSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required",
});

export const projectQuerySchema = z.object({
  search: z.string().trim().max(100).optional().default(""),
  type: z.string().trim().max(60).optional(),
  stack: z.string().trim().max(40).optional(),
  featured: z.enum(["true", "false"]).optional(),
  sort: z.enum(["sortOrder", "createdAt", "title", "type"]).optional().default("sortOrder"),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});
