/* ============================================================
   PROJECT-FRAMES.JS v4
   - Изображение можно СКРОЛЛИТЬ вниз (длинные скриншоты)
   - Мобилка: свайп вниз чтобы закрыть
   - Pinch zoom + pan
   - Десктоп: колёсико zoom + drag
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

      /* Карточка */
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
      @keyframes pfSlide {
        from{transform:translateY(20px) scale(.97);opacity:0}
        to{transform:none;opacity:1}
      }

      /* Ручка — только мобилка */
      .pf-modal__handle {
        display:none; width:36px; height:4px;
        border-radius:99px; background:rgba(255,255,255,.28);
        margin:10px auto 6px; flex-shrink:0; cursor:grab;
      }

      /* На мобилке — sheet снизу */
      @media(max-width:768px) {
        .pf-modal { align-items:flex-end; padding:0; }
        .pf-modal__card {
          width:100%; max-height:95vh;
          border-radius:20px 20px 0 0;
          border-bottom:none;
        }
        .pf-modal__handle { display:block; }
      }

      /* Бар управления */
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
      .pf-zoom-val {
        font-family:'Space Mono',monospace; font-size:12px;
        color:rgba(255,255,255,.5); min-width:44px; text-align:center;
      }

      /* ── VIEWPORT — ключевое изменение ──
         overflow-y:auto позволяет скроллить длинные изображения.
         touch-action:pan-y чтобы мобилка понимала вертикальный скролл. */
      .pf-modal__vp {
        flex:1;
        overflow-y:auto;           /* СКРОЛЛ по вертикали */
        overflow-x:hidden;
        -webkit-overflow-scrolling:touch;
        position:relative;
        background:#0c0c0c;
        touch-action:pan-y pinch-zoom;  /* нативный скролл + pinch */
        cursor:default;
      }
      /* Кастомный скроллбар */
      .pf-modal__vp::-webkit-scrollbar { width:4px; }
      .pf-modal__vp::-webkit-scrollbar-track { background:rgba(255,255,255,.04); }
      .pf-modal__vp::-webkit-scrollbar-thumb { background:rgba(255,255,255,.22); border-radius:2px; }

      /* Изображение — показываем полностью, без обрезки */
      .pf-modal__img {
        display:block;
        width:100%;          /* занимает всю ширину */
        height:auto;         /* высота — авто, чтобы длинные скрины скроллились */
        object-fit:contain;
        user-select:none;
        -webkit-user-drag:none;
      }

      /* Спиннер */
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

      /* Подсказка свайп */
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
            <span class="pf-bar-hint">scroll to browse · pinch to zoom</span>
            <button class="pf-btn" id="pfZoomOut" title="Zoom out">−</button>
            <span   class="pf-zoom-val" id="pfZoomVal">100%</span>
            <button class="pf-btn" id="pfZoomIn"  title="Zoom in">+</button>
            <button class="pf-btn" id="pfReset"   title="Reset">⊡</button>
            <button class="pf-btn pf-btn--close" id="pfClose" aria-label="Close">✕</button>
          </div>
          <div class="pf-modal__vp" id="pfVp">
            <div class="pf-loading" id="pfLoading"></div>
            <img class="pf-modal__img" id="pfImg" src="" alt="Preview"
                 draggable="false" style="display:none">
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

  /* ── Zoom state ── */
  let scale = 1;
  const MIN_SCALE = 0.5, MAX_SCALE = 6, ZOOM_STEP = 0.4;

  function applyScale() {
    img.style.transform = `scale(${scale})`;
    img.style.transformOrigin = 'top center';
    /* Когда уменьшено — центрируем; когда увеличено — даём скроллиться */
    img.style.width = scale < 1 ? `${100 / scale}%` : '100%';
    zoomLbl.textContent = Math.round(scale * 100) + '%';
  }

  function zoomTo(newScale) {
    scale = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);
    applyScale();
  }

  function resetScale() { scale = 1; applyScale(); vp.scrollTop = 0; }

  zoomInB.onclick  = () => zoomTo(scale + ZOOM_STEP);
  zoomOutB.onclick = () => zoomTo(scale - ZOOM_STEP);
  resetB.onclick   = resetScale;

  /* Колёсико — zoom на десктопе (Ctrl+scroll), обычный scroll — скролл картинки */
  vp.addEventListener('wheel', e => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      zoomTo(scale + (e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP));
    }
    /* Обычный скролл — нативный, ничего не делаем */
  }, { passive: false });

  /* Pinch zoom на мобилке */
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

  /* ── Свайп вниз чтобы закрыть (handle + начало страницы) ── */
  const SWIPE_CLOSE = 90;

  function setupSwipeClose(el) {
    let startY = 0, currentY = 0, dragging = false;

    el.addEventListener('touchstart', e => {
      /* Только если скролл в самом верху или это handle */
      if (el === handle || vp.scrollTop <= 0) {
        startY   = e.touches[0].clientY;
        currentY = 0;
        dragging = true;
      }
    }, { passive: true });

    el.addEventListener('touchmove', e => {
      if (!dragging) return;
      const dy = e.touches[0].clientY - startY;
      if (dy < 0) { dragging = false; return; } /* вверх — отменяем */
      currentY = dy;
      const r = el === handle ? 0.65 : 0.45;
      card.classList.remove('snapping');
      card.style.transform = `translateY(${currentY * r}px)`;
      card.style.opacity   = String(Math.max(0.4, 1 - currentY / 280));
    }, { passive: true });

    el.addEventListener('touchend', () => {
      if (!dragging) return;
      dragging = false;
      card.classList.add('snapping');

      if (currentY > SWIPE_CLOSE) {
        card.style.transform = 'translateY(110%)';
        card.style.opacity   = '0';
        setTimeout(close, 280);
      } else {
        card.style.transform = '';
        card.style.opacity   = '';
        setTimeout(() => card.classList.remove('snapping'), 320);
      }
      currentY = 0;
    }, { passive: true });
  }

  setupSwipeClose(handle);
  setupSwipeClose(vp); /* свайп с самого верха viewport тоже закрывает */

  /* ── Open / Close ── */
  let hintShown = false;

  function open(src, alt) {
    resetScale();
    card.style.transform = '';
    card.style.opacity   = '';
    card.classList.remove('snapping');

    img.style.display = 'none';
    loading.style.display = 'flex';

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    img.onload = () => {
      loading.style.display = 'none';
      img.style.display = 'block';
      vp.scrollTop = 0;

      /* Подсказка на мобилке */
      if (!hintShown && window.innerWidth < 768) {
        hintShown = true;
        const h = document.createElement('div');
        h.className = 'pf-swipe-hint';
        h.textContent = '↓ scroll to browse  ·  swipe down to close';
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 3200);
      }
    };
    img.onerror = () => {
      loading.style.display = 'none';
      img.style.display = 'block';
    };
    img.alt = alt || '';
    img.src = src;

    closeBtn.focus();
  }

  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    card.style.transform = '';
    card.style.opacity   = '';
    card.classList.remove('snapping');
    setTimeout(() => {
      img.src          = '';
      img.style.display = 'none';
      loading.style.display = 'flex';
      resetScale();
    }, 280);
  }

  backdrop.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === '+' || e.key === '=') zoomTo(scale + ZOOM_STEP);
    if (e.key === '-') zoomTo(scale - ZOOM_STEP);
    if (e.key === '0') resetScale();
    if (e.key === 'ArrowDown') vp.scrollBy({ top: 120, behavior: 'smooth' });
    if (e.key === 'ArrowUp')   vp.scrollBy({ top: -120, behavior: 'smooth' });
  });

  /* ── Привязка карточек ── */
  function bindCards() {
    document.querySelectorAll('.pf:not([data-pf-bound])').forEach(card => {
      card.setAttribute('data-pf-bound', '1');
      card.addEventListener('click', () => {
        const i = card.querySelector('img');
        if (i && i.src) open(i.src, i.alt);
      });
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
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

  window.projectFrames = { open, close, rebind: bindCards, zoom: zoomTo, reset: resetScale };

})();