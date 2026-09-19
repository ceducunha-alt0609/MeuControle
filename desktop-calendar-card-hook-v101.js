/* Meu Controle — V1.01: hook central dos cards de calendário desktop */
(()=>{
  if(window.__mcDesktopCalendarCardHookV101)return;
  window.__mcDesktopCalendarCardHookV101=true;

  function installStyle(){
    if(document.getElementById('mcDesktopCalendarCardHookV101Style'))return;
    const st=document.createElement('style');
    st.id='mcDesktopCalendarCardHookV101Style';
    st.textContent=`
      @media(min-width:701px){
        #calendarPage #calendarEventsList .item{
          min-height:72px!important;
          height:72px!important;
          max-height:72px!important;
          overflow:hidden!important;
        }
        #calendarPage #calendarEventsList .mc-cal-meta-row-v101{
          display:flex!important;
          align-items:center!important;
          justify-content:space-between!important;
          gap:10px!important;
          min-width:0!important;
          margin-top:4px!important;
        }
        #calendarPage #calendarEventsList .mc-cal-meta-row-v101 .meta{
          flex:1 1 auto!important;
          min-width:0!important;
          margin:0!important;
          padding:0!important;
          white-space:nowrap!important;
          overflow:hidden!important;
          text-overflow:ellipsis!important;
          font-size:12px!important;
          line-height:1.2!important;
        }
        #calendarPage #calendarEventsList .mc-cal-value-v101{
          flex:0 0 auto!important;
          margin:0!important;
          padding:0!important;
          color:#d33!important;
          font-size:12px!important;
          line-height:1.2!important;
          font-weight:900!important;
          white-space:nowrap!important;
          text-align:right!important;
        }
        #calendarPage #calendarEventsList .item-side{
          display:none!important;
        }
        #calendarPage #calendarEventsList .item.calendar-card-open-v024{
          height:auto!important;
          max-height:none!important;
          overflow:visible!important;
        }
        #calendarPage #calendarEventsList .item.calendar-card-open-v024 .item-side{
          display:block!important;
          grid-column:2!important;
        }
      }
    `;
    document.head.appendChild(st);
  }

  function normalize(node){
    const item=node?.nodeType===1?node:node?.querySelector?.('.item');
    if(!item||item.dataset.mcCalHookV101==='1')return node;
    const main=item.querySelector('.item-main');
    const meta=main?.querySelector('.meta');
    const amount=item.querySelector('.item-side .amount');
    if(!main||!meta||!amount)return node;

    const row=document.createElement('div');
    row.className='mc-cal-meta-row-v101';
    meta.parentNode.insertBefore(row,meta);
    row.appendChild(meta);

    const value=document.createElement('strong');
    value.className='mc-cal-value-v101';
    value.textContent=amount.textContent||'';
    row.appendChild(value);

    amount.textContent='';
    item.dataset.mcCalHookV101='1';
    return node;
  }

  function hook(){
    installStyle();
    if(typeof window.createItemNode!=='function')return false;
    if(window.createItemNode.__mcCalendarHookV101)return true;
    const original=window.createItemNode;
    const wrapped=function(e,context='list'){
      const node=original.apply(this,arguments);
      if(context==='calendar'&&matchMedia('(min-width:701px)').matches)return normalize(node);
      return node;
    };
    wrapped.__mcCalendarHookV101=true;
    wrapped.__mcOriginal=original;
    window.createItemNode=wrapped;
    return true;
  }

  function boot(){
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(hook()||tries>40)clearInterval(timer);
    },100);
    hook();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();

  window.MeuControleDesktopCalendarCardHookV101={version:'1.01',refresh:hook};
})();