import React, { useContext, useState, useEffect } from "react";
import { DoctorsContext } from "../../context/doctorsContext";

function ViewDoctors() {
  const {
    doctors,
    loading,
    error,
    deleteDoctor,
    deleteFromLast,
    deleteFromStart,
    patientsData, // Assuming this is the real patient data fetched from the context
  } = useContext(DoctorsContext);

  // Local state to manage the list of doctors
  const [doctorList, setDoctorList] = useState([]);

  // Simulated patients queue or real data integration
  const [patientsQueue, setPatientsQueue] = useState([]);

  // Update the doctorList state when doctors data changes
  useEffect(() => {
    if (doctors && doctors.doctorsList) {
      setDoctorList(doctors.doctorsList);
    }
  }, [doctors]);

  useEffect(() => {
    if (patientsData && patientsData.length > 0) {
      setPatientsQueue(patientsData);
    }
  }, [patientsData]);

  const handleDelete = async (doctorId) => {
    const success = await deleteDoctor(doctorId);
    if (success) {
      setDoctorList((prevDoctors) =>
        prevDoctors.filter((doctor) => doctor.id !== doctorId)
      );
      alert("Doctor deleted successfully");
    } else {
      alert("Failed to delete doctor");
    }
  };

  const callNextPatient = () => {
    if (patientsQueue.length === 0) {
      alert("No patients in the queue.");
      return;
    }

    const [nextPatient, ...remainingQueue] = patientsQueue;
    setPatientsQueue(remainingQueue);

    // Announce the next patient
    const utterance = new SpeechSynthesisUtterance(
      `Attention! ${nextPatient.name}, please proceed to the doctor's office for ${nextPatient.reason}.`
    );
    utterance.lang = "en-US";
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  if (loading) return <div className="text-center text-lg font-medium">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{`Error: ${error}`}</div>;

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-semibold text-center mb-6">Doctors List</h2>

      {doctorList.length === 0 ? (
        <p className="text-center text-gray-500">No doctors available</p>
      ) : (
        <div className="flex flex-col sm:flex-row flex-wrap justify-center space-x-2">
          {doctorList.map((doctor, index) => (
            <div key={doctor.id} className="flex flex-col sm:flex-row items-center space-x-2">
              <span className="text-lg text-center font-medium">{doctor.doctorName}</span>
              {index < doctorList.length - 1 && (
                <span className="mx-2 text-green-400 sm:rotate-0 rotate-90">→</span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {doctorList.length > 0 && (
          <div className="flex justify-center space-x-4">
             <button
    onClick={() => deleteFromStart()}
    className="px-6 py-3 bg-gradient-to-r from-[#098487] to-[#098499] text-white rounded-lg shadow-lg hover:from-[#f80133] hover:to-[#a36a6a] focus:outline-none focus:ring-4 focus:ring-purple-300 font-semibold transition-transform transform hover:scale-105 active:scale-95"
  >
    Delete First
  </button>

  <button
    onClick={() => deleteFromLast()}
    className="px-6 py-3 bg-gradient-to-r from-[#098484] to-[#098499] text-white rounded-lg shadow-lg hover:from-[#d3035a] hover:to-[#f10b26] focus:outline-none focus:ring-4 focus:ring-purple-300 font-semibold transition-transform transform hover:scale-105 active:scale-95"
  >
    Delete Last
  </button>
          </div>
        )}

        {patientsQueue.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={callNextPatient}
              className="w-full sm:w-auto px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none font-semibold transition-all"
            >
              Call Next Patient
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewDoctors;
