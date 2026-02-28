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
  const bar = document.getElementById('progressBar');
  if (bar) {
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      bar.style.width = (window.scrollY / total * 100) + '%';
    }, { passive: true });
  }

  // reveal
  const ro = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('revealed');
      ro.unobserve(e.target);
    });
  }, { threshold: 0.07 });

  document.querySelectorAll('[data-reveal]').forEach((el) => ro.observe(el));

  // section active state (subnav + toc if exists)
  const tocLinks = document.querySelectorAll('.case-toc a');
  const subLinks = document.querySelectorAll('.subnav-pill a');

  if (tocLinks.length || subLinks.length) {
    const secObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        [...tocLinks, ...subLinks].forEach((l) => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.case-section[id]').forEach((s) => secObs.observe(s));
  }

  // lightbox (make available for onclick in HTML)
  window.openLightbox = function (src) {
    const full = (src.startsWith('/') || src.startsWith('http')) ? src : ('/images/clm/' + src);
    const img = document.getElementById('lightboxImg');
    const modal = document.getElementById('imgModal');
    if (!img || !modal) return;

    img.src = full;
    modal.classList.add('open');
    document.body.classList.add('no-scroll');
  };

  window.closeLightbox = function () {
    const modal = document.getElementById('imgModal');
    if (!modal) return;

    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeLightbox();
  });
})();