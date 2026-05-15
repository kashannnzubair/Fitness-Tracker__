import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",  // ✅ Confirm your backend port
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("fittrack-app-token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ============ AUTH APIs ============
export const UserLogin = (data) => API.post("/user/signin", data);
export const UserRegister = (data) => API.post("/user/signup", data);
export const updateUserProfile = (data) => API.patch("/user/profile", data);

// ============ WORKOUT APIs ============
export const getDashboardDetails = () => API.get("/user/dashboard");
export const getWorkouts = (date) => API.get(`/user/workout${date ? `?date=${date}` : ""}`);
export const getAllWorkouts = () => API.get("/user/workouts/all");
export const addWorkout = (data) => API.post("/user/workout", data);
export const updateWorkout = (id, data) => API.patch(`/user/workout/${id}`, data);
export const deleteWorkout = (id) => API.delete(`/user/workout/${id}`);

// ============ DIET APIs ============
export const saveDiet = (data) => API.post("/user/diet/save", data);
export const getDiet = (date) => API.get(`/user/diet/get${date ? `?date=${date}` : ""}`);

// ============ WATER INTAKE APIs ============
export const saveWaterIntake = (data) => API.post("/user/water/save", data);
export const getWaterIntake = (date) => API.get(`/user/water/get${date ? `?date=${date}` : ""}`);

// ============ PROGRESS APIs ============
export const saveProgress = (data) => API.post("/user/progress/save", data);
export const getProgress = () => API.get("/user/progress/get");

// ============ FEEDBACK APIs ============
export const saveFeedback = (data) => API.post("/user/feedback/save", data);
export const getFeedbacks = () => API.get("/user/feedback/get");

// ============ WEEKLY PLAN APIs ============
export const saveWeeklyPlan = (data) => API.post("/user/weekly-plan/save", data);
export const getWeeklyPlan = (weekStart) => API.get(`/user/weekly-plan/get${weekStart ? `?weekStart=${weekStart}` : ""}`);

// ============ REMINDER APIs ============
export const saveReminder = (data) => API.post("/user/reminder/save", data);
export const getReminders = () => API.get("/user/reminder/get");
export const deleteReminder = (id) => API.delete(`/user/reminder/${id}`);
export const updateReminder = (id, data) => API.patch(`/user/reminder/${id}`, data);