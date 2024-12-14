import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Create a context for managing login state
const LoginContext = createContext();

export const useLogin = () => {
  return useContext(LoginContext);
};

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Check if there are existing cookies on initial load
  useEffect(() => {
    const storedUser = Cookies.get('user');
    const storedRole = Cookies.get('role');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  // Login function
  const login = (userData, userRole) => {
    setUser(userData);
    setRole(userRole);
    Cookies.set('user', JSON.stringify(userData), { expires: 7 }); // Set cookie for 7 days
    Cookies.set('role', userRole, { expires: 7 }); // Set role cookie for 7 days
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setRole('');
    Cookies.remove('user');
    Cookies.remove('role');
  };

  // Fetch doctors from the backend
  const getDoctors = async () => {
    try {
      const response = await fetch('https://easymedi-backend.vercel.app/doctors', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDoctors(data.doctorsList || []);
      } else {
        console.error('Failed to fetch doctors');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  // Fetch appointments for the logged-in user
  const getAppointments = async () => {
    if (!user) {
      console.error('User not logged in. Cannot fetch appointments.');
      return;
    }

    try {
      const response = await fetch(`https://easymedi-backend.vercel.app/appointments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointmentsList || []);
      } else {
        console.error('Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  return (
    <LoginContext.Provider
      value={{
        user,
        login,
        logout,
        role,
        setRole,
        doctors,
        getDoctors,
        appointments,
        getAppointments,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
