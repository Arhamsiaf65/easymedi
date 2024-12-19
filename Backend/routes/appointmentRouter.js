import express from 'express'
import { sendMail } from '../controllers/emailController.js';
import {addAppointment, bookedAppointments,doctorBookedAppointments, cancelAppointment, retrieveAppointments, cancelAllAppointments} from "../controllers/appointmentContoller.js";


const appointmentRouter = express.Router();

appointmentRouter.post('/add', addAppointment);
appointmentRouter.delete('/delete', cancelAppointment);
appointmentRouter.delete('/delete-all', cancelAllAppointments);
appointmentRouter.post('/delete/send-email', sendMail);
appointmentRouter.get('/', bookedAppointments);


export default appointmentRouter;