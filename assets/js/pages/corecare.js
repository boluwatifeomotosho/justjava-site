/* CoreCare page */
(function(){
  const { reduce, roll } = window.JJ;
  /* incident replay: chart draws while the log advances */
  const pts = []; for (let i = 0; i <= 60; i++){ const x = i*10; let v = 240 + Math.sin(i*1.7)*12;
    if (i >= 22 && i <= 34){ const k = i <= 26 ? (i-21)/5 : i <= 30 ? 1 : (34-i)/4; v = 240 + k*1560 + Math.sin(i*2.3)*40; }
    if (i > 34) v = 228 + Math.sin(i*1.3)*8; pts.push([x, v]); }
  const yOf = v => 176 - (v - 240) / 1600 * 150;
  const d = pts.map(([x,v],i)=>`${i?'L':'M'}${x},${yOf(v).toFixed(1)}`).join(' ');
  const path = document.getElementById('ccPath'); path.setAttribute('d', d);
  const len = path.getTotalLength(); path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
  const logs = [...document.querySelectorAll('#ccLog li')], now = document.getElementById('ccNow'), again = document.getElementById('ccAgain');
  const logAt = [0.40, 0.47, 0.58, 0.8, 0.9, 1.0];
  let raf;
  function play(){
    cancelAnimationFrame(raf); again.hidden = true; logs.forEach(l=>l.classList.remove('on'));
    const dur = reduce ? 1 : 7000, t0 = performance.now();
    (function f(t){ const p = Math.min(1, (t - t0)/dur);
      path.style.strokeDashoffset = len * (1 - p);
      const i = Math.min(pts.length-1, Math.round(p*(pts.length-1))), v = Math.round(pts[i][1]);
      now.textContent = v >= 1000 ? (v/1000).toFixed(1) + ' s' : v + ' ms'; now.classList.toggle('bad', v > 600);
      logs.forEach((l,k)=> l.classList.toggle('on', p >= logAt[k]));
      if (p < 1) raf = requestAnimationFrame(f); else again.hidden = false;
    })(t0);
  }
  again.addEventListener('click', play);
  if (reduce || !('IntersectionObserver' in window)) play();
  else { const io = new IntersectionObserver(es=>{ es.forEach(e=>{ if (e.isIntersecting){ io.disconnect(); play(); } }); }, {threshold:.35}); io.observe(document.querySelector('.cc')); }
})();
