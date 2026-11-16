/* MeuControle — Diagnóstico de seleção do calendário desktop (somente leitura). */
(function(){
 'use strict';
 if(window.MeuControleCalendarDebugV1)return;
 const KEY='mc_calendar_debug_v1';
 const events=[];let total=0,lastSave=0,burst=0,burstStart=Date.now(),lastMutation=0;
 try{const old=JSON.parse(sessionStorage.getItem(KEY)||'[]');if(Array.isArray(old))events.push(...old.slice(-70))}catch{}
 function snapshot(){
   const list=document.getElementById('calendarEventsList');
   const selected=document.querySelector('#calendarPage .mc-cal-board-v124 .mc-cal-day-v124.selected[data-day]');
   const boards=document.querySelectorAll('#calendarPage .mc-cal-board-v124').length;
   return {day:selected?.dataset.day||'',month:(typeof calendarMonth==='number'?calendarMonth+1:null),
    year:(typeof calendarYear==='number'?calendarYear:null),cards:list?.children.length||0,
    special:list?.querySelectorAll(':scope > .mc-special-event-card').length||0,
    entries:list?.querySelectorAll('.item').length||0,boards};
 }
 function persist(){try{sessionStorage.setItem(KEY,JSON.stringify(events.slice(-75)))}catch{}}
 function log(event,detail=''){
   const now=Date.now();total++;
   if(now-burstStart>1000){burstStart=now;burst=0}
   burst++;
   if(burst>80){if(burst===81){events.push({t:new Date(now).toISOString(),event:'event-storm',detail:'mais de 80 eventos em um segundo',...snapshot()});persist()}return}
   events.push({t:new Date(now).toISOString(),event,detail:String(detail).slice(0,120),...snapshot()});
   if(events.length>80)events.splice(0,events.length-80);
   if(now-lastSave>120||event==='day-click'||event==='error'){lastSave=now;persist()}
 }
 window.MeuControleCalendarDebugV1={log,report:()=>JSON.stringify({note:'Diagnóstico local somente leitura; sem dados pessoais ou lançamento',total,events:events.slice(-75)},null,2)};
 function ensureButton(){
   if(!matchMedia('(min-width:701px)').matches)return;
   const head=document.querySelector('#calendarPage .calendar-head');
   if(!head||head.querySelector('.mc-calendar-debug-trigger'))return;
   const btn=document.createElement('button');btn.type='button';btn.className='secondary-action mc-calendar-debug-trigger';
   btn.textContent='🔎 Diagnóstico calendário';btn.style.cssText='margin-left:8px;font-size:11px;padding:8px 11px';
   btn.onclick=show;head.appendChild(btn);
 }
 function show(){
   document.getElementById('mc-calendar-debug-modal')?.remove();
   const veil=document.createElement('div');veil.id='mc-calendar-debug-modal';
   veil.style.cssText='position:fixed;inset:0;background:rgba(10,22,30,.65);z-index:120200;display:grid;place-items:center;padding:16px';
   const card=document.createElement('section');card.style.cssText='background:#fff;color:#263c45;border-radius:16px;padding:19px;width:min(750px,96vw);max-height:85vh;overflow:auto;box-shadow:0 15px 60px #0006';
   const h=document.createElement('h2');h.textContent='Diagnóstico do calendário — somente leitura';h.style.cssText='font-size:17px;margin:0 0 9px';card.appendChild(h);
   const p=document.createElement('p');p.textContent='Este relatório registra seleções de dias e atualizações dos cartões, sem alterar dados. Mesmo após F5, os últimos eventos ficam disponíveis nesta aba.';p.style.cssText='font-size:12px;line-height:1.5;margin:0 0 10px';card.appendChild(p);
   const pre=document.createElement('pre');pre.style.cssText='font-size:10px;line-height:1.4;white-space:pre-wrap;overflow-wrap:anywhere;max-height:50vh;overflow:auto;padding:10px;background:#f1f5f7;border-radius:9px';pre.textContent=window.MeuControleCalendarDebugV1.report();card.appendChild(pre);
   const row=document.createElement('div');row.style.cssText='display:flex;gap:9px;justify-content:flex-end;flex-wrap:wrap;margin-top:12px';
   const copy=document.createElement('button');copy.type='button';copy.textContent='Copiar diagnóstico';copy.onclick=async()=>{
     const report=window.MeuControleCalendarDebugV1.report();
     try{await navigator.clipboard.writeText(report);copy.textContent='Copiado ✓'}catch{
       const ta=document.createElement('textarea');ta.value=report;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();copy.textContent=ok?'Copiado ✓':'Não foi possível copiar';
     }
   };
   const close=document.createElement('button');close.type='button';close.className='secondary-action';close.textContent='Fechar';close.onclick=()=>veil.remove();
   row.append(copy,close);card.appendChild(row);veil.appendChild(card);document.body.appendChild(veil);
   veil.onclick=e=>{if(e.target===veil)veil.remove()};
 }
 document.addEventListener('click',e=>{
   const day=e.target?.closest?.('#calendarPage .mc-cal-board-v124 .mc-cal-day-v124[data-day]');
   if(!day)return;
   log('day-click','dia '+day.dataset.day);
   queueMicrotask(()=>log('after-click-microtask'));
   requestAnimationFrame(()=>log('after-click-frame'));
   setTimeout(()=>log('after-click-200ms'),200);
   setTimeout(()=>log('after-click-1000ms'),1000);
 },true);
 const attach=()=>{
   ensureButton();
   const list=document.getElementById('calendarEventsList');
   if(!list||list.dataset.mcCalendarDebugObserved==='1')return;
   list.dataset.mcCalendarDebugObserved='1';
   new MutationObserver(muts=>{
     if(Date.now()-lastMutation<120)return;
     lastMutation=Date.now();
     log('list-mutation','mutations '+muts.length);
   }).observe(list,{childList:true});
 };
 window.addEventListener('error',e=>log('error',String(e.message||'erro')+' '+String(e.filename||'').split('/').pop()));
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach,{once:true});
 else attach();
 window.addEventListener('load',()=>setTimeout(attach,450));
 setTimeout(attach,1200);
})();
