/* Page not found page */
(function(){
  const { reduce, roll } = window.JJ;
  const p = location.pathname && location.pathname !== '/' ? location.pathname : '/this-page';
  document.getElementById('nfPath').textContent = p.length > 40 ? p.slice(0,39) + '…' : p;
  const c = document.getElementById('nfChip');
  setTimeout(()=>{ roll(c, 'REQUIREMENT UNCLEAR'); c.classList.add('unc'); }, reduce ? 0 : 1100);
})();
