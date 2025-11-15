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

// DISTRIBUTOR ORDERS OVERVIEW
ownerRouter.get("/orders", async (_req, res) => {
  const orders = await prisma.distributorOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      distributor: true,
      product: true,
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
