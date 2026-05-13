import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { CloseRounded, SearchRounded, FitnessCenter, Schedule, EmojiEvents } from "@mui/icons-material";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const Container = styled.div`
  flex: 1; height: 100%; overflow-y: scroll; padding: 32px 24px;
  background: ${({ theme }) => theme.bg};
`;

const Header = styled.div`
  max-width: 1200px; margin: 0 auto 24px; animation: ${fadeUp} 0.4s ease;
`;

const Title = styled.h1`
  font-size: 32px; font-weight: 800;
  background: ${({ theme }) => theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 6px;
`;

const Subtitle = styled.p`
  font-size: 15px; color: ${({ theme }) => theme.text_secondary}; margin: 0;
`;

const SearchBar = styled.div`
  max-width: 1200px; margin: 0 auto 20px;
  display: flex; gap: 15px; align-items: center;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 50px;
  padding: 6px 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  padding: 12px 0;
  
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary};
  }
`;

const FilterRow = styled.div`
  display: flex; gap: 10px; flex-wrap: wrap;
  max-width: 1200px; margin: 0 auto 24px;
`;

const FilterBtn = styled.button`
  padding: 8px 18px; border-radius: 25px; font-family: inherit;
  border: 1.5px solid ${({ $active, theme }) => $active ? theme.primary : theme.border};
  background: ${({ $active, theme }) => $active ? theme.primary : "transparent"};
  color: ${({ $active, theme }) => $active ? "#fff" : theme.text_primary};
  font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Grid = styled.div`
  max-width: 1200px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px;
`;

const Card = styled.div`
  border-radius: 20px; overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 4px 20px ${({ theme }) => theme.shadow};
  background: ${({ theme }) => theme.card};
  cursor: pointer; transition: all 0.3s ease;
  animation: ${fadeUp} 0.5s ease both;
  animation-delay: ${({ $delay }) => $delay}s;
  
  &:hover { 
    transform: translateY(-6px); 
    box-shadow: 0 15px 35px ${({ theme }) => theme.shadowHover};
    border-color: ${({ theme }) => theme.primary + "40"};
  }
`;

const Thumb = styled.div`
  position: relative; width: 100%; padding-top: 56.25%; 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ThumbIcon = styled.div`
  position: absolute;
  font-size: 48px;
  color: white;
  opacity: 0.8;
`;

const ThumbImg = styled.img`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  object-fit: cover; transition: transform 0.4s ease;
  ${Card}:hover & { transform: scale(1.05); }
`;

const ImagePlaceholder = styled.div`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: white;
  gap: 8px;
`;

const DurBadge = styled.div`
  position: absolute; bottom: 8px; right: 10px;
  background: rgba(0,0,0,0.8); color: #fff;
  font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 8px;
  display: flex; align-items: center; gap: 4px;
  backdrop-filter: blur(4px);
`;

const CardBody = styled.div`padding: 16px;`;

const TagRow = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;
`;

const Tag = styled.span`
  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
  color: ${({ theme }) => theme.primary}; background: ${({ theme }) => theme.primary + "15"};
  padding: 4px 12px; border-radius: 20px;
`;

const Level = styled.span`
  font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 20px;
  background: ${({ $l }) => $l === "Beginner" ? "#34C75920" : $l === "Intermediate" ? "#FF9F0A20" : "#FF453A20"};
  color: ${({ $l }) => $l === "Beginner" ? "#34C759" : $l === "Intermediate" ? "#FF9F0A" : "#FF453A"};
`;

const CardTitle = styled.div`
  font-size: 16px; font-weight: 700;
  color: ${({ theme }) => theme.text_primary}; line-height: 1.4; margin-bottom: 6px;
`;

const CardDesc = styled.div`
  font-size: 13px; color: ${({ theme }) => theme.text_secondary}; line-height: 1.5;
