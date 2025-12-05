import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { isAdmin } from "../../middleware/isAdmin.js";
import {
  createBrand,
  getBrands,
  createDevice,
  getDevicesByBrand,
  createService,
  getServicesByDevice,
} from "./catalog.controller.js";

const router = express.Router();

// --- PUBLIC ROUTES (For Users) ---
router.get("/brands", getBrands); // Get all brands
router.get("/devices/:brandId", getDevicesByBrand); // Get devices for a brand
router.get("/services/:deviceId", getServicesByDevice); // Get services for a device

// --- ADMIN ROUTES (Protected) ---
// Note: You must send a valid Admin Token in headers for these to work
router.post("/brands", authenticate, isAdmin, createBrand);
router.post("/devices", authenticate, isAdmin, createDevice);
router.post("/services", authenticate, isAdmin, createService);

export default router;
