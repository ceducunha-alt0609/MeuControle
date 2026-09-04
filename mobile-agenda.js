/* MeuControle — Agenda mobile */
(function(){
  const mq=window.matchMedia('(max-width:700px)');
  const page=document.getElementById('calendarPage');
  const shell=page?.querySelector('.calendar-shell');
  const months=document.getElementById('calendarMonths');
  const eventsPanel=page?.querySelector('.calendar-events-panel');
  const title=document.getElementById('calendarMonthTitle');
  const summary=document.getElementById('calendarMonthSummary');
  if(!page||!shell||!months||!eventsPanel||!title)return;

  const style=document.createElement('style');
  style.textContent=`
    .mobile-agenda-head,.mobile-month-wheel{display:none}
    @media(max-width:700px){
      #calendarPage .calendar-shell{padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important}
      #calendarPage .calendar-head{display:none!important}
      #calendarPage .calendar-layout{display:block!important}
      #calendarPage .calendar-months{display:none!important}
      #calendarPage .calendar-events-panel{padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important;min-height:0!important}
      #calendarPage .calendar-events-head{display:block!important;margin:0!important}
      #calendarPage .calendar-events-head>div:first-child{display:none!important}
      #calendarPage .calendar-search{width:100%!important;margin:0 0 12px!important}
      #calendarPage .calendar-events-scroll{height:auto!important;max-height:none!important;overflow:visible!important;padding:0!important}
      #calendarPage .mobile-agenda-head{display:block!important;text-align:center;margin:0 0 10px}
      #calendarPage .mobile-agenda-head h2{margin:0;font-size:27px;line-height:1.15;text-transform:none}
      #calendarPage .mobile-agenda-current{margin:8px 0 0;font-size:18px;font-weight:800;color:#24352c}
      #calendarPage .mobile-month-wheel{display:grid!important;grid-template-columns:.58fr 1.84fr .58fr;align-items:center;width:100%;height:64px;margin:0 0 14px;overflow:hidden;border:1px solid #dbe4df;border-radius:15px;background:#fff;box-shadow:0 5px 16px rgba(0,0,0,.04);touch-action:pan-y;user-select:none}
      #calendarPage .mobile-month-slot{height:100%;border:0;background:transparent;color:#829087;font-size:14px;font-weight:700;overflow:hidden;white-space:nowrap;padding:0;transition:transform .16s ease,box-shadow .16s ease,background .16s ease}
      #calendarPage .mobile-month-slot.prev{text-align:right;transform:translateX(-38%)}
      #calendarPage .mobile-month-slot.next{text-align:left;transform:translateX(38%)}
      #calendarPage .mobile-month-slot.current{position:relative;z-index:2;height:58px;align-self:center;color:var(--primary);font-size:18px;background:var(--primary-soft);border:1px solid #d4e2eb;border-radius:13px;box-shadow:0 7px 17px rgba(16,60,92,.16);transform:scale(1.035)}
      #calendarPage .mobile-month-slot.current:active{transform:scale(1.015)}
      #calendarPage .mobile-month-slot.current::after{content:"";position:absolute;left:34%;right:34%;bottom:7px;height:3px;border-radius:3px;background:var(--primary)}
      #calendarPage .calendar-events-scroll .item{margin-bottom:12px}
      #calendarPage .item .status-dot{visibility:hidden!important}
      #calendarPage .item.today .status-dot,#calendarPage .item.late .status-dot{visibility:visible!important;animation:mobileAgendaPulse 1.7s ease-in-out infinite!important}
      #calendarPage .item.today .status-dot{background:#d27a00!important}
      #calendarPage .item.late .status-dot{background:#b53d3d!important}
      #calendarPage .item.done .status-dot{visibility:hidden!important;animation:none!important}
    }
    @keyframes mobileAgendaPulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(210,122,0,.38)}50%{transform:scale(1.12);box-shadow:0 0 0 6px transparent}}
    @media(max-width:700px) and (prefers-reduced-motion:reduce){#calendarPage .item.today .status-dot,#calendarPage .item.late .status-dot{animation:none!important}}
  `;
  document.head.appendChild(style);

  const head=document.createElement('div');
  head.className='mobile-agenda-head';
  head.innerHTML='<h2>Agenda</h2><div class="mobile-agenda-current"></div>';
  shell.insertBefore(head,shell.firstChild);

  const wheel=document.createElement('div');
  wheel.className='mobile-month-wheel';
  wheel.innerHTML='<button type="button" class="mobile-month-slot prev" aria-label="Mês anterior"></button><button type="button" class="mobile-month-slot current" aria-label="Mês atual selecionado"></button><button type="button" class="mobile-month-slot next" aria-label="Próximo mês"></button>';
  head.after(wheel);

  const prev=wheel.querySelector('.prev'),current=wheel.querySelector('.current'),next=wheel.querySelector('.next'),currentLabel=head.querySelector('.mobile-agenda-current');
  const monthIndex=name=>['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'].indexOf(name);
  const monthName=i=>['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'][i];

  function selected(){
    const text=title.textContent.trim();
    const match=text.match(/^(.+)\s+(\d{4})$/);
    if(!match)return{month:new Date().getMonth(),year:new Date().getFullYear()};
    const m=monthIndex(match[1]);return{month:m<0?new Date().getMonth():m,year:Number(match[2])};
  }
  function adjacent(month,year,delta){const d=new Date(year,month+delta,1);return{month:d.getMonth(),year:d.getFullYear()}}
  function sync(){
    if(!mq.matches)return;
    const s=selected(),p=adjacent(s.month,s.year,-1),n=adjacent(s.month,s.year,1);
    currentLabel.textContent=`${monthName(s.month)} ${s.year}`;
    current.textContent=monthName(s.month);
    prev.textContent=monthName(p.month);
    next.textContent=monthName(n.month);
    if(summary)summary.style.display='none';
  }
  function clickMonth(targetMonth,targetYear){
    if(targetYear!==selected().year){
      const yearBtn=targetYear<selected().year?document.getElementById('calendarPrevYear'):document.getElementById('calendarNextYear');
      yearBtn?.click();
    }
    requestAnimationFrame(()=>{const btn=[...months.querySelectorAll('.calendar-month-btn')].find(b=>b.querySelector('span')?.textContent===monthName(targetMonth));btn?.click();requestAnimationFrame(sync)});
  }
  function move(delta){const s=selected(),t=adjacent(s.month,s.year,delta);clickMonth(t.month,t.year)}
  prev.onclick=()=>move(-1);next.onclick=()=>move(1);current.onclick=()=>{};

  let startX=null;
  wheel.addEventListener('touchstart',e=>{startX=e.touches[0].clientX},{passive:true});
  wheel.addEventListener('touchend',e=>{if(startX===null)return;const dx=e.changedTouches[0].clientX-startX;startX=null;if(Math.abs(dx)<38)return;move(dx<0?1:-1)},{passive:true});

  new MutationObserver(sync).observe(title,{childList:true,subtree:true,characterData:true});
  document.querySelectorAll('.nav-btn[data-page="calendar"]').forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(sync)));
  mq.addEventListener?.('change',sync);
  sync();
})();
