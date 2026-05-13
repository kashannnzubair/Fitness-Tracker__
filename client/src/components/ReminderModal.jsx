import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  Close, AccessTime, FitnessCenter, Restaurant, 
  WaterDrop, NotificationsActive 
} from '@mui/icons-material';
import { IconButton, CircularProgress } from '@mui/material';

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 24px;
  width: 90%;
  max-width: 450px;
  animation: ${fadeIn} 0.3s ease;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bgLight};
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Content = styled.div`
  padding: 24px;
`;

const ReminderType = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const TypeBtn = styled.button`
  flex: 1;
  padding: 12px;
  background: ${({ $active, theme }) => $active ? theme.primary : theme.bgLight};
  border: 1px solid ${({ $active, theme }) => $active ? theme.primary : theme.border};
  border-radius: 12px;
  color: ${({ $active, theme }) => $active ? 'white' : theme.text_primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  color: ${({ theme }) => theme.text_primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const TimeInput = styled.input`
  padding: 12px;
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  color: ${({ theme }) => theme.text_primary};
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
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
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ReminderList = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const ReminderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: ${({ theme }) => theme.bgLight};
  border-radius: 10px;
  margin-bottom: 8px;
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: #FF453A;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ReminderModal = ({ isOpen, onClose }) => {
  const [reminderType, setReminderType] = useState('workout');
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load reminders from localStorage
    const saved = localStorage.getItem('fittrack-reminders');
    if (saved) {
      setReminders(JSON.parse(saved));
    }
  }, []);

  const saveReminders = (newReminders) => {
    localStorage.setItem('fittrack-reminders', JSON.stringify(newReminders));
    setReminders(newReminders);
    
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const addReminder = () => {
    if (!title) return;
    
    setIsLoading(true);
    const newReminder = {
      id: Date.now(),
      type: reminderType,
      title,
      time,
      active: true,
    };
    
    const updated = [...reminders, newReminder];
    saveReminders(updated);
    
    // Schedule notification
    scheduleNotification(newReminder);
    
    setTitle('');
    setIsLoading(false);
  };

  const scheduleNotification = (reminder) => {
    const [hours, minutes] = reminder.time.split(':');
    const now = new Date();
    const scheduled = new Date();
    scheduled.setHours(parseInt(hours), parseInt(minutes), 0);
    
    if (scheduled < now) {
      scheduled.setDate(scheduled.getDate() + 1);
    }
    
    const timeUntil = scheduled - now;
    
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('FitTrack Reminder', {
          body: reminder.title,
          icon: '/logo192.png'
        });
      }
    }, timeUntil);
  };

  const deleteReminder = (id) => {
    const updated = reminders.filter(r => r.id !== id);
    saveReminders(updated);
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <NotificationsActive /> Set Reminder
          </Title>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Header>
        
        <Content>
          <ReminderType>
            <TypeBtn 
              $active={reminderType === 'workout'} 
              onClick={() => setReminderType('workout')}
            >
              <FitnessCenter sx={{ fontSize: 18 }} /> Workout
            </TypeBtn>
            <TypeBtn 
              $active={reminderType === 'meal'} 
              onClick={() => setReminderType('meal')}
            >
              <Restaurant sx={{ fontSize: 18 }} /> Meal
            </TypeBtn>
            <TypeBtn 
              $active={reminderType === 'water'} 
              onClick={() => setReminderType('water')}
            >
              <WaterDrop sx={{ fontSize: 18 }} /> Water
            </TypeBtn>
          </ReminderType>
          
          <InputGroup>
            <Label>Reminder Title</Label>
            <Input 
              placeholder="e.g., Morning Workout, Lunch Time"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </InputGroup>
          
          <InputGroup>
            <Label>Time</Label>
            <TimeInput 
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </InputGroup>
          
          <Button onClick={addReminder} disabled={isLoading || !title}>
            {isLoading ? <CircularProgress size={20} style={{ color: 'white' }} /> : <><AccessTime /> Set Reminder</>}
          </Button>
          
          {reminders.length > 0 && (
            <ReminderList>
              <Label>Active Reminders</Label>
              {reminders.map(reminder => (
                <ReminderItem key={reminder.id}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{reminder.title}</div>
                    <div style={{ fontSize: 12, color: '#6C6C7A' }}>{reminder.time} • {reminder.type}</div>
                  </div>
                  <DeleteBtn onClick={() => deleteReminder(reminder.id)}>🗑️</DeleteBtn>
                </ReminderItem>
              ))}
            </ReminderList>
          )}
        </Content>
      </Modal>
    </Overlay>
  );
};

export default ReminderModal;