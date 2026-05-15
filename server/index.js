import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

console.log("JWT Check:", process.env.JWT_SECRET ? "Loaded ✅" : "Missing ❌");

app.use("/api/user/", UserRoutes);

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  console.error("❌ Server Error:", err);
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI is missing in .env file!");
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to Mongo DB Successfully");
  } catch (err) {
    console.error("❌ Failed to connect with mongo:", err.message);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
  } catch (error) {
    console.log("Server Start Error:", error);
  }
};

startServer();