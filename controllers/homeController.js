import { getDoctorData, getTranslations } from '../lib/dataService.js';

export function renderHome(req, res) {
  const doctorData = getDoctorData();
  const translations = getTranslations();

  res.render('pages/home', {
    pageTitle: 'Dr. Rajeeebshankar Karmakar | Assistant Professor (Thoracic Surgery)',
    metaDescription: 'Official medical portfolio for Dr. Rajeeebshankar Karmakar, Assistant Professor of Thoracic Surgery and Chest Specialist at Faridpur Medical College Hospital.',
    canonicalUrl: 'https://drrajeebkarmakar.com/',
    currentPath: '/',
    doctor: doctorData.doctor,
    contact: doctorData.contact,
    chambers: doctorData.chambers.filter(c => c.enabled !== false),
    specialties: doctorData.specialties,
    procedures: doctorData.procedures,
    qualifications: doctorData.qualifications,
    experience: doctorData.experience,
    publications: doctorData.publications.slice(0, 5),
    totalPublicationsCount: doctorData.publications.length,
    memberships: doctorData.memberships,
    stats: doctorData.stats,
    faqs: doctorData.faqs,
    emergencyNotice: doctorData.emergencyNotice,
    translations
  });
}
