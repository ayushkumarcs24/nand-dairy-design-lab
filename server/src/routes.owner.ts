import { Router } from "express";
import { prisma } from "../db";
import { authMiddleware, requireRoles } from "./auth";
import { Role, OrderStatus } from "@prisma/client";

export const ownerRouter = Router();

ownerRouter.use(authMiddleware, requireRoles([Role.OWNER]));

// PRODUCTS CRUD
ownerRouter.get("/products", async (_req, res) => {
  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });
  res.json(products);
});

ownerRouter.post("/products", async (req, res) => {
  const { name, description, price, unit, inventory } = req.body;

  if (!name || !price) return res.status(400).json({ message: "Name and price are required" });

  const owner = await prisma.ownerAdmin.findFirst();
  if (!owner) return res.status(400).json({ message: "Owner profile missing" });

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      unit: unit || "L",
      inventory: inventory ? Number(inventory) : 0,
      ownerId: owner.id,
    },
  });

  res.status(201).json(product);
});

ownerRouter.put("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, description, price, unit, inventory, isActive } = req.body;

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price: price !== undefined ? Number(price) : undefined,
      unit,
      inventory: inventory !== undefined ? Number(inventory) : undefined,
      isActive,
    },
  });

  res.json(product);
});

ownerRouter.delete("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.product.delete({ where: { id } });
  res.status(204).send();
});

// SAMITIS OVERVIEW
ownerRouter.get("/samitis", async (_req, res) => {
  const samitis = await prisma.samiti.findMany({
    include: {
      user: true,
      monthlyTotal: {
        orderBy: [{ year: "desc" }, { month: "desc" }],
        take: 1,
      },
    },
    orderBy: { name: "asc" },
  });

  res.json(
    samitis.map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code,
      location: s.location,
      contactName: s.user.name,
      contactEmail: s.user.email,
      latestMonth: s.monthlyTotal[0]?.month ?? null,
      latestYear: s.monthlyTotal[0]?.year ?? null,
      latestTotalMilk: s.monthlyTotal[0]?.totalMilkLitre ?? 0,
      latestTotalPayout: s.monthlyTotal[0]?.totalPayout ?? 0,
    })),
  );
});

// DISTRIBUTORS OVERVIEW
ownerRouter.get("/distributors", async (_req, res) => {
  const distributors = await prisma.user.findMany({
    where: { role: Role.DISTRIBUTOR },
    include: {
      distributorOrders: {
        include: { items: { include: { product: true } } },
      },
    },
    orderBy: { name: "asc" },
  });

  const result = distributors.map((d) => {
    const orders = d.distributorOrders;
    const totalOrders = orders.length;
    const totalValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      id: d.id,
      name: d.name,
      email: d.email,
      totalOrders,
      totalValue,
    };
  });

  res.json(result);
});

// DISTRIBUTOR ORDERS OVERVIEW
ownerRouter.get("/orders", async (_req, res) => {
  const orders = await prisma.distributorOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      distributor: true,
      items: { include: { product: true } },
      payments: true,
      dispatches: true,
    },
  });

  res.json(orders);
});

ownerRouter.put("/orders/:id/status", async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body as { status: OrderStatus };

  if (!Object.values(OrderStatus).includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const order = await prisma.distributorOrder.update({
    where: { id },
    data: { status },
  });

  res.json(order);
});

// SIMPLE ANALYTICS FOR ADMIN CARDS
ownerRouter.get("/dashboard-summary", async (_req, res) => {
  const [samitiCount, productCount, distributors, orders, milkEntries] = await Promise.all([
    prisma.samiti.count(),
    prisma.product.count(),
    prisma.user.count({ where: { role: Role.DISTRIBUTOR } }),
    prisma.distributorOrder.count(),
    prisma.milkEntry.count(),
  ]);

  res.json({
    samitiCount,
    productCount,
    distributors,
    orders,
    milkEntries,
  });
});

// ANALYTICS - Monthly Revenue (last 6 months)
ownerRouter.get("/analytics/monthly-revenue", async (_req, res) => {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  const orders = await prisma.distributorOrder.findMany({
    where: {
      createdAt: {
        gte: sixMonthsAgo,
      },
    },
    select: {
      totalAmount: true,
      createdAt: true,
    },
  });

  // Group by month
  const monthlyData: { [key: string]: number } = {};
  orders.forEach((order) => {
    const monthKey = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short' });
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = 0;
    }
    monthlyData[monthKey] += order.totalAmount;
  });

  // Convert to array format for charts
  const result = Object.entries(monthlyData).map(([name, revenue]) => ({
    name,
    revenue: Math.round(revenue),
  }));

  res.json(result);
});

// ANALYTICS - Product Distribution
ownerRouter.get("/analytics/product-distribution", async (_req, res) => {
  const products = await prisma.product.findMany({
    include: {
      orderItems: true,
    },
  });

  const productData = products.map((product) => {
    const totalQuantity = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
    return {
      name: product.name,
      value: totalQuantity,
    };
  }).filter(p => p.value > 0); // Only include products with orders

  res.json(productData);
});

// ANALYTICS - Milk Collection Trends (last 6 months)
ownerRouter.get("/analytics/milk-trends", async (_req, res) => {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  const milkEntries = await prisma.milkEntry.findMany({
    where: {
      date: {
        gte: sixMonthsAgo,
      },
    },
    select: {
      date: true,
      quantityLitre: true,
    },
  });

  // Group by month
  const monthlyData: { [key: string]: number } = {};
  milkEntries.forEach((entry) => {
    const monthKey = new Date(entry.date).toLocaleDateString('en-US', { month: 'short' });
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = 0;
    }
    monthlyData[monthKey] += entry.quantityLitre;
  });

  // Convert to array format for charts
  const result = Object.entries(monthlyData).map(([name, litres]) => ({
    name,
    litres: Math.round(litres),
  }));

  res.json(result);
});

// SAMITI INVOICES
ownerRouter.get("/samiti-invoices", async (req, res) => {
  const { status, samitiId } = req.query as { status?: string; samitiId?: string };

  const where: any = {};
  if (status) where.status = status;
  if (samitiId) where.samitiId = Number(samitiId);

  const invoices = await prisma.samitiInvoice.findMany({
    where,
    include: { samiti: true },
    orderBy: { createdAt: "desc" },
  });

  res.json(invoices);
});

ownerRouter.get("/samiti-invoices/:id", async (req, res) => {
  const id = Number(req.params.id);
  const invoice = await prisma.samitiInvoice.findUnique({
    where: { id },
    include: { samiti: true },
  });

  if (!invoice) return res.status(404).json({ message: "Invoice not found" });
  res.json(invoice);
});

ownerRouter.put("/samiti-invoices/:id/pay", async (req, res) => {
  const id = Number(req.params.id);

  const invoice = await prisma.samitiInvoice.findUnique({ where: { id } });
  if (!invoice) return res.status(404).json({ message: "Invoice not found" });

  const updated = await prisma.samitiInvoice.update({
    where: { id },
    data: {
      status: "PAID",
      paidAt: new Date(),
    },
  });

  res.json(updated);
});
