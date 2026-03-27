/* ═══════════════════════════════════════════════════════════════
   Musubu — Shared JS
   Loaded at the end of <body> on every page.
═══════════════════════════════════════════════════════════════ */

/* ─── Loading Screen ────────────────────────────────────────── */
(function () {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;
  function dismiss() {
    screen.classList.add('hidden');
    setTimeout(() => { if (screen.parentNode) screen.remove(); }, 700);
  }
  if (document.readyState === 'complete') {
    setTimeout(dismiss, 300);
  } else {
    window.addEventListener('load', () => setTimeout(dismiss, 300));
  }
})();

/* ─── Page Transition Overlay ───────────────────────────────── */
(function () {
  const overlay = document.createElement('div');
  overlay.id = 'page-overlay';
  document.body.prepend(overlay);

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || href.startsWith('tel') ||
        link.target === '_blank') return;

    e.preventDefault();
    overlay.classList.add('active');
    setTimeout(() => { window.location.href = href; }, 420);
  });

  /* Fade out overlay on back/forward navigation */
  window.addEventListener('pageshow', () => overlay.classList.remove('active'));
})();

/* ─── Scroll Progress Bar ───────────────────────────────────── */
(function () {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ─── Back to Top ───────────────────────────────────────────── */
(function () {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ─── Cursor Trail ──────────────────────────────────────────── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const COUNT = 12;
  const sizes = [9, 8, 7, 6, 5, 5, 4, 4, 3, 3, 2, 2];
  const dots  = sizes.map((s) => {
    const el = document.createElement('div');
    el.className = 'cursor-dot';
    el.style.cssText = `width:${s}px;height:${s}px;opacity:0;`;
    document.body.appendChild(el);
    return { el, x: -200, y: -200 };
  });

  let mx = -200, my = -200;
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function lerp(a, b, t) { return a + (b - a) * t; }

  let last = 0;
  function frame(ts) {
    if (ts - last > 14) {
      dots[0].x = mx; dots[0].y = my;
      for (let i = 1; i < COUNT; i++) {
        dots[i].x = lerp(dots[i].x, dots[i - 1].x, 0.5);
        dots[i].y = lerp(dots[i].y, dots[i - 1].y, 0.5);
      }
      dots.forEach((d, i) => {
        d.el.style.left    = d.x + 'px';
        d.el.style.top     = d.y + 'px';
        d.el.style.opacity = String((1 - i / COUNT) * 0.7);
      });
      last = ts;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* ─── Scroll Reveal ─────────────────────────────────────────── */
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
})();
