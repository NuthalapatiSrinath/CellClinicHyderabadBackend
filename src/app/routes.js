import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import catalogRoutes from "../modules/catalog/catalog.routes.js";
import inquiryRoutes from "../modules/inquiry/inquiry.routes.js";
import contactRoutes from "../modules/contact/contact.routes.js"; // <--- IMPORT THIS

const router = express.Router();

// Health Check
router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Module Routes
router.use("/auth", authRoutes);
router.use("/catalog", catalogRoutes);
router.use("/inquiry", inquiryRoutes);
router.use("/contact", contactRoutes); // <--- ADD THIS

export default router;
