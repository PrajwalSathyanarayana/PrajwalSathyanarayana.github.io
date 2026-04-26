document.addEventListener('DOMContentLoaded', () => {

  /* ── Typed hero subtitle ── */
  const phrases = [
    'AI Engineer',
    'LLM Systems Builder',
    'Agentic Workflow Designer',
    'ML Engineer',
    'AWS AI Engineer',
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  const typedEl = document.querySelector('.typed-text');
  function typeLoop() {
    const current = phrases[phraseIdx];
    typedEl.textContent = deleting
      ? current.slice(0, --charIdx)
      : current.slice(0, ++charIdx);
    let delay = deleting ? 45 : 85;
    if (!deleting && charIdx === current.length) { delay = 2200; deleting = true; }
    else if (deleting && charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; delay = 350; }
    setTimeout(typeLoop, delay);
  }
  if (typedEl) typeLoop();

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const delay = siblings.indexOf(entry.target) * 70;
        setTimeout(() => entry.target.classList.add('visible'), Math.max(0, delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ── Navbar scroll ── */
  const navbar  = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    let current = '';
    sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 110) current = sec.id; });
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  }, { passive: true });

  /* ── Mobile menu ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]:not(.masked-contact)').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) { e.preventDefault(); window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' }); }
    });
  });

  /* ── Click-to-reveal masked contacts ── */
  document.querySelectorAll('.masked-contact').forEach(el => {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      if (this.dataset.revealed === 'true') {
        const type = this.dataset.type;
        const val  = this.dataset.value;
        if (type === 'email') window.location.href = 'mailto:' + val;
        else if (type === 'tel') window.location.href = 'tel:' + val.replace(/-/g, '');
        return;
      }
      this.dataset.revealed = 'true';
      this.classList.add('revealed');
      this.textContent = this.dataset.value;
      if (this.dataset.href) this.href = this.dataset.href;
      this.title = 'Click to open';
    });
  });

  /* ── Subtle parallax on hero name ── */
  const heroName = document.querySelector('.hero-name');
  window.addEventListener('scroll', () => {
    if (heroName) heroName.style.transform = `translateY(${window.scrollY * 0.12}px)`;
  }, { passive: true });

});
