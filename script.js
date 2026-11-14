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

  /* ── Theme toggle (head script sets the starting theme) ── */
  const themeBtn = document.getElementById('themeToggle');
  const themeMeta = document.querySelector('meta[name=theme-color]');
  const applyTheme = (t, save) => {
    document.documentElement.dataset.theme = t;
    themeMeta.content = t === 'dark' ? '#0b1120' : '#f8fafc';
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    if (save) { try { localStorage.setItem('theme', t); } catch (e) {} }
  };
  if (themeBtn) {
    applyTheme(document.documentElement.dataset.theme || 'light', false);
    themeBtn.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true));
    // Follow system changes until the visitor picks a theme themselves
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      let saved = null; try { saved = localStorage.getItem('theme'); } catch (err) {}
      if (!saved) applyTheme(e.matches ? 'dark' : 'light', false);
    });
  }

  /* ── Scroll reveal ── */ 
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const delay = Math.min(siblings.indexOf(entry.target), 4) * 60;
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
  const setMenu = open => {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.inert = !open;
  };
  hamburger.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
  document.querySelectorAll('.mob-link').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && mobileMenu.classList.contains('open')) { setMenu(false); hamburger.focus(); } });

  /* ── Smooth scroll (instant when the visitor prefers reduced motion) ── */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      const target = id === '#top' ? document.body : document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: id === '#top' ? 0 : target.offsetTop - 70, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    });
  });

  /* ── Projects: "closer look" pills switch the stage and the full story ── */
  const closer = document.querySelector('.closer');
  if (closer) {
    const items = [...closer.querySelectorAll('.closer-item')];
    const medias = [...closer.querySelectorAll('.closer-media')];
    const stories = [...document.querySelectorAll('.closer-story')];
    // i = -1 closes every pill; the stage keeps showing the last image
    const select = i => {
      if (i < 0) {
        items.forEach(item => { item.classList.remove('is-open'); item.querySelector('.closer-pill').setAttribute('aria-expanded', 'false'); });
        stories.forEach(st => { st.hidden = true; st.open = false; });
        return;
      }
      items.forEach((item, k) => {
        item.classList.toggle('is-open', k === i);
        item.querySelector('.closer-pill').setAttribute('aria-expanded', String(k === i));
      });
      medias.forEach((m, k) => m.classList.toggle('is-active', k === i));
      stories.forEach((st, k) => { st.hidden = k !== i; if (k !== i) st.open = false; });
    };
    items.forEach((item, i) => item.querySelector('.closer-pill').addEventListener('click', () => select(item.classList.contains('is-open') ? -1 : i)));
  }

  /* ── Tech stack tabs (arrow keys move between tabs) ── */
  const tabs = [...document.querySelectorAll('.stack-tab')];
  const showTab = (i, focus) => {
    tabs.forEach((t, k) => {
      t.setAttribute('aria-selected', String(k === i));
      t.tabIndex = k === i ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = k !== i;
    });
    if (focus) tabs[i].focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => showTab(i));
    t.addEventListener('keydown', e => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (step) { e.preventDefault(); showTab((i + step + tabs.length) % tabs.length, true); }
    });
  });
  if (tabs.length) showTab(0);

  /* ── Experience: expand / collapse all ── */
  const xpRows = [...document.querySelectorAll('.xp-row')];
  const xpButtons = [...document.querySelectorAll('.xp-all')];
  const syncXp = () => {
    const openCount = xpRows.filter(r => r.open).length;
    xpButtons.forEach(b => { b.disabled = b.dataset.open === 'true' ? openCount === xpRows.length : openCount === 0; });
  };
  xpButtons.forEach(b => b.addEventListener('click', () => { xpRows.forEach(r => { r.open = b.dataset.open === 'true'; }); syncXp(); }));
  xpRows.forEach(r => r.addEventListener('toggle', syncXp));
  syncXp();

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
