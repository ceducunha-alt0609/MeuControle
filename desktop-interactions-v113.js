/* MeuControle — V1.13: ações flutuantes e avisos arrastáveis no desktop */
(function(){
  if(window.__mcDesktopInteractionsV113)return;window.__mcDesktopInteractionsV113=true;
  const VERSION='1.13',desktop=()=>matchMedia('(min-width:701px)').matches;
  let activeCard=null,drag=null;

  function styles(){
    if(document.getElementById('mcDesktopInteractionsV113Style'))return;
    const s=document.createElement('style');s.id='mcDesktopInteractionsV113Style';s.textContent=`
      .mc-desktop-actions-v113{display:none}
      @media(min-width:701px){
        #launchesPage .item-actions,#calendarPage .item-actions,#launchesPage .item .notes,#calendarPage .item .notes{display:none!important}
        #launchesPage .item.desktop-card-open .item-actions,#calendarPage .item.calendar-card-open-v024 .item-actions{display:none!important}
        .mc-desktop-actions-v113{position:fixed;z-index:100850;width:300px;display:block;padding:11px;border:1px solid #dce5e1;border-radius:15px;background:#fff;box-shadow:0 18px 48px rgba(18,44,59,.2);color:#263b31;opacity:0;transform:translateY(6px);pointer-events:none;transition:opacity .15s ease,transform .15s ease}
        .mc-desktop-actions-v113.show{opacity:1;transform:translateY(0);pointer-events:auto}
        .mc-desktop-actions-handle-v113{height:19px;margin:-3px -3px 5px;display:flex;align-items:center;justify-content:center;cursor:ns-resize;user-select:none;touch-action:none;color:#9aa6a0;font:900 16px/1 system-ui,sans-serif;letter-spacing:2px}
        .mc-desktop-actions-head-v113{display:flex;align-items:flex-start;gap:9px;padding:0 4px 9px}.mc-desktop-actions-copy-v113{min-width:0;flex:1}.mc-desktop-actions-copy-v113 strong{display:block;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mc-desktop-actions-copy-v113 span{display:block;margin-top:3px;font-size:10px;color:#758178;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mc-desktop-actions-close-v113{width:30px;height:30px;min-height:30px!important;padding:0!important;border-radius:9px!important;background:#edf2ef!important;color:#536159!important;box-shadow:none!important}
        .mc-desktop-actions-grid-v113{display:grid;grid-template-columns:1fr 1fr;gap:7px}.mc-desktop-actions-grid-v113 button{min-height:38px!important;border-radius:10px!important;font-size:11px!important}.mc-desktop-delete-v113{background:#a83f3f!important;border-color:#a83f3f!important;color:#fff!important}
        .mc-undo-v038,.mc-duplicate-toast-v039{touch-action:none}
        .mc-toast-drag-handle-v113{flex:0 0 auto;width:16px;align-self:stretch;display:flex;align-items:center;justify-content:center;cursor:ns-resize;user-select:none;touch-action:none;color:rgba(255,255,255,.42);font:900 13px/1 system-ui,sans-serif;letter-spacing:-1px}
      }
    `;document.head.appendChild(s)
  }

  function ensurePanel(){
    let p=document.querySelector('.mc-desktop-actions-v113');if(p)return p;
    p=document.createElement('section');p.className='mc-desktop-actions-v113';p.setAttribute('role','dialog');p.setAttribute('aria-label','Ações do lançamento');
    p.innerHTML='<div class="mc-desktop-actions-handle-v113" title="Arraste para mover">•••</div><div class="mc-desktop-actions-head-v113"><div class="mc-desktop-actions-copy-v113"><strong></strong><span></span></div><button type="button" class="mc-desktop-actions-close-v113" aria-label="Fechar">×</button></div><div class="mc-desktop-actions-grid-v113"><button type="button" data-action="edit" class="secondary-action">Editar</button><button type="button" data-action="done">Concluir</button><button type="button" data-action="duplicate" class="secondary-action">Duplicar</button><button type="button" data-action="delete" class="mc-desktop-delete-v113">Excluir</button></div>';
    document.body.appendChild(p);p.querySelector('.mc-desktop-actions-close-v113').onclick=closePanel;p.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>runAction(b.dataset.action));installVerticalDrag(p,p.querySelector('.mc-desktop-actions-handle-v113'),true);return p;
  }
  function closePanel(){const p=document.querySelector('.mc-desktop-actions-v113');p?.classList.remove('show');activeCard=null}
  function runAction(action){const card=activeCard;if(!card)return closePanel();const sel={edit:'.editBtn',done:'.doneBtn',duplicate:'.duplicateBtn',delete:'.deleteBtn'}[action],target=card.querySelector(sel);closePanel();setTimeout(()=>target?.click(),15)}
  function placePanel(card){
    const p=ensurePanel(),r=card.getBoundingClientRect(),w=300,margin=12;let left=Math.min(innerWidth-w-margin,Math.max(margin,r.right-w));let top=r.bottom+8;if(top+p.offsetHeight>innerHeight-margin)top=Math.max(margin,r.top-p.offsetHeight-8);p.style.left=left+'px';p.style.top=top+'px';p.dataset.baseTop=String(top);p.style.removeProperty('bottom');
  }
  function openPanel(card){
    if(!desktop()||!card)return;activeCard=card;const p=ensurePanel(),title=card.querySelector('.item-title')?.textContent?.trim()||'Lançamento',meta=card.querySelector('.meta')?.textContent?.trim()||'';p.querySelector('.mc-desktop-actions-copy-v113 strong').textContent=title;p.querySelector('.mc-desktop-actions-copy-v113 span').textContent=meta;const done=p.querySelector('[data-action="done"]');done.textContent=card.querySelector('.doneBtn')?.textContent?.trim()||'Concluir';p.querySelector('[data-action="duplicate"]').hidden=!card.querySelector('.duplicateBtn');placePanel(card);requestAnimationFrame(()=>p.classList.add('show'));
  }

  function installVerticalDrag(el,handle,resetOnShow){
    if(!el||!handle||handle.dataset.mcDragV113)return;handle.dataset.mcDragV113='1';
    handle.addEventListener('pointerdown',e=>{if(!desktop())return;e.preventDefault();const r=el.getBoundingClientRect();drag={el,id:e.pointerId,startY:e.clientY,startTop:r.top};handle.setPointerCapture?.(e.pointerId)});
    handle.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const h=drag.el.offsetHeight,top=Math.min(innerHeight-h-8,Math.max(8,drag.startTop+(e.clientY-drag.startY)));drag.el.style.top=top+'px';drag.el.style.bottom='auto'});
    const end=e=>{if(drag&&drag.id===e.pointerId)drag=null};handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);
    if(resetOnShow){new MutationObserver(m=>m.forEach(x=>{if(x.attributeName==='class'&&el.classList.contains('show')){const base=Number(el.dataset.baseTop);if(Number.isFinite(base)){el.style.top=base+'px';el.style.bottom='auto'}}})).observe(el,{attributes:true})}
  }

  function makeToastDraggable(el){
    if(!desktop()||!el||el.dataset.mcDragV113)return;el.dataset.mcDragV113='1';
    const h=document.createElement('span');h.className='mc-toast-drag-handle-v113';h.textContent='⋮⋮';h.title='Arraste para mover';el.insertBefore(h,el.firstChild);
    const reset=()=>{el.style.removeProperty('top');el.style.removeProperty('transform');el.style.bottom='22px';el.dataset.baseTop=''};
    installVerticalDrag(el,h,false);
    new MutationObserver(m=>m.forEach(x=>{if(x.attributeName==='class'&&el.classList.contains('show'))reset()})).observe(el,{attributes:true});
  }
  function scanToasts(){if(!desktop())return;document.querySelectorAll('.mc-undo-v038,.mc-duplicate-toast-v039').forEach(makeToastDraggable)}

  function captureClicks(){
    document.addEventListener('click',e=>{if(!desktop())return;const card=e.target.closest('#launchesPage .item,#calendarPage .item');if(!card||e.target.closest('button,input,label,a'))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openPanel(card)},true);
    document.addEventListener('keydown',e=>{if(!desktop()||(e.key!=='Enter'&&e.key!==' '))return;const card=e.target.closest?.('#launchesPage .item,#calendarPage .item');if(!card||e.target.closest('button,input,label,a'))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openPanel(card)},true);
    document.addEventListener('click',e=>{if(!desktop())return;const p=document.querySelector('.mc-desktop-actions-v113');if(!p?.classList.contains('show'))return;if(!e.target.closest('.mc-desktop-actions-v113')&&!e.target.closest('#launchesPage .item,#calendarPage .item'))closePanel()});
  }
  function boot(){styles();ensurePanel();scanToasts();captureClicks();new MutationObserver(scanToasts).observe(document.body,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('resize',()=>{if(!desktop())closePanel()});
  window.MeuControleDesktopInteractions={version:VERSION,open:openPanel,close:closePanel};
})();
