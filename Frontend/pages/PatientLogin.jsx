import { jwtDecode } from "jwt-decode";
import { useLogin } from "../context/loginContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url('https://img.freepik.com/free-vector/login-concept-illustration_114360-739.jpg?ga=GA1.2.266770536.1725950979&semt=ais_hybrid') center/cover no-repeat;
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
  max-width: 400px;
  width: 100%;
  @media (max-width: 768px) {
    padding: 20px;
    max-width: 90%;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const FooterText = styled.p`
  margin-top: 20px;
  font-size: 0.9rem;
  color: #555;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const StyledGoogleLogin = styled(GoogleLogin)`
  width: 100%;
  margin-top: 20px;
  max-width: 320px;
  padding: 10px;
  border-radius: 8px;
  background-color: #4285f4;
  color: white;
  text-align: center;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  &:hover {
    background-color: #357ae8;
  }
`;

function GoogleSignIn() {
  const { login, setRole } = useLogin();
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    if (credentialResponse.credential) {
      const decodedUser = jwtDecode(credentialResponse.credential); 
      login(decodedUser);
      setRole("patient");
      console.log("Google sign-in success", decodedUser);
      navigate('/');
    }
  };

  const handleError = () => {
    console.log("Google sign-in error");
  };

  return (
    <Container>
      <LoginBox>
        <Title>Patient Login</Title>
        <GoogleOAuthProvider clientId={'30449435071-r8fbkkj05du8grlde06td5ge5k16kn4u.apps.googleusercontent.com'}>
          <StyledGoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </GoogleOAuthProvider>
      </LoginBox>
    </Container>
  );
}

export default GoogleSignIn;
