import React, { useState } from 'react';
import { useLogin } from '../../context/loginContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Line from './line';

function AppointmentItem({ appointment, onDelete }) {
    const handleDelete = async () => {
        const confirmDelete = window.confirm(`Are you sure you want to cancel this appointment on ${appointment.date} at ${appointment.time}?`);
        if (!confirmDelete) return;

        try {
            const queryParams = new URLSearchParams({
                doctorId: appointment.doctorId,
                day: appointment.day,
                time: appointment.time,
                date: appointment.date,
            });

            const response = await fetch(`https://easymedi-backend.vercel.app/appointments/delete?${queryParams.toString()}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok && data.success) {
                alert('Appointment canceled successfully.');
                onDelete(appointment);
            } else {
                alert(data.message || 'Failed to cancel the appointment.');
            }
        } catch (error) {
            console.error('Error canceling appointment:', error);
            alert('An error occurred while trying to cancel the appointment.');
        }
    };

    return (
        <tr className="border-b">
            <td className="px-4 py-2 text-center">{appointment.patientName}</td>
            <td className="px-4 py-2 text-center">{appointment.doctorName}</td>
            <td className="px-4 py-2 text-center">{appointment.specialization}</td>
            <td className="px-4 py-2 text-center">{appointment.date}</td>
            <td className="px-4 py-2 text-center">{appointment.day}</td>
            <td className="px-4 py-2 text-center">{appointment.time}</td>
            <td
                onClick={handleDelete}
                className="px-4 py-2 flex justify-center items-center cursor-pointer text-red-500 hover:text-red-700"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 6h18M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M10 11v6M14 11v6M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
                </svg>
            </td>
        </tr>
    );
}

function PatientAppointments() {
    const { user, role } = useLogin();
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const SanSarif = styled.div`
        font-family: "Quicksand", sans-serif;
        font-optical-sizing: auto;
        font-weight: 600;
        font-style: normal;
    `;

    const fetchAppointments = async () => {
        if (!user) {
            alert('Login first to get your booked appointments');
            navigate('/login');
            return;
        }

        setLoading(true);
        setError(null);
        const endpoint = 'http://localhost:4000/appointments/';

        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }

            const data = await response.json();
            const filteredAppointments =
                data?.appointments?.arr
                    ?.filter((appointment) =>
                        role === 'patient'
                            ? appointment?.patient?.userId === user.email
                            : appointment?.doctorId === user.email
                    )
                    .map((appointment) => ({
                        patientName: appointment.patient.patientFirstName,
                        doctorName: appointment.doctorName,
                        specialization: appointment.disease,
                        day: appointment.day,
                        time: appointment.time,
                        date: appointment.date,
                        doctorId: appointment.doctorId,
                    })) || [];
            setAppointments(filteredAppointments.reverse());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAppointment = (deletedAppointment) => {
        setAppointments((prev) =>
            prev.filter(
                (appointment) =>
                    appointment.date !== deletedAppointment.date ||
                    appointment.time !== deletedAppointment.time ||
                    appointment.doctorId !== deletedAppointment.doctorId
            )
        );
    };

    return (
        <SanSarif>
            <div className="p-4">
                <Line />
                <h1 className="text-3xl sm:text-4xl flex flex-col sm:flex-row justify-center font-bold text-center py-16 text-black">
                    Check your booked
                    <img
                        src="https://img.freepik.com/free-vector/check-mark-shield-with-shadow_78370-4413.jpg?t=st=1731531731~exp=1731535331~hmac=d81fd548ea1d47b510d6eb395d494b4348373ac0feefbcde579191ca545f017e&w=740"
                        className="w-10 self-center inline-block ml-3"
                        alt="Checkmark Icon"
                    />
                    appointments
                </h1>

                <p className="text-lg sm:text-xl text-center text-gray-700 mb-6">
                    Stay up-to-date with your scheduled visits. Click below to see your upcoming appointments.
                </p>

                <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 mx-auto mb-6"></div>

                <div className="flex justify-center">
                    <button
                        onClick={fetchAppointments}
                        className="bg-[#01B09F] hover:bg-white text-white hover:text-[#01B09F] font-bold py-3 px-3 sm:px-6 rounded-3xl shadow-lg transition-all transform hover:scale-105"
                    >
                        Fetch Appointments
                    </button>
                </div>

                {error && <div className="text-red-500 mt-4">{error}</div>}

                {loading ? (
                    <div className="flex justify-center items-center mt-8">
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                            <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
                            <div className="h-6 bg-gray-300 rounded mx-auto"></div>
                        </div>
                    </div>
                ) : appointments.length > 0 ? (
                    <div className="flex justify-center">
                        <div className="overflow-x-auto w-full max-w-6xl mt-4">
                            <table className="min-w-full table-auto border-collapse border border-gray-200 rounded-lg">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 border-b">Patient Name</th>
                                        <th className="px-4 py-2 border-b">Doctor</th>
                                        <th className="px-4 py-2 border-b">Specialization</th>
                                        <th className="px-4 py-2 border-b">Date</th>
                                        <th className="px-4 py-2 border-b">Day</th>
                                        <th className="px-4 py-2 border-b">Time</th>
                                        <th className="px-4 py-2 border-b">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appointment, index) => (
                                        <AppointmentItem
                                            key={index}
                                            appointment={appointment}
                                            onDelete={handleDeleteAppointment}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <p className="mt-4"></p>
                )}
                <Line />
            </div>
        </SanSarif>
    );
}

export default PatientAppointments;
