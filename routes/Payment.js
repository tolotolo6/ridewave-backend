import express from "express";
import { protect } from "../middleware/auth.js";
import { stkPush } from "../services/mpesa.js";

const router = express.Router();

router.post("/stkpush", protect, stkPush);

export default router;
