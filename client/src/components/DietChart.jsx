import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { 
  Restaurant, 
  Add,
  Delete,
} from "@mui/icons-material";
import { IconButton, TextField, Autocomplete } from "@mui/material";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Card = styled.div`
  flex: 1;
  min-width: 320px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  background: ${({ theme }) => theme.card};
  box-shadow: 0 4px 20px ${({ theme }) => theme.shadow};
  animation: ${fadeIn} 0.5s ease;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px ${({ theme }) => theme.shadowHover};
  }
  
  @media (max-width: 600px) { padding: 16px; }
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 18px;
  background: ${({ theme }) => theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const MealSection = styled.div`
  margin-bottom: 24px;
`;

const MealHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: ${({ theme }) => theme.bgLight};
  border-radius: 12px;
`;

const MealTitle = styled.h4`
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

const MealItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  margin: 8px 0;
  background: ${({ theme }) => theme.bg};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(5px);
    border-color: ${({ theme }) => theme.primary};
  }
`;

const FoodInfo = styled.div`
  flex: 1;
`;

const FoodName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
`;

const FoodCalories = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
`;

const NutritionBadge = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 4px;
`;

const Badge = styled.span`
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  background: ${({ theme, $color }) => theme[$color] + "20"};
  color: ${({ theme, $color }) => theme[$color]};
`;

const TotalSection = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: ${({ theme }) => theme.gradient};
  border-radius: 16px;
  color: white;
  text-align: center;
`;

const TotalCalories = styled.div`
  font-size: 32px;
  font-weight: 800;
`;

const TotalLabel = styled.div`
  font-size: 12px;
  opacity: 0.8;
`;

const AddFoodRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;
  align-items: center;
`;

const DailyGoal = styled.div`
  text-align: center;
  margin-top: 12px;
  font-size: 12px;
  opacity: 0.9;
