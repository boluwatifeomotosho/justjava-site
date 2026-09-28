/* Connect Systems and Data page */
(function(){
  const { reduce, roll } = window.JJ;
  /* integration simulation */
  const logEl = document.getElementById('log'), demo = document.getElementById('demo');
  const st = {proc:0, dup:0, exc:0, q:0}; let clock = 10*3600 + 42*60, busy = false, live = false, tick;
  const t = () => { const h = Math.floor(clock/3600), m = Math.floor(clock%3600/60), s = clock%60; return [h,m,s].map(n=>String(n).padStart(2,'0')).join(':'); };
  function log(msg, cls){ clock += 1 + Math.floor(Math.random()*2); const li = document.createElement('li'); if (cls) li.className = cls; li.innerHTML = `${t()}  ${msg}`; logEl.appendChild(li); while (logEl.children.length > 9) logEl.firstChild.remove(); }
  const set = (id, v) => roll(document.getElementById(id), String(v));
  const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
  let evt = 8807;
  function normal(){ if (!live || busy) return; st.proc++; set('sProc', st.proc); if (st.proc % 3 === 0) log(`evt_${++evt} <b>payment.settled</b> · posted to ledger`); }
  function startTick(){ if (!tick) tick = setInterval(normal, 900); }
  function stopTick(){ clearInterval(tick); tick = null; }
  if ('IntersectionObserver' in window) new IntersectionObserver(es=>{ es.forEach(e=>{ live = e.isIntersecting; demo.classList.toggle('paused', !live); live ? startTick() : stopTick(); }); }, {threshold:.2}).observe(demo);
  const btns = [...document.querySelectorAll('.sbtn')];
  const lock = on => { busy = on; btns.forEach(b => b.disabled = on); };
  const scen = {
    async outage(){
      const prov = document.getElementById('nProv'), w1 = document.getElementById('w1'), qb = document.getElementById('qBadge');
      prov.classList.add('down'); document.getElementById('provState').textContent = 'Not responding'; w1.classList.add('stop');
      log('<b>provider timeout</b> after 5s · retry 1 scheduled in 2s', 'bad'); await wait(900);
      qb.hidden = false;
      for (let i = 1; i <= 14; i++){ st.q = i; document.getElementById('qN').textContent = i; await wait(90); }
      log('retry 1 failed · <b>retry 2 in 4s</b> · 14 events held in queue', 'warn'); await wait(1300);
      log('retry 2 failed · <b>retry 3 in 8s</b> · nothing dropped', 'warn'); await wait(1500);
      prov.classList.remove('down'); document.getElementById('provState').textContent = 'Online'; w1.classList.remove('stop');
      log('<b>provider back online</b> · replaying queue in order', 'ok'); await wait(500);
      for (let i = 14; i >= 0; i--){ document.getElementById('qN').textContent = i; st.proc++; set('sProc', st.proc); await wait(70); }
      qb.hidden = true; log('<b>14 of 14 replayed</b> · 0 lost · 0 duplicated', 'ok');
    },
    async dup(){
      const w1 = document.getElementById('w1'); w1.classList.add('dup'); const id = ++evt;
      log(`evt_${id} <b>payment.settled</b> ₦250,000 · posted to ledger`); await wait(900);
      log(`evt_${id} <b>received again</b> · provider resent after a slow acknowledgement`, 'warn'); await wait(900);
      log(`idempotency key matched · <b>ignored</b> · customer charged once`, 'ok');
      st.dup++; set('sDup', st.dup); w1.classList.remove('dup');
    },
    async disagree(){
      const core = document.getElementById('nCore'); core.classList.add('alert');
      log('<b>reconciliation run</b> · 1,204 transactions compared'); await wait(900);
      log('txn 5521 · bank says <b>₦1,250,000</b> · provider says <b>₦1,205,000</b>', 'bad'); await wait(1100);
      log('ledger is the source of truth · <b>exception raised</b>, not auto-corrected', 'warn'); await wait(900);
      log('routed to <b>finance exception queue</b> · owner assigned', 'ok');
      st.exc++; set('sExc', st.exc); core.classList.remove('alert');
    }
  };
  btns.forEach(b => b.addEventListener('click', async ()=>{ if (busy) return; lock(true); await scen[b.dataset.s](); lock(false); }));
  log('<b>connected</b> · provider, platform and ledger healthy', 'ok');
  for (let i = 0; i < 3; i++){ st.proc++; } set('sProc', st.proc);

  /* questions light up as they are read */
  const qs = [...document.querySelectorAll('#qs li')];
  function qScrub(){ const mid = innerHeight*0.6; qs.forEach(l=>{ const r = l.getBoundingClientRect(), c = r.top + r.height/2; l.style.opacity = c <= mid ? 1 : Math.max(.3, 1 - (c-mid)/(innerHeight*.3)); }); }
  if (!reduce){ let k=0; addEventListener('scroll', ()=>{ if(!k){ k=1; requestAnimationFrame(()=>{ qScrub(); k=0; }); } }, {passive:true}); qScrub(); }
})();
