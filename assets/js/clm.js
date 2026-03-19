// nav height CSS var
const nav = document.getElementById('topnav');
if (nav) {
  const setNavH = () => {
    document.documentElement.style.setProperty('--navH', nav.offsetHeight + 'px');
  };
  setNavH();
  window.addEventListener('resize', setNavH);
}

(() => {
  // progress bar
  const bar = document.getElementById('progressBar') || document.getElementById('psProgress');
  if (bar) {
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      bar.style.width = (window.scrollY / total * 100) + '%';
    }, { passive: true });
  }

  // scroll reveal
  const ro = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('revealed');
      ro.unobserve(e.target);
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('[data-reveal]').forEach((el) => ro.observe(el));

  // subnav + toc active state — scroll-based (работает на длинных секциях)
  const tocLinks = document.querySelectorAll('.case-toc a');
  const subLinks = document.querySelectorAll('.subnav-pill a, .case-subnav-pill a');
  const allNavLinks = [...tocLinks, ...subLinks];
  const sections = Array.from(document.querySelectorAll('.case-section[id]'));

  if (allNavLinks.length && sections.length) {
    function updateActiveNav() {
      const navH = nav ? nav.offsetHeight : 64;
      const subnavEl = document.querySelector('.case-subnav');
      const subnavH = subnavEl ? subnavEl.offsetHeight : 52;
      const offset = navH + subnavH + 24;

      let current = sections[0].id;
      sections.forEach((sec) => {
        const top = sec.getBoundingClientRect().top + window.scrollY - offset;
        if (window.scrollY >= top) current = sec.id;
      });

      allNavLinks.forEach((l) => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + current);
      });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
  }

  // lightbox
  const modal = document.getElementById('imgModal');
  const modalImg = document.getElementById('imgModalSrc');

  if (modal && modalImg) {
    const closeModal = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    };

    // все изображения в .pf контейнерах + screen-card, ba-card, hero-img-wrap
    document.querySelectorAll('.pf img, .screen-card img, .ba-card img, .hero-img-wrap img, .uikit-img img').forEach((img) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        modalImg.src = img.src;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
      });
    });

    modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }

  // legacy support for onclick="openLightbox(...)" in HTML
  window.openLightbox = function (src) {
    const full = (src.startsWith('/') || src.startsWith('http')) ? src : '/images/clm/' + src;
    if (modalImg && modal) {
      modalImg.src = full;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    }
  };

})();