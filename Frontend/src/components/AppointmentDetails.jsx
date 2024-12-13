import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AppointmentDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();


  const state = window.history.state?.usr || {};
  const appointment = state.appointments ? state.appointments[id] : null;

  if (!appointment) {
    return (
      <div className="flex flex-col items-center mt-6">
        <h2 className="text-xl font-bold">Appointment Details Not Found</h2>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate(-1)} 
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-6">
      <h2 className="text-2xl font-bold mb-4">Appointment Details</h2>
      <div className="w-full max-w-md p-4 border rounded shadow-md">
        <p><strong>Doctor Name:</strong> {appointment.doctorName}</p>
        <p><strong>Specialization:</strong> {appointment.specialization}</p>
        <p><strong>Day:</strong> {appointment.day}</p>
        <p><strong>Time:</strong> {appointment.time}</p>
        <p><strong>Date:</strong> {appointment.date}</p>
      </div>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
    </div>
  );
}

export default AppointmentDetails;
