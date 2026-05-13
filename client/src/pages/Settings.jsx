import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { 
  Notifications, 
  FitnessCenter, 
  Straighten, 
  Language,
  DarkMode,
  LightMode,
  Save,
  VolumeUp,
  VolumeOff
} from '@mui/icons-material';
import { Switch, FormControlLabel, CircularProgress } from '@mui/material';

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
  max-width: 800px;
  margin: 0 auto;
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

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.5s ease;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border + "40"};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  .icon {
    color: ${({ theme }) => theme.primary};
  }
  
  .title {
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
  }
  
  .desc {
    font-size: 12px;
    color: ${({ theme }) => theme.text_secondary};
    margin-top: 2px;
  }
`;

const Select = styled.select`
  padding: 8px 16px;
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  color: ${({ theme }) => theme.text_primary};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background: ${({ theme }) => theme.gradient};
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const Settings = ({ toggleTheme, isDark }) => {
  const user = useSelector(state => state.user?.user);
  
  const [settings, setSettings] = useState({
    notifications: true,
    workoutReminders: true,
    mealReminders: false,
    soundEffects: true,
    units: 'kg', // kg or lbs
    distanceUnit: 'km', // km or miles
    language: 'en',
    autoBackup: true,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('fittrack-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveSettings = () => {
    setIsLoading(true);
    localStorage.setItem('fittrack-settings', JSON.stringify(settings));
    setMessage('Settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
    setIsLoading(false);
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Container>
      <Wrapper>
        <Title>⚙️ Settings</Title>
        <Subtitle>Customize your app preferences</Subtitle>
        
        {message && (
          <div style={{ 
            background: '#34C75920', 
            color: '#34C759', 
            padding: 12, 
            borderRadius: 12, 
            marginBottom: 20,
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}
        
        {/* Appearance Settings */}
        <Card>
          <CardTitle>
            <DarkMode /> Appearance
          </CardTitle>
          <SettingRow>
            <SettingLabel>
              <div className="icon">{isDark ? <DarkMode /> : <LightMode />}</div>
              <div>
                <div className="title">Dark Mode</div>
                <div className="desc">Switch between light and dark theme</div>
              </div>
            </SettingLabel>
            <Switch 
              checked={isDark} 
              onChange={toggleTheme}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#0A84FF',
                },
              }}
            />
          </SettingRow>
        </Card>
        
        {/* Notification Settings */}
        <Card>
          <CardTitle>
            <Notifications /> Notifications
          </CardTitle>
          <SettingRow>
            <SettingLabel>
              <div>
                <div className="title">Push Notifications</div>
                <div className="desc">Receive notifications about your fitness journey</div>
              </div>
            </SettingLabel>
            <Switch 
              checked={settings.notifications} 
              onChange={(e) => updateSetting('notifications', e.target.checked)}
            />
          </SettingRow>
          <SettingRow>
            <SettingLabel>
              <div>
                <div className="title">Workout Reminders</div>
                <div className="desc">Get reminded about your daily workouts</div>
              </div>
            </SettingLabel>
            <Switch 
              checked={settings.workoutReminders} 
              onChange={(e) => updateSetting('workoutReminders', e.target.checked)}
              disabled={!settings.notifications}
            />
          </SettingRow>
          <SettingRow>
            <SettingLabel>
              <div>
                <div className="title">Meal Reminders</div>
                <div className="desc">Get reminded about meal times</div>
              </div>
            </SettingLabel>
            <Switch 
              checked={settings.mealReminders} 
              onChange={(e) => updateSetting('mealReminders', e.target.checked)}
              disabled={!settings.notifications}
            />
          </SettingRow>
        </Card>
        
        {/* Units Settings */}
        <Card>
          <CardTitle>
            <Straighten /> Units & Measurement
          </CardTitle>
          <SettingRow>
            <SettingLabel>
              <div>
                <div className="title">Weight Unit</div>
                <div className="desc">Choose your preferred weight unit</div>
              </div>
            </SettingLabel>
            <Select 
              value={settings.units} 
              onChange={(e) => updateSetting('units', e.target.value)}
            >
              <option value="kg">Kilograms (kg)</option>
              <option value="lbs">Pounds (lbs)</option>
            </Select>
          </SettingRow>
          <SettingRow>
            <SettingLabel>
              <div>
                <div className="title">Distance Unit</div>
                <div className="desc">Choose your preferred distance unit</div>
              </div>
            </SettingLabel>
            <Select 
              value={settings.distanceUnit} 
              onChange={(e) => updateSetting('distanceUnit', e.target.value)}
            >
              <option value="km">Kilometers (km)</option>
              <option value="miles">Miles (mi)</option>
            </Select>
          </SettingRow>
        </Card>
        
        {/* Sound Settings */}
        <Card>
          <CardTitle>
            <VolumeUp /> Sound
          </CardTitle>
          <SettingRow>
            <SettingLabel>
              <div>
                <div className="title">Sound Effects</div>
                <div className="desc">Play sounds for notifications and actions</div>
              </div>
            </SettingLabel>
            <Switch 
              checked={settings.soundEffects} 
              onChange={(e) => updateSetting('soundEffects', e.target.checked)}
            />
          </SettingRow>
        </Card>
        
        {/* Language Settings */}
        <Card>
          <CardTitle>
            <Language /> Language
          </CardTitle>
          <SettingRow>
            <SettingLabel>
              <div>
                <div className="title">App Language</div>
                <div className="desc">Choose your preferred language</div>
              </div>
            </SettingLabel>
            <Select 
              value={settings.language} 
              onChange={(e) => updateSetting('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="ur">اردو</option>
            </Select>
          </SettingRow>
        </Card>
        
        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <Button onClick={saveSettings} disabled={isLoading}>
            {isLoading ? <CircularProgress size={20} style={{ color: 'white' }} /> : <><Save /> Save All Settings</>}
          </Button>
        </div>
      </Wrapper>
    </Container>
  );
};

export default Settings;