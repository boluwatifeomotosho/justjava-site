/* The JustJava Standard page */
(function(){
  const { reduce, roll } = window.JJ;
  /* steps reveal in order as the process scrolls into view */
  const steps = [...document.querySelectorAll('.steps li')], phases = [...document.querySelectorAll('.phase')];
  if (reduce || !('IntersectionObserver' in window)){ steps.forEach(s=>s.classList.add('in')); phases.forEach(p=>p.classList.add('in')); }
  else {
    const io = new IntersectionObserver(es=>{ es.forEach(e=>{ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); }, {rootMargin:'0px 0px -15% 0px'});
    steps.forEach(s=>io.observe(s));
    const pio = new IntersectionObserver(es=>{ es.forEach(e=>{ if (e.isIntersecting){ const i = phases.indexOf(e.target); setTimeout(()=>e.target.classList.add('in'), i*250); pio.unobserve(e.target); } }); }, {threshold:.3});
    phases.forEach(p=>pio.observe(p));
  }

  /* interactive scope baseline */
  const CAPS = [
    {id:'match', name:'Automated matching engine', sprints:3, core:true, on:true},
    {id:'exq', name:'Exception queue', sprints:2, core:true, on:true},
    {id:'bank', name:'Bank statement API integration', sprints:2, dep:'Bank API access', on:true},
    {id:'file', name:'Provider settlement file import', sprints:1, on:true},
    {id:'appr', name:'Approval workflow for exceptions', sprints:1, on:true},
    {id:'dash', name:'Management dashboard', sprints:1, on:false},
    {id:'fx', name:'Multi-currency support', sprints:2, dep:'FX rate source', on:false},
    {id:'mob', name:'Mobile app for approvers', sprints:3, dep:'App store accounts', on:false},
    {id:'ai', name:'AI-suggested matches', sprints:3, dep:'Historical data quality', on:false}
  ];
  const capsEl = document.getElementById('caps');
  capsEl.innerHTML = CAPS.map(c=>`<li class="cap${c.core?' core':''}"><button type="button" aria-pressed="${c.on}" data-id="${c.id}"><span><span class="c-name">${c.name}</span><span class="c-meta">${c.sprints} sprint${c.sprints>1?'s':''}${c.dep?` · <em>depends on ${c.dep.toLowerCase()}</em>`:''}</span></span><span class="sw" aria-hidden="true"></span></button></li>`).join('');
  const rn = (id, v) => roll(document.getElementById(id), String(v));
  function renderBase(){
    const on = CAPS.filter(c=>c.on), off = CAPS.filter(c=>!c.on);
    const sprints = on.reduce((a,c)=>a+c.sprints,0), deps = on.filter(c=>c.dep).length;
    rn('rCaps', on.length); rn('rSprints', sprints); rn('rDeps', deps);
    const score = deps + (sprints > 12 ? 2 : sprints > 9 ? 1 : 0);
    const lvl = score <= 1 ? ['LOW','lo'] : score <= 3 ? ['MEDIUM','md'] : ['HIGH','hi'];
    const chip = document.getElementById('riskChip');
    roll(chip, 'RISK · ' + lvl[0]); chip.classList.remove('lo','md','hi'); chip.classList.add(lvl[1]);
    document.getElementById('brBar').innerHTML = on.map(c=>Array.from({length:c.sprints},()=>`<i class="${c.dep?'dep':''}"></i>`).join('')).join('');
    document.getElementById('brLater').innerHTML = off.length ? `<b>Later releases:</b> ${off.map(c=>c.name).join(', ')}. Written down, not forgotten.` : '<b>Everything is in release 1.</b> Check the risk before committing to that.';
  }
  capsEl.addEventListener('click', e=>{
    const b = e.target.closest('button'); if (!b) return;
    const c = CAPS.find(x=>x.id === b.dataset.id);
    if (c.core && c.on){ b.animate([{transform:'translateX(0)'},{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}],{duration:240}); document.getElementById('brLater').innerHTML = `<b>${c.name} is core.</b> Without it there is no first release to talk about.`; return; }
    c.on = !c.on; b.setAttribute('aria-pressed', c.on); renderBase();
  });
  renderBase();
})();
