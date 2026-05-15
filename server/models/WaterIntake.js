import mongoose from "mongoose";

const WaterIntakeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    glasses: { type: Number, default: 0, min: 0, max: 20 },
    totalMl: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("WaterIntake", WaterIntakeSchema);