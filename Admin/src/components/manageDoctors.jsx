import React, { useState, useEffect } from 'react';
import AddDoctor from './addDoctor';
import DeleteDoctor from './DeleteDoctor';
import ViewDoctors from './ViewDoctors';

function ManageDoctors() {
  const [selectedAction, setSelectedAction] = useState('view');

  // useEffect(() => {
  //   const fetchDoctors = async () => {
  //     try {
  //       const response = await fetch('https://easymedi-backend.vercel.app/doctors');
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch doctors');
  //       }
  //       const data = await response.json();
  //       console.log(data);
  //       setDoctors(data); // Populate doctors initially
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };

  //   fetchDoctors();
  // }, []);

  return (
    <div className="manage-doctors p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Manage Doctors</h1>

      {/* Action Buttons (Add, Delete, View) */}
      <div className="flex flex-col sm:flex-row justify-center sm:space-x-6 sm:space-y-0 space-y-4 mb-6">
        <button
          onClick={() => setSelectedAction('add')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors text-center w-full sm:w-auto ${
            selectedAction === 'add'
              ? 'bg-[#098487] text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Add Doctor
        </button>
        <button
          onClick={() => setSelectedAction('delete')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors text-center w-full sm:w-auto ${
            selectedAction === 'delete'
              ? 'bg-[#098487] text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Delete Doctor
        </button>
        <button
          onClick={() => setSelectedAction('view')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors text-center w-full sm:w-auto ${
            selectedAction === 'view'
              ? 'bg-[#098487] text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          View Doctors
        </button>
      </div>

      {/* Conditional Content Based on Selected Action */}
      <div className="action-content">
        {selectedAction === 'add' && <AddDoctor/>}
        {selectedAction === 'delete' && <DeleteDoctor/>}
        {selectedAction === 'view' && <ViewDoctors/>}
      </div>
    </div>
  );
}

export default ManageDoctors;
