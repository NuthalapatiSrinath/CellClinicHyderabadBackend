import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import catalogRoutes from "../modules/catalog/catalog.routes.js";
import inquiryRoutes from "../modules/inquiry/inquiry.routes.js";
import contactRoutes from "../modules/contact/contact.routes.js"; // <--- IMPORT THIS
import backupRoutes from "../modules/backup/backup.routes.js";
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
router.use("/backup", backupRoutes);
export default router;
