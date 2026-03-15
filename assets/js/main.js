/* ============================================================
   MAIN.JS — v5
   Музыка: простая и надёжная, сохраняется между страницами
   ============================================================ */

/* ── MUSIC ─────────────────────────────────────────────────
   Запускаем сразу — не ждём DOMContentLoaded
   потому что <audio> и <button> уже в DOM (они в начале body)
   ────────────────────────────────────────────────────────── */
(function initMusic() {
  var btn   = document.getElementById('musicBtn');
  var audio = document.getElementById('bgMusic');

  if (!btn || !audio) {
    /* Элементы ещё не в DOM — ждём */
    document.addEventListener('DOMContentLoaded', initMusic);
    return;
  }

  var KEY_PLAYING = 'din:music:playing';
  var KEY_TIME    = 'din:music:time';
  var TARGET_VOL  = 0.14;

  /* Читаем сохранённое состояние */
  var wasPlaying = false;
  var savedTime  = 0;
  try {
    wasPlaying = localStorage.getItem(KEY_PLAYING) === 'true';
    savedTime  = parseFloat(localStorage.getItem(KEY_TIME) || '0') || 0;
  } catch(e) {}

  audio.volume = 0;
  audio.loop   = true;

  /* Восстанавливаем позицию */
  function restoreTime() {
    if (savedTime > 1 && audio.duration && savedTime < audio.duration - 1) {
      audio.currentTime = savedTime;
    }
  }
  audio.addEventListener('loadedmetadata', restoreTime, { once: true });
  audio.addEventListener('durationchange',  restoreTime, { once: true });

  /* Плавное изменение громкости */
  function fadeTo(target) {
    var from  = audio.volume;
    var diff  = target - from;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 350, 1);
      audio.volume = from + diff * p;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Обновляем кнопку */
  function updateBtn(playing) {
    btn.textContent = playing ? '🔊' : '🎵';
    btn.classList.toggle('playing', playing);
    btn.classList.remove('ready');
  }

  /* Воспроизведение */
  function play() {
    var promise = audio.play();
    if (promise && promise.then) {
      promise.then(function() {
        fadeTo(TARGET_VOL);
        updateBtn(true);
        save(true);
      }).catch(function() {
        /* Autoplay заблокирован — показываем пульсацию */
        btn.classList.add('ready');
        updateBtn(false);
      });
    } else {
      fadeTo(TARGET_VOL);
      updateBtn(true);
      save(true);
    }
  }

  function pause() {
    fadeTo(0);
    setTimeout(function() { audio.pause(); }, 360);
    updateBtn(false);
    save(false);
  }

  function save(playing) {
    try {
      localStorage.setItem(KEY_PLAYING, playing ? 'true' : 'false');
      if (!audio.paused) localStorage.setItem(KEY_TIME, audio.currentTime.toFixed(2));
    } catch(e) {}
  }

  /* Кнопка */
  btn.addEventListener('click', function() {
    /* Снимаем onFirstTouch до обработки, чтобы не было двойного вызова play() */
    document.removeEventListener('touchstart', onFirstTouch);
    document.removeEventListener('click',      onFirstTouch);
    btn.classList.remove('ready');
    if (audio.paused) {
      play();
    } else {
      pause();
    }
  });

  /* Сохраняем позицию каждую секунду */
  setInterval(function() {
    if (!audio.paused) {
      try { localStorage.setItem(KEY_TIME, audio.currentTime.toFixed(2)); } catch(e) {}
    }
  }, 1000);

  /* Сохраняем при уходе со страницы */
  window.addEventListener('pagehide', function() { save(!audio.paused); });
  window.addEventListener('beforeunload', function() { save(!audio.paused); });

  /* Автоплей если был включён */
  function tryAutoplay() {
    restoreTime();
    if (wasPlaying) {
      play();
    } else {
      updateBtn(false);
    }
  }

  if (audio.readyState >= 2) {
    /* Уже загружено */
    tryAutoplay();
  } else {
    audio.addEventListener('canplay', tryAutoplay, { once: true });
    /* Fallback — если canplay не стреляет */
    setTimeout(function() {
      if (wasPlaying && audio.paused) play();
    }, 2000);
  }

  /* Если autoplay заблокирован — включаем при первом касании */
  function onFirstTouch() {
    if (wasPlaying && audio.paused) play();
    document.removeEventListener('touchstart', onFirstTouch);
    document.removeEventListener('click',      onFirstTouch);
  }
  document.addEventListener('touchstart', onFirstTouch, { passive: true });
  document.addEventListener('click',      onFirstTouch);

})();


