import { Router } from "express";
import { Project } from "../models/project.js";
import { authenticateAdmin } from "../middleware/authenticateAdmin.js";
import { createProjectSchema, projectQuerySchema, updateProjectSchema } from "../validations/projects.js";

const router = Router();

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getProjectTypeFilter(type) {
  const normalizedType = type.trim().toLowerCase();
  const aliases = {
    pet: ["pet", "pet project"],
    "pet-project": ["pet", "pet project"],
    petproject: ["pet", "pet project"],
    "in-progress": ["in-progress", "in progress"],
    "in progress": ["in-progress", "in progress"],
  };

  return aliases[normalizedType] ? { $in: aliases[normalizedType] } : type;
}

router.get("/", async (req, res, next) => {
  try {
    const parsed = projectQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ message: "Invalid query parameters", errors: parsed.error.flatten().fieldErrors });

    const { search, type, stack, featured, sort, order, page, limit } = parsed.data;
    const filter = { published: true };
    if (type) filter.type = getProjectTypeFilter(type);
    if (stack) filter.stack = { $in: [new RegExp(`^${escapeRegex(stack)}$`, "i")] };
    if (featured !== undefined) filter.featured = featured === "true";
    if (search) {
      const pattern = new RegExp(escapeRegex(search), "i");
      filter.$or = [
        { "title.uk": pattern }, { "title.en": pattern },
        { "description.uk": pattern }, { "description.en": pattern },
        { stack: pattern }, { type: pattern },
      ];
    }

    const sortField = sort === "title" ? "title.en" : sort;
    const sortDirection = order === "desc" ? -1 : 1;
    const [items, total] = await Promise.all([
      Project.find(filter).sort({ [sortField]: sortDirection, _id: 1 }).skip((page - 1) * limit).limit(limit).lean(),
      Project.countDocuments(filter),
    ]);

    res.json({ items, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug.toLowerCase(), published: true }).lean();
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) { next(error); }
});

router.post("/", authenticateAdmin, async (req, res, next) => {
  try {
    const parsed = createProjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid project data", errors: parsed.error.flatten().fieldErrors });
    const project = await Project.create(parsed.data);
    res.status(201).json(project);
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: "A project with this slug already exists" });
    next(error);
  }
});

router.patch("/:id", authenticateAdmin, async (req, res, next) => {
  try {
    const parsed = updateProjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid project data", errors: parsed.error.flatten().fieldErrors });
    const project = await Project.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) { next(error); }
});

router.delete("/:id", authenticateAdmin, async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(204).send();
  } catch (error) { next(error); }
});

export default router;
