import React from "react";
import styled from "styled-components";
import icons from "../../public/icons";

const SanSarif = styled.div`
  font-family: "Quicksand", sans-serif;
  font-weight: 600;
  font-style: normal;
`;

function AppointmentsQueue({ appointments, onAppointmentClick }) {
  let voices = [];

  // Function to fetch voices when they change or load
  const setVoices = () => {
    voices = window.speechSynthesis.getVoices();
  };

  window.speechSynthesis.onvoiceschanged = setVoices;

  const announceAppointment = (appointment) => {
    console.log(appointment);

    // Wait for voices to load
    if (!voices.length) {
      setVoices();  // Get voices in case they're not loaded yet
    }

    const englishVoice = voices.find(voice => voice.lang === 'en-US' || voice.name.includes('English'));

    const utterance = new SpeechSynthesisUtterance(
      `Patient ${appointment.patient.patientFirstName}, is appointed with ${appointment.doctorName}.`
    );

    if (englishVoice) {
      utterance.voice = englishVoice;
    } else {
      alert('English voice is not available. Using fallback voice.');
      const fallbackVoice = voices.find(voice => voice.lang === 'en-US');
      if (fallbackVoice) {
        utterance.voice = fallbackVoice;
      }
    }

    utterance.rate = 1;
    utterance.volume = 1;
    utterance.pitch = 0.5;

    window.speechSynthesis.speak(utterance);

    if (onAppointmentClick) onAppointmentClick(appointment);
  };

  return (
    <SanSarif>
      <div className="flex flex-col items-center mt-12 space-y-6 px-4 sm:px-6 lg:px-8">
        {/* Queue Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Appointments Queue
        </h2>

        {/* Queue Flow Indicator */}
        <div className="flex items-center space-x-4">
          <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-teal-400 to-teal-600 rounded-md" />
          <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-teal-400 to-teal-600 rounded-md" />
        </div>

        {/* Appointments List (Mobile Card Layout and Desktop Grid/Table Layout) */}
        <div className="relative w-full max-w-full sm:max-w-5xl py-6 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <div
                  key={index}
                  className="cursor-pointer w-full sm:w-28 h-24 sm:h-28 flex flex-col justify-center items-center rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
                  onClick={() => announceAppointment(appointment)}
                  title={`Click to announce appointment details`}
                >
                  <div className="flex flex-col justify-center items-center">
                    <img
                      src={icons.filledIcon}
                      alt={`Appointment with ${appointment.doctorName}`}
                      className="w-12 h-12 sm:w-14 sm:h-14 transition-all duration-300 transform hover:scale-125"
                    />
                  </div>

                  {index < appointments.length - 1 && (
                    <img
                      src={icons.arrowIcon}
                      alt="Queue Arrow"
                      className="w-8 h-8 sm:rotate-180 -rotate-90 sm:w-10 sm:h-10 mt-2"
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                No appointments available.
              </div>
            )}
          </div>

          {/* Empty Slots Section */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-6 py-3 text-gray-500">
            <div className="text-sm font-semibold">End of Queue</div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-teal-300 rounded-full" />
              <div className="w-2 h-2 bg-teal-300 rounded-full" />
              <div className="w-2 h-2 bg-teal-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </SanSarif>
  );
}

export default AppointmentsQueue;
