import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useLogin } from '../../context/loginContext';


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
  const dateRef = useRef();
  const submitBtnRef = useRef()

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

      // Set min and max attributes
      dateRef.current.setAttribute('min', minDate);
      dateRef.current.setAttribute('max', maxDate);

      // Optional: Log to check values
      console.log(`Min Date: ${minDate}, Max Date: ${maxDate}`);
    } else {
      console.log('dateRef.current is not available');
    }
  }, [selectedDoctor]);

  useEffect(() => {
    const getDoctors = async () => {
      try {
        const req = await fetch('http://localhost:4000/doctors/');
        const response = await req.json();
        setDoctors(response.doctorsList);
        const specializationsList = [...new Set(response.doctorsList.map(doc => doc.specialization))];
        setSpecializations(specializationsList);
      } catch (error) {
        console.error(error);
      }
    };
    getDoctors();
  }, [login]);


  const handleDateChange = (e) => {
    const newSelectedDate = e.target.value;
    setSelectedDate(newSelectedDate);
    console.log(selectedDate);
    const newDate = new Date(newSelectedDate);
    const newDay = newDate.getDay();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    console.log("Selected Day", newDay);
    const times = selectedDoctor.slots[days[newDay]].filter(slots => slots.time && slots.available)
    setAvailableTimes(times);
    setSelectedDay(days[newDay]);
    if (times.length === 0) {
      setNoSlotsMessage("No slot available for the selected date")
    }
    else {
      setNoSlotsMessage('')
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
    setNoSlotsMessage(''); // Clear no slots message on specialization change

    const filtered = doctors.filter(doc => doc.specialization === specialization);
    setFilteredDoctors(filtered);
  };

  const handleDoctorChange = (e) => {
    const selectedDocId = e.target.value;
    const doctor = filteredDoctors.find(doc => doc.id === selectedDocId);
    setSelectedDoctor(doctor || null);

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

    console.log("formData", formData);

    try {

      console.log(formData);
      const response = await fetch('http://localhost:4000/appointments/add', {
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
      {  <form
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
              className="block w-full bg-gray-100 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#03A398]"
              onChange={handleSpecializationChange}
              value={selectedSpecialization}
            >
              <option value="">Select a specialization</option>
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
                {filteredDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.doctorName} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedDoctor && (
            <div className="mb-4">
              <label
                htmlFor="appointment-date"
                className="block uppercase tracking-wide text-gray-600 text-sm font-semibold mb-2"
              >
                Select Appointment Date
              </label>
              <input
                type="date"
                id="appointment-date"
                ref={dateRef}
                className="block w-full bg-gray-100 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#03A398]"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
          )}

          {selectedDate && availableTimes.length > 0 && (
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
                value={selectedTime}
                onChange={handleTimeChange}
              >
                <option value="">Select a time</option>
                {availableTimes.map((slot, index) => (
                  <option key={index} value={slot.time}>
                    {slot.time}
                  </option>
                ))}
              </select>
            </div>
          )}

          {noSlotsMessage && (
            <div className="text-red-500 text-center mb-4">{noSlotsMessage}</div>
          )}

          <div className="flex justify-center mt-6">
            <button
              ref={submitBtnRef}
              type="submit"
              className="group relative bg-[#03A398] hover:text-[#03A398] hover:bg-white hover:rounded-none  text-white font-bold rounded-full py-3 px-6 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03A398]"
            >
              Book Appointment

              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition duration-300 rounded-full pointer-events-none" />
              <span className="absolute left-0 top-0 h-[2px] w-0 bg-[#03A398] z-[5] transition-all duration-200 group-hover:w-full" aria-hidden="true" />
              <span className="absolute right-0 top-0 h-0 w-[2px] bg-[#03A398] z-[5] transition-all delay-100 duration-200 group-hover:h-full" aria-hidden="true" />
              <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-[#03A398] z-[5] transition-all delay-200 duration-200 group-hover:w-full" aria-hidden="true" />
              <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-[#03A398] z-[5] transition-all delay-300 duration-200 group-hover:h-full" aria-hidden="true" />
            </button>
          </div>
        </form>}
      </div>
    </SanSarif>
  );
}

export default Form;