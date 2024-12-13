import React, { useEffect, useState } from 'react';
import { useLogin } from '../../context/loginContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import icons from '../../public/icons';

function AppointmentsQueue() {
  const { user } = useLogin();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const SanSarif = styled.div`
    font-family: "Quicksand", sans-serif;
    font-optical-sizing: auto;
    font-weight: 600;
    font-style: normal;
  `;

  useEffect(() => {
    getAppointments();
  }, []);

  const getAppointments = async () => {
    try {
      const response = await fetch('https://easymedi-backend.vercel.app/appointments/patient/appointments', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

    
      

      const data = await response.json();
      const filteredAppointments =
        data?.appointments?.arr
          ?.filter(appointment => appointment)
          ?.map(appointment => (
          {
            doctorName: appointment?.doctorName,
            specialization: appointment?.disease,
            day: appointment?.day,
            time: appointment?.time,
            date: appointment?.date,
          })) || [];

      setAppointments(filteredAppointments.reverse());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading appointments...</p>;

  const totalSlots = 10; 
  const filledSlots = appointments.length;
  const emptySlots = totalSlots - filledSlots;

  return (
    <SanSarif>
      <div className="flex flex-col items-center mt-16">
        <h2 className="text-5xl font-bold m-4 p-10">Appointments Queue</h2>
        <div className="flex overflow-x-auto space-x-4 w-full max-w-5xl px-4">
  
          {appointments.map((appointment, index) => (
            <div
              key={index}
              className="cursor-pointer border-2 border-[#01B09F] rounded-lg p-4 flex items-center justify-center w-32 h-32 bg-white shadow-md"
              onClick={() =>
                navigate(`/details/${index}`, { state: { appointments } }) // Pass state to detail page
              }
              
              title={`Click for details`}
            >
              <img className='hover:scale-150 ease-in-out duration-150' src={icons.filledIcon} alt={`Appointment with ${appointment.doctorName}`} />
            </div>
          ))}
  
          {/* Render empty slots after filled slots */}
          {Array.from({ length: emptySlots }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="border border-gray-300 rounded-lg p-4 flex items-center justify-center w-32 h-32 bg-gray-100"
              title={`Empty Slot, Appointment not booked`}
            >
              <img className="pt-4" src={icons.emptyIcon} alt="Empty appointment slot" />
              

            </div>
          ))}
        </div>
      </div>
    </SanSarif>
  );
  
}

export default AppointmentsQueue;
