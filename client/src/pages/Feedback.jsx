import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { saveFeedback } from "../api";
import { 
  EmailRounded, SupportAgentRounded, BugReportRounded, 
  StarRounded, SendRounded,
  PhoneRounded, AccessTimeRounded, Instagram, Facebook, Twitter 
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Container = styled.div`
  flex: 1;
  min-height: calc(100vh - 80px);
  padding: 32px 24px;
  background: ${({ theme }) => theme.bg};
  overflow-y: auto;
`;

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  animation: ${fadeUp} 0.5s ease;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  background: ${({ theme }) => theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  max-width: 600px;
  margin: 0 auto;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 32px;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const InfoSection = styled.div`
  animation: ${slideInLeft} 0.5s ease;
`;

const InfoCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 24px;
  padding: 28px;
  margin-bottom: 24px;
`;

const InfoTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border + "50"};
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoIcon = styled.div`
  width: 44px;
  height: 44px;
  background: ${({ theme }) => theme.primary + "15"};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary};
`;

const InfoText = styled.div`
  flex: 1;
  
  .label {
    font-size: 12px;
    color: ${({ theme }) => theme.text_secondary};
    margin-bottom: 4px;
  }
  
  .value {
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 20px;
`;

const SocialIcon = styled.a`
  width: 44px;
  height: 44px;
  background: ${({ theme }) => theme.bgLight};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text_secondary};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
    transform: translateY(-3px);
  }
`;

const FormSection = styled.div`
  animation: ${slideInRight} 0.5s ease;
`;

const FormCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 24px;
  padding: 28px;
`;

const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  
  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const TypeBtn = styled.button`
  padding: 12px;
  border-radius: 12px;
  border: 2px solid ${({ $active, theme }) => $active ? theme.primary : theme.border};
  background: ${({ $active, theme }) => $active ? theme.primary + "10" : "transparent"};
  color: ${({ $active, theme }) => $active ? theme.primary : theme.text_secondary};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    transform: translateY(-2px);
  }
`;

const InputGroup = styled.div`
  margin-bottom: 18px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary + "20"};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary + "60"};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary + "20"};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary + "60"};
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: ${({ theme }) => theme.gradient};
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px ${({ theme }) => theme.primary + "40"};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SuccessBanner = styled.div`
  background: ${({ theme }) => theme.green + "15"};
  border: 1px solid ${({ theme }) => theme.green};
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  animation: ${fadeUp} 0.3s ease;
  
  .icon {
    font-size: 48px;
    color: ${({ theme }) => theme.green};
    margin-bottom: 12px;
  }
  
  h3 {
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.green};
    margin-bottom: 8px;
  }
  
  p {
    color: ${({ theme }) => theme.text_secondary};
  }
`;

const feedbackTypes = [
  { label: "Support", icon: <SupportAgentRounded />, value: "General Support" },
  { label: "Bug Report", icon: <BugReportRounded />, value: "Bug Report" },
  { label: "Feedback", icon: <StarRounded />, value: "Feedback" },
  { label: "General", icon: <EmailRounded />, value: "General Inquiry" },
];

const Feedback = () => {
  const [type, setType] = useState("General Support");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      alert("Please fill in all required fields.");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await saveFeedback({
        type: type,
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message
      });
      
      if (response.data.success) {
        setSubmitted(true);
        setForm({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        alert(response.data.message || "Failed to send message");
      }
    } catch (err) {
      console.log("Error submitting feedback:", err);
      alert(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Header>
          <Title>Feedback & Support 💬</Title>
          <Subtitle>Have questions, found a bug, or want to share feedback? We'd love to hear from you.</Subtitle>
        </Header>

        <ContentGrid>
          <InfoSection>
            <InfoCard>
              <InfoTitle>
                <SupportAgentRounded sx={{ color: "#0A84FF" }} />
                Get in Touch
              </InfoTitle>
              
              <InfoItem>
                <InfoIcon><EmailRounded /></InfoIcon>
                <InfoText>
                  <div className="label">Email Us</div>
                  <div className="value">support@fittrack.com</div>
                </InfoText>
              </InfoItem>
              
              <InfoItem>
                <InfoIcon><PhoneRounded /></InfoIcon>
                <InfoText>
                  <div className="label">Call Us</div>
                  <div className="value">+1 (800) 123-4567</div>
                </InfoText>
              </InfoItem>
              
              <InfoItem>
                <InfoIcon><AccessTimeRounded /></InfoIcon>
                <InfoText>
                  <div className="label">Support Hours</div>
                  <div className="value">Mon-Fri: 9AM - 6PM EST</div>
                </InfoText>
              </InfoItem>
              
              <SocialLinks>
                <SocialIcon href="#"><Instagram /></SocialIcon>
                <SocialIcon href="#"><Facebook /></SocialIcon>
                <SocialIcon href="#"><Twitter /></SocialIcon>
              </SocialLinks>
            </InfoCard>
            
            <InfoCard>
              <InfoTitle>
                <StarRounded sx={{ color: "#FF9F0A" }} />
                Why Choose Us?
              </InfoTitle>
              <InfoItem>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>⚡ 24/7 Support</div>
                  <div style={{ fontSize: 13, color: "#6C6C7A" }}>Round-the-clock assistance</div>
                </div>
              </InfoItem>
              <InfoItem>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>📱 Multi-platform</div>
                  <div style={{ fontSize: 13, color: "#6C6C7A" }}>Available on all devices</div>
                </div>
              </InfoItem>
              <InfoItem>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>💯 Satisfaction Guaranteed</div>
                  <div style={{ fontSize: 13, color: "#6C6C7A" }}>We value your feedback</div>
                </div>
              </InfoItem>
            </InfoCard>
          </InfoSection>

          <FormSection>
            <FormCard>
              {submitted ? (
                <SuccessBanner>
                  <div className="icon">✅</div>
                  <h3>Feedback Submitted Successfully!</h3>
                  <p>Thanks for your valuable feedback. We'll get back to you within 24 hours.</p>
                </SuccessBanner>
              ) : (
                <>
                  <TypeGrid>
                    {feedbackTypes.map((t) => (
                      <TypeBtn
                        key={t.label}
                        $active={type === t.value}
                        onClick={() => setType(t.value)}
                      >
                        {t.icon}
                        <span>{t.label}</span>
                      </TypeBtn>
                    ))}
                  </TypeGrid>

                  <Row>
                    <InputGroup>
                      <Label>Full Name *</Label>
                      <Input
                        name="name"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    <InputGroup>
                      <Label>Email Address *</Label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </Row>

                  <InputGroup>
                    <Label>Subject</Label>
                    <Input
                      name="subject"
                      placeholder={`${type} — briefly describe`}
                      value={form.subject}
                      onChange={handleChange}
                    />
                  </InputGroup>

                  <InputGroup>
                    <Label>Message *</Label>
                    <Textarea
                      name="message"
                      placeholder="Please provide details about your inquiry or feedback..."
                      value={form.message}
                      onChange={handleChange}
                    />
                  </InputGroup>

                  <SubmitBtn onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? <CircularProgress size={20} style={{ color: 'white' }} /> : <><SendRounded /> Submit Feedback</>}
                  </SubmitBtn>
                </>
              )}
            </FormCard>
          </FormSection>
        </ContentGrid>
      </Wrapper>
    </Container>
  );
};

export default Feedback;