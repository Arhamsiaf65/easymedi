import React, { useState, useEffect, useContext } from 'react';
import AdminSection from './components/adminSection';
import Lenis from '@studio-freight/lenis';
import { DoctorsProvider } from '../context/doctorsContext';
import './App.css';
import { SignIn } from './components/signIn';
function App() {
  const [user, setUser] = useState(null); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => t,
      smoothWheel: true,
      smoothTouch: true,
    });

    function onFrame(time) {
      lenis.raf(time);
      requestAnimationFrame(onFrame);
    }

    requestAnimationFrame(onFrame);

    return () => lenis.destroy();
  }, []);

 

  const handleLogin = async (email, password, setUser) => {
    if (email === "demo@admin.com" && password === "demo123") {
      setUser({ email });
      return true;
    }
    return false;
  };
  

  const handleLogout = () => {
    setUser(null); 
  };

  return (
    <DoctorsProvider>

    <div>
      {user ? (
         <AdminSection handleLogout={handleLogout} />
      ) : (
        <SignIn
        handleLogin={handleLogin}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        setUser={setUser} // Pass setUser to SignIn
      />
      
      )}
    </div>
           </DoctorsProvider>

  );
}

export default App;
