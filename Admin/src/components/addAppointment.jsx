import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

const SanSarif = styled.div`
  font-family: "Quicksand", sans-serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
`;

function Form() {
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
  const [userEmail, setUserEmail] = useState('');
  const dateRef = useRef();
  const submitBtnRef = useRef();

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
      try {
        const req = await fetch('https://easymedi-backend.vercel.app/doctors/');
        const response = await req.json();
        setDoctors(response.doctorsList);
        const specializationsList = [
          ...new Set(response.doctorsList.map((doc) => doc.specialization)),
        ];
        setSpecializations(specializationsList);
      } catch (error) {
        console.error(error);
      }
    };
    getDoctors();
  }, []);

  const handleDateChange = (e) => {
    const newSelectedDate = e.target.value;
    setSelectedDate(newSelectedDate);
    const newDate = new Date(newSelectedDate);
    const newDay = newDate.getDay();
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const times = selectedDoctor.slots[days[newDay]].filter(
      (slots) => slots.time && slots.available
    );
    setAvailableTimes(times);
    setSelectedDay(days[newDay]);
    if (times.length === 0) {
      setNoSlotsMessage('No slot available for the selected date');
    } else {
      setNoSlotsMessage('');
    }
  };

  const handleSpecializationChange = (e) => {
    const specialization = e.target.value;
    setSelectedSpecialization(specialization);
    setSelectedDoctor(null);
    setSelectedDay('');
    setAvailableTimes([]);
    setNoSlotsMessage('');
    const filtered = doctors.filter((doc) => doc.specialization === specialization);
    setFilteredDoctors(filtered);
  };

  const handleDoctorChange = (e) => {
    const selectedDocId = e.target.value;
    const doctor = filteredDoctors.find((doc) => doc.id === selectedDocId);
    setSelectedDoctor(doctor || null);
    setNoSlotsMessage('');
  };

  const handlePatientFirstNameChange = (e) => setPatientFirstName(e.target.value);
  const handlePatientContact = (e) => setPatientContact(e.target.value);

  const handleTimeChange = (e) => setSelectedTime(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      patient: {
        patientFirstName,
        patientContact,
        userId: userEmail,
      },
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.doctorName,
      disease: selectedDoctor.specialization,
      time: selectedTime,
      date: selectedDate,
      day: selectedDay,
    };

    try {
      const response = await fetch('https://easymedi-backend.vercel.app/appointments/add', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
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
      <div className="flex items-center justify-center mt-10">
        <form
          className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 border border-gray-200"
          onSubmit={handleSubmit}
        >
          <h1 className="text-4xl font-bold text-center py-4 mb-6 text-gray-800">
            Book Your Visit
          </h1>

          <div className="mb-4">
            <label
              htmlFor="userEmail"
              className="block uppercase tracking-wide text-gray-600 text-sm font-semibold mb-2"
            >
              Patient Email
            </label>
            <input
              type="email"
              id="userEmail"
              className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-[#03A398]"
              placeholder="Enter user email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                htmlFor="patient-first-name"
                className="block uppercase tracking-wide text-gray-600 text-sm font-semibold mb-2"
              >
                Patient Name
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
              className="block uppercase tracking-wide text-gray-600 text-sm font-semibold mb-2 ml-2"
            >
              Appointment for
            </label>
            <select
              id="specialization"
              className="block w-full bg-gray-100 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#03A398]"
              onChange={handleSpecializationChange}
              value={selectedSpecialization}
            >
              <option value="">disease</option>
              {specializations.map((spec, index) => (
                <option key={index} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {selectedSpecialization && (
            <div className="mb-4">
              <label
                htmlFor="doctor"
                className="block uppercase tracking-wide text-gray-600 text-sm font-semibold mb-2"
              >
                Select Doctor
              </label>
              <select
                id="doctor"
                className="block w-full bg-gray-100 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#03A398]"
                onChange={handleDoctorChange}
                value={selectedDoctor ? selectedDoctor.id : ''}
              >
                <option value="">Select a doctor</option>
                {filteredDoctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.doctorName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedDoctor && (
            <div>
              <div className="mb-4">
                <label
                  htmlFor="date"
                  className="block uppercase tracking-wide text-gray-600 text-sm font-semibold mb-2"
                >
                  Select Date
                </label>
                <input
                  type="date"
                  id="date"
                  ref={dateRef}
                  className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-[#03A398]"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </div>

              {noSlotsMessage ? (
                <p className="text-red-500 text-sm">{noSlotsMessage}</p>
              ) : (
                availableTimes.length > 0 && (
                  <div className="mb-4">
                    <label
                      htmlFor="time"
                      className="block uppercase tracking-wide text-gray-600 text-sm font-semibold mb-2"
                    >
                      Select Time
                    </label>
                    <select
                      id="time"
                      className="block w-full bg-gray-100 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#03A398]"
                      onChange={handleTimeChange}
                      value={selectedTime}
                    >
                      <option value="">Select a time</option>
                      {availableTimes.map((slot, index) => (
                        <option key={index} value={slot.time}>
                          {slot.time}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              )}
            </div>
          )}

          <div className="flex justify-center mt-8">
            <button
              ref={submitBtnRef}
              type="submit"
              className="bg-[#03A398] hover:bg-[#01675a] text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors duration-300 focus:outline-none"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </SanSarif>
  );
}

export default Form;
