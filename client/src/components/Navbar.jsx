import React, { useState } from "react";
import styled from "styled-components";
import LogoImg from "../utils/Images/Logo.png";
import { Link as LinkR, NavLink } from "react-router-dom";
import { MenuRounded, DarkMode, LightMode } from "@mui/icons-material";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/reducers/userSlice";

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

const NavLogo = styled(LinkR)`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 20px;
  text-decoration: none;
  background: ${({ theme }) => theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const Logo = styled.img`
  height: 42px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: rotate(5deg);
  }
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

const TextButton = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primary + "10"};
    transform: translateY(-2px);
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

// Profile Menu Items
const ProfileMenu = styled.div`
  position: relative;
`;

const ProfileDropdown = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 8px;
  min-width: 200px;
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

const Navbar = ({ toggleTheme, isDark }) => {
  const dispatch = useDispatch();
  const [isOpen, setisOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = useSelector((state) => state.user?.user);
  
  const userName = user?.name || "User";
  const userImg = user?.img || user?.profilePicture || null;
  const userInitial = userName?.charAt(0)?.toUpperCase() || "U";

  // Navigation items - COMPLETE LIST
  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Workouts", path: "/workouts" },
    { name: "Progress", path: "/progress" },
    { name: "Tutorials", path: "/tutorials" },
    { name: "Diet", path: "/diet" },
    { name: "Reports", path: "/reports" },
    { name: "Contact", path: "/contact" },
  ];

  const profileItems = [
    { name: "My Profile", path: "/profile", icon: "👤" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
  ];

  return (
    <Nav>
      <NavContainer>
        <Mobileicon onClick={() => setisOpen(!isOpen)}>
          <MenuRounded sx={{ color: "inherit", fontSize: "28px" }} />
        </Mobileicon>
        
        <NavLogo to="/">
          <Logo src={LogoImg} />
          FitTrack
        </NavLogo>

        {/* Mobile Menu */}
        <MobileMenu $isOpen={isOpen}>
          {navItems.map((item, i) => (
            <Navlink 
              key={item.name}
              to={item.path}
              onClick={() => setisOpen(false)}
            >
              {item.name}
            </Navlink>
          ))}
        </MobileMenu>

        {/* Desktop Menu */}
        <NavItems>
          {navItems.map((item) => (
            <Navlink key={item.name} to={item.path}>
              {item.name}
            </Navlink>
          ))}
        </NavItems>

        <UserContainer>
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
                <DropdownItem onClick={() => {
                  window.location.href = "/profile";
                  setIsProfileOpen(false);
                }}>
                  👤 My Profile
                </DropdownItem>
                <DropdownItem onClick={() => {
                  window.location.href = "/settings";
                  setIsProfileOpen(false);
                }}>
                  ⚙️ Settings
                </DropdownItem>
                <DropdownItem onClick={() => {
                  dispatch(logout());
                  setIsProfileOpen(false);
                }}>
                  🚪 Logout
                </DropdownItem>
              </ProfileDropdown>
            )}
          </ProfileMenu>
          
          <UserName>{userName}</UserName>
          
          <TextButton onClick={() => dispatch(logout())}>
            Logout
          </TextButton>
        </UserContainer>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;