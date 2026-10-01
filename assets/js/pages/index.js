/* JustJava | Software, engineered properly. page */
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


  /* working with JustJava: scroll-driven project journey */
  const track = document.getElementById('jTrack'), journey = document.getElementById('journey');
  const scenes = [...track.querySelectorAll('.sc')], stepsLi = [...document.querySelectorAll('#jSteps li')];
  const dots = [...track.querySelectorAll('.j-prog i')], tab = document.getElementById('jTab'), cap = document.getElementById('jCap');
  const $ = id => document.getElementById(id), clamp = v => Math.min(1, Math.max(0, v));
  const REQ = 'We match loan repayments against three bank feeds by hand. It takes two people a full day.';
  let s3Shown = -1, s7Len = 0;
  const R = [
    lp => {
      const t = clamp(lp/0.55); $('s1Text').textContent = REQ.slice(0, Math.round(REQ.length*t));
      const chip = $('s1Chip');
      if (lp < .3){ roll(chip, 'DRAFT'); chip.classList.remove('final'); $('s1Id').textContent = 'REQ-NEW'; $('s1Btn').textContent = 'Start the Conversation'; $('s1Btn').classList.remove('sent'); }
      else if (lp < .72){ roll(chip, 'BUSINESS REQUIREMENT'); chip.classList.remove('final'); $('s1Id').textContent = 'REQ-NEW'; $('s1Btn').textContent = 'Start the Conversation'; $('s1Btn').classList.remove('sent'); }
      else { roll(chip, 'RECEIVED'); chip.classList.add('final'); $('s1Id').textContent = 'REQ-1042'; $('s1Btn').textContent = 'Sent ✓'; $('s1Btn').classList.add('sent'); }
    },
    lp => {
      const rows = [...document.querySelectorAll('.s2-r')], n = Math.ceil(clamp(lp*1.25)*rows.length);
      rows.forEach((r,i)=> r.classList.toggle('on', i < n));
      rows[rows.length-1].classList.toggle('mark', lp > .85);
    },
    lp => {
      const items = [...document.querySelectorAll('.s3-i')], sprints = [3,2,2,1];
      let total = 0;
      items.forEach((it,i)=>{
        if (it.classList.contains('later')){ it.classList.toggle('out', lp > .62); it.classList.remove('in'); }
        else { const on = lp > .1 + i*.13; it.classList.toggle('in', on); if (on) total += sprints[i]; }
      });
      if (total !== s3Shown){ $('s3Bar').innerHTML = Array.from({length: total}, ()=>'<i></i>').join(''); s3Shown = total; }
      $('s3Txt').textContent = total + ' sprints' + (lp > .62 ? ' · 2 later' : '');
    },
    lp => {
      document.querySelectorAll('.s4-card').forEach((c,k)=>{
        const col = Math.max(0, Math.min(3, Math.floor(lp*4.6 - k*.45)));
        c.style.setProperty('--c', col); c.dataset.c = col;
      });
    },
    lp => {
      $('s5Notif').classList.toggle('on', lp > .08 && lp < .42);
      $('s5Uat').classList.toggle('on', lp >= .42);
      const done = lp > .72; $('s5Btn').classList.toggle('done', done); $('s5Btn').textContent = done ? 'Accepted ✓' : 'Accept feature';
    },
    lp => {
      const li = [...document.querySelectorAll('#s6List li')], n = Math.floor(clamp(lp*1.3)*li.length + .001);
      li.forEach((l,i)=> l.classList.toggle('on', i < n));
      $('s6Live').classList.toggle('on', lp > .82);
    },
    lp => {
      const path = $('s7Path'); if (!s7Len){ s7Len = path.getTotalLength(); path.style.strokeDasharray = s7Len; }
      path.style.strokeDashoffset = s7Len * (1 - lp);
      const x = lp*300, spike = Math.max(0, 1 - Math.abs(x - 150)/22), ms = Math.round(235 + spike*1550);
      $('s7Now').textContent = ms >= 1000 ? (ms/1000).toFixed(1) + ' s' : ms + ' ms'; $('s7Now').classList.toggle('bad', ms > 600);
      [...document.querySelectorAll('#s7Log li')].forEach((l,i)=> l.classList.toggle('on', lp > [.46,.6,.76,.9][i]));
    }
  ];
  let cur = -1;
  function setStep(s){
    if (s === cur) return; cur = s;
    scenes.forEach((sc,i)=> sc.classList.toggle('on', i === s));
    stepsLi.forEach((l,i)=> l.classList.toggle('on', i === s));
    dots.forEach((d,i)=> d.classList.toggle('on', i <= s));
    tab.textContent = scenes[s].dataset.tab;
    const li = stepsLi[s];
    cap.innerHTML = `<span class="jc-n">${li.querySelector('.js-n').textContent} / 07</span><h3>${li.querySelector('h3').textContent}</h3><p>${li.querySelector('p').textContent}</p>`;
    cap.classList.remove('swap'); void cap.offsetWidth; cap.classList.add('swap');
  }
  function journeyFrame(){
    const r = track.getBoundingClientRect(), total = track.offsetHeight - innerHeight;
    const p = clamp(-r.top / total), n = scenes.length;
    const s = Math.min(n - 1, Math.floor(p * n * 0.999));
    const lp = clamp(p * n - s);
    setStep(s); R[s](s < Math.floor(p*n) ? 1 : lp);
  }
  if (reduce){
    journey.classList.add('static');
    const wrap = document.createElement('div'); wrap.className = 'wrap j-static';
    scenes.forEach((sc,i)=>{ R[i](1); const li = stepsLi[i]; const item = document.createElement('div');
      item.innerHTML = `<h3>${li.querySelector('h3').textContent}</h3><p>${li.querySelector('p').textContent}</p>`;
      const fr = document.createElement('div'); fr.className = 'j-frame'; fr.setAttribute('aria-hidden','true'); fr.appendChild(sc); item.appendChild(fr); wrap.appendChild(item); });
    track.querySelector('.j-sticky').appendChild(wrap);
  } else {
    let jk = false; addEventListener('scroll', ()=>{ if (!jk){ jk = true; requestAnimationFrame(()=>{ journeyFrame(); jk = false; }); } }, {passive:true});
    addEventListener('resize', journeyFrame); journeyFrame();
  }
})();
