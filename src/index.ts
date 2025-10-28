import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { db } from "./config/db";
import mongoose from "mongoose";

import morgan from "morgan";

import healthRoutes from "./routes/health";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";


const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/health", healthRoutes);
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);


app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const status = err?.status ?? 500;
  res.status(status).json({ error: err?.message ?? "Server Error" });
});

const PORT = Number(process.env.PORT) || 707;

async function start() {
  try {
    await db;
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", (err as any)?.message || err);
    process.exit(1);
  }
}

start();


