/* Contact JustJava page */
(function(){
  const { reduce, roll } = window.JJ;
  /* PRODUCTION: set data-endpoint on #form (contact.html) to the URL that receives the requirement as JSON.
     Until it is set, submissions are only logged in the console and nothing is sent. See README. */
  async function sendRequirement(data){
    delete data.website;
    const endpoint = document.getElementById('form').dataset.endpoint;
    if (!endpoint){ console.warn('Contact form endpoint not configured. Nothing was sent.', data); return; }
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Send failed with status ' + res.status);
  }
  /* contact: the form becomes a ticket */
  const form = document.getElementById('form'), chipEl = document.getElementById('lvChip');
  const $ = id => document.getElementById(id);
  const fields = ['name','company','email','type','achieve','today','why','time','budget','links'];
  const val = n => (form.elements[n].value || '').trim();
  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const clip = (t, n) => t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t;
  function setChip(text, cls){ const cur = chipEl.textContent.trim(); if (cur !== text){ chipEl.innerHTML = '<span class="in"></span>'; chipEl.firstChild.textContent = text; } chipEl.classList.toggle('ready', cls === 'ready'); chipEl.classList.toggle('final', cls === 'final'); }
  function update(){
    const a = val('achieve');
    $('lvTitle').textContent = a ? clip(a.split(/(?<=[.!?])\s/)[0], 90) : 'Your requirement';
    const who = [val('name'), val('company')].filter(Boolean).join(' · ');
    $('lvOrg').textContent = who || 'Organisation not added yet';
    const map = {type:val('type'), today:val('today'), why:val('why'), time:val('time'), budget:val('budget'), links:val('links')};
    document.querySelectorAll('.lv-row').forEach(r=>{
      const v = map[r.dataset.f], dd = r.querySelector('dd'), was = r.classList.contains('set');
      dd.textContent = v ? clip(v, 140) : 'Not added'; r.classList.toggle('set', !!v);
      if (v && !was){ r.classList.remove('set'); void r.offsetWidth; r.classList.add('set'); }
    });
    const n = fields.filter(f => f !== 'company' && val(f)).length;
    $('lvBar').style.transform = `scaleX(${n/9})`;
    $('lvCount').textContent = `${n} of 9 details`;
    if (val('name') && emailOk(val('email')) && a.length >= 8) setChip('READY TO SEND', 'ready');
    else if (a.length >= 8) setChip('BUSINESS REQUIREMENT');
    else setChip('DRAFT');
  }
  form.addEventListener('input', update); form.addEventListener('change', update);
  function showErr(n, msg){ const el = form.elements[n]; el.setAttribute('aria-invalid', msg ? 'true' : 'false'); if (msg) el.setAttribute('aria-describedby','e-'+n); else el.removeAttribute('aria-describedby'); $('e-'+n).textContent = msg || ''; }
  form.addEventListener('submit', async e=>{
    e.preventDefault();
    const errs = [];
    if (!val('name')){ showErr('name','Add your name so we know who to reply to.'); errs.push('name'); } else showErr('name');
    if (!emailOk(val('email'))){ showErr('email','Enter a work email we can reply to, like name@company.com.'); errs.push('email'); } else showErr('email');
    if (val('achieve').length < 8){ showErr('achieve','Tell us what you are trying to achieve, even in one sentence.'); errs.push('achieve'); } else showErr('achieve');
    if (errs.length){ form.elements[errs[0]].focus(); return; }
    const sendBtn = form.querySelector('.submit'), sendErr = $('sendErr');
    sendErr.textContent = ''; sendBtn.disabled = true; sendBtn.textContent = 'Sending…';
    try { if (!val('website')) await sendRequirement(Object.fromEntries(new FormData(form))); }
    catch (err){ sendBtn.disabled = false; sendBtn.textContent = 'Start the Conversation'; sendErr.textContent = 'That did not send. Check your connection and try again.'; return; }
    $('lvId').textContent = 'REQ-' + String(Date.now()).slice(-4);
    setChip('UNDER REVIEW', 'final');
    $('lvNext').hidden = false; document.getElementById('live').classList.add('sent'); document.querySelector('.lv-rows').style.display = 'block';
    $('lvBar').style.transform = 'scaleX(1)'; $('lvCount').textContent = 'Received';
    form.hidden = true; $('done').hidden = false; $('done').focus({preventScroll:true});
    const top = document.querySelector('.c-main').getBoundingClientRect().top + scrollY - 80;
    scrollTo({top, behavior: reduce ? 'auto' : 'smooth'});
  });
  update();
})();
