import React, { useState, useEffect, useContext } from 'react';
import AdminSection from './components/adminSection';
import Lenis from '@studio-freight/lenis';
import { DoctorsProvider } from '../context/doctorsContext';
import './App.css';

const SignIn = ({ handleLogin, email, setEmail, password, setPassword }) => (
  <div className="flex justify-center items-center h-screen bg-gray-100">
    <div className="p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  </div>
);

// const AdminSection = ({ handleLogout }) => (
//   <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
//     <h2 className="text-3xl font-bold mb-6">Admin Section</h2>
//     <button
//       onClick={handleLogout}
//       className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//     >
//       Logout
//     </button>
//   </div>
// );

function App() {
  const [user, setUser] = useState(null); // User state to track if logged in
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

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@gmail.com' && password === '123') {
      setUser({ email });
    } else {
      alert('Invalid credentials');
    }
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
        />
      )}
    </div>
           </DoctorsProvider>

  );
}

export default App;
