import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  Add, Close, FitnessCenter, Schedule, 
  Delete, CheckCircle, RadioButtonUnchecked,
  DragIndicator, AccessTime, FitnessCenter as GymIcon
} from '@mui/icons-material';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Container = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.5s ease;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  
  @media (max-width: 700px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DayCard = styled.div`
  background: ${({ theme, $completed, $hasWorkout }) => {
    if ($completed) return theme.green + '15';
    if ($hasWorkout) return theme.primary + '10';
    return theme.bgLight;
  }};
  border: 2px solid ${({ theme, $active, $completed }) => 
    $active ? theme.primary : $completed ? theme.green : theme.border};
  border-radius: 16px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 8px 25px ${({ theme }) => theme.shadowHover};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ theme, $completed }) => $completed ? theme.green : theme.primary};
    transform: scaleX(${({ $progress }) => $progress / 100});
    transform-origin: left;
    transition: transform 0.3s ease;
  }
`;

const DayName = styled.div`
  font-weight: 800;
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DayWorkouts = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
`;

const ProgressBar = styled.div`
  height: 4px;
  background: ${({ theme }) => theme.border};
  border-radius: 2px;
  overflow: hidden;
  margin-top: 8px;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background: ${({ theme }) => theme.gradient};
  border-radius: 2px;
  transition: width 0.3s ease;
`;

const CompletedIcon = styled.div`
  color: ${({ theme }) => theme.green};
  font-size: 18px;
`;

// Modal Styles
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 28px;
  width: 90%;
  max-width: 500px;
  max-height: 85vh;
  overflow-y: auto;
  animation: ${slideIn} 0.3s ease;
  border: 1px solid ${({ theme }) => theme.border};
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.border};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.primary};
    border-radius: 4px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bgLight};
  position: sticky;
  top: 0;
  z-index: 10;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ModalContent = styled.div`
  padding: 24px;
`;

const WorkoutItem = styled.div`
  background: ${({ theme }) => theme.bgLight};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary + '40'};
    transform: translateX(4px);
  }
`;

const WorkoutCheckbox = styled.div`
  cursor: pointer;
  color: ${({ theme, $completed }) => $completed ? theme.green : theme.border};
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const WorkoutInfo = styled.div`
  flex: 1;
`;

const WorkoutName = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: ${({ theme, $completed }) => $completed ? theme.green : theme.text_primary};
`;

const WorkoutStats = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
`;

const AddForm = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const FormRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 14px;
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary + '80'};
  }
`;

const SmallInput = styled(Input)`
  flex: 0.5;
  min-width: 80px;
`;

const AddButton = styled.button`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.gradient};
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const CloseButton = styled.button`
  padding: 10px 20px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  color: ${({ theme }) => theme.text_secondary};
  cursor: pointer;
  width: 100%;
  margin-top: 12px;
  
  &:hover {
    background: ${({ theme }) => theme.border};
  }
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

const ExerciseSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const ExerciseChip = styled.span`
  padding: 6px 12px;
  background: ${({ theme, $selected }) => $selected ? theme.primary : theme.bgLight};
  color: ${({ theme, $selected }) => $selected ? 'white' : theme.text_primary};
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${({ theme, $selected }) => $selected ? theme.primary : theme.border};
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    transform: scale(1.02);
  }
`;

