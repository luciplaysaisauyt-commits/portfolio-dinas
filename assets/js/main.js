/* ============================================================
   MAIN.JS — v3
   Fixes: header position, music continuity, performance
   ============================================================ */

/* ──────────────────────────────────────────────────────────
   MUSIC — инициализируем ПЕРВЫМ, до всего остального
   Чтобы звук не прерывался при навигации
   ────────────────────────────────────────────────────────── */
(() => {
  const musicBtn = document.getElementById('musicBtn');
  const bgMusic  = document.getElementById('bgMusic');
  if (!musicBtn || !bgMusic) return;

  const NS = 'bgmusic';
  const LS = {
    get(k, fb = null) {
      try { const v = localStorage.getItem(`${NS}:${k}`); return v ?? fb; } catch { return fb; }
    },
    set(k, v) { try { localStorage.setItem(`${NS}:${k}`, String(v)); } catch {} }
  };

  const playlist = [
    {
      title: 'Piano I',
      sources: [
        '/assets/music/videoplayback_2.flac',
        '/assets/music/videoplayback_1.m4a',
        '/assets/music/videoplayback_1.mp3'
      ]
    }
  ];

  let currentTrack = Math.max(0, Math.min(parseInt(LS.get('trackIndex', '0'), 10) || 0, playlist.length - 1));
  const savedTime  = parseFloat(LS.get('time', '0')) || 0;
  const wasPlaying = LS.get('playing', 'false') === 'true';

  const TARGET_VOL = 0.12;
  bgMusic.volume   = 0;
  bgMusic.preload  = 'metadata';

  function setTrack(index) {
    index = (index + playlist.length) % playlist.length;
    currentTrack = index;
    bgMusic.pause();
    bgMusic.removeAttribute('src');
    while (bgMusic.firstChild) bgMusic.removeChild(bgMusic.firstChild);
    playlist[index].sources.forEach(src => {
      const s = document.createElement('source');
      s.src = src;
      if (src.endsWith('.flac')) s.type = 'audio/flac';
      if (src.endsWith('.m4a'))  s.type = 'audio/mp4';
      if (src.endsWith('.mp3'))  s.type = 'audio/mpeg';
      bgMusic.appendChild(s);
    });
    LS.set('trackIndex', index);
    LS.set('time', 0);
    try { bgMusic.load(); } catch {}
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: playlist[index].title || 'Music' });
    }
  }

  function fadeTo(target, ms = 250) {
    return new Promise(resolve => {
      const start = performance.now(), from = bgMusic.volume, diff = target - from;
      (function step(t) {
        const p = Math.min(1, (t - start) / ms);
        bgMusic.volume = from + diff * p;
        p < 1 ? requestAnimationFrame(step) : (bgMusic.volume = target, resolve());
      })(performance.now());
    });
  }

  function updateBtn(playing) {
    musicBtn.textContent = playing ? '🔊' : '🎵';
    musicBtn.classList.toggle('playing', playing);
    musicBtn.setAttribute('aria-pressed', String(playing));
  }

  async function safePlay() {
    try {
      await bgMusic.play();
      await fadeTo(TARGET_VOL);
      updateBtn(true);
      LS.set('playing', true);
      return true;
    } catch {
      updateBtn(false);
      LS.set('playing', false);
      return false;
    }
  }

  // Восстанавливаем позицию после загрузки метаданных
  bgMusic.addEventListener('loadedmetadata', () => {
    if (savedTime > 0 && savedTime < (bgMusic.duration || Infinity)) {
      bgMusic.currentTime = savedTime;
    }
  }, { once: true });

  // Автоплей если был включён на предыдущей странице
  bgMusic.addEventListener('canplay', async () => {
    if (wasPlaying) await safePlay();
    else updateBtn(false);
  }, { once: true });

  // Сохраняем позицию каждую секунду
  let lastSave = 0;
  bgMusic.addEventListener('timeupdate', () => {
    const now = performance.now();
    if (now - lastSave > 900 && !bgMusic.paused) {
      LS.set('time', bgMusic.currentTime);
      LS.set('trackIndex', currentTrack);
      lastSave = now;
    }
  });

  bgMusic.addEventListener('ended', async () => {
    LS.set('time', 0);
    setTrack(currentTrack + 1);
    try { await bgMusic.play(); updateBtn(true); } catch { updateBtn(false); }
  });

  musicBtn.addEventListener('click', async () => {
    if (bgMusic.paused) {
      await safePlay();
    } else {
      await fadeTo(0);
      bgMusic.pause();
      updateBtn(false);
      LS.set('playing', false);
    }
  });

  // Сохраняем позицию при уходе со страницы
  window.addEventListener('pagehide', () => {
    LS.set('time', bgMusic.currentTime);
    LS.set('playing', String(!bgMusic.paused));
    LS.set('trackIndex', currentTrack);
  });
  // Safari использует pagehide, но на всякий случай и beforeunload
  window.addEventListener('beforeunload', () => {
    LS.set('time', bgMusic.currentTime);
    LS.set('playing', String(!bgMusic.paused));
  });

  if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play',  async () => { if (bgMusic.paused) await safePlay(); });
    navigator.mediaSession.setActionHandler('pause', async () => { await fadeTo(0); bgMusic.pause(); updateBtn(false); LS.set('playing', false); });
    navigator.mediaSession.setActionHandler('nexttrack', async () => {
      LS.set('time', 0); setTrack(currentTrack + 1);
      try { await bgMusic.play(); updateBtn(true); } catch {}
    });
    navigator.mediaSession.setActionHandler('previoustrack', async () => {
      LS.set('time', 0); setTrack(currentTrack - 1);
      try { await bgMusic.play(); updateBtn(true); } catch {}
    });
  }

  setTrack(currentTrack);
})();


