import { FitnessCenterRounded, TimelapseRounded } from "@mui/icons-material";
import React from "react";
import styled, { keyframes } from "styled-components";

const fadeInScale = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const Card = styled.div`
  flex: 1;
  min-width: 250px;
  max-width: 400px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  background: ${({ theme }) => theme.card};
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeInScale} 0.4s ease forwards;
  animation-delay: ${({ $delay }) => $delay * 0.1}s;
  opacity: 0;
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 20px 40px ${({ theme }) => theme.shadowHover};
    border-color: ${({ theme }) => theme.primary + "40"};
  }
`;

const Category = styled.div`
  width: fit-content;
  font-size: 12px;
  color: ${({ theme }) => theme.primary};
  font-weight: 700;
  background: ${({ theme }) => theme.primary + "15"};
  padding: 6px 14px;
  border-radius: 20px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const Name = styled.div`
  font-size: 20px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 700;
`;

const Sets = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 500;
  display: flex;
  gap: 8px;
`;

const Flex = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 4px;
`;

const Details = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${({ theme }) => theme.bgLight};
  border-radius: 10px;
`;

const WorkoutCard = ({ workout, index = 0 }) => {
  return (
    <Card $delay={index}>
      <Category>#{workout?.category}</Category>
      <Name>{workout?.workoutName}</Name>
      <Sets>
        🔥 {workout?.sets} sets × {workout?.reps} reps
      </Sets>
      <Flex>
        <Details>
          <FitnessCenterRounded sx={{ fontSize: "18px" }} />
          {workout?.weight} kg
        </Details>
        <Details>
          <TimelapseRounded sx={{ fontSize: "18px" }} />
          {workout?.duration} min
        </Details>
      </Flex>
    </Card>
  );
};

export default WorkoutCard;