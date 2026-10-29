/**
 * DRRAJEEBKARMAKAR.COM — Premium 3D Medical Motion & Client Core Script
 * Features:
 * - 3D Procedural Respiratory Visualization via Three.js
 * - GSAP & ScrollTrigger Choreography with prefers-reduced-motion safety
 * - Interactive 3D Tilt Micro-interactions
 * - Bilingual Language Toggle (Default: Bengali)
 * - Timeline Node Illumination on Scroll
 * - Research Publications Live Filter
 * - WhatsApp Appointment Serial Generator & Modal
 * - Scroll Progress Bar & Floating Back-to-Top Button
 */

import './style.css';
import { RespiratoryVisualization } from './three-lungs.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

(function () {
  'use strict';

  // ========================================================
  // 1. Bilingual Language System (Default: Bengali)
  // ========================================================
  const STORAGE_KEY = 'dr_lang_preference';
  const DEFAULT_LANG = 'bn';

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
      // localStorage disabled or private browsing
    }

    document.documentElement.lang = targetLang;

    // Update all text nodes with data-en and data-bn
    const translatableElements = document.querySelectorAll('.lang-text');
    translatableElements.forEach((el) => {
      const text = el.getAttribute(`data-${targetLang}`);
      if (text) {
        el.textContent = text;
      }
    });

    // Update form placeholders
    const inputs = document.querySelectorAll('[data-placeholder-en], [data-placeholder-bn]');
    inputs.forEach((input) => {
      const placeholder = input.getAttribute(`data-placeholder-${targetLang}`);
      if (placeholder) {
        input.placeholder = placeholder;
      }
    });

    // Update toggle button labels
    const desktopBtnLabel = document.getElementById('lang-btn-label');
    const mobileBtnLabel = document.getElementById('mobile-lang-label');
    
    if (desktopBtnLabel) {
      desktopBtnLabel.textContent = targetLang === 'bn' ? 'বাংলা | EN' : 'English | বাংলা';
    }
    if (mobileBtnLabel) {
      mobileBtnLabel.textContent = targetLang === 'bn' ? 'বাংলা' : 'English';
    }

    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: targetLang } }));
  }

  function toggleLanguage() {
    const current = getCurrentLanguage();
    const next = current === 'bn' ? 'en' : 'bn';
    setLanguage(next);
  }

  // ========================================================
  // 2. 3D Card Tilt Micro-interactions
  // ========================================================
  function init3DTiltCards() {
    // Only apply on devices with fine pointer (mouse)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  // ========================================================
  // 3. Magnetic Button Micro-interaction
  // ========================================================
  function initMagneticButtons() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const buttons = document.querySelectorAll('.btn-magnetic');
    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // ========================================================
  // 4. Scroll Progress & Sticky Header
  // ========================================================
  function initScrollTracking() {
    const progressBar = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');
    const siteHeader = document.getElementById('site-header');

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }

      if (backToTop) {
        if (scrollTop > 450) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      }

      if (siteHeader) {
        if (scrollTop > 30) {
          siteHeader.classList.add('shadow-2xl', 'bg-[#050D1A]/95', 'border-white/15');
          siteHeader.classList.remove('bg-[#050D1A]/80');
        } else {
          siteHeader.classList.remove('shadow-2xl', 'bg-[#050D1A]/95', 'border-white/15');
          siteHeader.classList.add('bg-[#050D1A]/80');
        }
      }
    }, { passive: true });

    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // ========================================================
  // 5. GSAP Motion & Scroll Choreography
  // ========================================================
  function initMotionSequences() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // 1. Hero Entrance Sequence
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
      .from('.hero-badge-tag', { opacity: 0, y: -15, duration: 0.7 })
      .from('.hero-main-title', { opacity: 0, y: 25, duration: 0.9 }, '-=0.4')
      .from('.hero-designation', { opacity: 0, y: 15, duration: 0.6 }, '-=0.5')
      .from('.hero-sub-text', { opacity: 0, y: 20, duration: 0.8 }, '-=0.4')
      .from('.hero-portrait-stage', { opacity: 0, scale: 0.94, duration: 1.0, ease: 'expo.out' }, '-=0.7')
      .from('#three-lungs-canvas', { opacity: 0, scale: 0.9, duration: 1.1, ease: 'power2.out' }, '-=0.9')
      .from('.hero-ctas', { opacity: 0, y: 15, duration: 0.7 }, '-=0.5')
      .from('.portrait-badge-top, .portrait-badge-bottom', { opacity: 0, scale: 0.8, stagger: 0.15, duration: 0.6 }, '-=0.4');

    // 2. ScrollTrigger reveals for sections
    const revealSections = document.querySelectorAll('.scroll-reveal');
    revealSections.forEach((section) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          once: true
        },
        opacity: 0,
        y: 35,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    // 3. Staggered Cards (Expertise & Procedures)
    const cardGrids = document.querySelectorAll('.stagger-cards-grid');
    cardGrids.forEach((grid) => {
      const items = grid.querySelectorAll('.stagger-card-item');
      if (items.length > 0) {
        gsap.from(items, {
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            once: true
          },
          opacity: 0,
          y: 25,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power2.out'
        });
      }
    });

    // 4. Statistics Animated Counter
    const statSection = document.getElementById('statistics-section');
    if (statSection) {
      ScrollTrigger.create({
        trigger: statSection,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          document.querySelectorAll('.stat-count').forEach((counter) => {
            const targetVal = parseInt(counter.getAttribute('data-target'), 10);
            if (!isNaN(targetVal)) {
              gsap.fromTo(
                counter,
                { innerText: 0 },
                {
                  innerText: targetVal,
                  duration: 1.6,
                  ease: 'power2.out',
                  snap: { innerText: 1 },
                  onUpdate: function () {
                    counter.innerText = Math.floor(this.targets()[0].innerText);
                  }
                }
              );
            }
          });
        }
      });
    }

    // 5. Timeline Nodes Activation on Scroll
    const timelineItems = document.querySelectorAll('.timeline-entry');
    timelineItems.forEach((entry) => {
      ScrollTrigger.create({
        trigger: entry,
        start: 'top 75%',
        onEnter: () => {
          const dot = entry.querySelector('.timeline-node-dot');
          if (dot) dot.classList.add('timeline-node-active');
        }
      });
    });
  }

  // ========================================================
  // 6. DOM Ready Setup
  // ========================================================
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize language
    const initialLang = getCurrentLanguage();
    setLanguage(initialLang);

    const desktopToggle = document.getElementById('lang-toggle-btn');
    if (desktopToggle) {
      desktopToggle.addEventListener('click', toggleLanguage);
    }

    const mobileToggle = document.getElementById('mobile-lang-toggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', toggleLanguage);
    }

    // 2. Initialize 3D Respiratory Scene
    const lungsContainer = document.getElementById('three-lungs-canvas');
    if (lungsContainer) {
      new RespiratoryVisualization(lungsContainer);
    }

    // 3. Initialize Interactions & GSAP Motion
    initScrollTracking();
    init3DTiltCards();
    initMagneticButtons();
    initMotionSequences();

    // 4. Mobile Menu Drawer
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    if (menuToggle && mobileDrawer) {
      function openDrawer() {
        mobileDrawer.classList.remove('hidden');
        menuToggle.setAttribute('aria-expanded', 'true');
        if (hamburgerIcon) hamburgerIcon.classList.add('hidden');
        if (closeIcon) closeIcon.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }

      function closeDrawer() {
        mobileDrawer.classList.add('hidden');
        menuToggle.setAttribute('aria-expanded', 'false');
        if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
        if (closeIcon) closeIcon.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }

      menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });

      mobileDrawer.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeDrawer);
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
          closeDrawer();
        }
      });
    }

    // 5. Accessible FAQ Accordions
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
      const trigger = item.querySelector('.faq-trigger');
      if (trigger) {
        trigger.addEventListener('click', () => {
          const isOpen = item.getAttribute('data-open') === 'true';
          
          faqItems.forEach((other) => {
            if (other !== item) {
              other.setAttribute('data-open', 'false');
              const otherTrigger = other.querySelector('.faq-trigger');
              if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            }
          });

          item.setAttribute('data-open', (!isOpen).toString());
          trigger.setAttribute('aria-expanded', (!isOpen).toString());
        });
      }
    });

    // 6. Research Publications Live Filter
    const pubSearchInput = document.getElementById('pub-search-input');
    const pubCards = document.querySelectorAll('.pub-card-item');
    const pubCountDisplay = document.getElementById('pub-active-count');

    if (pubSearchInput && pubCards.length > 0) {
      pubSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        let visibleCount = 0;

        pubCards.forEach((card) => {
          const title = (card.getAttribute('data-title') || '').toLowerCase();
          const journal = (card.getAttribute('data-journal') || '').toLowerCase();
          const category = (card.getAttribute('data-category') || '').toLowerCase();
          const year = (card.getAttribute('data-year') || '').toLowerCase();

          const matches =
            !query ||
            title.includes(query) ||
            journal.includes(query) ||
            category.includes(query) ||
            year.includes(query);

          if (matches) {
            card.style.display = '';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        if (pubCountDisplay) {
          pubCountDisplay.textContent = visibleCount.toString();
        }
      });
    }

    // 7. Appointment Form & WhatsApp Serialization
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
      const nameInput = document.getElementById('patient-name');
      const phoneInput = document.getElementById('patient-phone');
      const chamberSelect = document.getElementById('preferred-chamber');
      const dateInput = document.getElementById('preferred-date');
      const timeInput = document.getElementById('preferred-time');
      const reasonInput = document.getElementById('visit-reason');
      const notesInput = document.getElementById('additional-notes');
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
          el.classList.remove('border-red-500');
        });
        if (formAlert) {
          formAlert.classList.add('hidden');
          formAlert.textContent = '';
        }
      }

      function showError(fieldId, errorMsg) {
        const field = document.getElementById(fieldId);
        const errorEl = document.getElementById(`${fieldId}-error`);
        if (field) field.classList.add('border-red-500');
        if (errorEl) {
          errorEl.textContent = errorMsg;
          errorEl.classList.add('visible');
        }
      }

      if (modalCloseBtn && successModal) {
        modalCloseBtn.addEventListener('click', () => {
          successModal.classList.add('hidden');
        });
      }

      appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const name = nameInput ? nameInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const chamber = chamberSelect ? chamberSelect.value.trim() : '';
        const date = dateInput ? dateInput.value.trim() : '';
        const time = timeInput ? timeInput.value.trim() : '';
        const reason = reasonInput ? reasonInput.value.trim() : '';
        const notes = notesInput ? notesInput.value.trim() : '';

        let hasError = false;
        const isBn = document.documentElement.lang !== 'en';

        if (!name || name.length < 2) {
          showError('patient-name', isBn ? 'রোগীর পুরো নাম লিখুন (কমপক্ষে ২টি অক্ষর)' : 'Please enter patient full name');
          hasError = true;
        }

        const cleanPhone = phone.replace(/[\s\-()]/g, '');
        if (!cleanPhone || !/^(?:\+8801|8801|01)[3-9]\d{8}$/.test(cleanPhone)) {
          showError('patient-phone', isBn ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: ০১৭XXXXXXXX)' : 'Please provide a valid 11-digit mobile number');
          hasError = true;
        }

        if (!chamber) {
          showError('preferred-chamber', isBn ? 'একটি চেম্বার নির্বাচন করুন' : 'Please select a preferred chamber');
          hasError = true;
        }

        if (!reason || reason.length < 3) {
          showError('visit-reason', isBn ? 'রোগের প্রধান লক্ষণ বা কারণ উল্লেখ করুন' : 'Please briefly state health issue or symptom');
          hasError = true;
        }

        if (hasError) return;

        // WhatsApp structured message
        const lines = [
          `*নতুন সিরিয়াল ও পরামর্শের অনুরোধ*`,
          `--------------------------------`,
          `*রোগীর নাম:* ${name}`,
          `*মোবাইল নম্বর:* ${cleanPhone}`,
          `*চেম্বার:* ${chamber}`,
          `*পছন্দের তারিখ:* ${date || 'চেম্বারের শিডিউল অনুযায়ী'}`,
          `*পছন্দের সময়:* ${time || 'প্রযোজ্য সময়'}`,
          `*সমস্যার বিবরণ:* ${reason}`
        ];

        if (notes) {
          lines.push(`*অতিরিক্ত তথ্য:* ${notes}`);
        }

        lines.push(`--------------------------------`);
        lines.push(`(drrajeebkarmakar.com থেকে প্রেরিত)`);

        const formattedMsg = lines.join('\n');
        const whatsappNumber = '8801944648809';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(formattedMsg)}`;

        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

        // Show confirmation modal
        if (modalDirectWhatsApp) {
          modalDirectWhatsApp.href = whatsappUrl;
        }
        if (successModal) {
          successModal.classList.remove('hidden');
        }

        // Reset form
        appointmentForm.reset();
      });
    }

  });
})();
