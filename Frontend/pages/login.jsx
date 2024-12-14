import React, { useState } from 'react';
import DoctorLogin from './DoctorLogin'; 
import GoogleSignIn from './PatientLogin'; 
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, hsl(171, 100%, 44%) 0%, hsl(171, 100%, 36%) 100%);
  padding: 0 20px;
`;

const RoleSelectionBox = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
`;

const RoleButton = styled.button`
  background-color: hsl(171, 100%, 44%);
  color: white;
  font-size: 1.2rem;
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: hsl(171, 100%, 36%);
  }

  &:focus {
    outline: none;
  }
`;

function Login() {
  const [isDoctor, setIsDoctor] = useState(null); 

  const handleRoleSelection = (role) => {
    setIsDoctor(role === 'doctor');
  };

  return (
    <Container>
      {isDoctor === null ? (
        <RoleSelectionBox>
          <Title>Select your role</Title>
          <RoleButton onClick={() => handleRoleSelection('doctor')}>Doctor</RoleButton>
          <RoleButton onClick={() => handleRoleSelection('patient')}> Patient</RoleButton>
        </RoleSelectionBox>
      ) : isDoctor ? (
        <DoctorLogin />
      ) : (
        <GoogleSignIn />
      )}
    </Container>
  );
}

export default Login;
