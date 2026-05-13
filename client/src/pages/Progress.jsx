import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Add, FileDownload, PictureAsPdf, TableChart,
  FitnessCenter, LocalFireDepartment, AccessTime,
  EmojiEvents, Straighten, MonitorWeight, TrendingUp,
  Close, Edit, Save
} from '@mui/icons-material';
import { IconButton, CircularProgress, Tooltip as MuiTooltip } from '@mui/material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Container = styled.div`
  flex: 1;
  padding: 30px;
  background: ${({ theme }) => theme.bg};
  min-height: calc(100vh - 80px);
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 16px;
`;

const TitleSection = styled.div`
  animation: ${fadeIn} 0.5s ease;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  background: ${({ theme }) => theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
`;

const ExportButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ExportBtn = styled.button`
  padding: 10px 20px;
  background: ${({ theme, $primary }) => $primary ? theme.gradient : 'transparent'};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  color: ${({ theme, $primary }) => $primary ? 'white' : theme.text_primary};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px ${({ theme }) => theme.primary + "40"};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  padding: 20px;
  transition: all 0.3s ease;
  animation: ${slideIn} 0.5s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px ${({ theme }) => theme.shadowHover};
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${({ theme, $color }) => theme[$color] + "15"};
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: ${({ theme, $color }) => theme[$color]};
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 4px;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 30px;
  
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MeasurementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const MeasurementItem = styled.div`
  background: ${({ theme }) => theme.bgLight};
  border-radius: 14px;
  padding: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .label {
    font-size: 13px;
    color: ${({ theme }) => theme.text_secondary};
  }
  
  .value {
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
  }
`;

const AddBtn = styled.button`
  width: 100%;
  margin-top: 16px;
  padding: 10px;
  background: transparent;
  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: 12px;
  color: ${({ theme }) => theme.text_secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
  }
`;

const ProgressRing = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto;
  
  circle {
    fill: none;
    stroke-width: 8;
  }
  
  .bg-circle {
    stroke: ${({ theme }) => theme.border};
  }
  
  .progress-circle {
    stroke: ${({ theme, $color }) => theme[$color]};
    stroke-dasharray: 283;
    stroke-dashoffset: ${({ $percent }) => 283 - (283 * $percent) / 100};
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    transition: stroke-dashoffset 0.5s ease;
  }
`;

const BMICategory = styled.div`
  text-align: center;
  margin-top: 12px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme, $category }) => {
    if ($category === 'Normal') return theme.green;
    if ($category === 'Overweight') return theme.orange;
    return theme.red;
  }};
