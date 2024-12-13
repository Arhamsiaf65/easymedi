import React, { useEffect, useState } from 'react';

function DashBoard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  // Fetch doctors data
  const getDoctors = async () => {
    try {
      const req = await fetch('https://easymedi-backend.vercel.app/doctors/');
      const response = await req.json();
      console.log(response);
      setDoctors(response.doctorsList);
      const specializationsList = [
        ...new Set(response.doctorsList.map((doc) => doc.specialization)),
      ];
      setSpecializations(specializationsList);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  // Fetch appointments data
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
    getDoctors();
    fetchAppointments();
  }, []);

  // Upcoming appointments filter
  const upcomingAppointments = appointments.filter((appointment) => {
    return new Date(appointment.date) > new Date();  // Only future appointments
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center text-teal-600 mb-12">Admin Dashboard</h1>

      {/* Total Doctors, Specializations, and Appointments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Total Doctors</h2>
          <p className="text-4xl font-bold text-teal-600">{doctors.length}</p>
        </div>

        {/* Specializations */}
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

      {/* Doctors by Specialization */}
      <div className="bg-white shadow-lg rounded-lg p-6 pl-2 mr-2 mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-teal-600 border-b-2">Doctors by <br />Specialization</h2>
        <ul className="space-y-4">
          {specializations.map((spec, index) => {
            const doctorsInSpec = doctors.filter((doc) => doc.specialization === spec);
            return (
              <li key={index} className="flex flex-col sm:flex-row justify-between items-center">
                <span className="text-lg font-medium text-gray-800">{spec}</span>
                <span className="text-lg font-semibold text-teal-600">{doctorsInSpec.length} Doctors</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Upcoming Appointments</h2>
        <div className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <p className="text-center text-gray-500">No upcoming appointments.</p>
          ) : (
            upcomingAppointments.slice(0, 5).map((appointment, index) => (
              <div key={index} className="bg-teal-50 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{appointment.patient.patientFirstName}</h3>
                    <p className="text-sm text-gray-500">Appointment with {appointment.doctorName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{new Date(appointment.date).toLocaleString()}</p>
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
