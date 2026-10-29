/**
 * DRRAJEEBKARMAKAR.COM — Appointment Form & WhatsApp Dispatcher
 * Client-Side Validation + Server Verification Flow
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const appointmentForm = document.getElementById('appointment-form');
    if (!appointmentForm) return;

    const nameInput = document.getElementById('patient-name');
    const phoneInput = document.getElementById('patient-phone');
    const chamberSelect = document.getElementById('preferred-chamber');
    const dateInput = document.getElementById('preferred-date');
    const timeInput = document.getElementById('preferred-time');
    const reasonInput = document.getElementById('visit-reason');
    const notesInput = document.getElementById('additional-notes');
    const submitBtn = document.getElementById('submit-appointment-btn');
    const submitBtnText = document.getElementById('submit-btn-text');
    const submitSpinner = document.getElementById('submit-btn-spinner');
    const formAlert = document.getElementById('form-alert');
    const successModal = document.getElementById('appointment-success-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalDirectWhatsApp = document.getElementById('modal-direct-whatsapp');

    function clearErrors() {
      document.querySelectorAll('.form-error').forEach((el) => {
        el.classList.remove('visible');
        el.textContent = '';
      });
      document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach((el) => {
        el.classList.remove('is-invalid');
      });
      if (formAlert) {
        formAlert.classList.add('hidden');
        formAlert.textContent = '';
      }
    }

    function showError(fieldId, errorMsg) {
      const field = document.getElementById(fieldId);
      const errorEl = document.getElementById(`${fieldId}-error`);
      if (field) {
        field.classList.add('is-invalid');
      }
      if (errorEl) {
        errorEl.textContent = errorMsg;
        errorEl.classList.add('visible');
      }
    }

    function setLoading(isLoading) {
      if (submitBtn) {
        submitBtn.disabled = isLoading;
      }
      if (submitSpinner) {
        submitSpinner.classList.toggle('hidden', !isLoading);
      }
      if (submitBtnText) {
        const isBn = document.documentElement.lang !== 'en';
        submitBtnText.textContent = isLoading
          ? (isBn ? 'তথ্য যাচাই হচ্ছে...' : 'Verifying details...')
          : (isBn ? 'হোয়াটসঅ্যাপে সিরিয়াল পাঠান' : 'Send Request via WhatsApp');
      }
    }

    // Modal Close
    if (modalCloseBtn && successModal) {
      modalCloseBtn.addEventListener('click', () => {
        successModal.classList.add('hidden');
      });
    }

    appointmentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const chamber = chamberSelect ? chamberSelect.value.trim() : '';
      const date = dateInput ? dateInput.value.trim() : '';
      const time = timeInput ? timeInput.value.trim() : '';
      const reason = reasonInput ? reasonInput.value.trim() : '';
      const notes = notesInput ? notesInput.value.trim() : '';

      let hasClientError = false;
      const isBn = document.documentElement.lang !== 'en';

      if (!name || name.length < 2) {
        showError('patient-name', isBn ? 'রোগীর নাম অবশ্যই লিখতে হবে (কমপক্ষে ২টি অক্ষর)' : 'Please enter patient full name');
        hasClientError = true;
      }

      const cleanPhone = phone.replace(/[\s\-()]/g, '');
      if (!cleanPhone || !/^(?:\+8801|8801|01)[3-9]\d{8}$/.test(cleanPhone)) {
        showError('patient-phone', isBn ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: ০১৭XXXXXXXX)' : 'Please enter a valid 11-digit phone number');
        hasClientError = true;
      }

      if (!chamber) {
        showError('preferred-chamber', isBn ? 'একটি চেম্বার নির্বাচন করুন' : 'Please select a preferred chamber');
        hasClientError = true;
      }

      if (!reason || reason.length < 3) {
        showError('visit-reason', isBn ? 'রোগের প্রধান লক্ষণ বা কারণ উল্লেখ করুন' : 'Please briefly state symptom or problem');
        hasClientError = true;
      }

      if (hasClientError) return;

      setLoading(true);

      try {
        const response = await fetch('/api/appointment/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ name, phone: cleanPhone, chamber, date, time, reason, notes })
        });

        const result = await response.json();

        if (response.ok && result.success && result.whatsappUrl) {
          // Open WhatsApp link in new tab
          window.open(result.whatsappUrl, '_blank', 'noopener,noreferrer');

          // Update success modal
          if (modalDirectWhatsApp) {
            modalDirectWhatsApp.href = result.whatsappUrl;
          }
          if (successModal) {
            successModal.classList.remove('hidden');
          }

          // Reset Form
          appointmentForm.reset();
        } else {
          if (result.errors) {
            if (result.errors.name) showError('patient-name', result.errors.name);
            if (result.errors.phone) showError('patient-phone', result.errors.phone);
            if (result.errors.chamber) showError('preferred-chamber', result.errors.chamber);
            if (result.errors.reason) showError('visit-reason', result.errors.reason);
          }
          if (formAlert) {
            formAlert.textContent = result.message || (isBn ? 'আবেদনটি সফল হয়নি, অনুগ্রহ করে তথ্য চেক করুন।' : 'Submission failed. Please check your inputs.');
            formAlert.classList.remove('hidden');
          }
        }
      } catch (err) {
        console.error('Submission error:', err);
        // Fallback: Build WhatsApp URL directly on client
        const fallbackMsg = `*সিরিয়াল অনুরোধ*\nরোগী: ${name}\nফোন: ${cleanPhone}\nচেম্বার: ${chamber}\nলক্ষণ: ${reason}`;
        const fallbackUrl = `https://wa.me/8801944648809?text=${encodeURIComponent(fallbackMsg)}`;
        window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
      } finally {
        setLoading(false);
      }
    });
  });
})();
