import express from "express";
import Driver from "../models/Driver.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create or update driver profile
router.post("/setup", protect, async (req, res) => {
  try {
    const { licenseNumber, vehicleModel, vehiclePlate, vehicleColor } = req.body;

    let driver = await Driver.findOne({ user: req.user._id });

    if (driver) {
      driver.licenseNumber = licenseNumber;
      driver.vehicleModel = vehicleModel;
      driver.vehiclePlate = vehiclePlate;
      driver.vehicleColor = vehicleColor;
      await driver.save();
    } else {
      driver = await Driver.create({
        user: req.user._id,
        licenseNumber,
        vehicleModel,
        vehiclePlate,
        vehicleColor,
      });
    }

    res.json(driver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get driver profile
router.get("/me", protect, async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id }).populate("user", "name email");
    if (!driver) return res.status(404).json({ message: "Driver profile not found" });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

