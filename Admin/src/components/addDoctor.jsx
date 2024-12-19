import React, { useContext, useState, useEffect } from 'react';
import { DoctorsContext } from '../../context/doctorsContext';

function AddDoctor() {
  const { addDoctor, setDoctors } = useContext(DoctorsContext);
  const [enableBtn, setEnableBtn] = useState(false); // Correcting the useState usage
  const initialSlots = {
    Monday: [...Array(3)].map((_, i) => ({
      time: `${9 + i}:00 AM`,
      available: true,
    })),
    Tuesday: [...Array(3)].map((_, i) => ({
      time: `${9 + i}:00 AM`,
      available: true,
    })),
    Wednesday: [...Array(3)].map((_, i) => ({
      time: `${9 + i}:00 AM`,
      available: true,
    })),
    Thursday: [...Array(3)].map((_, i) => ({
      time: `${9 + i}:00 AM`,
      available: true,
    })),
    Friday: [...Array(3)].map((_, i) => ({
      time: `${9 + i}:00 AM`,
      available: true,
    })),
    Saturday: [...Array(3)].map((_, i) => ({
      time: `${9 + i}:00 AM`,
      available: true,
    })),
    Sunday: [...Array(3)].map((_, i) => ({
      time: `${9 + i}:00 AM`,
      available: true,
    })),
  };

  const [newDoctor, setNewDoctor] = useState({
    doctorName: '',
    id: '',
    specialization: '',
    slots: initialSlots,
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor({ ...newDoctor, [name]: value });
  };

  // Handle slot toggling
  const handleSlotToggle = (day, index) => {
    const updatedSlots = { ...newDoctor.slots };
    updatedSlots[day][index].available = !updatedSlots[day][index].available;
    setNewDoctor({ ...newDoctor, slots: updatedSlots });
  };

  // Toggle selected day
  const handleDayClick = (day) => {
    setSelectedDay(selectedDay === day ? null : day);
  };

  // Enable/disable submit button based on form validity
  useEffect(() => {
    const isFormValid =
      newDoctor.doctorName.trim() !== '' &&
      newDoctor.id.trim() !== '' &&
      newDoctor.specialization.trim() !== '';
    setEnableBtn(isFormValid);
  }, [newDoctor]);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setEnableBtn(false); // Disable the button while submitting
    const success = await addDoctor(newDoctor);
    if (success) {
      setDoctors((prevDoctors) => [newDoctor, ...prevDoctors]);
      setMessageType('success');
      setMessage('Doctor added successfully.');
      setNewDoctor({
        doctorName: '',
        id: '',
        specialization: '',
        slots: initialSlots,
      });
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessageType('error');
      setMessage('Failed to add doctor.');
      setTimeout(() => setMessage(''), 3000);
    }
    setEnableBtn(true); // Re-enable the button after the submission attempt
  };

  return (
    <div className="p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto border rounded p-4 bg-white shadow-md">
        <h2 className="text-2xl sm:text-xl font-semibold mb-4 text-center">
          Add New Doctor
        </h2>

        <form onSubmit={handleAddDoctor} className="space-y-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <input
              type="text"
              name="doctorName"
              value={newDoctor.doctorName}
              onChange={handleInputChange}
              placeholder="Doctor Name"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <input
              type="email"
              name="id"
              value={newDoctor.id}
              onChange={handleInputChange}
              placeholder="Email (ID)"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <input
              type="text"
              name="specialization"
              value={newDoctor.specialization}
              onChange={handleInputChange}
              placeholder="Specialization"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mt-6 sm:col-span-2">
            <h3 className="text-xl sm:text-lg font-semibold mb-4">
              Configure Weekly Slots
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {Object.keys(newDoctor.slots).map((day) => (
                <div key={day} className="text-center">
                  <h4
                    className="text-lg font-medium cursor-pointer text-blue-600 hover:text-blue-800"
                    onClick={() => handleDayClick(day)}
                  >
                    {day}
                  </h4>
                  {selectedDay === day && (
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      {newDoctor.slots[day].map((slot, index) => (
                        <div
                          key={index}
                          className={`p-2 border rounded-md text-center cursor-pointer transition-all ${
                            slot.available ? 'bg-green-200 hover:bg-green-300' : 'bg-red-200 hover:bg-red-300'
                          }`}
                          onClick={() => handleSlotToggle(day, index)}
                        >
                          {slot.time} <br />
                          {slot.available ? 'Available' : 'Unavailable'}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            {message && (
              <p
                className={`text-sm mb-4 text-center ${
                  messageType === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {message}
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
              disabled={!enableBtn}
            >
              Add Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDoctor;
