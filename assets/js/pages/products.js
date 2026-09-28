/* Products page */
(function(){
  const { reduce, roll } = window.JJ;
  /* build from zero vs start from the platform */
  const pz = document.getElementById('pz'), A = document.getElementById('pzA'), B = document.getElementById('pzB');
  [...pz.querySelectorAll('.pz-grid span')].forEach((s,i)=> s.style.setProperty('--i', i));
  let touched = false;
  function mode(m){ pz.dataset.m = m; A.setAttribute('aria-pressed', m==='a'); B.setAttribute('aria-pressed', m==='b');
    document.getElementById('pzSum').innerHTML = m === 'a' ? '<b>10 of 10</b> capabilities to design, engineer and test from scratch.' : '<b>2 of 10</b> capabilities to build. Your investment goes into what makes your business different.'; }
  A.addEventListener('click', ()=>{ touched = true; mode('a'); }); B.addEventListener('click', ()=>{ touched = true; mode('b'); });
  if (reduce) mode('b');
  else if ('IntersectionObserver' in window){ const io = new IntersectionObserver(es=>{ es.forEach(e=>{ if (e.isIntersecting){ io.disconnect(); setTimeout(()=>{ if (!touched) mode('b'); }, 1500); } }); }, {threshold:.45}); io.observe(pz); }
})();
