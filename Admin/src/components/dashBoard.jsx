import React, { useEffect, useState, useContext } from 'react';
import { DoctorsContext } from '../../context/doctorsContext';
import { faL } from '@fortawesome/free-solid-svg-icons';

function DashBoard() {
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [doctorsLoading , setDoctorsLoading] = useState(true);
  const [specializations, setSpecializations] = useState([]);
  const {
    doctors,
    setDoctors,
    error,
    clearError,
  } = useContext(DoctorsContext);

  const fetchAppointments = async () => {
    setAppointmentsLoading(true);
    try {
      const response = await fetch('https://easymedi-backend.vercel.app/appointments');
      const data = await response.json();
      const validAppointments = (data?.appointments?.arr || [])
        .filter((appointment) => appointment && appointment.patient)
        .reverse();
      setAppointments(validAppointments);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const setSpecializationsList = (doctors) => {
    if (doctors.length) {
      const specializationsList = [
        ...new Set(doctors.map((doc) => doc.specialization)),
      ];
      setSpecializations(specializationsList);
    }
  }
  const fetchDoctors = async () => {
    setDoctorsLoading(true);
    try {
      const response = await fetch('https://easymedi-backend.vercel.app/doctors');
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      const data = await response.json();
      setDoctors(data.doctorsList);
       setSpecializationsList(data.doctorsList)
    } catch (error) {
      console.error(error.message);
    } finally{
      setDoctorsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);
  useEffect(()=> {
    fetchDoctors();
  }, [])

    

  useEffect(() => {
   
  }, [doctors]);

  const upcomingAppointments = appointments.filter(
    (appointment) => new Date(appointment.date) > new Date()
  );

  const isLoading =  appointmentsLoading || doctorsLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-center text-teal-600 mb-12 animate-pulse">
          Loading Dashboard...
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-teal-100 to-teal-300 rounded-lg shadow-md p-6 animate-pulse"
              >
                <div className="h-6 bg-teal-400 rounded w-3/4 mb-4"></div>
                <div className="h-12 bg-teal-500 rounded w-1/2"></div>
              </div>
            ))}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-teal-600 mb-4">Fetching Data...</h2>
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg shadow p-4 animate-pulse"
                >
                  <div className="h-6 bg-gray-400 rounded mb-2"></div>
                  <div className="h-4 bg-gray-500 rounded w-2/3"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={clearError}
          className="mt-4 px-4 py-2 bg-teal-500 text-white rounded"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center text-teal-600 mb-12">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Total Doctors</h2>
          <p className="text-4xl font-bold text-teal-600">{doctors.length}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Total Specializations</h2>
          <p className="text-4xl font-bold text-teal-600">{specializations.length}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Total Appointments</h2>
          <p className="text-4xl font-bold text-teal-600">{appointments.length}</p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold text-teal-600 mb-4 border-b-2 pb-2">
          Doctors by Specialization
        </h2>
        <ul className="space-y-4">
          {specializations.map((spec, index) => {
            const doctorsInSpec = doctors.filter((doc) => doc.specialization === spec);
            return (
              <li key={index} className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-800">{spec}</span>
                <span className="text-lg font-semibold text-teal-600">{doctorsInSpec.length}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b-2 pb-2">
          Upcoming Appointments
        </h2>
        <div className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <p className="text-center text-gray-500">No upcoming appointments.</p>
          ) : (
            upcomingAppointments.slice(0, 5).map((appointment, index) => (
              <div
                key={index}
                className="bg-teal-50 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {appointment.patient.patientFirstName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Appointment with {appointment.doctorName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(appointment.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
