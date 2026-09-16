/* Meu Controle — Competência única + despesas pendentes Desktop V1.4 */
(()=>{
  if(window.__mcDesktopPendingExpensesV163)return;
  window.__mcDesktopPendingExpensesV163=true;
  const desktop=()=>matchMedia('(min-width:701px)').matches;
  const money=n=>Number(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const validValue=e=>e?.type==='despesa'&&!e?.done&&!e?.valuePending?Number(e.value||0):0;
  const profileEntries=()=>{try{return typeof profileFiltered==='function'?profileFiltered(entries):(Array.isArray(entries)?entries:[])}catch{return[]}};
  let syncing=false;

  function period(){try{return{month:dashboardMonth,year:dashboardYear}}catch{const d=new Date();return{month:d.getMonth(),year:d.getFullYear()}}}
  function periodEntries(){const{month,year}=period();return profileEntries().filter(e=>{const[y,m]=String(e.date||'').split('-').map(Number);return y===year&&m===month+1})}
  function syncFromDashboard(){if(!desktop()||syncing)return;try{syncing=true;calendarMonth=dashboardMonth;calendarYear=dashboardYear}catch{}finally{syncing=false}}
  function syncFromCalendar(){if(!desktop()||syncing)return;try{syncing=true;dashboardMonth=calendarMonth;dashboardYear=calendarYear}catch{}finally{syncing=false}}

  function correctSummary(){if(!desktop())return;const el=document.getElementById('sumPending');if(el)el.textContent=money(periodEntries().reduce((s,e)=>s+validValue(e),0))}
  function correctDashboard(){
    if(!desktop())return;
    const monthTotal=periodEntries().reduce((s,e)=>s+validValue(e),0),all=profileEntries();
    const lateTotal=all.reduce((s,e)=>{try{return !e.done&&e.type==='despesa'&&!e.valuePending&&daysFromToday(e.date)<0?s+Number(e.value||0):s}catch{return s}},0);
    const main=document.getElementById('dashExpensesMain'),sub=document.getElementById('dashExpensesSub'),late=document.getElementById('dashLateSub');
    if(main)main.textContent=money(monthTotal);if(sub)sub.textContent=`${money(monthTotal)} pendente no mês`;if(late)late.textContent=money(lateTotal);correctSummary();
  }
  function refresh(){correctDashboard();correctSummary()}

  const originalDashboard=typeof renderDashboard==='function'?renderDashboard:null;
  if(originalDashboard)renderDashboard=function(){const out=originalDashboard.apply(this,arguments);requestAnimationFrame(refresh);return out};
  const originalSummary=typeof renderSummary==='function'?renderSummary:null;
  if(originalSummary)renderSummary=function(){const out=originalSummary.apply(this,arguments);requestAnimationFrame(correctSummary);return out};

  function bind(){
    if(!desktop())return;
    ['dashPrevMonth','dashNextMonth'].forEach(id=>{const b=document.getElementById(id);if(!b||b.dataset.mcPeriodV164)return;b.dataset.mcPeriodV164='1';b.addEventListener('click',()=>requestAnimationFrame(()=>{syncFromDashboard();refresh()}))});
    const cal=document.getElementById('calendarPage');
    if(cal&&!cal.dataset.mcPeriodV164){cal.dataset.mcPeriodV164='1';cal.addEventListener('click',e=>{if(e.target.closest('.calendar-month-btn,.calendar-year-inline-v024 button,#calendarPrevYear,#calendarNextYear'))requestAnimationFrame(()=>requestAnimationFrame(()=>{syncFromCalendar();refresh()}))})}
    document.querySelectorAll('.nav-btn').forEach(b=>{if(b.dataset.mcPeriodV164)return;b.dataset.mcPeriodV164='1';b.addEventListener('click',()=>{
      if(b.dataset.page==='calendar'){syncFromDashboard();requestAnimationFrame(()=>{try{renderCalendar()}catch{}refresh()})}
      if(b.dataset.page==='dashboard'){syncFromCalendar();requestAnimationFrame(()=>{try{renderDashboard()}catch{}refresh()})}
    })});
  }
  function boot(){bind();syncFromDashboard();refresh()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('meucontrole:sync-manual-v012-complete',refresh);
  matchMedia('(min-width:701px)').addEventListener?.('change',()=>requestAnimationFrame(boot));
  window.MeuControleDesktopPendingExpensesV163={version:'1.4',refresh};
})();
