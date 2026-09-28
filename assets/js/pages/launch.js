/* Launch a Software Product page */
(function(){
  const { reduce, roll } = window.JJ;
  /* launch readiness gates pass as each pillar is read */
  const pls = [...document.querySelectorAll('.pillar')], gates = [...document.querySelectorAll('#gates li')];
  const passed = new Set();
  function upd(){
    gates.forEach((g,i)=> g.classList.toggle('on', passed.has(i)));
    const n = passed.size; document.getElementById('pnCount').textContent = n === 6 ? 'All gates passed' : `${n} of 6 gates passed`;
    const chip = document.getElementById('pnChip');
    document.getElementById('gates').classList.toggle('all', n === 6);
    if (n === 6){ roll(chip, 'READY FOR PRODUCTION'); chip.classList.add('go'); }
    else { roll(chip, n ? 'IN PROGRESS' : 'NOT READY'); chip.classList.remove('go'); }
  }
  if (reduce || !('IntersectionObserver' in window)){ pls.forEach((p,i)=>{ p.classList.add('on'); passed.add(i); }); upd(); }
  else {
    const io = new IntersectionObserver(es=>{ es.forEach(e=>{ const i = +e.target.dataset.g; if (e.isIntersecting){ for (let k = 0; k <= i; k++){ pls[k].classList.add('on'); passed.add(k); } upd(); } }); }, {rootMargin:'0px 0px -45% 0px'});
    pls.forEach(p=>io.observe(p)); upd();
  }
})();
