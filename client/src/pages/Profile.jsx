import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { Avatar, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { 
  Edit, Save, Cancel, PhotoCamera, 
  Email, Person, Lock, CheckCircle 
} from '@mui/icons-material';
import axios from 'axios';
import { loginSuccess } from '../redux/reducers/userSlice';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  flex: 1;
  padding: 40px;
  background: ${({ theme }) => theme.bg};
  min-height: calc(100vh - 80px);
`;

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 10px 30px ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  animation: ${fadeIn} 0.5s ease;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  background: ${({ theme }) => theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 32px;
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
`;

const AvatarWrapper = styled.div`
  position: relative;
  cursor: pointer;
`;

const StyledAvatar = styled(Avatar)`
  width: 120px !important;
  height: 120px !important;
  border: 3px solid ${({ theme }) => theme.primary};
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }
`;

const UploadBtn = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background: ${({ theme }) => theme.primary};
  border-radius: 50%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 600;
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
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  
  ${({ $primary, theme }) => $primary ? `
    background: ${theme.gradient};
    color: white;
    border: none;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px ${theme.primary + "40"};
    }
  ` : `
    background: transparent;
    color: ${theme.text_secondary};
    border: 1px solid ${theme.border};
    
    &:hover {
      border-color: ${theme.red};
      color: ${theme.red};
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 32px;
`;

const SuccessMessage = styled.div`
  background: #34C75920;
  color: #34C759;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user?.user);
  const token = useSelector(state => state.user?.token);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profilePic, setProfilePic] = useState(user?.img || null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be under 2MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = async () => {
      const imgBase64 = reader.result;
      setProfilePic(imgBase64);
      
      try {
        setIsLoading(true);
        const res = await axios.patch('http://localhost:8000/api/user/profile', 
          { img: imgBase64 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Update Redux store
        dispatch(loginSuccess({ 
          token: token, 
          user: { ...user, img: imgBase64 } 
        }));
        
        // Update localStorage
        localStorage.setItem("fittrack-app-user", JSON.stringify({ ...user, img: imgBase64 }));
        
        setMessage('Profile picture updated!');
        
        // ✅ FORCE PAGE RELOAD AFTER 1 SECOND
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
      } catch (err) {
        setError('Failed to update profile picture');
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async () => {
    setError('');
    setMessage('');
    setIsLoading(true);
    
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      };
      
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('New passwords do not match');
          setIsLoading(false);
          return;
        }
        if (formData.newPassword.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      const res = await axios.patch('http://localhost:8000/api/user/profile', 
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      dispatch(loginSuccess({ 
        token: token, 
        user: { ...user, name: formData.name, email: formData.email } 
      }));
      
      localStorage.setItem("fittrack-app-user", JSON.stringify({ ...user, name: formData.name, email: formData.email }));
      
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Card>
          <Title>My Profile</Title>
          <Subtitle>Manage your account settings and preferences</Subtitle>
          
          {message && <SuccessMessage><CheckCircle /> {message}</SuccessMessage>}
          {error && <SuccessMessage style={{ background: '#FF453A20', color: '#FF453A' }}>{error}</SuccessMessage>}
          
          <AvatarSection>
            <AvatarWrapper onClick={() => fileInputRef.current?.click()}>
              <StyledAvatar src={profilePic}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </StyledAvatar>
              <UploadBtn>
                <PhotoCamera sx={{ fontSize: 18, color: 'white' }} />
              </UploadBtn>
            </AvatarWrapper>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <p style={{ marginTop: 12, color: '#6C6C7A', fontSize: 12 }}>
              Click to change profile picture
            </p>
          </AvatarSection>
          
          <FormGroup>
            <Label><Person sx={{ fontSize: 16, marginRight: 4 }} /> Full Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter your name"
            />
          </FormGroup>
          
          <FormGroup>
            <Label><Email sx={{ fontSize: 16, marginRight: 4 }} /> Email Address</Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter your email"
            />
          </FormGroup>
          
          {isEditing && (
            <>
              <FormGroup>
                <Label><Lock sx={{ fontSize: 16, marginRight: 4 }} /> Current Password (required to change password)</Label>
                <Input
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                />
              </FormGroup>
              
              <Row>
                <FormGroup>
                  <Label>New Password</Label>
                  <Input
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Confirm New Password</Label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                </FormGroup>
              </Row>
            </>
          )}
          
          <ButtonGroup>
            {!isEditing ? (
              <Button $primary onClick={() => setIsEditing(true)}>
                <Edit /> Edit Profile
              </Button>
            ) : (
              <>
                <Button onClick={() => setIsEditing(false)} disabled={isLoading}>
                  <Cancel /> Cancel
                </Button>
                <Button $primary onClick={handleUpdateProfile} disabled={isLoading}>
                  {isLoading ? <CircularProgress size={20} /> : <><Save /> Save Changes</>}
                </Button>
              </>
            )}
          </ButtonGroup>
        </Card>
      </Wrapper>
    </Container>
  );
};

export default Profile;