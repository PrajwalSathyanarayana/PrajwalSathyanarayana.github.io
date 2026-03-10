/* ═══════════════════════════════════════════════════
   PRAJWAL SATHYANARAYANA — PORTFOLIO SCRIPTS
════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Typed hero title ── */
  const phrases = [
    'Data Scientist',
    'ML Engineer',
    'AI Systems Builder',
    'LLM Workflow Designer',
    'AWS Data Engineer',
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  const typedEl = document.querySelector('.typed-text');

  function typeLoop() {
    const current = phrases[phraseIdx];
    if (deleting) {
      typedEl.textContent = current.slice(0, --charIdx);
    } else {
      typedEl.textContent = current.slice(0, ++charIdx);
    }

    let delay = deleting ? 50 : 90;
    if (!deleting && charIdx === current.length) {
      delay = 2000;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }
    setTimeout(typeLoop, delay);
  }
  if (typedEl) typeLoop();


  /* ── Scroll Reveal ── */
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const delay = siblings.indexOf(entry.target) * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Math.max(0, delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => observer.observe(el));


  /* ── Navbar scroll behavior ── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    // Scrolled class
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Active link
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();


  /* ── Mobile hamburger menu ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobLinks   = document.querySelectorAll('.mob-link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });


  /* ── Animated stat counters ── */
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.getAttribute('data-count');
        const duration = 1800;
        const step = Math.ceil(duration / target);
        let current = 0;
        const interval = setInterval(() => {
          current = Math.min(current + Math.ceil(target / 40), target);
          el.textContent = current;
          if (current >= target) clearInterval(interval);
        }, step);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => counterObserver.observe(el));


  /* ── Smooth scroll for all anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });


  /* ── Subtle parallax on hero name ── */
  const heroName = document.querySelector('.hero-name');
  const heroSub  = document.querySelector('.hero-sub');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (heroName) heroName.style.transform = `translateY(${y * 0.18}px)`;
    if (heroSub)  heroSub.style.transform  = `translateY(${y * 0.10}px)`;
  }, { passive: true });


  /* ── Orb mouse-tracking (subtle) ── */
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 30;
    my = (e.clientY / window.innerHeight - 0.5) * 30;
  });
  function animateOrbs() {
    if (orb1) orb1.style.transform = `translate(${mx * 0.5}px, ${my * 0.5}px)`;
    if (orb2) orb2.style.transform = `translate(${-mx * 0.3}px, ${-my * 0.3}px)`;
    requestAnimationFrame(animateOrbs);
  }
  animateOrbs();


  /* ── Nav logo click → top ── */
  document.querySelector('.nav-logo')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ── Timeline card hover glow ── */
  document.querySelectorAll('.tl-card, .project-card, .skill-card, .edu-card, .pub-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(240,165,0,0.05) 0%, var(--surface) 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

});
