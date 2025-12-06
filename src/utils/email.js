// src/utils/email.js
import nodemailer from "nodemailer";
import { config } from "../config/index.js";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
    // -------------------------------------------
    // THE FIX: Force IPv4 to prevent timeouts
    // -------------------------------------------
    family: 4,
    logger: true, // Log connection details for debugging
    debug: true, // Include debug info
  });
};

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    console.log(`Attempting to email ${to} via ${config.email.user}...`);
    const transporter = createTransporter();

    // Verify connection configuration
    await transporter.verify();
    console.log("✅ SMTP Connection Verified");

    const mailOptions = {
      from: config.email.from,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email successfully sent to ${to}`);
  } catch (error) {
    console.error("❌ Email Failed:");
    console.error(error);
    throw new Error(`Email Error: ${error.message}`);
  }
};

export default sendEmail;