`;

const StepsList = styled.ul`
  margin-top: 12px;
  padding-left: 20px;
  li {
    font-size: 13px;
    color: ${({ theme }) => theme.text_secondary};
    margin-bottom: 8px;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 60px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 16px;
`;

// Modal
const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 2000;
  background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px; animation: ${fadeIn} 0.2s ease;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 24px; width: 100%; max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 30px 70px rgba(0,0,0,0.5);
  animation: ${fadeUp} 0.3s ease;
  border: 1px solid ${({ theme }) => theme.border};
  position: relative;
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%);
  padding: 30px;
  text-align: center;
  color: white;
`;

const ModalTitle = styled.h2`
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 8px;
`;

const ModalCategory = styled.span`
  display: inline-block;
  padding: 4px 12px;
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  font-size: 12px;
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TipBox = styled.div`
  background: ${({ theme }) => theme.primary + "10"};
  border-left: 4px solid ${({ theme }) => theme.primary};
  padding: 12px 16px;
  border-radius: 12px;
  margin-top: 16px;
`;

const CloseBtn = styled.button`
  position: absolute; top: 10px; right: 10px;
  background: rgba(0,0,0,0.5);
  border: none; border-radius: 50%; width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: white;
  transition: all 0.2s;
  z-index: 10;
  &:hover { background: ${({ theme }) => theme.primary}; transform: scale(1.1); }
`;

// Exercise Guides with Static Images
const tutorials = [
  // LEGS
  { 
    id: 1, category: "Legs", level: "Beginner", duration: "5 min read", 
    title: "🏋️ Squats - Perfect Form Guide", 
    desc: "Learn how to squat correctly with proper depth and form to build powerful legs.",
    icon: "🦵",
    steps: [
      "1️⃣ Stand with feet shoulder-width apart, toes slightly pointed out",
      "2️⃣ Keep chest up, back straight, core engaged",
      "3️⃣ Lower hips down like sitting on a chair",
      "4️⃣ Go until thighs are parallel to ground",
      "5️⃣ Push through heels to stand back up"
    ],
    tips: "Keep your knees in line with your toes, don't let them cave inward."
  },
  { 
    id: 2, category: "Legs", level: "Intermediate", duration: "6 min read",
    title: "🏃 Lunges - Complete Guide",
    desc: "Master forward, reverse, and walking lunges for strong legs.",
    icon: "🏃",
    steps: [
      "1️⃣ Step forward with one leg",
      "2️⃣ Lower hips until both knees bent at 90°",
      "3️⃣ Front knee above ankle, back knee above ground",
      "4️⃣ Push back to starting position",
      "5️⃣ Alternate legs"
    ],
    tips: "Keep your torso upright and core engaged throughout the movement."
  },
  
  // CHEST
  { 
    id: 3, category: "Chest", level: "Beginner", duration: "5 min read",
    title: "💪 Push-Ups - From Zero to Hero",
    desc: "The ultimate bodyweight exercise for chest, shoulders, and triceps.",
    icon: "💪",
    steps: [
      "1️⃣ Start in plank position with hands shoulder-width apart",
      "2️⃣ Keep body in straight line from head to heels",
      "3️⃣ Lower chest toward ground with control",
      "4️⃣ Go down until chest almost touches floor",
      "5️⃣ Push back up powerfully"
    ],
    tips: "If too hard, start with knee push-ups or incline push-ups on a bench."
  },
  { 
    id: 4, category: "Chest", level: "Intermediate", duration: "8 min read",
    title: "🏋️ Bench Press Technique",
    desc: "The king of chest exercises - learn proper form to build a bigger chest.",
    icon: "🏋️",
    steps: [
      "1️⃣ Lie on bench with eyes under the bar",
      "2️⃣ Grip bar slightly wider than shoulders",
      "3️⃣ Retract shoulder blades and arch back slightly",
      "4️⃣ Lower bar to mid-chest with control",
      "5️⃣ Push bar back up explosively"
    ],
    tips: "Keep your feet planted on the ground for stability."
  },
  
  // BACK
  { 
    id: 5, category: "Back", level: "Intermediate", duration: "7 min read",
    title: "📈 Pull-Ups Mastery",
    desc: "Build a wide V-taper back with pull-ups.",
    icon: "📈",
    steps: [
      "1️⃣ Hang from bar with overhand grip slightly wider than shoulders",
      "2️⃣ Pull shoulder blades down and back",
      "3️⃣ Drive elbows down and pull chest toward bar",
      "4️⃣ Squeeze back at the top",
      "5️⃣ Lower controlled back down"
    ],
    tips: "Use assisted bands or negatives if you can't do full reps yet."
  },
  { 
    id: 6, category: "Back", level: "Advanced", duration: "10 min read",
    title: "🏋️ Deadlift Tutorial",
    desc: "The ultimate full-body strength builder.",
    icon: "🏋️",
    steps: [
      "1️⃣ Stand with feet hip-width under bar",
      "2️⃣ Bend at hips to grip bar (mixed grip recommended)",
      "3️⃣ Keep back straight, chest up, lats engaged",
      "4️⃣ Drive through heels to stand up",
      "5️⃣ Lock out at top, return controlled"
    ],
    tips: "Never round your back - keep it straight throughout the lift."
  },
  
  // SHOULDERS
  { 
    id: 7, category: "Shoulders", level: "Beginner", duration: "5 min read",
    title: "💪 Lateral Raises Guide",
    desc: "Build wider shoulders with proper lateral raise technique.",
    icon: "💪",
    steps: [
      "1️⃣ Hold dumbbells at sides with slight bend in elbows",
      "2️⃣ Raise arms to shoulder level",
      "3️⃣ Lead with elbows, not hands",
      "4️⃣ Squeeze shoulders at top",
      "5️⃣ Lower controlled back down"
    ],
    tips: "Don't use momentum - use lighter weight with perfect form."
  },
  { 
    id: 8, category: "Shoulders", level: "Advanced", duration: "8 min read",
    title: "🏋️ Overhead Press",
    desc: "The best exercise for building boulder shoulders.",
    icon: "🏋️",
    steps: [
      "1️⃣ Hold bar at collarbone level, grip shoulder-width",
      "2️⃣ Keep core tight, back straight",
      "3️⃣ Press bar directly overhead",
      "4️⃣ Keep elbows slightly in front of bar",
      "5️⃣ Lock out at top, lower controlled"
    ],
    tips: "Keep your head neutral - don't look up at the bar."
  },
  
  // ARMS
  { 
    id: 9, category: "Arms", level: "Beginner", duration: "5 min read",
    title: "💪 Bicep Curls - Perfect Form",
    desc: "Build bigger arms with proper curl technique.",
    icon: "💪",
    steps: [
      "1️⃣ Hold bar with shoulder-width underhand grip",
      "2️⃣ Keep elbows pinned to sides",
      "3️⃣ Curl bar toward shoulders",
      "4️⃣ Squeeze biceps at top",
      "5️⃣ Lower with 2-3 second negative"
    ],
    tips: "Avoid swinging your body - use strict form for best results."
  },
  { 
    id: 10, category: "Arms", level: "Intermediate", duration: "6 min read",
    title: "💪 Tricep Dips Guide",
    desc: "Build horseshoe triceps with dips.",
    icon: "💪",
    steps: [
      "1️⃣ Grip parallel bars with straight arms",
      "2️⃣ Lower body by bending elbows to 90°",
      "3️⃣ Keep shoulders down and back",
      "4️⃣ Push back up to start",
      "5️⃣ Don't lock elbows at top"
    ],
    tips: "Lean forward slightly to target triceps more than chest."
  },
  
  // ABS
  { 
    id: 11, category: "Abs", level: "Beginner", duration: "5 min read",
    title: "🏆 Crunches - Proper Form",
    desc: "The classic ab exercise done right.",
    icon: "🏆",
    steps: [
      "1️⃣ Lie on back, knees bent, feet flat on floor",
      "2️⃣ Place hands behind head (don't pull)",
      "3️⃣ Lift shoulders off ground by crunching",
      "4️⃣ Squeeze abs at top",
      "5️⃣ Lower controlled back down"
    ],
    tips: "Keep lower back pressed into floor - no space underneath."
  },
  { 
    id: 12, category: "Abs", level: "Advanced", duration: "7 min read",
    title: "🏆 Leg Raises Mastery",
    desc: "Target lower abs with proper leg raises.",
    icon: "🏆",
    steps: [
      "1️⃣ Hang from bar or lie on bench holding it",
      "2️⃣ Keep legs straight together",
      "3️⃣ Raise legs to 90° (or as high as possible)",
      "4️⃣ Squeeze abs at top",
      "5️⃣ Lower controlled without swinging"
    ],
    tips: "Avoid swinging - use controlled movement for best ab activation."
  },
  
  // CARDIO
  { 
    id: 13, category: "Cardio", level: "Intermediate", duration: "6 min read",
    title: "🔥 Jumping Jacks Guide",
    desc: "Full body cardio exercise for fat burning.",
    icon: "🔥",
    steps: [
      "1️⃣ Stand with feet together, arms at sides",
      "2️⃣ Jump feet out while raising arms overhead",
      "3️⃣ Jump feet back together, arms down",
      "4️⃣ Keep a steady rhythm",
      "5️⃣ Land softly on balls of feet"
    ],
    tips: "Keep your core engaged and breathe steadily throughout."
  },
  { 
    id: 14, category: "Cardio", level: "Advanced", duration: "8 min read",
    title: "💨 Burpees - Full Guide",
    desc: "The ultimate full body cardio exercise for fat loss.",
    icon: "💨",
    steps: [
      "1️⃣ Start standing, drop into squat position",
      "2️⃣ Kick feet back into plank position",
      "3️⃣ Do a push-up",
      "4️⃣ Jump feet back to squat position",
      "5️⃣ Explosively jump up with arms overhead"
    ],
    tips: "Modify by removing push-up or jump if needed for beginners."
  },
];

const categories = ["All", "Legs", "Chest", "Back", "Shoulders", "Arms", "Abs", "Cardio"];

const Tutorials = () => {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = tutorials.filter(t => {
    const matchCategory = active === "All" || t.category === active;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                        t.desc.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <Container>
      <Header>
        <Title>🏋️ Exercise Guides</Title>
        <Subtitle>Learn proper form with step-by-step instructions and pro tips</Subtitle>
      </Header>

      <SearchBar>
        <SearchRounded sx={{ color: "gray" }} />
        <SearchInput 
          placeholder="Search exercises... (e.g., squat, bench press, push-up)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchBar>

      <FilterRow>
        {categories.map(c => (
          <FilterBtn key={c} $active={active === c} onClick={() => setActive(c)}>
            {c === "All" ? "✨ All Exercises" : c}
          </FilterBtn>
        ))}
      </FilterRow>

      <Grid>
        {filtered.length > 0 ? (
          filtered.map((t, i) => (
            <Card key={t.id} $delay={i * 0.02} onClick={() => setSelected(t)}>
              <Thumb>
                <ImagePlaceholder>
                  <span style={{ fontSize: 48 }}>{t.icon}</span>
                  <span style={{ fontSize: 12 }}>{t.category}</span>
                </ImagePlaceholder>
                <DurBadge>
                  <Schedule sx={{ fontSize:"11px" }} /> {t.duration}
                </DurBadge>
              </Thumb>
              <CardBody>
                <TagRow>
                  <Tag>{t.category}</Tag>
                  <Level $l={t.level}>{t.level}</Level>
                </TagRow>
                <CardTitle>{t.title}</CardTitle>
                <CardDesc>{t.desc}</CardDesc>
              </CardBody>
            </Card>
          ))
        ) : (
          <NoResults>
            😢 No exercises found for "{search}"
            <br />
            Try searching for "squat", "bench press", "push-up", or check different category!
          </NoResults>
        )}
      </Grid>

      {selected && (
        <Overlay onClick={() => setSelected(null)}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <span style={{ fontSize: 48 }}>{selected.icon}</span>
              <ModalTitle>{selected.title}</ModalTitle>
              <ModalCategory>{selected.category} • {selected.level}</ModalCategory>
            </ModalHeader>
            <ModalBody>
              <Section>
                <SectionTitle>
                  <FitnessCenter sx={{ fontSize: 18 }} /> How to Perform
                </SectionTitle>
                <StepsList>
                  {selected.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </StepsList>
              </Section>
              
              <TipBox>
                <strong style={{ color: "#0A84FF" }}>💡 Pro Tip:</strong> {selected.tips}
              </TipBox>
              
              <Section>
                <SectionTitle>
                  <EmojiEvents sx={{ fontSize: 18 }} /> Benefits
                </SectionTitle>
                <ul style={{ paddingLeft: 20, color: "#6C6C7A", margin: 0 }}>
                  <li>Builds strength and muscle</li>
                  <li>Improves coordination and balance</li>
                  <li>Enhances athletic performance</li>
                </ul>
              </Section>
            </ModalBody>
            <CloseBtn onClick={() => setSelected(null)}>
              <CloseRounded />
            </CloseBtn>
          </Modal>
        </Overlay>
      )}
    </Container>
  );
};

export default Tutorials;