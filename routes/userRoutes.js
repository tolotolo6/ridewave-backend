// routes/userRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { updateProfile, changePassword, getUserById } from "../controllers/userController.js";

const router = express.Router();

// GET /api/users/:id
router.get("/:id", protect, getUserById);

// PUT /api/users/profile -> Update profile
router.put("/profile", protect, updateProfile);

// PUT /api/users/change-password -> Change password
router.put("/change-password", protect, changePassword);

export default router;
