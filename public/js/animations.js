/**
 * DRRAJEEBKARMAKAR.COM — GSAP & ScrollTrigger Animations
 * With Reduced-Motion Awareness & Zero-Failure Fallback
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Ensure all elements remain immediately visible
      document.querySelectorAll('.gsap-reveal').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded. Running in standard static presentation mode.');
      return;
    }

    // Register ScrollTrigger if available
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero Section Entrance Animation
    const heroHeadline = document.querySelector('.hero-headline');
    const heroSub = document.querySelector('.hero-sub');
    const heroCtas = document.querySelector('.hero-ctas');
    const heroPortrait = document.querySelector('.doctor-portrait-card');

    const heroTimeline = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.8 } });

    if (heroHeadline) {
      heroTimeline.from(heroHeadline, { opacity: 0, y: 20 }, 0.1);
    }
    if (heroSub) {
      heroTimeline.from(heroSub, { opacity: 0, y: 15 }, 0.3);
    }
    if (heroCtas) {
      heroTimeline.from(heroCtas, { opacity: 0, y: 15 }, 0.5);
    }
    if (heroPortrait) {
      heroTimeline.from(heroPortrait, { opacity: 0, scale: 0.95, y: 25, duration: 1 }, 0.2);
    }

    // Animated Statistics Counters
    const statCounters = document.querySelectorAll('.stat-count');
    if (statCounters.length > 0 && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: '#statistics-section',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          statCounters.forEach((counter) => {
            const targetVal = parseInt(counter.getAttribute('data-target'), 10);
            if (!isNaN(targetVal)) {
              gsap.fromTo(
                counter,
                { innerText: 0 },
                {
                  innerText: targetVal,
                  duration: 1.8,
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

    // Scroll-Triggered Reveal for Cards
    if (typeof ScrollTrigger !== 'undefined') {
      const revealCards = document.querySelectorAll('.gsap-reveal');
      revealCards.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 25,
          duration: 0.65,
          delay: (index % 3) * 0.1,
          ease: 'power2.out'
        });
      });
    }
  });
})();
