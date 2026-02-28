/* ============================================================
   MAIN.JS — shared across all pages
   ============================================================ */
(() => {

  const isTouch = (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  // ── PAGE ENTER ANIMATION HOOK ──
  // adds a class after full load so pages can fade in smoothly
  window.addEventListener('load', () => {
    document.body.classList.add('is-loaded');
  });

  // ── MOBILE MENU ──
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose= document.getElementById('mobileClose');

  if (burger && mobileMenu)
    burger.addEventListener('click', () => mobileMenu.classList.add('open'));
  if (mobileClose && mobileMenu)
    mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
  if (mobileMenu)
    mobileMenu.addEventListener('click', e => {
      if (e.target === mobileMenu) mobileMenu.classList.remove('open');
    });

  // ── NAV SHRINK ON SCROLL ──
  const nav = document.getElementById('topnav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();
  }

  // ── CONTACT FORM POPUP ──
  const form       = document.getElementById('contactForm');
  const popup      = document.getElementById('popup');
  const popupClose = document.getElementById('popupClose');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (popup) popup.classList.add('show');
      form.reset();
    });
  }
  if (popupClose && popup) {
    popupClose.addEventListener('click', () => popup.classList.remove('show'));
    popup.addEventListener('click', e => {
      if (e.target === popup) popup.classList.remove('show');
    });
  }

  // ── NEWSLETTER ──
  const nlForm  = document.getElementById('newsletterForm');
  const nlEmail = document.getElementById('newsletterEmail');
  if (nlForm) {
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      if (nlEmail) nlEmail.value = '';
    });
  }

  // ── SCROLL-TO-TOP ──
  const scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── FADE-UP (.fu -> .vis) ──
  const fuEls = document.querySelectorAll('.fu');
  if (fuEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    fuEls.forEach(el => io.observe(el));
  }

  // ── FADE-UP (.fade-up -> .visible) ──
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const io2 = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io2.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => io2.observe(el));
  }

  // ── COUNTER ANIMATION ──
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const dur    = 1800;
    const start  = performance.now();
    const isFloat= target % 1 !== 0;
    function tick(now) {
      const p   = Math.min((now - start) / dur, 1);
      const val = (1 - Math.pow(1 - p, 3)) * target;
      el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const counterEls = document.querySelectorAll('[data-target]');
  if (counterEls.length) {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCounter(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => cio.observe(el));
  }

  // ── CUSTOM CURSOR ──
  const cursor     = document.getElementById('dinCursor');
  const cursorRing = document.getElementById('dinCursorRing');
  if (cursor && cursorRing && !isTouch) {
    let mx = -200, my = -200, rx = -200, ry = -200;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });
    (function animRing() {
      rx += (mx - rx) * 0.09;
      ry += (my - ry) * 0.09;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();
  }


  /* ============================================================
   CASE SUBNAV UNIVERSAL
   Works on any page that has:
   1 header with id="topnav"
   2 subnav wrapper with data-case-subnav
   3 sections with class="case-section" and id
   ============================================================ */

(() => {
  const nav = document.getElementById("topnav");

  const setNavH = () => {
    if (!nav) return;
    document.documentElement.style.setProperty("--navH", nav.offsetHeight + "px");
  };

  setNavH();
  window.addEventListener("resize", setNavH);

  const subnav = document.querySelector("[data-case-subnav]");
  if (!subnav) return;

  document.body.classList.add("has-case-subnav");

  const setSubnavH = () => {
    document.documentElement.style.setProperty("--caseSubnavH", subnav.offsetHeight + "px");
  };

  setSubnavH();
  window.addEventListener("resize", setSubnavH);

  const subLinks = subnav.querySelectorAll("a[href^='#']");
  const sections = document.querySelectorAll(".case-section[id]");

  if (subLinks.length && sections.length) {
    const secObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        subLinks.forEach((l) => {
          l.classList.toggle("active", l.getAttribute("href") === "#" + id);
        });
      });
    }, { threshold: 0.2 });

    sections.forEach((s) => secObs.observe(s));
  }

  subLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--navH")) || 0;
      const subH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--caseSubnavH")) || 0;

      const offset = navH + subH + 24;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });
})();
window.caseSubscribe = function(form){
  const input = form.querySelector('input[type="email"]')
  const btn = form.querySelector('button[type="submit"]')

  if (!input || !btn) return

  if (!input.value || !input.value.includes('@')) {
    input.style.borderColor = 'rgba(255,80,80,0.7)'
    setTimeout(() => { input.style.borderColor = '' }, 1500)
    return
  }

  input.value = ''
  const orig = btn.textContent
  btn.textContent = 'Done ✓'
  btn.style.background = 'rgba(34,197,94,0.95)'
  btn.style.borderColor = 'rgba(34,197,94,0.95)'

  setTimeout(() => {
    btn.textContent = orig
    btn.style.background = ''
    btn.style.borderColor = ''
  }, 2500)
}
})();


