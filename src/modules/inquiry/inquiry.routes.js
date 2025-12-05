import express from "express";
import { createInquiry, getAllInquiries } from "./inquiry.controller.js";

const router = express.Router();

router.post("/create", createInquiry); // Used by BookingModal
router.get("/all", getAllInquiries); // Used by Admin Panel

export default router;
