import { Router } from "express";
import { prisma } from "../db";
import { Role } from "@prisma/client";
import { signToken, verifyPassword, hashPassword, authMiddleware, attachUserDetails } from "./auth";

export const authRouter = Router();

// POST /api/auth/login
authRouter.post("/login", async (req, res) => {
  const { email, password, expectedRole } = req.body as {
    email: string;
    password: string;
    expectedRole?: Role;
  };

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (expectedRole && user.role !== expectedRole) {
    return res.status(403).json({ message: "This account does not have access to that portal" });
  }

  const token = signToken({ userId: user.id, role: user.role });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
});

// GET /api/auth/me
authRouter.get("/me", authMiddleware, attachUserDetails, async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    include: {
      farmer: { include: { samiti: true } },
      samiti: true,
      ownerAdmin: true,
    },
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  return res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    farmer: user.farmer,
    samiti: user.samiti,
    ownerAdmin: user.ownerAdmin,
  });
});

// POST /api/auth/logout
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

// POST /api/auth/seed-demo
// Seeds a minimal set of demo users and reference data so dashboards have real data.
authRouter.post("/seed-demo", async (_req, res) => {
  // Only allow once in a simple way
  const existingOwner = await prisma.user.findFirst({ where: { role: Role.OWNER } });
  if (existingOwner) {
    return res.json({ message: "Demo data already seeded" });
  }

  const ownerPassword = await hashPassword("owner123");
  const samitiPassword = await hashPassword("samiti123");
  const farmerPassword = await hashPassword("farmer123");
  const distributorPassword = await hashPassword("distributor123");
  const logisticsPassword = await hashPassword("logistics123");

  const ownerUser = await prisma.user.create({
    data: {
      email: "owner@nanddairy.com",
      name: "Nand Dairy Owner",
      passwordHash: ownerPassword,
      role: Role.OWNER,
    },
  });

  const ownerAdmin = await prisma.ownerAdmin.create({
    data: {
      userId: ownerUser.id,
    },
  });

  const samitiUser = await prisma.user.create({
    data: {
      email: "samiti@nanddairy.com",
      name: "Radha Krishna Samiti",
      passwordHash: samitiPassword,
      role: Role.SAMITI,
    },
  });

  const samiti = await prisma.samiti.create({
    data: {
      name: "Radha Krishna Dugdha Samiti",
      code: "SAMITI-001",
      location: "Anand, Gujarat",
      ownerId: ownerAdmin.id,
      userId: samitiUser.id,
    },
  });

  const farmerUser = await prisma.user.create({
    data: {
      email: "farmer@nanddairy.com",
      name: "Ramesh Patel",
      passwordHash: farmerPassword,
      role: Role.FARMER,
    },
  });

  const farmer = await prisma.farmer.create({
    data: {
      farmerCode: "FARM-001",
      userId: farmerUser.id,
      samitiId: samiti.id,
    },
  });

  const distributorUser = await prisma.user.create({
    data: {
      email: "distributor@nanddairy.com",
      name: "Ankit Distributors",
      passwordHash: distributorPassword,
      role: Role.DISTRIBUTOR,
    },
  });

  const logisticsUser = await prisma.user.create({
    data: {
      email: "logistics@nanddairy.com",
      name: "Logistics Manager",
      passwordHash: logisticsPassword,
      role: Role.LOGISTICS,
    },
  });

  // Seed some fat/SNF bands
  await prisma.fatSnfValue.createMany({
    data: [
      { minFat: 3.5, maxFat: 3.9, minSnf: 8.0, maxSnf: 8.5, pricePerLitre: 32 },
      { minFat: 4.0, maxFat: 4.4, minSnf: 8.0, maxSnf: 8.5, pricePerLitre: 35 },
      { minFat: 4.5, maxFat: 5.0, minSnf: 8.5, maxSnf: 9.0, pricePerLitre: 38 },
    ],
    skipDuplicates: true,
  });

  // Seed a couple of products for owner
  await prisma.product.createMany({
    data: [
      {
        name: "Organic Whole Milk",
        description: "Premium organic whole milk",
        price: 70,
        unit: "L",
        inventory: 2000,
        ownerId: ownerAdmin.id,
      },
      {
        name: "Fresh Cream",
        description: "Rich dairy cream",
        price: 120,
        unit: "250ml",
        inventory: 500,
        ownerId: ownerAdmin.id,
      },
    ],
  });

  // Seed some logistics vehicles and routes
  const vehicle = await prisma.logisticsVehicle.create({
    data: {
      vehicleCode: "TRK-001",
      plateNumber: "GJ-01-AB-1234",
      capacityLitre: 3000,
      driverName: "John Doe",
    },
  });

  await prisma.logisticsRoute.create({
    data: {
      name: "Morning Route",
      origin: "Nand Dairy Plant",
      destination: "City Distributors",
      distanceKm: 42,
      estimatedMinutes: 285,
      vehicleId: vehicle.id,
    },
  });

  return res.json({
    message: "Demo data seeded",
    credentials: {
      owner: { email: "owner@nanddairy.com", password: "owner123" },
      samiti: { email: "samiti@nanddairy.com", password: "samiti123" },
      farmer: { email: "farmer@nanddairy.com", password: "farmer123" },
      distributor: { email: "distributor@nanddairy.com", password: "distributor123" },
      logistics: { email: "logistics@nanddairy.com", password: "logistics123" },
    },
  });
});
