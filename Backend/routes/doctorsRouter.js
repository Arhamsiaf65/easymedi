import express from 'express'
import { addDoctor, showDoctors, doctorById,deleteDoctorById , showAvailableSlots, findDoctorById, deleteDoctorFromEnd, deleteDoctorFromStart} from '../controllers/doctorController.js';

const doctorsRouter = express.Router();

doctorsRouter.post('/add', addDoctor);
doctorsRouter.delete('/del/:id', deleteDoctorById);
doctorsRouter.delete('/del-start', deleteDoctorFromStart);
doctorsRouter.delete('/del-end', deleteDoctorFromEnd);
doctorsRouter.post('/show', showAvailableSlots);
doctorsRouter.post('/find', doctorById);
doctorsRouter.get('/', showDoctors);
export default doctorsRouter;