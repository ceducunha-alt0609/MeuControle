/* Meu Controle — V1.19: Agenda mobile com pendentes acima e concluídos em acordeão */
(function(){
 if(window.__mcAgendaCompletedAccordionV119)return;window.__mcAgendaCompletedAccordionV119=true;
 const mq=matchMedia('(max-width:700px)'),list=document.getElementById('calendarEventsList'),title=document.getElementById('calendarMonthTitle');if(!list||!title)return;
 const state=new Map();let scheduled=false,organizing=false;
 function installStyles(){if(document.getElementById('mcAgendaCompletedAccordionV119Style'))return;const s=document.createElement('style');s.id='mcAgendaCompletedAccordionV119Style';s.textContent=`
 @media(max-width:700px){
  #calendarPage .mobile-agenda-done-header-v119{display:flex;align-items:center;gap:10px;margin:5px 0 12px;padding:9px 11px;border-top:1px solid #dfe6e1;border-bottom:1px solid #edf1ee;background:linear-gradient(90deg,rgba(98,112,104,.07),rgba(255,255,255,.3));color:#69766f;cursor:pointer;user-select:none}
  #calendarPage .mobile-agenda-done-header-v119 strong{font-size:11px;letter-spacing:.055em;text-transform:uppercase;color:#637168}
  #calendarPage .mobile-agenda-done-header-v119 .mc-agenda-done-count-v119{margin-left:auto;font-size:10px;font-weight:700;color:#8a958f;white-space:nowrap}
  #calendarPage .mobile-agenda-done-toggle-v119{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border:1px solid rgba(var(--primary-rgb),.16);border-radius:7px;background:rgba(255,255,255,.68);color:var(--primary);font:800 14px/1 system-ui,sans-serif;transition:transform .16s ease}
  #calendarPage .mobile-agenda-done-header-v119.collapsed .mobile-agenda-done-toggle-v119{transform:rotate(-90deg)}
  #calendarPage #calendarEventsList>.item.mc-agenda-done-hidden-v119{display:none!important}
 }
 `;document.head.appendChild(s)}
 function monthKey(){return (title.textContent||'agenda').trim()}
 function schedule(){if(scheduled||organizing)return;scheduled=true;requestAnimationFrame(organize)}
 function organize(){scheduled=false;if(!mq.matches)return;organizing=true;try{
  const oldHeader=list.querySelector(':scope > .mobile-agenda-done-header-v119');
  const items=[...list.children].filter(el=>el.classList?.contains('item'));
  if(!items.length){oldHeader?.remove();return}
  const pending=items.filter(el=>!el.classList.contains('done')),done=items.filter(el=>el.classList.contains('done'));
  if(!done.length){oldHeader?.remove();items.forEach(el=>el.classList.remove('mc-agenda-done-hidden-v119'));return}
  const key=monthKey();if(!state.has(key))state.set(key,false);const open=state.get(key);
  const header=oldHeader||document.createElement('div');header.className='mobile-agenda-done-header-v119'+(open?'':' collapsed');header.setAttribute('role','button');header.setAttribute('tabindex','0');header.setAttribute('aria-expanded',String(open));header.innerHTML=`<strong>✓ Concluídos</strong><span class="mc-agenda-done-count-v119">${done.length} ${done.length===1?'item':'itens'}</span><span class="mobile-agenda-done-toggle-v119" aria-hidden="true">⌄</span>`;
  if(!header.__mcAgendaDoneBoundV119){header.__mcAgendaDoneBoundV119=true;const toggle=e=>{e?.preventDefault();e?.stopPropagation();state.set(monthKey(),!state.get(monthKey()));schedule()};header.addEventListener('click',toggle);header.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')toggle(e)})}
  done.forEach(el=>el.classList.toggle('mc-agenda-done-hidden-v119',!open));pending.forEach(el=>el.classList.remove('mc-agenda-done-hidden-v119'));
  const desired=[...pending,header,...done],current=[...list.children];if(current.length!==desired.length||desired.some((el,i)=>current[i]!==el))list.replaceChildren(...desired);
 }finally{organizing=false}}
 installStyles();new MutationObserver(schedule).observe(list,{childList:true});new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});mq.addEventListener?.('change',schedule);document.querySelectorAll('.nav-btn[data-page="calendar"]').forEach(b=>b.addEventListener('click',()=>setTimeout(schedule,40)));window.addEventListener('load',()=>setTimeout(schedule,700));setTimeout(schedule,250);
 window.MeuControleAgendaCompletedAccordionV119={version:'1.19',refresh:schedule};
})();
