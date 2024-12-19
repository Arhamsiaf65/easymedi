import React, { useEffect, useState, useContext } from 'react';
import { DoctorsContext } from '../../context/doctorsContext';

function DashBoard() {
  const [appointments, setAppointments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const {
    doctors,
    loading,
    error,
    clearError,
    deleteFromLast,
    deleteFromStart,
  } = useContext(DoctorsContext);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('https://easymedi-backend.vercel.app/appointments');
      const data = await response.json();
      const validAppointments = (data?.appointments?.arr || [])
        .filter((appointment) => appointment && appointment.patient)
        .reverse();
      setAppointments(validAppointments);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  };

  useEffect(() => {
    if (doctors.length) {
      const specializationsList = [
        ...new Set(doctors.map((doc) => doc.specialization)),
      ];
      setSpecializations(specializationsList);
    }
  }, [doctors]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const upcomingAppointments = appointments.filter(
    (appointment) => new Date(appointment.date) > new Date()
  );

  if (loading) {
    return <div className="text-center mt-10">Loading data, please wait...</div>;
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
        {/* Total Doctors */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Total Doctors</h2>
          <p className="text-4xl font-bold text-teal-600">{doctors.length}</p>
        </div>

        {/* Total Specializations */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Total Specializations</h2>
          <p className="text-4xl font-bold text-teal-600">{specializations.length}</p>
        </div>

        {/* Total Appointments */}
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
                <span className="text-lg font-semibold text-teal-600">{doctorsInSpec.length} Doctors</span>
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
