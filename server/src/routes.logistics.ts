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
      order: { include: { items: { include: { product: true } }, distributor: true } },
      vehicle: true,
      route: true,
    },
    orderBy: { scheduledDate: "desc" },
  });

  res.json(dispatches);
});
// GET /api/logistics/pending-orders
logisticsRouter.get("/pending-orders", async (_req, res) => {
  // Find orders that are APPROVED but not yet dispatched/assigned
  // Or maybe just all orders that don't have a dispatch record?
  // For simplicity: Orders with status PENDING or APPROVED that are NOT in any dispatch record

  const orders = await prisma.distributorOrder.findMany({
    where: {
      dispatches: {
        none: {}, // No dispatches
      },
      status: { in: ["PENDING", "APPROVED"] },
    },
    include: {
      items: { include: { product: true } },
      distributor: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // Calculate weight (approximate, 1L = 1kg for now)
  const result = orders.map(o => {
    const totalWeight = o.items.reduce((sum, item) => sum + (item.quantity * 1), 0); // Assuming 1kg per unit for simplicity if unit is L
    return { ...o, totalWeight };
  });

  res.json(result);
});

// GET /api/logistics/vehicles/:id
logisticsRouter.get("/vehicles/:id", async (req, res) => {
  const id = Number(req.params.id);
  const vehicle = await prisma.logisticsVehicle.findUnique({
    where: { id },
    include: {
      routes: true,
      dispatches: {
        include: { order: true },
        orderBy: { scheduledDate: "desc" },
      },
    },
  });

  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
  res.json(vehicle);
});


// DELETE /api/logistics/dispatch/:id (Unassign)
logisticsRouter.delete("/dispatch/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.logisticsDispatch.delete({ where: { id } });
  res.status(204).send();
});

// GET /api/logistics/utilization
logisticsRouter.get("/utilization", async (_req, res) => {
  const vehicles = await prisma.logisticsVehicle.findMany({
    where: { isActive: true },
    include: {
      dispatches: {
        where: { status: { in: ["PLANNED", "LOADING", "DISPATCHED"] } },
        include: { order: { include: { items: true } } },
      },
    },
  });

  const utilization = vehicles.map(v => {
    const currentLoad = v.dispatches.reduce((sum, d) => {
      const orderWeight = d.order.items.reduce((w, i) => w + i.quantity, 0);
      return sum + orderWeight;
    }, 0);

    return {
      id: v.id,
      plateNumber: v.plateNumber,
      capacity: v.capacityLitre,
      currentLoad,
      utilizationPercentage: (currentLoad / v.capacityLitre) * 100,
    };
  });

  res.json(utilization);
});
