import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import WorkoutPlanner from "../components/WorkoutPlanner";
import {
  CalendarToday,
  TrendingUp,
  EmojiEvents,
  AccessTime,
  FitnessCenter,
  Whatshot,
  Add,
  Delete,
  Edit,
  Close,
} from "@mui/icons-material";
import { getWorkouts, addWorkout } from "../api";
import { IconButton, Tooltip, Chip, LinearProgress, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button as MuiButton } from "@mui/material";
import Button from "../components/Button";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
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
  width: 100%;
`;

const Header = styled.div`
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  background: ${({ theme }) => theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
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
  animation: ${slideIn} 0.5s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px ${({ theme }) => theme.shadowHover};
  }
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 15px;
  background: ${({ theme, $color }) => theme[$color] + "20"};
  color: ${({ theme, $color }) => theme[$color]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const StatInfo = styled.div`
  flex: 1;
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 25px;
  margin-bottom: 30px;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const AddWorkoutSection = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  padding: 24px;
  animation: ${fadeIn} 0.5s ease;
`;

const WorkoutListSection = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  padding: 24px;
  animation: ${fadeIn} 0.6s ease;
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
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  position: relative;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary + "40"};
    transform: translateX(5px);
  }
`;

const WorkoutHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
`;

const WorkoutName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const WorkoutCategory = styled(Chip)`
  && {
    background: ${({ theme, $cat }) => {
      const colors = {
        Legs: "#34C759",
        Chest: "#0A84FF",
        Back: "#FF9F0A",
        Abs: "#FF453A",
        Arms: "#BF5AF2",
        Shoulders: "#5E5CE6",
        Cardio: "#FF375F",
      };
      return colors[$cat] + "20";
    }};
    color: ${({ theme, $cat }) => {
      const colors = {
        Legs: "#34C759",
        Chest: "#0A84FF",
        Back: "#FF9F0A",
        Abs: "#FF453A",
        Arms: "#BF5AF2",
        Shoulders: "#5E5CE6",
        Cardio: "#FF375F",
      };
      return colors[$cat];
    }};
    font-weight: 600;
  }
`;

const WorkoutDetails = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

const Detail = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  position: absolute;
  right: 16px;
  top: 16px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.text_secondary};
  
  svg {
    font-size: 60px;
    opacity: 0.5;
    margin-bottom: 15px;
  }
`;

const ProgressBar = styled(LinearProgress)`
  && {
    background: ${({ theme }) => theme.border};
    height: 8px;
    border-radius: 10px;
    margin-top: 15px;
    
    .MuiLinearProgress-bar {
      background: ${({ theme }) => theme.gradient};
      border-radius: 10px;
    }
  }
