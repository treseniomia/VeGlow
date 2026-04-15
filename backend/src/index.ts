import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";

// 1. Load Environment Variables
dotenv.config();

const app: Application = express();

// Gamitin ang Port 5001 dahil occupied ang 5000 sa Mac
const PORT = process.env.PORT || 5001;

// 2. Middlewares (Dapat mauna ito bago ang Routes)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. MongoDB Connection
const mongoURI = process.env.MONGO_URI || "";

if (!mongoURI) {
  console.error("❌ ERROR: MONGO_URI is not defined in .env file!");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ DATABASE: Connected to Vegify MongoDB Atlas");
  })
  .catch((err) => {
    console.error("❌ DATABASE ERROR:", err.message);
  });

// 4. Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Vegify Backend is Running! 🌿");
});

// Authentication Routes
app.use("/api/auth", authRoutes);

// 5. Start Server - FIXED for Network Access
// Ginagamit ang '0.0.0.0' para makinig sa lahat ng network interface (Phone + Mac)
app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🚀 SERVER: Running at port ${PORT}`);
  console.log(`📡 NETWORK: Try connecting via http://172.20.10.2:${PORT}`);
});
