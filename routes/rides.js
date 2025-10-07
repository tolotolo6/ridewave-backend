// backend/routes/rides.js
import express from "express";
import Ride from "../models/Ride.js"; // Make sure Ride model exists

const router = express.Router();

/**
 * @route   GET /api/rides
 * @desc    Get all rides
 */
router.get("/", async (req, res) => {
  try {
    const rides = await Ride.find();
    res.json(rides);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch rides" });
  }
});

/**
 * @route   GET /api/rides/driver/:driverId
 * @desc    Get rides for a specific driver
 */
router.get("/driver/:driverId", async (req, res) => {
  try {
    const { driverId } = req.params;
    const rides = await Ride.find({ driverId });
    res.json(rides);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch driver rides" });
  }
});

/**
 * @route   PUT /api/rides/:id/status
 * @desc    Update ride status (e.g., Pending → Completed)
 */
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ride = await Ride.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    res.json(ride);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update ride status" });
  }
});

export default router;

