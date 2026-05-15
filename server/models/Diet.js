import mongoose from "mongoose";

const DietSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  meals: {
    breakfast: [{ name: String, calories: Number, protein: Number, carbs: Number, fat: Number }],
    lunch: [{ name: String, calories: Number, protein: Number, carbs: Number, fat: Number }],
    dinner: [{ name: String, calories: Number, protein: Number, carbs: Number, fat: Number }],
    snacks: [{ name: String, calories: Number, protein: Number, carbs: Number, fat: Number }]
  },
  totalCalories: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalFat: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Diet", DietSchema);