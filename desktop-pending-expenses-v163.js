/* Meu Controle — Despesas pendentes Desktop V1.2 */
(()=>{
  if(window.__mcDesktopPendingExpensesV163)return;
  window.__mcDesktopPendingExpensesV163=true;

  const desktop=()=>matchMedia('(min-width:701px)').matches;
  const money=n=>Number(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const validValue=e=>e?.type==='despesa'&&!e?.done&&!e?.valuePending ? Number(e.value||0) : 0;
  const profileEntries=()=>{
    try{return typeof profileFiltered==='function' ? profileFiltered(entries) : (Array.isArray(entries)?entries:[])}catch{return[]}
  };
  const monthEntries=()=>{
    try{return typeof dashboardMonthEntries==='function' ? dashboardMonthEntries() : []}catch{return[]}
  };

  function correctSummary(){
    if(!desktop())return;
    const total=monthEntries().reduce((sum,e)=>sum+validValue(e),0);
    const el=document.getElementById('sumPending');
    if(el)el.textContent=money(total);
  }

  function correctDashboard(){
    if(!desktop())return;
    const all=profileEntries();
    const month=monthEntries();
    const monthTotal=month.reduce((sum,e)=>sum+validValue(e),0);
    const lateTotal=all.reduce((sum,e)=>{
      try{return !e.done&&e.type==='despesa'&&!e.valuePending&&daysFromToday(e.date)<0 ? sum+Number(e.value||0) : sum}catch{return sum}
    },0);
    const monthMain=document.getElementById('dashExpensesMain');
    const monthSub=document.getElementById('dashExpensesSub');
    const lateSub=document.getElementById('dashLateSub');
    if(monthMain)monthMain.textContent=money(monthTotal);
    if(monthSub)monthSub.textContent=`${money(monthTotal)} pendente no mês`;
    if(lateSub)lateSub.textContent=money(lateTotal);
  }

  function refresh(){correctSummary();correctDashboard()}

  /* app.js chama renderDashboard() ao usar as setas. Mantemos a correção
     dentro da mesma renderização para a faixa superior acompanhar o mês. */
  const originalDashboard=typeof renderDashboard==='function'?renderDashboard:null;
  if(originalDashboard){
    renderDashboard=function(){const out=originalDashboard.apply(this,arguments);refresh();return out};
  }
  const originalSummary=typeof renderSummary==='function'?renderSummary:null;
  if(originalSummary){
    renderSummary=function(){const out=originalSummary.apply(this,arguments);correctSummary();return out};
  }

  /* Defesa para camadas desktop que possam ter capturado a renderização
     original antes deste módulo: as próprias setas atualizam após o clique. */
  function bindMonthNavigation(){
    ['dashPrevMonth','dashNextMonth'].forEach(id=>{
      const btn=document.getElementById(id);
      if(!btn||btn.dataset.mcPendingMonthV163==='1')return;
      btn.dataset.mcPendingMonthV163='1';
      btn.addEventListener('click',()=>requestAnimationFrame(refresh));
    });
  }

  function boot(){bindMonthNavigation();refresh()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('meucontrole:sync-manual-v012-complete',refresh);
  matchMedia('(min-width:701px)').addEventListener?.('change',()=>requestAnimationFrame(boot));
  window.MeuControleDesktopPendingExpensesV163={version:'1.2',refresh};
})();
