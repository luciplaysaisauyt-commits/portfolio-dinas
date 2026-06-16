/* ============================================================
   unniebox.js — исправленная версия
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Progress bar ── */
  const progressBar = document.getElementById('progressBar') || document.getElementById('ubProgress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) progressBar.style.width = (window.scrollY / total * 100) + '%';
    }, { passive: true });
  }

  /* ── Reveal on scroll ── */
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); revObs.unobserve(e.target); }
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('[data-reveal]').forEach(el => revObs.observe(el));

  /* ── Subnav active highlight ── */
  const subnavLinks = document.querySelectorAll('.case-subnav-link, .case-subnav-pill a');
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      subnavLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
    });
  }, { threshold: 0.22 });
  document.querySelectorAll('.case-section[id]').forEach(s => secObs.observe(s));

  /* ── Lightbox ── */
  const modal    = document.getElementById('imgModal');
  const modalImg = document.getElementById('imgModalSrc');

  function openModal(src) {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.body.classList.remove('no-scroll');
    setTimeout(() => { if (modalImg) modalImg.src = ''; }, 250);
  }

  document.querySelectorAll([
    '.hero-img-wrap',
    '.screen-card',
    '.ba-card',
    '.uikit-card',
    '.ub-product-card img',
    '.ub-screen-card img',
    '.case-img img',
    '.landing-card img',
    '.modal-card img',
    '.fp-card img'
  ].join(', ')).forEach(el => {
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', () => {
      const img = el.tagName === 'IMG' ? el : el.querySelector('img');
      if (img) openModal(img.currentSrc || img.src);
    });
  });

  document.getElementById('expandFull')?.addEventListener('click', () => {
    const btn = document.getElementById('expandFull');
    const src = btn.dataset.src || '/assets/images/unniebox/main%20page.png';
    openModal(src);
  });

  modal?.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  window.openModal  = openModal;
  window.closeModal = closeModal;

  /* ── Mobile menu ── */
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mClose     = document.getElementById('mobileClose');

  burger?.addEventListener('click', () => {
    mobileMenu?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const closeMobileMenu = () => {
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
  };

  mClose?.addEventListener('click', closeMobileMenu);
  mobileMenu?.addEventListener('click', e => { if (e.target === mobileMenu) closeMobileMenu(); });

  /* ── UX Flow tabs ── */
  const uxTabs   = document.querySelectorAll('.uxflow-tab');
  const uxPanels = document.querySelectorAll('.uxflow-panel');

  if (uxTabs.length && uxPanels.length) {
    uxTabs.forEach(tab => {
      tab.addEventListener('click', e => {
        e.preventDefault();
        const target = tab.dataset.tab;
        uxTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        uxPanels.forEach(panel => {
          const hide = panel.id !== `tab-${target}`;
          panel.classList.toggle('uxflow-panel--hidden', hide);
          if (!hide) {
            panel.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => el.classList.add('revealed'));
          }
        });
      });
    });
  }

  /* ── Charts — запускаем только если Canvas элементы существуют ── */
  if (!document.getElementById('rpAreaChart')) return;

  /* Ждём Chart.js если он ещё не загрузился */
  function initCharts() {
    if (typeof Chart === 'undefined') {
      setTimeout(initCharts, 100);
      return;
    }

    const blue      = '#0b6dff';
    const blue2     = '#4aa2ff';
    const gridColor = 'rgba(255,255,255,0.06)';
    const tickColor = 'rgba(139,156,182,0.9)';

    const base = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend:  { display: false },
        tooltip: { displayColors: false }
      }
    };

    /* Area chart — Market Growth */
    const areaEl = document.getElementById('rpAreaChart');
    if (areaEl) {
      new Chart(areaEl, {
        type: 'line',
        data: {
          labels: ['2022','2023','2024','2025','2026','2027','2028','2029','2030'],
          datasets: [{
            data: [0.72, 0.85, 1.11, 1.31, 1.54, 1.82, 2.15, 2.54, 2.99],
            borderColor: blue,
            borderWidth: 2,
            backgroundColor: 'rgba(11,109,255,0.12)',
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: blue
          }]
        },
        options: {
          ...base,
          scales: {
            x: { ticks: { color: tickColor, font: { size: 10 } }, grid: { color: gridColor } },
            y: { ticks: { color: tickColor, font: { size: 10 }, callback: v => '$' + v + 'B' }, grid: { color: gridColor } }
          }
        }
      });
    }

    /* Doughnut — Purchase Factors */
    const pieEl = document.getElementById('rpPieChart');
    if (pieEl) {
      new Chart(pieEl, {
        type: 'doughnut',
        data: {
          labels: ['Price', 'Clean ingr.', 'Personalized', 'Quality'],
          datasets: [{
            data: [63, 56, 64, 53],
            backgroundColor: [blue, '#4aa2ff', '#22c55e', '#e8c15a'],
            borderWidth: 0
          }]
        },
        options: { ...base, cutout: '62%' }
      });
    }

    /* Doughnut — Discovery */
    const donutEl = document.getElementById('rpDonutChart');
    if (donutEl) {
      new Chart(donutEl, {
        type: 'doughnut',
        data: {
          labels: ['Word of mouth', 'TikTok / Social', 'Search', 'Other'],
          datasets: [{
            data: [38, 31, 18, 13],
            backgroundColor: [blue, '#4aa2ff', '#e8c15a', 'rgba(255,255,255,0.2)'],
            borderWidth: 0
          }]
        },
        options: { ...base, cutout: '62%' }
      });
    }

    /* Bar — Conversion Uplift */
    const barEl = document.getElementById('rpBarChart');
    if (barEl) {
      new Chart(barEl, {
        type: 'bar',
        data: {
          labels: ['UX Design', 'Social Proof', 'Testimonials', 'Free Gift', 'Personalization'],
          datasets: [{
            data: [400, 270, 38, 27, 28],
            backgroundColor: [
              blue,
              blue2,
              'rgba(11,109,255,0.5)',
              'rgba(11,109,255,0.4)',
              'rgba(11,109,255,0.4)'
            ],
            borderRadius: 6,
            borderSkipped: false
          }]
        },
        options: {
          ...base,
          scales: {
            x: { ticks: { color: tickColor, font: { size: 10 } }, grid: { display: false } },
            y: { ticks: { color: tickColor, font: { size: 10 }, callback: v => v + '%' }, grid: { color: gridColor } }
          }
        }
      });
    }

    /* Horizontal bar — CTA */
    const ctaEl = document.getElementById('rpCTAChart');
    if (ctaEl) {
      new Chart(ctaEl, {
        type: 'bar',
        data: {
          labels: ['Single CTA', 'Multi-CTA'],
          datasets: [{
            data: [13.5, 10.5],
            backgroundColor: [blue, 'rgba(11,109,255,0.35)'],
            borderRadius: 6,
            borderSkipped: false
          }]
        },
        options: {
          ...base,
          indexAxis: 'y',
          scales: {
            x: { ticks: { color: tickColor, font: { size: 10 }, callback: v => v + '%' }, grid: { color: gridColor }, max: 18 },
            y: { ticks: { color: tickColor, font: { size: 10 } }, grid: { display: false } }
          }
        }
      });
    }
  }

  initCharts();

}); /* end DOMContentLoaded */