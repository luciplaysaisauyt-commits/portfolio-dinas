/* Gallery page JS */
(function(){
  // Card click → navigate
  document.querySelectorAll('.wcard[data-href]').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = card.dataset.href;
    });
  });

  // Drag to scroll
  const wrap = document.getElementById('glWrap');
  if (!wrap) return;
  let drag = false, sx = 0, ss = 0;
  wrap.addEventListener('mousedown', e => { drag=true; sx=e.pageX; ss=wrap.scrollLeft; wrap.style.cursor='grabbing'; });
  wrap.addEventListener('mousemove', e => { if(drag) wrap.scrollLeft = ss-(e.pageX-sx); });
  ['mouseup','mouseleave'].forEach(ev => wrap.addEventListener(ev, () => { drag=false; wrap.style.cursor='grab'; }));

  // Fade-up observer
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('vis'); });
  }, {threshold:.08});
  document.querySelectorAll('.fu').forEach(el => io.observe(el));
})();
