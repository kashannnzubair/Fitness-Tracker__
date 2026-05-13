import {
  FitnessCenterRounded,
  LocalFireDepartmentRounded,
  TimelineRounded,
} from "@mui/icons-material";

export const exerciseList = {
  Legs: ["Squats", "Leg Press", "Lunges", "Calf Raises"],
  Chest: ["Bench Press", "Incline Press", "Chest Fly", "Push Ups"],
  Back: ["Deadlifts", "Pull Ups", "Lat Pulldowns", "Bent Over Rows"],
  Abs: ["Crunches", "Plank", "Leg Raises", "Russian Twists"],
  Arms: ["Bicep Curls", "Tricep Dips", "Hammer Curls", "Skull Crushers"],
  Shoulders: ["Military Press", "Lateral Raises", "Front Raises"],
  Cardio: ["Running", "Cycling", "Swimming", "Jump Rope"],
};

export const counts = [
  {
    name: "Calories Burned",
    icon: <LocalFireDepartmentRounded sx={{ color: "inherit", fontSize: "26px" }} />,
    desc: "Total calories burned today",
    key: "totalCaloriesBurnt",
    unit: "kcal",
    color: "#eb9e34",
    lightColor: "#FDF4EA",
  },
  {
    name: "Workouts",
    icon: <FitnessCenterRounded sx={{ color: "inherit", fontSize: "26px" }} />,
    desc: "Total no of workouts for today",
    key: "totalWorkouts",
    unit: "",
    color: "#41C1A6",
    lightColor: "#E8F6F3",
  },
  {
    name: "Average Calories",
    icon: <TimelineRounded sx={{ color: "inherit", fontSize: "26px" }} />,
    desc: "Average Calories Burned per workout",
    key: "avgCaloriesBurnt", // Controller ke key se match kar diya
    unit: "kcal",
    color: "#FF9AD5",
    lightColor: "#FEF3F9",
  },
];