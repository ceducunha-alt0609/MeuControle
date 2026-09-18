/* MeuControle — V1.20: reordenação manual da Agenda mobile por dia selecionado */
(()=>{
  if(window.__mcMobileAgendaReorderV120)return;window.__mcMobileAgendaReorderV120=true;
  const VERSION='1.20';
  const mobile=()=>matchMedia('(max-width:700px)').matches;
  let active=false,drag=null,observer=null,refreshQueued=false;

  function selectedDay(){
    try{return window.MeuControleMobileCalendarGridV110?.selected?.()||''}catch{return''}
  }
  function searchActive(){
    const q=document.getElementById('calendarSearch')?.value||'';
    return !!String(q).trim();
  }
  function list(){return document.getElementById('calendarEventsList')}
  function sortableCards(){
    const root=list();if(!root)return[];
    return [...root.querySelectorAll('.item[data-entry-id]')].filter(card=>!card.classList.contains('done')&&!card.hidden&&card.offsetParent!==null);
  }

  function installStyle(){
    if(document.getElementById('mcMobileAgendaReorderV120Style'))return;
    const st=document.createElement('style');st.id='mcMobileAgendaReorderV120Style';st.textContent=`
      .mc-agenda-reorder-bar-v120{display:none}
      @media(max-width:700px){
        .mc-agenda-reorder-bar-v120{margin:0 0 12px;display:none;align-items:center;justify-content:space-between;gap:10px;padding:9px 10px;border:1px solid #dbe4df;border-radius:12px;background:#f7faf8}
        .mc-agenda-reorder-bar-v120.show{display:flex}
        .mc-agenda-reorder-copy-v120{min-width:0}.mc-agenda-reorder-copy-v120 strong{display:block;font-size:12px;color:#31453a}.mc-agenda-reorder-copy-v120 span{display:block;margin-top:2px;font-size:9.5px;line-height:1.35;color:#718078}
        .mc-agenda-reorder-btn-v120{flex:0 0 auto;min-height:36px!important;padding:7px 11px!important;border-radius:10px!important;font-size:11px!important}
        body.mc-agenda-reordering-v120 #calendarPage .calendar-events-scroll .item[data-entry-id]{padding-left:64px!important;cursor:default!important;user-select:none!important}
        .mc-agenda-drag-grip-v120{display:none}
        body.mc-agenda-reordering-v120 #calendarPage .mc-agenda-drag-grip-v120{display:grid;position:absolute;left:12px;top:50%;transform:translateY(-50%);width:36px;height:50px;place-items:center;border:0;border-radius:10px;background:#edf3f0;color:#53655b;font:900 21px/1 system-ui,sans-serif;letter-spacing:-5px;touch-action:none;cursor:grab;z-index:5;padding:0!important;box-shadow:none!important}
        body.mc-agenda-reordering-v120 #calendarPage .mc-agenda-drag-grip-v120:active{cursor:grabbing}
        body.mc-agenda-reordering-v120 #calendarPage .item.mc-agenda-dragging-v120{opacity:.58;transform:scale(.985);box-shadow:0 12px 28px rgba(0,0,0,.18)!important;z-index:6}
        body.mc-agenda-reordering-v120 #calendarPage .item.mc-agenda-drop-before-v120{box-shadow:inset 0 3px 0 var(--primary)!important}
        body.mc-agenda-reordering-v120 #calendarPage .item.mc-agenda-drop-after-v120{box-shadow:inset 0 -3px 0 var(--primary)!important}
        body.mc-dark .mc-agenda-reorder-bar-v120{background:#1b272e;border-color:#34434c}
        body.mc-dark .mc-agenda-reorder-copy-v120 strong{color:#eef4f7}
        body.mc-dark .mc-agenda-reorder-copy-v120 span{color:#aebbc3}
        body.mc-dark .mc-agenda-reorder-btn-v120{background:#1f5f93!important;color:#fff!important;border-color:#3f8fbd!important}
        body.mc-dark.mc-agenda-reordering-v120 #calendarPage .mc-agenda-drag-grip-v120{background:#26343c;color:#c7d5dc;border:1px solid #40515b}
      }
    `;document.head.appendChild(st);
  }

  function ensureBar(){
    const page=document.getElementById('calendarPage'),head=page?.querySelector('.calendar-events-head');
    if(!page||!head)return null;
    let bar=page.querySelector('.mc-agenda-reorder-bar-v120');
    if(bar)return bar;
    bar=document.createElement('div');bar.className='mc-agenda-reorder-bar-v120';
    bar.innerHTML='<div class="mc-agenda-reorder-copy-v120"><strong>Ordem do dia</strong><span>Organize os lançamentos deste dia do seu jeito.</span></div><button type="button" class="mc-agenda-reorder-btn-v120 secondary-action">Reordenar</button>';
    head.after(bar);
    bar.querySelector('button').onclick=()=>active?finish(true):start();
    return bar;
  }

  function clearDropMarks(){
    document.querySelectorAll('.mc-agenda-drop-before-v120,.mc-agenda-drop-after-v120').forEach(x=>x.classList.remove('mc-agenda-drop-before-v120','mc-agenda-drop-after-v120'));
  }

  function ensureGrips(){
    sortableCards().forEach(card=>{
      if(card.querySelector('.mc-agenda-drag-grip-v120'))return;
      const grip=document.createElement('button');grip.type='button';grip.className='mc-agenda-drag-grip-v120';grip.setAttribute('aria-label','Arrastar para reordenar');grip.textContent='⋮⋮';
      grip.addEventListener('pointerdown',e=>startDrag(e,card));
      card.appendChild(grip);
    });
  }

  function updateBar(){
    if(!mobile())return;
    const bar=ensureBar();if(!bar)return;
    const day=selectedDay(),cards=sortableCards(),can=!!day&&!searchActive()&&cards.length>1;
    bar.classList.toggle('show',can||active);
    const btn=bar.querySelector('.mc-agenda-reorder-btn-v120'),copy=bar.querySelector('.mc-agenda-reorder-copy-v120 span');
    if(active){
      btn.textContent='Concluir';
      copy.textContent='Arraste pela alça ⋮⋮ e solte na posição desejada.';
      ensureGrips();
    }else{
      btn.textContent='Reordenar';
      copy.textContent=searchActive()?'Limpe a pesquisa para reordenar.':'Organize os lançamentos deste dia do seu jeito.';
    }
  }

  function start(){
    if(!mobile()||!selectedDay()||searchActive()||sortableCards().length<2)return;
    active=true;document.body.classList.add('mc-agenda-reordering-v120');
    try{window.MeuControleMobileAgendaActionsV105?.close?.()}catch{}
    ensureGrips();updateBar();
  }

  function persist(){
    const ordered=sortableCards().map(card=>card.dataset.entryId).filter(Boolean);
    if(ordered.length<2)return;
    try{if(typeof createAutoBackup==='function')createAutoBackup('Antes de reordenar a Agenda')}catch{}
    try{
      ordered.forEach((id,i)=>{const e=entries.find(x=>x.id===id);if(e)e.manualOrder=(i+1)*10});
      if(typeof save==='function')save();
      window.dispatchEvent(new CustomEvent('meucontrole:agenda-order-changed',{detail:{date:selectedDay(),ids:ordered.slice()}}));
    }catch(err){console.warn('MeuControle: não foi possível salvar a ordem da Agenda.',err)}
  }

  function finish(saveOrder){
    if(!active)return;
    if(drag)endDrag(null,false);
    if(saveOrder)persist();
    active=false;document.body.classList.remove('mc-agenda-reordering-v120');
    clearDropMarks();updateBar();
  }

  function startDrag(e,card){
    if(!active||e.button>0)return;
    e.preventDefault();e.stopPropagation();
    clearDropMarks();
    drag={card,pointerId:e.pointerId};
    card.classList.add('mc-agenda-dragging-v120');
    try{e.currentTarget.setPointerCapture(e.pointerId)}catch{}
    window.addEventListener('pointermove',moveDrag,{passive:false});
    window.addEventListener('pointerup',endDrag,{once:true});
    window.addEventListener('pointercancel',cancelDrag,{once:true});
  }

  function moveDrag(e){
    if(!drag)return;
    e.preventDefault();
    const el=document.elementFromPoint(e.clientX,e.clientY),target=el?.closest?.('#calendarEventsList .item[data-entry-id]');
    clearDropMarks();
    if(!target||target===drag.card||target.classList.contains('done'))return;
    const rect=target.getBoundingClientRect(),before=e.clientY<rect.top+rect.height/2;
    target.classList.add(before?'mc-agenda-drop-before-v120':'mc-agenda-drop-after-v120');
    const parent=target.parentNode;if(!parent)return;
    if(before)parent.insertBefore(drag.card,target);else parent.insertBefore(drag.card,target.nextSibling);
  }

  function cleanupDrag(){
    if(!drag)return;
    drag.card.classList.remove('mc-agenda-dragging-v120');drag=null;clearDropMarks();
    window.removeEventListener('pointermove',moveDrag);
  }
  function endDrag(e,commit=true){if(!drag)return;cleanupDrag();if(commit)persist()}
  function cancelDrag(){cleanupDrag()}

  function queueRefresh(){
    if(refreshQueued)return;refreshQueued=true;
    requestAnimationFrame(()=>{refreshQueued=false;if(active)ensureGrips();updateBar()});
  }

  function boot(){
    installStyle();ensureBar();updateBar();
    const root=list();
    if(root&&!observer){observer=new MutationObserver(queueRefresh);observer.observe(root,{childList:true,subtree:true})}
    root?.addEventListener('click',e=>{if(active&&e.target.closest('.item[data-entry-id]')){e.preventDefault();e.stopImmediatePropagation()}},true);
    document.getElementById('calendarSearch')?.addEventListener('input',()=>{if(active)finish(false);queueRefresh()});
    document.querySelectorAll('.nav-btn[data-page="calendar"]').forEach(b=>b.addEventListener('click',queueRefresh));
    window.addEventListener('meucontrole:user-workspace-imported',()=>{if(active)finish(false);queueRefresh()});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('resize',()=>{if(!mobile()&&active)finish(false);else queueRefresh()});
  window.MeuControleMobileAgendaReorderV120={version:VERSION,refresh:queueRefresh,active:()=>active,finish:()=>finish(true)};
})();