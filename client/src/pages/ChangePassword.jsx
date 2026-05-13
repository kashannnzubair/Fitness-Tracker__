import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff, CheckCircle } from '@mui/icons-material';
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

const StyledTextField = styled(TextField)`
  width: 100%;
  
  & .MuiOutlinedInput-root {
    color: ${({ theme }) => theme.text_primary};
    
    & fieldset {
      border-color: ${({ theme }) => theme.border};
    }
    
    &:hover fieldset {
      border-color: ${({ theme }) => theme.primary};
    }
    
    &.Mui-focused fieldset {
      border-color: ${({ theme }) => theme.primary};
    }
  }
  
  & .MuiInputLabel-root {
    color: ${({ theme }) => theme.text_secondary};
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

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { email } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await axios.post(`http://localhost:8000/api/user/change-password/${email}`, {
        newPassword,
        confirmPassword
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Container>
        <Card>
          <SuccessBox>
            <div className="check-icon">
              <CheckCircle style={{ fontSize: 40 }} />
            </div>
            <h3>Password Changed! 🎉</h3>
            <p>Your password has been successfully updated. Redirecting to login...</p>
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
        <Title>Set New Password 🔒</Title>
        <Subtitle>Create a strong password for your account</Subtitle>
        
        {error && <Message $type="error">{error}</Message>}
        
        <InputGroup>
          <Label>New Password</Label>
          <StyledTextField
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </InputGroup>
        
        <InputGroup>
          <Label>Confirm Password</Label>
          <StyledTextField
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </InputGroup>
        
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <CircularProgress size={20} style={{ color: 'white' }} /> : 'Update Password'}
        </Button>
      </Card>
    </Container>
  );
};

export default ChangePassword;