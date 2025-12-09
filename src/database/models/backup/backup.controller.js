import Treatment from "../../database/models/treatment.model.js";
import Blog from "../../database/models/blog.model.js";
import Gallery from "../../database/models/gallery.model.js";
import Contact from "../../database/models/contact.model.js";

export const exportAllData = async (req, res) => {
  try {
    console.log("📦 Starting NSF System Backup...");

    // 1. Fetch ALL Data from all collections
    const [treatments, blogs, gallery, contacts] = await Promise.all([
      Treatment.find({}),
      Blog.find({}),
      Gallery.find({}),
      Contact.find({}),
    ]);

    // 2. Structure the Backup
    const fullBackup = {
      system: "NSF Security",
      generatedAt: new Date(),
      stats: {
        treatments: treatments.length,
        blogs: blogs.length,
        galleryImages: gallery.length,
        contacts: contacts.length,
      },
      data: {
        treatments,
        blogs,
        gallery,
        contacts,
      },
    };

    // 3. Send as File
    const fileName = `NSF_Backup_${
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
