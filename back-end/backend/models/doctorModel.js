import mongoose from 'mongoose';


const doctorsModelSchema = new mongoose.Schema({
  doctors: {
    type: [Object], // Array of objects to store each doctor
    default: [],
  }, 
});


const doctorsModel = mongoose.models.doctorsModel || mongoose.model('doctorsModel', doctorsModelSchema);

export default doctorsModel;