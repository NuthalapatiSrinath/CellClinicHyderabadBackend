import jwt from "jsonwebtoken";
import User from "../../database/models/user/user.model.js";
import { config } from "../../config/index.js";

// Helper to generate JWT Token
function signJwt(payload) {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpires || "7d",
  });
}

// --- 1. SEND OTP (Handles Login, Auto-Registration & Admin Role) ---
export const sendOtpController = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // 1. Validate Input
    if (!mobileNumber || mobileNumber.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid mobile number",
      });
    }

    // --- CONFIG: YOUR SPECIFIC ADMIN NUMBER ---
    const ADMIN_MOBILE_NUMBER = "9346532339";
    // ------------------------------------------

    // 2. Check if user exists
    let user = await User.findOne({ mobileNumber });

    if (!user) {
      // CASE A: NEW USER
      // If the number matches your admin number, set role to 'admin', else 'user'
      const role = mobileNumber === ADMIN_MOBILE_NUMBER ? "admin" : "user";

      user = await User.create({
        mobileNumber,
        name: "New User",
        role: role,
      });
    } else {
      // CASE B: EXISTING USER
      // If this IS the admin number but strictly saved as 'user', upgrade them automatically
      if (mobileNumber === ADMIN_MOBILE_NUMBER && user.role !== "admin") {
        user.role = "admin";
        await user.save();
      }
    }

    // 3. Generate 4-digit OTP
    const otp = 1234;

    // Set Expiry (10 Minutes)
    const otpExpires = Date.now() + 10 * 60 * 1000;

    // 4. Save OTP to DB
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // TODO: Integrate SMS API here (e.g., Twilio, Fast2SMS)
    console.log(`>>> LOGIN OTP for ${mobileNumber}: ${otp}`);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      // Remove debugOtp in production
      // debugOtp: otp
    });
  } catch (err) {
    console.error("Send OTP Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --- 2. VERIFY OTP ---
export const verifyOtpController = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    if (!mobileNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and OTP are required",
      });
    }

    // Find User & Select OTP fields (hidden by default)
    const user = await User.findOne({ mobileNumber }).select(
      "+otp +otpExpires"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate Access Token (Payload includes Role)
    const token = signJwt({ sub: user._id, role: user.role });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        _id: user._id,
        name: user.name,
        mobileNumber: user.mobileNumber,
        role: user.role, // This will be 'admin' for your specific number
      },
    });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
