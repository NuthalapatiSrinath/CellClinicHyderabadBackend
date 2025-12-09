import Brand from "../../database/models/catalog/brand.model.js";
import Device from "../../database/models/catalog/device.model.js";
import Service from "../../database/models/catalog/service.model.js";
import Inquiry from "../../database/models/inquiry.model.js";
import AdmZip from "adm-zip";

// ... keep exportAllData ...

export const restoreData = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No backup file uploaded" });

    console.log("♻️ Starting Restore Process...");

    // 1. Read the ZIP file from memory
    const zip = new AdmZip(req.file.buffer);
    const zipEntries = zip.getEntries();

    // 2. Find and Parse the JSON Database
    let dbEntry = zipEntries.find((entry) => entry.entryName.endsWith(".json"));
    if (!dbEntry)
      return res
        .status(400)
        .json({ message: "Invalid Backup: No database.json found" });

    const dbData = JSON.parse(dbEntry.getData().toString("utf8"));
    const data = dbData.data || dbData; // Handle both structures

    // 3. Helper to Reconstruct Images (Path -> Base64)
    const reconstructImages = (list) => {
      return list.map((item) => {
        // If image is a path like "images/brand_Apple.png", find it in ZIP
        if (
          item.image &&
          !item.image.startsWith("data:") &&
          !item.image.startsWith("http")
        ) {
          const imgFileName = item.image.split("/").pop(); // Get filename
          // Find file in zip (loose match for folder structure)
          const imgEntry = zipEntries.find((e) =>
            e.entryName.includes(imgFileName)
          );

          if (imgEntry) {
            const ext = imgFileName.split(".").pop();
            const base64 = imgEntry.getData().toString("base64");
            item.image = `data:image/${ext};base64,${base64}`;
          }
        }
        return item;
      });
    };

    // 4. Clear & Restore Database
    // WARNING: This wipes existing data to prevent duplicates
    await Promise.all([
      Brand.deleteMany({}),
      Device.deleteMany({}),
      Service.deleteMany({}),
      Inquiry.deleteMany({}),
    ]);

    // 5. Insert Data
    if (data.brands) await Brand.insertMany(reconstructImages(data.brands));
    if (data.devices) await Device.insertMany(reconstructImages(data.devices));
    if (data.services) await Service.insertMany(data.services); // Services usually don't have images
    if (data.inquiries) await Inquiry.insertMany(data.inquiries);

    res
      .status(200)
      .json({ success: true, message: "System Restored Successfully!" });
  } catch (error) {
    console.error("Restore Failed:", error);
    res.status(500).json({ message: "Restore Failed: " + error.message });
  }
};
