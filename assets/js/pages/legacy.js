/* Modernise Legacy Software page */
(function(){
  const { reduce, roll } = window.JJ;
  /* before / after migration slider */
  const ba = document.getElementById('ba'), rng = document.getElementById('baRange');
  const TOTAL = 1284330, fmt = n => n.toLocaleString('en-NG');
  const notes = [[0,'The old system keeps running while data moves across in stages.'],[35,'Customers and balances move first, reconciled against the source every night.'],[70,'Both systems run in parallel. Anything that does not match is flagged, not guessed.'],[100,'Cutover. The old system is retired only after the new one has proven itself.']];
  function setX(v){
    // the old system is fully visible at 0, the new one fully visible at 100
    ba.style.setProperty('--x', v + '%');
    document.getElementById('mRec').textContent = fmt(Math.round(TOTAL * v/100));
    let n = notes[0][1]; notes.forEach(([k,t])=>{ if (v >= k) n = t; }); document.getElementById('migNote').textContent = n;
  }
  rng.addEventListener('input', ()=> setX(+rng.value));
  setX(+rng.value);
  // a short demonstration drag the first time it comes into view
  if (!reduce && 'IntersectionObserver' in window){
    const io = new IntersectionObserver(es=>{ es.forEach(e=>{ if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now(), from = +rng.value, to = 62;
      (function f(now){ const p = Math.min(1,(now-t0)/1400), e2 = p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2, v = Math.round(from + (to-from)*e2); rng.value = v; setX(v); if (p<1) requestAnimationFrame(f); })(t0);
    }); }, {threshold:.5});
    io.observe(ba);
  }
})();
