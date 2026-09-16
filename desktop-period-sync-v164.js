/* Meu Controle — Competência única Desktop V1.3 */
(()=>{
  if(window.__mcDesktopPeriodSyncV164)return;
  window.__mcDesktopPeriodSyncV164=true;
  const desktop=()=>matchMedia('(min-width:701px)').matches;
  const refreshPending=()=>requestAnimationFrame(()=>window.MeuControleDesktopPendingExpensesV163?.refresh?.());

  /* A sincronização Calendário -> Painel agora pertence ao próprio
     desktop-calendar-v024.js. Este módulo cuida apenas do sentido
     Painel -> Calendário e da entrada nas telas, sem disputar cliques. */
  function toCalendar(render=false){
    if(!desktop())return;
    try{calendarMonth=dashboardMonth;calendarYear=dashboardYear;if(render)renderCalendar()}catch{}
    refreshPending();
  }

  function bindDashboard(){
    ['dashPrevMonth','dashNextMonth'].forEach(id=>{
      const b=document.getElementById(id);if(!b||b.dataset.mcPeriodSyncV164)return;
      b.dataset.mcPeriodSyncV164='1';
      b.addEventListener('click',()=>requestAnimationFrame(()=>toCalendar(false)));
    });
  }
  function bindNavigation(){
    document.querySelectorAll('.nav-btn').forEach(b=>{
      if(b.dataset.mcPeriodSyncV164)return;b.dataset.mcPeriodSyncV164='1';
      b.addEventListener('click',()=>{
        if(b.dataset.page==='calendar')requestAnimationFrame(()=>toCalendar(true));
        else if(b.dataset.page==='dashboard')requestAnimationFrame(()=>{try{renderDashboard()}catch{};refreshPending()});
      });
    });
  }
  function bind(){if(!desktop())return;bindDashboard();bindNavigation()}
  function boot(){bind();toCalendar(false)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  matchMedia('(min-width:701px)').addEventListener?.('change',()=>requestAnimationFrame(bind));
  window.MeuControleDesktopPeriodSyncV164={version:'1.3',toCalendar,refresh:bind};
})();
