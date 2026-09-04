/* Meu Controle — V0.24: calendário desktop em régua anual + cards */
(function(){
 if(window.__meuControleDesktopCalendarV024Loaded)return;window.__meuControleDesktopCalendarV024Loaded=true;
 const mq=matchMedia('(min-width:701px)');
 const originalRenderCalendar=typeof renderCalendar==='function'?renderCalendar:null;
 const shortMonths=['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
 function styles(){if(document.getElementById('desktopCalendarV024Style'))return;const s=document.createElement('style');s.id='desktopCalendarV024Style';s.textContent=`
 @media(min-width:701px){
  #calendarPage .calendar-head{margin-bottom:10px}
  #calendarPage .calendar-year-nav{display:none!important}
  #calendarPage .calendar-layout{display:block}
  #calendarPage .calendar-months{display:grid;grid-template-columns:repeat(12,minmax(52px,1fr)) 104px;gap:0;padding:0;margin-bottom:14px;overflow:visible;border:1px solid #dfe6e1;border-radius:14px;background:#fff}
  #calendarPage .calendar-month-btn{margin:0;min-height:62px;padding:8px 4px;border-radius:0;background:#fff;color:#4b5d53;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border-right:1px solid #edf0ee;position:relative}
  #calendarPage .calendar-month-btn:hover{background:#f7faf8;transform:none}
  #calendarPage .calendar-month-btn.active{background:var(--primary-soft);color:var(--primary)}
  #calendarPage .calendar-month-btn.active::after{content:"";position:absolute;left:18%;right:18%;bottom:0;height:3px;border-radius:3px 3px 0 0;background:var(--primary)}
  #calendarPage .calendar-month-btn .month-name-v024{font-size:11px;font-weight:800;letter-spacing:.04em}
  #calendarPage .calendar-month-btn .month-badge{min-width:0;width:auto;height:auto;border-radius:0;background:transparent!important;font-size:12px;font-weight:700;color:#7d8982}
  #calendarPage .calendar-month-btn.active .month-badge{color:var(--primary)}
  #calendarPage .calendar-year-inline-v024{display:flex;align-items:center;justify-content:center;gap:7px;background:#f8faf9;border-radius:0 13px 13px 0}
  #calendarPage .calendar-year-inline-v024 button{width:28px;height:32px;padding:0;background:#edf2ef;color:#365142;border-radius:8px}
  #calendarPage .calendar-year-inline-v024 strong{font-size:14px;color:#294337}
  #calendarPage .calendar-events-panel{border:0;padding:0;min-height:0}
  #calendarPage .calendar-events-head{margin-bottom:10px}
  #calendarPage .calendar-search{display:none!important}
  #calendarPage .calendar-events-scroll{overflow:auto;padding-right:4px}
  #calendarPage #calendarEventsList{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;align-items:start}
  #calendarPage .item{display:grid;grid-template-columns:12px minmax(0,1fr);gap:9px 11px;align-items:start;min-height:112px;padding:15px;background:#fff;cursor:pointer;transition:.16s ease}
  #calendarPage .item:hover{transform:translateY(-1px);box-shadow:0 8px 18px rgba(0,0,0,.06)}
  #calendarPage .item-title{font-size:17px;line-height:1.15}
  #calendarPage .item-title-row{align-items:center;flex-wrap:wrap}
  #calendarPage .meta{line-height:1.45}
  #calendarPage .notes{display:none;margin-top:8px;padding-top:8px;border-top:1px solid #e7ece9}
  #calendarPage .item-side{grid-column:2;display:flex;flex-direction:column;align-items:flex-start;gap:9px;text-align:left}
  #calendarPage .amount{font-size:22px;font-weight:800;line-height:1.05;color:var(--primary);white-space:nowrap}
  #calendarPage .amount:empty{display:none}
  #calendarPage .item-actions{display:none;gap:7px;margin-top:0;flex-wrap:wrap}
  #calendarPage .item.calendar-card-open-v024{box-shadow:0 10px 24px rgba(0,0,0,.08)}
  #calendarPage .item.calendar-card-open-v024 .item-actions{display:flex}
  #calendarPage .item.calendar-card-open-v024 .notes:not(:empty){display:block}
  #calendarPage .item.done{opacity:.52}
 }
 @media(min-width:701px) and (max-width:1180px){#calendarPage #calendarEventsList{grid-template-columns:repeat(2,minmax(0,1fr))}#calendarPage .calendar-months{grid-template-columns:repeat(6,1fr);}.calendar-year-inline-v024{grid-column:1/-1;min-height:46px;border-radius:0 0 13px 13px}}
 `;document.head.appendChild(s)}
 function card(fragment,e){const a=fragment.querySelector('.item');if(!a)return fragment;a.setAttribute('tabindex','0');a.setAttribute('aria-expanded','false');a.title='Clique para ver ações';const toggle=()=>{const open=a.classList.toggle('calendar-card-open-v024');a.setAttribute('aria-expanded',open?'true':'false');a.title=open?'Clique para recolher':'Clique para ver ações'};a.addEventListener('click',ev=>{if(ev.target.closest('button'))return;toggle()});a.addEventListener('keydown',ev=>{if((ev.key==='Enter'||ev.key===' ')&&!ev.target.closest('button')){ev.preventDefault();toggle()}});return fragment}
 function desktopRender(){styles();$('calendarYearLabel').textContent=calendarYear;const months=$('calendarMonths');months.innerHTML='';const yearEntries=profileFiltered(entries).filter(e=>Number(e.date.slice(0,4))===calendarYear);for(let m=0;m<12;m++){const count=yearEntries.filter(e=>Number(e.date.slice(5,7))===m+1).length;const b=document.createElement('button');b.className='calendar-month-btn'+(m===calendarMonth?' active':'');b.innerHTML=`<span class="month-name-v024">${shortMonths[m]}</span><span class="month-badge">${count}</span>`;b.onclick=()=>{calendarMonth=m;renderCalendar()};months.appendChild(b)}const yc=document.createElement('div');yc.className='calendar-year-inline-v024';yc.innerHTML='<button type="button" aria-label="Ano anterior">‹</button><strong></strong><button type="button" aria-label="Próximo ano">›</button>';yc.querySelector('strong').textContent=calendarYear;const yb=yc.querySelectorAll('button');yb[0].onclick=()=>{calendarYear--;renderCalendar()};yb[1].onclick=()=>{calendarYear++;renderCalendar()};months.appendChild(yc);
  const all=calendarEntries().sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||'')));$('calendarMonthTitle').textContent=`${monthName(calendarMonth)} ${calendarYear}`;$('calendarMonthSummary').textContent=`${all.length} lançamento${all.length===1?'':'s'} • ${all.filter(e=>!e.done).length} pendente${all.filter(e=>!e.done).length===1?'':'s'} • ${fmtMoney(all.filter(e=>e.type==='despesa').reduce((s,e)=>s+Number(e.value||0),0))} em despesas`;const list=$('calendarEventsList');list.innerHTML='';$('calendarEmpty').classList.toggle('hidden',all.length>0);$('calendarEmpty').textContent='Nenhum lançamento neste mês.';all.forEach(e=>list.appendChild(card(createItemNode(e,'calendar'),e)))}
 if(originalRenderCalendar){renderCalendar=function(){if(mq.matches)return desktopRender();return originalRenderCalendar()}}
 window.addEventListener('load',()=>setTimeout(()=>{try{renderCalendar()}catch{}},600));mq.addEventListener?.('change',()=>setTimeout(()=>{try{renderCalendar()}catch{}},50));styles();setTimeout(()=>{try{if(mq.matches)renderCalendar()}catch{}},120);window.MeuControleDesktopCalendarV024={version:'0.24'};
})();
