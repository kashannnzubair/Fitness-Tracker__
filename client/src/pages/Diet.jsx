import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { 
  LocalFireDepartment, Egg, Grass, Bolt, WaterDrop,
  Restaurant, Add, Remove, Search, CheckCircle,
  BreakfastDining, LunchDining, DinnerDining, BakeryDining
} from "@mui/icons-material";
import { CircularProgress, IconButton, TextField, Autocomplete } from "@mui/material";

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
  font-size: 15px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 800px) {
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

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const StatTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
`;

const StatIcon = styled.div`
  color: ${({ theme, $color }) => theme[$color]};
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 8px;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: ${({ theme }) => theme.border};
  border-radius: 10px;
  overflow: hidden;
  margin-top: 8px;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background: ${({ theme, $color }) => theme[$color]};
  border-radius: 10px;
  transition: width 0.5s ease;
`;

const StatTarget = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 8px;
  text-align: right;
`;

// Main Content Grid
const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
  margin-bottom: 30px;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const MealSection = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 24px;
  padding: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MealGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

// FIXED: Added missing components
const MealCard = styled.div`
  background: ${({ theme }) => theme.bgLight};
  border-radius: 16px;
  padding: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    background: ${({ theme }) => theme.primary + "10"};
  }
`;

const MealHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

const MealIcon = styled.div`
  font-size: 24px;
`;

const MealTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
`;

const MealItems = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 12px;
  min-height: 60px;
`;

const MealCalories = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin-top: 8px;
`;

const AddFoodBtn = styled.button`
  width: 100%;
  padding: 8px;
  background: transparent;
  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: 10px;
  color: ${({ theme }) => theme.text_secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  margin-top: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
  }
`;

// Water Intake Card
const WaterCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 24px;
`;

const WaterGlasses = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 20px 0;
  flex-wrap: wrap;
`;

const WaterGlass = styled.div`
  width: 50px;
  height: 60px;
  background: ${({ $filled, theme }) => $filled ? theme.primary : theme.bgLight};
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 0 0 20px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 15px;
    background: ${({ $filled, theme }) => $filled ? theme.primary : theme.bgLight};
    border: 2px solid ${({ theme }) => theme.border};
    border-radius: 5px 5px 0 0;
  }
  
  &:hover {
    transform: scale(1.05);
  }
`;

const WaterCount = styled.div`
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

// Food Database
const foodDatabase = [
  { name: "Chicken Breast (150g)", calories: 165, protein: 31, carbs: 0, fat: 3.6, meal: "lunch" },
  { name: "Rice (1 cup cooked)", calories: 206, protein: 4, carbs: 45, fat: 0.4, meal: "lunch" },
  { name: "Apple (1 medium)", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, meal: "snacks" },
  { name: "Banana (1 medium)", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, meal: "snacks" },
  { name: "Eggs (2 large)", calories: 144, protein: 12, carbs: 1, fat: 10, meal: "breakfast" },
  { name: "Oatmeal (1 cup)", calories: 158, protein: 5.5, carbs: 27, fat: 3.2, meal: "breakfast" },
  { name: "Salmon (150g)", calories: 312, protein: 33, carbs: 0, fat: 19, meal: "dinner" },
  { name: "Broccoli (100g)", calories: 34, protein: 2.8, carbs: 7, fat: 0.4, meal: "dinner" },
  { name: "Greek Yogurt (1 cup)", calories: 150, protein: 20, carbs: 8, fat: 5, meal: "breakfast" },
  { name: "Whey Protein (1 scoop)", calories: 120, protein: 24, carbs: 3, fat: 1.5, meal: "snacks" },
  { name: "Almonds (30g)", calories: 173, protein: 6, carbs: 6, fat: 15, meal: "snacks" },
  { name: "Sweet Potato (1 medium)", calories: 112, protein: 2, carbs: 26, fat: 0.1, meal: "dinner" },
  { name: "Biryani (1 plate)", calories: 490, protein: 22, carbs: 58, fat: 18, meal: "lunch" },
  { name: "Pizza (1 slice)", calories: 285, protein: 12, carbs: 36, fat: 10, meal: "dinner" },
  { name: "Burger (1 regular)", calories: 354, protein: 20, carbs: 30, fat: 18, meal: "lunch" },
];

