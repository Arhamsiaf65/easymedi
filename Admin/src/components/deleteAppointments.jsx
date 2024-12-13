import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components
const SanSarif = styled.div`
    font-family: "Quicksand", sans-serif;
`;

const TableWrapper = styled.div`
    overflow-x: auto;
    max-width: 100%;
    margin-top: 1rem;
`;

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin: auto;

    thead {
        background-color: #f7f9fc;
    }

    th,
    td {
        padding: 1rem;
        text-align: center;
        border: 1px solid #e5e7eb;
    }

    tbody tr:nth-child(even) {
        background-color: #f9fafb;
    }

    tbody tr:hover {
        background-color: #f1f5f9;
    }
`;

const Input = styled.input`
    display: block;
    width: 100%;
    max-width: 500px;
    margin: 0 auto 1rem;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    outline: none;

    &:focus {
        border-color: #60a5fa;
        box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.4);
    }
`;

const Button = styled.button`
    padding: 0.5rem 1rem;
    margin: 0 0.5rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    color: #fff;
    background-color: ${(props) => (props.disabled ? '#d1d5db' : '#3b82f6')};
    pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
    transition: background-color 0.3s ease;

    &:hover:not(:disabled) {
        background-color: #2563eb;
    }
`;

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
`;

const Toast = styled.div`
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 1rem;
    border-radius: 8px;
    background-color: ${(props) => (props.type === 'success' ? '#22c55e' : '#ef4444')};
    color: white;
    z-index: 1000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    animation: fade-in-out 4s;

    @keyframes fade-in-out {
        0%, 90% { opacity: 1; }
        100% { opacity: 0; }
    }
`;

function ManagePatients() {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Fetch Appointments
    const fetchAppointments = async () => {
        try {
            const response = await fetch('http://localhost:4000/appointments/');
            const data = await response.json();
            const validAppointments = (data?.appointments?.arr || [])
                .filter((appointment) => appointment && appointment.patient)
                .reverse();

            setAppointments(validAppointments);
        } catch (err) {
            console.error("Failed to fetch appointments:", err);
            setToast({ type: 'error', message: 'Failed to fetch appointments.' });
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        setFilteredAppointments(appointments);
    }, [appointments]);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredAppointments(
            appointments.filter((appointment) =>
                appointment.patient.patientFirstName.toLowerCase().includes(query)
            )
        );
        setCurrentPage(1);
    };

    const handleDelete = async (appointment) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to cancel this appointment for ${appointment.patient.patientFirstName}?`
        );
        if (!confirmDelete) return;

        try {
            const queryParams = new URLSearchParams({
                doctorId: appointment.doctorId,
                day: appointment.day,
                time: appointment.time,
                date: appointment.date,
            });

            const response = await fetch(
                `http://localhost:4000/appointments/delete?${queryParams.toString()}`,
                { method: 'DELETE' }
            );
            const data = await response.json();

            if (response.ok && data.success) {
                setToast({ type: 'success', message: 'Appointment canceled successfully.' });
                setAppointments((prev) =>
                    prev.filter(
                        (item) =>
                            item.date !== appointment.date ||
                            item.time !== appointment.time ||
                            item.doctorId !== appointment.doctorId
                    )
                );

                const adminMessage = prompt(
                    `Appointment canceled successfully. Enter a message to notify the user (${appointment.patient.email}):`
                );

                if (adminMessage) {
                    const emailResponse = await fetch(
                        `http://localhost:4000/appointments/delete/send-email`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: appointment.patient.userId,
                                subject: 'Appointment Cancellation Notification',
                                message: adminMessage,
                            }),
                        }
                    );

                    const emailData = await emailResponse.json();
                    if (emailResponse.ok && emailData.success) {
                        setToast({ type: 'success', message: 'Notification email sent to the user.' });
                    } else {
                        setToast({
                            type: 'error',
                            message: emailData.message || 'Failed to send notification email.',
                        });
                    }
                }
            } else {
                setToast({ type: 'error', message: data.message || 'Failed to cancel the appointment.' });
            }
        } catch (err) {
            console.error("Error canceling appointment:", err);
            setToast({ type: 'error', message: 'Error occurred while canceling the appointment.' });
        }
    };

    const currentAppointments = filteredAppointments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.floor(filteredAppointments.length / itemsPerPage) || 1;

    return (
        <SanSarif>
            <div className="p-4">
                <h1 className="text-4xl text-center font-bold py-6">Manage Patient Appointments</h1>
                <Input
                    type="text"
                    placeholder="Search by patient name"
                    value={searchQuery}
                    onChange={handleSearch}
                />

                {toast && (
                    <Toast type={toast.type}>
                        {toast.message}
                    </Toast>
                )}

                <TableWrapper>
                    {currentAppointments.length > 0 ? (
                        <StyledTable>
                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th>Doctor</th>
                                    <th>Specialization</th>
                                    <th>Date</th>
                                    <th>Day</th>
                                    <th>Time</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAppointments.map((appointment, index) => (
                                    <tr key={index}>
                                        <td>{appointment.patient.patientFirstName}</td>
                                        <td>{appointment.doctorName || 'N/A'}</td>
                                        <td>{appointment.disease || 'N/A'}</td>
                                        <td>{appointment.date}</td>
                                        <td>{appointment.day}</td>
                                        <td>{appointment.time}</td>
                                        <td>
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDelete(appointment)}
                                            >
                                                🗑
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </StyledTable>
                    ) : (
                        <p className="text-center mt-4">No appointments found.</p>
                    )}
                </TableWrapper>

                <Pagination>
                    <Button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                        Previous
                    </Button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <Button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        Next
                    </Button>
                </Pagination>
            </div>
        </SanSarif>
    );
}

export default ManagePatients;
