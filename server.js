// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

// === Routes ===
import authRoutes from "./routes/auth.js";
import rideRoutes from "./routes/rides.js";
import driverRoutes from "./routes/driverRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import testRoles from "./routes/testRoles.js";

// === Init ===
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// === MongoDB Connection ===
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://Ridewave_user:aezgH215Nlhwz0K8@cluster0.w49ewkg.mongodb.net/ridewave?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// === API Routes ===
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/testroles", testRoles);

// === Test Route to confirm rides.js works ===
app.get("/api/rides/test", (req, res) => {
  res.json({ message: "✅ Ride routes are working!" });
});

// === Root Route ===
app.get("/", (req, res) => {
  res.type("html").send(`
    <html>
      <head>
        <title>Ridewave Backend</title>
        <style>
          body { font-family: Arial, sans-serif; background: #f8f9fa; color: #333; padding: 40px; text-align: center; }
          h1 { color: #007bff; }
          a { color: #007bff; text-decoration: none; }
          ul { list-style-type: none; padding: 0; }
        </style>
      </head>
      <body>
        <h1>🚀 Ridewave Backend is Live!</h1>
        <p>Welcome to the Ridewave API service.</p>
        <h3>Available Endpoints:</h3>
        <ul>
          <li><a href="/api/auth">/api/auth</a></li>
          <li><a href="/api/rides">/api/rides</a></li>
          <li><a href="/api/rides/test">/api/rides/test</a> ✅</li>
          <li><a href="/api/drivers">/api/drivers</a></li>
          <li><a href="/api/payments">/api/payments</a></li>
          <li><a href="/api/users">/api/users</a></li>
          <li><a href="/api/testroles">/api/testroles</a></li>
        </ul>
        <p>MongoDB Connected ✅ | Node.js Backend</p>
      </body>
    </html>
  `);
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Ridewave backend running on port ${PORT}`));

