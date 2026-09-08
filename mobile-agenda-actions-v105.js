/* MeuControle — V1.06: cards compactos + painel de ações arrastável na Agenda mobile */
(()=>{
  if(window.__mcMobileAgendaActionsV105)return;window.__mcMobileAgendaActionsV105=true;
  const mobile=()=>matchMedia('(max-width:700px)').matches;
  let activeCard=null,observer=null,drag=null;

  function installStyle(){
    if(document.getElementById('mcMobileAgendaActionsV105Style'))return;
    const st=document.createElement('style');st.id='mcMobileAgendaActionsV105Style';st.textContent=`
      .mc-agenda-actions-backdrop-v105{display:none}
      @media(max-width:700px){
        #calendarPage .calendar-events-scroll .item.mc-agenda-compact-v105{position:relative!important;display:block!important;box-sizing:border-box!important;height:104px!important;min-height:104px!important;max-height:104px!important;margin-bottom:10px!important;padding:11px 13px 10px 58px!important;overflow:hidden!important;cursor:pointer}
        #calendarPage .item.mc-agenda-compact-v105 .item-main{min-width:0!important;width:100%!important}
        #calendarPage .item.mc-agenda-compact-v105 .item-title-row{display:grid!important;grid-template-columns:minmax(0,1fr) auto auto!important;gap:7px!important;align-items:center!important;min-width:0!important}
        #calendarPage .item.mc-agenda-compact-v105 .item-title{margin:0!important;min-width:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:17px!important;line-height:1.2!important}
        #calendarPage .item.mc-agenda-compact-v105 .badge{white-space:nowrap!important;align-self:center!important}
        #calendarPage .item.mc-agenda-compact-v105 .mc-agenda-inline-amount-v105{margin:0!important;padding-left:4px!important;white-space:nowrap!important;font-size:16px!important;line-height:1.15!important;color:var(--primary-dark)!important;text-align:right!important}
        #calendarPage .item.mc-agenda-compact-v105 .mc-agenda-inline-amount-v105:empty{display:none!important}
        #calendarPage .item.mc-agenda-compact-v105 .meta{margin-top:4px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:11.5px!important;line-height:1.3!important}
        #calendarPage .item.mc-agenda-compact-v105 .notes,#calendarPage .item.mc-agenda-compact-v105 .item-side,#calendarPage .item.mc-agenda-compact-v105 .item-actions{display:none!important}
        #calendarPage .item.mc-agenda-compact-v105 .status-dot{position:absolute!important;left:20px!important;top:25px!important;margin:0!important}
        .mc-agenda-actions-backdrop-v105{position:fixed;inset:0;z-index:3500;background:rgba(17,31,24,.38);display:block;padding:12px;overflow:hidden;touch-action:none}
        .mc-agenda-actions-backdrop-v105[hidden]{display:none!important}
        .mc-agenda-actions-sheet-v105{position:absolute;left:12px;right:12px;bottom:12px;width:auto;padding:9px 17px 17px;border-radius:20px 20px 15px 15px;background:#fff;box-shadow:0 -14px 42px rgba(0,0,0,.2);color:#2c3d34;will-change:transform}
        .mc-agenda-drag-handle-v106{height:20px;margin:-2px 0 5px;display:flex;align-items:center;justify-content:center;cursor:grab;touch-action:none}
        .mc-agenda-drag-handle-v106::before{content:"";width:46px;height:5px;border-radius:999px;background:#c8d2cc}
        .mc-agenda-actions-sheet-v105.mc-dragging-v106 .mc-agenda-drag-handle-v106{cursor:grabbing}
        .mc-agenda-actions-head-v105{display:flex;align-items:flex-start;gap:10px;margin-bottom:14px}
        .mc-agenda-actions-copy-v105{min-width:0;flex:1}.mc-agenda-actions-copy-v105 strong{display:block;font-size:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mc-agenda-actions-copy-v105 span{display:block;margin-top:4px;font-size:11px;color:#78847d;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .mc-agenda-actions-close-v105{width:38px;height:38px;min-height:38px!important;padding:0!important;border-radius:11px!important;background:#eef3f0!important;color:#526158!important;box-shadow:none!important}
        .mc-agenda-actions-grid-v105{display:grid;grid-template-columns:1fr 1fr;gap:9px}.mc-agenda-actions-grid-v105 button{min-height:46px!important;border-radius:12px!important;font-size:13px!important}
        .mc-agenda-action-delete-v105{background:#a53b3b!important;border-color:#a53b3b!important;color:#fff!important}
      }
    `;document.head.appendChild(st);
  }

  function resetPosition(){const sheet=document.querySelector('.mc-agenda-actions-sheet-v105');if(sheet){sheet.style.transform='';sheet.classList.remove('mc-dragging-v106');sheet.dataset.dragY='0'}drag=null}
  function closeSheet(){const bd=document.querySelector('.mc-agenda-actions-backdrop-v105');if(bd)bd.hidden=true;resetPosition();activeCard=null}
  function bindDrag(bd){
    const sheet=bd.querySelector('.mc-agenda-actions-sheet-v105'),handle=bd.querySelector('.mc-agenda-drag-handle-v106');if(!sheet||!handle||handle.__mcDragBound)return;handle.__mcDragBound=true;
    const start=e=>{if(!mobile())return;const p=e.touches?.[0]||e;drag={startY:p.clientY,baseY:Number(sheet.dataset.dragY||0),id:e.pointerId};sheet.classList.add('mc-dragging-v106');if(e.pointerId!=null)try{handle.setPointerCapture(e.pointerId)}catch{};e.preventDefault()};
    const move=e=>{if(!drag)return;const p=e.touches?.[0]||e,dy=p.clientY-drag.startY;const rect=sheet.getBoundingClientRect(),current=Number(sheet.dataset.dragY||0),baseTop=rect.top-current,baseBottom=rect.bottom-current;const minY=12-baseTop,maxY=innerHeight-12-baseBottom;const y=Math.max(minY,Math.min(maxY,drag.baseY+dy));sheet.style.transform=`translateY(${y}px)`;sheet.dataset.dragY=String(y);e.preventDefault()};
    const end=e=>{if(!drag)return;drag=null;sheet.classList.remove('mc-dragging-v106');if(e?.pointerId!=null)try{handle.releasePointerCapture(e.pointerId)}catch{}};
    if(window.PointerEvent){handle.addEventListener('pointerdown',start);handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end)}else{handle.addEventListener('touchstart',start,{passive:false});window.addEventListener('touchmove',move,{passive:false});window.addEventListener('touchend',end,{passive:true})}
  }
  function ensureSheet(){
    let bd=document.querySelector('.mc-agenda-actions-backdrop-v105');if(bd){bindDrag(bd);return bd}
    bd=document.createElement('div');bd.className='mc-agenda-actions-backdrop-v105';bd.hidden=true;
    bd.innerHTML='<section class="mc-agenda-actions-sheet-v105" role="dialog" aria-modal="true" aria-label="Ações do lançamento"><div class="mc-agenda-drag-handle-v106" aria-label="Arraste para mover o painel"></div><div class="mc-agenda-actions-head-v105"><div class="mc-agenda-actions-copy-v105"><strong></strong><span></span></div><button type="button" class="mc-agenda-actions-close-v105" aria-label="Fechar">×</button></div><div class="mc-agenda-actions-grid-v105"><button type="button" data-agenda-action="edit" class="secondary-action">Editar</button><button type="button" data-agenda-action="done">Concluir</button><button type="button" data-agenda-action="duplicate" class="secondary-action">Duplicar</button><button type="button" data-agenda-action="delete" class="mc-agenda-action-delete-v105">Excluir</button></div></section>';
    document.body.appendChild(bd);bd.querySelector('.mc-agenda-actions-close-v105').onclick=closeSheet;bd.addEventListener('click',e=>{if(e.target===bd)closeSheet()});bd.querySelectorAll('[data-agenda-action]').forEach(btn=>btn.onclick=()=>runAction(btn.dataset.agendaAction));bindDrag(bd);return bd;
  }
  function runAction(action){const card=activeCard;if(!card)return closeSheet();const map={edit:'.editBtn',done:'.doneBtn',duplicate:'.duplicateBtn',delete:'.deleteBtn'},target=card.querySelector(map[action]);closeSheet();setTimeout(()=>target?.click(),20)}
  function openSheet(card){if(!mobile()||!card)return;activeCard=card;const bd=ensureSheet();resetPosition();const title=card.querySelector('.item-title')?.textContent?.trim()||'Lançamento',meta=card.querySelector('.meta')?.textContent?.trim()||'';bd.querySelector('.mc-agenda-actions-copy-v105 strong').textContent=title;bd.querySelector('.mc-agenda-actions-copy-v105 span').textContent=meta;const done=card.querySelector('.doneBtn'),doneSheet=bd.querySelector('[data-agenda-action="done"]');if(doneSheet)doneSheet.textContent=done?.textContent?.trim()||'Concluir';const dup=bd.querySelector('[data-agenda-action="duplicate"]');if(dup)dup.hidden=!card.querySelector('.duplicateBtn');bd.hidden=false}
  function decorate(){if(!mobile())return;document.querySelectorAll('#calendarPage .calendar-events-scroll .item').forEach(card=>{card.classList.add('mc-agenda-compact-v105');const row=card.querySelector('.item-title-row'),amount=card.querySelector('.amount');if(row&&amount&&!amount.classList.contains('mc-agenda-inline-amount-v105')){amount.classList.add('mc-agenda-inline-amount-v105');row.appendChild(amount)}if(!card.__mcAgendaActionBound){card.__mcAgendaActionBound=true;card.addEventListener('click',e=>{if(!mobile()||e.target.closest('button,input,label,a'))return;openSheet(card)})}})}
  function watch(){const root=document.querySelector('#calendarPage .calendar-events-scroll');if(!root||observer)return;observer=new MutationObserver(()=>requestAnimationFrame(decorate));observer.observe(root,{childList:true,subtree:true})}
  function boot(){installStyle();ensureSheet();decorate();watch()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,80),{once:true});else setTimeout(boot,80);window.addEventListener('load',()=>setTimeout(boot,500));document.querySelectorAll('.nav-btn[data-page="calendar"]').forEach(b=>b.addEventListener('click',()=>setTimeout(decorate,80)));
  window.MeuControleMobileAgendaActionsV105={version:'1.06',refresh:decorate,close:closeSheet};
})();
