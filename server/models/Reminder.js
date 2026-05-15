import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ["workout", "meal", "water", "general"], default: "general" },
  time: { type: String, required: true },
  days: [{ type: String }],
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Reminder", ReminderSchema);