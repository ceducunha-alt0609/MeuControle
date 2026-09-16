/* Meu Controle — Despesas pendentes Desktop V1.3 */
(()=>{
  if(window.__mcDesktopPendingExpensesV163)return;
  window.__mcDesktopPendingExpensesV163=true;

  const desktop=()=>matchMedia('(min-width:701px)').matches;
  const money=n=>Number(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const validValue=e=>e?.type==='despesa'&&!e?.done&&!e?.valuePending ? Number(e.value||0) : 0;
  const profileEntries=()=>{try{return typeof profileFiltered==='function'?profileFiltered(entries):(Array.isArray(entries)?entries:[])}catch{return[]}};

  function visiblePeriod(){
    try{
      const calendarVisible=!document.getElementById('calendarPage')?.classList.contains('hidden');
      if(calendarVisible&&typeof calendarMonth!=='undefined'&&typeof calendarYear!=='undefined')return{month:calendarMonth,year:calendarYear};
      if(typeof dashboardMonth!=='undefined'&&typeof dashboardYear!=='undefined')return{month:dashboardMonth,year:dashboardYear};
    }catch{}
    const d=new Date();return{month:d.getMonth(),year:d.getFullYear()};
  }
  function periodEntries(){
    const {month,year}=visiblePeriod();
    return profileEntries().filter(e=>{const [y,m]=String(e.date||'').split('-').map(Number);return y===year&&m===month+1});
  }

  function correctSummary(){
    if(!desktop())return;
    const total=periodEntries().reduce((sum,e)=>sum+validValue(e),0);
    const el=document.getElementById('sumPending');
    if(el)el.textContent=money(total);
  }
  function correctDashboard(){
    if(!desktop())return;
    const monthTotal=periodEntries().reduce((sum,e)=>sum+validValue(e),0);
    const all=profileEntries();
    const lateTotal=all.reduce((sum,e)=>{try{return !e.done&&e.type==='despesa'&&!e.valuePending&&daysFromToday(e.date)<0?sum+Number(e.value||0):sum}catch{return sum}},0);
    const monthMain=document.getElementById('dashExpensesMain');
    const monthSub=document.getElementById('dashExpensesSub');
    const lateSub=document.getElementById('dashLateSub');
    if(monthMain)monthMain.textContent=money(monthTotal);
    if(monthSub)monthSub.textContent=`${money(monthTotal)} pendente no mês`;
    if(lateSub)lateSub.textContent=money(lateTotal);
  }
  function refresh(){correctSummary();correctDashboard()}

  const originalDashboard=typeof renderDashboard==='function'?renderDashboard:null;
  if(originalDashboard)renderDashboard=function(){const out=originalDashboard.apply(this,arguments);requestAnimationFrame(refresh);return out};
  const originalSummary=typeof renderSummary==='function'?renderSummary:null;
  if(originalSummary)renderSummary=function(){const out=originalSummary.apply(this,arguments);requestAnimationFrame(correctSummary);return out};

  /* O Calendário possui navegação própria (calendarMonth/calendarYear).
     Atualiza a faixa superior depois de qualquer mudança de mês/ano nele. */
  function bindCalendar(){
    const page=document.getElementById('calendarPage');if(!page||page.dataset.mcPendingCalendarV163==='1')return;
    page.dataset.mcPendingCalendarV163='1';
    page.addEventListener('click',e=>{
      if(e.target.closest('.calendar-month-btn,.calendar-year-inline-v024 button,#calendarPrevYear,#calendarNextYear'))requestAnimationFrame(()=>requestAnimationFrame(refresh));
    });
  }
  function bindDashboard(){
    ['dashPrevMonth','dashNextMonth'].forEach(id=>{const btn=document.getElementById(id);if(!btn||btn.dataset.mcPendingMonthV163==='1')return;btn.dataset.mcPendingMonthV163='1';btn.addEventListener('click',()=>requestAnimationFrame(refresh))});
  }
  function boot(){bindCalendar();bindDashboard();refresh()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('meucontrole:sync-manual-v012-complete',refresh);
  matchMedia('(min-width:701px)').addEventListener?.('change',()=>requestAnimationFrame(boot));
  window.MeuControleDesktopPendingExpensesV163={version:'1.3',refresh};
})();