const tips = [
  { icon: <LocalFireDepartment />, color: "orange", title: "Calorie Deficit", desc: "Burn more calories than you consume for weight loss." },
  { icon: <Egg />, color: "primary", title: "High Protein Diet", desc: "Protein keeps you full and helps preserve muscle." },
  { icon: <Grass />, color: "green", title: "Eat More Fiber", desc: "Fiber-rich foods improve digestion and keep you full." },
  { icon: <Bolt />, color: "yellow", title: "Stay Hydrated", desc: "Drink 2-3 liters of water daily to boost metabolism." },
];

const mealPlans = {
  "Weight Loss": {
    Breakfast: "Oatmeal with berries + Green tea",
    Lunch: "Grilled chicken salad + Quinoa",
    Dinner: "Baked salmon + Steamed broccoli",
    Snacks: "Apple slices + Almonds",
    calories: 1500,
    icon: "🔥"
  },
  "Muscle Gain": {
    Breakfast: "6 eggs + Oatmeal + Banana",
    Lunch: "Chicken breast + Brown rice + Avocado",
    Dinner: "Steak + Sweet potato + Asparagus",
    Snacks: "Whey protein + Greek yogurt",
    calories: 2800,
    icon: "💪"
  },
  "Balanced": {
    Breakfast: "Greek yogurt + Granola + Berries",
    Lunch: "Turkey sandwich + Mixed greens",
    Dinner: "Fish + Vegetables + Quinoa",
    Snacks: "Protein bar + Fruit",
    calories: 2000,
    icon: "⚖️"
  }
};

