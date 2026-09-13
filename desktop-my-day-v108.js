/* V1.08.2 - Painel desktop: Meu Dia central, sem repintadas redundantes */
(()=>{
  if(window.__mcDesktopMyDayV1082)return;window.__mcDesktopMyDayV1082=true;
  function ensureDesktopStyle(){
    if(document.getElementById('desktopMyDayStyle'))return;
    const style=document.createElement('style');
    style.id='desktopMyDayStyle';
    style.textContent='@media(min-width:701px){#dashboardPage .premium-card[data-dash="today"]{border-width:2px!important}} @media(max-width:650px){#dashboardPage .premium-cards{grid-template-columns:repeat(2,minmax(0,1fr))!important}#dashboardPage .premium-card[data-dash="today"]{grid-column:1/-1!important;min-height:104px!important;padding:13px 16px!important}#dashboardPage .premium-card small{font-size:11px!important;line-height:1.25!important}#dashboardPage .premium-card[data-dash="today"] strong{margin-top:4px!important}#dashboardPage .premium-card[data-dash="today"] small{margin-top:3px!important}}';
    document.head.appendChild(style);
  }
  function desiredSubText(main){
    const count=Number(String(main?.textContent||'0').replace(/[^0-9-]/g,''))||0;
    return count===0?'Sem tarefas pra hoje':count===1?'Tarefa para hoje':'Tarefas para hoje';
  }
  let scheduled=false;
  function revealDashboard(){requestAnimationFrame(()=>requestAnimationFrame(()=>document.documentElement.classList.remove('mc-dashboard-boot')))}
  function applyDesktopMyDay(){
    scheduled=false;ensureDesktopStyle();
    if(window.matchMedia('(max-width:700px)').matches)return;
    const grid=document.querySelector('#dashboardPage .premium-cards');if(!grid)return;
    const month=grid.querySelector('[data-dash="month"]'),important=grid.querySelector('[data-dash="important"]'),today=grid.querySelector('[data-dash="today"]'),expenses=grid.querySelector('[data-dash="expenses"]'),late=grid.querySelector('[data-dash="late"]');
    if(!month||!important||!today||!expenses||!late)return;
    const label=today.querySelector('.premium-label'),main=today.querySelector('#dashTodayMain'),sub=today.querySelector('#dashTodaySub');
    if(label&&label.textContent!=='☀️ Meu Dia')label.textContent='☀️ Meu Dia';
    if(main&&sub){const wanted=desiredSubText(main);if(sub.textContent!==wanted)sub.textContent=wanted}
    const order=[month,important,today,expenses,late],current=[...grid.children].filter(el=>el.matches('.premium-card'));
    if(order.some((card,i)=>current[i]!==card))order.forEach(card=>grid.appendChild(card));
    revealDashboard();
  }
  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(applyDesktopMyDay)}
  function boot(){ensureDesktopStyle();applyDesktopMyDay();const main=document.getElementById('dashTodayMain');if(main)new MutationObserver(schedule).observe(main,{childList:true,subtree:true,characterData:true});window.addEventListener('resize',schedule,{passive:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.MeuControleDesktopMyDayV108={version:'1.08.2',refresh:schedule};
})();