/* Meu Controle — V1.10: calendário mensal visual no mobile + clique por dia */
(function(){
  if(window.__meuControleMobileCalendarGridV109Loaded)return;
  window.__meuControleMobileCalendarGridV109Loaded=true;

  const VERSION='1.10';
  const mq=matchMedia('(max-width:700px)');
  const originalRenderCalendar=typeof renderCalendar==='function'?renderCalendar:null;
  const week=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  let selectedDate='';

  function installStyles(){
    if(document.getElementById('mobileCalendarGridV109Style'))return;
    const s=document.createElement('style');
    s.id='mobileCalendarGridV109Style';
    s.textContent=`
      .mobile-calendar-grid-v109{display:none}
      @media(max-width:700px){
        #calendarPage .mobile-calendar-grid-v109{
          display:block;
          margin:-2px 0 14px;
          border:1px solid #dbe4df;
          border-radius:15px;
          overflow:hidden;
          background:#fff;
          box-shadow:0 5px 16px rgba(0,0,0,.035);
        }
        #calendarPage .mobile-calendar-week-v109,
        #calendarPage .mobile-calendar-days-v109{
          display:grid;
          grid-template-columns:repeat(7,minmax(0,1fr));
        }
        #calendarPage .mobile-calendar-week-v109{
          background:#f7faf8;
          border-bottom:1px solid #e5ebe8;
        }
        #calendarPage .mobile-calendar-week-v109 span{
          min-height:31px;
          display:grid;
          place-items:center;
          font-size:11px;
          font-weight:800;
          color:#627168;
        }
        #calendarPage .mobile-calendar-day-v109{
          position:relative;
          min-height:47px;
          border:0;
          border-right:1px solid #edf1ef;
          border-bottom:1px solid #edf1ef;
          background:#fff;
          color:#30433a;
          padding:6px 2px 4px;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:flex-start;
          gap:5px;
          font-family:inherit;
          font-size:13px;
          font-weight:700;
          box-shadow:none!important;
          border-radius:0!important;
          transform:none!important;
        }
        #calendarPage button.mobile-calendar-day-v109{cursor:pointer}
        #calendarPage .mobile-calendar-day-v109:nth-child(7n){border-right:0}
        #calendarPage .mobile-calendar-day-v109.empty{background:#fbfcfb;color:transparent}
        #calendarPage .mobile-calendar-day-v109.selected:not(.today){
          background:var(--primary-soft)!important;
          color:var(--primary)!important;
          box-shadow:inset 0 0 0 2px rgba(var(--primary-rgb),.38)!important;
        }
        #calendarPage .mobile-calendar-day-v109.today{
          margin:3px;
          min-height:41px;
          padding-top:4px;
          border:0!important;
          border-radius:9px!important;
          background:var(--primary)!important;
          color:#fff!important;
          box-shadow:0 5px 12px rgba(22,79,120,.22)!important;
        }
        #calendarPage .mobile-calendar-day-v109.today.selected{
          box-shadow:0 0 0 3px rgba(var(--primary-rgb),.18),0 5px 12px rgba(22,79,120,.22)!important;
        }
        #calendarPage .mc-day-dots-v109{height:7px;display:flex;align-items:center;justify-content:center;gap:3px}
        #calendarPage .mc-day-dot-v109{width:6px;height:6px;border-radius:50%;display:block}
        #calendarPage .mc-day-dot-v109.late{background:#b53d3d}
        #calendarPage .mc-day-dot-v109.pending{background:#d27a00}
        #calendarPage .mc-day-dot-v109.done{background:#9aa8a1}
        #calendarPage .mobile-calendar-day-v109.today .mc-day-dot-v109{box-shadow:0 0 0 1px rgba(255,255,255,.45)}

        #calendarPage .calendar-events-scroll .item{
          grid-template-columns:22px minmax(0,1fr)!important;
        }
        #calendarPage .calendar-events-scroll .item .status-dot{
          visibility:visible!important;
          width:18px!important;
          height:18px!important;
          margin-top:2px!important;
          border:1.5px solid #6d8177!important;
          border-radius:4px!important;
          background:#fff!important;
          position:relative!important;
          animation:none!important;
          box-shadow:none!important;
        }
        #calendarPage .calendar-events-scroll .item.done .status-dot{
          border-color:var(--primary)!important;
          background:var(--primary)!important;
          opacity:.68;
        }
        #calendarPage .calendar-events-scroll .item.done .status-dot::after{
          content:'✓';
          position:absolute;
          inset:0;
          display:grid;
          place-items:center;
          color:#fff;
          font:800 12px/1 system-ui,sans-serif;
        }
        #calendarPage .calendar-events-scroll .item.done .item-main,
        #calendarPage .calendar-events-scroll .item.done .amount{
          text-decoration:line-through!important;
          text-decoration-thickness:1.2px!important;
          text-decoration-color:rgba(70,84,76,.48)!important;
        }
      }
    `;
    document.head.appendChild(s);
  }

  function dayStatus(items,dateISO){
    const pending=items.filter(e=>!e.done);
    const done=items.some(e=>e.done);
    const late=pending.some(()=>typeof daysFromToday==='function'&&daysFromToday(dateISO)<0);
    return{late,pending:pending.length>0,done};
  }

  function monthPrefix(){return `${calendarYear}-${String(calendarMonth+1).padStart(2,'0')}-`}

  function renderSelectedDay(){
    if(!mq.matches||!selectedDate)return;
    const all=typeof calendarEntries==='function'?calendarEntries().slice():[];
    const q=String(typeof calendarQuery!=='undefined'?calendarQuery:'').trim().toLowerCase();
    const items=all.filter(e=>e.date===selectedDate).sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||''))).filter(e=>!q||typeof searchableText!=='function'||searchableText(e).includes(q));
    const raw=all.filter(e=>e.date===selectedDate);
    const list=document.getElementById('calendarEventsList');
    const empty=document.getElementById('calendarEmpty');
    const title=document.getElementById('calendarMonthTitle');
    const summary=document.getElementById('calendarMonthSummary');
    if(!list||!empty||!title||!summary)return;

    const d=typeof dateOnly==='function'?dateOnly(selectedDate):new Date(`${selectedDate}T12:00:00`);
    title.textContent=d.toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'}).replace(/^./,c=>c.toUpperCase());
    summary.textContent=`${raw.length} lançamento${raw.length===1?'':'s'} • ${raw.filter(e=>!e.done).length} pendente${raw.filter(e=>!e.done).length===1?'':'s'}`;
    list.innerHTML='';
    empty.classList.toggle('hidden',items.length>0);
    empty.textContent=q?'Nenhum lançamento encontrado neste dia.':'Nenhum lançamento neste dia.';
    items.forEach(e=>list.appendChild(createItemNode(e,'calendar')));
  }

  function buildGrid(){
    if(!mq.matches)return;
    const page=document.getElementById('calendarPage');
    const eventsPanel=page?.querySelector('.calendar-events-panel');
    if(!page||!eventsPanel)return;

    if(selectedDate&&!selectedDate.startsWith(monthPrefix()))selectedDate='';

    let grid=document.getElementById('mobileCalendarGridV109');
    if(!grid){
      grid=document.createElement('section');
      grid.id='mobileCalendarGridV109';
      grid.className='mobile-calendar-grid-v109';
      grid.setAttribute('aria-label','Calendário do mês');
      eventsPanel.before(grid);
    }

    const all=typeof calendarEntries==='function'?calendarEntries():[];
    const byDay=new Map();
    all.forEach(e=>{
      const d=Number(e.date.slice(8,10));
      if(!byDay.has(d))byDay.set(d,[]);
      byDay.get(d).push(e);
    });

    const first=new Date(calendarYear,calendarMonth,1).getDay();
    const count=new Date(calendarYear,calendarMonth+1,0).getDate();
    const todayISO=typeof localDateISO==='function'?localDateISO():'';
    let cells='';
    for(let i=0;i<first;i++)cells+='<span class="mobile-calendar-day-v109 empty" aria-hidden="true"></span>';
    for(let day=1;day<=count;day++){
      const iso=`${calendarYear}-${String(calendarMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const items=byDay.get(day)||[];
      const st=dayStatus(items,iso);
      const dots=[st.late?'<i class="mc-day-dot-v109 late"></i>':'',st.pending&&!st.late?'<i class="mc-day-dot-v109 pending"></i>':'',st.done?'<i class="mc-day-dot-v109 done"></i>':''].join('');
      const label=items.length?`${day}, ${items.length} lançamento${items.length===1?'':'s'}`:`${day}, nenhum lançamento`;
      const cls=`mobile-calendar-day-v109${iso===todayISO?' today':''}${iso===selectedDate?' selected':''}`;
      cells+=`<button type="button" class="${cls}" data-date="${iso}" aria-label="${label}" aria-pressed="${iso===selectedDate?'true':'false'}"><b>${day}</b><span class="mc-day-dots-v109">${dots}</span></button>`;
    }
    grid.innerHTML=`<div class="mobile-calendar-week-v109">${week.map(x=>`<span>${x}</span>`).join('')}</div><div class="mobile-calendar-days-v109">${cells}</div>`;
    grid.querySelectorAll('button[data-date]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const iso=btn.dataset.date||'';
        if(selectedDate===iso){
          selectedDate='';
          if(typeof renderCalendar==='function')renderCalendar();
          return;
        }
        selectedDate=iso;
        buildGrid();
        renderSelectedDay();
        document.querySelector('#calendarPage .calendar-events-panel')?.scrollIntoView({behavior:'smooth',block:'start'});
      });
    });
  }

  function sync(){
    if(!mq.matches)return;
    installStyles();
    buildGrid();
    if(selectedDate)renderSelectedDay();
  }

  if(originalRenderCalendar){
    renderCalendar=function(){
      const result=originalRenderCalendar();
      if(mq.matches)requestAnimationFrame(sync);
      return result;
    };
  }

  installStyles();
  window.addEventListener('load',()=>setTimeout(sync,650));
  document.querySelectorAll('.nav-btn[data-page="calendar"]').forEach(b=>b.addEventListener('click',()=>setTimeout(sync,80)));
  mq.addEventListener?.('change',()=>setTimeout(sync,50));
  setTimeout(sync,180);
  window.MeuControleMobileCalendarGridV109={version:VERSION,refresh:sync};
})();