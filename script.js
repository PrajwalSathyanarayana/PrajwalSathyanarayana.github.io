/* ── Analytics (GoatCounter: no cookies, no personal data) ──
   Paste your site code, e.g. 'prajwal' for https://prajwal.goatcounter.com.
   Empty = nothing is loaded or sent. */
const GOATCOUNTER_CODE = 'prajwalsathyanarayana';

if (GOATCOUNTER_CODE && !/^(localhost|127\.|file:)/.test(location.hostname || location.protocol)) {
  const gc = document.createElement('script');
  gc.async = true;
  gc.src = 'https://gc.zgo.at/count.js';
  gc.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
  document.head.appendChild(gc);
}

document.addEventListener('DOMContentLoaded', () => {

  /* ── Count outbound clicks as analytics events (no-op without GoatCounter) ── */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="http"]');
    if (!a || !window.goatcounter || !window.goatcounter.count) return;
    const url = new URL(a.href);
    window.goatcounter.count({ path: 'out: ' + url.hostname + url.pathname, title: a.textContent.trim().slice(0, 60), event: true });
  });

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
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) { e.preventDefault(); window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' }); }
    });
  });

  /* ── Projects horizontal scroll arrows ── */
  document.querySelectorAll('.projects-scroller').forEach(scroller => {
    const projList = scroller.querySelector('.projects-list');
    const projLeft = scroller.querySelector('.proj-arrow-left');
    const projRight = scroller.querySelector('.proj-arrow-right');
    if (!projList || !projLeft || !projRight) return;
    const scrollAmount = () => projList.clientWidth;
    projLeft.addEventListener('click', () => projList.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    projRight.addEventListener('click', () => projList.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
    const updateArrows = () => {
      const maxScroll = projList.scrollWidth - projList.clientWidth;
      projLeft.disabled = projList.scrollLeft <= 0;
      projRight.disabled = projList.scrollLeft >= maxScroll - 1;
    };
    // Featured slider: size the track to the visible slide, not the tallest one
    const fitHeight = () => {
      if (!scroller.classList.contains('feature-scroller')) return;
      const i = Math.round(projList.scrollLeft / projList.clientWidth);
      const slide = projList.children[Math.min(i, projList.children.length - 1)];
      if (slide) projList.style.height = (slide.offsetHeight + 8) + 'px';
    };
    // Featured slider: every card matches the first card's height; longer ones clamp behind "…More"
    const slides = [...projList.querySelectorAll('.project-feature')];
    slides.slice(1).forEach(slide => {
      const story = slide.querySelector('.feature-story');
      if (!story) return;
      const more = document.createElement('button');
      more.type = 'button';
      more.className = 'feature-more';
      more.textContent = '…More';
      more.addEventListener('click', () => {
        const open = slide.classList.toggle('is-expanded');
        more.textContent = open ? 'Less' : '…More';
        sizeSlides();
        if (!open) slide.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
      story.after(more);
    });
    const sizeSlides = () => {
      if (!slides.length) return;
      slides.forEach(s => { s.classList.remove('is-clamped', 'has-more'); s.style.height = ''; s.style.minHeight = ''; });
      const ref = slides[0].offsetHeight;
      slides.slice(1).forEach(s => {
        s.classList.toggle('has-more', s.offsetHeight > ref + 1);
        if (s.classList.contains('is-expanded')) return;
        s.style.minHeight = ref + 'px';
        if (s.classList.contains('has-more')) {
          s.classList.add('is-clamped');
          s.style.height = ref + 'px';
        }
      });
      fitHeight();
    };

    projList.addEventListener('scroll', () => { updateArrows(); fitHeight(); }, { passive: true });
    window.addEventListener('resize', () => { updateArrows(); sizeSlides(); });
    window.addEventListener('load', sizeSlides);
    updateArrows();
    sizeSlides();
  });

  /* ── Bento "Details" links jump to the matching featured slide ── */
  document.querySelectorAll('[data-slide]').forEach(link => {
    link.addEventListener('click', () => {
      const list = document.querySelector('.feature-list');
      const slide = list && list.children[Number(link.dataset.slide)];
      if (slide) list.scrollTo({ left: slide.offsetLeft - list.offsetLeft, behavior: 'smooth' });
    });
  });

  /* ── Lightbox for diagrams (plain link to the image without JS) ── */
  let lightbox;
  document.querySelectorAll('a[data-lightbox]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      if (!lightbox) {
        lightbox = document.createElement('dialog');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = '<img alt=""><button type="button" class="lightbox-close" aria-label="Close">&times;</button>';
        lightbox.addEventListener('click', ev => {
          if (ev.target === lightbox || ev.target.classList.contains('lightbox-close')) lightbox.close();
        });
        document.body.appendChild(lightbox);
      }
      const img = lightbox.querySelector('img');
      const thumb = link.querySelector('img');
      img.src = link.href;
      img.alt = thumb ? thumb.alt : '';
      lightbox.showModal();
    });
  });

});
