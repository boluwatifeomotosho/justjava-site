/* About JustJava page */
(function(){
  const { reduce, roll } = window.JJ;
  function onView(el, fn, threshold){
    if (reduce || !('IntersectionObserver' in window)){ fn(); return; }
    const io = new IntersectionObserver(es=>{ es.forEach(e=>{ if (e.isIntersecting){ io.disconnect(); fn(); } }); }, {threshold: threshold || .4});
    io.observe(el);
  }
  /* statement lights up word by word as you scroll */
  const lit = document.getElementById('lit');
  lit.innerHTML = lit.textContent.split(' ').map(w=>`<span class="wd">${w}</span>`).join(' ');
  const wds = [...lit.querySelectorAll('.wd')];
  function litScrub(){
    const r = lit.getBoundingClientRect(), vh = innerHeight;
    let p = (vh*0.85 - r.top) / (vh*0.5); p = Math.min(1, Math.max(0, p));
    const n = Math.round(p * wds.length);
    wds.forEach((w,i)=> w.classList.toggle('dim', i >= n));
  }
  if (!reduce){ let k=0; addEventListener('scroll', ()=>{ if(!k){ k=1; requestAnimationFrame(()=>{ litScrub(); k=0; }); } }, {passive:true}); litScrub(); }

  /* the mark draws itself on a construction grid */
  const md = document.getElementById('markDraw'), g = md.querySelector('.mk-grid');
  let gs = '';
  [60,150,210,270,360].forEach((v,i)=>{ gs += `<line x1="0" y1="${v}" x2="420" y2="${v}" style="transition-delay:${i*80}ms"/><line x1="${v}" y1="0" x2="${v}" y2="420" style="transition-delay:${i*80+40}ms"/>`; });
  [[150,150],[270,150],[150,270],[270,270],[210,210]].forEach(([x,y],i)=>{ gs += `<rect x="${x-3}" y="${y-3}" width="6" height="6" style="transition-delay:${1000+i*50}ms"/>`; });
  g.innerHTML = gs;
  md.querySelectorAll('.mk-stage svg path').forEach(p=>{ try { p.style.setProperty('--pl', Math.ceil(p.getTotalLength())); } catch(e){} });
  if (!reduce) md.classList.add('pre');
  onView(md, ()=>{ requestAnimationFrame(()=> md.classList.add('go')); }, .45);
})();
