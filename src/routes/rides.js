import express from "express";
import Ride from "../models/Ride.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/rides/request
 * Rider requests a ride
 */
router.post("/request", protect, authorize("rider"), async (req, res) => {
  try {
    const { pickup, destination, fare } = req.body;

    if (!pickup || !destination || !fare) {
      return res.status(400).json({ error: "Pickup, destination and fare are required" });
    }

    const newRide = new Ride({
      rider: req.user._id,
      pickup,
      destination,
      fare,
    });

    await newRide.save();
    res.status(201).json(newRide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/rides/accept/:rideId
 * Driver accepts a ride
 */
router.put("/accept/:rideId", protect, authorize("driver"), async (req, res) => {
  try {
    const { rideId } = req.params;
    const ride = await Ride.findById(rideId);

    if (!ride) return res.status(404).json({ error: "Ride not found" });
    if (ride.status !== "pending") {
      return res.status(400).json({ error: "Ride already accepted or completed" });
    }

    ride.driver = req.user._id;
    ride.status = "accepted";
    await ride.save();

    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/rides/complete/:rideId
 * Driver completes a ride
 */
router.put("/complete/:rideId", protect, authorize("driver"), async (req, res) => {
  try {
    const { rideId } = req.params;
    const ride = await Ride.findById(rideId);

    if (!ride) return res.status(404).json({ error: "Ride not found" });
    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Only the assigned driver can complete this ride" });
    }
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
 * Fetch all rides
 */
router.get("/", protect, async (req, res) => {
  try {
    const rides = await Ride.find()
      .populate("rider", "name email")
      .populate("driver", "name email");
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