const Diet = () => {
  const [activeMealPlan, setActiveMealPlan] = useState("Muscle Gain");
  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  });
  const [selectedMeal, setSelectedMeal] = useState("lunch");
  const [selectedFood, setSelectedFood] = useState(null);
  const [waterIntake, setWaterIntake] = useState(0);
  const [showAddFood, setShowAddFood] = useState(false);

  useEffect(() => {
    const savedMeals = localStorage.getItem("fittrack-meals");
    const savedWater = localStorage.getItem("fittrack-water");
    if (savedMeals) setMeals(JSON.parse(savedMeals));
    if (savedWater) setWaterIntake(parseInt(savedWater));
  }, []);

  useEffect(() => {
    localStorage.setItem("fittrack-meals", JSON.stringify(meals));
    localStorage.setItem("fittrack-water", waterIntake.toString());
  }, [meals, waterIntake]);

  const addFood = () => {
    if (selectedFood) {
      setMeals(prev => ({
        ...prev,
        [selectedMeal]: [...prev[selectedMeal], { ...selectedFood, id: Date.now() }]
      }));
      setSelectedFood(null);
      setShowAddFood(false);
    }
  };

  const removeFood = (mealType, foodId) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: prev[mealType].filter(f => f.id !== foodId)
    }));
  };

  const addWater = () => {
    if (waterIntake < 8) setWaterIntake(prev => prev + 1);
  };

  const removeWater = () => {
    if (waterIntake > 0) setWaterIntake(prev => prev - 1);
  };

  const calculateTotals = () => {
    let calories = 0, protein = 0, carbs = 0, fat = 0;
    Object.values(meals).forEach(meal => {
      meal.forEach(food => {
        calories += food.calories || 0;
        protein += food.protein || 0;
        carbs += food.carbs || 0;
        fat += food.fat || 0;
      });
    });
    return { calories, protein, carbs, fat };
  };

  const totals = calculateTotals();
  const goals = activeMealPlan === "Weight Loss" ? { calories: 1500, protein: 120, carbs: 150, fat: 50 } :
                 activeMealPlan === "Muscle Gain" ? { calories: 2800, protein: 180, carbs: 300, fat: 80 } :
                 { calories: 2000, protein: 150, carbs: 250, fat: 65 };

  const mealIcons = {
    breakfast: { icon: "🍳", title: "Breakfast" },
    lunch: { icon: "🥗", title: "Lunch" },
    dinner: { icon: "🍽️", title: "Dinner" },
    snacks: { icon: "🍎", title: "Snacks" }
  };

  return (
    <Container>
      <Header>
        <Title>🥗 Diet & Nutrition</Title>
        <Subtitle>Track your meals, monitor macros, and reach your fitness goals</Subtitle>
      </Header>

      {/* Stats Cards */}
      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatTitle>Calories</StatTitle>
            <StatIcon $color="orange"><LocalFireDepartment /></StatIcon>
          </StatHeader>
          <StatValue>{totals.calories} / {goals.calories} kcal</StatValue>
          <ProgressBar>
            <ProgressFill $progress={(totals.calories / goals.calories) * 100} $color="orange" />
          </ProgressBar>
          <StatTarget>{Math.round((totals.calories / goals.calories) * 100)}% of daily goal</StatTarget>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Protein</StatTitle>
            <StatIcon $color="primary"><Egg /></StatIcon>
          </StatHeader>
          <StatValue>{totals.protein} / {goals.protein} g</StatValue>
          <ProgressBar>
            <ProgressFill $progress={(totals.protein / goals.protein) * 100} $color="primary" />
          </ProgressBar>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Carbs</StatTitle>
            <StatIcon $color="green"><Grass /></StatIcon>
          </StatHeader>
          <StatValue>{totals.carbs} / {goals.carbs} g</StatValue>
          <ProgressBar>
            <ProgressFill $progress={(totals.carbs / goals.carbs) * 100} $color="green" />
          </ProgressBar>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Fats</StatTitle>
            <StatIcon $color="yellow"><Bolt /></StatIcon>
          </StatHeader>
          <StatValue>{totals.fat} / {goals.fat} g</StatValue>
          <ProgressBar>
            <ProgressFill $progress={(totals.fat / goals.fat) * 100} $color="yellow" />
          </ProgressBar>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        {/* Left Side - Meal Logging */}
        <MealSection>
          <SectionTitle><Restaurant /> Log Your Meal</SectionTitle>
          
          <MealGrid>
            {Object.entries(mealIcons).map(([key, value]) => (
              <MealCard key={key}>
                <MealHeader>
                  <MealIcon>{value.icon}</MealIcon>
                  <MealTitle>{value.title}</MealTitle>
                </MealHeader>
                <MealItems>
                  {meals[key].length > 0 ? (
                    meals[key].map(food => (
                      <div key={food.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: '#fff' }}>{food.name}</span>
                        <span style={{ color: '#FF9F0A' }}>{food.calories} cal</span>
                        <IconButton size="small" onClick={() => removeFood(key, food.id)} sx={{ padding: 0 }}>
                          <Remove sx={{ fontSize: 14, color: '#FF453A' }} />
                        </IconButton>
                      </div>
                    ))
                  ) : (
                    <span style={{ color: '#6C6C7A' }}>No items added</span>
                  )}
                </MealItems>
                <MealCalories>
                  Total: {meals[key].reduce((sum, f) => sum + (f.calories || 0), 0)} kcal
                </MealCalories>
                <AddFoodBtn onClick={() => { setSelectedMeal(key); setShowAddFood(!showAddFood); }}>
                  <Add /> Add Food
                </AddFoodBtn>
              </MealCard>
            ))}
          </MealGrid>

          {/* Add Food Section */}
          {showAddFood && (
            <div style={{ marginTop: 20, padding: 16, background: '#1C1C2A', borderRadius: 16 }}>
              <Autocomplete
                fullWidth
                options={foodDatabase.filter(f => f.meal === selectedMeal)}
                getOptionLabel={(option) => option.name}
                value={selectedFood}
                onChange={(_, newValue) => setSelectedFood(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Search food..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': { borderColor: '#2C2C3A' }
                      },
                      '& .MuiInputLabel-root': { color: '#6C6C7A' }
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} style={{ color: '#000', background: '#fff' }}>
                    <div>
                      <div><strong>{option.name}</strong></div>
                      <div style={{ fontSize: 11 }}>{option.calories} cal | P:{option.protein}g C:{option.carbs}g F:{option.fat}g</div>
                    </div>
                  </li>
                )}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button onClick={addFood} style={{ flex: 1, padding: 10, background: '#0A84FF', border: 'none', borderRadius: 10, color: 'white', cursor: 'pointer' }}>Add Food</button>
                <button onClick={() => setShowAddFood(false)} style={{ padding: 10, background: 'transparent', border: '1px solid #2C2C3A', borderRadius: 10, color: '#fff', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          )}
        </MealSection>

        {/* Right Side - Water & Tips */}
        <div>
          {/* Water Intake */}
          <WaterCard>
            <SectionTitle><WaterDrop sx={{ color: '#0A84FF' }} /> Water Intake</SectionTitle>
            <WaterGlasses>
              {[...Array(8)].map((_, i) => (
                <WaterGlass key={i} $filled={i < waterIntake} onClick={() => setWaterIntake(i + 1)} />
              ))}
            </WaterGlasses>
            <WaterCount>
              <IconButton onClick={removeWater} sx={{ color: '#fff' }}><Remove /></IconButton>
              {waterIntake} / 8 glasses of water today
              <IconButton onClick={addWater} sx={{ color: '#fff' }}><Add /></IconButton>
              <br />
              {8 - waterIntake} more glasses to go!
            </WaterCount>
          </WaterCard>

          {/* Meal Plan Selector */}
          <WaterCard>
            <SectionTitle><Restaurant /> Select Your Goal</SectionTitle>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
              {Object.keys(mealPlans).map(plan => (
                <PlanButton
                  key={plan}
                  $active={activeMealPlan === plan}
                  onClick={() => setActiveMealPlan(plan)}
                >
                  {mealPlans[plan].icon} {plan}
                </PlanButton>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <h4 style={{ color: '#0A84FF', marginBottom: 12 }}>Today's Recommended Plan</h4>
              {Object.entries(mealPlans[activeMealPlan]).map(([meal, content]) => {
                if (meal === 'calories' || meal === 'icon') return null;
                return (
                  <div key={meal} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #2C2C3A' }}>
                    <span style={{ color: '#fff' }}>{meal}:</span>
                    <span style={{ color: '#C0C0C8' }}>{content}</span>
                  </div>
                );
              })}
              <div style={{ marginTop: 12, padding: 10, background: '#0A84FF20', borderRadius: 10 }}>
                <strong style={{ color: '#fff' }}>Total: {mealPlans[activeMealPlan].calories} kcal/day</strong>
              </div>
            </div>
          </WaterCard>

          {/* Tips */}
          <WaterCard>
            <SectionTitle>💡 Nutrition Tips</SectionTitle>
            {tips.map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < tips.length - 1 ? '1px solid #2C2C3A' : 'none' }}>
                <div style={{ color: '#0A84FF' }}>{tip.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{tip.title}</div>
                  <div style={{ fontSize: 12, color: '#C0C0C8' }}>{tip.desc}</div>
                </div>
              </div>
            ))}
          </WaterCard>
        </div>
      </ContentGrid>
    </Container>
  );
};

const PlanButton = styled.button`
  padding: 8px 20px;
  border-radius: 25px;
  border: 2px solid ${({ $active, theme }) => $active ? theme.primary : theme.border};
  background: ${({ $active, theme }) => $active ? theme.primary : theme.bgLight};
  color: ${({ $active, theme }) => $active ? "white" : theme.text_primary};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

export default Diet;