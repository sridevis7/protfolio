/* ==========================================================================
   SRIDEVI S — PORTFOLIO SCRIPT (pure JS, no external libraries)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 500);
  });
  // Fallback in case 'load' already fired or is delayed
  setTimeout(() => { if (loader) loader.classList.add('hidden'); }, 2500);

  /* ---------- Theme toggle (persisted) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleLabel = document.getElementById('themeToggleLabel');
  const body = document.body;

  function applyThemeLabel(){
    const isLight = body.getAttribute('data-theme') === 'light';
    if (themeToggleLabel) themeToggleLabel.textContent = isLight ? 'Dark Mode' : 'Light Mode';
  }

  try {
    const savedTheme = localStorage.getItem('sridevi-theme');
    if (savedTheme) body.setAttribute('data-theme', savedTheme);
  } catch (e) { /* localStorage unavailable — ignore */ }
  applyThemeLabel();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      body.setAttribute('data-theme', current);
      try { localStorage.setItem('sridevi-theme', current); } catch (e) { /* ignore */ }
      applyThemeLabel();
    });
  }

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById('scrollProgressBar');
  function updateProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }

  /* ---------- Navbar scroll state + active link ---------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');
  const backToTop = document.getElementById('backToTop');

  function onScroll(){
    updateProgress();
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 30);
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);

    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ---------- Typing animation ---------- */
  const roles = [
    'AI Full Stack Developer',
    'SEO Specialist',
    'Image & Video Editor',
    'Social Media Manager',
    'Digital Marketer',
    'AI Developer'
  ];
  const typedEl = document.getElementById('typedRole');
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop(){
    if (!typedEl) return;
    const word = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typedEl.textContent = word.slice(0, charIndex);
      if (charIndex === word.length) {
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 75);
  }
  typeLoop();

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal-up');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Particle background (plain canvas, no images) ---------- */
  const canvas = document.getElementById('particles');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;

    function resizeCanvas(){
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function initParticles(){
      const count = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6,
        gold: Math.random() > 0.82
      }));
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    function drawParticles(){
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold ? 'rgba(242,201,76,0.55)' : 'rgba(139,92,246,0.5)';
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139,92,246,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      if (!reduceMotion) requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  /* ---------- Certifications slider ---------- */
  const slider = document.getElementById('certSlider');
  const prevBtn = document.getElementById('certPrev');
  const nextBtn = document.getElementById('certNext');
  const dotsWrap = document.getElementById('certDots');

  if (slider && dotsWrap) {
    const cards = slider.querySelectorAll('.cert-card');

    cards.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => scrollToCard(i));
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('span');

    function scrollToCard(i){
      const card = cards[i];
      if (card) slider.scrollTo({ left: card.offsetLeft - 4, behavior: 'smooth' });
    }
    function getCardWidth(){ return cards.length ? cards[0].offsetWidth + 22 : 300; }

    if (prevBtn) prevBtn.addEventListener('click', () => slider.scrollBy({ left: -getCardWidth(), behavior: 'smooth' }));
    if (nextBtn) nextBtn.addEventListener('click', () => slider.scrollBy({ left: getCardWidth(), behavior: 'smooth' }));

    slider.addEventListener('scroll', () => {
      const idx = Math.round(slider.scrollLeft / getCardWidth());
      dots.forEach((d, i) => d.classList.toggle('active', i === Math.min(idx, dots.length - 1)));
    }, { passive: true });
  }

  /* ---------- Contact form (mailto — no external service required) ---------- */
  const form = document.getElementById('contactForm');
  const sendBtn = document.getElementById('sendBtn');
  const formStatus = document.getElementById('formStatus');
  const DESTINATION_EMAIL = 'sridevisris187@gmail.com';

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (formStatus) { formStatus.textContent = ''; formStatus.className = 'form-status'; }

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.textContent = 'Please fill in all fields before sending.';
          formStatus.classList.add('error');
        }
        return;
      }

      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      const mailtoUrl = `mailto:${DESTINATION_EMAIL}?subject=${subject}&body=${body}`;

      window.location.href = mailtoUrl;

      if (formStatus) {
        formStatus.textContent = 'Opening your email app to send this message...';
        formStatus.classList.add('success');
      }
      form.reset();
    });
  }

});
