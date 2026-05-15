import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserRegister } from "../api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // ✅ ADD THIS IMPORT

// Animations
const slideUp = keyframes`
  0%   { transform: translateX(-50%) translateY(120px); opacity: 0; }
  40%  { transform: translateX(-50%) translateY(-10px); opacity: 1; }
  60%  { transform: translateX(-50%) translateY(4px);  opacity: 1; }
  100% { transform: translateX(-50%) translateY(0px);  opacity: 1; }
`;
const slideDown = keyframes`
  0%   { transform: translateX(-50%) translateY(0px);   opacity: 1; }
  100% { transform: translateX(-50%) translateY(120px); opacity: 0; }
`;
const spin = keyframes`to { transform: rotate(360deg); }`;
const fadeIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;
const glowPulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(102, 187, 106, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(102, 187, 106, 0); }
  100% { box-shadow: 0 0 0 0 rgba(102, 187, 106, 0); }
`;

// Toast
const ToastWrapper = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%) translateY(0px);
  z-index: 9999;
  animation: ${({ $hiding }) => ($hiding ? slideDown : slideUp)} 0.5s
    cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
`;
const ToastPill = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 26px 14px 14px;
  background: linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%);
  border-radius: 999px;
  box-shadow: 0 8px 32px rgba(46, 125, 50, 0.5), 0 2px 8px rgba(0,0,0,0.2);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
`;
const AvatarCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
  border: 2px solid rgba(255,255,255,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  overflow: hidden;
  flex-shrink: 0;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

// Layout
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  background: #0d0d0d;
`;
const LeftPanel = styled.div`
  flex: 1;
  background: url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80') center/cover no-repeat;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 48px;
  @media (max-width: 768px) { display: none; }
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(13,13,13,0.75) 0%, rgba(46,125,50,0.3) 100%);
  }
`;
const LeftContent = styled.div`
  position: relative;
  z-index: 1;
  color: #fff;
  animation: ${fadeIn} 0.8s ease;
  h2 { 
    font-size: 44px; 
    font-weight: 800; 
    line-height: 1.15; 
    margin: 0 0 14px 0; 
    text-shadow: 0 2px 16px rgba(0,0,0,0.5);
    animation: ${float} 3s ease-in-out infinite;
  }
  p { font-size: 17px; color: rgba(255,255,255,0.65); margin: 0; }
`;
const RightPanel = styled.div`
  width: 480px;
  background: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  overflow-y: auto;
  @media (max-width: 768px) { width: 100%; background: linear-gradient(135deg, #0f0c29, #1a1a2e); }
`;
const Card = styled.div`
  width: 100%;
  max-width: 420px;
  animation: ${fadeIn} 0.6s ease forwards;
`;
const Logo = styled.div`
  margin-bottom: 24px;
  text-align: center;
  h1 {
    font-size: 28px; font-weight: 800;
    background: linear-gradient(135deg, #66bb6a, #ab47bc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 5px 0;
  }
  p { color: rgba(255,255,255,0.4); font-size: 14px; margin: 0; }
`;

// Avatar Upload
const AvatarUpload = styled.div`
  display: flex; flex-direction: column; align-items: center; margin-bottom: 20px;
`;
const AvatarRing = styled.div`
  width: 80px; height: 80px; border-radius: 50%;
  background: rgba(255,255,255,0.06);
  border: 2px dashed rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; overflow: hidden;
  transition: all 0.3s ease;
  animation: ${glowPulse} 2s infinite;
  &:hover { 
    border-color: #66bb6a; 
    background: rgba(102,187,106,0.08);
    transform: scale(1.05);
  }
  img { width: 100%; height: 100%; object-fit: cover; }
`;
const AvatarPlaceholder = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  color: rgba(255,255,255,0.3); font-size: 11px; text-align: center;
  span:first-child { font-size: 24px; }
`;
const AvatarHint = styled.p`
  color: rgba(255,255,255,0.3); font-size: 12px; margin: 8px 0 0 0; text-align: center;
