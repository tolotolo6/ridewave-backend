// routes/auth.js
import express from "express";
const router = express.Router();

// Signup route
router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  // You can add real MongoDB saving here later
  res.status(201).json({
    message: "User registered successfully!",
    user: { username, email }
  });
});

// Login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // You can add real authentication & JWT here later
  res.status(200).json({
    message: "Login successful",
    token: "fake-jwt-token-for-testing"
  });
});

export default router;
