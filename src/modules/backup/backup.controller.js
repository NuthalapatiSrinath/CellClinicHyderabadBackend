import Brand from "../../database/models/catalog/brand.model.js";
import Device from "../../database/models/catalog/device.model.js";
import Service from "../../database/models/catalog/service.model.js";
import Inquiry from "../../database/models/inquiry.model.js";

export const exportAllData = async (req, res) => {
  try {
    console.log("📦 Starting Full Backup...");

    // 1. Fetch ALL Data
    const [brands, devices, services, inquiries] = await Promise.all([
      Brand.find({}),
      Device.find({}),
      Service.find({}),
      Inquiry.find({}),
    ]);

    // 2. Combine into one object
    const fullBackup = {
      generatedAt: new Date(),
      stats: {
        brands: brands.length,
        devices: devices.length,
        services: services.length,
        orders: inquiries.length,
      },
      data: {
        brands,
        devices,
        services,
        inquiries,
      },
    };

    // 3. Send as File
    const fileName = `CellClinic_Backup_${
      new Date().toISOString().split("T")[0]
    }.json`;

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.status(200).send(JSON.stringify(fullBackup, null, 2));
  } catch (error) {
    console.error("Backup Failed:", error);
    res.status(500).json({ message: "Backup Failed: " + error.message });
  }
};
