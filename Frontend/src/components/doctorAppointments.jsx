import React, { useState, useEffect } from 'react';
import { useLogin } from '../../context/loginContext';

function DoctorsAppointments() {
    const { user } = useLogin();
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [doctorId, setDoctorId] = useState('');

    const getDoctorsId = async () => {
        try {
            const response = await fetch('http://localhost:4000/doctors/', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch doctors');
            }

            const data = await response.json();
            console.log('Doctors Response:', data);
            setDoctors(data.doctorsList);
        } catch (err) {
            setError(err.message);
        }
    };

    const getAppointments = async () => {
        if (!doctorId) return;

        try {
            const response = await fetch('http://localhost:4000/appointments/', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }

            const data = await response.json();
            console.log('Appointments Response:', data);

            const filteredAppointments = data.appointments.arr.filter(
                appointment => appointment && appointment.doctorId === doctorId
            );

            setAppointments(filteredAppointments);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        getDoctorsId();
    }, []);

    return (
        <div>
            <h1>Doctor's Appointments</h1>
            {error && <div className="error">{error}</div>}

            <select onChange={(e) => setDoctorId(e.target.value)} value={doctorId}>
                <option value="">Select Doctor</option>
                {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                        {doctor.doctorName} - {doctor.specialization}
                    </option>
                ))}
            </select>

            <button onClick={getAppointments} disabled={!doctorId}>
                Get Appointments
            </button>

            {appointments.length > 0 ? (
                <ul>
                    {appointments.map((appointment, index) => (
                        <li key={index}>
                            {appointment.patient.patientFirstName} - {appointment.day} {appointment.time}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No appointments available for the selected doctor.</p>
            )}
        </div>
    );
}

export default DoctorsAppointments;
