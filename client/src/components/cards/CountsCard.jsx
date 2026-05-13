import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 ${({ theme }) => theme.primary + "40"}; }
  50% { box-shadow: 0 0 0 8px ${({ theme }) => theme.primary + "00"}; }
`;

const Card = styled.div`
  flex: 1;
  min-width: 200px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  display: flex;
  gap: 6px;
  background: ${({ theme }) => theme.card};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeInUp} 0.5s ease forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  opacity: 0;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px ${({ theme }) => theme.shadowHover};
    border-color: ${({ theme }) => theme.primary + "40"};
  }
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  letter-spacing: 0.5px;
`;

const Value = styled.div`
  font-weight: 800;
  font-size: 36px;
  display: flex;
  align-items: baseline;
  gap: 8px;
  color: ${({ theme }) => theme.text_primary};
  background: ${({ theme }) => theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Unit = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
  -webkit-text-fill-color: ${({ theme }) => theme.text_secondary};
`;

const Span = styled.div`
  font-weight: 600;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 20px;
  background: ${({ $positive, theme }) => 
    $positive ? theme.green + "20" : theme.red + "20"};
  color: ${({ $positive, theme }) => 
    $positive ? theme.green : theme.red};
`;

const Icon = styled.div`
  height: fit-content;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: ${({ $bg }) => $bg + "20"};
  color: ${({ $color }) => $color};
  transition: all 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
`;

const Desc = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 500;
`;

// Animated number counter
const AnimatedNumber = ({ value }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <>{count.toFixed(0)}</>;
};

const CountsCard = ({ item, data, index }) => {
  const value = data && data[item.key] !== undefined ? data[item.key] : 0;
  
  return (
    <Card $delay={index * 0.1}>
      <Left>
        <Title>{item.name}</Title>
        <Value>
          <AnimatedNumber value={value} />
          <Unit>{item.unit}</Unit>
          <Span $positive>(+10%)</Span>
        </Value>
        <Desc>{item.desc}</Desc>
      </Left>
      <Icon $color={item.color} $bg={item.lightColor}>
        {item.icon}
      </Icon>
    </Card>
  );
};

export default CountsCard;