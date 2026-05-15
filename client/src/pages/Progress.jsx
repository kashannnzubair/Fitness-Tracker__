import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import styled, { keyframes } from "styled-components";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, LineChart, Line
} from 'recharts';
import { 
  FileDownload, PictureAsPdf, TableChart,
  FitnessCenter, LocalFireDepartment, AccessTime,
  EmojiEvents, Straighten, MonitorWeight, TrendingUp,
  Close, AddCircleOutline, Speed, ShowChart
} from '@mui/icons-material';
import { IconButton, CircularProgress, LinearProgress, Chip, Tooltip, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getProgress, getWorkouts } from "../api";

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

const Wrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
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
  background: ${({ $primary, theme }) => $primary ? theme.gradient : 'transparent'};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  color: ${({ $primary, theme }) => $primary ? 'white' : theme.text_primary};
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
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ $color, theme }) => theme[$color]};
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px ${({ theme }) => theme.shadowHover};
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${({ $color, theme }) => theme[$color] + "15"};
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: ${({ $color, theme }) => theme[$color]};
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

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 30px;
  
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease;
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AddButton = styled.button`
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: 12px;
  color: ${({ theme }) => theme.text_secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
  }
`;

const PerformanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;
`;

const PerformanceCard = styled.div`
  background: ${({ theme }) => theme.bgLight};
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    transform: translateY(-3px);
  }
  
  .label {
    font-size: 12px;
    color: ${({ theme }) => theme.text_secondary};
    margin-bottom: 8px;
  }
  
  .value {
    font-size: 24px;
    font-weight: 800;
    color: ${({ theme }) => theme.primary};
  }
  
  .unit {
    font-size: 12px;
    color: ${({ theme }) => theme.text_secondary};
  }
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
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary + "10"};
  }
  
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

