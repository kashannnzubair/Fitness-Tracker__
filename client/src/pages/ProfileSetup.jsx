import React, { useState } from "react";
import styled from "styled-components";
import { updateUserProfile } from "../api";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";

const Container = styled.div`
  flex: 1; height: 100vh; display: flex; flex-direction: column;
  padding: 20px; align-items: center; background: ${({ theme }) => theme.bg};
`;
const Title = styled.h1`
  font-size: 24px; color: ${({ theme }) => theme.text_primary}; margin-top: 40px;
`;
const SubTitle = styled.p`
  font-size: 14px; color: ${({ theme }) => theme.text_secondary};
  text-align: center; margin-bottom: 40px;
`;
const GenderContainer = styled.div`
  display: flex; gap: 20px; margin-bottom: 40px;
`;
const GenderCard = styled.div`
  width: 120px; height: 150px; border-radius: 20px;
  border: 2px solid ${({ $selected, theme }) => ($selected ? theme.primary : theme.text_secondary + "20")};
  background: ${({ $selected, theme }) => ($selected ? theme.primary + "10" : "transparent")};
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; cursor: pointer; transition: all 0.2s ease;
`;

const ProfileSetup = () => {
  const [gender, setGender] = useState("Male");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // Keep the existing token from Redux state
  const existingToken = useSelector((state) => state.user.token);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await updateUserProfile({ gender, weeklyGoal: 4 });
      // ✅ Pass BOTH user (updated) and token (existing) so token is never lost
      dispatch(loginSuccess({
        user: res.data.user,
        token: existingToken || localStorage.getItem("fittrack-app-token"),
      }));
    } catch (err) {
      alert("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Tell Us About Yourself 💪</Title>
      <SubTitle>Select your gender to personalize your experience</SubTitle>

      <GenderContainer>
        <GenderCard $selected={gender === "Male"} onClick={() => setGender("Male")}>
          <span style={{ fontSize: "40px" }}>👨</span>
          <span style={{ fontWeight: 600, marginTop: 8 }}>Male</span>
        </GenderCard>
        <GenderCard $selected={gender === "Female"} onClick={() => setGender("Female")}>
          <span style={{ fontSize: "40px" }}>👩</span>
          <span style={{ fontWeight: 600, marginTop: 8 }}>Female</span>
        </GenderCard>
      </GenderContainer>

      <Button
        text="Continue →"
        onClick={handleUpdate}
        isLoading={loading}
        isDisabled={loading}
      />
    </Container>
  );
};

export default ProfileSetup;