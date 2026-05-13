import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    img: { type: String, default: null },
    password: { type: String, required: true },
    // Advanced Profile Fields
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Male" },
    weight: { type: Number, default: 0 }, // In kg
    height: { type: Number, default: 0 }, // In cm (NEW)
    age: { type: Number, default: 0 },
    weeklyGoal: { type: Number, default: 4 }, // Number of workouts per week
    fitnessGoal: { type: String, enum: ["weight_loss", "muscle_gain", "maintain", "flexibility"], default: "maintain" }, // NEW
    
    // Forgot Password fields (NEW)
    resetOTP: { type: String, default: null },
    resetOTPExpiry: { type: Date, default: null },
    isOTPVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);