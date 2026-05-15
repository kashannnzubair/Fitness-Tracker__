import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { 
  FitnessCenter, EmojiEvents, TrendingUp, Schedule,
  VolumeUp, VolumeOff, MusicNote
} from "@mui/icons-material";
import { IconButton, Slider } from "@mui/material";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
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
  max-width: 1400px;
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

// Full Width Video Section - Responsive
const VideoSection = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 30px;
  animation: ${slideUp} 0.6s ease;
  width: 100%;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  background: #000;
  aspect-ratio: 16 / 9;  /* This makes video full width with proper ratio */
`;

const FullWidthIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  pointer-events: none;
`;

// Overlay to prevent any clicks
const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  cursor: default;
  background: transparent;
`;

const VideoInfo = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.bgLight};
`;

const VideoTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const SoundControlBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const VolumeLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

// Stats Cards
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 800px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px ${({ theme }) => theme.shadowHover};
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${({ theme, $color }) => theme[$color] + "15"};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: ${({ theme, $color }) => theme[$color]};
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 4px;
`;

// Quote Section
const QuoteSection = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.primary}20, ${({ theme }) => theme.secondary}20);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  margin-bottom: 30px;
  border: 1px solid ${({ theme }) => theme.primary}30;
`;

const QuoteText = styled.p`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  font-style: italic;
  margin-bottom: 12px;
  line-height: 1.4;
`;

const QuoteAuthor = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

// Tips Grid
const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  
  @media (max-width: 800px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const TipCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    border-color: ${({ theme }) => theme.primary};
  }
`;

const TipEmoji = styled.div`
  font-size: 40px;
  margin-bottom: 12px;
`;

const TipTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 8px;
`;

const TipDesc = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.5;
`;

const quotes = [
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Unknown" },
  { text: "Your body can stand almost anything. It's your mind that you have to convince.", author: "Unknown" },
];

const tips = [
  { emoji: "💪", title: "Progressive Overload", desc: "Increase weight or reps gradually to keep making gains" },
  { emoji: "💧", title: "Stay Hydrated", desc: "Drink water before, during and after workouts" },
  { emoji: "😴", title: "Quality Sleep", desc: "7-9 hours of sleep is crucial for muscle recovery" },
  { emoji: "🥗", title: "Proper Nutrition", desc: "Fuel your body with protein, carbs and healthy fats" },
  { emoji: "📈", title: "Track Progress", desc: "Log your workouts to see improvement over time" },
  { emoji: "🧘", title: "Rest Days", desc: "Take rest days to prevent injury and allow recovery" },
];

// Video Playlist - Added your video at first position
const videoPlaylist = [
  { id: "wZax3F1-0F4", title: "🔥 DAVID LAID | GYM MOTIVATION | Best Workout Video 🔥", type: "video" },
  { id: "GQQWKsATQqQ", title: "🎵 DAVID LAID | POKER FACE (Slowed) | Gym Motivation", type: "video" },
  { id: "y8W3FTH6BhA", title: "💪 DAVID LAID | BEAST MODE | Gym Motivation", type: "video" },
  { id: "xVcRZ6YkRjA", title: "🏋️ BEST OF DAVID LAID | Workout Motivation", type: "video" },
];

const Dashboard = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isMuted, setIsMuted] = useState(true); // Start muted to ensure autoplay
  const [volume, setVolume] = useState(50);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);

  const currentVideo = videoPlaylist[currentVideoIndex];

  // Auto change video every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videoPlaylist.length);
      setIframeKey((prev) => prev + 1);
    }, 300000); // 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (_, newValue) => {
    setVolume(newValue);
    if (isMuted && newValue > 0) {
      setIsMuted(false);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Header>
          <Title>🏠 Dashboard</Title>
          <Subtitle>Stay motivated, stay consistent, stay fit</Subtitle>
        </Header>

        {/* FULL WIDTH VIDEO PLAYER - Responsive */}
        <VideoSection>
          <VideoContainer>
            <FullWidthIframe
              key={iframeKey}
              src={`https://www.youtube-nocookie.com/embed/${currentVideo.id}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${currentVideo.id}&controls=0&modestbranding=1&rel=0&showinfo=0&disablekb=1&fs=0&iv_load_policy=3&cc_load_policy=0&color=white&autohide=1&playsinline=1&enablejsapi=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen={false}
              title="Gym Motivation Video"
            />
            <VideoOverlay />
          </VideoContainer>
          <VideoInfo>
            <VideoTitle>
              <MusicNote sx={{ color: "#0A84FF" }} />
              {currentVideo.title}
              <span style={{ fontSize: 11, color: "#6C6C7A", marginLeft: "auto" }}>
                🎵 Auto-playing motivation
              </span>
            </VideoTitle>
            
            <SoundControlBar>
              <VolumeLabel>
                <IconButton size="small" onClick={toggleMute} sx={{ color: "inherit" }}>
                  {isMuted ? <VolumeOff sx={{ fontSize: 18 }} /> : <VolumeUp sx={{ fontSize: 18 }} />}
                </IconButton>
                Volume Control
              </VolumeLabel>
              <Slider
                size="small"
                value={volume}
                onChange={handleVolumeChange}
                sx={{ width: 120, color: "#0A84FF" }}
              />
              <VolumeLabel>
                {!isMuted ? `${volume}%` : "Muted"}
              </VolumeLabel>
            </SoundControlBar>
          </VideoInfo>
        </VideoSection>

        {/* Stats Cards */}
        <StatsGrid>
          <StatCard>
            <StatIcon $color="primary">
              <FitnessCenter sx={{ fontSize: 28 }} />
            </StatIcon>
            <StatValue>50+</StatValue>
            <StatLabel>Workout Videos</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon $color="orange">
              <EmojiEvents sx={{ fontSize: 28 }} />
            </StatIcon>
            <StatValue>1M+</StatValue>
            <StatLabel>Views This Month</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon $color="green">
              <TrendingUp sx={{ fontSize: 28 }} />
            </StatIcon>
            <StatValue>100K+</StatValue>
            <StatLabel>Active Users</StatLabel>
          </StatCard>
        </StatsGrid>

        {/* Quote of the Day */}
        <QuoteSection>
          <QuoteText>"{quotes[currentQuote].text}"</QuoteText>
          <QuoteAuthor>- {quotes[currentQuote].author}</QuoteAuthor>
          <div style={{ marginTop: 16 }}>
            <IconButton onClick={() => setCurrentQuote((prev) => (prev + 1) % quotes.length)} size="small">
              <Schedule sx={{ fontSize: 16 }} /> Next Quote
            </IconButton>
          </div>
        </QuoteSection>

        {/* Workout Tips */}
        <TipsGrid>
          {tips.map((tip, index) => (
            <TipCard key={index}>
              <TipEmoji>{tip.emoji}</TipEmoji>
              <TipTitle>{tip.title}</TipTitle>
              <TipDesc>{tip.desc}</TipDesc>
            </TipCard>
          ))}
        </TipsGrid>
      </Wrapper>
    </Container>
  );
};

export default Dashboard;