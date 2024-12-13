import React, { createContext, useState, useContext } from 'react';

// Create context
const LoginContext = createContext();

// Provider component
export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null); // `user` state to hold user data
  const [role, setRole] = useState(null);
  const login = (userData) => {
    setUser(userData); // Set user data
    localStorage.setItem('user', JSON.stringify(userData)); // Optionally save user data to localStorage
  };

  const logout = () => {
    setUser(null); // Clear user data
    localStorage.removeItem('user'); // Optionally clear user data from localStorage
  };

  // `user` state and login functions will be accessible via context
  return (
    <LoginContext.Provider value={{ user, isAuthenticated: !!user, login, logout, role, setRole }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  return useContext(LoginContext);
};
