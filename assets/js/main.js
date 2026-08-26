/* ============================================================
   MAIN.JS — полная сборка
   1. Навигация + мобильное меню
   2. Контактная форма + Telegram
   3. Newsletter + Telegram
   4. Посетитель-уведомление Telegram
   5. Fade-up анимации
   6. Счётчики
   7. Кастомный курсор
   8. Case subnav
   9. Scroll reveal + progress bar
   10. Load More (галерея)
   11. Фильтр проектов
   12. Project Frames — модалка с свайпом, pinch zoom, галерея
   13. Page Transitions + Loader
   ============================================================ */

/* ── ОСНОВНОЕ ПРИЛОЖЕНИЕ ── */
(function () {

  var isTouch = (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  window.addEventListener('load', function(){ document.body.classList.add('is-loaded'); });

  /* ── 2. НАВИГАЦИЯ ── */
  var headerPlaceholder = document.getElementById('header-placeholder');
  if (headerPlaceholder) {
    fetch('/header.html').then(function(r){ if(!r.ok) throw new Error('no header'); return r.text(); }).then(function(html){ headerPlaceholder.outerHTML = html; initNav(); }).catch(function(){ headerPlaceholder.style.display='none'; initNav(); });
  } else {
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initNav) : initNav();
  }

  function initNav() {
    var nav = document.getElementById('topnav');
    var burger = document.getElementById('burger');
    if (nav) {
      function syncNavH(){ document.documentElement.style.setProperty('--navH', nav.getBoundingClientRect().height+'px'); }
      syncNavH(); window.addEventListener('resize', syncNavH, { passive:true });
      function onScroll(){ nav.classList.toggle('scrolled', window.scrollY > 40); }
      window.addEventListener('scroll', onScroll, { passive:true }); onScroll();
    }
    var mobileMenu = document.getElementById('mobileMenu');
    var mobileClose = document.getElementById('mobileClose');
    if (burger && !mobileMenu) {
      mobileMenu = document.createElement('div'); mobileMenu.id='mobileMenu'; mobileMenu.className='mobile-menu';
      mobileMenu.innerHTML='<div class="mobile-menu-panel"><div class="mobile-menu-top"><button class="mobile-close" id="mobileClose" aria-label="Close">✕</button></div><nav class="mobile-menu-links"><a href="/index.html">Home</a><a href="/about.html">About</a><a href="/contactus.html">Contact</a></nav></div>';
      document.body.appendChild(mobileMenu); mobileClose = document.getElementById('mobileClose');
    }
    function openMenu(){ if(mobileMenu) mobileMenu.classList.add('open'); document.body.style.overflow='hidden'; }
    function closeMenu(){ if(mobileMenu) mobileMenu.classList.remove('open'); document.body.style.overflow=''; }
    if (burger) {
      var burgerTouched=false;
      burger.addEventListener('touchend',function(e){e.preventDefault();burgerTouched=true;openMenu();},{passive:false});
      burger.addEventListener('click',function(){if(burgerTouched){burgerTouched=false;return;}openMenu();});
    }
    if (mobileClose) {
      var closeTouched=false;
      mobileClose.addEventListener('touchend',function(e){e.preventDefault();closeTouched=true;closeMenu();},{passive:false});
      mobileClose.addEventListener('click',function(){if(closeTouched){closeTouched=false;return;}closeMenu();});
    }
    if (mobileMenu) {
      mobileMenu.addEventListener('click',function(e){if(e.target===mobileMenu)closeMenu();});
      mobileMenu.addEventListener('touchend',function(e){if(e.target===mobileMenu)closeMenu();},{passive:true});
    }
    var page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.menu a, .mobile-menu-links a').forEach(function(link){
      link.classList.remove('active');
      var href=link.getAttribute('href')||'', lp=href.split('/').pop();
      if(!lp) return;
      if(lp===page){link.classList.add('active');return;}
      if((page===''||page==='index.html')&&(lp==='index.html'||href==='/'||href==='../'||href==='./')) link.classList.add('active');
    });
  }

  /* ── 3. КОНТАКТНАЯ ФОРМА + Telegram ── */
  var form = document.getElementById('contactForm');
  var popup = document.getElementById('popup');
  var popupClose = document.getElementById('popupClose');
  if (form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var submitBtn = form.querySelector('.send-btn');
      submitBtn.textContent='Sending...'; submitBtn.disabled=true;
      var data = {
        firstName: (document.getElementById('firstName')||{}).value||'',
        lastName:  (document.getElementById('lastName') ||{}).value||'',
        email:     (document.getElementById('email')    ||{}).value||'',
        message:   (document.getElementById('message')  ||{}).value||'',
      };
      /* Telegram-уведомление теперь отправляет notify.js (в личный чат). */
      Promise.all([
        fetch('https://api.emailjs.com/api/v1.0/email/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({service_id:'service_ewg5w2n',template_id:'template_ce4qo7t',user_id:'mJztgAOONni1NaDaq',template_params:data})}),
      ])
      .then(function(){ form.reset(); if(popup) popup.classList.add('show'); })
      .catch(function(){ if(popup) popup.classList.add('show'); })
      .finally(function(){
        submitBtn.innerHTML='Send Message <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>';
        submitBtn.disabled=false;
      });
    });
  }
  if (popupClose) popupClose.addEventListener('click', function(){ popup.classList.remove('show'); });
  if (popup) popup.addEventListener('click', function(e){ if(e.target===popup) popup.classList.remove('show'); });

  /* ── 4. NEWSLETTER + Telegram ── */
  var nlForm = document.getElementById('newsletterForm');
  var nlEmail = document.getElementById('newsletterEmail');
  if (nlForm) {
    nlForm.addEventListener('submit', function(e){
      e.preventDefault();
      /* Telegram-уведомление о подписке отправляет notify.js. */
      if (nlEmail) nlEmail.value='';
    });
  }

  /* ── 5. Посетитель-уведомление → перенесено в notify.js (на все страницы, в личный чат) ── */

  /* ── 6. FADE-UP АНИМАЦИИ ── */
  document.addEventListener('DOMContentLoaded', function(){
    var fuEls = document.querySelectorAll('.fu');
    if (!fuEls.length) return;
    fuEls.forEach(function(el){ if(el.getBoundingClientRect().top < window.innerHeight){ el.style.transition='none'; el.style.opacity='1'; el.style.transform='none'; el.classList.add('vis'); } });
    requestAnimationFrame(function(){ requestAnimationFrame(function(){
      document.body.classList.add('fu-ready');
      fuEls.forEach(function(el){ if(el.classList.contains('vis')){ el.style.transition=''; el.style.opacity=''; el.style.transform=''; } });
      var io = new IntersectionObserver(function(entries){ entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('vis'); io.unobserve(e.target); } }); },{ threshold:0.05 });
      fuEls.forEach(function(el){ if(!el.classList.contains('vis')) io.observe(el); });
    }); });
  });

  /* ── 7. СЧЁТЧИКИ ── */
  document.querySelectorAll('[data-target]').forEach(function(el){
    new IntersectionObserver(function(entries){
      if(!entries[0].isIntersecting) return;
      var target=parseFloat(el.dataset.target), suffix=el.dataset.suffix||'', isFloat=target%1!==0, start=performance.now();
      (function tick(now){ var p=Math.min((now-start)/1800,1), v=(1-Math.pow(1-p,3))*target; el.textContent=(isFloat?v.toFixed(1):Math.floor(v))+suffix; if(p<1) requestAnimationFrame(tick); })(start);
    },{threshold:0.5}).observe(el);
  });

  /* ── 8. КАСТОМНЫЙ КУРСОР ── */
  if (!isTouch) {
    var cursor=document.getElementById('dinCursor'), ring=document.getElementById('dinCursorRing');
    if (cursor && ring) {
      var mx=-999,my=-999,rx=-999,ry=-999,moved=false;
      cursor.style.cssText+=';left:-999px;top:-999px;opacity:0'; ring.style.cssText+=';left:-999px;top:-999px;opacity:0';
      document.addEventListener('mousemove',function(e){ mx=e.clientX;my=e.clientY; cursor.style.left=mx+'px'; cursor.style.top=my+'px'; if(!moved){moved=true;cursor.style.opacity='1';ring.style.opacity='1';} },{passive:true});
      (function animRing(){ rx+=(mx-rx)*0.09; ry+=(my-ry)*0.09; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(animRing); })();
    }
  }

  /* ── 10. SCROLL REVEAL + PROGRESS BAR ── */
  document.addEventListener('DOMContentLoaded', function(){
    var bar=document.getElementById('progressBar')||document.getElementById('psProgress')||document.getElementById('ubProgress');
    if (bar) window.addEventListener('scroll',function(){ var total=document.documentElement.scrollHeight-window.innerHeight; if(total>0) bar.style.width=(window.scrollY/total)*100+'%'; },{passive:true});
    var ro=new IntersectionObserver(function(entries){ entries.forEach(function(e){ if(e.isIntersecting){e.target.classList.add('revealed');ro.unobserve(e.target);} }); },{threshold:0.07});
    document.querySelectorAll('[data-reveal]').forEach(function(el){ ro.observe(el); });
  });

  /* ── 11. LOAD MORE ── */
  document.addEventListener('DOMContentLoaded', function(){
    var SHOW=6,STEP=3,cards=Array.from(document.querySelectorAll('.gallery-grid .card')),btn=document.getElementById('loadMoreBtn');
    if(!btn||!cards.length) return;
    var shown=0;
    function render(){ cards.forEach(function(c,i){c.style.display=i<shown?'':'none';}); btn.style.display=shown>=cards.length?'none':''; }
    btn.addEventListener('click',function(){ shown=Math.min(shown+STEP,cards.length); render(); });
    shown=Math.min(SHOW,cards.length); render();
  });

  /* ── 12. ФИЛЬТР ПРОЕКТОВ ── */
  document.addEventListener('DOMContentLoaded', function(){
    var filterBtns=document.querySelectorAll('.f-btn'),filterCards=document.querySelectorAll('.gallery-grid .card');
    if(!filterBtns.length) return;
    filterBtns.forEach(function(btn){
      btn.addEventListener('click',function(){
        var filter=btn.dataset.filter;
        filterBtns.forEach(function(b){b.classList.remove('active');}); btn.classList.add('active');
        filterCards.forEach(function(c){
          var match=filter==='all'||c.dataset.category===filter;
          c.style.opacity='0'; c.style.transform='translateY(10px)'; c.style.transition='opacity .2s, transform .2s';
          setTimeout(function(){ c.style.display=match?'':'none'; if(match) requestAnimationFrame(function(){c.style.opacity='1';c.style.transform='none';}); },150);
        });
      });
    });
  });

})();


