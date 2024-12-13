import mongoose from 'mongoose';


const appointmentQueueSchema = new mongoose.Schema({
  appointments: {
    type: [Object], // Array of objects to store each appointment
    default: [],
  },
});

const appointmentModel = mongoose.models.appointmentModel || mongoose.model('appointmentModel', appointmentQueueSchema);

export default appointmentModel;
