/* Meu Controle — Competência única Desktop V1.0 */
(()=>{
  if(window.__mcDesktopPeriodSyncV164)return;
  window.__mcDesktopPeriodSyncV164=true;
  const desktop=()=>matchMedia('(min-width:701px)').matches;
  let syncing=false;

  function fromDashboard(){
    if(!desktop()||syncing)return;
    try{
      syncing=true;
      calendarMonth=dashboardMonth;
      calendarYear=dashboardYear;
    }catch{}finally{syncing=false}
  }
  function fromCalendar(){
    if(!desktop()||syncing)return;
    try{
      syncing=true;
      dashboardMonth=calendarMonth;
      dashboardYear=calendarYear;
    }catch{}finally{syncing=false}
  }
  function refreshPending(){requestAnimationFrame(()=>window.MeuControleDesktopPendingExpensesV163?.refresh?.())}

  function bind(){
    if(!desktop())return;
    ['dashPrevMonth','dashNextMonth'].forEach(id=>{
      const b=document.getElementById(id);if(!b||b.dataset.mcPeriodSyncV164)return;
      b.dataset.mcPeriodSyncV164='1';
      b.addEventListener('click',()=>{fromDashboard();refreshPending()});
    });
    const cal=document.getElementById('calendarPage');
    if(cal&&!cal.dataset.mcPeriodSyncV164){
      cal.dataset.mcPeriodSyncV164='1';
      cal.addEventListener('click',e=>{
        if(e.target.closest('.calendar-month-btn,.calendar-year-inline-v024 button,#calendarPrevYear,#calendarNextYear')){
          requestAnimationFrame(()=>{fromCalendar();refreshPending()});
        }
      });
    }
    document.querySelectorAll('.nav-btn').forEach(b=>{
      if(b.dataset.mcPeriodSyncV164)return;b.dataset.mcPeriodSyncV164='1';
      b.addEventListener('click',()=>{
        if(b.dataset.page==='dashboard'){
          fromCalendar();requestAnimationFrame(()=>{try{renderDashboard()}catch{}refreshPending()});
        }else if(b.dataset.page==='calendar'){
          fromDashboard();requestAnimationFrame(()=>{try{renderCalendar()}catch{}refreshPending()});
        }
      });
    });
  }

  function boot(){bind();fromDashboard();refreshPending()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  matchMedia('(min-width:701px)').addEventListener?.('change',()=>requestAnimationFrame(bind));
  window.MeuControleDesktopPeriodSyncV164={version:'1.0',fromDashboard,fromCalendar,refresh:bind};
})();
