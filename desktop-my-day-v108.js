/* V1.08 - Painel desktop: Meu Dia central */
(()=>{
  function ensureDesktopStyle(){
    if(document.getElementById('desktopMyDayStyle'))return;
    const style=document.createElement('style');
    style.id='desktopMyDayStyle';
    style.textContent='@media(min-width:701px){#dashboardPage .premium-card[data-dash="today"]{border-width:2px!important}}';
    document.head.appendChild(style);
  }
  function applyDesktopMyDay(){
    if(window.matchMedia('(max-width:700px)').matches)return;
    ensureDesktopStyle();
    const grid=document.querySelector('#dashboardPage .premium-cards');
    if(!grid)return;
    const month=grid.querySelector('[data-dash="month"]');
    const important=grid.querySelector('[data-dash="important"]');
    const today=grid.querySelector('[data-dash="today"]');
    const expenses=grid.querySelector('[data-dash="expenses"]');
    const late=grid.querySelector('[data-dash="late"]');
    if(!month||!important||!today||!expenses||!late)return;
    const label=today.querySelector('.premium-label');
    const main=today.querySelector('#dashTodayMain');
    const sub=today.querySelector('#dashTodaySub');
    if(label)label.textContent='☀️ Meu Dia';
    if(main&&sub){
      const count=Number(String(main.textContent||'0').replace(/[^0-9-]/g,''))||0;
      sub.textContent=count===0?'Sem tarefas pra hoje':count===1?'Tarefa para hoje':'Tarefas para hoje';
    }
    [month,important,today,expenses,late].forEach(card=>grid.appendChild(card));
  }
  function boot(){
    applyDesktopMyDay();
    const main=document.getElementById('dashTodayMain');
    if(main)new MutationObserver(applyDesktopMyDay).observe(main,{childList:true,subtree:true,characterData:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  window.addEventListener('resize',applyDesktopMyDay);
})();
