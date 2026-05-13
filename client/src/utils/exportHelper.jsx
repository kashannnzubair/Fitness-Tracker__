import * as XLSX from 'xlsx';

// Export to CSV
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${filename}_${getDateString()}.csv`);
};

// Export to JSON
export const exportToJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${getDateString()}.json`;
  link.click();
};

// Export to HTML
export const exportToHTML = (data, filename, title) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #0A84FF; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #0A84FF; color: white; }
        tr:nth-child(even) { background: #f9f9f9; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p>Generated on: ${new Date().toLocaleString()}</p>
      <table>
        <thead>
          <tr>
            ${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${Object.values(row).map(val => `<td>${val}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;
  
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${getDateString()}.html`;
  link.click();
};

// Export Workout Report
export const exportWorkoutReport = (workouts) => {
  const reportData = workouts.map(w => ({
    'Date': new Date(w.date).toLocaleDateString(),
    'Exercise': w.workoutName,
    'Category': w.category,
    'Sets': w.sets,
    'Reps': w.reps,
    'Weight (kg)': w.weight,
    'Duration (min)': w.duration,
    'Calories Burned': Math.round(w.sets * w.reps * w.weight * 0.5) || 50
  }));
  
  exportToCSV(reportData, 'workout_report');
};

// Export Diet Report
export const exportDietReport = (dietData) => {
  const reportData = [];
  
  Object.entries(dietData).forEach(([meal, foods]) => {
    foods.forEach(food => {
      reportData.push({
        'Meal': meal,
        'Food': food.name,
        'Calories': food.calories,
        'Protein (g)': food.protein || 0,
        'Carbs (g)': food.carbs || 0,
        'Fat (g)': food.fat || 0,
        'Date': new Date().toLocaleDateString()
      });
    });
  });
  
  exportToCSV(reportData, 'diet_report');
};

// Get date string for filename
const getDateString = () => {
  return new Date().toISOString().split('T')[0];
};

// Download blob
export const downloadBlob = (blob, filename) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};