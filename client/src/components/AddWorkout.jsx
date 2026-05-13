import React, { useState } from "react";
import styled from "styled-components";
import Button from "./Button";
import {
  MenuItem, Select, FormControl, InputLabel, TextField
} from "@mui/material";
import { FitnessCenterRounded } from "@mui/icons-material";

const exerciseLibrary = {
  Legs: ["Squats", "Leg Press", "Lunges", "Leg Extension", "Leg Curl", "Romanian Deadlift", "Calf Raises", "Bulgarian Split Squat", "Hack Squat", "Sumo Deadlift", "Step-Ups", "Hip Thrust"],
  Chest: ["Bench Press", "Incline Bench Press", "Decline Bench Press", "Dumbbell Fly", "Incline Dumbbell Press", "Cable Crossover", "Push-Ups", "Chest Dips", "Pec Deck Machine", "Landmine Press"],
  Back: ["Deadlift", "Pull-Ups", "Lat Pulldown", "Bent Over Row", "Seated Cable Row", "T-Bar Row", "Single Arm Dumbbell Row", "Face Pulls", "Hyperextension", "Shrugs", "Inverted Row"],
  Abs: ["Crunches", "Plank", "Leg Raises", "Russian Twists", "Bicycle Crunches", "Hanging Leg Raises", "Ab Wheel Rollout", "Mountain Climbers", "Cable Crunch", "Dead Bug", "Hollow Body Hold"],
  Arms: ["Bicep Curls", "Hammer Curls", "Preacher Curls", "Concentration Curls", "Incline Dumbbell Curl", "Tricep Dips", "Skull Crushers", "Tricep Pushdown", "Overhead Tricep Extension", "Close-Grip Bench Press"],
  Shoulders: ["Military Press", "Lateral Raises", "Front Raises", "Arnold Press", "Rear Delt Fly", "Upright Row", "Face Pulls", "Cable Lateral Raise", "Machine Shoulder Press", "Dumbbell Shoulder Press"],
  Cardio: ["Running", "Cycling", "Jump Rope", "Swimming", "Rowing Machine", "Stair Climber", "Elliptical", "Box Jumps", "Burpees", "High Knees", "Battle Ropes", "HIIT Circuit"],
};

const categories = Object.keys(exerciseLibrary);

const Card = styled.div`
  flex: 1; min-width: 280px; max-width: 380px;
  padding: 22px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  display: flex; flex-direction: column; gap: 14px;
  background: ${({ theme }) => theme.card};
  box-shadow: 0 4px 20px ${({ theme }) => theme.shadow};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px ${({ theme }) => theme.shadowHover};
  }
`;

const CardTitle = styled.div`
  font-weight: 700; font-size: 18px;
  background: ${({ theme }) => theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex; align-items: center; gap: 8px;
`;

const ExerciseGrid = styled.div`
  display: flex; flex-wrap: wrap; gap: 8px;
  max-height: 180px; overflow-y: auto;
  padding: 8px 0;
  
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: ${({ theme }) => theme.border}; border-radius: 4px; }
  &::-webkit-scrollbar-thumb { background: ${({ theme }) => theme.primary}; border-radius: 4px; }
`;

const ExerciseChip = styled.div`
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

const Label = styled.div`
  font-size: 12px; font-weight: 700;
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase; letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const NumGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  margin-top: 8px;
`;

const SelectedBadge = styled.div`
  padding: 10px 14px;
  border-radius: 12px;
  background: ${({ theme }) => theme.primary + "12"};
  border: 1.5px solid ${({ theme }) => theme.primary + "40"};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  display: flex; align-items: center; gap: 8px;
`;

// Custom styles for MUI components in dark mode
const selectStyles = {
  color: 'inherit',
  '.MuiOutlinedInput-notchedOutline': { borderColor: '#2C2C3A' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0A84FF' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0A84FF' },
  '.MuiSelect-select': { color: 'inherit' }
};

const inputLabelStyles = {
  color: '#6C6C7A',
  '&.Mui-focused': { color: '#0A84FF' }
};

const textFieldStyles = {
  input: { color: 'inherit' },
  label: { color: '#6C6C7A' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#2C2C3A' },
    '&:hover fieldset': { borderColor: '#0A84FF' }
  }
};

const AddWorkout = ({ addNewWorkout, buttonLoading }) => {
  const [category, setCategory] = useState("Legs");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [duration, setDuration] = useState("");

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
    <Card>
      <CardTitle>
        <FitnessCenterRounded sx={{ fontSize: "22px" }} />
        Add Workout
      </CardTitle>

      <FormControl fullWidth size="small">
        <InputLabel sx={inputLabelStyles}>Body Part / Category</InputLabel>
        <Select 
          value={category} 
          label="Body Part / Category" 
          onChange={(e) => {
            setCategory(e.target.value);
            setSelectedExercise("");
          }}
          sx={selectStyles}
        >
          {categories.map(c => (
            <MenuItem key={c} value={c} sx={{ color: '#fff' }}>{c}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <div>
        <Label>📋 SELECT EXERCISE</Label>
        <ExerciseGrid>
          {exercises.map(ex => (
            <ExerciseChip
              key={ex}
              $selected={selectedExercise === ex}
              onClick={() => setSelectedExercise(ex === selectedExercise ? "" : ex)}
            >
              {ex}
            </ExerciseChip>
          ))}
        </ExerciseGrid>
      </div>

      {selectedExercise && (
        <SelectedBadge>
          ✅ Selected: {selectedExercise}
        </SelectedBadge>
      )}

      <div>
        <Label>📝 DETAILS</Label>
        <NumGrid>
          <TextField
            label="Sets" type="number" size="small"
            value={sets} onChange={e => setSets(e.target.value)}
            sx={textFieldStyles}
          />
          <TextField
            label="Reps" type="number" size="small"
            value={reps} onChange={e => setReps(e.target.value)}
            sx={textFieldStyles}
          />
          <TextField
            label="Weight (kg)" type="number" size="small"
            value={weight} onChange={e => setWeight(e.target.value)}
            sx={textFieldStyles}
          />
          <TextField
            label="Duration (min)" type="number" size="small"
            value={duration} onChange={e => setDuration(e.target.value)}
            sx={textFieldStyles}
          />
        </NumGrid>
      </div>

      <Button
        text="➕ ADD WORKOUT"
        onClick={handleAdd}
        isLoading={buttonLoading}
        isDisabled={buttonLoading || !selectedExercise || !sets || !reps}
        full
      />
    </Card>
  );
};

export default AddWorkout;