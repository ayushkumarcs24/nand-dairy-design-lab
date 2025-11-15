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
      productId: product.id,
      distributorId: req.user.userId,
      quantity: Number(quantity),
      totalAmount,
      status: OrderStatus.PENDING,
    },
  });

  res.status(201).json(order);
});

// GET /api/distributor/orders

distributorRouter.get("/orders", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const orders = await prisma.distributorOrder.findMany({
    where: { distributorId: req.user.userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  res.json(orders);
});
