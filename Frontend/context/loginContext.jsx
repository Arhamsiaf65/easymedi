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

  const login = (userData, userRole) => {
    setUser(userData);
    setRole(userRole);
    Cookies.set('user', JSON.stringify(userData), { expires: 7 }); // Set cookie for 7 days
    Cookies.set('role', userRole, { expires: 7 }); // Set role cookie for 7 days
  };

  const logout = () => {
    setUser(null);
    setRole('');
    Cookies.remove('user');
    Cookies.remove('role');
  };

  return (
    <LoginContext.Provider value={{ user, login, logout, role, setRole }}>
      {children}
    </LoginContext.Provider>
  );
};