`;

// Food Database
const foodDatabase = [
  { name: "Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Rice (1 cup cooked)", calories: 206, protein: 4, carbs: 45, fat: 0.4 },
  { name: "Apple (1 medium)", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: "Banana (1 medium)", calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: "Egg (1 large)", calories: 72, protein: 6, carbs: 0.4, fat: 5 },
  { name: "Oatmeal (1 cup cooked)", calories: 158, protein: 5.5, carbs: 27, fat: 3.2 },
  { name: "Salmon (100g)", calories: 208, protein: 22, carbs: 0, fat: 13 },
  { name: "Broccoli (100g)", calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { name: "Avocado (1 medium)", calories: 240, protein: 3, carbs: 12, fat: 22 },
  { name: "Greek Yogurt (1 cup)", calories: 150, protein: 20, carbs: 8, fat: 5 },
  { name: "Whey Protein (1 scoop)", calories: 120, protein: 24, carbs: 3, fat: 1.5 },
  { name: "Almonds (30g)", calories: 173, protein: 6, carbs: 6, fat: 15 },
  { name: "Sweet Potato (1 medium)", calories: 112, protein: 2, carbs: 26, fat: 0.1 },
  { name: "Tuna (100g)", calories: 132, protein: 28, carbs: 0, fat: 1.4 },
  { name: "Quinoa (1 cup cooked)", calories: 222, protein: 8, carbs: 39, fat: 3.6 },
  { name: "Pizza (1 slice)", calories: 285, protein: 12, carbs: 36, fat: 10 },
  { name: "Burger (1 regular)", calories: 354, protein: 20, carbs: 30, fat: 18 },
  { name: "French Fries (100g)", calories: 312, protein: 3.4, carbs: 41, fat: 15 },
  { name: "Ice Cream (1 scoop)", calories: 137, protein: 2.5, carbs: 16, fat: 7 },
  { name: "Pasta (1 cup cooked)", calories: 220, protein: 8, carbs: 43, fat: 1.3 },
];

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"];

const DietChart = ({ onDietUpdate }) => {
  const [meals, setMeals] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  });
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState("Breakfast");
  
  // Load from localStorage
  useEffect(() => {
    const savedMeals = localStorage.getItem("fittrack-diet");
    if (savedMeals) {
      setMeals(JSON.parse(savedMeals));
    }
  }, []);
  
  // Save to localStorage and notify parent
  useEffect(() => {
    localStorage.setItem("fittrack-diet", JSON.stringify(meals));
    if (onDietUpdate) {
      const totalCalories = calculateTotalCalories();
      onDietUpdate(totalCalories);
    }
  }, [meals]);
  
  const addFood = () => {
    if (selectedFood && selectedMeal) {
      setMeals(prev => ({
        ...prev,
        [selectedMeal]: [...prev[selectedMeal], { ...selectedFood, id: Date.now() }]
      }));
      setSelectedFood(null);
    }
  };
  
  const removeFood = (mealType, foodId) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: prev[mealType].filter(food => food.id !== foodId)
    }));
  };
  
  const calculateTotalCalories = () => {
    let total = 0;
    Object.values(meals).forEach(meal => {
      meal.forEach(food => {
        total += food.calories;
      });
    });
    return total;
  };
  
  const calculateMacros = () => {
    let protein = 0, carbs = 0, fat = 0;
    Object.values(meals).forEach(meal => {
      meal.forEach(food => {
        protein += food.protein || 0;
        carbs += food.carbs || 0;
        fat += food.fat || 0;
      });
    });
    return { protein, carbs, fat };
  };
  
  const totalCalories = calculateTotalCalories();
  const macros = calculateMacros();
  const dailyGoal = 2000;
  
  return (
    <Card>
      <Title>
        <Restaurant /> Nutrition Tracker
      </Title>
      
      {mealTypes.map(mealType => (
        <MealSection key={mealType}>
          <MealHeader>
            <MealTitle>{mealType}</MealTitle>
            <span style={{ fontSize: "12px", color: "inherit" }}>
              {meals[mealType].reduce((sum, f) => sum + f.calories, 0)} cal
            </span>
          </MealHeader>
          
          {meals[mealType].map(food => (
            <MealItem key={food.id}>
              <FoodInfo>
                <FoodName>{food.name}</FoodName>
                <FoodCalories>{food.calories} calories</FoodCalories>
                <NutritionBadge>
                  <Badge $color="primary">🔥 {food.protein || 0}g Protein</Badge>
                  <Badge $color="green">🥔 {food.carbs || 0}g Carbs</Badge>
                  <Badge $color="orange">🧈 {food.fat || 0}g Fat</Badge>
                </NutritionBadge>
              </FoodInfo>
              <IconButton size="small" onClick={() => removeFood(mealType, food.id)}>
                <Delete sx={{ fontSize: "18px", color: "#FF453A" }} />
              </IconButton>
            </MealItem>
          ))}
        </MealSection>
      ))}
      
      <AddFoodRow>
        <Autocomplete
          fullWidth
          options={foodDatabase}
          getOptionLabel={(option) => option.name}
          value={selectedFood}
          onChange={(_, newValue) => setSelectedFood(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              placeholder="🔍 Search food..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'inherit',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }
                }
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props} style={{ color: "#000" }}>
              <div>
                <div><strong>{option.name}</strong></div>
                <div style={{ fontSize: "11px" }}>{option.calories} cal | P:{option.protein}g C:{option.carbs}g F:{option.fat}g</div>
              </div>
            </li>
          )}
        />
        
        <select 
          value={selectedMeal} 
          onChange={(e) => setSelectedMeal(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "12px",
            background: "#14141F",
            color: "white",
            border: "1px solid #2C2C3A",
            cursor: "pointer"
          }}
        >
          {mealTypes.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        
        <IconButton 
          onClick={addFood} 
          sx={{ 
            background: "#0A84FF", 
            color: "white", 
            borderRadius: "12px",
            '&:hover': { background: "#0066CC" }
          }}
        >
          <Add />
        </IconButton>
      </AddFoodRow>
      
      <TotalSection>
        <TotalLabel>Total Calories Today</TotalLabel>
        <TotalCalories>{totalCalories} / {dailyGoal} kcal</TotalCalories>
        <div style={{ fontSize: "12px", marginTop: "8px" }}>
          🔥 {macros.protein.toFixed(0)}g Protein | 🥔 {macros.carbs.toFixed(0)}g Carbs | 🧈 {macros.fat.toFixed(0)}g Fat
        </div>
        <DailyGoal>
          {totalCalories < dailyGoal ? 
            `🎯 You need ${dailyGoal - totalCalories} more calories today` : 
            totalCalories > dailyGoal ? 
            `⚠️ You're ${totalCalories - dailyGoal} calories over your goal` : 
            "🎉 Perfect! You've hit your goal!"}
        </DailyGoal>
      </TotalSection>
    </Card>
  );
};

export default DietChart;