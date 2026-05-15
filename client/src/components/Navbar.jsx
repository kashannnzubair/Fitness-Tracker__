import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import LogoImg from "../utils/Images/Logo.png";
import { Link as LinkR, NavLink, useNavigate } from "react-router-dom";
import { MenuRounded, DarkMode, LightMode, FitnessCenter } from "@mui/icons-material";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/reducers/userSlice";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ReminderModal from './ReminderModal';

// ============ ANIMATIONS FOR LOGO ============
const logoGlow = keyframes`
  0% {
    text-shadow: 0 0 5px rgba(10, 132, 255, 0.5);
    transform: scale(1);
  }
  50% {
    text-shadow: 0 0 20px rgba(10, 132, 255, 0.8);
    transform: scale(1.02);
  }
  100% {
    text-shadow: 0 0 5px rgba(10, 132, 255, 0.5);
    transform: scale(1);
  }
`;

const iconBounce = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-5px) rotate(5deg);
  }
  75% {
    transform: translateY(3px) rotate(-3deg);
  }
`;

const rotateIcon = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulseRing = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
`;

const floatLogo = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
`;

// Styled Components for Logo
const LogoWrapper = styled(LinkR)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  animation: ${floatLogo} 3s ease-in-out infinite;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const AnimatedIcon = styled.div`
  position: relative;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.gradient};
  border-radius: 12px;
  animation: ${iconBounce} 2s ease-in-out infinite;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.gradient};
    border-radius: 12px;
    opacity: 0.6;
    animation: ${pulseRing} 2s ease-out infinite;
  }
  
  svg {
    font-size: 24px;
    color: white;
    animation: ${rotateIcon} 8s linear infinite;
  }
  
  ${LogoWrapper}:hover & {
    transform: scale(1.1);
    
    &::before {
      animation: ${pulseRing} 1s ease-out infinite;
    }
  }
`;

const LogoText = styled.div`
  font-weight: 800;
  font-size: 24px;
  background: ${({ theme }) => theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${logoGlow} 3s ease-in-out infinite;
  letter-spacing: 1px;
  
  .fit {
    font-weight: 800;
  }
  
  .track {
    font-weight: 600;
    opacity: 0.9;
  }
`;

const SmallBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #FF453A;
  color: white;
  font-size: 8px;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 10px;
  animation: ${pulseRing} 1.5s ease-in-out infinite;
`;

const Nav = styled.div`
  background: ${({ theme }) => theme.bg};
  backdrop-filter: blur(10px);
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  transition: all 0.3s ease;
`;

const NavContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
`;

const Mobileicon = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const NavItems = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  list-style: none;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Navlink = styled(NavLink)`
  position: relative;
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    width: 0;
    height: 2px;
    background: ${({ theme }) => theme.gradient};
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    transform: translateY(-2px);
    
    &::after {
      width: 80%;
    }
  }
  
  &.active {
    color: ${({ theme }) => theme.primary};
    
    &::after {
      width: 80%;
    }
  }
`;

const UserContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const ThemeToggle = styled(IconButton)`
  transition: all 0.3s ease !important;
  
  &:hover {
    transform: rotate(180deg) scale(1.1);
  }
`;

const MobileMenu = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  list-style: none;
  width: 100%;
  padding: 24px;
  background: ${({ theme }) => theme.bg};
  position: absolute;
  top: 80px;
  left: 0;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform: ${({ $isOpen }) => $isOpen ? "translateY(0)" : "translateY(-120%)"};
  opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
  z-index: ${({ $isOpen }) => ($isOpen ? "999" : "-1")};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 10px 30px ${({ theme }) => theme.shadow};
`;

const StyledAvatar = styled(Avatar)`
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${({ theme }) => theme.primary};
  
  &:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 0 0 4px ${({ theme }) => theme.primary + "40"};
  }
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  
  @media (max-width: 600px) {
    display: none;
  }
`;

const ProfileMenu = styled.div`
  position: relative;
`;

