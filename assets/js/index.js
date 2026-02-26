/* ============================================================
   INDEX.JS — homepage: particle canvas + card scroll
   ============================================================ */
(function () {

  // ════════════════════════════════════════
  // PARTICLE CANVAS
  // ════════════════════════════════════════
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const mouse = { x: -9999, y: -9999 };

    const CFG = {
      count:       2600,
      repulse:     170,
      repulseForce:5.5,
      speed:       0.16,
    };

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    class Particle {
      constructor() { this.init(); }
      init() {
        const angle  = Math.random() * Math.PI * 2;
        const radius = Math.random() * Math.min(W, H) * 0.44;
        this.ox = W / 2 + Math.cos(angle) * radius;
        this.oy = H / 2 + Math.sin(angle) * radius;
        this.x  = this.ox + (Math.random() - .5) * 30;
        this.y  = this.oy + (Math.random() - .5) * 30;
        this.vx = (Math.random() - .5) * CFG.speed;
        this.vy = (Math.random() - .5) * CFG.speed;
        this.size  = Math.random() * 1.4 + 0.3;
        this.alpha = Math.random() * 0.55 + 0.12;
        this.ta    = this.alpha;
        this.glow  = Math.random() < 0.055;
        this.gr    = this.size * (Math.random() * 4 + 3);
      }
      update() {
        const dx   = mouse.x - this.x;
        const dy   = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CFG.repulse && dist > 0) {
          const f = (1 - dist / CFG.repulse) * CFG.repulseForce;
          this.vx -= (dx / dist) * f;
          this.vy -= (dy / dist) * f;
          this.ta = Math.min(1, this.alpha + .35);
        } else {
          this.ta = Math.random() * 0.45 + 0.1;
        }
        this.vx += (this.ox - this.x) * 0.004;
        this.vy += (this.oy - this.y) * 0.004;
        this.vx *= 0.94;
        this.vy *= 0.94;
        this.vx += (Math.random() - .5) * CFG.speed * 0.35;
        this.vy += (Math.random() - .5) * CFG.speed * 0.35;
        this.x  += this.vx;
        this.y  += this.vy;
        this.alpha += (this.ta - this.alpha) * 0.08;
      }
      draw() {
        if (this.glow) {
          const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.gr);
          g.addColorStop(0, `rgba(230,220,205,${this.alpha * .65})`);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.gr, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle   = `rgb(${210 + Math.floor(Math.random()*20)},${200 + Math.floor(Math.random()*15)},${190 + Math.floor(Math.random()*12)})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    function init() {
      resize();
      particles = Array.from({ length: CFG.count }, () => new Particle());
    }

    window.addEventListener('resize', () => {
      resize();
      particles.forEach(p => p.init());
    });

    window.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    window.addEventListener('touchmove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    }, { passive: true });

    // Click burst
    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const bx = e.clientX - rect.left;
      const by = e.clientY - rect.top;
      for (let i = 0; i < 50; i++) {
        const p = new Particle();
        p.x = bx; p.y = by;
        p.ox = bx + (Math.random() - .5) * 280;
        p.oy = by + (Math.random() - .5) * 280;
        const a = Math.random() * Math.PI * 2;
        const s = Math.random() * 5 + 2;
        p.vx = Math.cos(a) * s;
        p.vy = Math.sin(a) * s;
        p.alpha = 0.9;
        p.size  = Math.random() * 2.2 + .4;
        particles.push(p);
      }
      if (particles.length > CFG.count + 200) particles.splice(0, 50);
    });

    function loop() {
      requestAnimationFrame(loop);
      ctx.fillStyle = 'rgba(8,8,8,0.17)';
      ctx.fillRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
    }

    init();
    loop();
  }

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
