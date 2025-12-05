import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true }, // e.g., "Screen Replacement"
    description: { type: String }, // e.g., "Glass + Display replacement"
    price: { type: Number, required: true },
    originalPrice: { type: Number }, // For showing discounts
    discount: { type: String }, // e.g., "30% OFF"

    // Link to a specific device
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
