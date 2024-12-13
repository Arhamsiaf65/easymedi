import React, { useEffect, useState } from 'react';

function ViewAppointments({ doctorId }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`https://easymedi-backend.vercel.app/appointments/doctor/${doctorId}`);
        const data = await response.json();
        setAppointments(data.appointments || []);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
      }
    };

    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId]);

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Appointments</h3>
      {appointments.length > 0 ? (
        <ul className="space-y-2">
          {appointments.map((appointment) => (
            <li key={appointment.id}>
              <p>{appointment.patientName} - {appointment.date} at {appointment.time}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No appointments for this doctor.</p>
      )}
    </div>
  );
}

export default ViewAppointments;
