import React, { useState, useEffect } from 'react';
import AppointmentsQueue from './appointmentsQueue';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);  // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:4000/appointments/');
      const data = await response.json();
      const validAppointments = (data?.appointments?.arr || [])
        .filter((appointment) => appointment && appointment.patient)
        .reverse();
      setAppointments(validAppointments);
      setIsLoading(false);  // Set loading to false after data is fetched
    } catch (err) {
      setError('Failed to fetch appointments');
      setIsLoading(false);  // Set loading to false on error
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);  // Highlight selected appointment
  };

  // Fetch appointments when component is mounted
  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="text-center">Loading appointments...</div> // Loading message
      ) : error ? (
        <div className="text-center text-red-500">{error}</div> // Error message
      ) : (
        <>
          <AppointmentsQueue
            appointments={appointments}
            onAppointmentClick={handleAppointmentClick} 
          />
  
          {/* Appointments Table */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Appointments</h2>
            {appointments.length > 0 ? (
              <div className="overflow-x-auto"> {/* Make the table horizontally scrollable */}
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-4 py-2">Patient Name</th>
                      <th className="border border-gray-300 px-4 py-2">Contact</th>
                      <th className="border border-gray-300 px-4 py-2">Doctor</th>
                      <th className="border border-gray-300 px-4 py-2">Date</th>
                      <th className="border border-gray-300 px-4 py-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-100 ${selectedAppointment === appointment ? 'bg-blue-200' : ''}`}
                        onClick={() => handleAppointmentClick(appointment)} // Highlight the selected row
                      >
                        <td className="border border-gray-300 px-4 py-2">{appointment.patient.patientFirstName}</td>
                        <td className="border border-gray-300 px-4 py-2">{appointment.patient.patientContact}</td>
                        <td className="border border-gray-300 px-4 py-2">{appointment.doctorName}</td>
                        <td className="border border-gray-300 px-4 py-2">{appointment.date}</td>
                        <td className="border border-gray-300 px-4 py-2">{appointment.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
