import { Router } from "express";
import { prisma } from "../db";
import { authMiddleware, requireRoles } from "./auth";
import { Role, OrderStatus } from "@prisma/client";

export const distributorRouter = Router();

distributorRouter.use(authMiddleware, requireRoles([Role.DISTRIBUTOR]));

// GET /api/distributor/products - catalog

distributorRouter.get("/products", async (_req, res) => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
  res.json(products);
});

// POST /api/distributor/orders

distributorRouter.post("/orders", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const { productId, quantity } = req.body as { productId: number; quantity: number };
  if (!productId || !quantity) {
    return res.status(400).json({ message: "Product and quantity are required" });
  }

  const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
  if (!product) return res.status(404).json({ message: "Product not found" });

  const totalAmount = product.price * Number(quantity);

  const order = await prisma.distributorOrder.create({
    data: {
      distributorId: req.user.userId,
      totalAmount,
      status: OrderStatus.PENDING,
      items: {
        create: {
          productId: product.id,
          quantity: Number(quantity),
          price: product.price,
          totalPrice: totalAmount,
        },
      },
    },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  res.status(201).json(order);
});

// GET /api/distributor/orders

distributorRouter.get("/orders", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const orders = await prisma.distributorOrder.findMany({
    where: { distributorId: req.user.userId },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(orders);
});
// GET /api/distributor/orders/:id
distributorRouter.get("/orders/:id", async (req, res) => {
  const id = Number(req.params.id);
  const order = await prisma.distributorOrder.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      payments: true,
      dispatches: true,
    },
  });

  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

// GET /api/distributor/credit-status
distributorRouter.get("/credit-status", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  // Simple logic: Sum of all unpaid orders vs credit limit (hardcoded for now or add to schema)
  // For now, let's just return total due amount
  const orders = await prisma.distributorOrder.findMany({
    where: { distributorId: req.user.userId },
    include: { payments: true },
  });

  let totalDue = 0;
  for (const order of orders) {
    const paid = order.payments.reduce((sum, p) => sum + p.amount, 0);
    totalDue += (order.totalAmount - paid);
  }

  const CREDIT_LIMIT = 50000; // Example limit
  const isBlocked = totalDue > CREDIT_LIMIT;

  res.json({ totalDue, creditLimit: CREDIT_LIMIT, isBlocked });
});

// --- PAYMENTS ---

// POST /api/distributor/payments
distributorRouter.post("/payments", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const { orderId, amount } = req.body;
  if (!orderId || !amount) return res.status(400).json({ message: "Order ID and amount are required" });

  const order = await prisma.distributorOrder.findUnique({
    where: { id: Number(orderId) },
    include: { payments: true },
  });

  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.distributorId !== req.user.userId) return res.status(403).json({ message: "Unauthorized" });

  const totalPaid = order.payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = order.totalAmount - totalPaid;

  if (Number(amount) > remaining) {
    return res.status(400).json({ message: "Payment amount exceeds remaining due" });
  }

  const payment = await prisma.distributorPayment.create({
    data: {
      orderId: Number(orderId),
      amount: Number(amount),
      status: "PAID", // Assuming immediate success for demo
      paidAt: new Date(),
    },
  });

  res.status(201).json(payment);
});

// GET /api/distributor/payments
distributorRouter.get("/payments", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const payments = await prisma.distributorPayment.findMany({
    where: {
      order: {
        distributorId: req.user.userId,
      },
    },
    include: { order: true },
    orderBy: { createdAt: "desc" },
  });

  res.json(payments);
});

// GET /api/distributor/due-payments
distributorRouter.get("/due-payments", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const orders = await prisma.distributorOrder.findMany({
    where: { distributorId: req.user.userId },
    include: { payments: true },
  });

  const dueOrders = orders.filter(o => {
    const paid = o.payments.reduce((sum, p) => sum + p.amount, 0);
    return paid < o.totalAmount;
  }).map(o => ({
    ...o,
    paidAmount: o.payments.reduce((sum, p) => sum + p.amount, 0),
    dueAmount: o.totalAmount - o.payments.reduce((sum, p) => sum + p.amount, 0),
  }));

  res.json(dueOrders);
});

// --- SUMMARY ---

// GET /api/distributor/monthly-summary
distributorRouter.get("/monthly-summary", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const currentYear = new Date().getFullYear();

  const orders = await prisma.distributorOrder.findMany({
    where: {
      distributorId: req.user.userId,
      createdAt: { gte: new Date(currentYear, 0, 1) },
    },
  });

  const monthlyMap = new Map<string, { month: number; totalOrders: number; totalSpent: number }>();

  orders.forEach(o => {
    const month = o.createdAt.getMonth() + 1;
    const key = `${month}`;
    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, { month, totalOrders: 0, totalSpent: 0 });
    }
    const m = monthlyMap.get(key)!;
    m.totalOrders += 1;
    m.totalSpent += o.totalAmount;
  });

  res.json(Array.from(monthlyMap.values()));
});