const commonExercises = [
  'Squats', 'Bench Press', 'Deadlift', 'Pull Ups', 
  'Push Ups', 'Lunges', 'Plank', 'Running',
  'Bicep Curls', 'Shoulder Press', 'Leg Press', 'Rows'
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WorkoutPlanner = ({ onPlanUpdate }) => {
  const [weekPlan, setWeekPlan] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [newWorkout, setNewWorkout] = useState({ 
    name: '', sets: '', reps: '', weight: '', duration: '' 
  });
  const [showExerciseSuggestions, setShowExerciseSuggestions] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('fittrack-week-plan');
    if (saved) {
      setWeekPlan(JSON.parse(saved));
    } else {
      // Sample data for demo
      const samplePlan = {
        'Thursday': [
          { id: 1, name: 'Squats', sets: 4, reps: 10, weight: 60, duration: 15, completed: false },
          { id: 2, name: 'Bench Press', sets: 4, reps: 8, weight: 70, duration: 15, completed: false },
        ],
        'Friday': [
          { id: 3, name: 'Deadlift', sets: 3, reps: 5, weight: 100, duration: 20, completed: false },
        ]
      };
      setWeekPlan(samplePlan);
      localStorage.setItem('fittrack-week-plan', JSON.stringify(samplePlan));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fittrack-week-plan', JSON.stringify(weekPlan));
    if (onPlanUpdate) onPlanUpdate(weekPlan);
  }, [weekPlan]);

  const addWorkout = () => {
    if (!newWorkout.name) {
      alert('Please enter exercise name');
      return;
    }
    if (!newWorkout.sets || !newWorkout.reps) {
      alert('Please enter sets and reps');
      return;
    }
    
    const workout = {
      id: Date.now(),
      name: newWorkout.name,
      sets: parseInt(newWorkout.sets),
      reps: parseInt(newWorkout.reps),
      weight: parseInt(newWorkout.weight) || 0,
      duration: parseInt(newWorkout.duration) || 10,
      completed: false
    };
    
    setWeekPlan(prev => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), workout]
    }));
    
    setNewWorkout({ name: '', sets: '', reps: '', weight: '', duration: '' });
    setShowExerciseSuggestions(false);
  };

  const toggleComplete = (day, workoutId) => {
    setWeekPlan(prev => ({
      ...prev,
      [day]: prev[day].map(w => 
        w.id === workoutId ? { ...w, completed: !w.completed } : w
      )
    }));
  };

  const deleteWorkout = (day, workoutId) => {
    if (window.confirm('Delete this workout?')) {
      setWeekPlan(prev => ({
        ...prev,
        [day]: prev[day].filter(w => w.id !== workoutId)
      }));
    }
  };

  const getDayProgress = (day) => {
    const workouts = weekPlan[day] || [];
    if (workouts.length === 0) return 0;
    const completed = workouts.filter(w => w.completed).length;
    return (completed / workouts.length) * 100;
  };

  const getTotalWorkouts = () => {
    return Object.values(weekPlan).reduce((sum, day) => sum + (day?.length || 0), 0);
  };

  const selectExercise = (exerciseName) => {
    setNewWorkout({ ...newWorkout, name: exerciseName });
    setShowExerciseSuggestions(false);
  };

  return (
    <Container>
      <Header>
        <Title>
          <Schedule /> Weekly Workout Planner
        </Title>
        <div style={{ fontSize: '14px', color: '#6C6C7A' }}>
          📋 Total: {getTotalWorkouts()} workouts this week
        </div>
      </Header>
      
      <WeekGrid>
        {days.map(day => {
          const workouts = weekPlan[day] || [];
          const progress = getDayProgress(day);
          const isCompleted = progress === 100 && workouts.length > 0;
          const hasWorkout = workouts.length > 0;
          
          return (
            <DayCard 
              key={day} 
              $completed={isCompleted}
              $hasWorkout={hasWorkout}
              $progress={progress}
              onClick={() => setSelectedDay(day)}
            >
              <DayName>
                {day.slice(0, 3)}
                {isCompleted && <CompletedIcon><CheckCircle sx={{ fontSize: 16 }} /></CompletedIcon>}
              </DayName>
              <DayWorkouts>
                <FitnessCenter sx={{ fontSize: 14 }} />
                {workouts.length} {workouts.length === 1 ? 'workout' : 'workouts'}
              </DayWorkouts>
              {hasWorkout && (
                <ProgressBar>
                  <ProgressFill $progress={progress} />
                </ProgressBar>
              )}
            </DayCard>
          );
        })}
      </WeekGrid>
      
      {selectedDay && (
        <Overlay onClick={() => setSelectedDay(null)}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                <GymIcon /> {selectedDay}'s Plan
              </ModalTitle>
              <IconButton onClick={() => setSelectedDay(null)}>
                <Close />
              </IconButton>
            </ModalHeader>
            
            <ModalContent>
              {(weekPlan[selectedDay] || []).length === 0 ? (
                <EmptyState>
                  <FitnessCenter sx={{ fontSize: 48, opacity: 0.5 }} />
                  <div>No workouts planned for {selectedDay}</div>
                  <div style={{ fontSize: 12, marginTop: 8 }}>Add your first workout below 👇</div>
                </EmptyState>
              ) : (
                (weekPlan[selectedDay] || []).map(workout => (
                  <WorkoutItem key={workout.id}>
                    <WorkoutCheckbox 
                      $completed={workout.completed}
                      onClick={() => toggleComplete(selectedDay, workout.id)}
                    >
                      {workout.completed ? 
                        <CheckCircle sx={{ fontSize: 24 }} /> : 
                        <RadioButtonUnchecked sx={{ fontSize: 24 }} />
                      }
                    </WorkoutCheckbox>
                    <WorkoutInfo>
                      <WorkoutName $completed={workout.completed}>
                        {workout.name}
                      </WorkoutName>
                      <WorkoutStats>
                        <span>🏋️ {workout.sets} × {workout.reps}</span>
                        <span>⚡ {workout.weight}kg</span>
                        <span>⏱️ {workout.duration}min</span>
                      </WorkoutStats>
                    </WorkoutInfo>
                    <IconButton size="small" onClick={() => deleteWorkout(selectedDay, workout.id)}>
                      <Delete sx={{ fontSize: 18, color: '#FF453A' }} />
                    </IconButton>
                  </WorkoutItem>
                ))
              )}
              
              <AddForm>
                <FormRow>
                  <div style={{ flex: 2, position: 'relative' }}>
                    <Input 
                      placeholder="Exercise name (e.g., Squats)"
                      value={newWorkout.name}
                      onChange={(e) => {
                        setNewWorkout({ ...newWorkout, name: e.target.value });
                        setShowExerciseSuggestions(true);
                      }}
                      onFocus={() => setShowExerciseSuggestions(true)}
                    />
                    {showExerciseSuggestions && newWorkout.name && (
                      <ExerciseSelector style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#14141F', zIndex: 10, padding: '8px', borderRadius: '12px', marginTop: '4px', border: '1px solid #2C2C3A' }}>
                        {commonExercises
                          .filter(ex => ex.toLowerCase().includes(newWorkout.name.toLowerCase()))
                          .slice(0, 6)
                          .map(ex => (
                            <ExerciseChip key={ex} onClick={() => selectExercise(ex)}>
                              {ex}
                            </ExerciseChip>
                          ))}
                      </ExerciseSelector>
                    )}
                  </div>
                </FormRow>
                <FormRow>
                  <SmallInput 
                    type="number" 
                    placeholder="Sets"
                    value={newWorkout.sets}
                    onChange={(e) => setNewWorkout({ ...newWorkout, sets: e.target.value })}
                  />
                  <SmallInput 
                    type="number" 
                    placeholder="Reps"
                    value={newWorkout.reps}
                    onChange={(e) => setNewWorkout({ ...newWorkout, reps: e.target.value })}
                  />
                  <SmallInput 
                    type="number" 
                    placeholder="Weight (kg)"
                    value={newWorkout.weight}
                    onChange={(e) => setNewWorkout({ ...newWorkout, weight: e.target.value })}
                  />
                  <SmallInput 
                    type="number" 
                    placeholder="Duration (min)"
                    value={newWorkout.duration}
                    onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
                  />
                </FormRow>
                <AddButton onClick={addWorkout}>
                  <Add /> Add Workout
                </AddButton>
                <CloseButton onClick={() => setSelectedDay(null)}>
                  Close
                </CloseButton>
              </AddForm>
            </ModalContent>
          </Modal>
        </Overlay>
      )}
    </Container>
  );
};

export default WorkoutPlanner;