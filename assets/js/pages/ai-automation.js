/* AI Automation page */
(function(){
  const { reduce, roll } = window.JJ;
  /* AI task sorter */
  const TASKS = [
    {n:'Invoice INV-2231 matched to purchase order', c:99, l:'automate', why:'Supplier, amount and PO all match.'},
    {n:'Duplicate invoice check on INV-2232', c:97, l:'automate', why:'Same supplier, amount and date already paid.'},
    {n:'Invoice from a supplier we have never paid', c:74, l:'assist', why:'Suggested: create supplier record for review.'},
    {n:'Late payment reminder to supplier', c:95, l:'automate', why:'Standard template, due date passed.'},
    {n:'Amount differs from PO by 18%', c:54, l:'escalate', why:'Too uncertain to decide alone.'},
    {n:'Supplier bank details changed', c:96, l:'escalate', why:'High risk: confidence does not matter here.', risk:true},
    {n:'Credit note request from customer', c:81, l:'assist', why:'Suggested: approve partial credit.'}
  ];
  const $ = id => document.getElementById(id);
  const lanesMap = {automate:['lA','nA'], assist:['lS','nS'], escalate:['lE','nE']}, counts = {automate:0, assist:0, escalate:0};
  const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
  const colorFor = t => t.risk ? '#FF6B8A' : t.c >= 90 ? 'var(--maya)' : t.c >= 65 ? '#F5B94A' : '#FF6B8A';
  let running = false;
  async function run(){
    if (running) return; running = true; $('again').hidden = true;
    Object.keys(lanesMap).forEach(k=>{ counts[k] = 0; $(lanesMap[k][0]).innerHTML = ''; roll($(lanesMap[k][1]), '0'); });
    const card = $('inCard');
    for (let i = 0; i < TASKS.length; i++){
      const t = TASKS[i];
      card.classList.remove('go'); card.classList.remove('new'); void card.offsetWidth; card.classList.add('new');
      $('inName').textContent = t.n; $('inWhy').textContent = ' '; $('inWhy').classList.remove('risk');
      $('inCount').textContent = `${TASKS.length - i} task${TASKS.length - i > 1 ? 's' : ''}`;
      const bar = $('confBar'); bar.style.background = 'var(--maya)'; bar.style.transform = 'scaleX(0)'; $('confVal').textContent = '0%';
      await wait(250);
      bar.style.background = colorFor(t); bar.style.transform = `scaleX(${t.c/100})`;
      if (!reduce){ const t0 = performance.now(); await new Promise(res=>{ (function f(now){ const p = Math.min(1,(now-t0)/600); $('confVal').textContent = Math.round(t.c*p)+'%'; p<1 ? requestAnimationFrame(f) : res(); })(t0); }); }
      else $('confVal').textContent = t.c + '%';
      $('inWhy').textContent = t.why; if (t.risk) $('inWhy').classList.add('risk');
      await wait(900);
      card.classList.add('go'); await wait(380);
      const li = document.createElement('li'); li.innerHTML = `<span></span><span>${t.c}%${t.risk ? ' · risk' : ''}</span>`; li.firstChild.textContent = t.n;
      $(lanesMap[t.l][0]).prepend(li); counts[t.l]++; roll($(lanesMap[t.l][1]), String(counts[t.l]));
      await wait(200);
    }
    $('inName').textContent = 'Queue clear'; $('inWhy').textContent = 'Every task has an owner: the system or a person.'; $('confVal').textContent = ''; $('confBar').style.transform = 'scaleX(0)';
    $('inCount').textContent = '0 tasks'; card.classList.remove('go'); card.classList.add('new');
    $('again').hidden = false; running = false;
  }
  const demoEl = document.getElementById('demo');
  if (reduce || !('IntersectionObserver' in window)) run();
  else { const io = new IntersectionObserver(es=>{ es.forEach(e=>{ if (e.isIntersecting){ io.disconnect(); run(); } }); }, {threshold:.35}); io.observe(demoEl); }
  $('again').addEventListener('click', run);
})();
