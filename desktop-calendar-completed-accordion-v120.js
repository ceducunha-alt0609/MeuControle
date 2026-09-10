/* Meu Controle — V1.21: concluídos no rodapé + acordeão estável no Calendário desktop */
(function(){
 if(window.__mcDesktopCalendarCompletedAccordionV120)return;window.__mcDesktopCalendarCompletedAccordionV120=true;
 const mq=matchMedia('(min-width:701px)');
 const list=document.getElementById('calendarEventsList');
 const title=document.getElementById('calendarMonthTitle');
 if(!list)return;
 const state=new Map();let scheduled=false,arranging=false;
 let listObserver=null;
 function installStyles(){if(document.getElementById('mcDesktopCalendarCompletedAccordionV120Style'))return;const s=document.createElement('style');s.id='mcDesktopCalendarCompletedAccordionV120Style';s.textContent=`
 @media(min-width:701px){
  #calendarPage .mc-calendar-done-heading-v120{grid-column:1/-1;display:flex;align-items:center;gap:10px;margin:2px 0 0;padding:8px 10px;border-top:1px solid #dfe6e1;border-bottom:1px solid #edf1ee;background:linear-gradient(90deg,rgba(98,112,104,.07),rgba(255,255,255,.3));color:#69766f;cursor:pointer;user-select:none}
  #calendarPage .mc-calendar-done-heading-v120 strong{font-size:11px;letter-spacing:.055em;text-transform:uppercase;color:#637168}
  #calendarPage .mc-calendar-done-count-v120{margin-left:auto;font-size:10px;font-weight:700;color:#8a958f;white-space:nowrap}
  #calendarPage .mc-calendar-done-toggle-v120{width:25px;height:25px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 25px;border:1px solid rgba(var(--primary-rgb),.18);border-radius:8px;background:rgba(255,255,255,.7);color:var(--primary);font:800 16px/1 system-ui,sans-serif;transition:transform .16s ease}
  #calendarPage .mc-calendar-done-heading-v120.collapsed .mc-calendar-done-toggle-v120{transform:rotate(-90deg)}
  #calendarPage #calendarEventsList .item.mc-calendar-done-hidden-v120{display:none!important}
 }
 `;document.head.appendChild(s)}
 function key(){return (title?.textContent||'calendar').trim()||'calendar'}
 function observeList(){if(!listObserver)return;listObserver.observe(list,{childList:true})}
 function arrange(){
  scheduled=false;if(!mq.matches||arranging)return;arranging=true;listObserver?.disconnect();
  try{
   list.querySelectorAll('.mc-calendar-done-heading-v120').forEach(h=>h.remove());
   const items=[...list.children].filter(el=>el.classList?.contains('item'));
   if(!items.length)return;
   items.forEach(i=>i.classList.remove('mc-calendar-done-hidden-v120'));
   const pending=items.filter(i=>!i.classList.contains('done'));
   const done=items.filter(i=>i.classList.contains('done'));
   const frag=document.createDocumentFragment();
   pending.forEach(i=>frag.appendChild(i));
   if(done.length){
    const k=key();if(!state.has(k))state.set(k,false);
    const heading=document.createElement('div');heading.className='mc-calendar-done-heading-v120';heading.setAttribute('role','button');heading.setAttribute('tabindex','0');
    heading.innerHTML=`<strong>✓ Concluídos</strong><span class="mc-calendar-done-count-v120">${done.length} ${done.length===1?'item':'itens'}</span><span class="mc-calendar-done-toggle-v120" aria-hidden="true">⌄</span>`;
    const apply=()=>{const open=state.get(k);heading.classList.toggle('collapsed',!open);heading.setAttribute('aria-expanded',String(open));done.forEach(i=>i.classList.toggle('mc-calendar-done-hidden-v120',!open))};
    const flip=e=>{e?.preventDefault();e?.stopPropagation();state.set(k,!state.get(k));apply()};
    heading.addEventListener('click',flip);heading.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')flip(e)});
    frag.appendChild(heading);done.forEach(i=>frag.appendChild(i));list.appendChild(frag);apply();
   }else list.appendChild(frag);
  }finally{arranging=false;observeList()}
 }
 function schedule(){if(scheduled||arranging)return;scheduled=true;requestAnimationFrame(arrange)}
 installStyles();listObserver=new MutationObserver(schedule);observeList();if(title)new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});mq.addEventListener?.('change',schedule);window.addEventListener('load',()=>setTimeout(schedule,650));setTimeout(schedule,250);
 window.MeuControleDesktopCalendarCompletedAccordionV120={version:'1.21',refresh:schedule};
})();
