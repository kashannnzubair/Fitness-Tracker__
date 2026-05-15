import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    img: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female", "other"], default: "other" },
    height: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    weeklyGoal: { type: Number, default: 4 },
    fitnessGoal: { type: String, default: "maintain" },
    
    // OTP Fields (for signup verification)
    signupOTP: { type: String, default: null },
    signupOTPExpiry: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    
    // OTP Fields (for forgot password)
    resetOTP: { type: String, default: null },
    resetOTPExpiry: { type: Date, default: null },
    isOTPVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);