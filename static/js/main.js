/* ============================================================
   MITHRAN R — Portfolio  |  main.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Theme ──────────────────────────────────────────────── */
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon  = document.getElementById('icon-sun');
  const moonIcon = document.getElementById('icon-moon');

  function applyTheme(dark) {
    html.setAttribute('data-theme', dark ? 'dark' : 'light');
    sunIcon.style.display  = dark ? 'none'  : 'block';
    moonIcon.style.display = dark ? 'block' : 'none';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark);

  themeToggle.addEventListener('click', () => {
    applyTheme(html.getAttribute('data-theme') !== 'dark');
  });

  /* ── Cursor dot ─────────────────────────────────────────── */
  const cursor = document.getElementById('cursor-dot');
  let cursorVisible = false;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    if (!cursorVisible) {
      cursor.style.opacity = '1';
      cursorVisible = true;
    }
  });
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; cursorVisible = false; });

  /* ── Navbar scroll / active ─────────────────────────────── */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a, #nav-drawer a');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile nav ─────────────────────────────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const navDrawer = document.getElementById('nav-drawer');

  navToggle.addEventListener('click', () => {
    const isOpen = navDrawer.classList.contains('open');
    navDrawer.classList.toggle('open', !isOpen);
    navToggle.classList.toggle('open', !isOpen);
  });

  // Close on link click
  document.querySelectorAll('#nav-drawer a').forEach(a => {
    a.addEventListener('click', () => {
      navDrawer.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });

  /* ── Smooth scroll for nav links ────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ── Scroll reveal ──────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => observer.observe(el));

  /* ── Contact form ───────────────────────────────────────── */
  const form       = document.getElementById('contact-form');
  const statusEl   = document.getElementById('form-status');
  const submitBtn  = document.getElementById('form-submit');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name    = form.querySelector('[name="name"]').value.trim();
      const email   = form.querySelector('[name="email"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();

      if (!name || !email || !message) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
        </svg>
        <span>Sending…</span>`;

      try {
        const res = await fetch('/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message }),
        });
        const data = await res.json();

        if (data.success) {
          showStatus(data.message, 'success');
          form.reset();
        } else {
          showStatus(data.error || 'Something went wrong.', 'error');
        }
      } catch {
        showStatus('Network error. Please try again.', 'error');
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg><span>Send Message</span>`;
    });
  }

  function showStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = `form-status ${type} show`;
    setTimeout(() => statusEl.classList.remove('show'), 5000);
  }

  /* ── Tilt on project cards ──────────────────────────────── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 3}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── Initial scroll check ───────────────────────────────── */
  onScroll();

})();
