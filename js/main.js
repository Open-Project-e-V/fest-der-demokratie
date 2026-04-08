/* ============================================
   FEST DER DEMOKRATIE 2026 — Main JS
   ============================================ */

(function () {
  'use strict';

  // --- NAVIGATION ---
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLeft = nav ? nav.querySelector('.nav__left') : null;
  const navRight = nav ? nav.querySelector('.nav__right') : null;

  // Scroll effect
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    lastScrollY = scrollY;
  }, { passive: true });

  // Mobile menu
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('nav__toggle--open');
      if (navLeft) navLeft.classList.toggle('nav__mobile--open');
      if (navRight) navRight.classList.toggle('nav__mobile--open');
      const isOpen = navLeft && navLeft.classList.contains('nav__mobile--open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    nav.querySelectorAll('.nav__link, .nav__icon').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('nav__toggle--open');
        if (navLeft) navLeft.classList.remove('nav__mobile--open');
        if (navRight) navRight.classList.remove('nav__mobile--open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- INTERSECTION OBSERVER (Fade-in) ---
  const fadeElements = document.querySelectorAll('.fade-in, .slide-in-left');
  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(
            entry.target.classList.contains('slide-in-left')
              ? 'slide-in-left--visible'
              : 'fade-in--visible'
          );
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  }

  // --- COUNTER ANIMATION ---
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el, target) {
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * target);

      const suffix = el.dataset.suffix || '+';
      el.textContent = current >= 1000
        ? current.toLocaleString('de-DE') + suffix
        : current + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  // --- PROGRESS BAR ANIMATION ---
  const progressBars = document.querySelectorAll('[data-width]');
  if (progressBars.length > 0) {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          setTimeout(() => {
            el.style.width = el.dataset.width + '%';
          }, 300);
          progressObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    progressBars.forEach(el => progressObserver.observe(el));
  }

  // --- PROGRAMM: CATEGORY FILTERS ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const scheduleItems = document.querySelectorAll('.schedule-item');

  if (filterBtns.length > 0 && scheduleItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
        btn.classList.add('filter-btn--active');

        scheduleItems.forEach(item => {
          const matchesCat = filter === 'alle' || item.dataset.category === filter;
          item.style.display = matchesCat ? '' : 'none';
        });
      });
    });
  }

  // --- SPENDEN: AMOUNT SELECTION ---
  const donationAmounts = document.querySelectorAll('.donation-amount');
  const customAmountInput = document.getElementById('customAmount');
  const donateBtn = document.getElementById('donateBtn');
  let selectedAmount = 50;

  if (donationAmounts.length > 0) {
    donationAmounts.forEach(btn => {
      btn.addEventListener('click', () => {
        selectedAmount = parseInt(btn.dataset.amount, 10);
        donationAmounts.forEach(b => b.classList.remove('donation-amount--active'));
        btn.classList.add('donation-amount--active');
        if (customAmountInput) customAmountInput.value = '';
        updateDonateButton();
      });
    });
  }

  if (customAmountInput) {
    customAmountInput.addEventListener('input', () => {
      const val = parseInt(customAmountInput.value, 10);
      if (val > 0) {
        selectedAmount = val;
        donationAmounts.forEach(b => b.classList.remove('donation-amount--active'));
        updateDonateButton();
      }
    });
  }

  function updateDonateButton() {
    if (!donateBtn) return;
    donateBtn.textContent = `Jetzt ${selectedAmount} € spenden`;
    const bankAmount = document.getElementById('bankAmount');
    if (bankAmount) bankAmount.textContent = selectedAmount;
  }

  // --- SPENDEN: SHOW BANK DETAILS ON CLICK ---
  const donationBank = document.getElementById('donationBank');
  if (donateBtn && donationBank) {
    donateBtn.addEventListener('click', () => {
      donationBank.style.display = donationBank.style.display === 'none' ? '' : 'none';
    });
  }

  // --- MARQUEE PAUSE ON HOVER ---
  const marquee = document.querySelector('.marquee__inner');
  if (marquee) {
    marquee.parentElement.addEventListener('mouseenter', () => {
      marquee.style.animationPlayState = 'paused';
    });
    marquee.parentElement.addEventListener('mouseleave', () => {
      marquee.style.animationPlayState = 'running';
    });
  }

})();
