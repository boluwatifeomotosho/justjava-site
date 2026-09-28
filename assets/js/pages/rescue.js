/* Software Rescue page */
(function(){
  const { reduce, roll } = window.JJ;
  /* recovery assessment scan */
  const AREAS = [
    ['Codebase','a','Works, but tightly coupled'],['Architecture','a','Monolith with a sound core'],['Deployment','r','Manual, from one laptop'],
    ['Dependencies','r','14 packages past end of life'],['Documentation','r','Nothing beyond a README'],['Product condition','g','Core flows used every day'],
    ['Defects','a','212 open, 9 critical'],['Security concerns','r','Secrets committed to the repository'],['Technical debt','a','Concentrated in reporting'],['Release process','r','No test gate before production']
  ];
  const scan = document.getElementById('scan');
  scan.innerHTML = AREAS.map(([n])=>`<div class="area"><span class="st"></span><b>${n}</b><small>&nbsp;</small></div>`).join('');
  const els = [...scan.children], recs = document.getElementById('recs'), why = document.getElementById('vWhy'), again = document.getElementById('rescan');
  const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
  let busy = false;
  async function runScan(){
    if (busy) return; busy = true; again.hidden = true;
    recs.classList.remove('on'); recs.querySelectorAll('li').forEach(l=>l.classList.remove('pick','pick2'));
    els.forEach(e=>{ e.className = 'area'; e.querySelector('small').innerHTML = '&nbsp;'; });
    why.textContent = 'Reviewing 10 areas…';
    for (let i = 0; i < els.length; i++){
      const [n, s, f] = AREAS[i], e = els[i];
      e.classList.add('scanning'); await wait(420);
      e.classList.remove('scanning'); e.classList.add(s, 'done'); e.querySelector('small').textContent = f;
      await wait(120);
    }
    await wait(400);
    recs.classList.add('on');
    recs.querySelector('[data-r="1"]').classList.add('pick'); recs.querySelector('[data-r="2"]').classList.add('pick2');
    why.innerHTML = '<b>Stabilise, then replace selected components.</b> The core works and is used every day. What is failing sits around it: deployment, dependencies, secrets and release discipline. Those can be fixed without throwing the product away.';
    again.hidden = false; busy = false;
  }
  again.addEventListener('click', runScan);
  if (reduce || !('IntersectionObserver' in window)) runScan();
  else { const io = new IntersectionObserver(es=>{ es.forEach(e=>{ if (e.isIntersecting){ io.disconnect(); runScan(); } }); }, {threshold:.35}); io.observe(scan); }
})();
