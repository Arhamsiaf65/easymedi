import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useLogin } from "../context/loginContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import styled from "styled-components";

// Function to verify if the user is a doctor
const verifyDoctor = async (id) => {
  try {
    const response = await fetch('https://easymedi-backend.vercel.app/doctors/find', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error in POST request:', error);
    return null;
  }
};

// Styled loading spinner
const LoadingSpinner = styled.div`
  margin: 20px;
  font-size: 1.5rem;
  color: #4285f4;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  text-align: center;
`;

// Styled components for the layout
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, #00DEBE 0%, #2975fc 100%);
  padding: 0 20px;
  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

const LoginBox = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 450px;
  width: 100%;
  @media (max-width: 768px) {
    padding: 20px;
    max-width: 90%;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FooterText = styled.p`
  margin-top: 20px;
  font-size: 1rem;
  color: #555;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const StyledGoogleLogin = styled(GoogleLogin)`
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  border-radius: 8px;
  background-color: #00DEBE;
  color: white;
  font-size: 1.2rem;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #357ae8;
  }
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

function DoctorLogin() {
  const { login, setRole } = useLogin();
  const navigate = useNavigate();
  
  // State to manage loading
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    if (credentialResponse.credential) {
      setLoading(true); 
      const decodedUser = jwtDecode(credentialResponse.credential);
      
      const doctorData = await verifyDoctor(decodedUser.email);
      
      if (doctorData && doctorData.id === decodedUser.email) {
        login(decodedUser);
        setRole("doctor");
        navigate('/'); 
      } else {
        alert("Invalid Doctor");
      }
      setLoading(false); 
    }
  };

  const handleError = () => {
    console.log("Google sign-in error");
  };

  return (
    <Container>
      <LoginBox>
        <Title>Doctor Login</Title>
        {loading ? (
          <LoadingSpinner>Verifying...</LoadingSpinner> 
        ) : (
          <GoogleOAuthProvider clientId={'30449435071-r8fbkkj05du8grlde06td5ge5k16kn4u.apps.googleusercontent.com'}>
            <StyledGoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </GoogleOAuthProvider>
        )}
      </LoginBox>
    </Container>
  );
}

export default DoctorLogin;
