import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
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
  background: ${({ theme }) => theme.primary + "20"};
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
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
  margin-bottom: 16px;
`;

const EmailHighlight = styled.span`
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  background: ${({ theme }) => theme.primary + "10"};
  padding: 4px 8px;
  border-radius: 8px;
  display: inline-block;
  margin-top: 8px;
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
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px ${({ theme }) => theme.primary + "40"};
  }
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Timer = styled.span`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 13px;
  margin-left: 8px;
`;

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    // Get email from location state or localStorage
    const stateEmail = location.state?.email;
    const storedEmail = localStorage.getItem('verification-email');
    
    if (stateEmail) {
      setEmail(stateEmail);
      localStorage.setItem('verification-email', stateEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [location]);

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    setResendTimer(60);
    setResendMessage('');
    
    try {
      const response = await fetch('http://localhost:8000/api/user/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResendMessage('Verification email resent successfully!');
        // Start countdown timer
        const interval = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setResendMessage(data.message || 'Failed to resend email');
        setResendTimer(0);
      }
    } catch (error) {
      console.error('Resend error:', error);
      setResendMessage('Network error. Please try again.');
      setResendTimer(0);
    }
  };

  return (
    <Container>
      <Card>
        <IconWrapper>
          <Mail size={48} />
        </IconWrapper>
        
        <Title>Check Your Email 📧</Title>
        
        <Message>
          We've sent a verification link to:
          <EmailHighlight>{email || 'your email address'}</EmailHighlight>
        </Message>
        
        <Message style={{ fontSize: '13px', marginTop: '8px' }}>
          Please check your inbox and click the verification link to activate your account.
          <br />
          <span style={{ opacity: 0.7 }}>Didn't receive the email? Check your spam folder.</span>
        </Message>
        
        <Button onClick={() => navigate('/auth')}>
          Back to Login <ArrowRight size={16} />
        </Button>
        
        <div>
          <ResendButton onClick={handleResend} disabled={resendTimer > 0}>
            Resend Verification Email
            {resendTimer > 0 && <Timer>({resendTimer}s)</Timer>}
          </ResendButton>
        </div>
        
        {resendMessage && (
          <Message style={{ color: '#34C759', marginTop: '12px' }}>
            <CheckCircle size={16} style={{ display: 'inline', marginRight: '6px' }} />
            {resendMessage}
          </Message>
        )}
      </Card>
    </Container>
  );
};

export default VerifyEmail;