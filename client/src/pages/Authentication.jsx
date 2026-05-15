import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

const Container = styled.div`
  flex: 1;
  height: 100vh;
  display: flex;
  background: #0d0d0d;
  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 1;
  position: relative;
  background: url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80') center/cover;
  @media (max-width: 700px) {
    display: none;
  }
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0,0,0,0.6), rgba(46,125,50,0.3));
  }
`;

const LeftContent = styled.div`
  position: absolute;
  bottom: 48px;
  left: 48px;
  color: white;
  z-index: 1;
  h2 {
    font-size: 44px;
    margin: 0;
    line-height: 1.2;
  }
  p {
    font-size: 17px;
    opacity: 0.8;
    margin-top: 10px;
  }
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #111827;
`;

const Authentication = () => {
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('signup') === 'true') {
      setIsSignUp(true);
    }
  }, [location]);

  return (
    <Container>
      <Left>
        <LeftContent>
          <h2>Track Every Rep.<br />Own Every Day.</h2>
          <p>Your fitness journey starts here</p>
        </LeftContent>
      </Left>
      <Right>
        {isSignUp ? <SignUp /> : <SignIn />}
        <p style={{ color: "#888", marginTop: 20 }}>
          {isSignUp ? "Already have an account? " : "New to FitTrack? "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              background: "none",
              border: "none",
              color: isSignUp ? "#66bb6a" : "#42a5f5",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            {isSignUp ? "Sign In" : "Create Account ✨"}
          </button>
        </p>
      </Right>
    </Container>
  );
};

export default Authentication;