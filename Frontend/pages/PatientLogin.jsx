import { jwtDecode } from "jwt-decode";
import { useLogin } from "../context/loginContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

function GoogleSignIn() {
  const { user, login, logout, role, setRole } = useLogin();
  const navigate = useNavigate(); 

  const handleSuccess = (credentialResponse) => {
    if (credentialResponse.credential) {
      const decodedUser = jwtDecode(credentialResponse.credential); // Correctly decoded
      login(decodedUser);
      setRole("patient")
      console.log("Google signIn success", decodedUser);
      navigate('/'); 
    }
  };

  const handleError = () => {
    console.log("Google sign-in error");
  };

  return (
    <>
      <h2>Login Page</h2>
      <GoogleOAuthProvider clientId='30449435071-r8fbkkj05du8grlde06td5ge5k16kn4u.apps.googleusercontent.com'>
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      </GoogleOAuthProvider>
    </>
  );
}

export default GoogleSignIn;
