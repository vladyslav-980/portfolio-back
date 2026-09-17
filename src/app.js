import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import contactRouter from "./routes/contact.js";
import portfolioRouter from "./routes/portfolio.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: env.frontendUrl.split(",").map((url) => url.trim()), methods: ["GET", "POST"] }));
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/contact", contactRouter);
app.use("/api/portfolio", portfolioRouter);

app.use((_req, res) => res.status(404).json({ message: "Route not found" }));
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Unable to send the message right now" });
});

export default app;
