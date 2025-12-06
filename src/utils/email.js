// src/utils/email.js
import nodemailer from "nodemailer";
import { config } from "../config/index.js";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com", // Explicitly set Gmail host
    port: 465, // Use Port 465 (Secure SSL) instead of 587
    secure: true, // Must be true for port 465
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
    // This helps prevent hanging connections
    connectionTimeout: 10000,
  });
};

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();

    // Verify connection before sending (Optional debugging step)
    await transporter.verify();

    const mailOptions = {
      from: config.email.from,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("Email send error:", error);
    throw new Error("Failed to send email");
  }
};

export default sendEmail;