/* ── 9. CASE SUBNAV ── */
(function initCaseSubnav() {
  var subnav = document.querySelector('[data-case-subnav]');
  if (!subnav) return;
  document.body.classList.add('has-case-subnav');
  function syncH(){ document.documentElement.style.setProperty('--caseSubnavH', subnav.offsetHeight+'px'); }
  syncH(); window.addEventListener('resize', syncH, { passive:true });
  var links=Array.from(subnav.querySelectorAll('a[href^="#"]')), sections=Array.from(document.querySelectorAll('.case-section[id]'));
  if(!links.length||!sections.length) return;
  function getOffset(){ var nav=document.getElementById('topnav'), navH=nav?nav.offsetHeight:64; return navH+subnav.offsetHeight+32; }
  function updateActive(){
    var offset=getOffset(), scrollY=window.scrollY, current=sections[0].id;
    sections.forEach(function(sec){ var top=sec.getBoundingClientRect().top+scrollY-offset; if(scrollY>=top) current=sec.id; });
    links.forEach(function(l){ l.classList.toggle('active', l.getAttribute('href')==='#'+current); });
    var pill=subnav.querySelector('.case-subnav-pill');
    if(pill){ var active=pill.querySelector('.active'); if(active) active.scrollIntoView({inline:'nearest',block:'nearest'}); }
  }
  window.addEventListener('scroll', updateActive, { passive:true }); updateActive();
  links.forEach(function(a){
    a.addEventListener('click',function(e){
      var href=a.getAttribute('href'), target=href?document.querySelector(href):null;
      if(!target) return; e.preventDefault();
      window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-getOffset(),behavior:'smooth'});
    });
  });
})();