/* ──────────────────────────────────────────────────────────
   MAIN APP
   ────────────────────────────────────────────────────────── */
(() => {
  const isTouch = (window.matchMedia?.('(pointer: coarse)').matches)
    || ('ontouchstart' in window)
    || (navigator.maxTouchPoints > 0);

  window.addEventListener('load', () => document.body.classList.add('is-loaded'));

  /* ── HEADER LOAD ──────────────────────────────────────── */
  // Netlify хостит всё через /  — используем абсолютный путь
  // Это работает правильно и с корня и из /portfolio/
  const headerPlaceholder = document.getElementById('header-placeholder');

  if (headerPlaceholder) {
    fetch('/header.html')
      .then(r => {
        if (!r.ok) throw new Error('header not found');
        return r.text();
      })
      .then(html => {
        // Вставляем HTML хедера вместо placeholder
        headerPlaceholder.outerHTML = html;
        initNav();
      })
      .catch(() => {
        // Fallback: скрываем placeholder, контент всё равно видим
        headerPlaceholder.style.display = 'none';
        initNav();
      });
  } else {
    initNav();
  }

  function initNav() {
    const burger      = document.getElementById('burger');
    const mobileMenu  = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');
    const nav         = document.getElementById('topnav');

    /* ── iOS FIXED NAV FIX ──
       Safari на iPhone теряет position:fixed при скролле если нет GPU слоя.
       translateZ(0) форсирует создание composite layer — хедер всегда на месте. */
    if (nav) {
      nav.style.webkitTransform = 'translateZ(0)';
      nav.style.transform       = 'translateZ(0)';
      nav.style.willChange      = 'transform';

      // Обновляем CSS переменную --navH
      const setNavH = () => {
        const h = nav.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--navH', h + 'px');
      };
      setNavH();
      window.addEventListener('resize', setNavH);

      // Класс .scrolled для уменьшения хедера
      const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // Мобильное меню
    if (burger && mobileMenu) {
      burger.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden'; // блокируем скролл под меню
      });
    }
    const closeMenu = () => {
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
    };
    mobileClose?.addEventListener('click', closeMenu);
    mobileMenu?.addEventListener('click', e => { if (e.target === mobileMenu) closeMenu(); });

    // Активная ссылка в навигации
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.menu a, .mobile-menu-links a').forEach(link => {
      link.classList.remove('active');
      const href     = link.getAttribute('href') || '';
      const linkPage = href.split('/').pop();
      if (!linkPage) return;
      if (linkPage === page) { link.classList.add('active'); return; }
      if (
        (page === '' || page === 'index.html') &&
        (linkPage === 'index.html' || href === '/' || href === '../' || href === './')
      ) link.classList.add('active');
    });
  }

  /* ── CONTACT FORM ─────────────────────────────────────── */
  const form       = document.getElementById('contactForm');
  const popup      = document.getElementById('popup');
  const popupClose = document.getElementById('popupClose');

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('.send-btn');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      const data = {
        firstName: document.getElementById('firstName')?.value || '',
        lastName:  document.getElementById('lastName')?.value  || '',
        email:     document.getElementById('email')?.value     || '',
        message:   document.getElementById('message')?.value   || ''
      };

      const TG = 'https://api.telegram.org/bot8249291699:AAFCpn9TC5wOHHL5RJbGVubgMCyOL3lu4T4/sendMessage';

      try {
        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: 'service_ewg5w2n', template_id: 'template_ce4qo7t',
            user_id: 'mJztgAOONni1NaDaq',
            template_params: data
          })
        });
        await fetch(TG, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: '1525265767',
            text: `New message!\n\nName: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\n\nMessage:\n${data.message}` })
        });
        form.reset();
        popup?.classList.add('show');
      } catch {
        alert('Connection error. Check your internet.');
      } finally {
        btn.innerHTML = `Send Message <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`;
        btn.disabled = false;
      }
    });
  }

  popupClose?.addEventListener('click', () => popup?.classList.remove('show'));
  popup?.addEventListener('click', e => { if (e.target === popup) popup.classList.remove('show'); });

  /* ── NEWSLETTER ───────────────────────────────────────── */
  const nlForm  = document.getElementById('newsletterForm');
  const nlEmail = document.getElementById('newsletterEmail');
  nlForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const email = nlEmail?.value || '';
    if (email) {
      await fetch('https://api.telegram.org/bot8249291699:AAFCpn9TC5wOHHL5RJbGVubgMCyOL3lu4T4/sendMessage', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: '1525265767', text: `📧 New subscriber: ${email}` })
      }).catch(() => {});
    }
    if (nlEmail) nlEmail.value = '';
  });

  /* ── FADE-UP (.fu → .vis) ─────────────────────────────── */
  const fuEls = document.querySelectorAll('.fu');
  if (fuEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
      });
    }, { threshold: 0.05 });

    fuEls.forEach(el => {
      // Элементы уже в viewport — показываем сразу
      if (el.getBoundingClientRect().top < window.innerHeight * 1.1) {
        el.classList.add('vis');
      } else {
        io.observe(el);
      }
    });
  }

  /* ── COUNTER ANIMATION ────────────────────────────────── */
  document.querySelectorAll('[data-target]').forEach(el => {
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.unobserve(el);
      const target  = parseFloat(el.dataset.target);
      const suffix  = el.dataset.suffix || '';
      const isFloat = target % 1 !== 0;
      const start   = performance.now();
      (function tick(now) {
        const p = Math.min((now - start) / 1800, 1);
        const v = (1 - Math.pow(1 - p, 3)) * target;
        el.textContent = (isFloat ? v.toFixed(1) : Math.floor(v)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    }, { threshold: 0.5 });
    io.observe(el);
  });

  /* ── CUSTOM CURSOR ────────────────────────────────────── */
  if (!isTouch) {
    const cursor = document.getElementById('dinCursor');
    const ring   = document.getElementById('dinCursorRing');
    if (cursor && ring) {
      let mx = -999, my = -999, rx = -999, ry = -999, moved = false;
      Object.assign(cursor.style, { left: '-999px', top: '-999px', opacity: '0' });
      Object.assign(ring.style,   { left: '-999px', top: '-999px', opacity: '0' });

      document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
        if (!moved) { moved = true; cursor.style.opacity = '1'; ring.style.opacity = '1'; }
      }, { passive: true });

      (function animRing() {
        rx += (mx - rx) * 0.09; ry += (my - ry) * 0.09;
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
        requestAnimationFrame(animRing);
      })();
    }
  }

  /* ── CASE SUBNAV ──────────────────────────────────────── */
  (() => {
    const subnav = document.querySelector('[data-case-subnav]');
    if (!subnav) return;
    document.body.classList.add('has-case-subnav');

    const setSubnavH = () =>
      document.documentElement.style.setProperty('--caseSubnavH', subnav.offsetHeight + 'px');
    setSubnavH();
    window.addEventListener('resize', setSubnavH);

    const subLinks = subnav.querySelectorAll("a[href^='#']");
    const sections = document.querySelectorAll('.case-section[id]');

    sections.forEach(s => {
      new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          subLinks.forEach(l =>
            l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id)
          );
        });
      }, { threshold: 0.2 }).observe(s);
    });

    subLinks.forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (!href?.startsWith('#')) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--navH'))      || 0;
        const subH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--caseSubnavH')) || 0;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - navH - subH - 16,
          behavior: 'smooth'
        });
      });
    });
  })();

  /* ── VISIT NOTIFICATION (Telegram) ───────────────────── */
  (() => {
    const page   = window.location.pathname;
    const ref    = document.referrer ? `\nОткуда: ${document.referrer}` : '\nОткуда: прямой заход';
    const device = /Mobi|Android/i.test(navigator.userAgent) ? '📱 Мобильный' : '🖥 Десктоп';
    const time   = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
    const text   = `👁 Посетитель\n\nСтраница: ${page}${ref}\nУстройство: ${device}\nЯзык: ${navigator.language}\nВремя: ${time}`;
    fetch('https://api.telegram.org/bot8249291699:AAFCpn9TC5wOHHL5RJbGVubgMCyOL3lu4T4/sendMessage', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: '1525265767', text })
    }).catch(() => {});
  })();

})();


