import { Router } from "express";
import { prisma } from "../db";
import { authMiddleware, requireRoles } from "./auth";
import { Role } from "@prisma/client";

export const samitiRouter = Router();

samitiRouter.use(authMiddleware, requireRoles([Role.SAMITI]));

// GET /api/samiti/milk-entries (all farmers in this Samiti)
samitiRouter.get("/milk-entries", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const samiti = await prisma.samiti.findUnique({ where: { userId: req.user.userId } });
  if (!samiti) return res.status(400).json({ message: "Samiti profile not found" });

  const entries = await prisma.milkEntry.findMany({
    where: { samitiId: samiti.id },
    orderBy: { date: "desc" },
    take: 100,
    include: {
      farmer: {
        include: { user: true },
      },
    },
  });

  return res.json(entries);
});

// GET /api/samiti/monthly-totals
samitiRouter.get("/monthly-totals", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const samiti = await prisma.samiti.findUnique({ where: { userId: req.user.userId } });
  if (!samiti) return res.status(400).json({ message: "Samiti profile not found" });

  const totals = await prisma.samitiMonthlyTotal.findMany({
    where: { samitiId: samiti.id },
    orderBy: [{ year: "desc" }, { month: "desc" }],
    take: 12,
  });

  return res.json(totals);
});
