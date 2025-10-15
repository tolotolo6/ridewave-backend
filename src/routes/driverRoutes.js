import express from "express";
import User from "../models/User.js";

const router = express.Router();

/**
 * POST /api/drivers/register
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, licenseNumber } = req.body;

    if (!username || !email || !password || !licenseNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const driver = new User({
      username,
      email,
      password,
      role: "driver",
      licenseNumber,
    });

    await driver.save();
    res.status(201).json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/drivers
 */
router.get("/", async (req, res) => {
  try {
    const drivers = await User.find({ role: "driver" });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

