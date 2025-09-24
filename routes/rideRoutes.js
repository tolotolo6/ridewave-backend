// routes/rideRoutes.js
import express from "express";
import { verifyToken, isRider, isDriver, isAdmin } from "../middleware/authJwt.js";
import Ride from "../models/Ride.js";

const router = express.Router();

// 🟢 Rider requests a ride
router.post("/", verifyToken, isRider, async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation } = req.body;

    if (!pickupLocation || !dropoffLocation) {
      return res.status(400).json({ message: "Pickup and dropoff required" });
    }

    const ride = new Ride({
      rider: req.userId,
      pickupLocation,
      dropoffLocation,
      status: "pending",
    });

    await ride.save();
    res.status(201).json(ride);
  } catch (err) {
    res.status(500).json({ message: "Error creating ride", error: err.message });
  }
});

// 🟡 Driver accepts a ride
router.put("/:id/accept", verifyToken, isDriver, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.status !== "pending") {
      return res.status(400).json({ message: "Ride already accepted or completed" });
    }

    ride.driver = req.userId;
    ride.status = "accepted";
    await ride.save();

    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: "Error accepting ride", error: err.message });
  }
});

// 🟣 Driver completes a ride
router.put("/:id/complete", verifyToken, isDriver, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.driver.toString() !== req.userId) {
      return res.status(403).json({ message: "You are not assigned to this ride" });
    }

    ride.status = "completed";
    await ride.save();

    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: "Error completing ride", error: err.message });
  }
});

// 🔵 Rider/Driver can view their own rides
router.get("/", verifyToken, async (req, res) => {
  try {
    const rides = await Ride.find({
      $or: [{ rider: req.userId }, { driver: req.userId }],
    })
      .populate("rider", "username email")
      .populate("driver", "username email");

    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: "Error fetching rides", error: err.message });
  }
});

// 🔴 Admin can view all rides
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const rides = await Ride.find()
      .populate("rider", "username email")
      .populate("driver", "username email");

    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all rides", error: err.message });
  }
});

export default router;



