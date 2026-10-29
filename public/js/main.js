/**
 * DRRAJEEBKARMAKAR.COM — Main UI Script
 * Navigation Drawer, Accordions, Search Filters, and Keyboard Accessibility
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------
    // 1. Mobile Menu Drawer Setup
    // ----------------------------------------------------
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    if (mobileToggle && mobileDrawer) {
      function openDrawer() {
        mobileDrawer.classList.remove('hidden');
        mobileToggle.setAttribute('aria-expanded', 'true');
        if (hamburgerIcon) hamburgerIcon.classList.add('hidden');
        if (closeIcon) closeIcon.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }

      function closeDrawer() {
        mobileDrawer.classList.add('hidden');
        mobileToggle.setAttribute('aria-expanded', 'false');
        if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
        if (closeIcon) closeIcon.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }

      mobileToggle.addEventListener('click', () => {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });

      // Close on link click inside drawer
      mobileDrawer.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeDrawer);
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileToggle.getAttribute('aria-expanded') === 'true') {
          closeDrawer();
        }
      });
    }

    // ----------------------------------------------------
    // 2. FAQ Accordion Toggle
    // ----------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
      const trigger = item.querySelector('.faq-trigger');
      if (trigger) {
        trigger.addEventListener('click', () => {
          const isOpen = item.getAttribute('data-open') === 'true';
          
          // Close all other accordions for clean single disclosure
          faqItems.forEach((other) => {
            if (other !== item) {
              other.setAttribute('data-open', 'false');
              const otherTrigger = other.querySelector('.faq-trigger');
              if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            }
          });

          // Toggle current
          item.setAttribute('data-open', (!isOpen).toString());
          trigger.setAttribute('aria-expanded', (!isOpen).toString());
        });
      }
    });

    // ----------------------------------------------------
    // 3. Publications Search & Filter
    // ----------------------------------------------------
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

    // ----------------------------------------------------
    // 4. Header Shadow on Scroll
    // ----------------------------------------------------
    const siteHeader = document.getElementById('site-header');
    if (siteHeader) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
          siteHeader.classList.add('shadow-xl', 'border-white/20');
        } else {
          siteHeader.classList.remove('shadow-xl', 'border-white/20');
        }
      }, { passive: true });
    }

  });
})();
