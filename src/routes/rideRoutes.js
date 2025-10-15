import express from "express";
import Ride from "../models/Ride.js";
import Driver from "../models/Driver.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Accept a ride
router.post("/:rideId/accept", authMiddleware, async (req, res) => {
  try {
    const driverProfile = await Driver.findOne({ user: req.user._id });
    if (!driverProfile) {
      return res.status(403).json({ message: "You must complete driver setup first" });
    }

    const ride = await Ride.findById(req.params.rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.status !== "requested") {
      return res.status(400).json({ message: "Ride already accepted or completed" });
    }

    ride.driver = req.user._id;
    ride.status = "accepted";
    await ride.save();

    const populatedRide = await Ride.findById(ride._id)
      .populate("rider", "name email")
      .populate("driver", "name email")
      .lean();

    const driverDetails = await Driver.findOne({ user: req.user._id }).lean();
    populatedRide.driverProfile = driverDetails;

    res.json(populatedRide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get rides for current user (rider or driver)
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const query = {
      $or: [{ rider: req.user._id }, { driver: req.user._id }]
    };

    const rides = await Ride.find(query)
      .populate("rider", "name email")
      .populate("driver", "name email")
      .sort({ createdAt: -1 });

    const enrichedRides = await Promise.all(
      rides.map(async (ride) => {
        const rideObj = ride.toObject();
        if (ride.driver) {
          const driverProfile = await Driver.findOne({ user: ride.driver._id }).lean();
          rideObj.driverProfile = driverProfile;
        }
        return rideObj;
      })
    );

    res.json(enrichedRides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

