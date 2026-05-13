import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { CheckCircle, Refresh } from '@mui/icons-material';
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
  max-width: 500px;
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

const OtpContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 30px;
  
  @media (max-width: 500px) {
    gap: 8px;
  }
`;

const OtpInput = styled.input`
  width: 55px;
  height: 65px;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  background: ${({ theme }) => theme.bgLight};
  border: 2px solid ${({ theme, $hasValue }) => $hasValue ? theme.primary : theme.border};
  border-radius: 12px;
  color: ${({ theme }) => theme.text_primary};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary + "20"};
  }
  
  @media (max-width: 500px) {
    width: 45px;
    height: 55px;
    font-size: 20px;
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
  margin-bottom: 12px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px ${({ theme }) => theme.primary + "40"};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const OutlineButton = styled(Button)`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text_primary};
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.bgLight};
    transform: translateY(-2px);
    box-shadow: none;
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
`;

const SuccessBox = styled.div`
  text-align: center;
  padding: 20px;
  
  .check-icon {
    width: 70px;
    height: 70px;
    background: #34C75920;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    color: #34C759;
  }
  
  h3 {
    color: ${({ theme }) => theme.text_primary};
    margin-bottom: 10px;
  }
  
  p {
    color: ${({ theme }) => theme.text_secondary};
    font-size: 14px;
  }
`;

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef([]);
  const { email } = useParams();
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await axios.post(`http://localhost:8000/api/user/verify-otp/${email}`, {
        otp: otpValue
      });
      setSuccess(true);
      setTimeout(() => {
        navigate(`/change-password/${email}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
  };

  if (success) {
    return (
      <Container>
        <Card>
          <SuccessBox>
            <div className="check-icon">
              <CheckCircle style={{ fontSize: 40 }} />
            </div>
            <h3>Verification Successful! ✅</h3>
            <p>Your OTP has been verified. Redirecting to reset password...</p>
            <div style={{ marginTop: 20 }}>
              <CircularProgress size={24} />
            </div>
          </SuccessBox>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Title>Verify OTP 🔢</Title>
        <Subtitle>Enter the 6-digit code sent to your email</Subtitle>
        
        {error && <Message $type="error">{error}</Message>}
        
        <OtpContainer>
          {otp.map((digit, index) => (
            <OtpInput
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => (inputRefs.current[index] = el)}
              $hasValue={digit !== ''}
            />
          ))}
        </OtpContainer>
        
        <Button onClick={handleVerify} disabled={isLoading || otp.some(d => d === '')}>
          {isLoading ? <CircularProgress size={20} style={{ color: 'white' }} /> : 'Verify Code'}
        </Button>
        
        <OutlineButton onClick={handleClear} disabled={isLoading}>
          <Refresh style={{ fontSize: 16 }} /> Clear All
        </OutlineButton>
      </Card>
    </Container>
  );
};

export default VerifyOTP;