/* ============================================================
   13. PROJECT FRAMES v5
   ============================================================ */
(function () {
  'use strict';
  var _observing=false, _rafPending=false;

  if (!document.getElementById('pf-styles')) {
    const css=document.createElement('style'); css.id='pf-styles';
    css.textContent=`
      .pf-modal{display:none;position:fixed;inset:0;z-index:99000;align-items:center;justify-content:center;padding:12px}
      .pf-modal.is-open{display:flex;animation:pfIn .22s ease}
      @keyframes pfIn{from{opacity:0}to{opacity:1}}
      .pf-modal__backdrop{position:absolute;inset:0;background:rgba(0,0,0,.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);cursor:pointer}
      .pf-modal__card{position:relative;z-index:1;display:flex;flex-direction:column;width:min(94vw,1280px);max-height:92vh;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.12);box-shadow:0 40px 120px rgba(0,0,0,.9);background:#0c0c0c;animation:pfSlide .28s cubic-bezier(.4,0,.2,1);will-change:transform}
      .pf-modal__card.snapping{transition:transform .3s cubic-bezier(.4,0,.2,1),opacity .3s ease}
      .pf-modal__card.sliding{transition:transform .25s cubic-bezier(.4,0,.2,1),opacity .2s ease}
      @keyframes pfSlide{from{transform:translateY(20px) scale(.97);opacity:0}to{transform:none;opacity:1}}
      .pf-modal__handle{display:none;width:36px;height:4px;border-radius:99px;background:rgba(255,255,255,.28);margin:10px auto 6px;flex-shrink:0;cursor:grab}
      @media(max-width:768px){.pf-modal{align-items:flex-end;padding:0}.pf-modal__card{width:100%;max-height:95vh;border-radius:20px 20px 0 0;border-bottom:none}.pf-modal__handle{display:block}}
      .pf-modal__bar{display:flex;align-items:center;gap:6px;padding:8px 12px;flex-shrink:0;background:rgba(0,0,0,.75);border-bottom:1px solid rgba(255,255,255,.07);user-select:none;position:sticky;top:0;z-index:2}
      .pf-bar-hint{font-size:11px;color:rgba(255,255,255,.3);font-family:'Space Mono',monospace;margin-right:auto;display:none}
      @media(min-width:640px){.pf-bar-hint{display:block}}
      .pf-counter{font-family:'Space Mono',monospace;font-size:11px;color:rgba(255,255,255,.35);margin-right:auto;display:none}
      .pf-counter.visible{display:block}
      .pf-btn{width:34px;height:34px;border-radius:9px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.07);color:rgba(255,255,255,.85);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s,transform .1s;flex-shrink:0}
      @media(max-width:640px){.pf-btn{width:38px;height:38px;font-size:20px}}
      .pf-btn:active{transform:scale(.9);background:rgba(255,255,255,.18)}
      .pf-btn--close:active{background:rgba(255,50,50,.3)}
      .pf-btn:disabled{opacity:.25;cursor:default;pointer-events:none}
      .pf-zoom-val{font-family:'Space Mono',monospace;font-size:12px;color:rgba(255,255,255,.5);min-width:44px;text-align:center}
      .pf-nav-btn{position:absolute;top:50%;z-index:10;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.22);background:rgba(0,0,0,.6);color:rgba(255,255,255,.85);font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,opacity .2s;backdrop-filter:blur(8px)}
      .pf-nav-btn:hover{background:rgba(255,255,255,.15)}
      .pf-nav-btn:disabled{opacity:0;pointer-events:none}
      .pf-nav-btn--prev{left:12px}.pf-nav-btn--next{right:12px}
      @media(max-width:768px){.pf-nav-btn{display:none}}
      .pf-modal__vp{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;position:relative;background:#0c0c0c;touch-action:pan-y pinch-zoom;cursor:default}
      .pf-modal__vp::-webkit-scrollbar{width:4px}
      .pf-modal__vp::-webkit-scrollbar-track{background:rgba(255,255,255,.04)}
      .pf-modal__vp::-webkit-scrollbar-thumb{background:rgba(255,255,255,.22);border-radius:2px}
      .pf-modal__img{display:block;width:100%;height:auto;object-fit:contain;user-select:none;-webkit-user-drag:none;transition:opacity .18s ease}
      .pf-modal__img.fading{opacity:0}
      .pf-loading{display:flex;align-items:center;justify-content:center;padding:48px;width:100%}
      .pf-loading::before{content:'';width:32px;height:32px;border-radius:50%;border:2px solid rgba(255,255,255,.12);border-top-color:rgba(255,255,255,.6);animation:pfSpin .7s linear infinite}
      @keyframes pfSpin{to{transform:rotate(360deg)}}
      .pf-swipe-hint{position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.7);color:rgba(255,255,255,.75);font-size:12px;padding:8px 18px;border-radius:999px;pointer-events:none;z-index:99001;animation:pfHint 3s ease forwards}
      @keyframes pfHint{0%{opacity:0;transform:translateX(-50%) translateY(8px)}15%{opacity:1;transform:translateX(-50%) translateY(0)}80%{opacity:1}100%{opacity:0;transform:translateX(-50%) translateY(-4px)}}
      .pf-slide-indicator{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:48px;pointer-events:none;z-index:20;opacity:0;transition:opacity .15s}
      .pf-slide-indicator.show{opacity:0.6}
    `;
    document.head.appendChild(css);
  }

  if (!document.getElementById('pfModal')) {
    document.body.insertAdjacentHTML('beforeend',`
      <div class="pf-modal" id="pfModal" aria-hidden="true" role="dialog" aria-modal="true">
        <div class="pf-modal__backdrop" id="pfBackdrop"></div>
        <div class="pf-modal__card" id="pfCard">
          <div class="pf-modal__handle" id="pfHandle"></div>
          <div class="pf-modal__bar">
            <span class="pf-bar-hint">scroll · swipe ← → · pinch zoom</span>
            <span class="pf-counter" id="pfCounter"></span>
            <button class="pf-btn" id="pfZoomOut" title="Zoom out">−</button>
            <span class="pf-zoom-val" id="pfZoomVal">100%</span>
            <button class="pf-btn" id="pfZoomIn" title="Zoom in">+</button>
            <button class="pf-btn" id="pfReset" title="Reset">⊡</button>
            <button class="pf-btn" id="pfDownload" title="Download">⬇</button>
            <button class="pf-btn pf-btn--close" id="pfClose" aria-label="Close">✕</button>
          </div>
          <div class="pf-modal__vp" id="pfVp">
            <button class="pf-nav-btn pf-nav-btn--prev" id="pfPrev">‹</button>
            <button class="pf-nav-btn pf-nav-btn--next" id="pfNext">›</button>
            <div class="pf-loading" id="pfLoading"></div>
            <img class="pf-modal__img" id="pfImg" src="" alt="Preview" draggable="false" style="display:none">
            <div class="pf-slide-indicator" id="pfSlideInd"></div>
          </div>
        </div>
      </div>
    `);
  }

  _observing = true;

  const modal=document.getElementById('pfModal'), card=document.getElementById('pfCard');
  const img=document.getElementById('pfImg'), vp=document.getElementById('pfVp');
  const loading=document.getElementById('pfLoading'), backdrop=document.getElementById('pfBackdrop');
  const closeBtn=document.getElementById('pfClose'), zoomInB=document.getElementById('pfZoomIn');
  const zoomOutB=document.getElementById('pfZoomOut'), resetB=document.getElementById('pfReset');
  const downloadBtn=document.getElementById('pfDownload');
  const zoomLbl=document.getElementById('pfZoomVal'), prevBtn=document.getElementById('pfPrev');
  const nextBtn=document.getElementById('pfNext'), counter=document.getElementById('pfCounter');
  const slideInd=document.getElementById('pfSlideInd');
  let gallery=[], currentIdx=0;

  function buildGallery(clickedCard){
    const container=clickedCard.closest('.pf-grid,.pf-grid--ba,.pf-grid--mobile,.pf-grid--mobile-2,[data-pf-gallery]')||clickedCard.parentElement;
    const cards=container?Array.from(container.querySelectorAll('.pf[data-pf-bound]')):[clickedCard];
    gallery=cards.filter(c=>{const i=c.querySelector('img');return i&&i.src;});
    currentIdx=gallery.indexOf(clickedCard); if(currentIdx<0) currentIdx=0;
  }
  function updateNav(){
    if(gallery.length<=1){prevBtn.disabled=true;nextBtn.disabled=true;counter.classList.remove('visible');}
    else{prevBtn.disabled=currentIdx<=0;nextBtn.disabled=currentIdx>=gallery.length-1;counter.textContent=(currentIdx+1)+' / '+gallery.length;counter.classList.add('visible');}
  }
  function showImage(src,alt){
    img.classList.add('fading'); loading.style.display='flex'; img.style.display='none';
    const tmpImg=new Image();
    tmpImg.onload=function(){img.src=src;img.alt=alt||'';loading.style.display='none';img.style.display='block';img.classList.remove('fading');vp.scrollTop=0;resetScale();};
    tmpImg.onerror=function(){img.src=src;loading.style.display='none';img.style.display='block';img.classList.remove('fading');};
    tmpImg.src=src;
  }
  function goTo(idx){if(idx<0||idx>=gallery.length)return;currentIdx=idx;const c=gallery[currentIdx],i=c.querySelector('img');if(i)showImage(i.src,i.alt);updateNav();}
  function goPrev(){goTo(currentIdx-1);} function goNext(){goTo(currentIdx+1);}
  prevBtn.addEventListener('click',goPrev); nextBtn.addEventListener('click',goNext);
  downloadBtn.addEventListener('click', function(){
  if (!img.src) return;
  var url = img.src;
  var filename = url.split('/').pop().split('?')[0] || 'image.png';
  fetch(url)
    .then(function(res){ return res.blob(); })
    .then(function(blob){
      var blobUrl = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function(){ URL.revokeObjectURL(blobUrl); }, 1000);
    })
    .catch(function(){ window.open(url, '_blank'); });
});

  let scale=1; const MIN_SCALE=0.5,MAX_SCALE=6,ZOOM_STEP=0.4;
  function applyScale(){img.style.transform=`scale(${scale})`;img.style.transformOrigin='top center';img.style.width=scale<1?`${100/scale}%`:'100%';zoomLbl.textContent=Math.round(scale*100)+'%';}
  function zoomTo(ns){scale=Math.min(Math.max(ns,MIN_SCALE),MAX_SCALE);applyScale();}
  function resetScale(){scale=1;applyScale();}
  zoomInB.onclick=()=>zoomTo(scale+ZOOM_STEP); zoomOutB.onclick=()=>zoomTo(scale-ZOOM_STEP); resetB.onclick=()=>{resetScale();vp.scrollTop=0;};
  vp.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey){e.preventDefault();zoomTo(scale+(e.deltaY<0?ZOOM_STEP:-ZOOM_STEP));}},{passive:false});

  let pinchStartDist=null,pinchStartScale=1;
  vp.addEventListener('touchstart',e=>{if(e.touches.length===2){pinchStartDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);pinchStartScale=scale;e.preventDefault();}},{passive:false});
  vp.addEventListener('touchmove',e=>{if(e.touches.length===2&&pinchStartDist){const dist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);zoomTo(pinchStartScale*(dist/pinchStartDist));e.preventDefault();}},{passive:false});
  vp.addEventListener('touchend',()=>{pinchStartDist=null;});

  const SWIPE_CLOSE_Y=90,SWIPE_NAV_X=50,LOCK_ANGLE=30;
  let touchStartX=0,touchStartY=0,touchDX=0,touchDY=0,swipeDir=null,swipeLocked=false,velX=0,lastTouchX=0,lastTouchT=0;
  function showIndicator(dir){slideInd.textContent=dir==='prev'?'‹':'›';slideInd.classList.add('show');clearTimeout(slideInd._t);slideInd._t=setTimeout(()=>slideInd.classList.remove('show'),400);}

  vp.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;touchStartX=e.touches[0].clientX;touchStartY=e.touches[0].clientY;touchDX=touchDY=0;swipeDir=null;swipeLocked=false;velX=0;lastTouchX=touchStartX;lastTouchT=Date.now();card.classList.remove('snapping','sliding');},{passive:true});
  vp.addEventListener('touchmove',e=>{
    if(e.touches.length!==1||swipeLocked)return;
    const dx=e.touches[0].clientX-touchStartX,dy=e.touches[0].clientY-touchStartY;
    touchDX=dx;touchDY=dy;
    const now=Date.now(),dt=now-lastTouchT;if(dt>0)velX=(e.touches[0].clientX-lastTouchX)/dt;
    lastTouchX=e.touches[0].clientX;lastTouchT=now;
    if(!swipeDir){const absDX=Math.abs(dx),absDY=Math.abs(dy);if(absDX<8&&absDY<8)return;swipeDir=Math.atan2(absDY,absDX)*180/Math.PI<LOCK_ANGLE?'x':'y';}
    if(swipeDir==='x'&&scale===1){e.preventDefault();const atStart=currentIdx===0&&dx>0,atEnd=currentIdx===gallery.length-1&&dx<0;card.style.transform=`translateX(${(atStart||atEnd)?dx*0.18:dx}px)`;card.style.opacity='';}
    else if(swipeDir==='y'&&touchDY>0&&vp.scrollTop<=0){card.style.transform=`translateY(${touchDY*0.45}px)`;card.style.opacity=String(Math.max(0.4,1-touchDY/280));}
  },{passive:false});
  vp.addEventListener('touchend',()=>{
    if(swipeLocked)return;swipeLocked=true;
    if(swipeDir==='x'&&scale===1){
      card.classList.add('sliding');card.style.opacity='';const fastFlick=Math.abs(velX)>0.4;
      if((touchDX<-SWIPE_NAV_X||(fastFlick&&velX<0))&&currentIdx<gallery.length-1){card.style.transform='translateX(-48px)';setTimeout(()=>{card.classList.remove('sliding');card.style.transform='';goNext();showIndicator('next');},220);}
      else if((touchDX>SWIPE_NAV_X||(fastFlick&&velX>0))&&currentIdx>0){card.style.transform='translateX(48px)';setTimeout(()=>{card.classList.remove('sliding');card.style.transform='';goPrev();showIndicator('prev');},220);}
      else{card.style.transform='';setTimeout(()=>card.classList.remove('sliding'),300);}
    } else if(swipeDir==='y'&&touchDY>SWIPE_CLOSE_Y&&vp.scrollTop<=0){card.classList.add('snapping');card.style.transform='translateY(110%)';card.style.opacity='0';setTimeout(close,280);}
    else{card.classList.add('snapping');card.style.transform='';card.style.opacity='';setTimeout(()=>card.classList.remove('snapping'),320);}
    touchDX=touchDY=0;swipeDir=null;
  },{passive:true});

  /* ── POINTER DRAG SWIPE (десктоп) ── */