`;

// Form
const Row = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  margin-bottom: 12px;
`;
const Field = styled.div`margin-bottom: 16px;`;
const Label = styled.label`
  display: block; color: rgba(255,255,255,0.5); font-size: 11px;
  font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 7px;
`;
const Input = styled.input`
  width: 100%; padding: 12px 14px;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; color: #fff; font-size: 14px; outline: none;
  transition: all 0.2s ease; box-sizing: border-box;
  &::placeholder { color: rgba(255,255,255,0.2); }
  &:focus { 
    border-color: #66bb6a; 
    background: rgba(102,187,106,0.07);
    transform: translateX(4px);
  }
`;

// Goal Select
const GoalSelect = styled.select`
  width: 100%; padding: 12px 14px;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px; color: #fff; font-size: 14px; outline: none;
  cursor: pointer;
  &:focus { border-color: #66bb6a; }
  option { background: #111827; }
`;

// Password Wrapper
const PasswordWrapper = styled.div`
  position: relative; display: flex; align-items: center;
`;
const PasswordInput = styled(Input)`
  padding-right: 42px;
`;
const EyeButton = styled.button`
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,0.4);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  &:hover { color: #66bb6a; transform: translateY(-50%) scale(1.1); }
`;

const ErrorBox = styled.div`
  background: rgba(239,83,80,0.12); border: 1px solid rgba(239,83,80,0.35);
  border-radius: 10px; padding: 11px 16px; color: #ef9a9a;
  font-size: 13px; margin-bottom: 16px; text-align: center;
  animation: ${fadeIn} 0.3s ease;
`;
const SubmitBtn = styled.button`
  width: 100%; padding: 14px;
  background: linear-gradient(135deg, #2e7d32, #66bb6a);
  border: none; border-radius: 10px; color: #fff;
  font-size: 16px; font-weight: 700; cursor: pointer;
  transition: all 0.2s ease;
  display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 4px;
  &:hover:not(:disabled) { 
    transform: translateY(-2px); 
    box-shadow: 0 8px 24px rgba(46,125,50,0.45);
  }
  &:active:not(:disabled) { transform: translateY(0); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
const Spinner = styled.div`
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
  border-radius: 50%; animation: ${spin} 0.7s linear infinite;
`;
const Divider = styled.div`
  display: flex; align-items: center; gap: 12px; margin: 20px 0;
  span { color: rgba(255,255,255,0.2); font-size: 13px; }
  &::before, &::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
`;
const SwitchText = styled.p`
  text-align: center; color: rgba(255,255,255,0.35); font-size: 14px; margin: 0;
  button { 
    background: none; border: none; color: #66bb6a; font-size: 14px; 
    font-weight: 700; cursor: pointer; padding: 0; 
    transition: all 0.2s ease;
    &:hover { 
      text-decoration: underline;
      transform: scale(1.05);
      display: inline-block;
    }
  }
