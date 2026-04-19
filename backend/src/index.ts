import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import Routes - Inayos ang path base sa structure mo
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";

// Load Environment Variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "";

if (!mongoURI) {
  console.error("❌ ERROR: MONGO_URI is not defined!");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ DATABASE: Connected to Vegify MongoDB Atlas"))
  .catch((err) => console.error("❌ DATABASE ERROR:", err.message));

// Routes Configuration
app.get("/", (req: Request, res: Response) => {
  res.send("Vegify Backend is Running! 🌿");
});

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Start Server
app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🚀 SERVER: Running at port ${PORT}`);
  console.log(`📡 NETWORK: Try connecting via http://172.20.10.2:${PORT}`);
});
