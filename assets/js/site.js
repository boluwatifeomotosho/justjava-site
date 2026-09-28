/* JustJava shared behaviour: reduced-motion flag, number roll, nav, mobile menu, headline reveal.
   Page scripts read JJ.reduce and JJ.roll. Load this before any page script. */
(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* shared: roll a text element to a new value */
  function roll(box, text){
    const cur = box.dataset.v !== undefined ? box.dataset.v : box.textContent.trim();
    if (cur === text) return;
    box.dataset.v = text;
    const sp = document.createElement('span'); sp.textContent = text; if (!reduce) sp.className = 'rin';
    box.replaceChildren(sp);
  }

  window.JJ = { reduce, roll };
  /* nav hides on scroll down, returns on scroll up */
  const nav = document.getElementById('nav'); let lastY = scrollY;
  addEventListener('scroll', ()=>{ const y = scrollY; const hid = y > lastY && y > 120 && !document.body.classList.contains('menu-open'); nav.classList.toggle('hide', hid); document.body.classList.toggle('nav-hidden', hid); lastY = y; }, {passive:true});

  /* mobile menu */
  const btn = document.getElementById('menuBtn'), sheet = document.getElementById('sheet');
  function setMenu(open){ const was = document.body.classList.contains('menu-open'); document.body.classList.toggle('menu-open', open); btn.setAttribute('aria-expanded', open); btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); sheet.inert = !open; if (open && !was) setTimeout(()=>{ const f = sheet.querySelector('a'); f && f.focus({preventScroll:true}); }, 200); if (!open && was) btn.focus({preventScroll:true}); }
  setMenu(false);
  btn.addEventListener('click', ()=> setMenu(!document.body.classList.contains('menu-open')));
  sheet.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=> setMenu(false)));
  addEventListener('keydown', e=>{ if (e.key === 'Escape') setMenu(false); });


  /* page headline rises in word by word, once, on load */
  (function(){
    const h = document.querySelector('main .display'); if (!h || reduce) return;
    const words = h.textContent.trim().split(/\s+/);
    h.setAttribute('aria-label', h.textContent.trim());
    h.innerHTML = words.map((w,i)=>`<span class="wm" aria-hidden="true"><span class="wi" style="--d:${i*45}ms">${w.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</span></span>`).join(' ');
    requestAnimationFrame(()=> requestAnimationFrame(()=> h.classList.add('revealed')));
  })();


})();
