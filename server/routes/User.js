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
    changePassword
} from "../controllers/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Auth Routes
router.post("/signup", UserRegister);
router.post("/signin", UserLogin);

// Forgot Password Routes (NEW)
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp/:email", verifyOTP);
router.post("/change-password/:email", changePassword);

// Protected Routes
router.get("/dashboard", verifyToken, getUserDashboard);
router.get("/workout", verifyToken, getWorkoutsByDate);
router.post("/workout", verifyToken, addWorkout);
router.patch("/profile", verifyToken, updateUserProfile);

export default router;