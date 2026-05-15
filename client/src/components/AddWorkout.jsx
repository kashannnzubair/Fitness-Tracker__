import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "./Button";
import {
  MenuItem, Select, FormControl, InputLabel, TextField,
  Switch, Tooltip, IconButton
} from "@mui/material";
import { 
  FitnessCenterRounded, HelpOutline, EmojiEvents, 
  School, VideoLibrary, CheckCircle, SportsGymnastics
} from "@mui/icons-material";

const exerciseLibrary = {
  Legs: ["Squats", "Leg Press", "Lunges", "Leg Extension", "Leg Curl", "Romanian Deadlift", "Calf Raises", "Bulgarian Split Squat", "Hack Squat", "Sumo Deadlift", "Step-Ups", "Hip Thrust"],
  Chest: ["Bench Press", "Incline Bench Press", "Decline Bench Press", "Dumbbell Fly", "Incline Dumbbell Press", "Cable Crossover", "Push-Ups", "Chest Dips", "Pec Deck Machine", "Landmine Press"],
  Back: ["Deadlift", "Pull-Ups", "Lat Pulldown", "Bent Over Row", "Seated Cable Row", "T-Bar Row", "Single Arm Dumbbell Row", "Face Pulls", "Hyperextension", "Shrugs", "Inverted Row"],
  Abs: ["Crunches", "Plank", "Leg Raises", "Russian Twists", "Bicycle Crunches", "Hanging Leg Raises", "Ab Wheel Rollout", "Mountain Climbers", "Cable Crunch", "Dead Bug", "Hollow Body Hold"],
  Arms: ["Bicep Curls", "Hammer Curls", "Preacher Curls", "Concentration Curls", "Incline Dumbbell Curl", "Tricep Dips", "Skull Crushers", "Tricep Pushdown", "Overhead Tricep Extension", "Close-Grip Bench Press"],
  Shoulders: ["Military Press", "Lateral Raises", "Front Raises", "Arnold Press", "Rear Delt Fly", "Upright Row", "Face Pulls", "Cable Lateral Raise", "Machine Shoulder Press", "Dumbbell Shoulder Press"],
  Cardio: ["Running", "Cycling", "Jump Rope", "Swimming", "Rowing Machine", "Stair Climber", "Elliptical", "Box Jumps", "Burpees", "High Knees", "Battle Ropes", "HIIT Circuit"],
};

const beginnerTips = {
  Legs: "🦵 Start with bodyweight squats. Focus on form, not weight!",
  Chest: "💪 Begin with knee push-ups if regular push-ups are too hard.",
  Back: "📈 Use resistance bands or assisted pull-up machine first.",
  Abs: "🏆 Keep lower back pressed to floor during crunches.",
  Arms: "💪 Use light dumbbells (2-5kg) to master the form.",
  Shoulders: "🎯 Lateral raises with very light weight - form is key!",
  Cardio: "🏃 Start with 10-15 mins and gradually increase duration."
};

const beginnerSetsReps = {
  Beginner: { sets: 3, reps: 8, weight: 5, duration: 10 },
  Intermediate: { sets: 4, reps: 10, weight: 15, duration: 15 },
  Advanced: { sets: 5, reps: 12, weight: 25, duration: 20 }
};

const weeklyGoals = [
  { value: "beginner", label: "🌱 Beginner", workouts: 2, desc: "Start your fitness journey", color: "#34C759" },
  { value: "casual", label: "🏃 Casual", workouts: 3, desc: "Stay active & healthy", color: "#0A84FF" },
  { value: "dedicated", label: "🔥 Dedicated", workouts: 4, desc: "Build consistency", color: "#FF9F0A" },
  { value: "intense", label: "💪 Intense", workouts: 5, desc: "Maximum results", color: "#BF5AF2" }
];

const categories = Object.keys(exerciseLibrary);

const StyledCard = styled.div`
  flex: 1; min-width: 280px; max-width: 420px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 24px;
  display: flex; flex-direction: column; gap: 16px;
  background: ${({ theme }) => theme.card};
  box-shadow: 0 4px 20px ${({ theme }) => theme.shadow};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px ${({ theme }) => theme.shadowHover};
  }
`;

const StyledCardTitle = styled.div`
  font-weight: 700; font-size: 20px;
  background: ${({ theme }) => theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex; align-items: center; justify-content: space-between;
`;

const StyledModeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.bgLight};
  padding: 4px 8px;
  border-radius: 30px;
`;

const StyledBeginnerTip = styled.div`
  background: ${({ theme }) => theme.primary + "10"};
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
  border-left: 3px solid ${({ theme }) => theme.primary};
`;

const StyledExerciseGrid = styled.div`
  display: flex; flex-wrap: wrap; gap: 8px;
  max-height: 180px; overflow-y: auto;
  padding: 8px 0;
  
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: ${({ theme }) => theme.border}; border-radius: 4px; }
  &::-webkit-scrollbar-thumb { background: ${({ theme }) => theme.primary}; border-radius: 4px; }
