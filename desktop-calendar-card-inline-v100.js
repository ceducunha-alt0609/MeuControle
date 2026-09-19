/* Meu Controle — V1.00: alinha valor à data/hora nos cards do calendário desktop */
(()=>{
  if(window.__mcDesktopCalendarCardInlineV100)return;
  window.__mcDesktopCalendarCardInlineV100=true;
  const mq=matchMedia('(min-width:701px)');
  let observer=null,queued=false;

  function installStyle(){
    if(document.getElementById('mcDesktopCalendarCardInlineV100Style'))return;
    const st=document.createElement('style');
    st.id='mcDesktopCalendarCardInlineV100Style';
    st.textContent=`
      @media(min-width:701px){
        #calendarPage #calendarEventsList .item{min-height:72px!important}
        #calendarPage #calendarEventsList .mc-cal-inline-meta-v100{
          display:flex!important;
          align-items:center!important;
          justify-content:space-between!important;
          gap:12px!important;
          min-width:0!important;
          margin-top:3px!important;
        }
        #calendarPage #calendarEventsList .mc-cal-inline-meta-v100 .meta{
          flex:1 1 auto!important;
          min-width:0!important;
          margin:0!important;
          padding:0!important;
          white-space:nowrap!important;
          overflow:hidden!important;
          text-overflow:ellipsis!important;
          font-size:12px!important;
          line-height:1.25!important;
        }
        #calendarPage #calendarEventsList .mc-cal-inline-meta-v100 .amount{
          flex:0 0 auto!important;
          margin:0!important;
          padding:0!important;
          font-size:12px!important;
          line-height:1.25!important;
          font-weight:900!important;
          white-space:nowrap!important;
          text-align:right!important;
        }
        #calendarPage #calendarEventsList .item-side{
          position:static!important;
          display:block!important;
          grid-column:2!important;
          margin:0!important;
          padding:0!important;
          text-align:left!important;
        }
        #calendarPage #calendarEventsList .item-side>.amount{display:none!important}
        #calendarPage #calendarEventsList .item-actions{display:none!important}
        #calendarPage #calendarEventsList .item.calendar-card-open-v024 .item-actions{display:flex!important;margin-top:8px!important}
      }
    `;
    document.head.appendChild(st);
  }

  function normalizeCard(card){
    if(!card||card.dataset.mcInlineV100==='1')return;
    const main=card.querySelector('.item-main');
    const meta=main?.querySelector('.meta');
    const side=card.querySelector('.item-side');
    const amount=side?.querySelector('.amount');
    if(!main||!meta||!side||!amount)return;

    let row=main.querySelector('.mc-cal-inline-meta-v100');
    if(!row){
      row=document.createElement('div');
      row.className='mc-cal-inline-meta-v100';
      meta.parentNode.insertBefore(row,meta);
      row.appendChild(meta);
    }
    const clone=document.createElement('strong');
    clone.className='amount mc-cal-inline-amount-v100';
    clone.textContent=amount.textContent||'';
    row.appendChild(clone);
    card.dataset.mcInlineV100='1';
  }

  function refresh(){
    if(!mq.matches)return;
    installStyle();
    document.querySelectorAll('#calendarPage #calendarEventsList .item').forEach(normalizeCard);
  }

  function queue(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;refresh()});
  }

  function boot(){
    installStyle();
    refresh();
    const list=document.getElementById('calendarEventsList');
    if(list&&!observer){
      observer=new MutationObserver(queue);
      observer.observe(list,{childList:true,subtree:true,characterData:true});
    }
    document.querySelectorAll('.nav-btn[data-page="calendar"]').forEach(b=>b.addEventListener('click',()=>setTimeout(refresh,0)));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  mq.addEventListener?.('change',refresh);
  window.MeuControleDesktopCalendarCardInlineV100={version:'1.00',refresh};
})();