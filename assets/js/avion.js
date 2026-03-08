
    // Progress bar
    const prog = document.getElementById('psProgress');
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.width = (window.scrollY / total * 100) + '%';
    }, { passive: true });

    // Reveal on scroll
    const revObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revObs.unobserve(e.target); } });
    }, { threshold: 0.07 });
    document.querySelectorAll('[data-reveal]').forEach(el => revObs.observe(el));

    // Subnav active state
    const subnavLinks = document.querySelectorAll('.case-subnav-pill a');
    const secObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        subnavLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      });
    }, { threshold: 0.22 });
    document.querySelectorAll('.case-section[id]').forEach(s => secObs.observe(s));

    // Modal
    const modal = document.getElementById('imgModal');
    const modalImg = document.getElementById('imgModalSrc');
    const openModal = (src) => { modalImg.src = src; modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('no-scroll'); };
    const closeModal = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('no-scroll'); };
    document.querySelectorAll('.ps-product-card img, .ps-screen-card img, .case-img img, .landing-card img, .modal-card img').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => openModal(img.src));
    });
    document.getElementById('expandFull')?.addEventListener('click', () => openModal('/assets/images/products/Products-v1[Desktop].png'));
    modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // Burger / mobile menu
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');
    burger?.addEventListener('click', () => mobileMenu.classList.add('open'));
    mobileClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileMenu?.addEventListener('click', (e) => { if (e.target === mobileMenu) mobileMenu.classList.remove('open'); });

    // Custom cursor
    const cursor = document.getElementById('dinCursor');
    const ring = document.getElementById('dinCursorRing');
    if (cursor && ring) {
      document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top  = e.clientY + 'px';
        ring.style.left   = e.clientX + 'px';
        ring.style.top    = e.clientY + 'px';
      });
    }
