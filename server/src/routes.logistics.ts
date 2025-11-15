import { Router } from "express";
import { prisma } from "../db";
import { authMiddleware, requireRoles } from "./auth";
import { Role, DispatchStatus } from "@prisma/client";

export const logisticsRouter = Router();

logisticsRouter.use(authMiddleware, requireRoles([Role.LOGISTICS]));

// GET /api/logistics/vehicles
logisticsRouter.get("/vehicles", async (_req, res) => {
  const vehicles = await prisma.logisticsVehicle.findMany({
    where: { isActive: true },
    include: {
      routes: true,
      dispatches: true,
    },
  });

  res.json(vehicles);
});

// GET /api/logistics/routes
logisticsRouter.get("/routes", async (_req, res) => {
  const routes = await prisma.logisticsRoute.findMany({
    include: { vehicle: true },
  });

  res.json(routes);
});

// POST /api/logistics/dispatch - assign order to a vehicle/route
logisticsRouter.post("/dispatch", async (req, res) => {
  const { orderId, vehicleId, routeId, scheduledDate } = req.body as {
    orderId: number;
    vehicleId: number;
    routeId: number;
    scheduledDate?: string;
  };

  if (!orderId || !vehicleId || !routeId) {
    return res.status(400).json({ message: "orderId, vehicleId and routeId are required" });
  }

  const dispatch = await prisma.logisticsDispatch.create({
    data: {
      orderId: Number(orderId),
      vehicleId: Number(vehicleId),
      routeId: Number(routeId),
      scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
      status: DispatchStatus.PLANNED,
    },
  });

  res.status(201).json(dispatch);
});

// PUT /api/logistics/dispatch/:id/status
logisticsRouter.put("/dispatch/:id/status", async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body as { status: DispatchStatus };

  if (!Object.values(DispatchStatus).includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  let timestamps: { departedAt?: Date; deliveredAt?: Date } = {};

  if (status === DispatchStatus.DISPATCHED) {
    timestamps.departedAt = new Date();
  }
  if (status === DispatchStatus.DELIVERED) {
    timestamps.deliveredAt = new Date();
  }

  const dispatch = await prisma.logisticsDispatch.update({
    where: { id },
    data: {
      status,
      ...timestamps,
    },
  });

  res.json(dispatch);
});

// GET /api/logistics/dispatches
logisticsRouter.get("/dispatches", async (_req, res) => {
  const dispatches = await prisma.logisticsDispatch.findMany({
    include: {
      order: { include: { product: true, distributor: true } },
      vehicle: true,
      route: true,
    },
    orderBy: { scheduledDate: "desc" },
  });

  res.json(dispatches);
});
