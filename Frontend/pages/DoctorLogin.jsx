import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Corrected import
import { useLogin } from "../context/loginContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const verifyDoctor = async (id) => {
    try {
      console.log("fetching with id", id);
      const response = await fetch('http://localhost:4000/doctors/find', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      console.log('Response status:', response.status); // Confirm if this line is reached
    //   if (!response.ok) {
    //     console.error('Error fetching doctor data:', response.statusText);
    //     throw new Error('Network response was not ok');
    //   }
  
      const responseData = await response.json();
      console.log("Response data", responseData);
      return responseData; 
    } catch (error) {
      console.error('Error in POST request:', error);
      return null;
    }
  };
  
function DoctorLogin() {
  const { login, role, setRole  } = useLogin();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    if (credentialResponse.credential) {
      const decodedUser = jwtDecode(credentialResponse.credential);
      console.log("Triggering handle success");
      // Fetch doctor information
      const doctorData = await verifyDoctor(decodedUser.email);
      console.log(doctorData);
      if (doctorData && doctorData.id === decodedUser.email) {
        login(decodedUser);
        setRole("doctor");
        navigate('/');
      } else {
        alert("Invalid Doctor");
      }
    }
  };

  const handleError = () => {
    console.log("Google sign-in error");
  };
 
  return (
    <>
      <h2>Login Page</h2>
      <GoogleOAuthProvider clientId='30449435071-r8fbkkj05du8grlde06td5ge5k16kn4u.apps.googleusercontent.com'>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />      </GoogleOAuthProvider>
    </>
  );  
}

export default DoctorLogin;
