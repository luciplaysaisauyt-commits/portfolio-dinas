/* ============================================================
   INDEX.JS — DIN Logo Particle Assembly (optimized)
   ============================================================ */
(function () {

  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], logoPoints = [];
  let assembled = false;
  let assembleTimer = null;
  const mouse = { x: -9999, y: -9999, active: false };

  // ── Pre-cached glow sprites ──
  const glowCache = {};
  function getGlowSprite(r, g, b, radius) {
    const key = `${r}_${g}_${b}_${Math.round(radius)}`;
    if (glowCache[key]) return glowCache[key];
    const size = Math.ceil(radius * 2);
    const oc   = document.createElement('canvas');
    oc.width   = size; oc.height = size;
    const otx  = oc.getContext('2d');
    const grad = otx.createRadialGradient(size/2, size/2, 0, size/2, size/2, radius);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.85)`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    otx.fillStyle = grad;
    otx.fillRect(0, 0, size, size);
    glowCache[key] = oc;
    return oc;
  }

  const CFG = {
    count:         2200,   // меньше частиц = плавнее
    logoScale:     0.60,
    repulse:       150,
    repulseForce:  8,
    assembleDelay: 600,
    assembleSpeed: 0.055,
    scatterSpeed:  0.003,
  };

  const COLORS = [
    [200, 169, 110],
    [220, 190, 130],
    [245, 215, 155],
    [255, 235, 175],
    [210, 140,  80],
    [230, 160, 100],
    [255, 200, 150],
    [240, 180, 120],
    [255, 250, 220],
    [180, 130,  70],
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function sampleLogo(cb) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/assets/images/DIN.png';
    img.onload = () => {
      const logoH = H * CFG.logoScale;
      const logoW = (img.width / img.height) * logoH;
      const cx    = W * 0.65;
      const cy    = H * 0.50;

      const tmp  = document.createElement('canvas');
      tmp.width  = Math.floor(logoW);
      tmp.height = Math.floor(logoH);
      const tc   = tmp.getContext('2d');
      tc.fillStyle = '#000';
      tc.fillRect(0, 0, tmp.width, tmp.height);
      tc.drawImage(img, 0, 0, tmp.width, tmp.height);

      const data = tc.getImageData(0, 0, tmp.width, tmp.height).data;
      const pts  = [];
      const step = 4;
      for (let y = 0; y < tmp.height; y += step) {
        for (let x = 0; x < tmp.width; x += step) {
          const i = (y * tmp.width + x) * 4;
          if ((data[i] + data[i+1] + data[i+2]) / 3 > 80) {
            pts.push({ x: cx - logoW / 2 + x, y: cy - logoH / 2 + y });
          }
        }
      }
      logoPoints = pts;
      cb();
    };
    img.onerror = () => { logoPoints = []; cb(); };
  }

  class Particle {
    constructor(targetIdx) {
      this.colIdx   = Math.floor(Math.random() * COLORS.length);
      this.col      = COLORS[this.colIdx];
      this.size     = Math.random() * 1.4 + 0.3;
      this.glow     = Math.random() < 0.06;
      this.gr       = Math.ceil(this.size * (Math.random() * 5 + 3));

      if (logoPoints.length && targetIdx < logoPoints.length) {
        this.tx     = logoPoints[targetIdx].x;
        this.ty     = logoPoints[targetIdx].y;
        this.isLogo = true;
      } else {
        const a     = Math.random() * Math.PI * 2;
        const r     = Math.random() * Math.min(W, H) * 0.42 + Math.min(W,H) * 0.08;
        this.tx     = W * 0.65 + Math.cos(a) * r * 0.6;
        this.ty     = H * 0.50 + Math.sin(a) * r;
        this.isLogo = false;
      }

      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - .5) * 3;
      this.vy = (Math.random() - .5) * 3;
      this.alpha = Math.random() * 0.25 + 0.05;
      this.ta    = this.alpha;

      const edge = Math.floor(Math.random() * 4);
      if      (edge === 0) { this.sx = Math.random() * W; this.sy = -20; }
      else if (edge === 1) { this.sx = W + 20; this.sy = Math.random() * H; }
      else if (edge === 2) { this.sx = Math.random() * W; this.sy = H + 20; }
      else                 { this.sx = -20; this.sy = Math.random() * H; }
    }

    update(assemble) {
      const dx   = mouse.x - this.x;
      const dy   = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repelled = dist < CFG.repulse && dist > 0 && mouse.active;

      if (repelled) {
        const f = (1 - dist / CFG.repulse) * CFG.repulseForce;
        this.vx -= (dx / dist) * f;
        this.vy -= (dy / dist) * f;
        this.ta  = Math.min(1, this.ta + .45);
      } else if (assemble) {
        this.vx += (this.tx - this.x) * CFG.assembleSpeed;
        this.vy += (this.ty - this.y) * CFG.assembleSpeed;
        this.col = COLORS[this.colIdx];
        this.ta  = this.isLogo
          ? Math.random() * 0.4 + 0.55
          : Math.random() * 0.12 + 0.06;
      } else {
        this.vx += (this.sx - this.x) * CFG.scatterSpeed;
        this.vy += (this.sy - this.y) * CFG.scatterSpeed;
        this.vx += (Math.random() - .5) * 0.35;
        this.vy += (Math.random() - .5) * 0.35;
        this.ta  = Math.random() * 0.18 + 0.04;
      }

      this.vx *= 0.88;
      this.vy *= 0.88;
      this.x  += this.vx;
      this.y  += this.vy;
      this.alpha += (this.ta - this.alpha) * 0.07;
    }

    draw() {
      const [r, g, b] = this.col;
      // Используем кешированный спрайт вместо createRadialGradient каждый кадр
      if (this.glow && this.alpha > 0.05) {
        const sprite = getGlowSprite(r, g, b, this.gr);
        ctx.globalAlpha = this.alpha * 0.8;
        ctx.drawImage(sprite, this.x - this.gr, this.y - this.gr);
      }
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = `rgb(${r},${g},${b})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function buildParticles() {
    particles = [];
    const logoCount = Math.min(logoPoints.length, Math.floor(CFG.count * 0.82));
    const rest      = CFG.count - logoCount;
    const step      = logoPoints.length > 0 ? logoPoints.length / logoCount : 1;
    for (let i = 0; i < logoCount; i++) particles.push(new Particle(Math.floor(i * step)));
    for (let i = 0; i < rest; i++)      particles.push(new Particle(9999999));
    assembled = false;
    clearTimeout(assembleTimer);
    assembleTimer = setTimeout(() => { assembled = true; }, CFG.assembleDelay);
  }

  function init() {
    resize();
    sampleLogo(() => { buildParticles(); loop(); });
  }

  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });
  window.addEventListener('mouseleave', () => {
    mouse.active = false; mouse.x = -9999; mouse.y = -9999;
  });
  window.addEventListener('touchmove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.touches[0].clientX - rect.left;
    mouse.y = e.touches[0].clientY - rect.top;
    mouse.active = true;
  }, { passive: true });
  window.addEventListener('touchend', () => { mouse.active = false; });

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const bx = e.clientX - rect.left;
    const by = e.clientY - rect.top;
    for (let i = 0; i < 60; i++) {
      const p = new Particle(9999999);
      p.x = bx; p.y = by;
      p.tx = bx + (Math.random() - .5) * 400;
      p.ty = by + (Math.random() - .5) * 400;
      p.sx = p.tx; p.sy = p.ty;
      const a = Math.random() * Math.PI * 2;
      const s = Math.random() * 8 + 3;
      p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s;
      p.alpha = 1; p.size = Math.random() * 2.5 + .5; p.glow = true;
      particles.push(p);
    }
    if (particles.length > CFG.count + 200) particles.splice(0, 60);
  });

  window.addEventListener('resize', () => { resize(); sampleLogo(() => buildParticles()); });

  function loop() {
    requestAnimationFrame(loop);
    ctx.fillStyle = 'rgba(8,8,8,0.13)';
    ctx.fillRect(0, 0, W, H);
    // Рисуем все точки одним beginPath для скорости
    for (let i = 0; i < particles.length; i++) particles[i].update(assembled);
    for (let i = 0; i < particles.length; i++) particles[i].draw();
  }

  init();

  // ════════════════════════════════════════
  // WORKS CARD SLIDER
  // ════════════════════════════════════════
  const track  = document.getElementById('wTrack');
  const wrap   = document.getElementById('wTrackWrap');
  const fill   = document.getElementById('wFill');
  const numEl  = document.getElementById('wNum');
  const totalEl= document.getElementById('wTotal');
  const prevBtn= document.getElementById('wPrev');
  const nextBtn= document.getElementById('wNext');
  const cards  = track ? Array.from(track.querySelectorAll('.wcard')) : [];
  const total  = cards.length;
  let current  = 0;

  if (track && cards.length) {
    if (totalEl) totalEl.textContent = String(total).padStart(2, '0');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        if (card.dataset.href) window.location.href = card.dataset.href;
      });
    });

    function update(idx) {
      current = Math.max(0, Math.min(idx, total - 1));
      if (numEl) numEl.textContent = String(current + 1).padStart(2, '0');
      if (fill)  fill.style.width  = `${((current + 1) / total) * 100}%`;
      const card = cards[current];
      if (card && wrap) {
        const cl = card.offsetLeft;
        const wl = wrap.getBoundingClientRect().left;
        const tl = track.getBoundingClientRect().left;
        wrap.scrollTo({ left: cl - (wl - tl) - 32, behavior: 'smooth' });
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => update(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => update(current + 1));
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') update(current + 1);
      if (e.key === 'ArrowLeft')  update(current - 1);
    });

    if (wrap) {
      wrap.addEventListener('scroll', () => {
        let closest = 0, minDist = Infinity;
        cards.forEach((c, i) => {
          const d = Math.abs(c.offsetLeft - wrap.scrollLeft - 32);
          if (d < minDist) { minDist = d; closest = i; }
        });
        if (closest !== current) {
          current = closest;
          if (numEl) numEl.textContent = String(current + 1).padStart(2, '0');
          if (fill)  fill.style.width  = `${((current + 1) / total) * 100}%`;
        }
      }, { passive: true });

      let isDragging = false, startX = 0, startScroll = 0;
      wrap.addEventListener('mousedown', e => {
        isDragging = true; startX = e.pageX; startScroll = wrap.scrollLeft;
        wrap.style.cursor = 'grabbing';
      });
      wrap.addEventListener('mousemove', e => {
        if (!isDragging) return;
        wrap.scrollLeft = startScroll - (e.pageX - startX);
      });
      ['mouseup', 'mouseleave'].forEach(ev =>
        wrap.addEventListener(ev, () => { isDragging = false; wrap.style.cursor = 'grab'; })
      );
    }

    const scrollLink = document.querySelector('.idx-scroll');
    if (scrollLink) {
      scrollLink.addEventListener('click', e => {
        e.preventDefault();
        const t = document.getElementById('works');
        if (t) t.scrollIntoView({ behavior: 'smooth' });
      });
    }

    update(0);
  }

})();