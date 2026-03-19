/* ============================================================
   projects.js — ЕДИНЫЙ источник всех проектов
   /assets/js/projects.js
============================================================ */

const PROJECTS = [
  /* ── Behance ── */
  {
    id:       1,
    title:    "Behance\nProfile",
    category: "More on Behance",
    filter:   "behance",
    type:     "External",
    year:     "2024–25",
    desc:     "Explore more projects, experiments and works in progress on my Behance profile.",
    tags:     ["Behance", "Portfolio", "More Work"],
    listTags: ["Behance", "External"],
    href:     "https://www.behance.net/dimon_ais",
    bg:       "wbg-behance",
    external: true,
    featured: true,
  },
  {
    id:       2,
    title:    "Unnie Box\nLanding Page",
    category: "UI Web Design",
    filter:   "web",
    type:     "UI Design",
    year:     "2024",
    desc:     "Korean beauty subscription box landing page focused on trust, conversion, and delight.",
    tags:     ["Figma", "UI Kit", "Landing"],
    listTags: ["Web", "Landing"],
    href:     "portfolio/unnie-box.html",
    bg:       "wbg1",
    featured: true,
  },
  {
    id:       3,
    title:    "Avion\nFurniture Platform",
    category: "UI Web Design",
    filter:   "web",
    type:     "UI Design",
    year:     "2024",
    desc:     "A modern furniture ecommerce platform focused on clean UI and a premium shopping experience.",
    tags:     ["Figma", "UI Kit", "E-commerce"],
    listTags: ["Web", "E-commerce"],
    href:     "portfolio/avion.html",
    bg:       "wbg6",
    featured: true,
  },
  {
    id:       4,
    title:    "MSCHF\nPlatform",
    category: "UI Web Design",
    filter:   "web",
    type:     "UI Design",
    year:     "2024",
    desc:     "Full redesign concept for MSCHF — the internet's most chaotic drop-culture brand. Bold yellow/black editorial system.",
    tags:     ["Figma", "Drop Culture", "Brand System"],
    listTags: ["Web", "Brand"],
    href:     "portfolio/mschf.html",
    bg:       "wbg-mschf",
    featured: true,
  },
  {
    id:       5,
    title:    "CLM\nMafia Platform",
    category: "UI UX Redesign",
    filter:   "ui-ux",
    type:     "Case Study",
    year:     "2024",
    desc:     "Full redesign of Mafia platform with ratings, tournaments, clubs and admin panel.",
    tags:     ["Figma", "Design System", "Case Study"],
    listTags: ["UI UX", "Redesign"],
    href:     "portfolio/clm.html",
    bg:       "wbg7",
    featured: true,
  },
];


/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const pad = n => String(n).padStart(2, '0');

function cardHTML(p, i) {
  const num       = pad(i + 1);
  const titleHtml = p.title.replace('\n', '<br>');
  const tagsHtml  = p.tags.map(t => `<span>${t}</span>`).join('');

  /* Behance-карточка — особый bg с логотипом */
  const behanceInner = p.external ? `
      <div class="wcard-behance-inner">
        <svg class="wcard-behance-logo" viewBox="0 0 76 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Behance">
          <path d="M29.04 23.08C31.64 22.04 33.32 19.96 33.32 16.76C33.32 10.52 28.8 8.76 23.28 8.76H7.28V39.24H23.84C29.72 39.24 34.72 36.88 34.72 30.28C34.72 26.52 32.72 23.92 29.04 23.08ZM14.84 14.68H22.32C24.72 14.68 26.84 15.4 26.84 18.16C26.84 20.72 25.12 21.8 22.72 21.8H14.84V14.68ZM23.28 33.32H14.84V27.08H23.44C26.28 27.08 28.16 28.2 28.16 31.16C28.16 34.04 25.96 33.32 23.28 33.32ZM51.52 8C43.24 8 37.64 14.12 37.64 23.96C37.64 34.08 43 40 51.52 40C58.28 40 62.56 36.68 64.72 30.48H58.36C57.52 32.76 55.08 34.16 51.72 34.16C47.28 34.16 44.48 31.4 44.16 26.44H65.2C65.24 25.84 65.28 24.92 65.28 24C65.28 14.04 59.92 8 51.52 8ZM44.32 21.28C44.96 17.08 47.56 13.84 51.52 13.84C55.6 13.84 58 16.96 58.16 21.28H44.32ZM47.44 4.44H57.24V1.2H47.44V4.44Z" fill="currentColor"/>
        </svg>
        <span class="wcard-behance-cta">View all work ↗</span>
      </div>` : `
      <div class="wcard-mock">
        <div class="wmock-bar"><span></span><span></span><span></span></div>
        <div class="wmock-body">
          <div class="ml a"></div><div class="ml l"></div>
          <div class="ml m"></div><div class="ml s"></div>
        </div>
      </div>`;

  return `
  <article class="wcard${p.external ? ' wcard--external' : ''}" data-href="${p.href}" data-cat="${p.filter}" data-external="${p.external ? 'true' : 'false'}">
    <div class="wcard-bg ${p.bg}">
      ${behanceInner}
    </div>
    <div class="wcard-veil"></div>
    <div class="wcard-num">${num}</div>
    <footer class="wcard-foot">
      <div class="wcard-cat">${p.category}</div>
      <h3 class="wcard-title">${titleHtml}</h3>
    </footer>
    <div class="wcard-reveal">
      <p>${p.desc}</p>
      <div class="rtags">${tagsHtml}</div>
      <div class="rlink">${p.external ? 'Visit Behance' : 'Open case study'}
        <div class="rarrow">
          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M17 7H7M17 7v10"/>
          </svg>
        </div>
      </div>
    </div>
  </article>`;
}

