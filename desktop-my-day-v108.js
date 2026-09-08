/* V1.08 - Painel desktop: Meu Dia central */
(()=>{
  function applyDesktopMyDay(){
    if(window.matchMedia('(max-width:700px)').matches)return;
    const grid=document.querySelector('#dashboardPage .premium-cards');
    if(!grid)return;
    const month=grid.querySelector('[data-dash="month"]');
    const important=grid.querySelector('[data-dash="important"]');
    const today=grid.querySelector('[data-dash="today"]');
    const expenses=grid.querySelector('[data-dash="expenses"]');
    const late=grid.querySelector('[data-dash="late"]');
    if(!month||!important||!today||!expenses||!late)return;
    const label=today.querySelector('.premium-label');
    if(label)label.textContent='☀️ Meu Dia';
    [month,important,today,expenses,late].forEach(card=>grid.appendChild(card));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyDesktopMyDay,{once:true});
  else applyDesktopMyDay();
  window.addEventListener('resize',applyDesktopMyDay);
})();