`;

const ChallengeBanner = styled.div`
  background: linear-gradient(135deg, #0A84FF20, #5E5CE620);
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  border: 1px solid rgba(10,132,255,0.3);
`;

// Exercise Library for Quick Add
const exerciseTemplates = [
  { name: "Squats", category: "Legs", sets: 4, reps: 10, weight: 60, duration: 15 },
  { name: "Bench Press", category: "Chest", sets: 4, reps: 8, weight: 70, duration: 15 },
  { name: "Deadlift", category: "Back", sets: 3, reps: 5, weight: 100, duration: 20 },
  { name: "Pull Ups", category: "Back", sets: 3, reps: 8, weight: 0, duration: 10 },
  { name: "Shoulder Press", category: "Shoulders", sets: 3, reps: 10, weight: 40, duration: 12 },
  { name: "Bicep Curls", category: "Arms", sets: 3, reps: 12, weight: 15, duration: 10 },
  { name: "Tricep Dips", category: "Arms", sets: 3, reps: 10, weight: 0, duration: 8 },
  { name: "Plank", category: "Abs", sets: 3, reps: 1, weight: 0, duration: 5 },
  { name: "Running", category: "Cardio", sets: 1, reps: 1, weight: 0, duration: 30 },
];

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalVolume: 0,
    streakDays: 0,
    caloriesBurned: 0,
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const res = await getWorkouts();
      const allWorkouts = res?.data?.allWorkouts || res?.data?.todaysWorkouts || [];
      setWorkouts(allWorkouts);
      calculateStats(allWorkouts);
    } catch (err) {
      console.log(err);
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

  const handleAddTemplate = async (template) => {
    const workoutString = `#${template.category}\n-${template.name}\n-${template.sets} setsX${template.reps} reps\n-${template.weight} kg\n-${template.duration} min`;
    try {
      await addWorkout({ workoutString });
      fetchWorkouts();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      try {
        // Call API to delete workout (implement based on your backend)
        // await deleteWorkout(workoutId);
        setWorkouts(workouts.filter(w => w._id !== workoutId));
        calculateStats(workouts.filter(w => w._id !== workoutId));
      } catch (err) {
        console.log(err);
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
      // Call API to update workout (implement based on your backend)
      // await updateWorkout(editingWorkout._id, editForm);
      setWorkouts(workouts.map(w => 
        w._id === editingWorkout._id ? { ...w, ...editForm } : w
      ));
      calculateStats(workouts.map(w => 
        w._id === editingWorkout._id ? { ...w, ...editForm } : w
      ));
      setEditingWorkout(null);
    } catch (err) {
      console.log(err);
    }
  };

  const weeklyProgress = (stats.streakDays / 7) * 100;

  return (
    <Container>
      <Wrapper>
        <Header>
          <Title>
            <FitnessCenter /> Workout Studio
          </Title>
        </Header>

        <WorkoutPlanner onPlanUpdate={(plan) => console.log("Week plan updated", plan)} />

        <StatsGrid>
          <StatCard>
            <StatIcon $color="primary">
              <FitnessCenter />
            </StatIcon>
            <StatInfo>
              <StatValue>{stats.totalWorkouts}</StatValue>
              <StatLabel>Total Workouts</StatLabel>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIcon $color="orange">
              <Whatshot />
            </StatIcon>
            <StatInfo>
              <StatValue>{stats.caloriesBurned}</StatValue>
              <StatLabel>Calories Burned</StatLabel>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIcon $color="green">
              <TrendingUp />
            </StatIcon>
            <StatInfo>
              <StatValue>{stats.totalVolume.toLocaleString()}kg</StatValue>
              <StatLabel>Total Volume</StatLabel>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIcon $color="primary">
              <EmojiEvents />
            </StatIcon>
            <StatInfo>
              <StatValue>{stats.streakDays}</StatValue>
              <StatLabel>Day Streak</StatLabel>
              <ProgressBar variant="determinate" value={weeklyProgress} />
            </StatInfo>
          </StatCard>
        </StatsGrid>

        <ContentGrid>
          <AddWorkoutSection>
            <SectionTitle>
              <Add /> Quick Templates
            </SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {exerciseTemplates.slice(0, 8).map((template, i) => (
                <WorkoutItem key={i} style={{ cursor: "pointer" }} onClick={() => handleAddTemplate(template)}>
                  <WorkoutHeader>
                    <WorkoutName>{template.name}</WorkoutName>
                    <WorkoutCategory label={template.category} $cat={template.category} size="small" />
                  </WorkoutHeader>
                  <WorkoutDetails>
                    <Detail><FitnessCenter sx={{ fontSize: 14 }} /> {template.sets} × {template.reps}</Detail>
                    <Detail>⚡ {template.weight}kg</Detail>
                    <Detail><AccessTime sx={{ fontSize: 14 }} /> {template.duration}min</Detail>
                  </WorkoutDetails>
                  <Tooltip title="Quick Add">
                    <IconButton size="small" sx={{ position: "absolute", right: 16, bottom: 16 }}>
                      <Add sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </WorkoutItem>
              ))}
            </div>
          </AddWorkoutSection>

          <WorkoutListSection>
            <SectionTitle>
              <CalendarToday /> Workout History
            </SectionTitle>
            
            {workouts.length > 0 ? (
              workouts.map((workout, index) => (
                <WorkoutItem key={index}>
                  <WorkoutHeader>
                    <WorkoutName>{workout.workoutName}</WorkoutName>
                    <WorkoutCategory label={workout.category} $cat={workout.category} size="small" />
                  </WorkoutHeader>
                  <WorkoutDetails>
                    <Detail><FitnessCenter sx={{ fontSize: 14 }} /> {workout.sets} sets × {workout.reps} reps</Detail>
                    <Detail>🏋️ {workout.weight}kg</Detail>
                    <Detail><AccessTime sx={{ fontSize: 14 }} /> {workout.duration}min</Detail>
                  </WorkoutDetails>
                  <WorkoutDetails>
                    <Detail>📅 {new Date(workout.date).toLocaleDateString()}</Detail>
                  </WorkoutDetails>
                  <ActionButtons>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEditWorkout(workout)}>
                        <Edit sx={{ fontSize: 18, color: "#FF9F0A" }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDeleteWorkout(workout._id)}>
                        <Delete sx={{ fontSize: 18, color: "#FF453A" }} />
                      </IconButton>
                    </Tooltip>
                  </ActionButtons>
                </WorkoutItem>
              ))
            ) : (
              <EmptyState>
                <FitnessCenter />
                <div>No workouts yet. Add your first workout! 💪</div>
              </EmptyState>
            )}
          </WorkoutListSection>
        </ContentGrid>

        <ChallengeBanner>
          <EmojiEvents sx={{ fontSize: 40, color: "#FFD60A", marginBottom: "10px" }} />
          <h3 style={{ margin: 0, color: "#fff" }}>Weekly Challenge</h3>
          <p style={{ margin: "5px 0 0", opacity: 0.8, fontSize: "14px" }}>
            Complete 5 workouts this week to earn "Warrior" badge! 🎖️
          </p>
          <ProgressBar variant="determinate" value={(stats.totalWorkouts / 5) * 100} sx={{ marginTop: "15px", maxWidth: "300px", margin: "15px auto 0" }} />
        </ChallengeBanner>
      </Wrapper>

      {/* Edit Dialog */}
      <Dialog open={!!editingWorkout} onClose={() => setEditingWorkout(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: "#14141F", color: "white" }}>Edit Workout</DialogTitle>
        <DialogContent sx={{ background: "#14141F", paddingTop: "20px" }}>
          <TextField
            fullWidth
            label="Exercise Name"
            value={editForm.workoutName || ""}
            onChange={(e) => setEditForm({ ...editForm, workoutName: e.target.value })}
            margin="dense"
            sx={{ input: { color: "white" }, label: { color: "gray" } }}
          />
          <TextField
            fullWidth
            label="Category"
            value={editForm.category || ""}
            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
            margin="dense"
            sx={{ input: { color: "white" }, label: { color: "gray" } }}
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <TextField
              label="Sets"
              type="number"
              value={editForm.sets || ""}
              onChange={(e) => setEditForm({ ...editForm, sets: e.target.value })}
              margin="dense"
              sx={{ flex: 1, input: { color: "white" }, label: { color: "gray" } }}
            />
            <TextField
              label="Reps"
              type="number"
              value={editForm.reps || ""}
              onChange={(e) => setEditForm({ ...editForm, reps: e.target.value })}
              margin="dense"
              sx={{ flex: 1, input: { color: "white" }, label: { color: "gray" } }}
            />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <TextField
              label="Weight (kg)"
              type="number"
              value={editForm.weight || ""}
              onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
              margin="dense"
              sx={{ flex: 1, input: { color: "white" }, label: { color: "gray" } }}
            />
            <TextField
              label="Duration (min)"
              type="number"
              value={editForm.duration || ""}
              onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
              margin="dense"
              sx={{ flex: 1, input: { color: "white" }, label: { color: "gray" } }}
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ background: "#14141F", padding: "16px" }}>
          <MuiButton onClick={() => setEditingWorkout(null)} sx={{ color: "gray" }}>Cancel</MuiButton>
          <MuiButton onClick={handleSaveEdit} variant="contained" sx={{ background: "#0A84FF" }}>Save Changes</MuiButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Workouts;