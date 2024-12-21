import React, { useState, useEffect } from 'react';
import AppointmentsQueue from './appointmentsQueue';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  const fetchAppointments = async () => {
    try {
      const response = await fetch('https://easymedi-backend.vercel.app/appointments/');
      const data = await response.json();
      const validAppointments = (data?.appointments?.arr || [])
        .filter((appointment) => appointment && appointment.patient)
        .reverse();
      setAppointments(validAppointments);
      setIsLoading(false); // Set loading to false after data is fetched
    } catch (err) {
      setError('Failed to fetch appointments');
      setIsLoading(false); // Set loading to false on error
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment); // Highlight selected appointment
  };

  // Fetch appointments when component is mounted
  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Appointments</h2>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="animate-pulse flex space-x-4 p-4 border rounded-md shadow-md bg-gray-100">
                <div className="bg-gray-300 h-12 w-1/4 rounded-md"></div>
                <div className="bg-gray-300 h-12 w-1/4 rounded-md"></div>
                <div className="bg-gray-300 h-12 w-1/4 rounded-md"></div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div> // Error message
      ) : (
        <>
          <AppointmentsQueue
            appointments={appointments}
            onAppointmentClick={handleAppointmentClick} 
          />
  
          {/* Card Layout for Appointments */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Appointments</h2>
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-md shadow-md hover:bg-gray-100 cursor-pointer ${
                      selectedAppointment === appointment ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => handleAppointmentClick(appointment)}
                  >
                    <div className="font-semibold text-lg">
                      {appointment.patient.patientFirstName} - {appointment.patient.patientLastName}
                    </div>
                    <div className="text-gray-600">
                      Contact: {appointment.patient.patientContact}
                    </div>
                    <div className="text-gray-600">
                      Doctor: {appointment.doctorName}
                    </div>
                    <div className="text-gray-600">
                      Date: {appointment.date}
                    </div>
                    <div className="text-gray-600">
                      Time: {appointment.time}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-700">No appointments available.</p>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Appointments;
