import { jwtDecode } from "jwt-decode";
import { useLogin } from "../context/loginContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import 'dotenv'

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url('https://img.freepik.com/free-vector/login-concept-illustration_114360-739.jpg?ga=GA1.2.266770536.1725950979&semt=ais_hybrid') center/cover no-repeat;
  padding: 0 20px;
`;

const LoginBox = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
`;

const FooterText = styled.p`
  margin-top: 20px;
  font-size: 0.9rem;
  color: #555;
  text-align: center;
`;

async function verifyDoctor(email) {
  // Make sure to implement this function in your backend
  const response = await fetch(`/api/verify-doctor?email=${email}`);
  const data = await response.json();
  return data.isDoctor; // assuming the API returns { isDoctor: true/false }
}

function GoogleSignIn() {
  const { login, setRole } = useLogin();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    if (credentialResponse.credential) {
      const decodedUser = jwtDecode(credentialResponse.credential); // Decode the Google token
      login(decodedUser);

      // Verify if the logged-in user is a doctor
      const isDoctor = await verifyDoctor(decodedUser.email);

      if (isDoctor) {
        setRole("doctor");
        console.log("Doctor sign-in success", decodedUser);
        navigate('/doctor-dashboard'); // Redirect to the doctor dashboard
      } else {
        setRole("patient");
        console.log("Patient sign-in success", decodedUser);
        navigate('/'); // Redirect to the patient homepage
      }
    }
  };

  const handleError = () => {
    console.log("Google sign-in error");
  };

  return (
    <Container>
      <LoginBox>
        <Title>Login</Title>
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </GoogleOAuthProvider>
        <FooterText>Don't have an account? Sign up now!</FooterText>
      </LoginBox>
    </Container>
  );
}

export default GoogleSignIn;
