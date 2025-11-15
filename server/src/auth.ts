import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = "7d";

export interface AuthPayload {
  userId: number;
  role: Role;
}

declare module "express-serve-static-core" {
  // Extend Express Request to include user
  interface Request {
    user?: AuthPayload & { email: string; name: string };
  }
}

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token as string | undefined;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = { ...decoded, email: "", name: "" };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRoles(roles: Role[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden for this role" });
    }

    return next();
  };
}

export async function attachUserDetails(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) return next();

  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  if (user) {
    req.user.email = user.email;
    req.user.name = user.name;
  }
  next();
}
