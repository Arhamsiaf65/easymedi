import React from 'react';

function QueueSlot({ data, onClick }) {
 
  return (
    <div
      className={`flex-shrink-0 w-48 p-4 border rounded-lg shadow-md flex flex-col items-center ${
        data
          ? 'bg-blue-500 text-white cursor-pointer' // Solid card for appointments
          : 'bg-gray-100 text-gray-500 border-dashed' // Hollow placeholder for empty slots
      }`}
      onClick={data ? onClick : null} 
    >
      {data ? (
        <div className="flex flex-col space-y-2 text-center">
          {console.log(data)}
          <p className="font-bold">Doctor: {data.doctorName}</p>
          <p>Specialization: {data.specialization}</p>
          <p>Date: {data.date}</p>
          <p>Day: {data.day}</p>
          <p>Time: {data.time}</p>
        </div>
      ) : (
        <div className="w-full text-center text-gray-400">Empty Slot</div>
      )}
    </div>
  );
}

export default QueueSlot;
