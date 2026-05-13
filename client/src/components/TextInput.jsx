import { CloseRounded, Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div` flex: 1; display: flex; flex-direction: column; gap: 6px; `;
const Label = styled.label` font-size: 12px; color: ${({ theme }) => theme.text_primary}; padding: 0px 4px; `;
const OutlinedInput = styled.div`
  border-radius: 8px; border: 0.5px solid ${({ theme }) => theme.text_secondary};
  padding: 12px; display: flex; align-items: center; gap: 12px;
`;
const Input = styled.input`
  width: 100%; font-size: 14px; outline: none; border: none;
  background-color: transparent; color: ${({ theme }) => theme.text_primary};
`;

const TextInput = ({ label, placeholder, name, value, handelChange, password, textArea, rows }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Container>
      <Label>{label}</Label>
      <OutlinedInput>
        <Input
          as={textArea ? "textarea" : "input"}
          name={name}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handelChange(e)}
          type={password && !showPassword ? "password" : "text"}
        />
        {password && (
          <div style={{ cursor: "pointer", display: "flex" }} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </div>
        )}
      </OutlinedInput>
    </Container>
  );
};

export default TextInput;