`;

// Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
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
  max-width: 400px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  color: ${({ theme }) => theme.text_primary};
  margin: 10px 0;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Progress = () => {
  const [weightData, setWeightData] = useState([]);
  const [measurements, setMeasurements] = useState({
    chest: 0, waist: 0, hips: 0, arms: 0, thighs: 0
  });
  const [streak, setStreak] = useState(2);
  const [bestStreak, setBestStreak] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showMeasureModal, setShowMeasureModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newMeasurement, setNewMeasurement] = useState({ name: '', value: '' });
  
  const user = useSelector(state => state.user?.user);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = () => {
    // Load weight history
    const savedWeight = localStorage.getItem('fittrack-weight-history');
    if (savedWeight) {
      setWeightData(JSON.parse(savedWeight));
    } else {
      const sampleData = [
        { date: '2024-05-01', weight: 82 },
        { date: '2024-05-08', weight: 81.5 },
        { date: '2024-05-15', weight: 81 },
        { date: '2024-05-22', weight: 80.5 },
        { date: '2024-05-29', weight: 80 },
      ];
      setWeightData(sampleData);
      localStorage.setItem('fittrack-weight-history', JSON.stringify(sampleData));
    }
    
    // Load measurements
    const savedMeasurements = localStorage.getItem('fittrack-measurements');
    if (savedMeasurements) {
      setMeasurements(JSON.parse(savedMeasurements));
    }
  };
  
  const addWeight = () => {
    if (newWeight) {
      const newEntry = {
        date: new Date().toISOString().split('T')[0],
        weight: parseFloat(newWeight)
      };
      const updated = [...weightData, newEntry];
      setWeightData(updated);
      localStorage.setItem('fittrack-weight-history', JSON.stringify(updated));
      setNewWeight('');
      setShowWeightModal(false);
    }
  };
  
  const addMeasurement = () => {
    if (newMeasurement.name && newMeasurement.value) {
      setMeasurements(prev => ({
        ...prev,
        [newMeasurement.name]: parseFloat(newMeasurement.value)
      }));
      localStorage.setItem('fittrack-measurements', JSON.stringify(measurements));
      setNewMeasurement({ name: '', value: '' });
      setShowMeasureModal(false);
    }
  };
  
  const currentWeight = weightData.length > 0 ? weightData[weightData.length - 1]?.weight : 0;
  const heaviest = Math.max(...weightData.map(w => w.weight), 0);
  const lightest = Math.min(...weightData.map(w => w.weight), 80);
  
  // Calculate BMI
  const height = user?.height || 170; // cm
  const bmi = (currentWeight / ((height / 100) ** 2)).toFixed(1);
  const getBMICategory = () => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };
  const bmiProgress = Math.min((bmi / 30) * 100, 100);
  
  // Calculate stats
  const totalWorkouts = weightData.length * 2;
  const totalCalories = totalWorkouts * 65;
  const totalMinutes = totalWorkouts * 45;
  
  // Chart data
  const chartData = weightData.map(w => ({
    date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: w.weight
  }));
  
  // Export to CSV
  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Metric: 'Current Weight', Value: `${currentWeight} kg` },
      { Metric: 'Heaviest', Value: `${heaviest} kg` },
      { Metric: 'Lightest', Value: `${lightest} kg` },
      { Metric: 'BMI', Value: bmi },
      { Metric: 'BMI Category', Value: getBMICategory() },
      { Metric: 'Chest', Value: `${measurements.chest} cm` },
      { Metric: 'Waist', Value: `${measurements.waist} cm` },
      { Metric: 'Hips', Value: `${measurements.hips} cm` },
      { Metric: 'Arms', Value: `${measurements.arms} cm` },
      { Metric: 'Thighs', Value: `${measurements.thighs} cm` },
      { Metric: 'Workout Streak', Value: `${streak} days` },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Progress Report');
    XLSX.writeFile(wb, `fitness_progress_${new Date().toISOString().split('T')[0]}.csv`);
  };
  
  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('FitTrack Progress Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 35);
    doc.text(`User: ${user?.name || 'User'}`, 20, 45);
    
    doc.autoTable({
      startY: 55,
      head: [['Metric', 'Value']],
      body: [
        ['Current Weight', `${currentWeight} kg`],
        ['Heaviest', `${heaviest} kg`],
        ['Lightest', `${lightest} kg`],
        ['BMI', bmi],
        ['BMI Category', getBMICategory()],
        ['Chest', `${measurements.chest} cm`],
        ['Waist', `${measurements.waist} cm`],
        ['Hips', `${measurements.hips} cm`],
        ['Arms', `${measurements.arms} cm`],
        ['Thighs', `${measurements.thighs} cm`],
        ['Workout Streak', `${streak} days`],
        ['Total Workouts (7 days)', totalWorkouts],
        ['Calories Burned', totalCalories],
        ['Total Minutes', totalMinutes],
      ],
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [10, 132, 255] }
    });
    
    doc.save(`progress_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };
  
  return (
    <Container>
      <Header>
        <TitleSection>
          <Title>📊 Progress Report</Title>
          <Subtitle>Track your fitness journey and download reports</Subtitle>
        </TitleSection>
        <ExportButtons>
          <ExportBtn onClick={exportToCSV}>
            <TableChart /> CSV
          </ExportBtn>
          <ExportBtn $primary onClick={exportToPDF}>
            <PictureAsPdf /> PDF Report
          </ExportBtn>
        </ExportButtons>
      </Header>
      
      <StatsGrid>
        <StatCard>
          <StatIcon $color="primary"><FitnessCenter /></StatIcon>
          <StatValue>{totalWorkouts}</StatValue>
          <StatLabel>Workouts (7 days)</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="orange"><LocalFireDepartment /></StatIcon>
          <StatValue>{totalCalories}</StatValue>
          <StatLabel>Kcal Burned</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="green"><AccessTime /></StatIcon>
          <StatValue>{totalMinutes}</StatValue>
          <StatLabel>Minutes Active</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon $color="primary"><EmojiEvents /></StatIcon>
          <StatValue>{streak}</StatValue>
          <StatLabel>Day Streak (Best: {bestStreak})</StatLabel>
        </StatCard>
      </StatsGrid>
      
      <TwoColumnGrid>
        {/* Weight Chart */}
        <Card>
          <CardTitle><TrendingUp /> Weight History</CardTitle>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2C2C3A" />
              <XAxis dataKey="date" stroke="#6C6C7A" />
              <YAxis stroke="#6C6C7A" domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ background: '#14141F', border: 'none', borderRadius: 8 }} />
              <Area type="monotone" dataKey="weight" stroke="#0A84FF" fill="#0A84FF20" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <span>Current: <strong>{currentWeight} kg</strong></span>
            <span>Heaviest: <strong>{heaviest} kg</strong></span>
            <span>Lightest: <strong>{lightest} kg</strong></span>
          </div>
          <AddBtn onClick={() => setShowWeightModal(true)}>
            <Add /> Log Weight
          </AddBtn>
        </Card>
        
        {/* BMI Card */}
        <Card>
          <CardTitle><MonitorWeight /> Body Mass Index</CardTitle>
          <div style={{ textAlign: 'center' }}>
            <ProgressRing $percent={bmiProgress} $color="primary">
              <svg width="150" height="150" viewBox="0 0 100 100">
                <circle className="bg-circle" cx="50" cy="50" r="45" stroke="currentColor" />
                <circle className="progress-circle" cx="50" cy="50" r="45" 
                  stroke="currentColor" 
                  strokeDasharray="283" 
                  strokeDashoffset={283 - (283 * bmiProgress) / 100}
                  transform="rotate(-90 50 50)" />
              </svg>
            </ProgressRing>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#0A84FF' }}>{bmi}</div>
              <BMICategory $category={getBMICategory()}>{getBMICategory()}</BMICategory>
            </div>
          </div>
        </Card>
      </TwoColumnGrid>
      
      <TwoColumnGrid>
        {/* Body Measurements */}
        <Card>
          <CardTitle><Straighten /> Body Measurements (cm)</CardTitle>
          <MeasurementGrid>
            {Object.entries(measurements).map(([key, value]) => (
              <MeasurementItem key={key}>
                <span className="label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <span className="value">{value} cm</span>
              </MeasurementItem>
            ))}
          </MeasurementGrid>
          <AddBtn onClick={() => setShowMeasureModal(true)}>
            <Add /> Add Measurement
          </AddBtn>
        </Card>
        
        {/* Performance Metrics */}
        <Card>
          <CardTitle><TrendingUp /> Performance Metrics</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { name: 'Week 1', value: 32 },
              { name: 'Week 2', value: 28 },
              { name: 'Week 3', value: 24 },
              { name: 'Week 4', value: 16 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2C2C3A" />
              <XAxis dataKey="name" stroke="#6C6C7A" />
              <YAxis stroke="#6C6C7A" />
              <Tooltip contentStyle={{ background: '#14141F', border: 'none', borderRadius: 8 }} />
              <Bar dataKey="value" fill="#0A84FF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <AddBtn>View Detailed Analytics</AddBtn>
        </Card>
      </TwoColumnGrid>
      
      {/* Weight Modal */}
      {showWeightModal && (
        <ModalOverlay onClick={() => setShowWeightModal(false)}>
          <Modal onClick={e => e.stopPropagation()}>
            <h3>Log Your Weight</h3>
            <ModalInput 
              type="number" 
              placeholder="Enter weight in kg"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setShowWeightModal(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #2C2C3A', borderRadius: 8, color: '#fff' }}>Cancel</button>
              <button onClick={addWeight} style={{ padding: '8px 16px', background: '#0A84FF', border: 'none', borderRadius: 8, color: '#fff' }}>Save</button>
            </div>
          </Modal>
        </ModalOverlay>
      )}
      
      {/* Measurement Modal */}
      {showMeasureModal && (
        <ModalOverlay onClick={() => setShowMeasureModal(false)}>
          <Modal onClick={e => e.stopPropagation()}>
            <h3>Add Measurement</h3>
            <select 
              value={newMeasurement.name}
              onChange={(e) => setNewMeasurement({ ...newMeasurement, name: e.target.value })}
              style={{ width: '100%', padding: '12px', background: '#14141F', border: '1px solid #2C2C3A', borderRadius: 10, color: '#fff', margin: '10px 0' }}
            >
              <option value="">Select Body Part</option>
              <option value="chest">Chest</option>
              <option value="waist">Waist</option>
              <option value="hips">Hips</option>
              <option value="arms">Arms</option>
              <option value="thighs">Thighs</option>
            </select>
            <ModalInput 
              type="number" 
              placeholder="Measurement in cm"
              value={newMeasurement.value}
              onChange={(e) => setNewMeasurement({ ...newMeasurement, value: e.target.value })}
            />
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setShowMeasureModal(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #2C2C3A', borderRadius: 8, color: '#fff' }}>Cancel</button>
              <button onClick={addMeasurement} style={{ padding: '8px 16px', background: '#0A84FF', border: 'none', borderRadius: 8, color: '#fff' }}>Save</button>
            </div>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Progress;