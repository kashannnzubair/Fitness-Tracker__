import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Tutorials from "./pages/Tutorials";
import Diet from "./pages/Diet";
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ChangePassword from './pages/ChangePassword';
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Progress from "./pages/Progress";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";
import { loginSuccess } from "./redux/reducers/userSlice";
import { lightTheme, darkTheme } from "./utils/Themes";

const PrivateRoute = ({ children }) => {
  const token = useSelector((s) => s.user?.token) || localStorage.getItem("fittrack-app-token");
  return token ? children : <Navigate to="/auth" replace />;
};

const PublicRoute = ({ children }) => {
  const token = useSelector((s) => s.user?.token) || localStorage.getItem("fittrack-app-token");
  return token ? <Navigate to="/" replace /> : children;
};

const Layout = ({ children, toggleTheme, isDark }) => (
  <>
    <Navbar toggleTheme={toggleTheme} isDark={isDark} />
    {children}
  </>
);

function App() {
  const dispatch = useDispatch();
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("fittrack-theme");
    return savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem("fittrack-theme", !isDark ? "dark" : "light");
  };

  useEffect(() => {
    const token = localStorage.getItem("fittrack-app-token");
    const user = localStorage.getItem("fittrack-app-user");
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        dispatch(loginSuccess({ token, user: parsedUser }));
      } catch (error) {
        console.error("Failed to restore user data:", error);
      }
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <div style={{ 
        background: isDark ? "#0A0A0F" : "#FFFFFF", 
        minHeight: "100vh",
        transition: "background 0.3s ease"
      }}>
        <Routes>
          {/* Public Routes - Forgot Password Flow */}
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/verify-otp/:email" element={<PublicRoute><VerifyOTP /></PublicRoute>} />
          <Route path="/change-password/:email" element={<PublicRoute><ChangePassword /></PublicRoute>} />
          
          {/* Auth Routes - No Navbar */}
          <Route path="/auth" element={<PublicRoute><SignIn /></PublicRoute>} />
          <Route path="/auth/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
          
          {/* Protected Routes - With Navbar and Theme */}
          <Route path="/" element={
            <PrivateRoute>
              <Layout toggleTheme={toggleTheme} isDark={isDark}>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/workouts" element={
            <PrivateRoute>
              <Layout toggleTheme={toggleTheme} isDark={isDark}>
                <Workouts />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/tutorials" element={
            <PrivateRoute>
              <Layout toggleTheme={toggleTheme} isDark={isDark}>
                <Tutorials />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/diet" element={
            <PrivateRoute>
              <Layout toggleTheme={toggleTheme} isDark={isDark}>
                <Diet />
              </Layout>
            </PrivateRoute>
          } />
          
          {/* NEW ROUTES - Profile, Progress, Reports, Settings */}
          <Route path="/profile" element={
            <PrivateRoute>
              <Layout toggleTheme={toggleTheme} isDark={isDark}>
                <Profile />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/progress" element={
            <PrivateRoute>
              <Layout toggleTheme={toggleTheme} isDark={isDark}>
                <Progress />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/reports" element={
            <PrivateRoute>
              <Layout toggleTheme={toggleTheme} isDark={isDark}>
                <Reports />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/settings" element={
            <PrivateRoute>
              <Layout toggleTheme={toggleTheme} isDark={isDark}>
                <Settings toggleTheme={toggleTheme} isDark={isDark} />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/contact" element={
            <PrivateRoute>
              <Layout toggleTheme={toggleTheme} isDark={isDark}>
                <Contact />
              </Layout>
            </PrivateRoute>
          } />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;