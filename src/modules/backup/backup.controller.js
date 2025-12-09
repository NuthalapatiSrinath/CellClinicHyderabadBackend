import Brand from "../../database/models/catalog/brand.model.js";
import Device from "../../database/models/catalog/device.model.js";
import Service from "../../database/models/catalog/service.model.js";
import Inquiry from "../../database/models/inquiry.model.js";
import AdmZip from "adm-zip"; // Ensure you have installed: npm install adm-zip

// ==========================================
// 1. EXPORT ALL DATA (Download)
// ==========================================
export const exportAllData = async (req, res) => {
  try {
    console.log("📦 Starting Cell Clinic Backup...");

    // 1. Fetch ALL Data
    const [brands, devices, services, inquiries] = await Promise.all([
      Brand.find({}),
      Device.find({}),
      Service.find({}),
      Inquiry.find({}),
    ]);

    // 2. Combine into one object
    const fullBackup = {
      system: "Cell Clinic Hyderabad",
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

// ==========================================
// 2. RESTORE DATA (Upload ZIP)
// ==========================================
export const restoreData = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No backup file uploaded" });

    console.log("♻️ Starting Restore Process...");

    // 1. Read the ZIP file from memory
    const zip = new AdmZip(req.file.buffer);
    const zipEntries = zip.getEntries();

    // 2. Find and Parse the JSON Database
    // We look for 'database.json' or any json file in the root
    let dbEntry = zipEntries.find(
      (entry) =>
        entry.entryName.endsWith("database.json") ||
        entry.entryName.endsWith(".json")
    );

    if (!dbEntry) {
      return res
        .status(400)
        .json({ message: "Invalid Backup: No database.json found inside ZIP" });
    }

    const dbString = dbEntry.getData().toString("utf8");
    const dbData = JSON.parse(dbString);
    const data = dbData.data || dbData; // Handle nested structure if present

    // 3. Helper to Reconstruct Images (File Path -> Base64)
    // This finds the image file in the zip (e.g., "images/brand_Apple.png") and converts it back to data URI
    const reconstructImages = (list) => {
      if (!list) return [];

      return list.map((item) => {
        // Only process if it looks like a file path (not http, not data:)
        if (
          item.image &&
          !item.image.startsWith("data:") &&
          !item.image.startsWith("http")
        ) {
          const imgFileName = item.image.split("/").pop(); // Get "brand_Apple.png"

          // Find that file in the zip entries
          const imgEntry = zipEntries.find((e) =>
            e.entryName.includes(imgFileName)
          );

          if (imgEntry) {
            const ext = imgFileName.split(".").pop(); // png or jpg
            const base64 = imgEntry.getData().toString("base64");
            // Update the item image with the reconstructed Base64 string
            item.image = `data:image/${ext};base64,${base64}`;
          }
        }
        return item;
      });
    };

    // 4. CLEAR Existing Database (Safety: Wipe clean before restore to avoid duplicates)
    console.log("Cleaning existing data...");
    await Promise.all([
      Brand.deleteMany({}),
      Device.deleteMany({}),
      Service.deleteMany({}),
      Inquiry.deleteMany({}),
    ]);

    // 5. INSERT Restored Data
    console.log("Inserting new data...");
    if (data.brands) await Brand.insertMany(reconstructImages(data.brands));
    if (data.devices) await Device.insertMany(reconstructImages(data.devices));
    if (data.services) await Service.insertMany(data.services); // Services usually don't have images
    if (data.inquiries) await Inquiry.insertMany(data.inquiries); // Restore orders

    res
      .status(200)
      .json({ success: true, message: "System Restored Successfully!" });
  } catch (error) {
    console.error("Restore Failed:", error);
    res.status(500).json({ message: "Restore Failed: " + error.message });
  }
};
