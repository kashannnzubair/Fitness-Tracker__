import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserLogin } from "../api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Animations
const slideUp = keyframes`
  0%   { transform: translateX(-50%) translateY(120px); opacity: 0; }
  100% { transform: translateX(-50%) translateY(0px);  opacity: 1; }
`;
const slideDown = keyframes`
  0%   { transform: translateX(-50%) translateY(0px);   opacity: 1; }
  100% { transform: translateX(-50%) translateY(120px); opacity: 0; }
`;
const fadeIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;
const shine = keyframes`
  0% { background-position: -100%; }
  100% { background-position: 200%; }
`;
const bounce = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Styled Components
const ToastWrapper = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%) translateY(0px);
  z-index: 9999;
  animation: ${({ $hiding }) => ($hiding ? slideDown : slideUp)} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
`;

const ToastPill = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 28px;
  background: linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%);
  border-radius: 60px;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 10px 30px rgba(10, 132, 255, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  .greeting {
    font-weight: 400;
    opacity: 0.9;
  }
  
  .name {
    font-weight: 800;
    letter-spacing: 0.5px;
  }
  
  .emoji {
    font-size: 24px;
    animation: ${bounce} 0.5s ease;
  }
`;

const AvatarCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255,255,255,0.25);
  border: 2px solid rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .default-avatar {
    font-size: 18px;
    font-weight: 700;
  }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  background: #0d0d0d;
`;

const LeftPanel = styled.div`
  flex: 1;
  background: url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80') center/cover;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 48px;
  @media (max-width: 768px) { display: none; }
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(13,13,13,0.75) 0%, rgba(25,118,210,0.25) 100%);
  }
`;

const LeftContent = styled.div`
  position: relative;
  z-index: 1;
  color: #fff;
  animation: ${fadeIn} 0.8s ease;
  h2 {
    font-size: 44px;
    line-height: 1.1;
    animation: ${float} 3s ease-in-out infinite;
  }
`;

const RightPanel = styled.div`
  width: 480px;
  background: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  @media (max-width: 768px) { width: 100%; }
`;

const Card = styled.div`
  width: 100%;
  max-width: 380px;
  animation: ${fadeIn} 0.6s ease;
`;

const Logo = styled.div`
  margin-bottom: 36px;
  text-align: center;
  h1 {
    font-size: 30px;
    background: linear-gradient(135deg, #42a5f5, #ab47bc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Field = styled.div`
  margin-bottom: 20px;
  position: relative;
`;

const Label = styled.label`
  display: block;
  color: rgba(255,255,255,0.5);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 13px 16px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  color: #fff;
  box-sizing: border-box;
  transition: all 0.2s ease;
  &:focus {
    border-color: #42a5f5;
    transform: translateX(4px);
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const EyeButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255,255,255,0.4);
  transition: all 0.2s ease;
  &:hover {
    color: #42a5f5;
    transform: translateY(-50%) scale(1.1);
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(25,118,210,0.45);
  }
  &:disabled { opacity: 0.6; }
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: ${({ $loading }) => $loading ? shine : 'none'} 1.5s infinite;
  }
`;

const SignUpLink = styled.p`
  text-align: center;
  margin-top: 24px;
  color: rgba(255,255,255,0.5);
  button {
    background: none;
    border: none;
    color: #42a5f5;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
    &:hover {
      transform: scale(1.05);
      text-decoration: underline;
    }
  }
`;

// Welcome Toast Component - Shows EVERY TIME user logs in
const WelcomeToast = ({ name, img, onDone }) => {
  const [hiding, setHiding] = useState(false);
  
  useEffect(() => {
    const t1 = setTimeout(() => setHiding(true), 2800);
    const t2 = setTimeout(() => onDone(), 3300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);
  
  const getMotivationMessage = () => {
    const messages = [
      "Ready to crush your goals! 💪",
      "Let's make today count! 🔥",
      "Your fitness journey continues! 🚀",
      "Stay consistent, stay strong! ⭐",
      "Great to see you again! 🎯",
      "Time to get stronger! 💪",
      "Let's smash those PRs! 🏆"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };
  
  return (
    <ToastWrapper $hiding={hiding}>
      <ToastPill>
        <AvatarCircle>
          {img ? (
            <img src={img} alt={name} />
          ) : (
            <div className="default-avatar">{name?.[0]?.toUpperCase() || "U"}</div>
          )}
        </AvatarCircle>
        <div>
          <div>
            <span className="greeting">Welcome back, </span>
            <span className="name">{name || "Fitness Enthusiast"}!</span>
          </div>
          <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "2px" }}>
            {getMotivationMessage()}
          </div>
        </div>
        <div className="emoji">💪</div>
      </ToastPill>
    </ToastWrapper>
  );
};

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastUser, setToastUser] = useState(null);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }
    
    setLoading(true);
    try {
      const res = await UserLogin({ email, password });
      const { token, user } = res.data;
      
      console.log("✅ Login response user:", user);
      
      const userData = {
        ...user,
        img: user?.img || user?.profilePicture || null,
      };
      
      // ✅ ALWAYS show toast - every time user logs in
      setToastUser({ 
        name: userData.name, 
        img: userData.img 
      });
      
      dispatch(loginSuccess({ token, user: userData }));
      localStorage.setItem("fittrack-app-token", token);
      localStorage.setItem("fittrack-app-user", JSON.stringify(userData));
      
      // Don't navigate immediately - wait for toast
      
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err?.response?.data?.message || "Login failed!");
      setLoading(false);
    }
  };

  return (
    <>
      {toastUser && (
        <WelcomeToast 
          name={toastUser.name} 
          img={toastUser.img} 
          onDone={() => {
            setLoading(false);
            navigate("/");
          }} 
        />
      )}
      <PageWrapper>
        <LeftPanel>
          <LeftContent>
            <h2>Track Every Rep.<br />Own Every Day.</h2>
          </LeftContent>
        </LeftPanel>
        <RightPanel>
          <Card>
            <Logo><h1>💪 FitTrack</h1></Logo>
            {error && <div style={{background: 'rgba(255,0,0,0.1)', border: '1px solid red', borderRadius: 8, padding: 10, color: 'red', marginBottom: 16, textAlign: 'center'}}>{error}</div>}
            <Field>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </Field>
            <Field>
              <Label>Password</Label>
              <PasswordWrapper>
                <Input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <EyeButton type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </EyeButton>
              </PasswordWrapper>
            </Field>
            <SubmitBtn onClick={handleLogin} disabled={loading} $loading={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </SubmitBtn>
            <SignUpLink>
              New to FitTrack?{" "}
              <button onClick={() => navigate("/auth/signup")}>Create Account ✨</button>
            </SignUpLink>
          </Card>
        </RightPanel>
      </PageWrapper>
    </>
  );
};

export default SignIn;