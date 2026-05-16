import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app: Application = express();
const PORT = process.env.PORT || 5001;

// Middlewares first before ROUTES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoURI = process.env.MONGO_URI || "";
mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ DATABASE: Connected to Vegify MongoDB Atlas"))
  .catch((err) => console.error("❌ DATABASE ERROR:", err.message));

app.get("/", (req: Request, res: Response) => {
  res.send("Vegify Backend is Running! 🌿");
});

// expect /api prefix
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🚀 SERVER: Running at port ${PORT}`);
});
