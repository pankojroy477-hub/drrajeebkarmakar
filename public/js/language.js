/**
 * DRRAJEEBKARMAKAR.COM — Bilingual Language Toggle System
 * Bengali (Default) | English with LocalStorage Persistence
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'dr_lang_preference';
  const DEFAULT_LANG = 'bn'; // Bengali is default

  function getCurrentLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    } catch (e) {
      return DEFAULT_LANG;
    }
  }

  function setLanguage(lang) {
    const targetLang = lang === 'en' ? 'en' : 'bn';
    try {
      localStorage.setItem(STORAGE_KEY, targetLang);
    } catch (e) {
      // Ignore storage errors in private browsing
    }

    // Update HTML root lang attribute
    document.documentElement.lang = targetLang;

    // Update all text nodes with data-en and data-bn
    const translatableElements = document.querySelectorAll('.lang-text');
    translatableElements.forEach((el) => {
      const text = el.getAttribute(`data-${targetLang}`);
      if (text) {
        el.textContent = text;
      }
    });

    // Update form placeholders with data-placeholder-en and data-placeholder-bn
    const inputs = document.querySelectorAll('[data-placeholder-en], [data-placeholder-bn]');
    inputs.forEach((input) => {
      const placeholder = input.getAttribute(`data-placeholder-${targetLang}`);
      if (placeholder) {
        input.placeholder = placeholder;
      }
    });

    // Update language toggle button labels
    const desktopBtnLabel = document.getElementById('lang-btn-label');
    const mobileBtnLabel = document.getElementById('mobile-lang-label');
    
    if (desktopBtnLabel) {
      desktopBtnLabel.textContent = targetLang === 'bn' ? 'বাংলা | EN' : 'English | বাংলা';
    }
    if (mobileBtnLabel) {
      mobileBtnLabel.textContent = targetLang === 'bn' ? 'বাংলা' : 'English';
    }

    // Trigger custom event
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: targetLang } }));
  }

  function toggleLanguage() {
    const current = getCurrentLanguage();
    const next = current === 'bn' ? 'en' : 'bn';
    setLanguage(next);
  }

  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    const initialLang = getCurrentLanguage();
    setLanguage(initialLang);

    // Desktop Toggle Button
    const desktopToggle = document.getElementById('lang-toggle-btn');
    if (desktopToggle) {
      desktopToggle.addEventListener('click', toggleLanguage);
    }

    // Mobile Toggle Button
    const mobileToggle = document.getElementById('mobile-lang-toggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', toggleLanguage);
    }
  });

  // Expose global helper
  window.DrSiteLang = {
    get: getCurrentLanguage,
    set: setLanguage,
    toggle: toggleLanguage
  };
})();
