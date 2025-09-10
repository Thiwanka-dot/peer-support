import express from "express";

const router = express.Router();

// Simple health-check endpoint
router.get("/status", (req, res) => {
  res.json({ success: true, message: "Socket server is running!" });
});

export default router;