`;

const StyledExerciseChip = styled.div`
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1.5px solid ${({ $selected, theme }) => $selected ? theme.primary : theme.border};
  background: ${({ $selected, theme }) => $selected ? theme.primary : theme.bgLight};
  color: ${({ $selected, theme }) => $selected ? "#fff" : theme.text_primary};
    
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    transform: scale(1.02);
  }
`;

const StyledLabel = styled.div`
  font-size: 12px; font-weight: 700;
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase; letter-spacing: 0.5px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StyledNumGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  margin-top: 8px;
`;

const StyledSelectedBadge = styled.div`
  padding: 10px 14px;
  border-radius: 12px;
  background: ${({ theme }) => theme.primary + "12"};
  border: 1.5px solid ${({ theme }) => theme.primary + "40"};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledGoalSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 8px;
`;

const StyledGoalCard = styled.div`
  padding: 12px;
  border-radius: 14px;
  border: 2px solid ${({ $selected, theme }) => $selected ? theme.primary : theme.border};
  background: ${({ $selected, theme }) => $selected ? theme.primary + "10" : theme.bgLight};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  
  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.primary};
  }
  
  .goal-label {
    font-weight: 700;
    font-size: 14px;
    color: ${({ theme }) => theme.text_primary};
  }
  
  .goal-workouts {
    font-size: 11px;
    color: ${({ theme }) => theme.text_secondary};
    margin-top: 4px;
  }
