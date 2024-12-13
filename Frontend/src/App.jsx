import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import NavBar from './components/navBar'
import HeroSection from './components/heroSection'
import Form from './components/form'
import GoogleSignIn from '../pages/PatientLogin'
import { LoginProvider } from '../context/loginContext';
import PatientAppointments from './components/patientAppointments';
import DoctorLogin from '../pages/DoctorLogin';
import AppointmentDetails from './components/AppointmentDetails';
import Footer from './components/footer';
import AboutUs from './components/aboutUs';
import Chatbot from './components/chatboat';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LoginProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <NavBar />
            
            {/* Hero Section */}
            <HeroSection />
            
            <Form />
            <Chatbot />
            <main className="flex-1 px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<PatientAppointments />} />
                <Route path="/login" element={<GoogleSignIn />} />
                <Route path="/login/doctor" element={<DoctorLogin />} />
                <Route path="/details/:id" element={<AppointmentDetails />} />
              </Routes>
            </main>

            {/* About Us and Footer Section */}
            <AboutUs />
            <Footer />
          </div>
        </Router>
      </LoginProvider>
    </>
  );
}

export default App;
