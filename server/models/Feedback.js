import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, default: "General Support" },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  status: { type: String, default: "pending" }
}, { timestamps: true });

export default mongoose.model("Feedback", FeedbackSchema);