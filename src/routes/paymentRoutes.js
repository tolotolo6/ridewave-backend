import express from "express";
import Payment from "../models/Payment.js";
import Ride from "../models/Ride.js";

const router = express.Router();

/**
 * POST /api/payments/stkpush
 */
router.post("/stkpush", async (req, res) => {
  try {
    const { amount, phone, rideId } = req.body;

    if (!amount || !phone || !rideId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const payment = new Payment({ amount, phone, ride: rideId, status: "pending" });
    await payment.save();

    // Simulate callback
    setTimeout(async () => {
      payment.status = "completed";
      await payment.save();
    }, 5000);

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/payments
 */
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find().populate("ride");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

