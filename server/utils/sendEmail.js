import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Signup OTP
export const sendSignupOTP = async (email, otp, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; color: #fff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #66bb6a; margin: 0;">💪 FitTrack</h1>
        <p style="color: #888; margin: 5px 0 0;">Your Fitness Journey Starts Here</p>
      </div>
      
      <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; text-align: center;">
        <h2 style="margin: 0 0 10px 0;">Welcome ${name || "Fitness Enthusiast"}! 👋</h2>
        <p style="color: #ccc; margin-bottom: 25px;">Use the OTP below to verify your email address:</p>
        
        <div style="font-size: 42px; font-weight: 800; letter-spacing: 8px; background: linear-gradient(135deg, #66bb6a, #4caf50); padding: 15px 25px; border-radius: 12px; display: inline-block; font-family: monospace;">
          ${otp}
        </div>
        
        <p style="margin-top: 25px; font-size: 14px; color: #888;">⏰ This OTP is valid for <strong style="color: #66bb6a;">10 minutes</strong></p>
        <p style="margin-top: 15px; font-size: 12px; color: #666;">If you didn't request this, please ignore this email.</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #555;">
        <p>© 2026 FitTrack — Track Every Rep. Own Every Day.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"FitTrack" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Verify Your Email - FitTrack OTP",
      html,
    });
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
};

// Send Forgot Password OTP
export const sendOTPEmail = async (email, otp, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; color: #fff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #42a5f5; margin: 0;">💪 FitTrack</h1>
        <p style="color: #888;">Password Reset Request</p>
      </div>
      
      <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; text-align: center;">
        <p style="color: #ccc;">Hi ${name || "User"},</p>
        <p>Your OTP for password reset is:</p>
        
        <div style="font-size: 42px; font-weight: 800; letter-spacing: 8px; background: rgba(66,165,245,0.2); padding: 15px 25px; border-radius: 12px; display: inline-block; font-family: monospace;">
          ${otp}
        </div>
        
        <p style="margin-top: 25px; font-size: 14px; color: #888;">⏰ Valid for <strong style="color: #42a5f5;">10 minutes</strong></p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #555;">
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"FitTrack" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Password Reset OTP - FitTrack",
      html,
    });
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
};