/* ──────────────────────────────────────────────────────────
   LIGHTBOX
   ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const modal    = document.getElementById('imgModal');
  const modalImg = document.getElementById('imgModalSrc');
  if (!modal || !modalImg) return;

  const open = (src, alt = '') => {
    modalImg.src = src; modalImg.alt = alt;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
    document.body.style.overflow = '';
  };

  document.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) { close(); return; }
    const t = e.target.closest('[data-lightbox]');
    if (!t) return;
    if (t.tagName === 'IMG') { open(t.currentSrc || t.src, t.alt); return; }
    const src = t.getAttribute('data-src') || t.getAttribute('href');
    if (src) open(src, t.getAttribute('aria-label') || '');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  document.querySelectorAll('.screen-card img, .ba-card img, .hero-img-wrap img, .uikit-img img')
    .forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => open(img.src, img.alt));
    });

  window.openLightbox = src => {
    const full = (src.startsWith('/') || src.startsWith('http')) ? src : '/images/clm/' + src;
    open(full);
  };
});


/* ──────────────────────────────────────────────────────────
   SCROLL REVEAL + PROGRESS BAR
   ────────────────────────────────────────────────────────── */
(() => {
  const bar = document.getElementById('progressBar');
  if (bar) {
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) bar.style.width = (window.scrollY / total * 100) + '%';
    }, { passive: true });
  }

  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); }
    });
  }, { threshold: 0.07 })
    .observe
  ; // Observe called per-element below
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); ro.unobserve(e.target); }
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('[data-reveal]').forEach(el => ro.observe(el));
})();