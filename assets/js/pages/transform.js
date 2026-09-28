/* Transform Business Operations page */
(function(){
  const { reduce, roll } = window.JJ;
  /* today vs as-a-system */
  const st2 = document.getElementById('stage2'), a = document.getElementById('tgA'), bb = document.getElementById('tgB');
  let touched = false;
  function setState(s){ st2.dataset.state = s; a.setAttribute('aria-pressed', s === 'a'); bb.setAttribute('aria-pressed', s === 'b'); }
  a.addEventListener('click', ()=>{ touched = true; setState('a'); });
  bb.addEventListener('click', ()=>{ touched = true; setState('b'); });
  if (reduce) setState('b');
  else if ('IntersectionObserver' in window){
    const io = new IntersectionObserver(es=>{ es.forEach(e=>{ if (e.isIntersecting){ io.disconnect(); setTimeout(()=>{ if (!touched) setState('b'); }, 1600); } }); }, {threshold:.45});
    io.observe(st2);
  }
})();