let ptrDown = false, ptrStartX = 0, ptrStartY = 0, ptrDX = 0, ptrDY = 0, ptrSwipeDir = null, ptrVelX = 0, lastPtrX = 0, lastPtrT = 0, activePtrId = null;

vp.addEventListener('pointerdown', function(e){
  if (e.pointerType !== 'mouse') return; // touch уже обрабатывается отдельно
  if (scale !== 1) return;
  if (e.target.closest('.pf-nav-btn, .pf-btn')) return;
  ptrDown = true; activePtrId = e.pointerId;
  ptrStartX = e.clientX; ptrStartY = e.clientY;
  ptrDX = ptrDY = 0; ptrSwipeDir = null; ptrVelX = 0;
  lastPtrX = ptrStartX; lastPtrT = Date.now();
  card.classList.remove('snapping', 'sliding');
  vp.style.cursor = 'grabbing';
  vp.setPointerCapture(e.pointerId);
  e.preventDefault();
});

vp.addEventListener('pointermove', function(e){
  if (!ptrDown || e.pointerId !== activePtrId) return;
  const dx = e.clientX - ptrStartX, dy = e.clientY - ptrStartY;
  ptrDX = dx; ptrDY = dy;
  const now = Date.now(), dt = now - lastPtrT;
  if (dt > 0) ptrVelX = (e.clientX - lastPtrX) / dt;
  lastPtrX = e.clientX; lastPtrT = now;

  if (!ptrSwipeDir) {
    const absDX = Math.abs(dx), absDY = Math.abs(dy);
    if (absDX < 6 && absDY < 6) return;
    ptrSwipeDir = absDX > absDY ? 'x' : 'y';
  }

  if (ptrSwipeDir === 'x' && scale === 1) {
    const atStart = currentIdx === 0 && dx > 0, atEnd = currentIdx === gallery.length - 1 && dx < 0;
    card.style.transform = `translateX(${(atStart || atEnd) ? dx * 0.18 : dx}px)`;
  }
});

