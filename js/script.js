/* ═══════════════════════════════════════════════════════
   KLYN — script.js
   Navbar · Animations · Mobile menu · Stats counter · Forms
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. NAVBAR — scroll effect + mobile burger
  ───────────────────────────────────────── */
  const navbar  = document.getElementById('navbar');
  const burger  = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  // Scroll: add .scrolled class after 60px
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Burger toggle
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on nav link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });
  }

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('open')) {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        if (burger) burger.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });


  /* ─────────────────────────────────────────
     2. FADE-UP ANIMATIONS — Intersection Observer
  ───────────────────────────────────────── */
  const fadeElements = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Stagger siblings by 100ms each
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.fade-up:not(.visible)')
          );
          const delay = siblings.indexOf(entry.target) * 100;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    // Fallback: show all immediately
    fadeElements.forEach(el => el.classList.add('visible'));
  }


  /* ─────────────────────────────────────────
     3. STATS COUNTER ANIMATION
  ───────────────────────────────────────── */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  if (statNumbers.length && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => statsObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1500; // ms
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.round(eased * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }


  /* ─────────────────────────────────────────
     4. SMOOTH SCROLL for anchor links
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const targetY = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });


  /* ─────────────────────────────────────────
     5. HERO scroll indicator click
  ───────────────────────────────────────── */
  const scrollIndicator = document.querySelector('.hero-scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const next = document.querySelector('#univers') || document.querySelector('section:nth-of-type(2)');
      if (next) next.scrollIntoView({ behavior: 'smooth' });
    });
  }


  /* ─────────────────────────────────────────
     6. NEWSLETTER FORM
  ───────────────────────────────────────── */
  const newsletterForm = document.getElementById('newsletterForm');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = newsletterForm.querySelector('button[type="submit"]');
      const btnText = btn.querySelector('.btn-text');
      const btnLoading = btn.querySelector('.btn-loading');
      const successMsg = newsletterForm.querySelector('.form-success');

      // UI: loading state
      if (btnText) btnText.hidden = true;
      if (btnLoading) btnLoading.hidden = false;
      btn.disabled = true;

      const formData = new FormData(newsletterForm);
      const data = {
        firstName: formData.get('firstName'),
        email: formData.get('email'),
        source: 'newsletter_homepage',
        date: new Date().toISOString()
      };

      // TODO: Replace with EmailJS or backend endpoint
      // await emailjs.send('service_id', 'template_id', data);
      // Simulated delay for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      // UI: success state
      newsletterForm.querySelector('input[name="firstName"]').value = '';
      newsletterForm.querySelector('input[name="email"]').value = '';
      if (btnText) btnText.hidden = false;
      if (btnLoading) btnLoading.hidden = true;
      btn.disabled = false;
      if (successMsg) successMsg.hidden = false;

      // Hide success after 5s
      setTimeout(() => {
        if (successMsg) successMsg.hidden = true;
      }, 5000);
    });
  }


  /* ─────────────────────────────────────────
     7. BOUTIQUE FILTERS (for boutique.html)
  ───────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programmeCards = document.querySelectorAll('[data-category]');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.filter;

        // Update active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show/hide cards
        programmeCards.forEach(card => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = '';
            setTimeout(() => card.classList.add('visible'), 10);
          } else {
            card.style.display = 'none';
            card.classList.remove('visible');
          }
        });
      });
    });
  }


  /* ─────────────────────────────────────────
     8. STRIPE CHECKOUT (for boutique.html)
     Replace 'price_xxx' with real Stripe Price IDs
  ───────────────────────────────────────── */
  const stripeButtons = document.querySelectorAll('[data-stripe-price]');

  if (stripeButtons.length) {
    // Stripe publishable key — replace with real key
    // const stripe = Stripe('pk_live_XXXXXXXXXXXXXX');

    stripeButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const priceId = btn.dataset.stripePrice;
        if (!priceId || priceId.startsWith('price_TODO')) {
          // Stripe not configured yet — show info
          alert('Paiement bientôt disponible ! Inscris-toi à la newsletter pour être notifié(e).');
          return;
        }

        btn.disabled = true;
        btn.textContent = 'Redirection...';

        try {
          // const { error } = await stripe.redirectToCheckout({
          //   lineItems: [{ price: priceId, quantity: 1 }],
          //   mode: 'payment',
          //   successUrl: window.location.origin + '/merci.html',
          //   cancelUrl: window.location.origin + '/boutique.html',
          // });
          // if (error) throw error;
        } catch (err) {
          console.error('Stripe error:', err);
          btn.disabled = false;
          btn.textContent = 'Obtenir le programme';
        }
      });
    });
  }


  /* ─────────────────────────────────────────
     9. ACTIVE NAV LINK based on current page
  ───────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });


  /* ─────────────────────────────────────────
     10. PARALLAX HERO (subtle)
  ───────────────────────────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    }, { passive: true });
  }

});
