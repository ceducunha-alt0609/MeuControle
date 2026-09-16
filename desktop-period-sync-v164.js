/* Meu Controle — Competência única Desktop V1.2 */
(()=>{
  if(window.__mcDesktopPeriodSyncV164)return;
  window.__mcDesktopPeriodSyncV164=true;
  const desktop=()=>matchMedia('(min-width:701px)').matches;

  function refreshPending(){requestAnimationFrame(()=>window.MeuControleDesktopPendingExpensesV163?.refresh?.())}
  function syncCalendarToDashboard(render=false){
    if(!desktop())return;
    try{calendarMonth=dashboardMonth;calendarYear=dashboardYear;if(render)renderCalendar()}catch{}
    refreshPending();
  }
  function syncDashboardToCalendar(){
    if(!desktop())return;
    try{dashboardMonth=calendarMonth;dashboardYear=calendarYear;renderDashboard()}catch{}
    refreshPending();
  }

  function bindDashboard(){
    ['dashPrevMonth','dashNextMonth'].forEach(id=>{
      const b=document.getElementById(id);if(!b||b.dataset.mcPeriodSyncV164)return;
      b.dataset.mcPeriodSyncV164='1';
      b.addEventListener('click',()=>requestAnimationFrame(()=>syncCalendarToDashboard(false)));
    });
  }

  /* Os botões dos meses/anos do Calendário são recriados a cada render.
     A delegação abaixo lê o botão clicado ANTES da recriação e sincroniza
     somente depois que o onclick nativo terminar. */
  function bindCalendar(){
    const months=document.getElementById('calendarMonths');if(!months||months.dataset.mcPeriodSyncV164)return;
    months.dataset.mcPeriodSyncV164='1';
    months.addEventListener('click',e=>{
      const monthBtn=e.target.closest('.calendar-month-btn');
      const yearBtn=e.target.closest('.calendar-year-inline-v024 button');
      if(!monthBtn&&!yearBtn)return;
      setTimeout(()=>syncDashboardToCalendar(),0);
    });
  }

  function bindNavigation(){
    document.querySelectorAll('.nav-btn').forEach(b=>{
      if(b.dataset.mcPeriodSyncV164)return;b.dataset.mcPeriodSyncV164='1';
      b.addEventListener('click',()=>{
        if(b.dataset.page==='calendar')requestAnimationFrame(()=>syncCalendarToDashboard(true));
        else if(b.dataset.page==='dashboard')requestAnimationFrame(()=>{try{renderDashboard()}catch{};refreshPending()});
      });
    });
  }

  function bind(){if(!desktop())return;bindDashboard();bindCalendar();bindNavigation()}
  function boot(){bind();syncCalendarToDashboard(false)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  matchMedia('(min-width:701px)').addEventListener?.('change',()=>requestAnimationFrame(bind));
  window.MeuControleDesktopPeriodSyncV164={version:'1.2',toCalendar:syncCalendarToDashboard,toDashboard:syncDashboardToCalendar,refresh:bind};
})();