const Progress = () => {
  const [progressData, setProgressData] = useState([]);
  const [measurements, setMeasurements] = useState({
    chest: 0, waist: 0, arms: 0, thighs: 0
  });
  const [performance, setPerformance] = useState({
    benchPress: 0,
    squat: 0,
    deadlift: 0
  });
  const [workoutStats, setWorkoutStats] = useState({ total: 0, calories: 0, minutes: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showMeasureModal, setShowMeasureModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [newMeasurement, setNewMeasurement] = useState({ name: "", value: "" });
  const [newPerformance, setNewPerformance] = useState({ name: "", value: "" });
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  
  const user = useSelector(state => state.user?.user);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
    setTimeout(() => setToast({ ...toast, open: false }), 3000);
  };
  
  const loadData = async () => {
  setIsLoading(true);
  try {
    // ✅ LOAD FROM BACKEND FIRST
    const token = localStorage.getItem('fittrack-app-token');
    
    const response = await fetch('http://localhost:8000/api/user/progress/get', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    
    if (result.success && result.progress && result.progress.length > 0) {
      setProgressData(result.progress);
      localStorage.setItem('fittrack-progress', JSON.stringify(result.progress));
      
      // Set latest measurements
      const latest = result.progress[result.progress.length - 1];
      setMeasurements({
        chest: latest.chest || 0,
        waist: latest.waist || 0,
        arms: latest.arms || 0,
        thighs: latest.thighs || 0
      });
      setPerformance({
        benchPress: latest.benchPress || 0,
        squat: latest.squat || 0,
        deadlift: latest.deadlift || 0
      });
    } else {
      // Fallback to localStorage
      const saved = localStorage.getItem('fittrack-progress');
      if (saved) {
        const data = JSON.parse(saved);
        setProgressData(data);
      }
    }
    
    // Load workouts for stats
    const workoutRes = await getWorkouts();
    const workouts = workoutRes?.data?.todaysWorkouts || [];
    setWorkoutStats({
      total: workouts.length,
      calories: workouts.length * 65,
      minutes: workouts.length * 45
    });
    
  } catch (err) {
    console.log("Error loading data:", err);
    // Fallback to localStorage
    const saved = localStorage.getItem('fittrack-progress');
    if (saved) {
      setProgressData(JSON.parse(saved));
    }
  } finally {
    setIsLoading(false);
  }
};
  
  const saveAllData = (updatedProgress) => {
    localStorage.setItem('fittrack-progress', JSON.stringify(updatedProgress));
    setProgressData(updatedProgress);
  };
  
  const addWeight = async () => {
  if (newWeight) {
    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(newWeight),
      chest: measurements.chest,
      waist: measurements.waist,
      arms: measurements.arms,
      thighs: measurements.thighs,
      benchPress: performance.benchPress,
      squat: performance.squat,
      deadlift: performance.deadlift
    };
    
    const updated = [...progressData, newEntry];
    setProgressData(updated);
    localStorage.setItem('fittrack-progress', JSON.stringify(updated));
    
    // ✅ SAVE TO BACKEND
    try {
      const token = localStorage.getItem('fittrack-app-token');
      const response = await fetch('http://localhost:8000/api/user/progress/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newEntry)
      });
      
      const data = await response.json();
      console.log("Progress saved to backend:", data);
      
      if (response.ok) {
        showToast(`✅ Weight updated to ${newWeight} kg and saved to database!`);
      } else {
        showToast(`⚠️ Weight saved locally only. Backend error: ${data.message}`, "error");
      }
    } catch (err) {
      console.log("Error saving to backend:", err);
      showToast(`✅ Weight updated to ${newWeight} kg (saved locally only)`);
    }
    
    setNewWeight("");
    setShowWeightModal(false);
  }
};
  
  const addMeasurement = async () => {
  if (newMeasurement.name && newMeasurement.value) {
    const updatedMeasurements = {
      ...measurements,
      [newMeasurement.name]: parseFloat(newMeasurement.value)
    };
    setMeasurements(updatedMeasurements);
    
    // Update latest progress entry
    const updated = [...progressData];
    if (updated.length > 0) {
      const latestEntry = { ...updated[updated.length - 1] };
      latestEntry[newMeasurement.name] = parseFloat(newMeasurement.value);
      updated[updated.length - 1] = latestEntry;
      setProgressData(updated);
      localStorage.setItem('fittrack-progress', JSON.stringify(updated));
      
      // ✅ SAVE TO BACKEND
      try {
        const token = localStorage.getItem('fittrack-app-token');
        await fetch('http://localhost:8000/api/user/progress/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(latestEntry)
        });
        showToast(`✅ ${newMeasurement.name} updated to ${newMeasurement.value} cm!`);
      } catch (err) {
        console.log("Error saving:", err);
        showToast(`✅ ${newMeasurement.name} updated to ${newMeasurement.value} cm (local only)`);
      }
    }
    
    setNewMeasurement({ name: "", value: "" });
    setShowMeasureModal(false);
  }
};
  const addPerformance = () => {
    if (newPerformance.name && newPerformance.value) {
      const updatedPerformance = {
        ...performance,
        [newPerformance.name]: parseFloat(newPerformance.value)
      };
      setPerformance(updatedPerformance);
      
      const updated = [...progressData];
      if (updated.length > 0) {
        updated[updated.length - 1][newPerformance.name] = parseFloat(newPerformance.value);
        saveAllData(updated);
      }
      setNewPerformance({ name: "", value: "" });
      setShowPerformanceModal(false);
      showToast(`✅ ${newPerformance.name} PR updated to ${newPerformance.value} kg`);
    }
  };
  
  const currentWeight = progressData.length > 0 ? progressData[progressData.length - 1]?.weight : 0;
  const startWeight = progressData.length > 0 ? progressData[0]?.weight : 0;
  const weightChange = (currentWeight - startWeight).toFixed(1);
  const isWeightLoss = weightChange < 0;
  
  const weightChartData = progressData.map(w => ({
    date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: w.weight
  }));
  
  const performanceChartData = progressData.map(w => ({
    date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    benchPress: w.benchPress || 0,
    squat: w.squat || 0,
    deadlift: w.deadlift || 0
  }));
  
  const measurementsChartData = progressData.map(w => ({
    date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    chest: w.chest || 0,
    waist: w.waist || 0,
    arms: w.arms || 0,
    thighs: w.thighs || 0
  }));
  
  const height = user?.height || 170;
  const bmi = (currentWeight / ((height / 100) ** 2)).toFixed(1);
  const getBMICategory = () => {
    if (bmi < 18.5) return { text: 'Underweight', color: '#FF9F0A' };
    if (bmi < 25) return { text: 'Normal', color: '#34C759' };
    if (bmi < 30) return { text: 'Overweight', color: '#FF9F0A' };
    return { text: 'Obese', color: '#FF453A' };
  };
  const bmiInfo = getBMICategory();
  const bmiProgress = Math.min((bmi / 30) * 100, 100);
  
  const exportToCSV = () => {
    const exportData = progressData.map(p => ({
      Date: new Date(p.date).toLocaleDateString(),
      'Weight (kg)': p.weight,
      'Chest (cm)': p.chest || '-',
      'Waist (cm)': p.waist || '-',
      'Arms (cm)': p.arms || '-',
      'Thighs (cm)': p.thighs || '-',
      'Bench Press (kg)': p.benchPress || '-',
      'Squat (kg)': p.squat || '-',
      'Deadlift (kg)': p.deadlift || '-',
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Progress Report');
    XLSX.writeFile(wb, `fitness_progress_${new Date().toISOString().split('T')[0]}.csv`);
    showToast("CSV exported successfully!");
  };
  
  const exportToPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.text('FitTrack - Progress Report', 20, 20);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
  doc.text(`User: ${user?.name || 'User'}`, 20, 38);
  
  doc.setFontSize(14);
  doc.text('Summary', 20, 50);
  
  // Get latest measurements from state
  const latestMeasurements = measurements;
  const latestPerformance = performance;
  
  autoTable(doc, {
    startY: 55,
    head: [['Metric', 'Value']],
    body: [
      ['Current Weight', `${currentWeight || 0} kg`],
      ['Weight Change', `${isWeightLoss ? '▼' : '▲'} ${Math.abs(weightChange) || 0} kg`],
      ['BMI', `${bmi || 0} (${bmiInfo.text})`],
      ['Bench Press PR', `${latestPerformance.benchPress || 0} kg`],
      ['Squat PR', `${latestPerformance.squat || 0} kg`],
      ['Deadlift PR', `${latestPerformance.deadlift || 0} kg`],
      ['Chest', `${latestMeasurements.chest || 0} cm`],
      ['Waist', `${latestMeasurements.waist || 0} cm`],
      ['Arms', `${latestMeasurements.arms || 0} cm`],
      ['Thighs', `${latestMeasurements.thighs || 0} cm`],
    ],
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [10, 132, 255] }
  });
  
  doc.save(`progress_report_${new Date().toISOString().split('T')[0]}.pdf`);
  showToast("PDF exported successfully!");
};

  if (isLoading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  return (
    <Container>
      <Wrapper>
        <Header>
          <TitleSection>
            <Title>📈 Progress Tracker</Title>
            <Subtitle>Track your weight, measurements, strength, and fitness journey</Subtitle>
          </TitleSection>
          <ExportButtons>
            <Tooltip title="Export as CSV">
              <ExportBtn onClick={exportToCSV}>
                <TableChart /> CSV
              </ExportBtn>
            </Tooltip>
            <Tooltip title="Export as PDF">
              <ExportBtn $primary onClick={exportToPDF}>
                <PictureAsPdf /> PDF Report
              </ExportBtn>
            </Tooltip>
          </ExportButtons>
        </Header>
        
        <StatsGrid>
          <StatCard $color="primary">
            <StatIcon $color="primary"><MonitorWeight /></StatIcon>
            <StatValue>{currentWeight || '--'} kg</StatValue>
            <StatLabel>Current Weight</StatLabel>
            {weightChange !== 0 && (
              <div style={{ fontSize: 12, marginTop: 4, color: isWeightLoss ? '#34C759' : '#FF453A' }}>
                {isWeightLoss ? '▼' : '▲'} {Math.abs(weightChange)} kg
              </div>
            )}
          </StatCard>
          <StatCard $color="orange">
            <StatIcon $color="orange"><FitnessCenter /></StatIcon>
            <StatValue>{workoutStats.total}</StatValue>
            <StatLabel>Workouts (7 days)</StatLabel>
          </StatCard>
          <StatCard $color="green">
            <StatIcon $color="green"><LocalFireDepartment /></StatIcon>
            <StatValue>{workoutStats.calories}</StatValue>
            <StatLabel>Calories Burned</StatLabel>
          </StatCard>
          <StatCard $color="primary">
            <StatIcon $color="primary"><EmojiEvents /></StatIcon>
            <StatValue>{performance.benchPress || 0} kg</StatValue>
            <StatLabel>Bench Press PR</StatLabel>
          </StatCard>
        </StatsGrid>
        
        <ChartCard>
          <ChartTitle>
            <ShowChart sx={{ color: '#0A84FF' }} /> Weight Progress Over Time
          </ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weightChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2C2C3A" />
              <XAxis dataKey="date" stroke="#6C6C7A" />
              <YAxis stroke="#6C6C7A" domain={['auto', 'auto']} />
              <RechartsTooltip contentStyle={{ background: '#14141F', border: 'none', borderRadius: 8, color: '#fff' }} />
              <Area type="monotone" dataKey="weight" stroke="#0A84FF" fill="#0A84FF20" />
            </AreaChart>
          </ResponsiveContainer>
          <AddButton onClick={() => setShowWeightModal(true)}>
            <AddCircleOutline /> Log Today's Weight
          </AddButton>
        </ChartCard>
        
        <ChartCard>
          <ChartTitle>
            <Speed sx={{ color: '#FF9F0A' }} /> Strength Progress (kg)
          </ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2C2C3A" />
              <XAxis dataKey="date" stroke="#6C6C7A" />
              <YAxis stroke="#6C6C7A" />
              <RechartsTooltip contentStyle={{ background: '#14141F', border: 'none', borderRadius: 8 }} />
              <Line type="monotone" dataKey="benchPress" stroke="#0A84FF" strokeWidth={2} dot={{ fill: '#0A84FF' }} />
              <Line type="monotone" dataKey="squat" stroke="#34C759" strokeWidth={2} dot={{ fill: '#34C759' }} />
              <Line type="monotone" dataKey="deadlift" stroke="#FF9F0A" strokeWidth={2} dot={{ fill: '#FF9F0A' }} />
            </LineChart>
          </ResponsiveContainer>
          <PerformanceGrid>
            <PerformanceCard onClick={() => { setNewPerformance({ name: "benchPress", value: "" }); setShowPerformanceModal(true); }}>
              <div className="label">🏋️ Bench Press</div>
              <div className="value">{performance.benchPress || 0}</div>
              <div className="unit">kg</div>
            </PerformanceCard>
            <PerformanceCard onClick={() => { setNewPerformance({ name: "squat", value: "" }); setShowPerformanceModal(true); }}>
              <div className="label">🦵 Squat</div>
              <div className="value">{performance.squat || 0}</div>
              <div className="unit">kg</div>
            </PerformanceCard>
            <PerformanceCard onClick={() => { setNewPerformance({ name: "deadlift", value: "" }); setShowPerformanceModal(true); }}>
              <div className="label">💪 Deadlift</div>
              <div className="value">{performance.deadlift || 0}</div>
              <div className="unit">kg</div>
            </PerformanceCard>
          </PerformanceGrid>
        </ChartCard>
        
        <ChartCard>
          <ChartTitle>
            <Straighten sx={{ color: '#34C759' }} /> Body Measurements (cm)
          </ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={measurementsChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2C2C3A" />
              <XAxis dataKey="date" stroke="#6C6C7A" />
              <YAxis stroke="#6C6C7A" />
              <RechartsTooltip contentStyle={{ background: '#14141F', border: 'none', borderRadius: 8 }} />
              <Line type="monotone" dataKey="chest" stroke="#0A84FF" strokeWidth={2} />
              <Line type="monotone" dataKey="waist" stroke="#FF9F0A" strokeWidth={2} />
              <Line type="monotone" dataKey="arms" stroke="#34C759" strokeWidth={2} />
              <Line type="monotone" dataKey="thighs" stroke="#BF5AF2" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <MeasurementGrid>
            <MeasurementItem onClick={() => { setNewMeasurement({ name: "chest", value: "" }); setShowMeasureModal(true); }}>
              <span className="label">Chest</span>
              <span className="value">{measurements.chest} cm</span>
            </MeasurementItem>
            <MeasurementItem onClick={() => { setNewMeasurement({ name: "waist", value: "" }); setShowMeasureModal(true); }}>
              <span className="label">Waist</span>
              <span className="value">{measurements.waist} cm</span>
            </MeasurementItem>
            <MeasurementItem onClick={() => { setNewMeasurement({ name: "arms", value: "" }); setShowMeasureModal(true); }}>
              <span className="label">Arms</span>
              <span className="value">{measurements.arms} cm</span>
            </MeasurementItem>
            <MeasurementItem onClick={() => { setNewMeasurement({ name: "thighs", value: "" }); setShowMeasureModal(true); }}>
              <span className="label">Thighs</span>
              <span className="value">{measurements.thighs} cm</span>
            </MeasurementItem>
          </MeasurementGrid>
        </ChartCard>
        
        <ChartCard>
          <ChartTitle>
            <MonitorWeight /> BMI Analysis
          </ChartTitle>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto' }}>
                <svg width="120" height="120" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#2C2C3A" strokeWidth="8" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke={bmiInfo.color} strokeWidth="8" 
                    strokeDasharray="283" 
                    strokeDashoffset={283 - (283 * bmiProgress) / 100}
                    transform="rotate(-90 50 50)" />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: bmiInfo.color }}>{bmi}</div>
                </div>
              </div>
              <div style={{ marginTop: 12, fontWeight: 600, color: bmiInfo.color }}>{bmiInfo.text}</div>
            </div>
            <div style={{ flex: 2 }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span>Underweight</span>
                  <span>Normal</span>
                  <span>Overweight</span>
                  <span>Obese</span>
                </div>
                <div style={{ height: 8, background: '#2C2C3A', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: '25%', background: '#FF9F0A', height: '100%' }} />
                  <div style={{ width: '25%', background: '#34C759', height: '100%' }} />
                  <div style={{ width: '25%', background: '#FF9F0A', height: '100%' }} />
                  <div style={{ width: '25%', background: '#FF453A', height: '100%' }} />
                </div>
              </div>
              <div style={{ background: '#14141F', borderRadius: 12, padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>Height: <strong>{height} cm</strong></span>
                  <span>Weight: <strong>{currentWeight} kg</strong></span>
                </div>
                <LinearProgress variant="determinate" value={bmiProgress} sx={{ height: 6, borderRadius: 3, bgcolor: '#2C2C3A', '& .MuiLinearProgress-bar': { bgcolor: bmiInfo.color } }} />
              </div>
            </div>
          </div>
        </ChartCard>
        
        <ChartCard>
          <ChartTitle>
            <AccessTime /> Recent Progress History
          </ChartTitle>
          <div style={{ overflowX: 'auto', maxHeight: 400, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#14141F' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#6C6C7A' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#6C6C7A' }}>Weight</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#6C6C7A' }}>Chest</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#6C6C7A' }}>Waist</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#6C6C7A' }}>Arms</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#6C6C7A' }}>Bench</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#6C6C7A' }}>Squat</th>
                </tr>
              </thead>
              <tbody>
                {progressData.slice().reverse().map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #2C2C3A' }}>
                    <td style={{ padding: '10px 12px', color: '#fff' }}>{new Date(p.date).toLocaleDateString()}</td>
                    <td style={{ padding: '10px 12px', color: '#0A84FF', fontWeight: 600 }}>{p.weight} kg</td>
                    <td style={{ padding: '10px 12px', color: '#fff' }}>{p.chest || '-'} cm</td>
                    <td style={{ padding: '10px 12px', color: '#fff' }}>{p.waist || '-'} cm</td>
                    <td style={{ padding: '10px 12px', color: '#fff' }}>{p.arms || '-'} cm</td>
                    <td style={{ padding: '10px 12px', color: '#FF9F0A' }}>{p.benchPress || '-'} kg</td>
                    <td style={{ padding: '10px 12px', color: '#34C759' }}>{p.squat || '-'} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </Wrapper>
      
      {/* Weight Modal */}
      <Dialog open={showWeightModal} onClose={() => setShowWeightModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: '#14141F', color: '#fff' }}>Log Your Weight</DialogTitle>
        <DialogContent sx={{ background: '#14141F' }}>
          <TextField
            fullWidth
            label="Weight (kg)"
            type="number"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            margin="dense"
            sx={{ input: { color: '#fff' }, label: { color: '#6C6C7A' } }}
          />
        </DialogContent>
        <DialogActions sx={{ background: '#14141F', padding: 16 }}>
          <Button onClick={() => setShowWeightModal(false)} sx={{ color: '#6C6C7A' }}>Cancel</Button>
          <Button onClick={addWeight} variant="contained" sx={{ background: '#0A84FF' }}>Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Measurement Modal */}
      <Dialog open={showMeasureModal} onClose={() => setShowMeasureModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: '#14141F', color: '#fff' }}>Add Measurement</DialogTitle>
        <DialogContent sx={{ background: '#14141F' }}>
          <select 
            value={newMeasurement.name}
            onChange={(e) => setNewMeasurement({ ...newMeasurement, name: e.target.value })}
            style={{ width: '100%', padding: '12px', background: '#1C1C2A', border: '1px solid #2C2C3A', borderRadius: 10, color: '#fff', margin: '10px 0' }}
          >
            <option value="">Select Body Part</option>
            <option value="chest">Chest</option>
            <option value="waist">Waist</option>
            <option value="arms">Arms</option>
            <option value="thighs">Thighs</option>
          </select>
          <TextField
            fullWidth
            label="Measurement (cm)"
            type="number"
            value={newMeasurement.value}
            onChange={(e) => setNewMeasurement({ ...newMeasurement, value: e.target.value })}
            margin="dense"
            sx={{ input: { color: '#fff' }, label: { color: '#6C6C7A' } }}
          />
        </DialogContent>
        <DialogActions sx={{ background: '#14141F', padding: 16 }}>
          <Button onClick={() => setShowMeasureModal(false)} sx={{ color: '#6C6C7A' }}>Cancel</Button>
          <Button onClick={addMeasurement} variant="contained" sx={{ background: '#0A84FF' }}>Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Performance Modal */}
      <Dialog open={showPerformanceModal} onClose={() => setShowPerformanceModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: '#14141F', color: '#fff' }}>
          Update {newPerformance.name === "benchPress" ? "Bench Press" : newPerformance.name === "squat" ? "Squat" : "Deadlift"} PR
        </DialogTitle>
        <DialogContent sx={{ background: '#14141F' }}>
          <TextField
            fullWidth
            label="Weight (kg)"
            type="number"
            value={newPerformance.value}
            onChange={(e) => setNewPerformance({ ...newPerformance, value: e.target.value })}
            margin="dense"
            sx={{ input: { color: '#fff' }, label: { color: '#6C6C7A' } }}
          />
        </DialogContent>
        <DialogActions sx={{ background: '#14141F', padding: 16 }}>
          <Button onClick={() => setShowPerformanceModal(false)} sx={{ color: '#6C6C7A' }}>Cancel</Button>
          <Button onClick={addPerformance} variant="contained" sx={{ background: '#0A84FF' }}>Save PR</Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast.severity} sx={{ width: '100%', bgcolor: '#1C1C2A', color: '#fff' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Progress;