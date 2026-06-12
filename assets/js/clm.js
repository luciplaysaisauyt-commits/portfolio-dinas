/* clm.js — page-specific script for CLM case study */
document.addEventListener('DOMContentLoaded', function () {

  var nav = document.getElementById('topnav');

  /* ── nav height CSS var ── */
  if (nav) {
    var setNavH = function () {
      document.documentElement.style.setProperty('--navH', nav.offsetHeight + 'px');
    };
    setNavH();
    window.addEventListener('resize', setNavH, { passive: true });
  }

  /* ── progress bar ── */
  var bar = document.getElementById('progressBar');
  if (bar) {
    window.addEventListener('scroll', function () {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      bar.style.width = (window.scrollY / total * 100) + '%';
    }, { passive: true });
  }

  /* ── scroll reveal ── */
  var ro = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('revealed');
      ro.unobserve(e.target);
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('[data-reveal]').forEach(function (el) { ro.observe(el); });

  /* ── subnav ── */
  setTimeout(function () {

    var subnav   = document.querySelector('[data-case-subnav]');
    var links    = Array.from(document.querySelectorAll('.case-subnav-pill a[href^="#"]'));
    var sections = Array.from(document.querySelectorAll('.case-section[id]'));

    if (!subnav || !links.length || !sections.length) return;

    var pill = subnav.querySelector('.case-subnav-pill');
    if (pill) {
      pill.style.overflowX               = 'auto';
      pill.style.scrollBehavior          = 'smooth';
      pill.style.webkitOverflowScrolling  = 'touch';
      pill.style.scrollbarWidth          = 'none';
    }

    function getOffset() {
      var navH = nav ? nav.offsetHeight : 64;
      var subH = subnav.offsetHeight   || 52;
      return navH + subH + 32;
    }

    function updateActive() {
      var offset  = getOffset();
      var scrollY = window.scrollY;
      var current = sections[0].id;

      sections.forEach(function (sec) {
        var top = sec.getBoundingClientRect().top + scrollY - offset;
        if (scrollY >= top) current = sec.id;
      });

      links.forEach(function (l) {
        var isActive = l.getAttribute('href') === '#' + current;
        l.classList.toggle('active', isActive);
        if (isActive && pill) {
          l.scrollIntoView({ inline: 'nearest', block: 'nearest' });
        }
      });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();

    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - getOffset(),
          behavior: 'smooth'
        });
      });
    });

  }, 100);

});