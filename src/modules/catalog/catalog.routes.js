import express from "express";
import {
  getBrands,
  getDevicesByBrand,
  getServicesByDevice,
} from "./catalog.controller.js";
import { seedDatabase } from "./seed.controller.js"; // Import Seeder

const router = express.Router();

// Public Read Routes
router.get("/brands", getBrands);
router.get("/devices/:brandId", getDevicesByBrand);
router.get("/services/:deviceId", getServicesByDevice);

// Admin Seeder Route (Protect this in production!)
router.post("/seed", seedDatabase);

export default router;
