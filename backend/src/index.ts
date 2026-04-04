import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// 1. Load Environment Variables mula sa .env file
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// 2. Middlewares
app.use(cors()); // Pinapayagan ang frontend na kumonekta
app.use(express.json()); // Pinapayagan ang server na mag-basa ng JSON body

// 3. MongoDB Connection Logic
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

// 4. Base Route (Para sa testing kung buhay ang server)
app.get("/", (req: Request, res: Response) => {
  res.send("Vegify Backend is Running! 🌿");
});

// 5. Start Server
app.listen(PORT, () => {
  console.log(`🚀 SERVER: Running at http://localhost:${PORT}`);
});
