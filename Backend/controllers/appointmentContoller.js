import Queue from "../dataStructures/queue.js";
import { addDoctor, saveDoctorsToDB, showDoctors, deleteDoctorById, showAvailableSlots, findDoctorById, doctorsList } from '../controllers/doctorController.js';
import appointmentModel from "../models/appointmentModel.js";

let appointmentsQueue = new Queue();

const loadQueueFromDB = async () => {
  try {
    const queueData = await appointmentModel.findOne({});
    console.log("Fetched data from DB:", queueData);

    appointmentsQueue = new Queue();

    if (queueData && Array.isArray(queueData.appointments)) {
      queueData.appointments.some((appointment) => {
        if (appointment && Object.keys(appointment).length !== 0) {
          appointmentsQueue.enqueue(appointment);
        }
      });
      // console.log("Queue in memory after loading:", appointmentsQueue.arr);
    } else {
      console.warn("No valid appointments array found. Initializing with an empty queue.");
    }
  } catch (error) {
    console.error("Error loading appointments queue from database:", error);
    appointmentsQueue = new Queue();
  }
};

const saveQueueToDB = async () => {
  try {
    const appointmentsArray = appointmentsQueue.arr;
    await appointmentModel.updateOne(
      {},
      { appointments: appointmentsArray },
      { upsert: true }
    );
    // console.log("Queue saved to database successfully");
  } catch (error) {
    console.error("Error saving appointments queue to database:", error);
  }
};

const addAppointment = async (req, res) => {
  try {
    const { patient, doctorId, date, time, day, disease, doctorName } = req.body;
    if (!patient || !doctorId || !time || !date || !day || !disease || !doctorName) {
      return res.json({
        success: false,
        message: "All fields are required.",
      });
    }

    const doctor = await findDoctorById(doctorId);
    // console.log("Doctor founded " + doctor);
    if (!doctor) {
      return res.json({
        success: false,
        message: `Doctor with ID ${doctorId} not found.`,
      });
    }
    
    
    let slotsOfDay = doctor.slots[day];
    const selectedSlot = slotsOfDay.find(slot => slot.time === time);
    // console.log(selectedSlot);
    if(selectedSlot.available){
      selectedSlot.available = false;
          await saveDoctorsToDB(); 
          await loadQueueFromDB();
    }
    else{
      return res.json({
        success: false,
        message: "The appointment slot is not avialable.",
      });
    }
   

    if (appointmentsQueue.isFull()) {
      return res.json({
        success: false,
        message: "The appointments Queue is Full, No further space avialable.",
      });
    }


    const appointmentDetails = { patient, doctorId, date, time, day, disease, doctorName };
    const previousAppointments = appointmentsQueue.getQueue();
    let duplicate = false;
    
    // Check if the queue is not empty before using forEach
    if (previousAppointments.length !== 0) {
      previousAppointments.forEach((appoint) => {
        if (appoint !== undefined && appoint.patient.patientFirstName === patient.patientFirstName &&
            appoint.patient.userId === patient.userId && 
            appoint.doctorId === doctorId) {
          console.log("Patient", patient);
          console.log("\n");
          console.log("Doctor appointed patient", appoint.patient);
          duplicate = true;
          return;
        }})
      }
    
    else {
      console.log("No previous appointments found.");
    }
    
    
    console.log("Is duplicate:", duplicate);
    
    if (duplicate) {
      return res.json({
        success: false,
        message: "An appointment for this patient with this doctor and disease is already booked.",
      });
    }


    appointmentsQueue.enqueue(appointmentDetails);
    await saveQueueToDB();

    return res.json({
      success: true,
      message: "Appointment added successfully",
      appointments: appointmentsQueue.arr,
    });
  } catch (error) {
    console.error("Error adding appointment:", error);
    return res.json({
      success: false,
      message: "Failed to book appointment.",
    });
  }
};

const retrieveAppointments = async (req, res) => {
  try {
    await loadQueueFromDB();
    return res.json({
      success: true,
      appointments: appointmentsQueue.arr
    });
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    return res.json({
      success: false,
      appointments: []
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { doctorId, day, time, date } = req.query;

    // Validate required fields
    if (!date || !doctorId || !day || !time) {
      return res.json({
        success: false,
        message: "Doctor ID, day, date, and time are required.",
      });
    }

    // Ensure data integrity
    const data = { doctorId, day, time, date };
    console.log(data);

    // Load the queue and doctor data from the database
    await loadQueueFromDB();
    const doctor = await findDoctorById(doctorId);
    if (!doctor) {
      return res.json({
        success: false,
        message: `Doctor with ID ${doctorId} not found.`,
      });
    }

    // Find the appointment in the original queue
    const appointmentIndex = appointmentsQueue.arr.findIndex(
      (appointment) =>
        appointment &&
        appointment.doctorId === doctorId &&
        appointment.day === day &&
        appointment.time === time &&
        appointment.date === date
    );

    if (appointmentIndex === -1) {
      return res.json({
        success: false,
        message: "Appointment not found for cancellation.",
      });
    }

    // Retrieve the appointment for cancellation
    const toCancelAppointment = appointmentsQueue.arr[appointmentIndex];

    // Mark the slot as available
    if (doctor.slots && doctor.slots[day]) {
      const selectedDaySlots = doctor.slots[day];
      const slotIndex = selectedDaySlots.findIndex(
        (slot) => slot.time === toCancelAppointment.time
      );

      if (slotIndex !== -1) {
        doctor.slots[day][slotIndex].available = true;
        await saveDoctorsToDB(); // Save doctor data to reflect the slot update
      }
    } else {
      console.warn(`Doctor slots for day "${day}" not found.`);
    }

    // Remove the appointment from the queue
    appointmentsQueue.arr.splice(appointmentIndex, 1);
    await saveQueueToDB();

    // Respond with success
    return res.json({
      success: true,
      message: "Appointment canceled successfully.",
      appointments: appointmentsQueue.arr, // Return the updated queue
    });
  } catch (error) {
    console.error("Error canceling appointment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel the appointment due to server error.",
    });
  }
};





const checkUpDone = async (req, res) => {

}

const bookedAppointments = async (req, res) => {
  try {
    await loadQueueFromDB();
    return res.json({
      success: true,
      appointments: appointmentsQueue
    });

  } catch (error) {
    throw(error);
  }
}

const doctorBookedAppointments = async (req, res) => {
  try {
    await loadQueueFromDB();
    return res.json({
      success: true,
      appointments: appointmentsQueue
    });

  } catch (error) {
    throw(error);
  }
}

export { addAppointment, retrieveAppointments, bookedAppointments,doctorBookedAppointments, cancelAppointment };
