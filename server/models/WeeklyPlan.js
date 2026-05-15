import mongoose from "mongoose";

const WeeklyPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  weekStart: { type: String, required: true },
  plan: {
    Monday: { type: Array, default: [] },
    Tuesday: { type: Array, default: [] },
    Wednesday: { type: Array, default: [] },
    Thursday: { type: Array, default: [] },
    Friday: { type: Array, default: [] },
    Saturday: { type: Array, default: [] },
    Sunday: { type: Array, default: [] }
  }
}, { timestamps: true });

export default mongoose.model("WeeklyPlan", WeeklyPlanSchema);