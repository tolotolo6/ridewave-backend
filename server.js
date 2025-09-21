// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js"; // make sure auth.js exists in ./routes/

dotenv.config();

const app = express();
app.use(express.json()); // parse JSON bodies

// Connect to MongoDB Atlas
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  // Options removed since Node.js Driver 4.x deprecated them
})
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Mount auth routes
app.use("/api/auth", authRoutes);

// Simple root endpoint
app.get("/", (req, res) => {
  res.send("RideWave API is running...");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

