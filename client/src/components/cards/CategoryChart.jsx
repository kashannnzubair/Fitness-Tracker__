import React from "react";
import styled from "styled-components";

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
  transition: all 0.3s ease;
  
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

const NoData = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.text_secondary};
  background: ${({ theme }) => theme.bgLight};
  border-radius: 16px;
  
  .icon {
    font-size: 48px;
    margin-bottom: 12px;
  }
`;

const CategoryChart = ({ data }) => {
  const pieData = data?.pieChartData ?? [];
  const hasData = pieData.length > 0;

  return (
    <Card>
      <Title>🥧 Workout Distribution</Title>
      {hasData ? (
        <div style={{ padding: '20px' }}>
          {pieData.map((item, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '10px',
              marginBottom: '8px',
              background: '#14141F',
              borderRadius: '10px'
            }}>
              <span>{item.label}</span>
              <span style={{ color: '#0A84FF', fontWeight: 'bold' }}>{item.value} cal</span>
            </div>
          ))}
        </div>
      ) : (
        <NoData>
          <div className="icon">🏋️</div>
          <div>No workout data available</div>
          <div style={{ fontSize: 12, marginTop: 8 }}>Add your first workout to see distribution!</div>
        </NoData>
      )}
    </Card>
  );
};

export default CategoryChart;