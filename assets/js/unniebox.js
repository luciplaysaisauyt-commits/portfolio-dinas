/* UnnieBox case page interactions */
(() => {
  const openBtn = document.getElementById('expandFull');
  const modal = document.getElementById('imgModal');

  if (!openBtn || !modal) return;

  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('no-scroll');
  };

  const open = () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('no-scroll');
  };

  openBtn.addEventListener('click', open);

  modal.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.hasAttribute('data-close')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });
})();