function endPointerDrag(e){
  if (!ptrDown || (e && e.pointerId !== activePtrId)) return;
  ptrDown = false;
  vp.style.cursor = 'grab';
  if (activePtrId !== null) { try { vp.releasePointerCapture(activePtrId); } catch(err){} }
  activePtrId = null;

  if (ptrSwipeDir === 'x' && scale === 1) {
    card.classList.add('sliding');
    const fastFlick = Math.abs(ptrVelX) > 0.4;
    if ((ptrDX < -SWIPE_NAV_X || (fastFlick && ptrVelX < 0)) && currentIdx < gallery.length - 1) {
      card.style.transform = 'translateX(-48px)';
      setTimeout(() => { card.classList.remove('sliding'); card.style.transform = ''; goNext(); showIndicator('next'); }, 220);
    } else if ((ptrDX > SWIPE_NAV_X || (fastFlick && ptrVelX > 0)) && currentIdx > 0) {
      card.style.transform = 'translateX(48px)';
      setTimeout(() => { card.classList.remove('sliding'); card.style.transform = ''; goPrev(); showIndicator('prev'); }, 220);
    } else {
      card.style.transform = '';
      setTimeout(() => card.classList.remove('sliding'), 300);
    }
  }
  ptrDX = ptrDY = 0; ptrSwipeDir = null;
}

