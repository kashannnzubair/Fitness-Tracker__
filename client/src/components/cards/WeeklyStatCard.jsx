import React from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Card = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  background: ${({ theme }) => theme.card};
  box-shadow: 0 4px 20px ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${fadeIn} 0.5s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px ${({ theme }) => theme.shadowHover};
  }
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 18px;
  background: ${({ theme }) => theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: ${({ theme }) => theme.bgLight};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  
  .day {
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
  }
  
  .calories {
    font-weight: 700;
    color: ${({ theme }) => theme.primary};
  }
`;

const NoData = styled.div`
  text-align: center;
  padding: 40px;
  color: ${({ theme }) => theme.text_secondary};
  background: ${({ theme }) => theme.bgLight};
  border-radius: 16px;
  
  .icon {
    font-size: 48px;
    margin-bottom: 12px;
  }
`;

const WeeklyStatCard = ({ data }) => {
  const weeklyStats = data?.weeklyStats ?? [];
  const hasData = weeklyStats.length > 0;

  return (
    <Card>
      <Title>📊 Weekly Calories Burned</Title>
      {hasData ? (
        <StatsList>
          {weeklyStats.map((stat, i) => (
            <StatItem key={i}>
              <span className="day">
                {new Date(stat._id).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <span className="calories">{stat.calories} kcal</span>
            </StatItem>
          ))}
        </StatsList>
      ) : (
        <NoData>
          <div className="icon">📈</div>
          <div>No workout data this week</div>
          <div style={{ fontSize: 12, marginTop: 8 }}>Start adding workouts to see your progress!</div>
        </NoData>
      )}
    </Card>
  );
};

export default WeeklyStatCard;