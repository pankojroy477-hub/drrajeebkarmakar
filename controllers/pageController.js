import { getDoctorData, getTranslations } from '../lib/dataService.js';

export function renderAbout(req, res) {
  const data = getDoctorData();
  const translations = getTranslations();

  res.render('pages/about', {
    pageTitle: 'About Dr. Rajeeebshankar Karmakar - Qualifications & Biography',
    metaDescription: 'Academic qualifications, thoracic surgical training at NIDCH, international Royal College memberships (MRCSI, MRCSEd, FICS), and career experience of Dr. Rajeeebshankar Karmakar.',
    canonicalUrl: 'https://drrajeebkarmakar.com/about',
    currentPath: '/about',
    doctor: data.doctor,
    contact: data.contact,
    qualifications: data.qualifications,
    experience: data.experience,
    memberships: data.memberships,
    stats: data.stats,
    translations
  });
}

export function renderExpertise(req, res) {
  const data = getDoctorData();
  const translations = getTranslations();

  res.render('pages/expertise', {
    pageTitle: 'Chest Diseases & Thoracic Surgery Specialties - Dr. Rajeeebshankar Karmakar',
    metaDescription: 'Specialized clinical care for cough, shortness of breath, asthma, COPD, pneumonia, tuberculosis, pleural effusion, lung tumors, chest trauma, and advanced thoracic surgeries.',
    canonicalUrl: 'https://drrajeebkarmakar.com/expertise',
    currentPath: '/expertise',
    doctor: data.doctor,
    contact: data.contact,
    specialties: data.specialties,
    procedures: data.procedures,
    emergencyNotice: data.emergencyNotice,
    translations
  });
}

export function renderChambers(req, res) {
  const data = getDoctorData();
  const translations = getTranslations();

  res.render('pages/chambers', {
    pageTitle: 'Chambers & Visiting Hours - Dr. Rajeeebshankar Karmakar',
    metaDescription: 'Find visiting hours, chamber addresses, and appointment contact numbers for Southern General Hospital (Faridpur) and Probashi Hospital (Madaripur).',
    canonicalUrl: 'https://drrajeebkarmakar.com/chambers',
    currentPath: '/chambers',
    doctor: data.doctor,
    contact: data.contact,
    chambers: data.chambers.filter(c => c.enabled !== false),
    translations
  });
}

export function renderPublications(req, res) {
  const data = getDoctorData();
  const translations = getTranslations();

  res.render('pages/publications', {
    pageTitle: 'Research & Publications - Dr. Rajeeebshankar Karmakar',
    metaDescription: 'Browse 13 peer-reviewed research publications in thoracic surgery, lobectomy outcomes, pulmonary function, sepsis, and critical care by Dr. Rajeeebshankar Karmakar.',
    canonicalUrl: 'https://drrajeebkarmakar.com/publications',
    currentPath: '/publications',
    doctor: data.doctor,
    contact: data.contact,
    publications: data.publications,
    translations
  });
}

export function renderContact(req, res) {
  const data = getDoctorData();
  const translations = getTranslations();

  res.render('pages/contact', {
    pageTitle: 'Contact & Chamber Serial - Dr. Rajeeebshankar Karmakar',
    metaDescription: 'Call 01944648809, connect on WhatsApp (+8801944648809), or submit an online appointment request to consult Dr. Rajeeebshankar Karmakar.',
    canonicalUrl: 'https://drrajeebkarmakar.com/contact',
    currentPath: '/contact',
    doctor: data.doctor,
    contact: data.contact,
    chambers: data.chambers.filter(c => c.enabled !== false),
    emergencyNotice: data.emergencyNotice,
    translations
  });
}

export function renderPrivacy(req, res) {
  const data = getDoctorData();
  const translations = getTranslations();

  res.render('pages/privacy', {
    pageTitle: 'Privacy Policy & Terms - Dr. Rajeeebshankar Karmakar',
    metaDescription: 'Official privacy policy for drrajeebkarmakar.com detailing WhatsApp appointment coordination, patient confidentiality, and security.',
    canonicalUrl: 'https://drrajeebkarmakar.com/privacy',
    currentPath: '/privacy',
    doctor: data.doctor,
    contact: data.contact,
    translations
  });
}
