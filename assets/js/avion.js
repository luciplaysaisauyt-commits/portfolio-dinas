// Progress bar
const prog = document.getElementById('psProgress');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  prog.style.width = (window.scrollY / total * 100) + '%';
}, { passive: true });

// Reveal on scroll
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('revealed'); revObs.unobserve(e.target); }
  });
}, { threshold: 0.07 });
document.querySelectorAll('[data-reveal]').forEach(el => revObs.observe(el));

// Subnav active state — scroll-based (надёжнее чем IntersectionObserver на длинных секциях)
const subnavLinks = document.querySelectorAll('.case-subnav-pill a');
const sections = Array.from(document.querySelectorAll('.case-section[id]'));

function updateSubnav() {
  const scrollY = window.scrollY;
  const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--navH')) || 64;
  const subnavH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--subnavH')) || 52;
  const offset = navH + subnavH + 32;

  let current = sections[0]?.id || '';
  sections.forEach(sec => {
    if (sec.getBoundingClientRect().top + scrollY - offset <= scrollY) {
      current = sec.id;
    }
  });

  subnavLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', updateSubnav, { passive: true });
updateSubnav(); // запуск при загрузке

// Modal
const modal = document.getElementById('imgModal');
const modalImg = document.getElementById('imgModalSrc');
const openModal = (src) => {
  if (!modal || !modalImg) return;
  modalImg.src = src;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
};
const closeModal = () => {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
};
document.querySelectorAll('.pf img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => openModal(img.src));
});
modal?.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Burger / mobile menu
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
burger?.addEventListener('click', () => mobileMenu.classList.add('open'));
mobileClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));
mobileMenu?.addEventListener('click', (e) => { if (e.target === mobileMenu) mobileMenu.classList.remove('open'); });

// Custom cursor
const cursor = document.getElementById('dinCursor');
const ring = document.getElementById('dinCursorRing');
if (cursor && ring) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    ring.style.left   = e.clientX + 'px';
    ring.style.top    = e.clientY + 'px';
  });
}