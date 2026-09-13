/* V1.08 - Painel desktop: Meu Dia central */
(()=>{
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
  function applyDesktopMyDay(){
    ensureDesktopStyle();
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
    const main=today.querySelector('#dashTodayMain');
    const sub=today.querySelector('#dashTodaySub');
    if(label&&label.textContent!=='☀️ Meu Dia')label.textContent='☀️ Meu Dia';
    if(main&&sub){
      const wanted=desiredSubText(main);
      if(sub.textContent!==wanted)sub.textContent=wanted;
    }
    const order=[month,important,today,expenses,late];
    const current=[...grid.children].filter(el=>el.matches('.premium-card'));
    if(order.some((card,i)=>current[i]!==card))order.forEach(card=>grid.appendChild(card));
  }
  function boot(){
    applyDesktopMyDay();
    const main=document.getElementById('dashTodayMain');
    const sub=document.getElementById('dashTodaySub');
    if(main)new MutationObserver(()=>requestAnimationFrame(applyDesktopMyDay)).observe(main,{childList:true,subtree:true,characterData:true});
    if(sub)new MutationObserver(()=>requestAnimationFrame(applyDesktopMyDay)).observe(sub,{childList:true,subtree:true,characterData:true});
    setTimeout(applyDesktopMyDay,50);
    setTimeout(applyDesktopMyDay,250);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  window.addEventListener('resize',applyDesktopMyDay);
})();