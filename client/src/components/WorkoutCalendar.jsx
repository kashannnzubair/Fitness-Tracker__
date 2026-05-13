import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight, FitnessCenter } from '@mui/icons-material';
import { getWorkouts } from '../api';

const CalendarContainer = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  padding: 24px;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const MonthTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const NavButton = styled.button`
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
  }
`;

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 12px;
`;

const WeekDay = styled.div`
  text-align: center;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
  padding: 8px;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;

const DayCell = styled.div`
  background: ${({ theme, $isToday }) => $isToday ? theme.primary + "20" : theme.bgLight};
  border: 1px solid ${({ theme, $hasWorkout }) => $hasWorkout ? theme.primary : theme.border};
  border-radius: 12px;
  padding: 12px 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.primary};
  }
  
  ${({ $hasWorkout }) => $hasWorkout && `
    &::after {
      content: '●';
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      color: ${({ theme }) => theme.primary};
      font-size: 8px;
    }
  `}
`;

const DayNumber = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  font-size: 16px;
`;

const WorkoutBadge = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.primary};
  margin-top: 4px;
`;

const WorkoutList = styled.div`
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const WorkoutItem = styled.div`
  background: ${({ theme }) => theme.bgLight};
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const WorkoutCalendar = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workouts, setWorkouts] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);

  useEffect(() => {
    fetchWorkouts();
  }, [currentDate]);

  const fetchWorkouts = async () => {
    try {
      const res = await getWorkouts();
      const allWorkouts = res?.data?.allWorkouts || res?.data?.todaysWorkouts || [];
      
      // Group workouts by date
      const grouped = {};
      allWorkouts.forEach(workout => {
        const date = new Date(workout.date).toDateString();
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(workout);
      });
      setWorkouts(grouped);
    } catch (err) {
      console.log(err);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add previous month days
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Add current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    // Add next month days
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  };

  const handleDateClick = (date) => {
    const dateStr = date.toDateString();
    setSelectedDate(date);
    setSelectedWorkouts(workouts[dateStr] || []);
    if (onDateSelect) onDateSelect(date, workouts[dateStr] || []);
  };

  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const hasWorkout = (date) => {
    return workouts[date.toDateString()]?.length > 0;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getDaysInMonth(currentDate);

  return (
    <CalendarContainer>
      <CalendarHeader>
        <NavButton onClick={() => changeMonth(-1)}>
          <ChevronLeft />
        </NavButton>
        <MonthTitle>
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </MonthTitle>
        <NavButton onClick={() => changeMonth(1)}>
          <ChevronRight />
        </NavButton>
      </CalendarHeader>
      
      <WeekDays>
        {weekDays.map(day => (
          <WeekDay key={day}>{day}</WeekDay>
        ))}
      </WeekDays>
      
      <DaysGrid>
        {days.map((day, index) => (
          <DayCell
            key={index}
            $isToday={isToday(day.date)}
            $hasWorkout={hasWorkout(day.date)}
            onClick={() => handleDateClick(day.date)}
          >
            <DayNumber>{day.date.getDate()}</DayNumber>
            {hasWorkout(day.date) && <WorkoutBadge>💪</WorkoutBadge>}
          </DayCell>
        ))}
      </DaysGrid>
      
      {selectedDate && selectedWorkouts.length > 0 && (
        <WorkoutList>
          <h4 style={{ marginBottom: 12 }}>
            Workouts on {selectedDate.toDateString()}
          </h4>
          {selectedWorkouts.map((workout, i) => (
            <WorkoutItem key={i}>
              <FitnessCenter sx={{ color: '#0A84FF' }} />
              <div>
                <div style={{ fontWeight: 600 }}>{workout.workoutName}</div>
                <div style={{ fontSize: 12, color: '#6C6C7A' }}>
                  {workout.sets} sets × {workout.reps} reps • {workout.weight}kg
                </div>
              </div>
            </WorkoutItem>
          ))}
        </WorkoutList>
      )}
    </CalendarContainer>
  );
};

export default WorkoutCalendar;