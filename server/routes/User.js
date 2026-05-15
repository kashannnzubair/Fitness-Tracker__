import express from "express";
import { 
    UserRegister, 
    UserLogin, 
    getUserDashboard, 
    getWorkoutsByDate, 
    addWorkout, 
    updateUserProfile,
    forgotPassword,
    verifyOTP,
    changePassword,
    getAllWorkouts,
    deleteWorkout,
    updateWorkout
} from "../controllers/User.js";
import { 
    saveDiet, getDiet, 
    saveProgress, getProgress, 
    saveWaterIntake, getWaterIntake,
    saveWeeklyPlan, getWeeklyPlan,
    saveFeedback, getFeedbacks,
    saveReminder, getReminders, deleteReminder, updateReminder
} from "../controllers/UserData.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ============ AUTH ROUTES ============
router.post("/signup", UserRegister);
router.post("/signin", UserLogin);

// Password Reset Routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp/:email", verifyOTP);
router.post("/change-password/:email", changePassword);

// ============ WORKOUT ROUTES ============
router.get("/dashboard", verifyToken, getUserDashboard);
router.get("/workout", verifyToken, getWorkoutsByDate);
router.get("/workouts/all", verifyToken, getAllWorkouts);
router.post("/workout", verifyToken, addWorkout);
router.patch("/workout/:id", verifyToken, updateWorkout);
router.delete("/workout/:id", verifyToken, deleteWorkout);
router.patch("/profile", verifyToken, updateUserProfile);

// Diet Routes
router.post("/diet/save", verifyToken, saveDiet);
router.get("/diet/get", verifyToken, getDiet);

// Progress Routes
router.post("/progress/save", verifyToken, saveProgress);
router.get("/progress/get", verifyToken, getProgress);

// Water Intake Routes
router.post("/water/save", verifyToken, saveWaterIntake);
router.get("/water/get", verifyToken, getWaterIntake);

// Weekly Plan Routes
router.post("/weekly-plan/save", verifyToken, saveWeeklyPlan);
router.get("/weekly-plan/get", verifyToken, getWeeklyPlan);

// Feedback Routes
router.post("/feedback/save", verifyToken, saveFeedback);
router.get("/feedback/get", verifyToken, getFeedbacks);

// Reminder Routes
router.post("/reminder/save", verifyToken, saveReminder);
router.get("/reminder/get", verifyToken, getReminders);
router.delete("/reminder/:id", verifyToken, deleteReminder);
router.patch("/reminder/:id", verifyToken, updateReminder);

export default router;