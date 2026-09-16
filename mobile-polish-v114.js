/* MeuControle — V1.20: valor lateral + painel arrastável + voltar nativo Android em Pesquisa e subtelas de Lançamentos */
(()=>{
  if(window.__mcMobilePolishV114)return;window.__mcMobilePolishV114=true;
  const mobile=()=>matchMedia('(max-width:700px)').matches;
  let drag=null;

  function installStyle(){
    if(document.getElementById('mcMobilePolishV114Style'))return;
    const st=document.createElement('style');st.id='mcMobilePolishV114Style';st.textContent=`
      @media(max-width:700px){
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102,#calendarPage .calendar-events-scroll .item.mc-agenda-compact-v105{position:relative!important;display:block!important;box-sizing:border-box!important;height:82px!important;min-height:82px!important;max-height:82px!important;padding:12px 13px!important;overflow:hidden!important}
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .item-main,#calendarPage .calendar-events-scroll .item.mc-agenda-compact-v105 .item-main{width:100%!important;min-width:0!important}
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .item-title-row,#calendarPage .calendar-events-scroll .item.mc-agenda-compact-v105 .item-title-row{display:flex!important;grid-template-columns:none!important;align-items:center!important;justify-content:flex-start!important;gap:7px!important;width:100%!important;min-width:0!important;padding-right:122px!important;box-sizing:border-box!important;text-align:left!important}
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .item-title,#calendarPage .calendar-events-scroll .item.mc-agenda-compact-v105 .item-title{margin:0!important;font-size:16px!important;line-height:1.2!important;text-align:left!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .meta,#calendarPage .calendar-events-scroll .item.mc-agenda-compact-v105 .meta{margin-top:6px!important;font-size:11.5px!important;line-height:1.35!important;text-align:left!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .mc-card-value-v113,#calendarPage .calendar-events-scroll .item.mc-agenda-compact-v105 .mc-card-value-v113{position:absolute!important;right:13px!important;top:12px!important;height:44px!important;z-index:2!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;margin:0!important;max-width:118px!important;font-size:18px!important;line-height:1.1!important;font-weight:800!important;white-space:nowrap!important;text-align:right!important}
        #calendarPage .calendar-events-scroll .item.mc-agenda-compact-v105 .status-dot{display:none!important;visibility:hidden!important}
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .item-side,#calendarPage .calendar-events-scroll .item.mc-agenda-compact-v105 .item-side{display:none!important}
        .mc-card-actions-backdrop-v102{display:block!important;padding:12px!important;overflow:hidden!important;touch-action:none!important}.mc-card-actions-backdrop-v102[hidden]{display:none!important}.mc-card-actions-sheet-v102{position:absolute!important;left:12px!important;right:12px!important;bottom:12px!important;width:auto!important;padding:9px 17px 17px!important;will-change:transform}.mc-card-drag-handle-v114{height:20px;margin:-2px 0 5px;display:flex;align-items:center;justify-content:center;cursor:grab;touch-action:none}.mc-card-drag-handle-v114::before{content:"";width:46px;height:5px;border-radius:999px;background:#c8d2cc}.mc-card-actions-sheet-v102.mc-dragging-v114 .mc-card-drag-handle-v114{cursor:grabbing}
      }
    `;document.head.appendChild(st);
  }

  function reset(sheet){if(!sheet)return;sheet.style.transform='';sheet.dataset.dragY='0';sheet.classList.remove('mc-dragging-v114');drag=null}
  function bind(){
    if(!mobile())return;
    const bd=document.querySelector('.mc-card-actions-backdrop-v102'),sheet=bd?.querySelector('.mc-card-actions-sheet-v102');if(!bd||!sheet)return;
    let handle=sheet.querySelector('.mc-card-drag-handle-v114');
    if(!handle){handle=document.createElement('div');handle.className='mc-card-drag-handle-v114';handle.setAttribute('aria-label','Arraste para mover o painel');sheet.prepend(handle)}
    if(handle.__mcDragBound)return;handle.__mcDragBound=true;
    const start=e=>{const p=e.touches?.[0]||e;drag={startY:p.clientY,baseY:Number(sheet.dataset.dragY||0)};sheet.classList.add('mc-dragging-v114');if(e.pointerId!=null)try{handle.setPointerCapture(e.pointerId)}catch{}e.preventDefault()};
    const move=e=>{if(!drag)return;const p=e.touches?.[0]||e,dy=p.clientY-drag.startY,rect=sheet.getBoundingClientRect(),current=Number(sheet.dataset.dragY||0),baseTop=rect.top-current,baseBottom=rect.bottom-current,minY=12-baseTop,maxY=innerHeight-12-baseBottom,y=Math.max(minY,Math.min(maxY,drag.baseY+dy));sheet.style.transform=`translateY(${y}px)`;sheet.dataset.dragY=String(y);e.preventDefault()};
    const end=e=>{if(!drag)return;drag=null;sheet.classList.remove('mc-dragging-v114');if(e?.pointerId!=null)try{handle.releasePointerCapture(e.pointerId)}catch{}};
    if(window.PointerEvent){handle.addEventListener('pointerdown',start);handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end)}else{handle.addEventListener('touchstart',start,{passive:false});window.addEventListener('touchmove',move,{passive:false});window.addEventListener('touchend',end,{passive:true})}
    const obs=new MutationObserver(()=>{if(!bd.hidden&&bd.dataset.mcWasHidden==='1')reset(sheet);bd.dataset.mcWasHidden=bd.hidden?'1':'0'});obs.observe(bd,{attributes:true,attributeFilter:['hidden']});bd.dataset.mcWasHidden=bd.hidden?'1':'0';
  }

  function bindSearchNativeBack(){
    if(!mobile()||window.__mcSearchNativeBackV118)return;window.__mcSearchNativeBackV118=true;
    const overlay=document.querySelector('.mc-search-results'),back=overlay?.querySelector('.mc-search-back');if(!overlay||!back)return;
    let armed=false,closingFromHistory=false;
    const arm=()=>{if(overlay.hidden||armed)return;history.pushState({...history.state,mcSearchOverlay:true},'',location.href);armed=true};
    const obs=new MutationObserver(()=>{if(!overlay.hidden)arm();else if(!closingFromHistory)armed=false});obs.observe(overlay,{attributes:true,attributeFilter:['hidden']});
    back.addEventListener('click',e=>{if(!armed||closingFromHistory)return;e.preventDefault();e.stopImmediatePropagation();history.back()},{capture:true});
    window.addEventListener('popstate',()=>{if(!armed||overlay.hidden)return;armed=false;closingFromHistory=true;try{back.onclick?.call(back,new MouseEvent('click'))}finally{closingFromHistory=false}});
    arm();
  }

  function bindLaunchModeNativeBack(mode,flag){
    if(!mobile()||window[flag])return;window[flag]=true;
    const page=document.getElementById('launchesPage');if(!page)return;
    const panel=mode==='form'?document.getElementById('formPanel'):page.querySelector('.list-panel');
    const back=panel?.querySelector('.mobile-launch-back');if(!panel||!back)return;
    let armed=false,closingFromHistory=false;
    const className=mode==='form'?'mobile-launch-form':'mobile-launch-list';
    const stateKey=mode==='form'?'mcLaunchForm':'mcLaunchList';
    const isOpen=()=>page.classList.contains(className)&&!page.classList.contains('hidden');
    const arm=()=>{if(!isOpen()||armed)return;history.pushState({...history.state,[stateKey]:true},'',location.href);armed=true};
    const obs=new MutationObserver(()=>{if(isOpen())arm();else if(!closingFromHistory)armed=false});obs.observe(page,{attributes:true,attributeFilter:['class']});
    back.addEventListener('click',e=>{if(!armed||closingFromHistory)return;e.preventDefault();e.stopImmediatePropagation();history.back()},{capture:true});
    window.addEventListener('popstate',()=>{if(!armed||!isOpen())return;armed=false;closingFromHistory=true;try{back.onclick?.call(back,new MouseEvent('click'))}finally{closingFromHistory=false}});
    arm();
  }

  function bindLaunchFormNativeBack(){bindLaunchModeNativeBack('form','__mcLaunchFormNativeBackV119')}
  function bindLaunchListNativeBack(){bindLaunchModeNativeBack('list','__mcLaunchListNativeBackV120')}

  function boot(){installStyle();bind();bindSearchNativeBack();bindLaunchFormNativeBack();bindLaunchListNativeBack();setTimeout(()=>{bind();bindSearchNativeBack();bindLaunchFormNativeBack();bindLaunchListNativeBack()},250)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,100),{once:true});else setTimeout(boot,100);
  window.addEventListener('load',()=>setTimeout(boot,500));
  window.MeuControleMobilePolishV114={version:'1.20',refresh:boot};
})();