import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Workout from "../models/Workout.js";
import { sendOTPEmail } from "../utils/sendEmail.js";

dotenv.config();

// --- AUTHENTICATION ---

export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img, height, weight, fitnessGoal } = req.body;
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) return next(createError(409, "Email is already in use."));

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      img,
      height: height || 0,
      weight: weight || 0,
      fitnessGoal: fitnessGoal || "maintain"
    });
    const createdUser = await user.save();
    
    const secret = process.env.JWT_SECRET || "trackerbyfitness";
    const token = jwt.sign({ id: createdUser._id }, secret, { expiresIn: "9999 years" });
    
    return res.status(200).json({ token, user: createdUser });
  } catch (error) { 
    return next(error); 
  }
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
  } catch (error) { 
    return next(error); 
  }
};

// --- FORGOT PASSWORD (NEW) ---

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return next(createError(400, "Email is required"));
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(404, "User not found with this email"));
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    user.resetOTP = otp;
    user.resetOTPExpiry = otpExpiry;
    await user.save();
    
    // Log OTP to console for testing
    console.log(`🔐 OTP for ${email}: ${otp}`);
    
    return res.status(200).json({ 
      success: true, 
      message: `OTP sent to your email. For testing, use: ${otp}`,
      otp: otp // Remove in production
    });
    
  } catch (error) {
    return next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { email } = req.params;
    const { otp } = req.body;
    
    if (!otp) {
      return next(createError(400, "OTP is required"));
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    
    if (!user.resetOTP || user.resetOTP !== otp) {
      return next(createError(400, "Invalid OTP"));
    }
    
    if (user.resetOTPExpiry < new Date()) {
      return next(createError(400, "OTP has expired. Please request a new one."));
    }
    
    user.isOTPVerified = true;
    await user.save();
    
    return res.status(200).json({ 
      success: true, 
      message: "OTP verified successfully" 
    });
    
  } catch (error) {
    return next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { email } = req.params;
    const { newPassword, confirmPassword } = req.body;
    
    if (!newPassword || !confirmPassword) {
      return next(createError(400, "All fields are required"));
    }
    
    if (newPassword !== confirmPassword) {
      return next(createError(400, "Passwords do not match"));
    }
    
    if (newPassword.length < 6) {
      return next(createError(400, "Password must be at least 6 characters"));
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    
    // Hash new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);
    
    user.password = hashedPassword;
    user.resetOTP = null;
    user.resetOTPExpiry = null;
    user.isOTPVerified = false;
    await user.save();
    
    return res.status(200).json({ 
      success: true, 
      message: "Password changed successfully" 
    });
    
  } catch (error) {
    return next(error);
  }
};

// --- PROFILE & DASHBOARD ---

export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { gender, weight, height, weeklyGoal, fitnessGoal, name, img } = req.body;
    
    const updateData = {};
    if (gender !== undefined) updateData.gender = gender;
    if (weight !== undefined) updateData.weight = weight;
    if (height !== undefined) updateData.height = height;
    if (weeklyGoal !== undefined) updateData.weeklyGoal = weeklyGoal;
    if (fitnessGoal !== undefined) updateData.fitnessGoal = fitnessGoal;
    if (name !== undefined) updateData.name = name;
    if (img !== undefined) updateData.img = img;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { $set: updateData }, 
      { new: true }
    );
    return res.status(200).json({ user: updatedUser }); 
  } catch (error) { 
    next(error); 
  }
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

    // 1. Today's Stats
    const totalCaloriesBurnt = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lte: endToday } } },
      { $group: { _id: null, total: { $sum: "$caloriesBurned" } } },
    ]);

    const totalWorkouts = await Workout.countDocuments({
      user: userId, date: { $gte: startToday, $lte: endToday }
    });

    // 2. Average Calories Calculation
    const avgStats = await Workout.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: null, avg: { $avg: "$caloriesBurned" } } }
    ]);

    // 3. Weekly Graph Data (Last 7 Days)
    const startOf7Days = new Date();
    startOf7Days.setDate(startOf7Days.getDate() - 6);
    startOf7Days.setHours(0,0,0,0);

    const weeklyData = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startOf7Days } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          calories: { $sum: "$caloriesBurned" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 4. Pie Chart Data
    const categoryData = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lte: endToday } } },
      { $group: { _id: "$category", total: { $sum: "$caloriesBurned" } } },
    ]);

    return res.status(200).json({
      totalCaloriesBurnt: totalCaloriesBurnt[0]?.total || 0,
      totalWorkouts,
      avgCaloriesBurnt: avgStats[0]?.avg || 0,
      weeklyGoal: user.weeklyGoal || 4,
      weeklyCompleted: weeklyData.length,
      weeklyStats: weeklyData,
      user: { name: user.name, gender: user.gender, weight: user.weight, height: user.height, fitnessGoal: user.fitnessGoal },
      pieChartData: categoryData.map((c, i) => ({ id: i, value: c.total, label: c._id })),
    });
  } catch (err) { 
    next(err); 
  }
};

// --- WORKOUT MANAGEMENT ---

export const getWorkoutsByDate = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    let date = req.query.date ? new Date(req.query.date) : new Date();
    const startOfDay = new Date(date.setHours(0,0,0,0));
    const endOfDay = new Date(date.setHours(23,59,59,999));

    const todaysWorkouts = await Workout.find({ 
      user: userId, 
      date: { $gte: startOfDay, $lte: endOfDay } 
    });
    
    return res.status(200).json({ todaysWorkouts });
  } catch (err) { 
    next(err); 
  }
};

export const addWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { workoutString } = req.body;
    if (!workoutString) return next(createError(400, "Workout string is missing"));

    const lines = workoutString.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length < 5) return next(createError(400, "Please follow the workout format correctly."));

    const category = lines[0].replace("#", "").trim();
    const workoutName = lines[1].replace("-", "").trim();
    
    const setsReps = lines[2].match(/(\d+)/g);
    const sets = setsReps ? parseInt(setsReps[0]) : 0;
    const reps = setsReps && setsReps[1] ? parseInt(setsReps[1]) : 0;

    const weight = (lines[3].match(/(\d+)/)) ? parseInt(lines[3].match(/(\d+)/)[0]) : 0;
    const duration = (lines[4].match(/(\d+)/)) ? parseInt(lines[4].match(/(\d+)/)[0]) : 0;

    const caloriesBurned = duration * 5;

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
    return res.status(201).json({ message: "Workout added successfully!", workout: newWorkout });
  } catch (err) { 
    next(err); 
  }
};