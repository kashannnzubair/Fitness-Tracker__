import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("fittrack-app-token"); // ✅ consistent key
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const UserRegister = (data) => API.post("/api/user/signup", data);
export const UserLogin    = (data) => API.post("/api/user/signin", data);
export const UserSignIn   = (data) => API.post("/api/user/signin", data);
export const UserSignUp   = (data) => API.post("/api/user/signup", data);

export const getDashboard        = ()     => API.get("/api/user/dashboard");
export const getDashboardDetails = ()     => API.get("/api/user/dashboard");
export const getWorkouts         = (date) => API.get("/api/user/workout", { params: { date } });
export const addWorkout          = (data) => API.post("/api/user/workout", data);