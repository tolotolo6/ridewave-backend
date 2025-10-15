import express from "express";

const router = express.Router();

/**
 * GET /api/testroles
 */
router.get("/", (req, res) => {
  res.json({ message: "Test roles endpoint works ✅" });
});

export default router;



