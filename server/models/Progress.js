import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  weight: { type: Number, default: 0 },
  chest: { type: Number, default: 0 },
  waist: { type: Number, default: 0 },
  arms: { type: Number, default: 0 },
  thighs: { type: Number, default: 0 },
  benchPress: { type: Number, default: 0 },
  squat: { type: Number, default: 0 },
  deadlift: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Progress", ProgressSchema);