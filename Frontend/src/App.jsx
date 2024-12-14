import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/navBar';
import HeroSection from './components/heroSection';
import Form from './components/form';
import { LoginProvider } from '../context/loginContext';
import PatientAppointments from './components/patientAppointments';
import DoctorsAppointments from './components/doctorAppointments';
import AppointmentDetails from './components/AppointmentDetails';
import Footer from './components/footer';
import AboutUs from './components/aboutUs';
import Login from '../pages/login';

function App() {
  const [count, setCount] = useState(0);

  return (
    <LoginProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          {/* Check if the current path is not /login to render the layout */}
          <Routes>
            <Route
              path="/login"
              element={<Login />} />
            <Route
              path="*"
              element={
                <>
                  
                  <NavBar />
                  
                  <HeroSection />
                  
                  <Form />
                  
                  <main className="flex-1 px-4 sm:px-6 lg:px-8">
                    <Routes>
                      <Route path="/" element={<PatientAppointments />} />
                      <Route path="/details/:id" element={<AppointmentDetails />} />
                    </Routes>
                  </main>

                  <AboutUs />
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </LoginProvider>
  );
}

export default App;