`;

// Welcome Toast
const WelcomeToast = ({ name, img, goal, onDone }) => {
  const [hiding, setHiding] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setHiding(true), 3000);
    const t2 = setTimeout(() => onDone(), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);
  
  const goalMessage = goal === "weight_loss" ? "🔥 We'll help you lose weight!" :
                      goal === "muscle_gain" ? "💪 Get ready to build muscle!" :
                      "🌟 Let's start your fitness journey!";
  
  return (
    <ToastWrapper $hiding={hiding}>
      <ToastPill>
        <AvatarCircle>
          {img ? <img src={img} alt={name} /> : (name?.[0] || "U").toUpperCase()}
        </AvatarCircle>
        🎉 Welcome, {name}! {goalMessage}
      </ToastPill>
    </ToastWrapper>
  );
};

// Main SignUp Component
const SignUp = () => {
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const fileRef    = useRef();

  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [height, setHeight]       = useState("");
  const [weight, setWeight]       = useState("");
  const [goal, setGoal]           = useState("muscle_gain");
  const [imgBase64, setImgBase64] = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [toastUser, setToastUser] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError("Image must be under 2MB."); return; }
    const reader = new FileReader();
    reader.onload = () => setImgBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRegister = async () => {
    setError("");
    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError("Please fill in all required fields."); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address."); return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }
    if (password !== confirm) {
      setError("Passwords do not match."); return;
    }

    setLoading(true);
    try {
      const res = await UserRegister({ 
        name, email, password, img: imgBase64,
        height: parseFloat(height) || null,
        weight: parseFloat(weight) || null,
        fitnessGoal: goal
      });
      
      // DIRECT LOGIN - NO VERIFICATION
      const { token, user } = res.data;
      const userData = {
        ...user,
        img: user?.img || imgBase64 || null,
        name: user?.name || name,
      };
      dispatch(loginSuccess({ token, user: userData }));
      localStorage.setItem("fittrack-app-token", token);
      localStorage.setItem("fittrack-app-user", JSON.stringify(userData));
      setToastUser({
        name: userData.name,
        img: userData.img,
        goal: goal
      });
      
    } catch (err) {
      console.error("❌ Signup error:", err);
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      {toastUser && (
        <WelcomeToast
          name={toastUser.name}
          img={toastUser.img}
          goal={toastUser.goal}
          onDone={() => {
            navigate("/");
          }}
        />
      )}

      <PageWrapper>
        <LeftPanel>
          <LeftContent>
            <h2>Build Your<br />Best Self.</h2>
            <p>Join thousands reaching their fitness goals.</p>
          </LeftContent>
        </LeftPanel>

        <RightPanel>
          <Card>
            <Logo>
              <h1>💪 FitTrack</h1>
              <p>Create your free account</p>
            </Logo>

            <AvatarUpload>
              <AvatarRing onClick={() => fileRef.current.click()}>
                {imgBase64
                  ? <img src={imgBase64} alt="Profile" />
                  : <AvatarPlaceholder><span>📷</span><span>Add Photo</span></AvatarPlaceholder>
                }
              </AvatarRing>
              <AvatarHint>Optional · Max 2MB</AvatarHint>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
            </AvatarUpload>

            {error && <ErrorBox>{error}</ErrorBox>}

            <Field>
              <Label>Full Name *</Label>
              <Input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>

            <Field>
              <Label>Email Address *</Label>
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>

            <Row>
              <Field>
                <Label>Height (cm)</Label>
                <Input type="number" placeholder="e.g., 175" value={height} onChange={(e) => setHeight(e.target.value)} />
              </Field>
              <Field>
                <Label>Weight (kg)</Label>
                <Input type="number" placeholder="e.g., 70" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </Field>
            </Row>

            <Field>
              <Label>Fitness Goal *</Label>
              <GoalSelect value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option value="weight_loss">🔥 Weight Loss 🔥</option>
                <option value="muscle_gain">💪 Muscle Gain 💪</option>
                <option value="maintain">⚖️ Maintain Weight ⚖️</option>
                <option value="flexibility">🧘 Flexibility 🧘</option>
              </GoalSelect>
            </Field>

            <Row>
              <Field>
                <Label>Password *</Label>
                <PasswordWrapper>
                  <PasswordInput
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <EyeButton type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </EyeButton>
                </PasswordWrapper>
              </Field>

              <Field>
                <Label>Confirm *</Label>
                <PasswordWrapper>
                  <PasswordInput
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                  />
                  <EyeButton type="button" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </EyeButton>
                </PasswordWrapper>
              </Field>
            </Row>

            <SubmitBtn onClick={handleRegister} disabled={loading}>
              {loading ? <><Spinner /> Creating account...</> : "Create Account ➡️"}
            </SubmitBtn>

            <Divider><span>or</span></Divider>

            <SwitchText>
              Already have an account?{" "}
              <button onClick={() => navigate("/auth")}>Sign in ✨</button>
            </SwitchText>
          </Card>
        </RightPanel>
      </PageWrapper>
    </>
  );
};

export default SignUp;