import Brand from "../../database/models/catalog/brand.model.js";
import Device from "../../database/models/catalog/device.model.js";
import Service from "../../database/models/catalog/service.model.js";

// --- BRANDS ---

// Create Brand (Admin)
export const createBrand = async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json({ success: true, data: brand });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get All Brands (Public)
export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true });
    res.status(200).json({ success: true, data: brands });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- DEVICES ---

// Create Device (Admin)
export const createDevice = async (req, res) => {
  try {
    const device = await Device.create(req.body);
    res.status(201).json({ success: true, data: device });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Devices by Brand (Public)
export const getDevicesByBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const devices = await Device.find({ brand: brandId, isActive: true });
    res.status(200).json({ success: true, data: devices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- SERVICES ---

// Create Service (Admin)
export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Services by Device (Public)
export const getServicesByDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;
    // Populate device info just in case frontend needs it
    const services = await Service.find({ device: deviceId, isActive: true });
    res.status(200).json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
