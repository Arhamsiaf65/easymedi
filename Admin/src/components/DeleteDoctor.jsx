import React, { useContext, useState } from 'react';
import { DoctorsContext } from '../../context/doctorsContext';

function DeleteDoctor() {
  const { doctors, deleteDoctor,  error } = useContext(DoctorsContext);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    if (!selectedDoctor) {
      setMessage('Please select a doctor to delete.');
      return;
    }
  
    try {
       await deleteDoctor(selectedDoctor);
  
      setMessage("Doctor deleted successfully.")
    } catch (error) {
      setMessage('An error occurred while deleting the doctor.');
      console.error(error);
    }
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="delete-doctor">
      <h2 className="text-xl font-bold mb-4">Delete a Doctor</h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Select Doctor
        </label>
        <select
          className="border rounded p-2 w-full"
          value={selectedDoctor || ''}
          onChange={(e) => setSelectedDoctor(e.target.value)}
        >
          <option value="" disabled>
            -- Select a doctor --
          </option>
          {Array.isArray(doctors) && doctors.length > 0 ? (
  doctors.map((doctor) => (
    <option key={doctor.id} value={doctor.id}>
      {doctor.doctorName}
    </option>
  ))  
) : (
  <option disabled>No doctors available</option>
)}
        </select>
      </div>

      <button
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        onClick={handleDelete}
      >
        Delete Doctor
      </button>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}

export default DeleteDoctor;
