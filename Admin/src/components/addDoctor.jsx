import React, { useContext, useState } from 'react';
import { DoctorsContext } from '../../context/doctorsContext';

function AddDoctor() {
  const { addDoctor, setDoctors } = useContext(DoctorsContext);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor({ ...newDoctor, [name]: value });
  };

  const handleSlotToggle = (day, index) => {
    const updatedSlots = { ...newDoctor.slots };
    updatedSlots[day][index].available = !updatedSlots[day][index].available;
    setNewDoctor({ ...newDoctor, slots: updatedSlots });
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    const success = await addDoctor(newDoctor);
    if (success) {
      setDoctors((prevDoctors) => [...prevDoctors, newDoctor]);
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
  };

  return (
    <div className="p-4 bg-gray-50">
      <div className="max-w-lg mx-auto border rounded p-4">
        <h2 className="text-2xl sm:text-xl font-semibold mb-4">Add New Doctor</h2>
        {message && (
          <p
            className={`text-sm mb-4 ${
              messageType === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleAddDoctor} className="space-y-4">
          <input
            type="text"
            name="doctorName"
            value={newDoctor.doctorName}
            onChange={handleInputChange}
            placeholder="Doctor Name"
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="email"
            name="id"
            value={newDoctor.id}
            onChange={handleInputChange}
            placeholder="Email (ID)"
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="text"
            name="specialization"
            value={newDoctor.specialization}
            onChange={handleInputChange}
            placeholder="Specialization"
            className="w-full p-2 border rounded"
            required
          />

          <div className="mt-4">
            <h3 className="text-xl sm:text-lg font-semibold">
              Configure Weekly Slots
            </h3>
            {Object.keys(newDoctor.slots).map((day) => (
              <div key={day} className="mt-4 text-center">
                <h4 className="font-semibold">{day}</h4>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {newDoctor.slots[day].map((slot, index) => (
                    <div
                      key={index}
                      className={`p-2 min-w-24  border rounded w-1/3 sm:w-1/4 text-center ${
                        slot.available ? 'bg-green-200' : 'bg-red-200'
                      } cursor-pointer`}
                      onClick={() => handleSlotToggle(day, index)}
                    >
                      {slot.time} <br />
                      {slot.available ? 'Available' : 'Unavailable'}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
          >
            Add Doctor
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddDoctor;