function listItemHTML(p, i) {
  const num      = pad(i + 1);
  const listTags = p.listTags.map(t => `<span>${t}</span>`).join('');
  return `
  <a class="gl-item${p.external ? ' gl-item--external' : ''}" href="${p.href}" data-cat="${p.filter}"${p.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>
    <span class="gl-item-num">${num}</span>
    <div class="gl-item-info">
      <div class="gl-item-tags">${listTags}</div>
      <h3>${p.title.replace('\n', ' ')}</h3>
    </div>
    <span class="gl-item-type">${p.type}</span>
    <span class="gl-item-year">${p.year}</span>
    <div class="gl-item-arrow">
      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 17L17 7M17 7H7M17 7v10"/>
      </svg>
    </div>
  </a>`;
}

function bindCardClicks(container) {
  container.querySelectorAll('.wcard[data-href]').forEach(card => {
    card.addEventListener('click', () => {
      if (card.dataset.external === 'true') {
        window.open(card.dataset.href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = card.dataset.href;
      }
    });
  });
}


/* ─────────────────────────────────────────────────────────────
   ГЛАВНАЯ — #wTrack
───────────────────────────────────────────────────────────── */
function buildHomeCards() {
  const track   = document.getElementById('wTrack');
  const totalEl = document.getElementById('wTotal');
  if (!track) return;

  const items = PROJECTS.filter(p => p.featured);
  track.innerHTML = items.map((p, i) => cardHTML(p, i)).join('');
  if (totalEl) totalEl.textContent = pad(items.length);
  bindCardClicks(track);
}


/* ─────────────────────────────────────────────────────────────
   ГАЛЕРЕЯ — #glTrack + #glList
───────────────────────────────────────────────────────────── */
function buildGallery() {
  const track   = document.getElementById('glTrack');
  const list    = document.getElementById('glList');
  const countEl = document.getElementById('glCount');
  const heroN   = document.querySelector('.gl-count-n');
  if (!track && !list) return;

  if (track) {
    track.innerHTML = PROJECTS.map((p, i) => cardHTML(p, i)).join('');
    bindCardClicks(track);
  }
  if (list) {
    list.innerHTML = PROJECTS.map((p, i) => listItemHTML(p, i)).join('');
  }

  const total = PROJECTS.length;
  if (countEl) countEl.textContent = total;
  if (heroN)   heroN.textContent   = pad(total);

  /* ── Фильтры ── */
  document.querySelectorAll('.gl-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gl-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      if (track) {
        track.querySelectorAll('.wcard').forEach(card => {
          card.style.display = (filter === 'all' || card.dataset.cat === filter) ? '' : 'none';
        });
      }
      if (list) {
        list.querySelectorAll('.gl-item').forEach(item => {
          item.style.display = (filter === 'all' || item.dataset.cat === filter) ? '' : 'none';
        });
      }
      const visible = filter === 'all'
        ? PROJECTS.length
        : PROJECTS.filter(p => p.filter === filter).length;
      if (countEl) countEl.textContent = visible;
    });
  });
}


/* ─────────────────────────────────────────────────────────────
   ЗАПУСК
───────────────────────────────────────────────────────────── */
function initProjects() {
  buildHomeCards();
  buildGallery();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjects);
} else {
  initProjects();
}