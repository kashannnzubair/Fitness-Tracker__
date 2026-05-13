import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email, otp, name) => {
  const mailOptions = {
    from: `"FitTrack" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔐 Password Reset OTP - FitTrack",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Password Reset OTP</title>
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #0d0d0d;">
        <div style="max-width: 500px; margin: 40px auto; background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 20px; padding: 30px; text-align: center;">
          <h1 style="color: #0A84FF; margin-bottom: 20px;">💪 FitTrack</h1>
          <div style="background: #14141F; border-radius: 16px; padding: 25px;">
            <h2 style="color: #fff;">Password Reset Request</h2>
            <p style="color: #aaa;">Hello ${name || "User"},</p>
            <p style="color: #aaa;">Your OTP for password reset is:</p>
            <div style="margin: 25px 0;">
              <span style="font-size: 36px; font-weight: 800; background: #0A84FF; color: white; padding: 12px 30px; border-radius: 12px; letter-spacing: 5px;">${otp}</span>
            </div>
            <p style="color: #aaa;">This OTP is valid for <strong style="color: #0A84FF;">10 minutes</strong>.</p>
          </div>
          <p style="color: #555; font-size: 11px; margin-top: 20px;">© 2024 FitTrack - Your Fitness Companion</p>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Email send error:", error);
    return false;
  }
};