import { Router } from "express";
import { prisma } from "../db";
import { authMiddleware, requireRoles } from "./auth";
import { Role, MilkSession, PaymentStatus } from "@prisma/client";
import { calculateMilkPrice } from "./pricing";

export const samitiRouter = Router();

samitiRouter.use(authMiddleware, requireRoles([Role.SAMITI]));

// --- MILK COLLECTIONS ---

// GET /api/samiti/milk-collections
samitiRouter.get("/milk-collections", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const samiti = await prisma.samiti.findUnique({ where: { userId: req.user.userId } });
  if (!samiti) return res.status(400).json({ message: "Samiti profile not found" });

  const entries = await prisma.milkEntry.findMany({
    where: { samitiId: samiti.id },
    orderBy: { date: "desc" },
    include: {
      farmer: {
        include: { user: true },
      },
    },
  });

  return res.json(entries);
});

// POST /api/samiti/milk-collections
samitiRouter.post("/milk-collections", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const { farmerId, date, session, quantityLitre, fat, snf } = req.body;

  const samiti = await prisma.samiti.findUnique({ where: { userId: req.user.userId } });
  if (!samiti) return res.status(400).json({ message: "Samiti profile not found" });

  const { pricePerLitre, totalAmount, bandId } = await calculateMilkPrice(Number(fat), Number(snf), Number(quantityLitre));

  const entry = await prisma.milkEntry.create({
    data: {
      samitiId: samiti.id,
      farmerId: Number(farmerId),
      date: new Date(date),
      session: session as MilkSession,
      quantityLitre: Number(quantityLitre),
      fat: Number(fat),
      snf: Number(snf),
      pricePerLitre,
      totalAmount,
      fatSnfValueId: bandId,
    },
  });

  res.status(201).json(entry);
});

// GET /api/samiti/milk-collections/:id
samitiRouter.get("/milk-collections/:id", async (req, res) => {
  const id = Number(req.params.id);
  const entry = await prisma.milkEntry.findUnique({
    where: { id },
    include: { farmer: { include: { user: true } } },
  });
  if (!entry) return res.status(404).json({ message: "Entry not found" });
  res.json(entry);
});

// PUT /api/samiti/milk-collections/:id
samitiRouter.put("/milk-collections/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { quantityLitre, fat, snf } = req.body;

  const { pricePerLitre, totalAmount, bandId } = await calculateMilkPrice(Number(fat), Number(snf), Number(quantityLitre));

  const entry = await prisma.milkEntry.update({
    where: { id },
    data: {
      quantityLitre: Number(quantityLitre),
      fat: Number(fat),
      snf: Number(snf),
      pricePerLitre,
      totalAmount,
      fatSnfValueId: bandId,
    },
  });

  res.json(entry);
});

// DELETE /api/samiti/milk-collections/:id
samitiRouter.delete("/milk-collections/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.milkEntry.delete({ where: { id } });
  res.status(204).send();
});


// --- INVOICES ---

// POST /api/samiti/invoices/generate
samitiRouter.post("/invoices/generate", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const { startDate, endDate } = req.body;
  const start = new Date(startDate);
  const end = new Date(endDate);

  const samiti = await prisma.samiti.findUnique({ where: { userId: req.user.userId } });
  if (!samiti) return res.status(400).json({ message: "Samiti profile not found" });

  // Calculate total amount
  const aggregate = await prisma.milkEntry.aggregate({
    where: {
      samitiId: samiti.id,
      date: { gte: start, lte: end },
    },
    _sum: { totalAmount: true },
  });

  const totalAmount = aggregate._sum.totalAmount || 0;
  const invoiceNumber = `INV-${samiti.code}-${Date.now()}`;

  const invoice = await prisma.samitiInvoice.create({
    data: {
      samitiId: samiti.id,
      invoiceNumber,
      startDate: start,
      endDate: end,
      totalAmount,
      status: PaymentStatus.UNPAID,
    },
  });

  res.status(201).json(invoice);
});

// GET /api/samiti/invoices
samitiRouter.get("/invoices", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  const samiti = await prisma.samiti.findUnique({ where: { userId: req.user.userId } });
  if (!samiti) return res.status(400).json({ message: "Samiti profile not found" });

  const invoices = await prisma.samitiInvoice.findMany({
    where: { samitiId: samiti.id },
    orderBy: { createdAt: "desc" },
  });

  res.json(invoices);
});

// GET /api/samiti/invoices/:id
samitiRouter.get("/invoices/:id", async (req, res) => {
  const id = Number(req.params.id);
  const invoice = await prisma.samitiInvoice.findUnique({ where: { id } });
  if (!invoice) return res.status(404).json({ message: "Invoice not found" });
  res.json(invoice);
});


// --- PAYOUTS ---

// POST /api/samiti/payouts
samitiRouter.post("/payouts", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const { farmerId, startDate, endDate } = req.body;
  const start = new Date(startDate);
  const end = new Date(endDate);

  const samiti = await prisma.samiti.findUnique({ where: { userId: req.user.userId } });
  if (!samiti) return res.status(400).json({ message: "Samiti profile not found" });

  const aggregate = await prisma.milkEntry.aggregate({
    where: {
      samitiId: samiti.id,
      farmerId: Number(farmerId),
      date: { gte: start, lte: end },
    },
    _sum: { totalAmount: true },
  });

  const totalAmount = aggregate._sum.totalAmount || 0;
  const payoutNumber = `PAY-${farmerId}-${Date.now()}`;

  const payout = await prisma.farmerPayout.create({
    data: {
      samitiId: samiti.id,
      farmerId: Number(farmerId),
      payoutNumber,
      startDate: start,
      endDate: end,
      totalAmount,
      status: PaymentStatus.UNPAID,
    },
  });

  res.status(201).json(payout);
});

// GET /api/samiti/payouts
samitiRouter.get("/payouts", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  const samiti = await prisma.samiti.findUnique({ where: { userId: req.user.userId } });
  if (!samiti) return res.status(400).json({ message: "Samiti profile not found" });

  const payouts = await prisma.farmerPayout.findMany({
    where: { samitiId: samiti.id },
    include: { farmer: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });

  res.json(payouts);
});

// GET /api/samiti/payouts/:id
samitiRouter.get("/payouts/:id", async (req, res) => {
  const id = Number(req.params.id);
  const payout = await prisma.farmerPayout.findUnique({
    where: { id },
    include: { farmer: { include: { user: true } } },
  });
  if (!payout) return res.status(404).json({ message: "Payout not found" });
  res.json(payout);
});

// PUT /api/samiti/payouts/:id/pay
samitiRouter.put("/payouts/:id/pay", async (req, res) => {
  const id = Number(req.params.id);

  const payout = await prisma.farmerPayout.findUnique({ where: { id } });
  if (!payout) return res.status(404).json({ message: "Payout not found" });

  const updated = await prisma.farmerPayout.update({
    where: { id },
    data: {
      status: "PAID",
      paidAt: new Date(),
    },
  });

  res.json(updated);
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
