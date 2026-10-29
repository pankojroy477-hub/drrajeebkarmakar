import test from 'node:test';
import assert from 'node:assert/strict';
import { getDoctorData, getTranslations, formatWhatsAppMessage } from '../lib/dataService.js';

test('Doctor Data: BMDC Registration and core verified profile', () => {
  const data = getDoctorData();
  assert.equal(data.doctor.nameEn, 'Dr. Rajeebshankar Karmakar', 'Doctor name must be Dr. Rajeebshankar Karmakar');
  assert.equal(data.doctor.bmdcRegistration, 'A-61665', 'BMDC Registration must be A-61665');
  assert.equal(data.doctor.experienceYears, 12, 'Experience must be 12+ years');
  assert.equal(data.contact.appointmentPhone, '01944648809', 'Appointment phone must be 01944648809');
  assert.equal(data.contact.whatsappNumber, '8801944648809', 'WhatsApp number must be 8801944648809');
  assert.equal(data.contact.email, 'rajeebfmc16@gmail.com', 'Email must be rajeebfmc16@gmail.com');
});

test('Doctor Data: All 13 Research Publications from CV are preserved', () => {
  const data = getDoctorData();
  assert.equal(data.publications.length, 13, 'There must be exactly 13 publication records');
  
  // Verify real DOIs are preserved
  const pub1 = data.publications.find(p => p.id === 1);
  assert.ok(pub1, 'Publication 1 must exist');
  assert.equal(pub1.doi, '10.7759/cureus.89419');
  assert.equal(pub1.journal, 'Cureus');

  const pub3 = data.publications.find(p => p.id === 3);
  assert.ok(pub3, 'Publication 3 must exist');
  assert.equal(pub3.doi, '10.3329/fmcj.v20i2.82988');

  // Verify that publications with incomplete DOI (e.g. pub 9) do not fabricate a fake URL
  const pub9 = data.publications.find(p => p.id === 9);
  assert.equal(pub9.doiUrl, null, 'Incomplete DOI must not have a fabricated URL');
});

test('Doctor Data: 2 Specific Chamber locations and visiting schedules', () => {
  const data = getDoctorData();
  assert.equal(data.chambers.length, 2, 'There must be exactly 2 chambers');

  const chamber1 = data.chambers.find(c => c.id === 'chamber-1');
  assert.ok(chamber1, 'Southern General Hospital chamber must exist');
  assert.equal(chamber1.hospitalEn, 'Southern General Hospital');
  assert.equal(chamber1.visitingDayEn, 'Every Thursday');
  assert.equal(chamber1.visitingTimeEn, '3:00 PM – 5:00 PM');
  assert.equal(chamber1.appointmentPhone, '01944648809');

  const chamber2 = data.chambers.find(c => c.id === 'chamber-2');
  assert.ok(chamber2, 'Probashi Hospital chamber must exist');
  assert.equal(chamber2.hospitalBn, 'প্রবাসী হাসপাতাল');
  assert.equal(chamber2.visitingDayEn, 'Every Friday');
  assert.equal(chamber2.visitingTimeEn, '10:00 AM – 3:00 PM');
  assert.equal(chamber2.appointmentPhone, '01944648809');
});

test('Doctor Data: Qualifications and Timeline entries match supplied CV', () => {
  const data = getDoctorData();
  assert.equal(data.qualifications.length, 6, 'Must list all 6 academic qualifications');
  assert.equal(data.experience.length, 5, 'Must list all 5 career milestones');
  assert.equal(data.memberships.length, 5, 'Must list all 5 professional memberships');
  
  // Ambiguous qualifications like MACP and MERS must NOT be promoted to academic degrees
  const ambiguous = data.qualifications.some(q => q.degreeEn.includes('MACP') || q.degreeEn.includes('MERS'));
  assert.equal(ambiguous, false, 'Ambiguous titles MACP/MERS must not be promoted to academic qualifications');
});

test('Privacy Compliance: No private residential address or secondary personal phone', () => {
  const data = getDoctorData();
  const rawString = JSON.stringify(data);
  // Ensure confidential contact data is never leaked in JSON
  assert.equal(rawString.includes('Khabaspur Residential'), false);
  assert.equal(data.awards.length, 0, 'No fabricated awards');
  assert.equal(data.testimonials.length, 0, 'No synthetic patient testimonials');
});

test('Appointment Service: WhatsApp Message Generator produces clean formatted payload', () => {
  const payload = {
    name: 'আব্দুল করিম',
    phone: '01711223344',
    chamber: 'সাউদার্ন জেনারেল হাসপাতাল, ফরিদপুর',
    date: '2026-11-05',
    time: 'বিকেল ৩:০০ টা',
    reason: 'দীর্ঘদিনের কাশি ও শ্বাসকষ্ট',
    notes: 'ডায়াবেটিস আছে'
  };

  const message = formatWhatsAppMessage(payload);
  assert.ok(message.includes('আব্দুল করিম'), 'Message contains patient name');
  assert.ok(message.includes('01711223344'), 'Message contains phone number');
  assert.ok(message.includes('সাউদার্ন জেনারেল হাসপাতাল'), 'Message contains chamber');
  assert.ok(message.includes('দীর্ঘদিনের কাশি ও শ্বাসকষ্ট'), 'Message contains symptom');
  assert.ok(message.includes('ডায়াবেটিস আছে'), 'Message contains notes');
});

test('Translations Dictionary: Contains valid keys in Bengali and English', () => {
  const translations = getTranslations();
  assert.ok(translations.nav.home.en && translations.nav.home.bn);
  assert.ok(translations.common.callNow.en && translations.common.callNow.bn);
  assert.ok(translations.form.submitBtn.en && translations.form.submitBtn.bn);
});
