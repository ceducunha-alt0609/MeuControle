/* Meu Controle — Competência única Desktop V1.1 */
(()=>{
  if(window.__mcDesktopPeriodSyncV164)return;
  window.__mcDesktopPeriodSyncV164=true;
  const desktop=()=>matchMedia('(min-width:701px)').matches;

  function syncCalendarToDashboard(render=false){
    if(!desktop())return;
    try{
      calendarMonth=dashboardMonth;
      calendarYear=dashboardYear;
      if(render)renderCalendar();
    }catch{}
    requestAnimationFrame(()=>window.MeuControleDesktopPendingExpensesV163?.refresh?.());
  }
  function setDashboardPeriod(month,year){
    if(!desktop())return;
    try{
      dashboardMonth=month;
      dashboardYear=year;
      renderDashboard();
      syncCalendarToDashboard(false);
    }catch{}
  }

  function bindDashboard(){
    ['dashPrevMonth','dashNextMonth'].forEach(id=>{
      const b=document.getElementById(id);if(!b||b.dataset.mcPeriodSyncV164)return;
      b.dataset.mcPeriodSyncV164='1';
      b.addEventListener('click',()=>requestAnimationFrame(()=>syncCalendarToDashboard(false)));
    });
  }

  function bindCalendar(){
    const page=document.getElementById('calendarPage');if(!page||page.dataset.mcPeriodSyncV164)return;
    page.dataset.mcPeriodSyncV164='1';
    /* Calendário passa a alimentar diretamente a competência do Painel.
       O clique nativo altera calendarMonth/calendarYear; após isso copiamos
       o período para o Painel e repintamos imediatamente os totais. */
    page.addEventListener('click',e=>{
      if(!e.target.closest('.calendar-month-btn,.calendar-year-inline-v024 button,#calendarPrevYear,#calendarNextYear'))return;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        try{setDashboardPeriod(calendarMonth,calendarYear)}catch{}
      }));
    });
  }

  function bindNavigation(){
    document.querySelectorAll('.nav-btn').forEach(b=>{
      if(b.dataset.mcPeriodSyncV164)return;b.dataset.mcPeriodSyncV164='1';
      b.addEventListener('click',()=>{
        if(b.dataset.page==='calendar')requestAnimationFrame(()=>syncCalendarToDashboard(true));
        if(b.dataset.page==='dashboard')requestAnimationFrame(()=>{try{renderDashboard()}catch{};window.MeuControleDesktopPendingExpensesV163?.refresh?.()});
      });
    });
  }

  function bind(){if(!desktop())return;bindDashboard();bindCalendar();bindNavigation()}
  function boot(){bind();syncCalendarToDashboard(false)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  matchMedia('(min-width:701px)').addEventListener?.('change',()=>requestAnimationFrame(bind));
  window.MeuControleDesktopPeriodSyncV164={version:'1.1',sync:syncCalendarToDashboard,set:setDashboardPeriod,refresh:bind};
})();
