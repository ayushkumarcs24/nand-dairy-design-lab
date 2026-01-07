import { Router } from "express";
import { prisma } from "../db";
import { authMiddleware, requireRoles } from "./auth";
import { Role, MilkSession, PaymentStatus } from "@prisma/client";
import { calculateMilkPrice } from "./pricing";

export const samitiRouter = Router();

samitiRouter.use(authMiddleware, requireRoles([Role.SAMITI]));

// --- MILK COLLECTIONS ---

// POST /api/samiti/calculate-price
samitiRouter.post("/calculate-price", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  const { fat, snf, quantityLitre } = req.body;
  const result = await calculateMilkPrice(Number(fat), Number(snf), Number(quantityLitre));
  res.json(result);
});

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

// --- FARMER MANAGEMENT ---

// GET /api/samiti/farmers
samitiRouter.get("/farmers", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const samiti = await prisma.samiti.findUnique({ where: { userId: req.user.userId } });
  if (!samiti) return res.status(400).json({ message: "Samiti profile not found" });

  const farmers = await prisma.farmer.findMany({
    where: { samitiId: samiti.id },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { id: "desc" },
  });

  return res.json(farmers);
});

// POST /api/samiti/farmers
samitiRouter.post("/farmers", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const { name, email, farmerCode, village } = req.body;

  const samiti = await prisma.samiti.findUnique({ where: { userId: req.user.userId } });
  if (!samiti) return res.status(400).json({ message: "Samiti profile not found" });

  // 1. Create User
  // In a real app, you'd handle password hashing/generation better. Defaulting to 'password' for simplicity or a specific flow.
  // Assuming 'password' is the default password for new farmers created by Samiti.
  // You might want to use a service/helper to create the user to reuse logic (hashing).
  // For this mock/demo, we'll assume direct prisma create (simulating auth logic elsewhere or simple hash).
  // IMPORTANT: This simplified creation assumes we can just set a dummy password hash.

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: "hashed_default_password", // Placeholder
        role: Role.FARMER,
      },
    });

    // 2. Create Farmer Profile
    const farmer = await prisma.farmer.create({
      data: {
        userId: user.id,
        samitiId: samiti.id,
        farmerCode,
        village: village || "",
      },
      include: { user: true },
    });

    res.status(201).json(farmer);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "Farmer with this email or code already exists." });
    }
    res.status(500).json({ message: "Failed to create farmer", error: error.message });
  }
});

// DELETE /api/samiti/farmers/:id
samitiRouter.delete("/farmers/:id", async (req, res) => {
  const id = Number(req.params.id);
  // Be careful with cascading deletes. Ideally, we soft delete or ensure no milk entries exist.
  // For demo:
  try {
    await prisma.farmer.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    res.status(400).json({ message: "Cannot delete farmer with existing records" });
  }
});


// --- NOTIFICATIONS ---

// POST /api/samiti/notifications/send
samitiRouter.post("/notifications/send", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const { userId, title, message, type } = req.body;
  // type could be 'PAYMENT', 'COLLECTION', 'GENERAL'

  const notification = await prisma.notification.create({
    data: {
      userId: Number(userId),
      title,
      message,
      type: type || 'GENERAL',
    },
  });

  res.status(201).json(notification);
});

// --- DASHBOARD SUMMARIES ---

// GET /api/samiti/summary/daily
samitiRouter.get("/summary/daily", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const samiti = await prisma.samiti.findUnique({ where: { userId: req.user.userId } });
  if (!samiti) return res.status(400).json({ message: "Samiti profile not found" });

  // Get today's date range
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  // Aggregate today's milk entries
  const todayEntries = await prisma.milkEntry.findMany({
    where: {
      samitiId: samiti.id,
      date: { gte: startOfDay, lt: endOfDay },
    },
    include: {
      farmer: { include: { user: true } },
    },
  });

  const aggregate = await prisma.milkEntry.aggregate({
    where: {
      samitiId: samiti.id,
      date: { gte: startOfDay, lt: endOfDay },
    },
    _sum: {
      quantityLitre: true,
      totalAmount: true,
    },
    _avg: {
      fat: true,
      snf: true,
    },
  });

  return res.json({
    date: today.toISOString(),
    totalLitres: aggregate._sum.quantityLitre || 0,
    totalAmount: aggregate._sum.totalAmount || 0,
    avgFat: aggregate._avg.fat || 0,
    avgSnf: aggregate._avg.snf || 0,
    entriesCount: todayEntries.length,
    entries: todayEntries,
  });
});

// GET /api/samiti/summary/monthly-payouts
samitiRouter.get("/summary/monthly-payouts", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const samiti = await prisma.samiti.findUnique({ where: { userId: req.user.userId } });
  if (!samiti) return res.status(400).json({ message: "Samiti profile not found" });

  // Get current month date range
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Get all farmers for this samiti
  const farmers = await prisma.farmer.findMany({
    where: { samitiId: samiti.id },
    include: { user: true },
  });

  // Calculate monthly totals for each farmer
  const farmerPayouts = await Promise.all(
    farmers.map(async (farmer) => {
      const aggregate = await prisma.milkEntry.aggregate({
        where: {
          samitiId: samiti.id,
          farmerId: farmer.id,
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: {
          quantityLitre: true,
          totalAmount: true,
        },
        _avg: {
          fat: true,
          snf: true,
        },
        _count: true,
      });

      return {
        farmerId: farmer.id,
        farmerCode: farmer.farmerCode,
        farmerName: farmer.user.name,
        farmerEmail: farmer.user.email,
        totalLitres: aggregate._sum.quantityLitre || 0,
        totalAmount: aggregate._sum.totalAmount || 0,
        avgFat: aggregate._avg.fat || 0,
        avgSnf: aggregate._avg.snf || 0,
        entriesCount: aggregate._count || 0,
      };
    })
  );

  return res.json({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    farmers: farmerPayouts,
  });
});