vp.addEventListener('pointerup', endPointerDrag);
vp.addEventListener('pointercancel', endPointerDrag);

var isTouchPF = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
if (!isTouchPF) {
  vp.style.cursor = 'grab';
}


  let hintShown=false;
  function open(clickedCard){
    buildGallery(clickedCard);resetScale();
    card.style.transform='';card.style.opacity='';card.classList.remove('snapping','sliding');
    img.style.display='none';loading.style.display='flex';
    modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
    const c=gallery[currentIdx],i=c?c.querySelector('img'):null;
    if(i){
      img.onload=()=>{
        loading.style.display='none';img.style.display='block';vp.scrollTop=0;
        if(!hintShown&&window.innerWidth<768){hintShown=true;const h=document.createElement('div');h.className='pf-swipe-hint';h.textContent=gallery.length>1?'← → свайп · ↓ скролл · потяни вниз чтобы закрыть':'↓ скролл · потяни вниз чтобы закрыть';document.body.appendChild(h);setTimeout(()=>h.remove(),3500);}
      };
      img.onerror=()=>{loading.style.display='none';img.style.display='block';};
      img.alt=i.alt||'';img.src=i.src;
    }
    updateNav();closeBtn.focus();
  }
  function close(){
    modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';
    card.style.transform='';card.style.opacity='';card.classList.remove('snapping','sliding');
    setTimeout(()=>{img.src='';img.style.display='none';loading.style.display='flex';resetScale();gallery=[];},280);
  }
  backdrop.addEventListener('click',close);closeBtn.addEventListener('click',close);
  document.addEventListener('keydown',e=>{
    if(!modal.classList.contains('is-open'))return;
    if(e.key==='Escape')close();if(e.key==='+'||e.key==='=')zoomTo(scale+ZOOM_STEP);if(e.key==='-')zoomTo(scale-ZOOM_STEP);if(e.key==='0')resetScale();
    if(e.key==='ArrowDown')vp.scrollBy({top:120,behavior:'smooth'});if(e.key==='ArrowUp')vp.scrollBy({top:-120,behavior:'smooth'});
    if(e.key==='ArrowRight')goNext();if(e.key==='ArrowLeft')goPrev();
  });

  function bindCards(){
    document.querySelectorAll('.pf:not([data-pf-bound])').forEach(c=>{
      c.setAttribute('data-pf-bound','1');c.addEventListener('click',()=>open(c));
      c.setAttribute('role','button');c.setAttribute('tabindex','0');
      c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(c);}});
    });
  }
  bindCards();

  new MutationObserver(function(mutations){
    if(!_observing)return;var hasNew=false;
    for(var i=0;i<mutations.length;i++){var nodes=mutations[i].addedNodes;for(var j=0;j<nodes.length;j++){var n=nodes[j];if(n.nodeType!==1||n.id==='pfModal'||n.id==='pf-styles')continue;if((n.classList&&n.classList.contains('pf')&&!n.dataset.pfBound)||(n.querySelector&&n.querySelector('.pf:not([data-pf-bound])'))){hasNew=true;break;}}if(hasNew)break;}
    if(!hasNew||_rafPending)return;_rafPending=true;requestAnimationFrame(function(){_rafPending=false;bindCards();});
  }).observe(document.body,{childList:true,subtree:true});

  window.projectFrames={open,close,rebind:bindCards,zoom:zoomTo,reset:resetScale,next:goNext,prev:goPrev};

  /* ── 14. PAGE TRANSITIONS ── */
window.addEventListener('load', function () {
  document.body.style.opacity = '1';
});
window.addEventListener('pageshow', function (e) {
  if (e.persisted) document.body.style.opacity = '1';
});

})();