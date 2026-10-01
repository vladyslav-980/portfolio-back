import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import contactRouter from "./routes/contact.js";
import portfolioRouter from "./routes/portfolio.js";
import projectsRouter from "./routes/projects.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: env.frontendUrl.split(",").map((url) => url.trim()), methods: ["GET", "POST", "PATCH", "DELETE"] }));
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/contact", contactRouter);
app.use("/api/portfolio", portfolioRouter);
app.use("/api/projects", projectsRouter);

app.use((_req, res) => res.status(404).json({ message: "Route not found" }));
app.use((error, _req, res, _next) => {
  console.error(error);
  if (error?.name === "CastError") return res.status(400).json({ message: "Invalid identifier" });
  if (error?.code === 11000) return res.status(409).json({ message: "Duplicate value" });
  res.status(500).json({ message: "Internal server error" });
});

export default app;
