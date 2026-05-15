import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { 
  FileDownload, PictureAsPdf, TableChart, Description,
  FitnessCenter, Restaurant, CalendarToday, TrendingUp,
  CheckCircle, Download, Visibility, MonitorWeight, LocalFireDepartment
} from '@mui/icons-material';
import { CircularProgress, Tooltip, Chip, Tabs, Tab, Box, Snackbar, Alert } from '@mui/material';
import * as XLSX from 'xlsx';
import { getWorkouts, getAllWorkouts, getProgress, getDiet } from '../api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  flex: 1;
  padding: 30px;
  background: ${({ theme }) => theme.bg};
  min-height: calc(100vh - 80px);
  overflow-y: auto;
`;

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 30px;
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

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatBox = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px ${({ theme }) => theme.shadowHover};
  }
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.primary};
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 4px;
`;

const ReportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 30px;
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ReportCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 24px;
  padding: 24px;
  transition: all 0.3s ease;
  cursor: pointer;
  animation: ${fadeIn} 0.5s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px ${({ theme }) => theme.shadowHover};
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ReportIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${({ theme, $color }) => theme[$color] + "15"};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: ${({ theme, $color }) => theme[$color]};
`;

const ReportTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 8px;
`;

const ReportDesc = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.5;
  margin-bottom: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`;

const DownloadBtn = styled.button`
  flex: 1;
  padding: 10px;
  background: ${({ $primary, theme }) => $primary ? theme.gradient : 'transparent'};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  color: ${({ $primary, theme }) => $primary ? 'white' : theme.text_primary};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const PreviewSection = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  padding: 20px;
  margin-top: 20px;
`;

const PreviewTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PreviewTable = styled.div`
  overflow-x: auto;
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid ${({ theme }) => theme.border};
      font-size: 12px;
    }
    
    th {
      color: ${({ theme }) => theme.primary};
      font-weight: 600;
    }
    
    td {
      color: ${({ theme }) => theme.text_secondary};
    }
  }
