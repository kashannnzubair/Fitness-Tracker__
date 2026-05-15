import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  CalendarToday,
  TrendingUp,
  EmojiEvents,
  AccessTime,
  FitnessCenter,
  Whatshot,
  Add,
  CheckCircle,
  Schedule,
  Delete,
  Edit,
  Close,
} from "@mui/icons-material";
import { getAllWorkouts, addWorkout, updateWorkout, deleteWorkout } from "../api";
import { Chip, LinearProgress, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button as MuiButton } from "@mui/material";

// ============ TOAST ANIMATIONS ============
const toastSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const toastSlideOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ============ TOAST STYLED COMPONENTS ============
const ToastContainer = styled.div`
  position: fixed;
  top: 90px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ToastItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  background: ${({ $type, theme }) => 
    $type === 'success' 
      ? 'linear-gradient(135deg, #34C759, #28A745)'
      : $type === 'error'
      ? 'linear-gradient(135deg, #FF3B30, #DC2626)'
      : 'linear-gradient(135deg, #FF9F0A, #FF5E3A)'};
  border-radius: 16px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  min-width: 300px;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  animation: ${({ $leaving }) => 
    $leaving ? toastSlideOut : toastSlideIn} 0.3s ease forwards;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  
  .toast-icon {
    font-size: 22px;
  }
  
  .toast-content {
    flex: 1;
  }
  
  .toast-title {
    font-weight: 700;
    margin-bottom: 2px;
  }
  
  .toast-message {
    font-size: 12px;
    opacity: 0.9;
  }
  
  .toast-close {
    cursor: pointer;
    opacity: 0.7;
    transition: all 0.2s ease;
    
    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }
  }
`;

const Container = styled.div`
  flex: 1;
  padding: 30px;
  background: ${({ theme }) => theme.bg};
  min-height: calc(100vh - 80px);
  overflow-y: auto;
`;

const Wrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  background: ${({ theme }) => theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px ${({ theme }) => theme.shadowHover};
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${({ theme, $color }) => theme[$color] + "15"};
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, $color }) => theme[$color]};
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 4px;
`;

const PlannerSection = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 30px;
`;

const PlannerTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  margin-bottom: 20px;
  
  @media (max-width: 700px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const DayCard = styled.div`
  background: ${({ theme, $active }) => $active ? theme.primary + "15" : theme.bgLight};
  border: 2px solid ${({ theme, $selected }) => $selected ? theme.primary : theme.border};
  border-radius: 16px;
  padding: 14px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    border-color: ${({ theme }) => theme.primary};
  }
`;

const DayName = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 8px;
`;

const DayWorkoutCount = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.primary};
`;

const DayWorkoutLabel = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.text_secondary};
`;

const FormCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 28px;
  padding: 28px;
  margin-bottom: 30px;
  animation: ${fadeIn} 0.5s ease;
`;

const FormTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  padding: 14px 16px;
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  color: ${({ theme }) => theme.text_primary};
  font-size: 15px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const SelectStyled = styled.select`
  padding: 14px 16px;
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  color: ${({ theme }) => theme.text_primary};
  font-size: 15px;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: ${({ theme }) => theme.gradient};
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px ${({ theme }) => theme.primary + "40"};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ExerciseGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
  max-height: 200px;
  overflow-y: auto;
`;

const ExerciseChip = styled.div`
  padding: 10px 18px;
  background: ${({ $selected, theme }) => $selected ? theme.primary : theme.bgLight};
  border: 1px solid ${({ $selected, theme }) => $selected ? theme.primary : theme.border};
  border-radius: 30px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${({ $selected, theme }) => $selected ? "#fff" : theme.text_primary};
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    transform: translateY(-2px);
  }
`;

const HistorySection = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  padding: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const WorkoutItem = styled.div`
  background: ${({ theme }) => theme.bgLight};
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
    border-left: 3px solid ${({ theme }) => theme.primary};
  }
`;

const WorkoutInfo = styled.div`
  flex: 1;
`;

const WorkoutName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 6px;
`;

const WorkoutMeta = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
`;

const WorkoutDate = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.text_light};
  margin-top: 6px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${({ theme }) => theme.text_secondary};
  
  svg {
    font-size: 48px;
    opacity: 0.5;
    margin-bottom: 12px;
  }
