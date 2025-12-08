import express from "express";
import multer from "multer";
import {
  getBrands,
  getDevicesByBrand,
  getServicesByDevice,
  createBrand,
  updateBrand,
  deleteBrand,
  createDevice,
  updateDevice,
  deleteDevice,
  createService,
  updateService,
  deleteService,
  bulkUploadExcel,
  uploadBrandExcel,
} from "./catalog.controller.js";

const router = express.Router();

// MEMORY STORAGE (Crucial for Vercel & Base64)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 4 * 1024 * 1024 },
}); // 4MB

// --- PUBLIC ---
router.get("/brands", getBrands);
router.get("/devices/:brandId", getDevicesByBrand);
router.get("/services/:deviceId", getServicesByDevice);

// --- ADMIN (BRANDS) ---
router.post("/brand", upload.single("image"), createBrand);
router.put("/brand/:id", upload.single("image"), updateBrand);
router.delete("/brand/:id", deleteBrand);
router.post("/brand/:id/upload", upload.single("file"), uploadBrandExcel); // Brand Specific Excel

// --- ADMIN (DEVICES) ---
router.post("/device", upload.single("image"), createDevice);
router.put("/device/:id", upload.single("image"), updateDevice);
router.delete("/device/:id", deleteDevice);

// --- ADMIN (SERVICES) ---
router.post("/service", express.json(), createService);
router.put("/service/:id", express.json(), updateService);
router.delete("/service/:id", deleteService);

// --- ADMIN (GLOBAL EXCEL) ---
router.post("/upload", upload.single("file"), bulkUploadExcel);

export default router;
