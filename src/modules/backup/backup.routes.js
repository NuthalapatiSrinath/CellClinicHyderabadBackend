import express from "express";
import multer from "multer";
import { exportAllData, restoreData } from "./backup.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store ZIP in RAM

router.get("/download", exportAllData);
router.post("/restore", upload.single("file"), restoreData); // <--- NEW ROUTE

export default router;
