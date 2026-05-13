import React, { useEffect, useState, useCallback } from "react";
import styled, { keyframes, css } from "styled-components";
import { counts } from "../utils/data";
import CountsCard from "../components/cards/CountsCard";
import WeeklyStatCard from "../components/cards/WeeklyStatCard";
import CategoryChart from "../components/cards/CategoryChart";
import AddWorkout from "../components/AddWorkout";
import WorkoutCard from "../components/cards/WorkoutCard";
import { addWorkout, getDashboardDetails, getWorkouts } from "../api";

const pageFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 30px 0;
  overflow-y: auto;
  animation: ${pageFadeIn} 0.5s ease;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const SectionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 0 20px;
`;

const SectionTitle = styled.h3`
  padding: 0 20px;
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  background: ${({ theme }) => theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
`;

const WorkoutGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 0 20px;
`;

const EmptyState = styled.div`
  padding: 60px;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 16px;
  width: 100%;
  background: ${({ theme }) => theme.card};
  border-radius: 20px;
  border: 2px dashed ${({ theme }) => theme.border};
  animation: ${float} 3s ease-in-out infinite;
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ToastItem = styled.div`
  padding: 14px 24px;
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  min-width: 250px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  background: ${({ $type }) => 
    $type === "success" 
      ? "linear-gradient(135deg, #34C759, #28A745)" 
      : "linear-gradient(135deg, #FF3B30, #DC2626)"};
  animation: ${({ $leaving }) =>
    $leaving
      ? css`fadeOutRight 0.3s ease forwards`
      : css`fadeInRight 0.3s ease`};
  
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(100px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes fadeOutRight {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100px); }
  }
`;

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, leaving: false }]);
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 2700);
  }, []);

  const ToastRenderer = (
    <ToastContainer>
      {toasts.map((t) => (
        <ToastItem key={t.id} $type={t.type} $leaving={t.leaving}>
          {t.type === "success" ? "🎉 " : "⚠️ "}
          {t.message}
        </ToastItem>
      ))}
    </ToastContainer>
  );

  return { showToast, ToastRenderer };
};

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const { showToast, ToastRenderer } = useToast();

  const getDashboardData = async () => {
    setLoading(true);
    try {
      const res = await getDashboardDetails();
      setData(res.data);
    } catch (err) {
      showToast("Failed to load dashboard", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkouts = async () => {
    try {
      const res = await getWorkouts();
      setTodaysWorkouts(res?.data?.todaysWorkouts || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDashboardData();
    fetchWorkouts();
  }, []);

  const addNewWorkout = async (workoutString) => {
    setButtonLoading(true);
    try {
      await addWorkout({ workoutString });
      showToast("Workout Added Successfully! 🎯");
      getDashboardData();
      fetchWorkouts();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add workout", "error");
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <Container>
      {ToastRenderer}
      <Wrapper>
        <SectionRow>
          {counts.map((item, index) => (
            <CountsCard key={item.name} item={item} data={data} index={index} />
          ))}
        </SectionRow>

        <SectionRow>
          <WeeklyStatCard data={data} />
          <CategoryChart data={data} />
          <AddWorkout addNewWorkout={addNewWorkout} buttonLoading={buttonLoading} />
        </SectionRow>

        <SectionTitle>💪 Today's Workouts</SectionTitle>
        <WorkoutGrid>
          {todaysWorkouts.length > 0 ? (
            todaysWorkouts.map((workout, index) => (
              <WorkoutCard key={index} workout={workout} index={index} />
            ))
          ) : (
            <EmptyState>
              ✨ No workouts logged today. Add one above! ✨
            </EmptyState>
          )}
        </WorkoutGrid>
      </Wrapper>
    </Container>
  );
};

export default Dashboard;