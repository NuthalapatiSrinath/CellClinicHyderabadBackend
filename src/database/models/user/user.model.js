import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "User", // Default name for new users
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true, // Faster lookups
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null, // Optional
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // OTP Fields (Hidden by default in queries)
    otp: {
      type: String,
      select: false,
    },
    otpExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Method to hide sensitive data in responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.otp;
  delete obj.otpExpires;
  delete obj.__v;
  return obj;
};

export default mongoose.model("User", userSchema);
