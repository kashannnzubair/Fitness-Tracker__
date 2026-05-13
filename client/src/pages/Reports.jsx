import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { 
  FileDownload, PictureAsPdf, TableChart, Description,
  FitnessCenter, Restaurant, CalendarToday, TrendingUp,
  CheckCircle, Download, Visibility
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import * as XLSX from 'xlsx';
import { getWorkouts } from '../api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
      font-size: 13px;
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
  const [dietData, setDietData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const user = useSelector(state => state.user?.user);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load workouts
      const res = await getWorkouts();
      const allWorkouts = res?.data?.allWorkouts || res?.data?.todaysWorkouts || [];
      setWorkouts(allWorkouts);
      
      // Load diet data
      const savedDiet = localStorage.getItem('fittrack-diet');
      if (savedDiet) {
        setDietData(JSON.parse(savedDiet));
      }
      
      // Set preview
      updatePreview('workouts', allWorkouts);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updatePreview = (type, data) => {
    if (type === 'workouts') {
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
    } else if (type === 'diet') {
      const items = [];
      Object.entries(data).forEach(([meal, foods]) => {
        if (Array.isArray(foods)) {
          foods.forEach(food => {
            items.push({
              Meal: meal,
              Food: food.name,
              Calories: food.calories,
              Protein: `${food.protein || 0}g`,
              Carbs: `${food.carbs || 0}g`,
              Fat: `${food.fat || 0}g`
            });
          });
        }
      });
      setPreviewData(items.slice(0, 5));
    }
  };
  
  // Export Workouts to CSV
  const exportWorkoutsCSV = () => {
    const data = workouts.map(w => ({
      Date: new Date(w.date).toLocaleDateString(),
      Exercise: w.workoutName,
      Category: w.category,
      Sets: w.sets,
      Reps: w.reps,
      Weight: `${w.weight} kg`,
      Duration: `${w.duration} min`,
      Calories: w.caloriesBurned || w.duration * 5
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Workouts');
    XLSX.writeFile(wb, `workouts_${new Date().toISOString().split('T')[0]}.csv`);
  };
  
  // Export Diet to CSV
  const exportDietCSV = () => {
    const items = [];
    Object.entries(dietData).forEach(([meal, foods]) => {
      if (Array.isArray(foods)) {
        foods.forEach(food => {
          items.push({
            Meal: meal,
            Food: food.name,
            Calories: food.calories,
            Protein: `${food.protein || 0}g`,
            Carbs: `${food.carbs || 0}g`,
            Fat: `${food.fat || 0}g`,
            Date: new Date().toLocaleDateString()
          });
        });
      }
    });
    const ws = XLSX.utils.json_to_sheet(items);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Diet Log');
    XLSX.writeFile(wb, `diet_${new Date().toISOString().split('T')[0]}.csv`);
  };
  
  // Export Complete Report as HTML
  const exportHTMLReport = () => {
    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || w.duration * 5), 0);
    const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>FitTrack Complete Report</title>
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            margin: 0;
            padding: 40px;
            background: #f5f5f5;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #0A84FF;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          h1 {
            color: #0A84FF;
            font-size: 28px;
            margin: 0;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .stat-card {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 15px;
            text-align: center;
          }
          .stat-value {
            font-size: 28px;
            font-weight: bold;
            color: #0A84FF;
          }
          .stat-label {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          th {
            background: #0A84FF;
            color: white;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💪 FitTrack Complete Fitness Report</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
            <p>User: ${user?.name || 'User'}</p>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${totalWorkouts}</div>
              <div class="stat-label">Total Workouts</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${totalCalories}</div>
              <div class="stat-label">Calories Burned</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${totalDuration}</div>
              <div class="stat-label">Minutes Active</div>
            </div>
          </div>
          
          <h3>📋 Workout History</h3>
          <table>
            <thead>
              <tr><th>Date</th><th>Exercise</th><th>Category</th><th>Sets</th><th>Reps</th><th>Weight</th><th>Duration</th></tr>
            </thead>
            <tbody>
              ${workouts.map(w => `
                <tr>
                  <td>${new Date(w.date).toLocaleDateString()}</td>
                  <td>${w.workoutName}</td>
                  <td>${w.category}</td>
                  <td>${w.sets}</td>
                  <td>${w.reps}</td>
                  <td>${w.weight} kg</td>
                  <td>${w.duration} min</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>© 2024 FitTrack - Your Fitness Companion</p>
            <p>This report was generated automatically. For any questions, contact support.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `fittrack_report_${new Date().toISOString().split('T')[0]}.html`;
    link.click();
  };
  
  // Export Complete Report as PDF
  const exportPDFReport = () => {
    const doc = new jsPDF();
    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || w.duration * 5), 0);
    const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    
    doc.setFontSize(20);
    doc.text('FitTrack Progress Report', 20, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    doc.text(`User: ${user?.name || 'User'}`, 20, 38);
    
    doc.setFontSize(14);
    doc.text('Summary', 20, 50);
    doc.autoTable({
      startY: 55,
      body: [
        ['Total Workouts', totalWorkouts],
        ['Total Calories Burned', totalCalories],
        ['Total Minutes Active', totalDuration],
      ],
      theme: 'grid',
      styles: { fontSize: 10 },
    });
    
    const tableData = workouts.map(w => [
      new Date(w.date).toLocaleDateString(),
      w.workoutName,
      w.category,
      w.sets,
      w.reps,
      `${w.weight} kg`,
      `${w.duration} min`
    ]);
    
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Date', 'Exercise', 'Category', 'Sets', 'Reps', 'Weight', 'Duration']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [10, 132, 255] }
    });
    
    doc.save(`fitness_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };
  
  const reportCards = [
    {
      id: 'workouts',
      title: 'Workouts Export',
      desc: 'Export all your workout history to CSV format for analysis',
      icon: <FitnessCenter sx={{ fontSize: 28 }} />,
      color: 'primary',
      onClick: exportWorkoutsCSV
    },
    {
      id: 'diet',
      title: 'Diet Log Export',
      desc: 'Export your nutrition logs to CSV for tracking',
      icon: <Restaurant sx={{ fontSize: 28 }} />,
      color: 'green',
      onClick: exportDietCSV
    },
    {
      id: 'complete',
      title: 'Complete Report',
      desc: 'Generate a complete fitness report in HTML & PDF format',
      icon: <Description sx={{ fontSize: 28 }} />,
      color: 'orange',
      onClick: () => {
        // Show options modal or just export HTML
        exportHTMLReport();
      }
    }
  ];
  
  return (
    <Container>
      <Header>
        <Title>📄 Export Reports</Title>
        <Subtitle>Download your fitness data in multiple formats</Subtitle>
      </Header>
      
      <StatsRow>
        <StatBox>
          <StatValue>{workouts.length}</StatValue>
          <StatLabel>Total Workouts</StatLabel>
        </StatBox>
        <StatBox>
          <StatValue>{workouts.reduce((sum, w) => sum + (w.duration || 0), 0)}</StatValue>
          <StatLabel>Minutes Active</StatLabel>
        </StatBox>
        <StatBox>
          <StatValue>{workouts.reduce((sum, w) => sum + (w.caloriesBurned || w.duration * 5), 0)}</StatValue>
          <StatLabel>Calories Burned</StatLabel>
        </StatBox>
        <StatBox>
          <StatValue>{new Date().toLocaleDateString()}</StatValue>
          <StatLabel>Last Updated</StatLabel>
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
            <Visibility sx={{ fontSize: 18 }} /> Preview (Last 5 entries)
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
    </Container>
  );
};

export default Reports;