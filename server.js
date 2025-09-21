// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(express.json()); // parse JSON bodies

// Connect to MongoDB Atlas
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Mount auth routes
app.use("/api/auth", authRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("RideWave API is running...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

