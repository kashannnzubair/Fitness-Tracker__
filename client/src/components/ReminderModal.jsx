import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { 
  Close, AccessTime, FitnessCenter, Restaurant, 
  WaterDrop, NotificationsActive, Delete, Edit
} from "@mui/icons-material";
import { IconButton, CircularProgress, Checkbox, FormControlLabel } from "@mui/material";
import { saveReminder, getReminders, deleteReminder } from "../api";

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
  max-width: 500px;
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
  color: ${({ $active, theme }) => $active ? "white" : theme.text_primary};
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

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-top: 8px;
`;

const DayChip = styled.button`
  padding: 8px 4px;
  background: ${({ $active, theme }) => $active ? theme.primary : theme.bgLight};
  border: 1px solid ${({ $active, theme }) => $active ? theme.primary : theme.border};
  border-radius: 8px;
  color: ${({ $active, theme }) => $active ? "white" : theme.text_primary};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
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
  max-height: 300px;
  overflow-y: auto;
`;

const ReminderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: ${({ theme }) => theme.bgLight};
  border-radius: 10px;
  margin-bottom: 8px;
  
  &:hover {
    background: ${({ theme }) => theme.primary + "10"};
  }
`;

const ReminderInfo = styled.div`
  flex: 1;
  
  .title {
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
  }
  
  .details {
    font-size: 11px;
    color: ${({ theme }) => theme.text_secondary};
    margin-top: 4px;
    display: flex;
    gap: 12px;
  }
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: #FF453A;
  cursor: pointer;
  padding: 8px;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ReminderModal = ({ isOpen, onClose, onReminderUpdate }) => {
  const [reminderType, setReminderType] = useState("workout");
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");
  const [selectedDays, setSelectedDays] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadReminders();
    }
  }, [isOpen]);

  const loadReminders = async () => {
    try {
      const res = await getReminders();
      setReminders(res.data?.reminders || []);
    } catch (err) {
      console.log("Error loading reminders:", err);
    }
  };

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const addReminder = async () => {
    if (!title) {
      alert("Please enter a reminder title");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await saveReminder({
        type: reminderType,
        title: title,
        time: time,
        days: selectedDays,
        active: true
      });
      
      if (response.data.success) {
        await loadReminders();
        setTitle("");
        setSelectedDays([]);
        setTime("09:00");
        if (onReminderUpdate) onReminderUpdate();
        // Show browser notification
        if (Notification.permission === "granted") {
          new Notification("Reminder Set!", {
            body: `${title} at ${time}`,
            icon: "/logo192.png"
          });
        }
      }
    } catch (err) {
      console.log("Error saving reminder:", err);
      alert("Failed to save reminder");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReminder = async (id) => {
    if (window.confirm("Delete this reminder?")) {
      try {
        await deleteReminder(id);
        await loadReminders();
        if (onReminderUpdate) onReminderUpdate();
      } catch (err) {
        console.log("Error deleting reminder:", err);
      }
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case "workout": return <FitnessCenter sx={{ fontSize: 14 }} />;
      case "meal": return <Restaurant sx={{ fontSize: 14 }} />;
      case "water": return <WaterDrop sx={{ fontSize: 14 }} />;
      default: return <NotificationsActive sx={{ fontSize: 14 }} />;
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
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
              $active={reminderType === "workout"} 
              onClick={() => setReminderType("workout")}
            >
              <FitnessCenter sx={{ fontSize: 18 }} /> Workout
            </TypeBtn>
            <TypeBtn 
              $active={reminderType === "meal"} 
              onClick={() => setReminderType("meal")}
            >
              <Restaurant sx={{ fontSize: 18 }} /> Meal
            </TypeBtn>
            <TypeBtn 
              $active={reminderType === "water"} 
              onClick={() => setReminderType("water")}
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
          
          <InputGroup>
            <Label>Repeat Days (Optional)</Label>
            <DaysGrid>
              {daysOfWeek.map(day => (
                <DayChip
                  key={day}
                  $active={selectedDays.includes(day)}
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </DayChip>
              ))}
            </DaysGrid>
            {selectedDays.length === 0 && (
              <div style={{ fontSize: 11, color: "#6C6C7A", marginTop: 6 }}>
                No days selected = repeats daily
              </div>
            )}
          </InputGroup>
          
          <Button onClick={addReminder} disabled={isLoading || !title}>
            {isLoading ? <CircularProgress size={20} style={{ color: 'white' }} /> : <><AccessTime /> Set Reminder</>}
          </Button>
          
          {reminders.length > 0 && (
            <ReminderList>
              <Label style={{ marginBottom: 12 }}>Your Reminders</Label>
              {reminders.map(reminder => (
                <ReminderItem key={reminder._id}>
                  <ReminderInfo>
                    <div className="title">
                      {getTypeIcon(reminder.type)} {reminder.title}
                    </div>
                    <div className="details">
                      <span>⏰ {reminder.time}</span>
                      {reminder.days?.length > 0 && (
                        <span>📅 {reminder.days.join(", ")}</span>
                      )}
                    </div>
                  </ReminderInfo>
                  <DeleteBtn onClick={() => handleDeleteReminder(reminder._id)}>
                    <Delete sx={{ fontSize: 18 }} />
                  </DeleteBtn>
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