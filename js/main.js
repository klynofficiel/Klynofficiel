/* ═══════════════════════════════════
   KLYN — main.js
═══════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* Navbar scroll */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* Burger menu */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      burger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* Fade-in / fade-up observer */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const cls = e.target.classList.contains('fade-in') ? '.fade-in:not(.visible)' : '.fade-up:not(.visible)';
        const siblings = Array.from(e.target.parentElement.querySelectorAll(cls));
        const delay = Math.min(siblings.indexOf(e.target) * 80, 400);
        setTimeout(() => e.target.classList.add('visible'), delay);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.fade-in, .fade-up').forEach(el => observer.observe(el));

  /* Smooth anchor scroll */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = (navbar?.offsetHeight || 70) + 20;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  /* Active nav link */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href').split('/').pop() === page);
  });

  /* Hero parallax */
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroImg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
      }
    }, { passive: true });
  }

});

/* App waitlist form */
function handleAppWaitlist() {
  const input = document.getElementById('appEmail');
  if (!input || !input.value.includes('@')) {
    input?.focus();
    return;
  }
  const btn = input.nextElementSibling;
  btn.textContent = '✓ Inscrit(e) !';
  btn.style.background = '#4caf50';
  input.value = '';
  setTimeout(() => {
    btn.textContent = 'Rejoindre la liste →';
    btn.style.background = '';
  }, 3000);
}