`;

const AddWorkout = ({ addNewWorkout, buttonLoading }) => {
  const [category, setCategory] = useState("Legs");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [duration, setDuration] = useState("");
  const [beginnerMode, setBeginnerMode] = useState(true);
  const [weeklyGoal, setWeeklyGoal] = useState("casual");
  const [userLevel, setUserLevel] = useState("Beginner");

  useEffect(() => {
    const savedGoal = localStorage.getItem("fittrack-weekly-goal");
    if (savedGoal) setWeeklyGoal(savedGoal);
    const savedLevel = localStorage.getItem("fittrack-user-level");
    if (savedLevel) setUserLevel(savedLevel);
  }, []);

  const handleGoalChange = (goal) => {
    setWeeklyGoal(goal);
    localStorage.setItem("fittrack-weekly-goal", goal);
    
    const levelMap = { beginner: "Beginner", casual: "Intermediate", dedicated: "Advanced", intense: "Advanced" };
    const level = levelMap[goal] || "Intermediate";
    setUserLevel(level);
    localStorage.setItem("fittrack-user-level", level);
    
    if (beginnerMode) {
      const preset = beginnerSetsReps[level];
      if (preset) {
        setSets(preset.sets.toString());
        setReps(preset.reps.toString());
        setWeight(preset.weight.toString());
        setDuration(preset.duration.toString());
      }
    }
  };

  const applyBeginnerPreset = () => {
    const preset = beginnerSetsReps[userLevel];
    if (preset && selectedExercise) {
      setSets(preset.sets.toString());
      setReps(preset.reps.toString());
      setWeight(preset.weight.toString());
      setDuration(preset.duration.toString());
    }
  };

  const exercises = exerciseLibrary[category] || [];

  const handleAdd = () => {
    if (!selectedExercise) {
      alert("Please select an exercise first!");
      return;
    }
    if (!sets || !reps) {
      alert("Please fill Sets and Reps!");
      return;
    }
    const workoutString = `#${category}\n-${selectedExercise}\n-${sets} setsX${reps} reps\n-${weight || 0} kg\n-${duration || 30} min`;
    addNewWorkout(workoutString);
    setSelectedExercise("");
    setSets("");
    setReps("");
    setWeight("");
    setDuration("");
  };

  return (
    <StyledCard>
      <StyledCardTitle>
        <span><FitnessCenterRounded sx={{ fontSize: "22px", marginRight: "8px" }} />Add Workout</span>
        <StyledModeToggle>
          <School sx={{ fontSize: 16, color: beginnerMode ? "#0A84FF" : "#6C6C7A" }} />
          <Switch size="small" checked={beginnerMode} onChange={(e) => setBeginnerMode(e.target.checked)} />
          <SportsGymnastics sx={{ fontSize: 16, color: !beginnerMode ? "#0A84FF" : "#6C6C7A" }} />
        </StyledModeToggle>
      </StyledCardTitle>

      {beginnerMode && (
        <StyledBeginnerTip>
          <HelpOutline sx={{ color: "#0A84FF" }} />
          <span>💡 {beginnerTips[category] || "Start with light weight and focus on proper form!"}</span>
        </StyledBeginnerTip>
      )}

      {/* WEEKLY GOAL SELECTOR */}
      <div>
        <StyledLabel><EmojiEvents sx={{ fontSize: 14 }} /> WEEKLY GOAL</StyledLabel>
        <StyledGoalSelector>
          {weeklyGoals.map(goal => (
            <StyledGoalCard 
              key={goal.value} 
              $selected={weeklyGoal === goal.value}
              onClick={() => handleGoalChange(goal.value)}
              className="weekly-goal-card"
            >
              <div className="goal-label">{goal.label}</div>
              <div className="goal-workouts">{goal.workouts} workouts/week</div>
              <div style={{ fontSize: 10, marginTop: 4, color: goal.color }}>{goal.desc}</div>
            </StyledGoalCard>
          ))}
        </StyledGoalSelector>
      </div>

      {/* CATEGORY DROPDOWN */}
      <FormControl fullWidth size="small" variant="outlined">
        <InputLabel sx={{ color: '#6C6C7A', '&.Mui-focused': { color: '#0A84FF' } }}>
          Body Part / Category
        </InputLabel>
        <Select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSelectedExercise("");
          }}
          label="Body Part / Category"
          sx={{
            color: '#fff',
            backgroundColor: '#1C1C2A',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2C2C3A' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0A84FF' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0A84FF' },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: '#1C1C2A',
                color: '#fff',
                '& .MuiMenuItem-root': {
                  color: '#fff',
                  '&:hover': { bgcolor: '#0A84FF20' },
                  '&.Mui-selected': { bgcolor: '#0A84FF', color: '#fff' },
                },
              },
            },
          }}
        >
          {categories.map((c) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* EXERCISE SELECTION */}
      <div>
        <StyledLabel><FitnessCenterRounded sx={{ fontSize: 14 }} /> SELECT EXERCISE</StyledLabel>
        <StyledExerciseGrid>
          {exercises.map(ex => (
            <StyledExerciseChip
              key={ex}
              $selected={selectedExercise === ex}
              onClick={() => {
                setSelectedExercise(ex === selectedExercise ? "" : ex);
                if (beginnerMode && ex !== selectedExercise) {
                  applyBeginnerPreset();
                }
              }}
            >
              {ex}
            </StyledExerciseChip>
          ))}
        </StyledExerciseGrid>
      </div>

      {selectedExercise && (
        <StyledSelectedBadge>
          ✅ Selected: {selectedExercise}
          <Tooltip title="Watch tutorial on YouTube">
            <IconButton size="small" onClick={() => window.open(`https://www.youtube.com/results?search_query=${selectedExercise}+exercise+tutorial`, '_blank')}>
              <VideoLibrary sx={{ fontSize: 18, color: "#0A84FF" }} />
            </IconButton>
          </Tooltip>
        </StyledSelectedBadge>
      )}

      {/* DETAILS */}
      <div>
        <StyledLabel>📝 DETAILS</StyledLabel>
        <StyledNumGrid>
          <TextField
            label="Sets" type="number" size="small"
            value={sets} onChange={e => setSets(e.target.value)}
            sx={{
              input: { color: '#fff' },
              label: { color: '#6C6C7A' },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1C1C2A',
                '& fieldset': { borderColor: '#2C2C3A' },
                '&:hover fieldset': { borderColor: '#0A84FF' },
                '&.Mui-focused fieldset': { borderColor: '#0A84FF' }
              }
            }}
          />
          <TextField
            label="Reps" type="number" size="small"
            value={reps} onChange={e => setReps(e.target.value)}
            sx={{
              input: { color: '#fff' },
              label: { color: '#6C6C7A' },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1C1C2A',
                '& fieldset': { borderColor: '#2C2C3A' },
                '&:hover fieldset': { borderColor: '#0A84FF' },
                '&.Mui-focused fieldset': { borderColor: '#0A84FF' }
              }
            }}
          />
          <TextField
            label="Weight (kg)" type="number" size="small"
            value={weight} onChange={e => setWeight(e.target.value)}
            sx={{
              input: { color: '#fff' },
              label: { color: '#6C6C7A' },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1C1C2A',
                '& fieldset': { borderColor: '#2C2C3A' },
                '&:hover fieldset': { borderColor: '#0A84FF' },
                '&.Mui-focused fieldset': { borderColor: '#0A84FF' }
              }
            }}
          />
          <TextField
            label="Duration (min)" type="number" size="small"
            value={duration} onChange={e => setDuration(e.target.value)}
            sx={{
              input: { color: '#fff' },
              label: { color: '#6C6C7A' },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1C1C2A',
                '& fieldset': { borderColor: '#2C2C3A' },
                '&:hover fieldset': { borderColor: '#0A84FF' },
                '&.Mui-focused fieldset': { borderColor: '#0A84FF' }
              }
            }}
          />
        </StyledNumGrid>
      </div>

      <Button
        text={beginnerMode ? "✨ ADD WORKOUT (Recommended)" : "➕ ADD WORKOUT"}
        onClick={handleAdd}
        isLoading={buttonLoading}
        isDisabled={buttonLoading || !selectedExercise || !sets || !reps}
        full
      />

      {beginnerMode && selectedExercise && (
        <div style={{ fontSize: "11px", color: "#6C6C7A", textAlign: "center", marginTop: "8px" }}>
          <CheckCircle sx={{ fontSize: 12, verticalAlign: "middle", color: "#34C759" }} />
          {" "}Beginner-friendly values pre-filled for {userLevel} level
        </div>
      )}
    </StyledCard>
  );
};

export default AddWorkout;