import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { authRouter } from "./routes.auth";
import { farmerRouter } from "./routes.farmer";
import { samitiRouter } from "./routes.samiti";
import { ownerRouter } from "./routes.owner";
import { distributorRouter } from "./routes.distributor";
import { logisticsRouter } from "./routes.logistics";
import { notificationsRouter } from "./routes.notifications";

const app = express();

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/farmer", farmerRouter);
app.use("/api/samiti", samitiRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/distributor", distributorRouter);
app.use("/api/logistics", logisticsRouter);
app.use("/api/notifications", notificationsRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${PORT}`);
});