// GET /api/samiti/summary/totals
samitiRouter.get("/summary/totals", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const samiti = await prisma.samiti.findUnique({ where: { userId: req.user.userId } });
  if (!samiti) return res.status(400).json({ message: "Samiti profile not found" });

  // Get current month range
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Calculate total amount Samiti owes to farmers (current month)
  const farmerPayoutsTotal = await prisma.milkEntry.aggregate({
    where: {
      samitiId: samiti.id,
      date: { gte: startOfMonth, lte: endOfMonth },
    },
    _sum: {
      totalAmount: true,
    },
  });

  // Calculate total amount Nand Dairy owes to Samiti (from invoices)
  const dairyOwesTotal = await prisma.samitiInvoice.aggregate({
    where: {
      samitiId: samiti.id,
      status: { in: [PaymentStatus.UNPAID, PaymentStatus.PARTIALLY_PAID] },
    },
    _sum: {
      totalAmount: true,
    },
  });

  // Get pending farmer payouts
  const pendingPayouts = await prisma.farmerPayout.aggregate({
    where: {
      samitiId: samiti.id,
      status: { in: [PaymentStatus.UNPAID, PaymentStatus.PARTIALLY_PAID] },
    },
    _sum: {
      totalAmount: true,
    },
  });

  return res.json({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    totalOwedToFarmers: farmerPayoutsTotal._sum.totalAmount || 0,
    totalFromDairy: dairyOwesTotal._sum.totalAmount || 0,
    pendingPayouts: pendingPayouts._sum.totalAmount || 0,
  });
});

// GET /api/samiti/alerts
samitiRouter.get("/alerts", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const samiti = await prisma.samiti.findUnique({ where: { userId: req.user.userId } });
  if (!samiti) return res.status(400).json({ message: "Samiti profile not found" });

  const alerts: Array<{ type: string; severity: string; title: string; message: string }> = [];

  // Get today's date range
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  // 1. Check for pending milk entries (farmers who haven't submitted today)
  const allFarmers = await prisma.farmer.findMany({
    where: { samitiId: samiti.id },
    include: { user: true },
  });

  const todayEntries = await prisma.milkEntry.findMany({
    where: {
      samitiId: samiti.id,
      date: { gte: startOfDay, lt: endOfDay },
    },
  });

  const farmersWithEntriesToday = new Set(todayEntries.map(e => e.farmerId));
  const farmersWithoutEntries = allFarmers.filter(f => !farmersWithEntriesToday.has(f.id));

  if (farmersWithoutEntries.length > 0) {
    alerts.push({
      type: "PENDING_ENTRIES",
      severity: "warning",
      title: "Pending Milk Entries",
      message: `${farmersWithoutEntries.length} farmer(s) haven't submitted milk today yet.`,
    });
  }

  // 2. Check for unpaid farmer payouts
  const unpaidPayouts = await prisma.farmerPayout.findMany({
    where: {
      samitiId: samiti.id,
      status: PaymentStatus.UNPAID,
    },
    include: { farmer: { include: { user: true } } },
  });

  if (unpaidPayouts.length > 0) {
    alerts.push({
      type: "UNPAID_FARMERS",
      severity: "error",
      title: "Unpaid Farmer Payouts",
      message: `${unpaidPayouts.length} payout(s) are pending payment.`,
    });
  }

  // 3. Check for low quality milk (FAT < 3.5 or SNF < 8.0) in last 7 days
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const lowQualityEntries = await prisma.milkEntry.findMany({
    where: {
      samitiId: samiti.id,
      date: { gte: sevenDaysAgo },
      OR: [
        { fat: { lt: 3.5 } },
        { snf: { lt: 8.0 } },
      ],
    },
    include: { farmer: { include: { user: true } } },
  });

  if (lowQualityEntries.length > 0) {
    alerts.push({
      type: "LOW_QUALITY",
      severity: "warning",
      title: "Low Quality Milk Detected",
      message: `${lowQualityEntries.length} entry(ies) with low FAT/SNF values in the last 7 days.`,
    });
  }

  // 4. Check for unpaid invoices from Nand Dairy
  const unpaidInvoices = await prisma.samitiInvoice.findMany({
    where: {
      samitiId: samiti.id,
      status: { in: [PaymentStatus.UNPAID, PaymentStatus.PARTIALLY_PAID] },
    },
  });

  if (unpaidInvoices.length > 0) {
    const totalPending = unpaidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    alerts.push({
      type: "PENDING_INVOICES",
      severity: "info",
      title: "Pending Payments from Nand Dairy",
      message: `₹${totalPending.toFixed(2)} pending from ${unpaidInvoices.length} invoice(s).`,
    });
  }

  return res.json({ alerts });
});