`;

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
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState(() => {
    const saved = localStorage.getItem("fittrack-weekly-plan");
    return saved ? JSON.parse(saved) : {
      Monday: [], Tuesday: [], Wednesday: [], Thursday: [],
      Friday: [], Saturday: [], Sunday: []
    };
  });
  
  const [category, setCategory] = useState("Legs");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [duration, setDuration] = useState("");
  const [assignToDay, setAssignToDay] = useState("Monday");
  
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [editForm, setEditForm] = useState({});
  
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalVolume: 0,
    streakDays: 0,
    caloriesBurned: 0,
  });

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Toast functions
  const showToast = (title, message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type, leaving: false }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => 
        prev.map(toast => 
          toast.id === id ? { ...toast, leaving: true } : toast
        )
      );
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 300);
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id ? { ...toast, leaving: true } : toast
      )
    );
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  };

  const saveWeeklyPlan = (plan) => {
    localStorage.setItem("fittrack-weekly-plan", JSON.stringify(plan));
    setWeeklyPlan(plan);
  };

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const res = await getAllWorkouts();
      const allWorkouts = res?.data?.workouts || [];
      setWorkouts(allWorkouts);
      calculateStats(allWorkouts);
    } catch (err) {
      console.log("Error fetching workouts:", err);
      setWorkouts([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (workoutData) => {
    const total = workoutData.length;
    let volume = 0;
    workoutData.forEach(w => {
      volume += (w.sets || 0) * (w.reps || 0) * (w.weight || 0);
    });
    
    setStats({
      totalWorkouts: total,
      totalVolume: volume,
      streakDays: Math.min(total, 7),
      caloriesBurned: total * 50,
    });
  };

  const handleAddWorkout = async () => {
    if (!selectedExercise) {
      showToast("Missing Info", "Please select an exercise!", "error");
      return;
    }
    if (!sets || !reps) {
      showToast("Missing Info", "Please fill Sets and Reps!", "error");
      return;
    }
    
    setButtonLoading(true);
    
    const newWorkout = {
      id: Date.now(),
      name: selectedExercise,
      category: category,
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: parseInt(weight) || 0,
      duration: parseInt(duration) || 30,
      date: new Date().toISOString(),
    };
    
    const updatedPlan = { ...weeklyPlan };
    updatedPlan[assignToDay] = [...updatedPlan[assignToDay], newWorkout];
    saveWeeklyPlan(updatedPlan);
    
    const workoutString = `#${category}\n-${selectedExercise}\n-${sets} setsX${reps} reps\n-${weight || 0} kg\n-${duration || 30} min`;
    try {
      await addWorkout({ workoutString });
      fetchWorkouts();
      showToast("Workout Added! 🎉", `${selectedExercise} added to ${assignToDay}`, "success");
      setSelectedExercise("");
      setSets("");
      setReps("");
      setWeight("");
      setDuration("");
    } catch (err) {
      console.log(err);
      showToast("Failed!", "Could not add workout. Please try again.", "error");
    } finally {
      setButtonLoading(false);
    }
  };

  const deleteExerciseFromDay = (day, exerciseId) => {
    const updated = { ...weeklyPlan };
    const exercise = updated[day].find(ex => ex.id === exerciseId);
    updated[day] = updated[day].filter(ex => ex.id !== exerciseId);
    saveWeeklyPlan(updated);
    showToast("Exercise Removed", `${exercise?.name} removed from ${day}`, "success");
  };

  const handleDeleteWorkout = async (workoutId, workoutName) => {
    if (window.confirm(`Are you sure you want to delete "${workoutName}"?`)) {
      try {
        await deleteWorkout(workoutId);
        fetchWorkouts();
        showToast("Workout Deleted! 🗑️", `${workoutName} has been removed`, "success");
      } catch (err) {
        console.log(err);
        showToast("Delete Failed!", "Could not delete workout. Please try again.", "error");
      }
    }
  };

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
    setEditForm({
      workoutName: workout.workoutName,
      sets: workout.sets,
      reps: workout.reps,
      weight: workout.weight,
      duration: workout.duration,
      category: workout.category,
    });
  };

  const handleSaveEdit = async () => {
    try {
      await updateWorkout(editingWorkout._id, editForm);
      fetchWorkouts();
      showToast("Workout Updated! ✏️", `${editForm.workoutName} has been updated`, "success");
      setEditingWorkout(null);
    } catch (err) {
      console.log(err);
      showToast("Update Failed!", "Could not update workout. Please try again.", "error");
    }
  };

  const getTotalExercises = () => {
    return Object.values(weeklyPlan).reduce((sum, day) => sum + day.length, 0);
  };

  const exercises = exerciseLibrary[category] || [];

  // Get icon for toast
  const getToastIcon = (type) => {
    if (type === "success") return "✅";
    if (type === "error") return "❌";
    return "⚠️";
  };

  return (
    <Container>
      {/* Toast Container */}
      <ToastContainer>
        {toasts.map(toast => (
          <ToastItem 
            key={toast.id} 
            $type={toast.type} 
            $leaving={toast.leaving}
          >
            <div className="toast-icon">{getToastIcon(toast.type)}</div>
            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-message">{toast.message}</div>
            </div>
            <div className="toast-close" onClick={() => removeToast(toast.id)}>
              <Close sx={{ fontSize: 16 }} />
            </div>
          </ToastItem>
        ))}
      </ToastContainer>

      <Wrapper>
        <Header>
          <Title>💪 Workout Studio</Title>
          <Subtitle>Plan your weekly workouts, track progress, and build muscle</Subtitle>
        </Header>

        <StatsGrid>
          <StatCard>
            <StatIcon $color="primary"><FitnessCenter /></StatIcon>
            <div>
              <StatValue>{stats.totalWorkouts}</StatValue>
              <StatLabel>Total Workouts</StatLabel>
            </div>
          </StatCard>
          <StatCard>
            <StatIcon $color="orange"><Whatshot /></StatIcon>
            <div>
              <StatValue>{stats.caloriesBurned}</StatValue>
              <StatLabel>Calories Burned</StatLabel>
            </div>
          </StatCard>
          <StatCard>
            <StatIcon $color="green"><TrendingUp /></StatIcon>
            <div>
              <StatValue>{stats.totalVolume.toLocaleString()}kg</StatValue>
              <StatLabel>Total Volume</StatLabel>
            </div>
          </StatCard>
          <StatCard>
            <StatIcon $color="primary"><EmojiEvents /></StatIcon>
            <div>
              <StatValue>{stats.streakDays}</StatValue>
              <StatLabel>Day Streak</StatLabel>
            </div>
          </StatCard>
        </StatsGrid>

        <PlannerSection>
          <PlannerTitle>
            <Schedule /> Weekly Workout Planner ({getTotalExercises()} exercises)
          </PlannerTitle>
          <WeekGrid>
            {days.map(day => {
              const dayExercises = weeklyPlan[day] || [];
              return (
                <DayCard 
                  key={day} 
                  $active={today === day}
                  $selected={selectedDay === day}
                  onClick={() => setSelectedDay(day)}
                >
                  <DayName>{day.slice(0, 3)}</DayName>
                  <DayWorkoutCount>{dayExercises.length}</DayWorkoutCount>
                  <DayWorkoutLabel>workouts</DayWorkoutLabel>
                </DayCard>
              );
            })}
          </WeekGrid>
        </PlannerSection>

        <FormCard>
          <FormTitle>
            <Add /> Add New Workout
          </FormTitle>
          
          <FormRow>
            <InputGroup>
              <Label>Body Part / Category</Label>
              <SelectStyled value={category} onChange={(e) => {
                setCategory(e.target.value);
                setSelectedExercise("");
              }}>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </SelectStyled>
            </InputGroup>
            
            <InputGroup>
              <Label>Assign to Day</Label>
              <SelectStyled value={assignToDay} onChange={(e) => setAssignToDay(e.target.value)}>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </SelectStyled>
            </InputGroup>
          </FormRow>
          
          <InputGroup>
            <Label>Select Exercise</Label>
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
          </InputGroup>
          
          <FormRow>
            <InputGroup>
              <Label>Sets</Label>
              <Input type="number" placeholder="e.g., 3" value={sets} onChange={(e) => setSets(e.target.value)} />
            </InputGroup>
            <InputGroup>
              <Label>Reps</Label>
              <Input type="number" placeholder="e.g., 10" value={reps} onChange={(e) => setReps(e.target.value)} />
            </InputGroup>
            <InputGroup>
              <Label>Weight (kg)</Label>
              <Input type="number" placeholder="e.g., 20" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </InputGroup>
            <InputGroup>
              <Label>Duration (min)</Label>
              <Input type="number" placeholder="e.g., 15" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </InputGroup>
          </FormRow>
          
          <SubmitButton onClick={handleAddWorkout} disabled={buttonLoading || !selectedExercise || !sets || !reps}>
            {buttonLoading ? "Adding..." : `➕ Add to ${assignToDay}`}
          </SubmitButton>
        </FormCard>

        <HistorySection>
          <SectionTitle>
            <CalendarToday /> Workout History
          </SectionTitle>
          
          {workouts.length > 0 ? (
            workouts.slice(0, 10).map((workout, index) => (
              <WorkoutItem key={index}>
                <WorkoutInfo>
                  <WorkoutName>{workout.workoutName}</WorkoutName>
                  <WorkoutMeta>
                    <span>{workout.sets} sets × {workout.reps} reps</span>
                    <span>🏋️ {workout.weight} kg</span>
                    <span>⏱️ {workout.duration} min</span>
                    <Chip label={workout.category} size="small" sx={{ fontSize: 10, bgcolor: '#0A84FF20', color: '#0A84FF' }} />
                  </WorkoutMeta>
                  <WorkoutDate>📅 {new Date(workout.date).toLocaleDateString()}</WorkoutDate>
                </WorkoutInfo>
                <ActionButtons>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEditWorkout(workout)}>
                      <Edit sx={{ fontSize: 18, color: "#FF9F0A" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDeleteWorkout(workout._id, workout.workoutName)}>
                      <Delete sx={{ fontSize: 18, color: "#FF453A" }} />
                    </IconButton>
                  </Tooltip>
                </ActionButtons>
              </WorkoutItem>
            ))
          ) : (
            <EmptyState>
              <FitnessCenter />
              <div>No workouts yet</div>
              <div style={{ fontSize: 12, marginTop: 8 }}>Add your first workout above! 💪</div>
            </EmptyState>
          )}
        </HistorySection>
      </Wrapper>

      {/* Day Detail Modal */}
      <Dialog open={!!selectedDay} onClose={() => setSelectedDay(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: '#14141F', color: '#fff', borderBottom: '1px solid #2C2C3A' }}>
          {selectedDay} - Workout Plan
          <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={() => setSelectedDay(null)}>
            <Close sx={{ color: '#fff' }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {(weeklyPlan[selectedDay] || []).length > 0 ? (
            (weeklyPlan[selectedDay] || []).map((ex, i) => (
              <div key={ex.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#1C1C2A', borderRadius: 12, marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: '#6C6C7A' }}>
                    {ex.sets} sets × {ex.reps} reps • {ex.weight} kg • {ex.duration} min
                  </div>
                </div>
                <IconButton size="small" onClick={() => deleteExerciseFromDay(selectedDay, ex.id)}>
                  <Delete sx={{ fontSize: 18, color: "#FF453A" }} />
                </IconButton>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', color: '#6C6C7A', padding: 40 }}>
              No exercises scheduled for {selectedDay}
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #2C2C3A', padding: 16 }}>
          <MuiButton onClick={() => setSelectedDay(null)} sx={{ color: '#fff' }}>Close</MuiButton>
        </DialogActions>
      </Dialog>

      {/* Edit Workout Dialog */}
      <Dialog open={!!editingWorkout} onClose={() => setEditingWorkout(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: '#14141F', color: '#fff' }}>Edit Workout</DialogTitle>
        <DialogContent sx={{ background: '#14141F', mt: 1 }}>
          <TextField
            fullWidth
            label="Exercise Name"
            value={editForm.workoutName || ""}
            onChange={(e) => setEditForm({ ...editForm, workoutName: e.target.value })}
            margin="dense"
            sx={{ input: { color: '#fff' }, label: { color: '#6C6C7A' } }}
          />
          <TextField
            fullWidth
            label="Category"
            value={editForm.category || ""}
            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
            margin="dense"
            sx={{ input: { color: '#fff' }, label: { color: '#6C6C7A' } }}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <TextField
              label="Sets"
              type="number"
              value={editForm.sets || ""}
              onChange={(e) => setEditForm({ ...editForm, sets: e.target.value })}
              margin="dense"
              sx={{ flex: 1, input: { color: '#fff' }, label: { color: '#6C6C7A' } }}
            />
            <TextField
              label="Reps"
              type="number"
              value={editForm.reps || ""}
              onChange={(e) => setEditForm({ ...editForm, reps: e.target.value })}
              margin="dense"
              sx={{ flex: 1, input: { color: '#fff' }, label: { color: '#6C6C7A' } }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <TextField
              label="Weight (kg)"
              type="number"
              value={editForm.weight || ""}
              onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
              margin="dense"
              sx={{ flex: 1, input: { color: '#fff' }, label: { color: '#6C6C7A' } }}
            />
            <TextField
              label="Duration (min)"
              type="number"
              value={editForm.duration || ""}
              onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
              margin="dense"
              sx={{ flex: 1, input: { color: '#fff' }, label: { color: '#6C6C7A' } }}
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ background: '#14141F', padding: 16 }}>
          <MuiButton onClick={() => setEditingWorkout(null)} sx={{ color: '#6C6C7A' }}>Cancel</MuiButton>
          <MuiButton onClick={handleSaveEdit} variant="contained" sx={{ background: '#0A84FF' }}>Save Changes</MuiButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Workouts;