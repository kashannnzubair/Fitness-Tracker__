import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Workout from "../models/Workout.js";

dotenv.config();

export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) return next(createError(409, "Email is already in use."));

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({ name, email, password: hashedPassword, img });
    const createdUser = await user.save();
    
    const secret = process.env.JWT_SECRET || "trackerbyfitness";
    const token = jwt.sign({ id: createdUser._id }, secret, { expiresIn: "9999 years" });
    
    return res.status(200).json({ token, user });
  } catch (error) { return next(error); }
};

export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(createError(404, "User not found"));

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) return next(createError(403, "Incorrect password"));

    const secret = process.env.JWT_SECRET || "trackerbyfitness";
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "9999 years" });

    return res.status(200).json({ token, user });
  } catch (error) { return next(error); }
};

export const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) return next(createError(404, "User not found"));

    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    const endToday = new Date();
    endToday.setHours(23, 59, 59, 999);

    // Today's calories
    const totalCaloriesBurnt = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lte: endToday } } },
      { $group: { _id: null, total: { $sum: "$caloriesBurned" } } },
    ]);

    const totalWorkouts = await Workout.countDocuments({
      user: userId, date: { $gte: startToday, $lte: endToday }
    });

    const calories = totalCaloriesBurnt[0]?.total || 0;

    // Last 7 days weekly data
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d);
    }

    const weeklyData = await Promise.all(
      last7Days.map(async (day) => {
        const start = new Date(day); start.setHours(0, 0, 0, 0);
        const end   = new Date(day); end.setHours(23, 59, 59, 999);
        const result = await Workout.aggregate([
          { $match: { user: user._id, date: { $gte: start, $lte: end } } },
          { $group: { _id: null, total: { $sum: "$caloriesBurned" } } },
        ]);
        return {
          week: `${day.getMonth() + 1}/${day.getDate()}`,
          calories: result[0]?.total || 0,
        };
      })
    );

    // Pie chart — calories by category
    const categoryData = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lte: endToday } } },
      { $group: { _id: "$category", total: { $sum: "$caloriesBurned" } } },
    ]);

    const pieChartData = categoryData.map((c, i) => ({
      id: i,
      value: c.total,
      label: c._id,
    }));

    return res.status(200).json({
      totalCaloriesBurnt: calories,
      totalWorkouts,
      avgCaloriesBurntPerWorkout: totalWorkouts > 0 ? calories / totalWorkouts : 0,
      totalWeeksCaloriesBurnt: {
        weeks: weeklyData.map(d => d.week),
        caloriesBurned: weeklyData.map(d => d.calories),
      },
      pieChartData,
    });
  } catch (err) {
    next(err);
  }
};

export const getWorkoutsByDate = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    let date = req.query.date ? new Date(req.query.date) : new Date();
    const startOfDay = new Date(date.setHours(0,0,0,0));
    const endOfDay = new Date(date.setHours(23,59,59,999));

    const todaysWorkouts = await Workout.find({ user: userId, date: { $gte: startOfDay, $lt: endOfDay } });
    return res.status(200).json({ todaysWorkouts, totalCaloriesBurnt: 0 }); // Added default total
  } catch (err) { next(err); }
};

export const addWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { workoutString } = req.body;
    if (!workoutString) return next(createError(400, "Workout string is missing"));

    // Split into lines and clean up
    const lines = workoutString.split("\n").map(l => l.trim()).filter(Boolean);

    // Line 0: #Category
    // Line 1: -WorkoutName
    // Line 2: -Sets setsXReps reps
    // Line 3: -Weight kg
    // Line 4: -Duration min

    if (lines.length < 5) {
      return next(createError(400, "Please follow the workout format"));
    }

    const category = lines[0].replace("#", "").trim();
    const workoutName = lines[1].replace("-", "").trim();

    // Parse "5 setsX15 reps" or "5 setsX15 reps"
    const setsReps = lines[2].replace("-", "").trim();
    const setsMatch = setsReps.match(/(\d+)\s*sets?\s*[xX]\s*(\d+)\s*reps?/i);
    const sets = setsMatch ? parseInt(setsMatch[1]) : 0;
    const reps = setsMatch ? parseInt(setsMatch[2]) : 0;

    // Parse "30 kg"
    const weightMatch = lines[3].match(/(\d+)/);
    const weight = weightMatch ? parseInt(weightMatch[1]) : 0;

    // Parse "10 min"
    const durationMatch = lines[4].match(/(\d+)/);
    const duration = durationMatch ? parseInt(durationMatch[1]) : 0;

    const caloriesBurned = duration * 5; // simple estimate

    const newWorkout = new Workout({
      user: userId,
      category,
      workoutName,
      sets,
      reps,
      weight,
      duration,
      caloriesBurned,
      date: new Date(),
    });

    await newWorkout.save();
    return res.status(201).json({ message: "Workout added successfully", workout: newWorkout });
  } catch (err) {
    next(err);
  }
};