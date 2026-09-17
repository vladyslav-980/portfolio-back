import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    owner: "Vladyslav Huminiuk",
    role: "Junior Frontend / Full-Stack Developer",
    location: "Kyiv, Ukraine",
    email: "vldgum@gmail.com",
    links: { github: "https://github.com/70X14", linkedin: "https://www.linkedin.com/in/vladyslav-huminiuk" },
    featuredProjects: ["SavMed Clinic", "Tasteorama", "IceCream"],
  });
});

export default router;
