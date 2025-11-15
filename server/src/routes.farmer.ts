import { Router } from "express";
import { prisma } from "../db";
import { authMiddleware, requireRoles } from "./auth";
import { Role, MilkSession } from "@prisma/client";
import { calculateMilkPrice } from "./pricing";

export const farmerRouter = Router();

farmerRouter.use(authMiddleware, requireRoles([Role.FARMER]));

// POST /api/farmer/milk-entries
farmerRouter.post("/milk-entries", async (req, res) => {
  const { session, quantityLitre, fat, snf } = req.body as {
    session: MilkSession;
    quantityLitre: number;
    fat: number;
    snf: number;
  };

  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  if (!session || !quantityLitre || !fat || !snf) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const farmer = await prisma.farmer.findUnique({
    where: { userId: req.user.userId },
  });

  if (!farmer) return res.status(400).json({ message: "Farmer profile not found" });

  const samitiId = farmer.samitiId;
  const { pricePerLitre, totalAmount, bandId } = await calculateMilkPrice(
    Number(fat),
    Number(snf),
    Number(quantityLitre),
  );

  const entry = await prisma.milkEntry.create({
    data: {
      session,
      quantityLitre: Number(quantityLitre),
      fat: Number(fat),
      snf: Number(snf),
      pricePerLitre,
      totalAmount,
      farmerId: farmer.id,
      samitiId,
      fatSnfValueId: bandId ?? undefined,
    },
  });

  // Update monthly total for Samiti
  const now = new Date(entry.date);
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const allEntriesThisMonth = await prisma.milkEntry.findMany({
    where: {
      samitiId,
      date: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      },
    },
  });

  const totalMilk = allEntriesThisMonth.reduce((sum, e) => sum + e.quantityLitre, 0);
  const avgFat =
    allEntriesThisMonth.length === 0
      ? 0
      : allEntriesThisMonth.reduce((sum, e) => sum + e.fat, 0) /
        allEntriesThisMonth.length;
  const avgSnf =
    allEntriesThisMonth.length === 0
      ? 0
      : allEntriesThisMonth.reduce((sum, e) => sum + e.snf, 0) /
        allEntriesThisMonth.length;
  const totalPayout = allEntriesThisMonth.reduce((sum, e) => sum + e.totalAmount, 0);

  await prisma.samitiMonthlyTotal.upsert({
    where: {
      samitiId_month_year: {
        samitiId,
        month,
        year,
      },
    },
    update: {
      totalMilkLitre: totalMilk,
      avgFat,
      avgSnf,
      totalPayout,
    },
    create: {
      samitiId,
      month,
      year,
      totalMilkLitre: totalMilk,
      avgFat,
      avgSnf,
      totalPayout,
    },
  });

  return res.status(201).json(entry);
});

// GET /api/farmer/milk-entries
farmerRouter.get("/milk-entries", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const farmer = await prisma.farmer.findUnique({ where: { userId: req.user.userId } });
  if (!farmer) return res.status(400).json({ message: "Farmer profile not found" });

  const entries = await prisma.milkEntry.findMany({
    where: { farmerId: farmer.id },
    orderBy: { date: "desc" },
    take: 30,
  });

  return res.json(entries);
});

// GET /api/farmer/dashboard-summary
farmerRouter.get("/dashboard-summary", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const farmer = await prisma.farmer.findUnique({ where: { userId: req.user.userId } });
  if (!farmer) return res.status(400).json({ message: "Farmer profile not found" });

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const entries = await prisma.milkEntry.findMany({
    where: {
      farmerId: farmer.id,
      date: {
        gte: startOfMonth,
      },
    },
    orderBy: { date: "desc" },
  });

  const totalMilk = entries.reduce((sum, e) => sum + e.quantityLitre, 0);
  const totalEarnings = entries.reduce((sum, e) => sum + e.totalAmount, 0);
  const avgFat = entries.length ? entries.reduce((s, e) => s + e.fat, 0) / entries.length : 0;
  const avgSnf = entries.length ? entries.reduce((s, e) => s + e.snf, 0) / entries.length : 0;

  return res.json({ totalMilk, totalEarnings, avgFat, avgSnf, entries });
});
