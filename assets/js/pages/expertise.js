/* Turn Expertise into Software page */
(function(){
  const { reduce, roll } = window.JJ;
  /* knowledge turns into rules, then product settings */
  const kx = document.querySelector('.kx');
  if (!reduce){ kx.classList.add('pre'); }
  const goKx = ()=> kx.classList.add('go');
  if (reduce || !('IntersectionObserver' in window)) goKx();
  else { const io = new IntersectionObserver(es=>{ es.forEach(e=>{ if (e.isIntersecting){ io.disconnect(); goKx(); } }); }, {threshold:.3}); io.observe(kx); }
})();
