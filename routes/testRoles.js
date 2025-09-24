import express from "express";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";

const router = express.Router();

// Rider-only route
router.get("/rider", protect, authorize("rider"), (req, res) => {
  res.json({ message: `Hello Rider ${req.user.name}, you have access!` });
});

// Driver-only route
router.get("/driver", protect, authorize("driver"), (req, res) => {
  res.json({ message: `Hello Driver ${req.user.name}, you have access!` });
});

// Admin-only route
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({ message: `Hello Admin ${req.user.name}, you have access!` });
});

export default router;



