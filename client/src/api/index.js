import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("fittrack-app-token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const UserLogin    = (data) => API.post("/user/signin", data);
export const UserSignIn   = (data) => API.post("/user/signin", data);
export const UserRegister = (data) => API.post("/user/signup", data);
export const UserSignUp   = (data) => API.post("/user/signup", data);

export const updateUserProfile  = (data) => API.patch("/user/profile", data);
export const getDashboardDetails = ()     => API.get("/user/dashboard");
export const getWorkouts         = (date) => API.get(`/user/workout${date ? `?date=${date}` : ""}`);
export const addWorkout          = (data) => API.post("/user/workout", data);