import express from "express";
import Payment from "../models/Payment.js";
import Ride from "../models/Ride.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc Create a mock payment (STK Push simulation)
// @route POST /api/payments/pay
// @access Private
router.post("/pay", protect, async (req, res) => {
  try {
    const { rideId, amount } = req.body;

    if (!rideId || !amount) {
      return res.status(400).json({ message: "Ride ID and amount are required" });
    }

    // Check if already paid
    const existingPayment = await Payment.findOne({ ride: rideId, status: "completed" });
    if (existingPayment) {
      return res.status(400).json({ message: "Ride already paid for" });
    }

    const payment = await Payment.create({
      user: req.user._id,
      ride: rideId,
      amount,
      status: "pending",
      reference: `RID${rideId}-${Date.now()}`,
    });

    // Simulate callback → mark payment + ride as completed/paid
    setTimeout(async () => {
      payment.status = "completed";
      await payment.save();

      // Update ride as "paid" once payment is complete
      const ride = await Ride.findById(rideId);
      if (ride) {
        ride.status = "paid"; // new status
        await ride.save();
      }
    }, 3000);

    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment failed" });
  }
});

// @desc Get logged-in user's payments (with ride info)
// @route GET /api/payments/my
// @access Private
router.get("/my", protect, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate("ride", "pickupLocation destination fare status")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
