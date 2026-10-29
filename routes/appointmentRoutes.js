import express from 'express';
import rateLimit from 'express-rate-limit';
import { handleAppointmentValidation } from '../controllers/appointmentController.js';

const router = express.Router();

// Rate limit appointment requests to avoid spam (15 requests per 15 minutes per IP)
const appointmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again after a few minutes or call directly at 01944648809.'
  }
});

router.post('/validate', appointmentLimiter, handleAppointmentValidation);

export default router;
