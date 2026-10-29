import { getDoctorData, formatWhatsAppMessage } from '../lib/dataService.js';

export function handleAppointmentValidation(req, res) {
  const { name, phone, chamber, date, time, reason, notes } = req.body;
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = 'Patient name is required (minimum 2 characters).';
  }

  // Bangladesh phone validation: 11 digits starting with 01
  const cleanPhone = (phone || '').replace(/[\s\-()]/g, '');
  if (!cleanPhone || !/^(?:\+8801|8801|01)[3-9]\d{8}$/.test(cleanPhone)) {
    errors.phone = 'Please provide a valid 11-digit mobile number (e.g. 017XXXXXXXX).';
  }

  if (!chamber || chamber.trim().length === 0) {
    errors.chamber = 'Please select a preferred chamber.';
  }

  if (!reason || reason.trim().length < 3) {
    errors.reason = 'Please briefly state the health problem or symptom.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the highlighted fields.',
      errors
    });
  }

  const doctorData = getDoctorData();
  const whatsappNumber = doctorData.contact.whatsappNumber || '8801944648809';
  const formattedText = formatWhatsAppMessage({
    name,
    phone: cleanPhone,
    chamber,
    date,
    time,
    reason,
    notes
  });

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(formattedText)}`;

  return res.status(200).json({
    success: true,
    message: 'Appointment request validated successfully.',
    whatsappUrl,
    whatsappNumber,
    confirmationNotice: 'Your request will open directly in WhatsApp to be sent to the doctor’s chamber assistant. Final serial is subject to chamber confirmation.'
  });
}