/* ── MAIN APP ───────────────────────────────────────────── */
(function() {
  var isTouch = (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
    || ('ontouchstart' in window)
    || (navigator.maxTouchPoints > 0);

  window.addEventListener('load', function() {
    document.body.classList.add('is-loaded');
  });

  /* ── HEADER ── */
  var headerPlaceholder = document.getElementById('header-placeholder');
  if (headerPlaceholder) {
    fetch('/header.html')
      .then(function(r) {
        if (!r.ok) throw new Error('no header');
        return r.text();
      })
      .then(function(html) {
        headerPlaceholder.outerHTML = html;
        initNav();
      })
      .catch(function() {
        headerPlaceholder.style.display = 'none';
        initNav();
      });
  } else {
    document.addEventListener('DOMContentLoaded', initNav);
  }

  function initNav() {
    var burger      = document.getElementById('burger');
    var mobileMenu  = document.getElementById('mobileMenu');
    var mobileClose = document.getElementById('mobileClose');
    var nav         = document.getElementById('topnav');

    if (nav) {
      /* iOS Safari GPU fix */
      nav.style.webkitTransform = 'translate3d(0,0,0)';
      nav.style.transform       = 'translate3d(0,0,0)';
      nav.style.willChange      = 'transform';

      /* Обновляем --navH */
      function syncNavH() {
        var h = nav.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--navH', h + 'px');
      }
      syncNavH();
      window.addEventListener('resize', syncNavH, { passive: true });

      /* .scrolled */
      function onScroll() {
        nav.classList.toggle('scrolled', window.scrollY > 40);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* Мобильное меню */
    if (burger && mobileMenu) {
      burger.addEventListener('click', function() {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    }
    function closeMenu() {
      if (mobileMenu) mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
    if (mobileClose) mobileClose.addEventListener('click', closeMenu);
    if (mobileMenu)  mobileMenu.addEventListener('click', function(e) {
      if (e.target === mobileMenu) closeMenu();
    });

    /* Активная ссылка */
    var page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.menu a, .mobile-menu-links a').forEach(function(link) {
      link.classList.remove('active');
      var href = link.getAttribute('href') || '';
      var lp   = href.split('/').pop();
      if (!lp) return;
      if (lp === page) { link.classList.add('active'); return; }
      if ((page === '' || page === 'index.html') &&
          (lp === 'index.html' || href === '/' || href === '../' || href === './'))
        link.classList.add('active');
    });
  }

  /* ── CONTACT FORM ── */
  var form       = document.getElementById('contactForm');
  var popup      = document.getElementById('popup');
  var popupClose = document.getElementById('popupClose');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('.send-btn');
      btn.textContent = 'Sending...';
      btn.disabled = true;
      var data = {
        firstName: (document.getElementById('firstName') || {}).value || '',
        lastName:  (document.getElementById('lastName')  || {}).value || '',
        email:     (document.getElementById('email')     || {}).value || '',
        message:   (document.getElementById('message')   || {}).value || ''
      };
      var TG = 'https://api.telegram.org/bot8249291699:AAFCpn9TC5wOHHL5RJbGVubgMCyOL3lu4T4/sendMessage';
      Promise.all([
        fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ service_id:'service_ewg5w2n', template_id:'template_ce4qo7t',
            user_id:'mJztgAOONni1NaDaq', template_params: data })
        }),
        fetch(TG, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id:'1525265767',
            text:'New message!\n\nName: '+data.firstName+' '+data.lastName+'\nEmail: '+data.email+'\n\nMessage:\n'+data.message })
        })
      ]).then(function() {
        form.reset();
        if (popup) popup.classList.add('show');
      }).catch(function() {
        alert('Connection error. Check your internet.');
      }).finally(function() {
        btn.innerHTML = 'Send Message <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>';
        btn.disabled = false;
      });
    });
  }
  if (popupClose) popupClose.addEventListener('click', function() { popup.classList.remove('show'); });
  if (popup) popup.addEventListener('click', function(e) { if (e.target === popup) popup.classList.remove('show'); });

  /* ── NEWSLETTER ── */
  var nlForm  = document.getElementById('newsletterForm');
  var nlEmail = document.getElementById('newsletterEmail');
  if (nlForm) {
    nlForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var email = nlEmail ? nlEmail.value : '';
      if (email) {
        fetch('https://api.telegram.org/bot8249291699:AAFCpn9TC5wOHHL5RJbGVubgMCyOL3lu4T4/sendMessage', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id:'1525265767', text:'📧 New subscriber: '+email })
        }).catch(function(){});
      }
      if (nlEmail) nlEmail.value = '';
    });
  }

  /* ── FADE-UP ── */
  document.addEventListener('DOMContentLoaded', function() {
    var fuEls = document.querySelectorAll('.fu');
    if (!fuEls.length) return;
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
      });
    }, { threshold: 0.05 });
    fuEls.forEach(function(el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 1.1) el.classList.add('vis');
      else io.observe(el);
    });
  });

  /* ── COUNTER ── */
  document.querySelectorAll('[data-target]').forEach(function(el) {
    new IntersectionObserver(function(entries) {
      if (!entries[0].isIntersecting) return;
      var target  = parseFloat(el.dataset.target);
      var suffix  = el.dataset.suffix || '';
      var isFloat = target % 1 !== 0;
      var start   = performance.now();
      (function tick(now) {
        var p = Math.min((now - start) / 1800, 1);
        var v = (1 - Math.pow(1 - p, 3)) * target;
        el.textContent = (isFloat ? v.toFixed(1) : Math.floor(v)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    }, { threshold: 0.5 }).observe(el);
  });

  /* ── CUSTOM CURSOR ── */
  if (!isTouch) {
    var cursor = document.getElementById('dinCursor');
    var ring   = document.getElementById('dinCursorRing');
    if (cursor && ring) {
      var mx = -999, my = -999, rx = -999, ry = -999, moved = false;
      cursor.style.cssText += ';left:-999px;top:-999px;opacity:0';
      ring.style.cssText   += ';left:-999px;top:-999px;opacity:0';
      document.addEventListener('mousemove', function(e) {
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

  /* ── CASE SUBNAV ── */
  document.addEventListener('DOMContentLoaded', function() {
    var subnav = document.querySelector('[data-case-subnav]');
    if (!subnav) return;
    document.body.classList.add('has-case-subnav');
    function syncH() {
      document.documentElement.style.setProperty('--caseSubnavH', subnav.offsetHeight + 'px');
    }
    syncH();
    window.addEventListener('resize', syncH, { passive: true });

    var subLinks = subnav.querySelectorAll("a[href^='#']");
    var sections = document.querySelectorAll('.case-section[id]');
    sections.forEach(function(s) {
      new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (!e.isIntersecting) return;
          subLinks.forEach(function(l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
          });
        });
      }, { threshold: 0.2 }).observe(s);
    });

    subLinks.forEach(function(a) {
      a.addEventListener('click', function(e) {
        var href = a.getAttribute('href');
        if (!href || href[0] !== '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--navH'))      || 0;
        var subH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--caseSubnavH')) || 0;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - subH - 16, behavior: 'smooth' });
      });
    });
  });

  /* ── SCROLL REVEAL ── */
  document.addEventListener('DOMContentLoaded', function() {
    var bar = document.getElementById('progressBar')
           || document.getElementById('psProgress')
           || document.getElementById('ubProgress');
    if (bar) {
      window.addEventListener('scroll', function() {
        var total = document.documentElement.scrollHeight - window.innerHeight;
        if (total > 0) bar.style.width = (window.scrollY / total * 100) + '%';
      }, { passive: true });
    }
    var ro = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('revealed'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.07 });
    document.querySelectorAll('[data-reveal]').forEach(function(el) { ro.observe(el); });
  });

  /* ── VISIT NOTIFICATION ── */
  (function() {
    var page   = window.location.pathname;
    var ref    = document.referrer ? '\nОткуда: ' + document.referrer : '\nОткуда: прямой';
    var device = /Mobi|Android/i.test(navigator.userAgent) ? '📱 Мобильный' : '🖥 Десктоп';
    var time   = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
    fetch('https://api.telegram.org/bot8249291699:AAFCpn9TC5wOHHL5RJbGVubgMCyOL3lu4T4/sendMessage', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id:'1525265767',
        text:'👁 Посетитель\n\nСтраница: '+page+ref+'\nУстройство: '+device+'\nЯзык: '+navigator.language+'\nВремя: '+time })
    }).catch(function(){});
  })();

})();