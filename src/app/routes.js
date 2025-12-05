import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import catalogRoutes from "../modules/catalog/catalog.routes.js"; // <-- Import
import inquiryRoutes from "../modules/inquiry/inquiry.routes.js";
const router = express.Router();

// Health Check
router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Module Routes
router.use("/auth", authRoutes);
router.use("/catalog", catalogRoutes); // <-- Use catalog routes
router.use("/inquiry", inquiryRoutes);
export default router;
