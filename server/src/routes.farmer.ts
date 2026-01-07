import { Router } from "express";
import { prisma } from "../db";
import { authMiddleware, requireRoles } from "./auth";
import { Role, MilkSession } from "@prisma/client";
import { calculateMilkPrice } from "./pricing";

export const farmerRouter = Router();

farmerRouter.use(authMiddleware, requireRoles([Role.FARMER]));

// POST /api/farmer/milk-entries (This seems to be for Farmer to self-report? Or maybe it's legacy. Task 5.1 says Samiti creates collection. But maybe Farmer can too? I'll keep it but focus on new endpoints)
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

// GET /api/farmer/collections (List collections with filtering)
farmerRouter.get("/collections", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const farmer = await prisma.farmer.findUnique({ where: { userId: req.user.userId } });
  if (!farmer) return res.status(400).json({ message: "Farmer profile not found" });

  const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };
  const where: any = { farmerId: farmer.id };

  if (startDate && endDate) {
    where.date = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const entries = await prisma.milkEntry.findMany({
    where,
    orderBy: { date: "desc" },
  });

  return res.json(entries);
});

// GET /api/farmer/collections/daily (Daily summary)
farmerRouter.get("/collections/daily", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  const farmer = await prisma.farmer.findUnique({ where: { userId: req.user.userId } });
  if (!farmer) return res.status(400).json({ message: "Farmer profile not found" });

  // Simple implementation: Group by date
  // Prisma doesn't support easy group by date part, so fetching all and aggregating in JS for now
  // Or just return last 7 days summary
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const entries = await prisma.milkEntry.findMany({
    where: {
      farmerId: farmer.id,
      date: { gte: sevenDaysAgo },
    },
    orderBy: { date: "desc" },
  });

  // Aggregate by date
  const dailyMap = new Map<string, { date: string; totalMilk: number; totalAmount: number }>();

  entries.forEach(e => {
    const dateStr = e.date.toISOString().split('T')[0];
    if (!dailyMap.has(dateStr)) {
      dailyMap.set(dateStr, { date: dateStr, totalMilk: 0, totalAmount: 0 });
    }
    const day = dailyMap.get(dateStr)!;
    day.totalMilk += e.quantityLitre;
    day.totalAmount += e.totalAmount;
  });

  res.json(Array.from(dailyMap.values()));
});

// GET /api/farmer/collections/monthly (Monthly summary)
farmerRouter.get("/collections/monthly", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  const farmer = await prisma.farmer.findUnique({ where: { userId: req.user.userId } });
  if (!farmer) return res.status(400).json({ message: "Farmer profile not found" });

  const currentYear = new Date().getFullYear();
  const entries = await prisma.milkEntry.findMany({
    where: {
      farmerId: farmer.id,
      date: { gte: new Date(currentYear, 0, 1) },
    },
  });

  const monthlyMap = new Map<string, { month: number; totalMilk: number; totalAmount: number }>();

  entries.forEach(e => {
    const month = e.date.getMonth() + 1;
    const key = `${month}`;
    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, { month, totalMilk: 0, totalAmount: 0 });
    }
    const m = monthlyMap.get(key)!;
    m.totalMilk += e.quantityLitre;
    m.totalAmount += e.totalAmount;
  });

  res.json(Array.from(monthlyMap.values()));
});

// GET /api/farmer/payouts
farmerRouter.get("/payouts", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  const farmer = await prisma.farmer.findUnique({ where: { userId: req.user.userId } });
  if (!farmer) return res.status(400).json({ message: "Farmer profile not found" });

  const payouts = await prisma.farmerPayout.findMany({
    where: { farmerId: farmer.id },
    orderBy: { createdAt: "desc" },
  });

  res.json(payouts);
});

// GET /api/farmer/payouts/:id
farmerRouter.get("/payouts/:id", async (req, res) => {
  const id = Number(req.params.id);
  const payout = await prisma.farmerPayout.findUnique({ where: { id } });
  if (!payout) return res.status(404).json({ message: "Payout not found" });
  res.json(payout);
});

// GET /api/farmer/account-summary
farmerRouter.get("/account-summary", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  const farmer = await prisma.farmer.findUnique({ where: { userId: req.user.userId } });
  if (!farmer) return res.status(400).json({ message: "Farmer profile not found" });

  const totalEarnings = await prisma.milkEntry.aggregate({
    where: { farmerId: farmer.id },
    _sum: { totalAmount: true },
  });

  const totalPaid = await prisma.farmerPayout.aggregate({
    where: { farmerId: farmer.id, status: "PAID" },
    _sum: { totalAmount: true },
  });

  const pendingPayouts = await prisma.farmerPayout.aggregate({
    where: { farmerId: farmer.id, status: "UNPAID" },
    _sum: { totalAmount: true },
  });

  res.json({
    totalEarnings: totalEarnings._sum.totalAmount || 0,
    totalPaid: totalPaid._sum.totalAmount || 0,
    pendingAmount: pendingPayouts._sum.totalAmount || 0,
  });
});

// GET /api/farmer/dashboard-summary (Legacy/Simple)
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

// GET /api/farmer/today-summary
farmerRouter.get("/today-summary", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const farmer = await prisma.farmer.findUnique({ where: { userId: req.user.userId } });
  if (!farmer) return res.status(400).json({ message: "Farmer profile not found" });

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const todayEntries = await prisma.milkEntry.findMany({
    where: {
      farmerId: farmer.id,
      date: { gte: startOfDay, lt: endOfDay },
    },
  });

  const morningEntry = todayEntries.find(e => e.session === MilkSession.MORNING);
  const eveningEntry = todayEntries.find(e => e.session === MilkSession.EVENING);

  const totalMilk = todayEntries.reduce((sum, e) => sum + e.quantityLitre, 0);
  const totalAmount = todayEntries.reduce((sum, e) => sum + e.totalAmount, 0);

  return res.json({
    morning: morningEntry ? {
      quantity: morningEntry.quantityLitre,
      fat: morningEntry.fat,
      snf: morningEntry.snf,
      pricePerLitre: morningEntry.pricePerLitre,
      amount: morningEntry.totalAmount,
    } : null,
    evening: eveningEntry ? {
      quantity: eveningEntry.quantityLitre,
      fat: eveningEntry.fat,
      snf: eveningEntry.snf,
      pricePerLitre: eveningEntry.pricePerLitre,
      amount: eveningEntry.totalAmount,
    } : null,
    totalMilk,
    totalAmount,
  });
});

