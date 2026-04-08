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

  // --- INTERSECTION OBSERVER (Scroll Animations) ---
  const animClasses = {
    'fade-in': 'fade-in--visible',
    'slide-in-left': 'slide-in-left--visible',
    'slide-in-right': 'slide-in-right--visible',
    'scale-in': 'scale-in--visible'
  };

  const animElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
  if (animElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          for (const [cls, visibleCls] of Object.entries(animClasses)) {
            if (entry.target.classList.contains(cls)) {
              entry.target.classList.add(visibleCls);
              break;
            }
          }
          // If stagger parent, trigger children
          if (entry.target.classList.contains('stagger')) {
            entry.target.querySelectorAll('.fade-in, .scale-in').forEach(child => {
              for (const [cls, visibleCls] of Object.entries(animClasses)) {
                if (child.classList.contains(cls)) {
                  child.classList.add(visibleCls);
                }
              }
            });
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -60px 0px'
    });

    animElements.forEach(el => observer.observe(el));
  }

  // --- PARALLAX on Hero background ---
  const heroBg = document.querySelector('.hero__bg-img');
  if (heroBg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroHeight = document.querySelector('.hero').offsetHeight;
          if (scrollY < heroHeight) {
            heroBg.style.transform = `scale(1.1) translateY(${scrollY * 0.3}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // --- Nav hide on scroll down, show on scroll up ---
  let lastNavScrollY = 0;
  let navHidden = false;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 300 && scrollY > lastNavScrollY && !navHidden) {
      nav.style.transform = 'translateY(-100%)';
      navHidden = true;
    } else if (scrollY < lastNavScrollY && navHidden) {
      nav.style.transform = 'translateY(0)';
      navHidden = false;
    }
    lastNavScrollY = scrollY;
  }, { passive: true });

  // --- COUNTER ANIMATION (delayed until fade-in parent is visible) ---
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    const statsParent = document.querySelector('.stats');
    if (statsParent) {
      const counterObserver = new MutationObserver(() => {
        if (statsParent.classList.contains('fade-in--visible')) {
          counters.forEach(el => {
            const target = parseInt(el.dataset.count, 10);
            animateCounter(el, target);
          });
          counterObserver.disconnect();
        }
      });
      counterObserver.observe(statsParent, { attributes: true, attributeFilter: ['class'] });
    }
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
