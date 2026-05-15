import Diet from "../models/Diet.js";
import Progress from "../models/Progress.js";
import WeeklyPlan from "../models/WeeklyPlan.js";
import WaterIntake from "../models/WaterIntake.js";
import Workout from "../models/Workout.js";
import Feedback from "../models/Feedback.js";
import Reminder from "../models/Reminder.js";
import { createError } from "../error.js";

// ============ DIET CONTROLLERS ============
export const saveDiet = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { date, meals, totalCalories, totalProtein, totalCarbs, totalFat } = req.body;
    
    const diet = await Diet.findOneAndUpdate(
      { user: userId, date: new Date(date) },
      { meals, totalCalories, totalProtein, totalCarbs, totalFat },
      { upsert: true, new: true }
    );
    
    return res.status(200).json({ success: true, diet });
  } catch (error) {
    return next(error);
  }
};

export const getDiet = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { date } = req.query;
    const query = { user: userId };
    if (date) query.date = new Date(date);
    
    const diet = await Diet.findOne(query).sort({ date: -1 });
    return res.status(200).json({ success: true, diet });
  } catch (error) {
    return next(error);
  }
};

// ============ PROGRESS CONTROLLERS ============
export const saveProgress = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { date, weight, chest, waist, arms, thighs, benchPress, squat, deadlift } = req.body;
    
    const progress = await Progress.findOneAndUpdate(
      { user: userId, date: new Date(date) },
      { weight, chest, waist, arms, thighs, benchPress, squat, deadlift },
      { upsert: true, new: true }
    );
    
    return res.status(200).json({ success: true, progress });
  } catch (error) {
    return next(error);
  }
};

export const getProgress = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const progress = await Progress.find({ user: userId }).sort({ date: 1 });
    return res.status(200).json({ success: true, progress });
  } catch (error) {
    return next(error);
  }
};

// ============ WATER INTAKE CONTROLLERS ============
export const saveWaterIntake = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { date, glasses, totalMl } = req.body;
    
    const water = await WaterIntake.findOneAndUpdate(
      { user: userId, date: new Date(date) },
      { glasses, totalMl },
      { upsert: true, new: true }
    );
    
    return res.status(200).json({ success: true, water });
  } catch (error) {
    return next(error);
  }
};

export const getWaterIntake = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { date } = req.query;
    const water = await WaterIntake.findOne({ user: userId, date: new Date(date) });
    return res.status(200).json({ success: true, water });
  } catch (error) {
    return next(error);
  }
};

// ============ WORKOUT CONTROLLERS ============
export const getAllWorkouts = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const workouts = await Workout.find({ user: userId }).sort({ date: -1 });
    return res.status(200).json({ success: true, workouts });
  } catch (error) {
    return next(error);
  }
};

export const deleteWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const workout = await Workout.findOneAndDelete({ _id: id, user: userId });
    if (!workout) return next(createError(404, "Workout not found"));
    return res.status(200).json({ success: true, message: "Workout deleted" });
  } catch (error) {
    return next(error);
  }
};

export const updateWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { workoutName, category, sets, reps, weight, duration } = req.body;
    
    const workout = await Workout.findOne({ _id: id, user: userId });
    if (!workout) return next(createError(404, "Workout not found"));
    
    const caloriesBurned = (duration || workout.duration) * 5;
    
    const updatedWorkout = await Workout.findByIdAndUpdate(
      id,
      { workoutName, category, sets, reps, weight, duration, caloriesBurned },
      { new: true }
    );
    
    return res.status(200).json({ success: true, workout: updatedWorkout });
  } catch (error) {
    return next(error);
  }
};

// ============ WEEKLY PLAN CONTROLLERS ============
export const saveWeeklyPlan = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { weekStart, plan } = req.body;
    
    const weeklyPlan = await WeeklyPlan.findOneAndUpdate(
      { user: userId, weekStart: weekStart },
      { plan },
      { upsert: true, new: true }
    );
    
    return res.status(200).json({ success: true, weeklyPlan });
  } catch (error) {
    return next(error);
  }
};

export const getWeeklyPlan = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { weekStart } = req.query;
    const weeklyPlan = await WeeklyPlan.findOne({ user: userId, weekStart: weekStart });
    return res.status(200).json({ success: true, weeklyPlan });
  } catch (error) {
    return next(error);
  }
};

// ============ FEEDBACK CONTROLLERS ============
export const saveFeedback = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { type, name, email, subject, message } = req.body;
    
    console.log("📝 Saving feedback for user:", userId);
    
    const feedback = new Feedback({
      user: userId,
      type: type || "General Support",
      name: name,
      email: email,
      subject: subject || "",
      message: message,
      status: "pending"
    });
    
    await feedback.save();
    console.log("✅ Feedback saved successfully!");
    
    return res.status(200).json({ success: true, message: "Feedback submitted successfully!" });
  } catch (error) {
    console.error("❌ Error saving feedback:", error);
    return next(error);
  }
};

export const getFeedbacks = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const feedbacks = await Feedback.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    return next(error);
  }
};

// ============ REMINDER CONTROLLERS ============
export const saveReminder = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { title, type, time, days, active } = req.body;
    
    console.log("📝 Saving reminder for user:", userId);
    console.log("Reminder data:", { title, type, time, days });
    
    const reminder = new Reminder({
      user: userId,
      title,
      type: type || "general",
      time,
      days: days || [],
      active: active !== undefined ? active : true
    });
    
    await reminder.save();
    console.log("✅ Reminder saved successfully!");
    
    return res.status(200).json({ success: true, message: "Reminder saved successfully!", reminder });
  } catch (error) {
    console.error("❌ Error saving reminder:", error);
    return next(error);
  }
};

export const getReminders = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const reminders = await Reminder.find({ user: userId, active: true }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, reminders });
  } catch (error) {
    return next(error);
  }
};

export const deleteReminder = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    const reminder = await Reminder.findOneAndDelete({ _id: id, user: userId });
    if (!reminder) {
      return next(createError(404, "Reminder not found"));
    }
    
    return res.status(200).json({ success: true, message: "Reminder deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

export const updateReminder = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { active } = req.body;
    
    const reminder = await Reminder.findOneAndUpdate(
      { _id: id, user: userId },
      { active },
      { new: true }
    );
    
    if (!reminder) {
      return next(createError(404, "Reminder not found"));
    }
    
    return res.status(200).json({ success: true, message: "Reminder updated successfully", reminder });
  } catch (error) {
    return next(error);
  }
};