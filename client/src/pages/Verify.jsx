import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
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
  padding: 48px 40px;
  width: 100%;
  max-width: 450px;
  text-align: center;
  box-shadow: 0 20px 35px ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  animation: fadeIn 0.5s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  
  ${({ $type }) => $type === 'success' && `
    background: #34C75920;
    color: #34C759;
  `}
  
  ${({ $type }) => $type === 'error' && `
    background: #FF453A20;
    color: #FF453A;
  `}
  
  ${({ $type }) => $type === 'loading' && `
    background: ${({ theme }) => theme.primary + "20"};
    color: ${({ theme }) => theme.primary};
  `}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 12px;
`;

const Message = styled.p`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: ${({ theme }) => theme.gradient};
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px ${({ theme }) => theme.primary + "40"};
  }
`;

const Verify = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.post('http://localhost:8000/api/user/verify', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (res.data.success) {
          setStatus('success');
          setMessage(res.data.message || 'Email verified successfully!');
          setTimeout(() => {
            navigate('/auth');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(res.data.message || 'Invalid or expired verification link');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. Please try again.');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [token, navigate]);

  const getIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle size={48} />;
      case 'error':
        return <XCircle size={48} />;
      default:
        return <Loader2 size={48} className="spin" />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'success':
        return 'Email Verified! ✅';
      case 'error':
        return 'Verification Failed ❌';
      default:
        return 'Verifying Email...';
    }
  };

  return (
    <Container>
      <Card>
        <IconWrapper $type={status}>
          {getIcon()}
        </IconWrapper>
        <Title>{getTitle()}</Title>
        <Message>{message}</Message>
        {status !== 'loading' && (
          <Button onClick={() => navigate('/auth')}>
            Go to Login
          </Button>
        )}
      </Card>
    </Container>
  );
};

export default Verify;