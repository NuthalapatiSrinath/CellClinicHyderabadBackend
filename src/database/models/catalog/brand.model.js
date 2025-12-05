import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    image: { type: String, required: true }, // URL to the brand logo
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Brand", brandSchema);
