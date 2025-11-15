import { Router } from "express";
import { prisma } from "../db";
import { authMiddleware } from "./auth";

export const notificationsRouter = Router();

notificationsRouter.use(authMiddleware);

notificationsRouter.get("/", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  res.json(notifications);
});

notificationsRouter.post("/:id/read", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const id = Number(req.params.id);

  const notification = await prisma.notification.update({
    where: { id },
    data: { readAt: new Date() },
  });

  res.json(notification);
});
