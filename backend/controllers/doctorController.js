import LinkedList from "../dataStructures/linkedList.js";
import doctorsModel from "../models/doctorModel.js";

let doctorsList = new LinkedList();

const loadDoctorsFromDB = async () => {
  try {
    const doctorData = await doctorsModel.findOne({});
    doctorsList = new LinkedList();

    if (doctorData && Array.isArray(doctorData.doctors)) {
      for (let i = doctorData.doctors.length - 1; i >= 0; i--) {
        const doctor = doctorData.doctors[i];
        if (doctor) {
          doctorsList.addAtStart(doctor);
        }
      }
    } else {
      console.warn("No valid doctors list found. Initializing with an empty list.");
    }
  } catch (error) {
    console.error("Error loading doctors from database:", error);
    doctorsList = new LinkedList();
  }
};


const saveDoctorsToDB = async () => {
  try {
    const doctorsArray = doctorsList.toArray();

    await doctorsModel.updateOne(
      {},
      { doctors: doctorsArray },
      { upsert: true }
    );

    console.log("Doctor list saved to database successfully");
  } catch (error) {
    console.error("Error saving doctors list to database:", error);
  }
};

const findDoctorById = async (id) => {
  try {
    await loadDoctorsFromDB();
    let doctors = doctorsList.toArray();
    let doctor = doctors.find((doctor) => doctor.id === id);
    console.log("the doctor found is ", doctor);
    return doctor
  } catch (error) {
    console.error("Failed to find doctor:", error);
    return null
  }
}

const doctorById = async (req, res) => {
  try {
    const {id} = req.body;
    await loadDoctorsFromDB();
    let doctors = doctorsList.toArray();
    let doctor = doctors.find((doctor) => doctor.id === id);
    console.log("The id to find is " , id);
    console.log("Doctor in found doctor function" , doctor);
    return res.json(doctor);
  } catch (error) {
    console.error("Failed to find doctor:", error);
    return null
  }
}

const deleteDoctorById = async (req, res) => {
  try {
    const { id } = req.params; 

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required.",
      });
    }

    const doctorRecord = await doctorsModel.findOne();
    let doctorsArray = doctorRecord ? doctorRecord.doctors : [];
    doctorsArray = doctorsArray.filter((doctor) => doctor.id !== id);

    await doctorsModel.updateOne({}, { doctors: doctorsArray }, { upsert: true });

    return res.status(200).json({
      success: true,
      message: `Doctor with ID ${id} deleted successfully.`,
    });
  } catch (error) {
    console.error("Failed to delete doctor:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete doctor.",
    });
  }
};


const addDoctor = async (req, res) => {
  try {
    const doctor = req.body;

    if (!doctor|| !doctor.doctorName || !doctor.id || !doctor.slots || !doctor.specialization) {
      return res.status(400).json({
        success: false,
        message: "Doctor data is missing or invalid.",
      });
    }

    await loadDoctorsFromDB(); 
    doctorsList.addAtStart(doctor); 
    await saveDoctorsToDB(); 

    return res.json({
      success: true,
      message: "Doctor added successfully",
    });
  } catch (error) {
    console.error("Error adding doctor:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add doctor.",
    });
  }
};

const showDoctors = async (req, res) => {
  try {
    loadDoctorsFromDB(); 
    const doctorsArray = doctorsList.toArray();
    return res.json({
      success: true,
      doctorsList: doctorsArray,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return res.status(500).json({
      success: false,
      doctorsList: [],
    });
  }
};

const showAvailableSlots = async (req, res) => {
  try {
    const { id } = req.body;
    let doctorsArray = doctorsList.toArray();

    const doctor = doctorsArray.find((doctor) => doctor.id === id);

    if (!doctor) {
      return res.json({
        success: false,
        message: `Doctor with ID ${id} not found`,
        availableSlots: null
      });
    }

    const availableSlotsByDay = {};
    for (const [day, slots] of Object.entries(doctor.slots)) {
      availableSlotsByDay[day] = slots.filter((slot) => slot.available === true);
    }

    return res.json({
      success: true,
      message: `Available slots for doctor with ID ${id} retrieved successfully`,
      availableSlots: availableSlotsByDay
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get available slots",
      availableSlots: null,
      error: error.message
    });
  }
};

const deleteDoctorFromStart = async (req, res) => {
  try {
    await loadDoctorsFromDB();

    if (doctorsList.isEmpty()) {
      return res.status(404).json({
        success: false,
        message: "No doctors available to delete.",
      });
    }

    const removedDoctor = doctorsList.removeFromStart(); 
    await saveDoctorsToDB();

    return res.status(200).json({
      success: true,
toRemove: toRemove,
      message: "Doctor removed from the start successfully.",
      removedDoctor    });
  } catch (error) {
    console.error("Error removing doctor from start:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove doctor from the start.",
      error: error.message,
    });
  }
};


const deleteDoctorFromEnd = async (req, res) => {
  try {
    await loadDoctorsFromDB();

    if (doctorsList.isEmpty()) {
      return res.status(404).json({
        success: false,
        message: "No doctors available to delete.",
        removedDoctor,
      });
    }

    const removedDoctor = doctorsList.removeFromEnd(); 
    await deleteAppointmentsOfDoctor(removedDoctor.id);
    await saveDoctorsToDB();


    return res.status(200).json({
      success: true,
      message: "Doctor removed from the end successfully.",
      removedDoctor,
    });
  } catch (error) {
    console.error("Error removing doctor from end:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove doctor from the end.",
      error: error.message,
    });
  }
};


export { addDoctor, saveDoctorsToDB, showDoctors, deleteDoctorById, showAvailableSlots, findDoctorById , doctorsList, doctorById, deleteDoctorFromEnd, deleteDoctorFromStart};
