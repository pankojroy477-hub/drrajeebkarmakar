import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let cachedDoctorData = null;
let cachedTranslations = null;

export function getDoctorData() {
  if (!cachedDoctorData || process.env.NODE_ENV !== 'production') {
    const filePath = path.join(rootDir, 'data', 'doctor.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    cachedDoctorData = JSON.parse(content);
  }
  return cachedDoctorData;
}

export function getTranslations() {
  if (!cachedTranslations || process.env.NODE_ENV !== 'production') {
    const filePath = path.join(rootDir, 'data', 'translations.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    cachedTranslations = JSON.parse(content);
  }
  return cachedTranslations;
}

export function formatWhatsAppMessage(appointmentData) {
  const { name, phone, chamber, date, time, reason, notes } = appointmentData;
  const lines = [
    `*নতুন সিরিয়াল ও পরামর্শের অনুরোধ*`,
    `--------------------------------`,
    `*রোগীর নাম:* ${name.trim()}`,
    `*মোবাইল নম্বর:* ${phone.trim()}`,
    `*চেম্বার:* ${chamber.trim()}`,
    `*পছন্দের তারিখ:* ${date ? date.trim() : 'শিডিউল অনুযায়ী'}`,
    `*পছন্দের সময়:* ${time ? time.trim() : 'প্রযোজ্য সময়'}`,
    `*সমস্যার বিবরণ:* ${reason.trim()}`
  ];

  if (notes && notes.trim().length > 0) {
    lines.push(`*অতিরিক্ত তথ্য:* ${notes.trim()}`);
  }

  lines.push(`--------------------------------`);
  lines.push(`(drrajeebkarmakar.com পোর্টাল থেকে প্রেরিত)`);

  return lines.join('\n');
}
