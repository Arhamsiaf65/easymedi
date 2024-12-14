import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useLogin } from '../../context/loginContext';
import { useNavigate } from 'react-router-dom';

const SanSarif = styled.div`
  font-family: "Quicksand", sans-serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
`;

function Form() {
  const { user, login, role } = useLogin();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [noSlotsMessage, setNoSlotsMessage] = useState('');
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientContact, setPatientContact] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [doctorSelectionMessage, setDoctorSelectionMessage] = useState('');
  const dateRef = useRef();
  const submitBtnRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedDoctor && dateRef.current) {
      const today = new Date();
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(today.getDate() + 7);

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const minDate = formatDate(today);
      const maxDate = formatDate(oneWeekFromNow);

      dateRef.current.setAttribute('min', minDate);
      dateRef.current.setAttribute('max', maxDate);
    }
  }, [selectedDoctor]);

  useEffect(() => {
    const getDoctors = async () => {
      setIsLoading(true);
      try {
        const req = await fetch('https://easymedi-backend.vercel.app/doctors');
        const response = await req.json();
        setDoctors(response.doctorsList);
        const specializationsList = [...new Set(response.doctorsList.map(doc => doc.specialization))];
        setSpecializations(specializationsList.length > 0 ? specializationsList : ['No specializations available']);
      } catch (error) {
        console.error(error);
        setSpecializations(['No specializations available']);
      } finally {
        setIsLoading(false);
      }
    };
    getDoctors();
  }, [login]);

  const handleDateChange = (e) => {
    const newSelectedDate = e.target.value;
    setSelectedDate(newSelectedDate);
    const newDate = new Date(newSelectedDate);
    const newDay = newDate.getDay();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const times = selectedDoctor?.slots[days[newDay]].filter(slot => slot.time && slot.available) || [];
    setAvailableTimes(times);
    setSelectedDay(days[newDay]);
    if (times.length === 0) {
      setNoSlotsMessage("No slot available for the selected date");
    } else {
      setNoSlotsMessage('');
    }
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleSpecializationChange = (e) => {
    const specialization = e.target.value;
    setSelectedSpecialization(specialization);
    setSelectedDoctor(null);
    setSelectedDay('');
    setAvailableTimes([]);
    setNoSlotsMessage('');
    setDoctorSelectionMessage('');
    const filtered = doctors.filter(doc => doc.specialization === specialization);
    setFilteredDoctors(filtered);
  };

  const handleDoctorChange = (e) => {
    const selectedDocId = e.target.value;
    const doctor = filteredDoctors.find(doc => doc.id === selectedDocId);
    if (!selectedSpecialization) {
      setDoctorSelectionMessage('Please select a specialization first.');
      setSelectedDoctor(null);
      return;
    }
    setSelectedDoctor(doctor || null);
    setDoctorSelectionMessage('');
    setNoSlotsMessage('');
  };

  const handlePatientFirstNameChange = (e) => {
    setPatientFirstName(e.target.value);
  };

  const handlePatientContact = (e) => {
    setPatientContact(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Login first to add an appointment");
      navigate('/login');
      return;
    }

    const formData = {
      patient: {
        patientFirstName,
        patientContact,
        userId: user.email,
      },
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.doctorName,
      disease: selectedDoctor.specialization,
      time: selectedTime,
      date: selectedDate,
      day: selectedDay
    };

    try {
      const response = await fetch('https://easymedi-backend.vercel.app/appointments/add', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Appointment booked successfully!');
      } else {
        alert('Failed to book appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the form. Please try again later.');
    }
  };

  return (
    <SanSarif>
      <div className="flex items-center justify-center mt-24">
        {isLoading ? (
          <div className="text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 flex items-center justify-center relative">
              <div className="w-4 h-4 absolute bg-[#03A398] rounded-full animate-pulse delay-0"></div>
              <div className="w-4 h-4 absolute bg-[#03A398] rounded-full animate-pulse delay-150"></div>
              <div className="w-4 h-4 absolute bg-[#03A398] rounded-full animate-pulse delay-300"></div>
            </div>
            <p className="mt-4 text-gray-600 text-lg">Loading data, please wait...</p>
          </div>
        ) : (
          <form
            className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 border border-gray-200"
            onSubmit={handleSubmit}
          >
            <h1 className="text-4xl font-bold text-center py-4 mb-6 text-gray-800">Book Your Visit</h1>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  htmlFor="patient-first-name"
                  className="block uppercase tracking-wide text-gray-600 text-sm font-semibold mb-2"
                >
                  Patient First Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-[#03A398]"
                  id="patient-first-name"
                  type="text"
                  placeholder="Jane"
                  value={patientFirstName}
                  onChange={handlePatientFirstNameChange}
                />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label
                  htmlFor="patient-contact"
                  className="block uppercase tracking-wide text-gray-600 text-sm font-semibold mb-2"
                >
                  Patient Contact
                </label>
                <input
                  className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-[#03A398]"
                  id="patient-contact"
                  type="text"
                  placeholder="Doe"
                  value={patientContact}
                  onChange={handlePatientContact}
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="specialization"
                className="block uppercase tracking-wide text-gray-600 text-sm font-semibold mb-2"
              >
                Select Specialization
              </label>
              <select
                id="specialization"
                value={selectedSpecialization}
                onChange={handleSpecializationChange}
                className="block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-[#03A398]"
              >
                <option value="">Select Specialization</option>
                {specializations.length === 0 ? (
                  <option value="">No specializations available</option>
                ) : (
                  specializations.map((spec, index) => (
                    <option key={index} value={spec}>
                      {spec}
                    </option>
                  ))
                )}
              </select>
            </div>

            {doctorSelectionMessage && (
              <div className="mb-4 text-red-500 text-sm">{doctorSelectionMessage}</div>
            )}

            <div className="mb-4">
              <label
                htmlFor="doctor"
                className="block uppercase tracking-wide text-gray-600 text-sm font-semibold mb-2"
              >
                Select Doctor
              </label>
              <select
                id="doctor"
                value={selectedDoctor ? selectedDoctor.id : ''}
                onChange={handleDoctorChange}
                disabled={!selectedSpecialization}
                className="block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-[#03A398]"
              >
                <option value="">Select Doctor</option>
                {filteredDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.doctorName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="appointment-date"
                className="block uppercase tracking-wide text-gray-600 text-sm font-semibold mb-2"
              >
                Select Date
              </label>
              <input
                id="appointment-date"
                type="date"
                ref={dateRef}
                value={selectedDate}
                onChange={handleDateChange}
                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-[#03A398]"
              />
              {noSlotsMessage && <p className="text-red-500 text-sm mt-2">{noSlotsMessage}</p>}
            </div>

            {availableTimes.length > 0 && (
              <div className="mb-4">
                <label
                  htmlFor="appointment-time"
                  className="block uppercase tracking-wide text-gray-600 text-sm font-semibold mb-2"
                >
                  Select Time
                </label>
                <select
                  id="appointment-time"
                  value={selectedTime}
                  onChange={handleTimeChange}
                  className="block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-[#03A398]"
                >
                  <option value="">Select Time</option>
                  {availableTimes.map((slot, index) => (
                    <option key={index} value={slot.time}>
                      {slot.time}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              ref={submitBtnRef}
              className="bg-[#03A398] text-white font-semibold py-3 px-6 rounded-lg w-full"
            >
              Book Appointment
            </button>
          </form>
        )}
      </div>
    </SanSarif>
  );
}

export default Form;
