/* Meu Controle — V1.21: calendário desktop real + agenda lateral */
(function(){
 if(window.__mcDesktopCalendarSplitV121)return;window.__mcDesktopCalendarSplitV121=true;
 const mq=matchMedia('(min-width:701px)');
 const state={day:null,doneOpen:false};
 const monthNames=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
 const week=['DOM','SEG','TER','QUA','QUI','SEX','SÁB'];
 function css(){if(document.getElementById('mcDesktopCalendarSplitV121Style'))return;const s=document.createElement('style');s.id='mcDesktopCalendarSplitV121Style';s.textContent=`
 @media(min-width:701px){
  #calendarPage .calendar-head{margin-bottom:12px}
  #calendarPage .calendar-months,#calendarPage .calendar-year-nav{display:none!important}
  #calendarPage .calendar-layout{display:grid!important;grid-template-columns:minmax(330px,38%) minmax(0,1fr);gap:18px;align-items:start}
  #calendarPage .mc-cal-board-v121{border:1px solid #e1e8e4;border-radius:17px;background:linear-gradient(180deg,#fff,#f8faf9);box-shadow:0 5px 18px rgba(22,79,120,.05);padding:15px;position:sticky;top:12px}
  #calendarPage .mc-cal-nav-v121{display:grid;grid-template-columns:34px 1fr 34px;align-items:center;gap:8px;margin-bottom:12px}
  #calendarPage .mc-cal-nav-v121 button{width:34px;height:34px;padding:0;border:0;border-radius:9px;background:#edf3f0;color:#315244;font-size:20px;box-shadow:none}
  #calendarPage .mc-cal-nav-v121 button:hover{background:#e3ede8;transform:none}
  #calendarPage .mc-cal-nav-v121 strong{display:block;text-align:center;font-size:16px;color:#173f5a}
  #calendarPage .mc-cal-year-v121{display:block;text-align:center;font-size:11px;color:#7a8881;margin-top:2px}
  #calendarPage .mc-cal-week-v121,#calendarPage .mc-cal-grid-v121{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}
  #calendarPage .mc-cal-week-v121{margin-bottom:5px}.mc-cal-week-v121 span{text-align:center;font:800 9px/1 system-ui,sans-serif;letter-spacing:.05em;color:#87938d}
  #calendarPage .mc-cal-day-v121{position:relative;min-height:48px;padding:7px 5px;border:1px solid transparent;border-radius:10px;background:transparent;color:#34473e;text-align:left;box-shadow:none;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:4px}
  #calendarPage .mc-cal-day-v121:hover{background:#f1f6f3;transform:none}
  #calendarPage .mc-cal-day-v121.out{opacity:.28;pointer-events:none}
  #calendarPage .mc-cal-day-v121.today{border-color:rgba(22,79,120,.32);background:#f2f7fa}
  #calendarPage .mc-cal-day-v121.selected{background:linear-gradient(145deg,rgba(34,105,153,.94),rgba(16,72,111,.88));color:#fff;border-color:transparent;box-shadow:0 7px 16px rgba(22,79,120,.2)}
  #calendarPage .mc-cal-day-num-v121{font:800 13px/1 system-ui,sans-serif}
  #calendarPage .mc-cal-dots-v121{display:flex;justify-content:center;gap:3px;min-height:5px}.mc-cal-dot-v121{width:5px;height:5px;border-radius:50%;background:#2c789f}.mc-cal-dot-v121.done{background:#aab8b1}.mc-cal-day-v121.selected .mc-cal-dot-v121{background:#fff}.mc-cal-day-v121.selected .mc-cal-dot-v121.done{opacity:.6}
  #calendarPage .mc-cal-clear-v121{display:none;width:100%;margin-top:11px;padding:8px;border:0;border-radius:9px;background:#edf3f0;color:#315244;font-size:12px;font-weight:700;box-shadow:none}.mc-cal-clear-v121.show{display:block!important}
  #calendarPage .calendar-events-panel{border:1px solid #e1e8e4!important;border-radius:17px!important;padding:15px!important;background:#fff;min-height:360px}
  #calendarPage .calendar-events-head{margin:0 0 12px!important}.calendar-search{display:none!important}
  #calendarPage #calendarEventsList{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:11px!important;align-items:start}
  #calendarPage #calendarEventsList .item{min-height:86px!important;padding:13px!important}
  #calendarPage .mc-cal-pending-title-v121{grid-column:1/-1;font:800 10px/1 system-ui,sans-serif;letter-spacing:.055em;text-transform:uppercase;color:#637168;padding:2px 2px 0}
  #calendarPage .mc-calendar-done-heading-v120{grid-column:1/-1!important}
  #calendarPage .mc-cal-no-pending-v121{grid-column:1/-1;padding:16px;border:1px dashed #dce5e0;border-radius:12px;text-align:center;color:#7b8881;font-size:13px}
 }
 @media(min-width:701px) and (max-width:1050px){#calendarPage .calendar-layout{grid-template-columns:minmax(300px,42%) minmax(0,1fr)}#calendarPage #calendarEventsList{grid-template-columns:1fr!important}}
 `;document.head.appendChild(s)}
 function entriesForMonth(){try{return calendarEntries().sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||'')))}catch{return[]}}
 function dayNum(e){return Number(String(e.date||'').slice(8,10))}
 function buildCalendar(){
  const layout=document.querySelector('#calendarPage .calendar-layout');if(!layout||!mq.matches)return;
  let board=layout.querySelector('.mc-cal-board-v121');if(!board){board=document.createElement('section');board.className='mc-cal-board-v121';layout.prepend(board)}
  const all=entriesForMonth(),byDay=new Map();all.forEach(e=>{const d=dayNum(e);if(!byDay.has(d))byDay.set(d,[]);byDay.get(d).push(e)});
  const first=new Date(calendarYear,calendarMonth,1).getDay(),days=new Date(calendarYear,calendarMonth+1,0).getDate();
  const now=new Date();const today=now.getFullYear()===calendarYear&&now.getMonth()===calendarMonth?now.getDate():null;
  let cells='';for(let i=0;i<42;i++){const d=i-first+1;if(d<1||d>days){cells+=`<button class="mc-cal-day-v121 out" tabindex="-1"></button>`;continue}const es=byDay.get(d)||[],dots=es.slice(0,4).map(e=>`<i class="mc-cal-dot-v121${e.done?' done':''}"></i>`).join('');cells+=`<button class="mc-cal-day-v121${d===today?' today':''}${state.day===d?' selected':''}" data-day="${d}" aria-label="Dia ${d}"><span class="mc-cal-day-num-v121">${d}</span><span class="mc-cal-dots-v121">${dots}</span></button>`}
  board.innerHTML=`<div class="mc-cal-nav-v121"><button type="button" data-nav="prev" aria-label="Mês anterior">‹</button><div><strong>${monthNames[calendarMonth]}</strong><span class="mc-cal-year-v121">${calendarYear}</span></div><button type="button" data-nav="next" aria-label="Próximo mês">›</button></div><div class="mc-cal-week-v121">${week.map(w=>`<span>${w}</span>`).join('')}</div><div class="mc-cal-grid-v121">${cells}</div><button type="button" class="mc-cal-clear-v121${state.day?' show':''}">Ver mês inteiro</button>`;
  board.querySelector('[data-nav="prev"]').onclick=()=>{state.day=null;if(--calendarMonth<0){calendarMonth=11;calendarYear--}renderCalendar()};
  board.querySelector('[data-nav="next"]').onclick=()=>{state.day=null;if(++calendarMonth>11){calendarMonth=0;calendarYear++}renderCalendar()};
  board.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{const d=Number(b.dataset.day);state.day=state.day===d?null:d;refreshRight();buildCalendar()});
  board.querySelector('.mc-cal-clear-v121').onclick=()=>{state.day=null;refreshRight();buildCalendar()};
 }
 function refreshRight(){
  if(!mq.matches)return;const all=entriesForMonth(),shown=state.day?all.filter(e=>dayNum(e)===state.day):all,pending=shown.filter(e=>!e.done),done=shown.filter(e=>e.done);
  const title=document.getElementById('calendarMonthTitle'),summary=document.getElementById('calendarMonthSummary'),list=document.getElementById('calendarEventsList'),empty=document.getElementById('calendarEmpty');if(!list)return;
  if(title)title.textContent=state.day?`${String(state.day).padStart(2,'0')} de ${monthNames[calendarMonth]} de ${calendarYear}`:`${monthNames[calendarMonth]} ${calendarYear}`;
  if(summary){const expense=shown.filter(e=>e.type==='despesa').reduce((s,e)=>s+Number(e.value||0),0);summary.textContent=`${shown.length} lançamento${shown.length===1?'':'s'} • ${pending.length} pendente${pending.length===1?'':'s'} • ${fmtMoney(expense)} em despesas`}
  list.innerHTML='';if(empty){empty.classList.toggle('hidden',shown.length>0);empty.textContent=state.day?'Nenhum lançamento neste dia.':'Nenhum lançamento neste mês.'}
  if(!shown.length)return;
  const ph=document.createElement('div');ph.className='mc-cal-pending-title-v121';ph.textContent='Pendentes';list.appendChild(ph);
  if(pending.length)pending.forEach(e=>list.appendChild(createItemNode(e,'calendar')));else{const n=document.createElement('div');n.className='mc-cal-no-pending-v121';n.textContent='Nenhum lançamento pendente.';list.appendChild(n)}
  if(done.length){const h=document.createElement('div');h.className='mc-calendar-done-heading-v120'+(state.doneOpen?'':' collapsed');h.setAttribute('role','button');h.setAttribute('tabindex','0');h.setAttribute('aria-expanded',String(state.doneOpen));h.innerHTML=`<strong>✓ Concluídos</strong><span class="mc-calendar-done-count-v120">${done.length} ${done.length===1?'item':'itens'}</span><span class="mc-calendar-done-toggle-v120" aria-hidden="true">⌄</span>`;const apply=()=>{h.classList.toggle('collapsed',!state.doneOpen);h.setAttribute('aria-expanded',String(state.doneOpen));list.querySelectorAll('.mc-cal-done-v121').forEach(i=>i.style.display=state.doneOpen?'':'none')};const flip=e=>{e?.preventDefault();e?.stopPropagation();state.doneOpen=!state.doneOpen;apply()};h.onclick=flip;h.onkeydown=e=>{if(e.key==='Enter'||e.key===' ')flip(e)};list.appendChild(h);done.forEach(e=>{const n=createItemNode(e,'calendar');const item=n.querySelector?.('.item')||n;if(item?.classList)item.classList.add('mc-cal-done-v121');list.appendChild(n)});apply()}
 }
 function install(){if(!mq.matches)return;css();const layout=document.querySelector('#calendarPage .calendar-layout');if(!layout)return;const months=document.getElementById('calendarMonths');if(months)months.style.display='none';buildCalendar();refreshRight()}
 const observer=new MutationObserver(()=>{if(mq.matches)setTimeout(install,0)});window.addEventListener('load',()=>setTimeout(install,800));mq.addEventListener?.('change',()=>setTimeout(install,100));setTimeout(()=>{const p=document.getElementById('calendarPage');if(p)observer.observe(p,{childList:true,subtree:true});install()},350);
 window.MeuControleDesktopCalendarSplitV121={version:'1.21',refresh:install};
})();
