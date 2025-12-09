import express from "express";
import { exportAllData } from "./backup.controller.js";

const router = express.Router();

// GET /api/backup/download
router.get("/download", exportAllData);

export default router;
