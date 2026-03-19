/* ============================================================
   PROJECT-FRAMES.JS v5
   - Свайп влево/вправо — следующая/предыдущая картинка
   - Свайп вниз чтобы закрыть
   - Скролл вниз для длинных скриншотов
   - Pinch zoom + pan
   - Десктоп: колёсико zoom + стрелки клавиатуры
   ============================================================ */
(function () {
  'use strict';

  var _observing  = false;
  var _rafPending = false;

  /* ── Стили ── */
  if (!document.getElementById('pf-styles')) {
    const css = document.createElement('style');
    css.id = 'pf-styles';
    css.textContent = `
      .pf-modal {
        display:none; position:fixed; inset:0; z-index:99000;
        align-items:center; justify-content:center; padding:12px;
      }
      .pf-modal.is-open { display:flex; animation:pfIn .22s ease; }
      @keyframes pfIn { from{opacity:0} to{opacity:1} }

      .pf-modal__backdrop {
        position:absolute; inset:0;
        background:rgba(0,0,0,.92);
        backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
        cursor:pointer;
      }

      .pf-modal__card {
        position:relative; z-index:1;
        display:flex; flex-direction:column;
        width:min(94vw,1280px);
        max-height:92vh;
        border-radius:14px; overflow:hidden;
        border:1px solid rgba(255,255,255,.12);
        box-shadow:0 40px 120px rgba(0,0,0,.9);
        background:#0c0c0c;
        animation:pfSlide .28s cubic-bezier(.4,0,.2,1);
        will-change:transform;
      }
      .pf-modal__card.snapping {
        transition:transform .3s cubic-bezier(.4,0,.2,1), opacity .3s ease;
      }
      .pf-modal__card.sliding {
        transition:transform .25s cubic-bezier(.4,0,.2,1), opacity .2s ease;
      }
      @keyframes pfSlide {
        from{transform:translateY(20px) scale(.97);opacity:0}
        to{transform:none;opacity:1}
      }

      .pf-modal__handle {
        display:none; width:36px; height:4px;
        border-radius:99px; background:rgba(255,255,255,.28);
        margin:10px auto 6px; flex-shrink:0; cursor:grab;
      }

      @media(max-width:768px) {
        .pf-modal { align-items:flex-end; padding:0; }
        .pf-modal__card {
          width:100%; max-height:95vh;
          border-radius:20px 20px 0 0;
          border-bottom:none;
        }
        .pf-modal__handle { display:block; }
      }

      .pf-modal__bar {
        display:flex; align-items:center; gap:6px;
        padding:8px 12px; flex-shrink:0;
        background:rgba(0,0,0,.75);
        border-bottom:1px solid rgba(255,255,255,.07);
        user-select:none; position:sticky; top:0; z-index:2;
      }
      .pf-bar-hint {
        font-size:11px; color:rgba(255,255,255,.3);
        font-family:'Space Mono',monospace;
        margin-right:auto; display:none;
      }
      @media(min-width:640px){ .pf-bar-hint{display:block} }

      /* Счётчик картинок */
      .pf-counter {
        font-family:'Space Mono',monospace; font-size:11px;
        color:rgba(255,255,255,.35); margin-right:auto;
        display:none;
      }
      .pf-counter.visible { display:block; }

      .pf-btn {
        width:34px; height:34px; border-radius:9px;
        border:1px solid rgba(255,255,255,.16);
        background:rgba(255,255,255,.07);
        color:rgba(255,255,255,.85);
        font-size:18px; cursor:pointer;
        display:flex; align-items:center; justify-content:center;
        transition:background .15s, transform .1s;
        flex-shrink:0;
      }
      @media(max-width:640px){ .pf-btn{width:38px;height:38px;font-size:20px} }
      .pf-btn:active{transform:scale(.9);background:rgba(255,255,255,.18)}
      .pf-btn--close:active{background:rgba(255,50,50,.3)}
      .pf-btn:disabled{opacity:.25;cursor:default;pointer-events:none}
      .pf-zoom-val {
        font-family:'Space Mono',monospace; font-size:12px;
        color:rgba(255,255,255,.5); min-width:44px; text-align:center;
      }

      /* Стрелки навигации — десктоп */
      .pf-nav-btn {
        position:absolute; top:50%; z-index:10;
        transform:translateY(-50%);
        width:44px; height:44px; border-radius:50%;
        border:1px solid rgba(255,255,255,.22);
        background:rgba(0,0,0,.6);
        color:rgba(255,255,255,.85); font-size:22px;
        cursor:pointer; display:flex; align-items:center; justify-content:center;
        transition:background .2s, opacity .2s;
        backdrop-filter:blur(8px);
      }
      .pf-nav-btn:hover { background:rgba(255,255,255,.15); }
      .pf-nav-btn:disabled { opacity:0; pointer-events:none; }
      .pf-nav-btn--prev { left:12px; }
      .pf-nav-btn--next { right:12px; }
      @media(max-width:768px){ .pf-nav-btn { display:none; } }

      .pf-modal__vp {
        flex:1;
        overflow-y:auto;
        overflow-x:hidden;
        -webkit-overflow-scrolling:touch;
        position:relative;
        background:#0c0c0c;
        touch-action:pan-y pinch-zoom;
        cursor:default;
      }
      .pf-modal__vp::-webkit-scrollbar { width:4px; }
      .pf-modal__vp::-webkit-scrollbar-track { background:rgba(255,255,255,.04); }
      .pf-modal__vp::-webkit-scrollbar-thumb { background:rgba(255,255,255,.22); border-radius:2px; }

      .pf-modal__img {
        display:block;
        width:100%;
        height:auto;
        object-fit:contain;
        user-select:none;
        -webkit-user-drag:none;
        transition:opacity .18s ease;
      }
      .pf-modal__img.fading { opacity:0; }

      .pf-loading {
        display:flex; align-items:center; justify-content:center;
        padding:48px; width:100%;
      }
      .pf-loading::before {
        content:''; width:32px; height:32px; border-radius:50%;
        border:2px solid rgba(255,255,255,.12);
        border-top-color:rgba(255,255,255,.6);
        animation:pfSpin .7s linear infinite;
      }
      @keyframes pfSpin{to{transform:rotate(360deg)}}

      .pf-swipe-hint {
        position:fixed; bottom:32px; left:50%; transform:translateX(-50%);
        background:rgba(0,0,0,.7); color:rgba(255,255,255,.75);
        font-size:12px; padding:8px 18px; border-radius:999px;
        pointer-events:none; z-index:99001;
        animation:pfHint 3s ease forwards;
      }
      @keyframes pfHint {
        0%{opacity:0;transform:translateX(-50%) translateY(8px)}
        15%{opacity:1;transform:translateX(-50%) translateY(0)}
        80%{opacity:1}
        100%{opacity:0;transform:translateX(-50%) translateY(-4px)}
      }

      /* Индикатор свайпа влево/вправо */
      .pf-slide-indicator {
        position:absolute; top:50%; left:50%;
        transform:translate(-50%,-50%);
        font-size:48px; pointer-events:none; z-index:20;
        opacity:0; transition:opacity .15s;
      }
      .pf-slide-indicator.show { opacity:0.6; }
    `;
    document.head.appendChild(css);
  }

  /* ── Модал ── */
  if (!document.getElementById('pfModal')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="pf-modal" id="pfModal" aria-hidden="true" role="dialog" aria-modal="true">
        <div class="pf-modal__backdrop" id="pfBackdrop"></div>
        <div class="pf-modal__card" id="pfCard">
          <div class="pf-modal__handle" id="pfHandle"></div>
          <div class="pf-modal__bar">
            <span class="pf-bar-hint">scroll · swipe ← → · pinch zoom</span>
            <span class="pf-counter" id="pfCounter"></span>
            <button class="pf-btn" id="pfZoomOut" title="Zoom out">−</button>
            <span   class="pf-zoom-val" id="pfZoomVal">100%</span>
            <button class="pf-btn" id="pfZoomIn"  title="Zoom in">+</button>
            <button class="pf-btn" id="pfReset"   title="Reset">⊡</button>
            <button class="pf-btn pf-btn--close" id="pfClose" aria-label="Close">✕</button>
          </div>
          <div class="pf-modal__vp" id="pfVp">
            <button class="pf-nav-btn pf-nav-btn--prev" id="pfPrev">‹</button>
            <button class="pf-nav-btn pf-nav-btn--next" id="pfNext">›</button>
            <div class="pf-loading" id="pfLoading"></div>
            <img class="pf-modal__img" id="pfImg" src="" alt="Preview"
                 draggable="false" style="display:none">
            <div class="pf-slide-indicator" id="pfSlideInd"></div>
          </div>
        </div>
      </div>
    `);
  }

  _observing = true;

  /* ── DOM ── */
  const modal    = document.getElementById('pfModal');
  const card     = document.getElementById('pfCard');
  const img      = document.getElementById('pfImg');
  const vp       = document.getElementById('pfVp');
  const loading  = document.getElementById('pfLoading');
  const backdrop = document.getElementById('pfBackdrop');
  const closeBtn = document.getElementById('pfClose');
  const zoomInB  = document.getElementById('pfZoomIn');
  const zoomOutB = document.getElementById('pfZoomOut');
  const resetB   = document.getElementById('pfReset');
  const zoomLbl  = document.getElementById('pfZoomVal');
  const handle   = document.getElementById('pfHandle');
  const prevBtn  = document.getElementById('pfPrev');
  const nextBtn  = document.getElementById('pfNext');
  const counter  = document.getElementById('pfCounter');
  const slideInd = document.getElementById('pfSlideInd');

  /* ── Gallery state ── */
  let gallery    = [];   /* все .pf карточки в текущей группе */
  let currentIdx = 0;

  function buildGallery(clickedCard) {
    /* Ищем ближайший общий контейнер — родитель карточки */
    const container = clickedCard.closest('.pf-grid, .pf-grid--ba, .pf-grid--mobile, .pf-grid--mobile-2, [data-pf-gallery]')
                   || clickedCard.parentElement;
    const cards = container ? Array.from(container.querySelectorAll('.pf[data-pf-bound]')) : [clickedCard];
    gallery = cards.filter(c => {
      const i = c.querySelector('img');
      return i && i.src;
    });
    currentIdx = gallery.indexOf(clickedCard);
    if (currentIdx < 0) currentIdx = 0;
  }

  function updateNav() {
    if (gallery.length <= 1) {
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      counter.classList.remove('visible');
    } else {
      prevBtn.disabled = currentIdx <= 0;
      nextBtn.disabled = currentIdx >= gallery.length - 1;
      counter.textContent = (currentIdx + 1) + ' / ' + gallery.length;
      counter.classList.add('visible');
    }
  }

  function showImage(src, alt) {
    img.classList.add('fading');
    loading.style.display = 'flex';
    img.style.display = 'none';

    const tmpImg = new Image();
    tmpImg.onload = function() {
      img.src = src;
      img.alt = alt || '';
      loading.style.display = 'none';
      img.style.display = 'block';
      img.classList.remove('fading');
      vp.scrollTop = 0;
      resetScale();
    };
    tmpImg.onerror = function() {
      img.src = src;
      loading.style.display = 'none';
      img.style.display = 'block';
      img.classList.remove('fading');
    };
    tmpImg.src = src;
  }

  function goTo(idx) {
    if (idx < 0 || idx >= gallery.length) return;
    currentIdx = idx;
    const c = gallery[currentIdx];
    const i = c.querySelector('img');
    if (i) showImage(i.src, i.alt);
    updateNav();
  }

  function goPrev() { goTo(currentIdx - 1); }
  function goNext() { goTo(currentIdx + 1); }

  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);

  /* ── Zoom state ── */
  let scale = 1;
  const MIN_SCALE = 0.5, MAX_SCALE = 6, ZOOM_STEP = 0.4;

  function applyScale() {
    img.style.transform = `scale(${scale})`;
    img.style.transformOrigin = 'top center';
    img.style.width = scale < 1 ? `${100 / scale}%` : '100%';
    zoomLbl.textContent = Math.round(scale * 100) + '%';
  }

  function zoomTo(newScale) {
    scale = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);
    applyScale();
  }

  function resetScale() { scale = 1; applyScale(); }

  zoomInB.onclick  = () => zoomTo(scale + ZOOM_STEP);
  zoomOutB.onclick = () => zoomTo(scale - ZOOM_STEP);
  resetB.onclick   = () => { resetScale(); vp.scrollTop = 0; };

  vp.addEventListener('wheel', e => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      zoomTo(scale + (e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP));
    }
  }, { passive: false });

  /* ── Pinch zoom ── */
  let pinchStartDist = null;
  let pinchStartScale = 1;

  vp.addEventListener('touchstart', e => {
    if (e.touches.length === 2) {
      pinchStartDist  = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchStartScale = scale;
      e.preventDefault();
    }
  }, { passive: false });

  vp.addEventListener('touchmove', e => {
    if (e.touches.length === 2 && pinchStartDist) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      zoomTo(pinchStartScale * (dist / pinchStartDist));
      e.preventDefault();
    }
  }, { passive: false });

  vp.addEventListener('touchend', () => { pinchStartDist = null; });

  /* ── Свайп влево/вправо + вниз для закрытия ── */
const SWIPE_CLOSE_Y = 90;
const SWIPE_NAV_X   = 50;
const LOCK_ANGLE    = 30; /* градусов от горизонтали — порог для горизонтального свайпа */

let touchStartX  = 0;
let touchStartY  = 0;
let touchDX      = 0;
let touchDY      = 0;
let swipeDir     = null; /* 'x' | 'y' | null */
let swipeLocked  = false;
let velX         = 0;
let lastTouchX   = 0;
let lastTouchT   = 0;

function showIndicator(dir) {
  slideInd.textContent = dir === 'prev' ? '‹' : '›';
  slideInd.classList.add('show');
  clearTimeout(slideInd._t);
  slideInd._t = setTimeout(() => slideInd.classList.remove('show'), 400);
}

/* touchstart — только запоминаем точку начала, ничего не блокируем */
vp.addEventListener('touchstart', e => {
  if (e.touches.length !== 1) return;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  touchDX     = 0;
  touchDY     = 0;
  swipeDir    = null;
  swipeLocked = false;
  velX        = 0;
  lastTouchX  = touchStartX;
  lastTouchT  = Date.now();
  card.classList.remove('snapping', 'sliding');
}, { passive: true }); /* passive:true — не тормозим скролл на старте */

/* touchmove — определяем направление, тогда блокируем если надо */
vp.addEventListener('touchmove', e => {
  if (e.touches.length !== 1 || swipeLocked) return;

  const dx = e.touches[0].clientX - touchStartX;
  const dy = e.touches[0].clientY - touchStartY;
  touchDX = dx;
  touchDY = dy;

  const now = Date.now();
  const dt  = now - lastTouchT;
  if (dt > 0) velX = (e.touches[0].clientX - lastTouchX) / dt;
  lastTouchX = e.touches[0].clientX;
  lastTouchT = now;

  /* Определяем направление после 8px движения */
  if (!swipeDir) {
    const absDX = Math.abs(dx);
    const absDY = Math.abs(dy);
    if (absDX < 8 && absDY < 8) return; /* ждём чёткого движения */

    const angle = Math.atan2(absDY, absDX) * 180 / Math.PI;
    if (angle < LOCK_ANGLE) {
      swipeDir = 'x'; /* горизонтальный жест */
    } else {
      swipeDir = 'y'; /* вертикальный — отдаём браузеру */
    }
  }

  if (swipeDir === 'x' && scale === 1) {
    /* Блокируем вертикальный скролл браузера — теперь точно горизонтальный */
    e.preventDefault();

    /* Rubber-band на краях */
    let move = dx;
    const atStart = currentIdx === 0 && dx > 0;
    const atEnd   = currentIdx === gallery.length - 1 && dx < 0;
    if (atStart || atEnd) move = dx * 0.18;

    card.style.transform = `translateX(${move}px)`;
    card.style.opacity   = '';

  } else if (swipeDir === 'y' && touchDY > 0 && vp.scrollTop <= 0) {
    /* Свайп вниз для закрытия — только если страница не скроллится */
    /* НЕ вызываем preventDefault — пусть браузер скроллит если нужно */
    const move = touchDY * 0.45;
    card.style.transform = `translateY(${move}px)`;
    card.style.opacity   = String(Math.max(0.4, 1 - touchDY / 280));
  }

}, { passive: false }); /* passive:false нужен чтобы вызвать preventDefault */

vp.addEventListener('touchend', () => {
  if (swipeLocked) return;
  swipeLocked = true;

  if (swipeDir === 'x' && scale === 1) {
    card.classList.add('sliding');
    card.style.opacity = '';

    const fastFlick = Math.abs(velX) > 0.4;

    if ((touchDX < -SWIPE_NAV_X || (fastFlick && velX < 0)) && currentIdx < gallery.length - 1) {
      /* Следующая */
      card.style.transform = 'translateX(-48px)';
      setTimeout(() => {
        card.classList.remove('sliding');
        card.style.transform = '';
        goNext();
        showIndicator('next');
      }, 220);
    } else if ((touchDX > SWIPE_NAV_X || (fastFlick && velX > 0)) && currentIdx > 0) {
      /* Предыдущая */
      card.style.transform = 'translateX(48px)';
      setTimeout(() => {
        card.classList.remove('sliding');
        card.style.transform = '';
        goPrev();
        showIndicator('prev');
      }, 220);
    } else {
      /* Вернуть на место */
      card.style.transform = '';
      setTimeout(() => card.classList.remove('sliding'), 300);
    }

  } else if (swipeDir === 'y' && touchDY > SWIPE_CLOSE_Y && vp.scrollTop <= 0) {
    /* Закрыть */
    card.classList.add('snapping');
    card.style.transform = 'translateY(110%)';
    card.style.opacity   = '0';
    setTimeout(close, 280);

  } else {
    /* Вернуть */
    card.classList.add('snapping');
    card.style.transform = '';
    card.style.opacity   = '';
    setTimeout(() => card.classList.remove('snapping'), 320);
  }

  touchDX  = 0;
  touchDY  = 0;
  swipeDir = null;
}, { passive: true });

  /* ── Open / Close ── */
  let hintShown = false;

  function open(clickedCard) {
    buildGallery(clickedCard);

    resetScale();
    card.style.transform = '';
    card.style.opacity   = '';
    card.classList.remove('snapping', 'sliding');

    img.style.display = 'none';
    loading.style.display = 'flex';

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const c = gallery[currentIdx];
    const i = c ? c.querySelector('img') : null;
    if (i) {
      img.onload = () => {
        loading.style.display = 'none';
        img.style.display = 'block';
        vp.scrollTop = 0;

        if (!hintShown && window.innerWidth < 768) {
          hintShown = true;
          const h = document.createElement('div');
          h.className = 'pf-swipe-hint';
          h.textContent = gallery.length > 1
            ? '← → свайп · ↓ скролл · потяни вниз чтобы закрыть'
            : '↓ скролл · потяни вниз чтобы закрыть';
          document.body.appendChild(h);
          setTimeout(() => h.remove(), 3500);
        }
      };
      img.onerror = () => {
        loading.style.display = 'none';
        img.style.display = 'block';
      };
      img.alt = i.alt || '';
      img.src = i.src;
    }

    updateNav();
    closeBtn.focus();
  }

  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    card.style.transform = '';
    card.style.opacity   = '';
    card.classList.remove('snapping', 'sliding');
    setTimeout(() => {
      img.src = '';
      img.style.display = 'none';
      loading.style.display = 'flex';
      resetScale();
      gallery = [];
    }, 280);
  }

  backdrop.addEventListener('click', close);
  closeBtn.addEventListener('click', close);

  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape')                  close();
    if (e.key === '+' || e.key === '=')      zoomTo(scale + ZOOM_STEP);
    if (e.key === '-')                       zoomTo(scale - ZOOM_STEP);
    if (e.key === '0')                       resetScale();
    if (e.key === 'ArrowDown')               vp.scrollBy({ top: 120, behavior: 'smooth' });
    if (e.key === 'ArrowUp')                 vp.scrollBy({ top: -120, behavior: 'smooth' });
    if (e.key === 'ArrowRight')              goNext();
    if (e.key === 'ArrowLeft')               goPrev();
  });

  /* ── Привязка карточек ── */
  function bindCards() {
    document.querySelectorAll('.pf:not([data-pf-bound])').forEach(c => {
      c.setAttribute('data-pf-bound', '1');
      c.addEventListener('click', () => open(c));
      c.setAttribute('role', 'button');
      c.setAttribute('tabindex', '0');
      c.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(c); }
      });
    });
  }

  bindCards();

  var observer = new MutationObserver(function(mutations) {
    if (!_observing) return;
    var hasNew = false;
    for (var i = 0; i < mutations.length; i++) {
      var nodes = mutations[i].addedNodes;
      for (var j = 0; j < nodes.length; j++) {
        var n = nodes[j];
        if (n.nodeType !== 1 || n.id === 'pfModal' || n.id === 'pf-styles') continue;
        if ((n.classList && n.classList.contains('pf') && !n.dataset.pfBound) ||
            (n.querySelector && n.querySelector('.pf:not([data-pf-bound])'))) {
          hasNew = true; break;
        }
      }
      if (hasNew) break;
    }
    if (!hasNew || _rafPending) return;
    _rafPending = true;
    requestAnimationFrame(function() { _rafPending = false; bindCards(); });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  window.projectFrames = {
    open: (c) => open(c),
    close,
    rebind: bindCards,
    zoom: zoomTo,
    reset: resetScale,
    next: goNext,
    prev: goPrev
  };

})();


