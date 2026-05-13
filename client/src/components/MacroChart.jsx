import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Egg, Grass, LocalFireDepartment } from '@mui/icons-material';

const ChartContainer = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 20px;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 16px;
  background: ${({ theme, $color }) => theme[$color] + "10"};
  border-radius: 16px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme, $color }) => theme[$color]};
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 4px;
`;

const MacroChart = ({ dietData }) => {
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fat: 0 });

  const calculateMacros = () => {
    let protein = 0, carbs = 0, fat = 0;
    
    if (dietData) {
      Object.values(dietData).forEach(meal => {
        if (meal && Array.isArray(meal)) {
          meal.forEach(food => {
            protein += food.protein || 0;
            carbs += food.carbs || 0;
            fat += food.fat || 0;
          });
        }
      });
    }
    
    setMacros({ protein, carbs, fat });
  };

  useEffect(() => {
    calculateMacros();
  }, [dietData]);

  const pieData = [
    { name: 'Protein', value: macros.protein * 4, color: '#0A84FF' },
    { name: 'Carbs', value: macros.carbs * 4, color: '#34C759' },
    { name: 'Fat', value: macros.fat * 9, color: '#FF9F0A' },
  ];

  return (
    <ChartContainer>
      <Title><LocalFireDepartment /> Macronutrient Breakdown</Title>
      
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `${Math.round(value)} cal`}
            contentStyle={{ background: '#14141F', border: 'none', borderRadius: 8, color: '#fff' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
      <StatsGrid>
        <StatCard $color="primary">
          <Egg sx={{ fontSize: 24, color: '#0A84FF' }} />
          <StatValue $color="primary">{macros.protein.toFixed(0)}g</StatValue>
          <StatLabel>Protein</StatLabel>
        </StatCard>
        <StatCard $color="green">
          <Grass sx={{ fontSize: 24, color: '#34C759' }} />
          <StatValue $color="green">{macros.carbs.toFixed(0)}g</StatValue>
          <StatLabel>Carbs</StatLabel>
        </StatCard>
        <StatCard $color="orange">
          <LocalFireDepartment sx={{ fontSize: 24, color: '#FF9F0A' }} />
          <StatValue $color="orange">{macros.fat.toFixed(0)}g</StatValue>
          <StatLabel>Fat</StatLabel>
        </StatCard>
      </StatsGrid>
    </ChartContainer>
  );
};

export default MacroChart;