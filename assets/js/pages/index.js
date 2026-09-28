/* Homepage: hero ticket, chapter bar, phone sequence, PROVE timeline, OPERATE fork, exploded view. */
(function(){
  const { reduce, roll } = window.JJ;


  /* construction grid behind the ticket */
  const svg = document.getElementById('grid');
  function drawGrid(){
    const r = svg.getBoundingClientRect(), w = Math.round(r.width), h = Math.round(r.height), step = 64;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    let s = '', i = 0;
    for (let x = step/2; x < w; x += step) s += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" style="animation-delay:${(i++)*30}ms"/>`;
    for (let y = step/2; y < h; y += step) s += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" style="animation-delay:${(i++)*30}ms"/>`;
    const pts = [[1,1],[Math.floor(w/step)-1,2],[2,Math.floor(h/step)-1]];
    pts.forEach((p,k)=>{ const x = step/2 + p[0]*step, y = step/2 + p[1]*step;
      s += `<rect x="${x-3}" y="${y-3}" width="6" height="6" style="animation-delay:${800 + k*40}ms"/>`; });
    svg.innerHTML = s;
  }
  drawGrid();
  let rt; addEventListener('resize', ()=>{ clearTimeout(rt); rt = setTimeout(drawGrid, 150); });

  /* ticket sequence */
  const stages = [...document.querySelectorAll('.stage')];
  const chip = document.getElementById('chip'), rail = document.getElementById('rail');
  const built = document.getElementById('built'), replay = document.getElementById('replay');
  let timers = [], played = false;

  function setChip(text, animate){
    const old = chip.querySelector('span');
    if (old.textContent === text) return;
    const nu = document.createElement('span'); nu.textContent = text;
    if (!animate || reduce){ chip.replaceChildren(nu); return; }
    nu.style.position = 'absolute'; nu.style.left = 0; nu.style.right = 0; nu.style.top = 0;
    chip.appendChild(nu);
    const o = {duration:250, easing:'cubic-bezier(.2,0,0,1)', fill:'forwards'};
    old.animate([{transform:'translateY(0)',opacity:1},{transform:'translateY(-100%)',opacity:0}], o);
    nu.animate([{transform:'translateY(100%)',opacity:0},{transform:'translateY(0)',opacity:1}], o).onfinish = ()=>{ old.remove(); nu.removeAttribute('style'); };
  }
  function show(n, animate){ // n = number of completed stages (0..7)
    stages.forEach((s,i)=>{ s.classList.toggle('done', i < n); s.classList.toggle('current', i === n); });
    const idx = Math.min(n, stages.length-1);
    rail.style.transform = `scaleY(${Math.min(n, stages.length-1)/(stages.length-1)})`;
    setChip(stages[idx].dataset.chip, animate);
    const fin = n >= stages.length;
    chip.classList.toggle('final', fin);
    built.classList.toggle('on', fin);
    replay.classList.toggle('on', fin);
  }
  function run(){
    timers.forEach(clearTimeout); timers = [];
    if (reduce){ show(stages.length, false); return; }
    show(0, false);
    for (let n = 1; n <= stages.length; n++) timers.push(setTimeout(()=>show(n, true), 400 + n*700));
  }
  show(0, false);
  if ('IntersectionObserver' in window){
    new IntersectionObserver((es, ob)=>{ es.forEach(e=>{ if (e.isIntersecting && !played){ played = true; run(); ob.disconnect(); } }); }, {threshold:.15})
      .observe(document.querySelector('.ticket'));
  } else run();
  replay.addEventListener('click', run);

  /* "sometimes" lines brighten as they reach the middle of the screen */
  const lines = [...document.querySelectorAll('#sometimes li, .litlist li')];
  function scrub(){
    const mid = innerHeight * 0.55, span = innerHeight * 0.3;
    lines.forEach(l=>{
      const r = l.getBoundingClientRect(), c = r.top + r.height/2;
      const t = c <= mid ? 1 : Math.max(0, 1 - (c - mid)/span);
      l.style.opacity = (0.3 + 0.7*t).toFixed(3);
    });
  }
  if (!reduce){ let tk=false; addEventListener('scroll', ()=>{ if(!tk){ tk=true; requestAnimationFrame(()=>{ scrub(); tk=false; }); } }, {passive:true}); scrub(); }

  function onView(el, fn, threshold){
    if (reduce || !('IntersectionObserver' in window)){ fn(); return; }
    const io = new IntersectionObserver(es=>{ es.forEach(e=>{ if (e.isIntersecting){ io.disconnect(); fn(); } }); }, {threshold: threshold || .4});
    io.observe(el);
  }

  /* 03 blueprint around the four words */
  const bp = document.getElementById('bp'), wordsWrap = document.getElementById('wordsWrap');
  function drawBP(){
    const wr = wordsWrap.getBoundingClientRect(), W = wr.width, H = wr.height;
    bp.setAttribute('viewBox', `0 0 ${W} ${H}`);
    let s = '', pts = [];
    const lis = [...document.querySelectorAll('#words li')];
    const x0 = 10;
    s += `<line x1="${x0}" y1="-12" x2="${x0}" y2="${H+12}" style="--len:${H+24}"/>`;
    lis.forEach((li,i)=>{
      const r = li.getBoundingClientRect(), base = r.top - wr.top + r.height*0.82, right = Math.min(W, r.right - wr.left + 12);
      s += `<line x1="0" y1="${base}" x2="${W}" y2="${base}" style="--len:${W};transition-delay:${i*120}ms"/>`;
      pts.push([x0, base], [right, base]);
    });
    const lastR = lis[1].getBoundingClientRect();
    s += `<line x1="${lastR.right - wr.left + 12}" y1="-12" x2="${lastR.right - wr.left + 12}" y2="${H+12}" style="--len:${H+24};transition-delay:300ms"/>`;
    pts.forEach((p,k)=>{ if (k % 2 === 0 || k === 3) s += `<rect x="${p[0]-3}" y="${p[1]-3}" width="6" height="6" style="transition-delay:${1100 + k*40}ms"/>`; });
    bp.innerHTML = s;
  }
  drawBP(); addEventListener('resize', ()=>{ clearTimeout(drawBP.t); drawBP.t = setTimeout(drawBP, 150); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawBP);
  onView(wordsWrap, ()=> wordsWrap.classList.add('drawn'), .35);

  /* chapter bar */
  const chnav = document.getElementById('chnav'), chind = document.getElementById('chind');
  function setChapter(id){
    if (id === 'none'){ chnav.querySelectorAll('span').forEach(sp=>sp.classList.remove('on')); chind.style.width = '0px'; return; }
    chnav.querySelectorAll('span').forEach(sp=>{
      const on = sp.dataset.ch === id; sp.classList.toggle('on', on);
      if (on){ chind.style.width = sp.offsetWidth + 'px'; chind.style.transform = `translateX(${sp.offsetLeft}px)`; }
    });
  }
  setChapter('understand');
  if ('IntersectionObserver' in window){
    const cio = new IntersectionObserver(es=>{ es.forEach(e=>{ if (e.isIntersecting) setChapter(e.target.dataset.chapter); }); }, {rootMargin:'-45% 0px -50% 0px'});
    document.querySelectorAll('[data-chapter]').forEach(s=>cio.observe(s));
  }


  /* words fly into the chapter bar */
  const chapters = document.querySelector('.chapters'), chbar = document.querySelector('.chbar');
  const wEls = [...document.querySelectorAll('#words .w')], bSpans = [...chnav.querySelectorAll('span')];
  const fly = document.createElement('div'); fly.className = 'fly'; fly.setAttribute('aria-hidden','true'); document.body.appendChild(fly);
  const clones = wEls.map(w=>{ const c = document.createElement('span'); c.className = 'fly-w'; c.textContent = w.textContent; fly.appendChild(c); return c; });
  const ease = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
  function flight(){
    const vh = innerHeight, navOff = document.body.classList.contains('nav-hidden') ? 0 : 60, barBottom = navOff + 40;
    const cr = chapters.getBoundingClientRect(), wr = wordsWrap.getBoundingClientRect();
    const inCh = cr.top <= barBottom + 1 && cr.bottom > barBottom + 120;
    const startTop = vh * 0.28, endTop = barBottom + (wr.top - cr.top);
    let p = reduce ? (inCh ? 1 : 0) : (startTop - wr.top) / (startTop - endTop);
    p = Math.min(1, Math.max(0, p));
    const flying = p > 0 && p < 1 && !reduce;
    let barOp = inCh ? 1 : 0;
    if (flying && p > .82) barOp = (p - .82) / .18;
    chbar.classList.toggle('show', barOp > 0);
    chbar.style.opacity = (barOp > 0 && barOp < 1) ? barOp.toFixed(3) : '';
    wEls.forEach(w => w.style.visibility = flying ? 'hidden' : '');
    const fs = parseFloat(getComputedStyle(wEls[0].parentElement).fontSize);
    clones.forEach((c,i)=>{
      if (!flying){ c.style.visibility = 'hidden'; return; }
      const a = wEls[i].getBoundingClientRect(), b = bSpans[i].getBoundingClientRect(), e = ease(p);
      const es = 1 - Math.pow(1 - p, 3), sc = 1 + (b.width / a.width - 1) * es;
      const x = a.left + (b.left - a.left) * e;
      const yT = b.top + b.height/2 - (a.height * (b.width / a.width))/2;
      const y = a.top + (yT - a.top) * e;
      c.style.fontSize = fs + 'px';
      c.style.transform = `translate(${x}px,${y}px) scale(${sc})`;
      c.style.opacity = e > .85 ? (1 - (e - .85)/.15).toFixed(3) : 1;
      c.style.visibility = 'visible';
    });
  }
  let fk = false; const fq = ()=>{ if(!fk){ fk = true; requestAnimationFrame(()=>{ flight(); fk = false; }); } };
  addEventListener('scroll', fq, {passive:true}); addEventListener('resize', fq); flight();

  /* 04 review document assembles */
  const doc = document.getElementById('doc');
  if (!reduce){ doc.classList.add('pre'); }
  onView(doc, ()=>{ doc.classList.add('go'); setTimeout(()=>doc.classList.add('done'), reduce ? 0 : 900); }, .35);

  /* 05 phone sequence */
  const phone = document.getElementById('phone'), n1 = document.getElementById('n1'), n2 = document.getElementById('n2');
  const lock = document.getElementById('lock'), portal = document.getElementById('portal'), tap = document.getElementById('tap');
  const rp = document.getElementById('replay2'); let pt = [];
  function phoneState(final){
    n1.className = 'notif n1'; n2.className = 'notif n2'; tap.className = 'tap'; phone.classList.remove('buzz');
    if (final){ lock.style.opacity = 0; portal.classList.add('on');
      roll(document.getElementById('nAcc'),'18'); roll(document.getElementById('nQa'),'2'); roll(document.getElementById('pChip'),'ACCEPTED'); document.getElementById('pChip').classList.add('final'); }
    else { lock.style.opacity = 1; portal.classList.remove('on');
      document.getElementById('nAcc').innerHTML='<span>17</span>'; document.getElementById('nQa').innerHTML='<span>3</span>';
      const pc = document.getElementById('pChip'); pc.innerHTML='<span>IN UAT</span>'; pc.classList.remove('final'); }
  }
  function runPhone(){
    pt.forEach(clearTimeout); pt = []; rp.classList.remove('on');
    if (reduce){ phoneState(true); return; }
    phoneState(false);
    const at = (ms, f)=> pt.push(setTimeout(f, ms));
    at(300, ()=>{ n1.classList.add('on'); phone.classList.add('buzz'); });
    at(1700, ()=> tap.classList.add('go'));
    at(2050, ()=>{ n1.classList.add('gone'); lock.style.opacity = 0; portal.classList.add('on'); });
    at(3300, ()=>{ roll(document.getElementById('pChip'),'ACCEPTED'); document.getElementById('pChip').classList.add('final'); });
    at(3650, ()=>{ roll(document.getElementById('nQa'),'2'); roll(document.getElementById('nAcc'),'18'); });
    at(4900, ()=>{ phone.classList.remove('buzz'); void phone.offsetWidth; n2.classList.add('on'); phone.classList.add('buzz'); });
    at(7600, ()=>{ n2.classList.add('gone'); rp.classList.add('on'); });
  }
  onView(phone, runPhone, .6);
  rp.addEventListener('click', runPhone);

  /* 06 timeline fills with scroll */
  const tl = document.getElementById('tl'), tlFill = document.getElementById('tlFill'), tlItems = [...tl.querySelectorAll('li')];
  function tlScrub(){
    const r = tl.getBoundingClientRect();
    let p = reduce ? 1 : (innerHeight*0.6 - r.top) / r.height; p = Math.min(1, Math.max(0, p));
    tlFill.style.transform = `scaleY(${p})`;
    tlItems.forEach((li,i)=>{ const on = p >= (i/(tlItems.length-1)) - 0.001 && p > 0; li.classList.toggle('on', on);
      if (li.classList.contains('last') && on && !li.dataset.done){ li.dataset.done = 1; li.classList.add('fin'); } });
  }
  tlScrub(); addEventListener('scroll', ()=>{ if(!tlScrub.k){ tlScrub.k = 1; requestAnimationFrame(()=>{ tlScrub(); tlScrub.k = 0; }); } }, {passive:true});
  onView(document.getElementById('seq'), ()=> document.getElementById('seq').classList.add('drawn'), .6);

  /* 07 assurance bar + fork */
  onView(document.getElementById('ab'), ()=> document.getElementById('ab').classList.add('go'), .6);
  onView(document.getElementById('fork'), ()=> document.getElementById('fork').classList.add('drawn'), .25);


  /* closing line lights up word by word */
  const litEl = document.getElementById('lit');
  if (litEl){
    litEl.innerHTML = litEl.textContent.split(' ').map(w=>`<span class="wd">${w}</span>`).join(' ');
    const wds = [...litEl.querySelectorAll('.wd')];
    const litScrub = ()=>{ const r = litEl.getBoundingClientRect(); let p = (innerHeight*0.85 - r.top)/(innerHeight*0.45); p = Math.min(1, Math.max(0, p)); const n = Math.round(p*wds.length); wds.forEach((w,i)=> w.classList.toggle('dim', i >= n)); };
    if (!reduce){ let lk = 0; addEventListener('scroll', ()=>{ if(!lk){ lk = 1; requestAnimationFrame(()=>{ litScrub(); lk = 0; }); } }, {passive:true}); litScrub(); }
  }

  /* exploded view */
  const ex = document.getElementById('explode');
  function explode(){
    const r = ex.getBoundingClientRect(), vh = innerHeight;
    let p = (vh*0.85 - r.top) / (vh*0.4 + r.height/2);
    p = Math.min(1, Math.max(0, p));
    p = p < .5 ? 2*p*p : 1 - Math.pow(-2*p + 2, 2)/2;
    ex.style.setProperty('--p', p.toFixed(4));
  }
  if (reduce) ex.style.setProperty('--p', 1);
  else { let t2=false; addEventListener('scroll', ()=>{ if(!t2){ t2=true; requestAnimationFrame(()=>{ explode(); t2=false; }); } }, {passive:true}); explode(); }
})();
