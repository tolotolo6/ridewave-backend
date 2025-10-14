import express from "express";
import Ride from "../models/Ride.js";

const router = express.Router();

/**
 * POST /api/rides/request
 */
router.post("/request", async (req, res) => {
  try {
    const { rider, pickup, destination, fare } = req.body;

    if (!rider || !pickup || !destination || !fare) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newRide = new Ride({ rider, pickup, destination, fare });
    await newRide.save();

    res.status(201).json(newRide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/rides/accept/:rideId
 */
router.put("/accept/:rideId", async (req, res) => {
  try {
    const { driver } = req.body;
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ error: "Ride not found" });

    if (ride.status !== "pending") {
      return res.status(400).json({ error: "Ride already accepted or completed" });
    }

    ride.driver = driver;
    ride.status = "accepted";
    await ride.save();

    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/rides/complete/:rideId
 */
router.put("/complete/:rideId", async (req, res) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ error: "Ride not found" });

    if (ride.status !== "accepted") {
      return res.status(400).json({ error: "Ride is not in progress" });
    }

    ride.status = "completed";
    await ride.save();

    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/rides
 */
router.get("/", async (req, res) => {
  try {
    const rides = await Ride.find().populate("rider").populate("driver");
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