const ProfileDropdown = styled.div`
  position: absolute;
  top: 55px;
  right: 0;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 8px;
  min-width: 180px;
  z-index: 1000;
  box-shadow: 0 10px 30px ${({ theme }) => theme.shadow};
  animation: fadeIn 0.2s ease;
`;

const DropdownItem = styled.div`
  padding: 10px 16px;
  cursor: pointer;
  border-radius: 10px;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.bgLight};
    color: ${({ theme }) => theme.primary};
  }
`;

const ReminderButton = styled(IconButton)`
  transition: all 0.3s ease !important;
  
  &:hover {
    transform: scale(1.1) rotate(15deg);
  }
`;

const Navbar = ({ toggleTheme, isDark }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setisOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const user = useSelector((state) => state.user?.user);
  
  const userName = user?.name || "User";
  const userImg = user?.img || user?.profilePicture || null;
  const userInitial = userName?.charAt(0)?.toUpperCase() || "U";

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Workouts", path: "/workouts" },
    { name: "Progress", path: "/progress" },
    { name: "Tutorials", path: "/tutorials" },
    { name: "Diet", path: "/diet" },
    { name: "Reports", path: "/reports" },
    { name: "Feedback", path: "/feedback" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("fittrack-app-token");
    localStorage.removeItem("fittrack-app-user");
    navigate("/auth");
    setIsProfileOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsProfileOpen(false);
  };

  return (
    <>
      <Nav>
        <NavContainer>
          <Mobileicon onClick={() => setisOpen(!isOpen)}>
            <MenuRounded sx={{ color: "inherit", fontSize: "28px" }} />
          </Mobileicon>
          
          {/* Animated Logo */}
          <LogoWrapper to="/">
            <AnimatedIcon>
              <FitnessCenter />
              <SmallBadge>🔥</SmallBadge>
            </AnimatedIcon>
            <LogoText>
              <span className="fit">Fit</span>
              <span className="track">Track</span>
            </LogoText>
          </LogoWrapper>

          <MobileMenu $isOpen={isOpen}>
            {navItems.map((item) => (
              <Navlink 
                key={item.name}
                to={item.path}
                onClick={() => setisOpen(false)}
              >
                {item.name}
              </Navlink>
            ))}
          </MobileMenu>

          <NavItems>
            {navItems.map((item) => (
              <Navlink key={item.name} to={item.path}>
                {item.name}
              </Navlink>
            ))}
          </NavItems>

          <UserContainer>
            <Tooltip title="Set Reminder">
              <ReminderButton onClick={() => setShowReminderModal(true)}>
                <NotificationsActiveIcon sx={{ color: isDark ? "#FFD60A" : "#0A84FF" }} />
              </ReminderButton>
            </Tooltip>
            
            <Tooltip title={isDark ? "Light Mode" : "Dark Mode"}>
              <ThemeToggle onClick={toggleTheme}>
                {isDark ? <LightMode sx={{ color: "#FFD60A" }} /> : <DarkMode sx={{ color: "#0A84FF" }} />}
              </ThemeToggle>
            </Tooltip>
            
            <ProfileMenu>
              <Tooltip title={userName}>
                <StyledAvatar 
                  src={userImg} 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  {!userImg && userInitial}
                </StyledAvatar>
              </Tooltip>
              
              {isProfileOpen && (
                <ProfileDropdown>
                  <DropdownItem onClick={() => handleNavigation("/profile")}>
                    👤 My Profile
                  </DropdownItem>
                  <DropdownItem onClick={() => handleNavigation("/settings")}>
                    ⚙️ Settings
                  </DropdownItem>
                  <DropdownItem onClick={handleLogout}>
                    🚪 Logout
                  </DropdownItem>
                </ProfileDropdown>
              )}
            </ProfileMenu>
            
            <UserName>{userName}</UserName>
          </UserContainer>
        </NavContainer>
      </Nav>
      
      <ReminderModal 
        isOpen={showReminderModal} 
        onClose={() => setShowReminderModal(false)}
      />
    </>
  );
};

export default Navbar;