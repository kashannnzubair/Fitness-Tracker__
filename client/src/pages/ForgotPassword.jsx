import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { Mail, ArrowBack, Send } from '@mui/icons-material';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.bg};
  padding: 20px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 35px ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  background: ${({ theme }) => theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
  margin-bottom: 30px;
  font-size: 14px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary + "20"};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: ${({ theme }) => theme.gradient};
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px ${({ theme }) => theme.primary + "40"};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BackLink = styled.div`
  text-align: center;
  margin-top: 20px;
  
  span {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Message = styled.div`
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
  
  ${({ $type }) => $type === 'error' && `
    background: #FF453A20;
    color: #FF453A;
    border: 1px solid #FF453A40;
  `}
  
  ${({ $type }) => $type === 'success' && `
    background: #34C75920;
    color: #34C759;
    border: 1px solid #34C75940;
  `}
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await axios.post('http://localhost:8000/api/user/forgot-password', { email });
      setMessage(res.data.message || 'OTP sent to your email!');
      setTimeout(() => {
        navigate(`/verify-otp/${email}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Forgot Password? 🔐</Title>
        <Subtitle>Enter your email to reset your password</Subtitle>
        
        {error && <Message $type="error">{error}</Message>}
        {message && <Message $type="success">{message}</Message>}
        
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Email Address</Label>
            <Input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </InputGroup>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <CircularProgress size={20} style={{ color: 'white' }} /> : <><Send style={{ fontSize: 18 }} /> Send Reset Link</>}
          </Button>
        </form>
        
        <BackLink>
          <span onClick={() => navigate('/auth')}>
            <ArrowBack style={{ fontSize: 16 }} /> Back to Login
          </span>
        </BackLink>
      </Card>
    </Container>
  );
};

export default ForgotPassword;