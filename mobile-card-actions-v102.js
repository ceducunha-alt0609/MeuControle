/* MeuControle — V1.02: cards compactos e ações por toque, somente mobile */
(()=>{
  if(window.__mcMobileCardActionsV102)return;window.__mcMobileCardActionsV102=true;
  const mobile=()=>matchMedia('(max-width:700px)').matches;
  let activeCard=null;

  function installStyle(){
    if(document.getElementById('mcMobileCardActionsV102Style'))return;
    const st=document.createElement('style');st.id='mcMobileCardActionsV102Style';st.textContent=`
      .mc-card-actions-backdrop-v102{display:none}
      @media(max-width:700px){
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102{
          position:relative!important;display:block!important;box-sizing:border-box!important;
          height:118px!important;min-height:118px!important;max-height:118px!important;
          padding:14px 14px 13px 58px!important;overflow:hidden!important;cursor:pointer;
        }
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .item-main{min-width:0!important;width:100%!important}
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .item-title-row{
          display:grid!important;grid-template-columns:minmax(0,1fr) auto auto!important;gap:7px!important;align-items:center!important;min-width:0!important;
        }
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .item-title{
          margin:0!important;min-width:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:18px!important;line-height:1.25!important;
        }
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .badge{white-space:nowrap!important;align-self:center!important}
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .mc-mobile-inline-amount-v102{
          margin:0!important;padding-left:4px!important;white-space:nowrap!important;font-size:17px!important;line-height:1.2!important;color:var(--primary-dark)!important;text-align:right!important;
        }
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .mc-mobile-inline-amount-v102:empty{display:none!important}
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .meta{
          margin-top:5px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:12px!important;line-height:1.35!important;
        }
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .notes{
          display:block!important;height:17px!important;min-height:17px!important;margin-top:4px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:11px!important;line-height:17px!important;color:#7d8882!important;
        }
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .item-side{display:none!important}
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .status-dot{position:absolute!important;left:20px!important;top:29px!important;margin:0!important}
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102.mc-bulk-selectable{padding-left:58px!important}
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102.mc-bulk-selectable .mc-bulk-check-wrap{left:14px!important;top:19px!important}

        .mc-card-actions-backdrop-v102{position:fixed;inset:0;z-index:3500;background:rgba(17,31,24,.38);display:flex;align-items:flex-end;padding:12px}
        .mc-card-actions-backdrop-v102[hidden]{display:none!important}
        .mc-card-actions-sheet-v102{width:100%;padding:17px;border-radius:20px 20px 15px 15px;background:#fff;box-shadow:0 -14px 42px rgba(0,0,0,.2);color:#2c3d34}
        .mc-card-actions-head-v102{display:flex;align-items:flex-start;gap:10px;margin-bottom:14px}
        .mc-card-actions-copy-v102{min-width:0;flex:1}.mc-card-actions-copy-v102 strong{display:block;font-size:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mc-card-actions-copy-v102 span{display:block;margin-top:4px;font-size:11px;color:#78847d;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .mc-card-actions-close-v102{width:38px;height:38px;min-height:38px!important;padding:0!important;border-radius:11px!important;background:#eef3f0!important;color:#526158!important;box-shadow:none!important}
        .mc-card-actions-grid-v102{display:grid;grid-template-columns:1fr 1fr;gap:9px}.mc-card-actions-grid-v102 button{min-height:46px!important;border-radius:12px!important;font-size:13px!important}
        .mc-card-action-delete-v102{background:#a53b3b!important;border-color:#a53b3b!important;color:#fff!important}
        body.mc-bulk-active-mobile #mcQuickEntryV040{opacity:0!important;transform:translateY(8px) scale(.92)!important;pointer-events:none!important}
      }
    `;document.head.appendChild(st);
  }

  function closeSheet(){const bd=document.querySelector('.mc-card-actions-backdrop-v102');if(bd)bd.hidden=true;activeCard=null}
  function ensureSheet(){
    let bd=document.querySelector('.mc-card-actions-backdrop-v102');if(bd)return bd;
    bd=document.createElement('div');bd.className='mc-card-actions-backdrop-v102';bd.hidden=true;
    bd.innerHTML='<section class="mc-card-actions-sheet-v102" role="dialog" aria-modal="true" aria-label="Ações do lançamento"><div class="mc-card-actions-head-v102"><div class="mc-card-actions-copy-v102"><strong></strong><span></span></div><button type="button" class="mc-card-actions-close-v102" aria-label="Fechar">×</button></div><div class="mc-card-actions-grid-v102"><button type="button" data-card-action="edit" class="secondary-action">Editar</button><button type="button" data-card-action="done">Concluir</button><button type="button" data-card-action="duplicate" class="secondary-action">Duplicar</button><button type="button" data-card-action="delete" class="mc-card-action-delete-v102">Excluir</button></div></section>';
    document.body.appendChild(bd);bd.querySelector('.mc-card-actions-close-v102').onclick=closeSheet;bd.addEventListener('click',e=>{if(e.target===bd)closeSheet()});
    bd.querySelectorAll('[data-card-action]').forEach(btn=>btn.onclick=()=>runAction(btn.dataset.cardAction));
    return bd;
  }

  function runAction(action){
    const card=activeCard;if(!card)return closeSheet();
    const map={edit:'.editBtn',done:'.doneBtn',duplicate:'.duplicateBtn',delete:'.deleteBtn'},target=card.querySelector(map[action]);
    closeSheet();setTimeout(()=>target?.click(),20);
  }

  function openSheet(card){
    if(!mobile()||!card||document.body.classList.contains('mc-bulk-active-mobile')||document.querySelector('.mc-bulk-toolbar.active'))return;
    activeCard=card;const bd=ensureSheet(),title=card.querySelector('.item-title')?.textContent?.trim()||'Lançamento',meta=card.querySelector('.meta')?.textContent?.trim()||'';
    bd.querySelector('.mc-card-actions-copy-v102 strong').textContent=title;bd.querySelector('.mc-card-actions-copy-v102 span').textContent=meta;
    const done=card.querySelector('.doneBtn'),doneSheet=bd.querySelector('[data-card-action="done"]');if(doneSheet)doneSheet.textContent=done?.textContent?.trim()||'Concluir';
    const dup=bd.querySelector('[data-card-action="duplicate"]');if(dup)dup.hidden=!card.querySelector('.duplicateBtn');
    bd.hidden=false;
  }

  function decorateFragment(fragment){
    if(!fragment?.querySelector)return fragment;const card=fragment.querySelector('.item');if(!card)return fragment;
    card.classList.add('mc-mobile-compact-v102');
    const titleRow=card.querySelector('.item-title-row'),amount=card.querySelector('.amount');if(titleRow&&amount&&!amount.classList.contains('mc-mobile-inline-amount-v102')){amount.classList.add('mc-mobile-inline-amount-v102');titleRow.appendChild(amount)}
    card.addEventListener('click',e=>{if(!mobile()||e.target.closest('button,input,label,a')||document.body.classList.contains('mc-bulk-active-mobile'))return;openSheet(card)});
    return fragment;
  }

  function wrap(){
    if(typeof createItemNode!=='function'||createItemNode.__mcMobileCompactV102)return;
    const original=createItemNode;const wrapped=function(e,context='list'){const fragment=original(e,context);return context==='list'?decorateFragment(fragment):fragment};wrapped.__mcMobileCompactV102=true;createItemNode=wrapped;
  }

  function redecorate(){if(!mobile())return;document.querySelectorAll('#launchesPage #list .item').forEach(card=>{card.classList.add('mc-mobile-compact-v102');const row=card.querySelector('.item-title-row'),amount=card.querySelector('.amount');if(row&&amount&&!amount.classList.contains('mc-mobile-inline-amount-v102')){amount.classList.add('mc-mobile-inline-amount-v102');row.appendChild(amount)}})}
  function boot(){installStyle();ensureSheet();wrap();redecorate();try{renderList()}catch{}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,60),{once:true});else setTimeout(boot,60);
  window.addEventListener('load',()=>setTimeout(()=>{wrap();redecorate()},500));
  window.addEventListener('resize',redecorate);
  window.MeuControleMobileCardActionsV102={version:'1.02',refresh:redecorate,close:closeSheet};
})();
