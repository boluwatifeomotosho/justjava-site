/* HR and Payroll Platform page */
(function(){
  const { reduce, roll } = window.JJ;
  /* payroll run with a human approval gate */
  const $ = id => document.getElementById(id), steps = [...document.querySelectorAll('#prSteps li')];
  const naira = n => '₦' + Math.round(n).toLocaleString('en-NG');
  const G = 48620000, D = 9140000, N = G - D;
  const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
  const chip = $('prChip');
  function setChip(t, cls){ roll(chip, t); chip.classList.remove('go','hold'); if (cls) chip.classList.add(cls); }
  async function count(ms, fn){ if (reduce){ fn(1); return; } const t0 = performance.now(); await new Promise(res=>{ (function f(t){ const p = Math.min(1,(t-t0)/ms); fn(p); p<1 ? requestAnimationFrame(f) : res(); })(t0); }); }
  let started = false;
  async function run(){
    if (started) return; started = true;
    setChip('RUNNING'); steps[0].classList.add('on'); await wait(700);
    steps[1].classList.add('on');
    await count(2200, p=>{ $('prN').textContent = Math.round(312*p); $('prBar').style.transform = `scaleX(${p})`; $('tG').textContent = naira(G*p); });
    steps[2].classList.add('on');
    await count(1100, p=>{ $('tD').textContent = naira(D*p); $('tN').textContent = naira(N*p); });
    $('prMsg').textContent = 'PAYE, pension and NHF calculated from configured rules. Waiting for a person to approve.';
    steps[3].classList.add('wait'); setChip('AWAITING APPROVAL', 'hold'); $('prApprove').hidden = false;
  }
  $('prApprove').addEventListener('click', async ()=>{
    $('prApprove').hidden = true; steps[3].classList.remove('wait'); steps[3].classList.add('on');
    $('prMsg').textContent = 'Approved by HR lead. Generating payslips and the bank file…'; await wait(900);
    steps[4].classList.add('on'); setChip('PAID', 'go');
    $('prMsg').textContent = '312 payslips generated. Bank file ready. Nothing was re-typed.';
  });
  if (reduce || !('IntersectionObserver' in window)) run();
  else { const io = new IntersectionObserver(es=>{ es.forEach(e=>{ if (e.isIntersecting){ io.disconnect(); run(); } }); }, {threshold:.35}); io.observe(document.querySelector('.pr')); }
})();