`;

const Reports = () => {
  const [workouts, setWorkouts] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [dietData, setDietData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState([]);
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
      // Load all workouts
      const workoutRes = await getAllWorkouts();
      const allWorkouts = workoutRes?.data?.workouts || [];
      setWorkouts(allWorkouts);
      
      // Load progress data
      const progressRes = await getProgress();
      const progress = progressRes?.data?.progress || [];
      setProgressData(progress);
      
      // Load diet data from localStorage (fittrack-meals)
      const savedMeals = localStorage.getItem('fittrack-meals');
      if (savedMeals) {
        setDietData(JSON.parse(savedMeals));
      }
      
      // Also try to load from backend
      try {
        const dietRes = await getDiet();
        if (dietRes.data?.diet?.meals) {
          setDietData(dietRes.data.diet.meals);
        }
      } catch (err) {
        console.log("No diet data in backend");
      }
      
      // Set preview
      updatePreview(allWorkouts);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updatePreview = (data) => {
    const preview = data.slice(0, 5).map(w => ({
      Date: new Date(w.date).toLocaleDateString(),
      Exercise: w.workoutName,
      Category: w.category,
      Sets: w.sets,
      Reps: w.reps,
      Weight: `${w.weight} kg`,
      Duration: `${w.duration} min`,
      Calories: w.caloriesBurned || w.duration * 5
    }));
    setPreviewData(preview);
  };
  
  // ============ WORKOUTS EXPORT ============
  const exportWorkoutsCSV = () => {
    if (workouts.length === 0) {
      showToast("No workout data to export", "error");
      return;
    }
    const data = workouts.map(w => ({
      Date: new Date(w.date).toLocaleDateString(),
      Exercise: w.workoutName,
      Category: w.category,
      Sets: w.sets,
      Reps: w.reps,
      'Weight (kg)': w.weight,
      'Duration (min)': w.duration,
      'Calories Burned': w.caloriesBurned || w.duration * 5
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Workouts');
    XLSX.writeFile(wb, `workouts_${new Date().toISOString().split('T')[0]}.csv`);
    showToast("Workouts exported successfully!");
  };
  
  // ============ PROGRESS EXPORT ============
  const exportProgressCSV = () => {
    if (progressData.length === 0) {
      showToast("No progress data to export", "error");
      return;
    }
    const data = progressData.map(p => ({
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
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Progress');
    XLSX.writeFile(wb, `progress_${new Date().toISOString().split('T')[0]}.csv`);
    showToast("Progress data exported successfully!");
  };
  
  // ============ DIET EXPORT - FIXED ============
  const exportDietCSV = () => {
    const items = [];
    
    // Check if dietData has any meals
    const hasData = Object.values(dietData).some(meal => meal && meal.length > 0);
    
    if (!hasData) {
      showToast("No diet data to export. Please add some food items first!", "error");
      return;
    }
    
    Object.entries(dietData).forEach(([meal, foods]) => {
      if (foods && Array.isArray(foods) && foods.length > 0) {
        foods.forEach(food => {
          items.push({
            'Meal Type': meal.charAt(0).toUpperCase() + meal.slice(1),
            'Food Item': food.name || '',
            'Calories': food.calories || 0,
            'Protein (g)': food.protein || 0,
            'Carbs (g)': food.carbs || 0,
            'Fat (g)': food.fat || 0,
            'Date': new Date().toLocaleDateString()
          });
        });
      }
    });
    
    if (items.length === 0) {
      showToast("No diet items found to export", "error");
      return;
    }
    
    const ws = XLSX.utils.json_to_sheet(items);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Diet Log');
    XLSX.writeFile(wb, `diet_${new Date().toISOString().split('T')[0]}.csv`);
    showToast(`Diet log exported successfully! (${items.length} items)`);
  };
  
  // ============ COMPLETE REPORT (HTML) ============
  const exportCompleteHTML = () => {
    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || w.duration * 5), 0);
    const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    const currentWeight = progressData.length > 0 ? progressData[progressData.length - 1]?.weight : 0;
    const startWeight = progressData.length > 0 ? progressData[0]?.weight : 0;
    const weightChange = (currentWeight - startWeight).toFixed(1);
    
    let totalDietCalories = 0;
    let dietItems = [];
    Object.entries(dietData).forEach(([meal, foods]) => {
      if (foods && Array.isArray(foods)) {
        foods.forEach(food => {
          totalDietCalories += food.calories || 0;
          dietItems.push({ meal, ...food });
        });
      }
    });
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>FitTrack Complete Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #0A0A0F 0%, #1a1a2e 100%); padding: 40px; }
          .container { max-width: 1000px; margin: 0 auto; background: #14141F; border-radius: 24px; padding: 40px; border: 1px solid #2C2C3A; }
          .header { text-align: center; border-bottom: 2px solid #0A84FF; padding-bottom: 20px; margin-bottom: 30px; }
          h1 { background: linear-gradient(135deg, #0A84FF, #5E5CE6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 32px; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
          .stat-card { background: #1C1C2A; border-radius: 16px; padding: 20px; text-align: center; border: 1px solid #2C2C3A; }
          .stat-value { font-size: 32px; font-weight: 800; color: #0A84FF; }
          .stat-label { font-size: 12px; color: #6C6C7A; margin-top: 8px; }
          h2 { color: #fff; margin: 25px 0 15px; font-size: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { border: 1px solid #2C2C3A; padding: 12px; text-align: left; }
          th { background: #0A84FF; color: white; }
          td { color: #C0C0C8; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #2C2C3A; color: #6C6C7A; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💪 FitTrack Complete Fitness Report</h1>
            <p style="color: #6C6C7A; margin-top: 10px;">Generated: ${new Date().toLocaleString()}</p>
            <p style="color: #6C6C7A;">User: ${user?.name || 'User'} | Email: ${user?.email || ''}</p>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card"><div class="stat-value">${totalWorkouts}</div><div class="stat-label">Total Workouts</div></div>
            <div class="stat-card"><div class="stat-value">${totalCalories}</div><div class="stat-label">Calories Burned</div></div>
            <div class="stat-card"><div class="stat-value">${totalDuration}</div><div class="stat-label">Minutes Active</div></div>
            <div class="stat-card"><div class="stat-value">${currentWeight} kg</div><div class="stat-label">Current Weight</div></div>
          </div>
          
          <h2>📊 Progress Summary</h2>
          <table>
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td>Weight Change</td><td>${weightChange > 0 ? '+' : ''}${weightChange} kg</td></tr>
            <tr><td>Total Calories Consumed (Today)</td><td>${totalDietCalories} kcal</td></tr>
            <tr><td>Workout Streak</td><td>${Math.min(workouts.length, 7)} days</td></tr>
          </table>
          
          <h2>🏋️ Workout History</h2>
          <table>
            <thead><tr><th>Date</th><th>Exercise</th><th>Category</th><th>Sets</th><th>Reps</th><th>Weight</th><th>Duration</th></tr></thead>
            <tbody>
              ${workouts.slice(0, 20).map(w => `
                <tr><td>${new Date(w.date).toLocaleDateString()}</td><td>${w.workoutName}</td><td>${w.category}</td><td>${w.sets}</td><td>${w.reps}</td><td>${w.weight} kg</td><td>${w.duration} min</td></tr>
              `).join('')}
            </tbody>
          </table>
          
          <h2>🍽️ Diet Log</h2>
          ${dietItems.length > 0 ? `
          <table>
            <thead><tr><th>Meal</th><th>Food</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fat</th></tr></thead>
            <tbody>
              ${dietItems.map(item => `
                <tr><td>${item.meal}</td><td>${item.name}</td><td>${item.calories}</td><td>${item.protein || 0}g</td><td>${item.carbs || 0}g</td><td>${item.fat || 0}g</td></tr>
              `).join('')}
            </tbody>
          </table>
          ` : '<p style="color: #6C6C7A;">No diet data available</p>'}
          
          <div class="footer">
            <p>© 2025 FitTrack - Your Fitness Companion</p>
            <p>This report was generated automatically. For support, contact support@fittrack.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `fittrack_complete_report_${new Date().toISOString().split('T')[0]}.html`;
    link.click();
    showToast("Complete HTML report generated!");
  };
  
  // ============ COMPLETE REPORT (PDF) ============
  const exportCompletePDF = () => {
    if (workouts.length === 0) {
      showToast("No workout data to export", "error");
      return;
    }
    
    const doc = new jsPDF();
    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || w.duration * 5), 0);
    const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    
    doc.setFontSize(22);
    doc.text('FitTrack Progress Report', 20, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    doc.text(`User: ${user?.name || 'User'}`, 20, 38);
    
    doc.setFontSize(14);
    doc.text('Summary', 20, 50);
    autoTable(doc, {
      startY: 55,
      head: [['Metric', 'Value']],
      body: [
        ['Total Workouts', totalWorkouts],
        ['Total Calories Burned', totalCalories],
        ['Total Minutes Active', totalDuration],
      ],
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [10, 132, 255] }
    });
    
    const tableData = workouts.slice(0, 15).map(w => [
      new Date(w.date).toLocaleDateString(),
      w.workoutName,
      w.category,
      w.sets,
      w.reps,
      `${w.weight} kg`,
      `${w.duration} min`
    ]);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Date', 'Exercise', 'Category', 'Sets', 'Reps', 'Weight', 'Duration']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [10, 132, 255] }
    });
    
    doc.save(`fitness_report_${new Date().toISOString().split('T')[0]}.pdf`);
    showToast("PDF report generated successfully!");
  };
  
  const reportCards = [
    {
      id: 'workouts',
      title: 'Workouts Export',
      desc: 'Export all your workout history to CSV format',
      icon: <FitnessCenter sx={{ fontSize: 28 }} />,
      color: 'primary',
      onClick: exportWorkoutsCSV
    },
    {
      id: 'progress',
      title: 'Progress Export',
      desc: 'Export weight & measurements to CSV',
      icon: <MonitorWeight sx={{ fontSize: 28 }} />,
      color: 'green',
      onClick: exportProgressCSV
    },
    {
      id: 'diet',
      title: 'Diet Log Export',
      desc: 'Export your nutrition logs to CSV',
      icon: <Restaurant sx={{ fontSize: 28 }} />,
      color: 'orange',
      onClick: exportDietCSV
    },
    {
      id: 'complete',
      title: 'Complete Report (HTML)',
      desc: 'Generate a complete fitness report in HTML format',
      icon: <Description sx={{ fontSize: 28 }} />,
      color: 'primary',
      onClick: exportCompleteHTML
    },
    {
      id: 'pdf',
      title: 'Complete Report (PDF)',
      desc: 'Generate a complete fitness report in PDF format',
      icon: <PictureAsPdf sx={{ fontSize: 28 }} />,
      color: 'red',
      onClick: exportCompletePDF
    }
  ];
  
  const stats = {
    totalWorkouts: workouts.length,
    totalMinutes: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
    totalCalories: workouts.reduce((sum, w) => sum + (w.caloriesBurned || w.duration * 5), 0),
    currentWeight: progressData.length > 0 ? progressData[progressData.length - 1]?.weight : 0
  };
  
  return (
    <Container>
      <Wrapper>
        <Header>
          <Title>📄 Export Reports</Title>
          <Subtitle>Download your fitness data in multiple formats (CSV, PDF, HTML)</Subtitle>
        </Header>
        
        <StatsRow>
          <StatBox>
            <StatValue>{stats.totalWorkouts}</StatValue>
            <StatLabel>Total Workouts</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue>{stats.totalMinutes}</StatValue>
            <StatLabel>Minutes Active</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue>{stats.totalCalories}</StatValue>
            <StatLabel>Calories Burned</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue>{stats.currentWeight || '--'} kg</StatValue>
            <StatLabel>Current Weight</StatLabel>
          </StatBox>
        </StatsRow>
        
        <ReportGrid>
          {reportCards.map(card => (
            <ReportCard key={card.id} onClick={card.onClick}>
              <ReportIcon $color={card.color}>{card.icon}</ReportIcon>
              <ReportTitle>{card.title}</ReportTitle>
              <ReportDesc>{card.desc}</ReportDesc>
              <ButtonGroup>
                <DownloadBtn $primary>
                  <Download sx={{ fontSize: 14 }} /> Download Now
                </DownloadBtn>
              </ButtonGroup>
            </ReportCard>
          ))}
        </ReportGrid>
        
        {previewData.length > 0 && (
          <PreviewSection>
            <PreviewTitle>
              <Visibility sx={{ fontSize: 18 }} /> Workout Preview (Last 5 entries)
            </PreviewTitle>
            <PreviewTable>
              <table>
                <thead>
                  <tr>
                    {Object.keys(previewData[0] || {}).map(key => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </PreviewTable>
          </PreviewSection>
        )}
      </Wrapper>
      
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast.severity} sx={{ width: '100%', bgcolor: '#1C1C2A', color: '#fff' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Reports;