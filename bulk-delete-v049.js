/* MeuControle — V0.49.3: seleção em lote refinada + carregamento garantido da camada de exclusões */
(()=>{
  if(window.__mcBulkDeleteV049)return;window.__mcBulkDeleteV049=true;
  const selected=new Set();
  let selectionMode=false,longPressTimer=null,longPressFired=false;
  const mobile=()=>matchMedia('(max-width:700px)').matches;

  const style=document.createElement('style');
  style.textContent=`
    .mc-bulk-start{min-height:40px;padding:0 13px;font-size:12px;border-radius:10px;white-space:nowrap}
    #launchesPage .tabs .mc-bulk-start{margin-left:2px}
    .mc-bulk-toolbar{display:none}
    .mc-bulk-toolbar.active{display:flex;align-items:center;gap:8px;margin:8px 0 10px;padding:9px 10px;border:1px solid #dfe6e1;border-radius:11px;background:#f7faf8}
    .mc-bulk-toolbar .mc-bulk-count{margin-right:auto;font-size:12px;font-weight:700;color:#65736b}
    .mc-bulk-toolbar button{min-height:34px;padding:7px 10px;font-size:12px;border-radius:9px}
    .mc-bulk-toolbar .mc-bulk-delete{background:#a53b3b!important;border-color:#a53b3b!important;color:#fff!important}
    .mc-bulk-toolbar .mc-bulk-delete:disabled{opacity:.45!important;cursor:not-allowed!important}
    #launchesPage .item.mc-bulk-selectable{position:relative;padding-left:48px!important}
    .mc-bulk-check-wrap{position:absolute;left:14px;top:50%;transform:translateY(-50%);align-items:center;justify-content:center;width:22px;height:22px;z-index:4;display:flex}
    .mc-bulk-check-wrap[hidden]{display:none!important}
    .mc-bulk-check{width:18px;height:18px;margin:0;accent-color:var(--primary);cursor:pointer}
    #launchesPage .item.mc-bulk-selected{outline:2px solid rgba(var(--primary-rgb),.42);outline-offset:-1px;background:rgba(var(--primary-rgb),.045)}
    .mc-bulk-notice{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:2800;width:min(430px,calc(100vw - 28px));padding:11px 13px;border:1px solid #ead9bd;border-left:4px solid #b7812e;border-radius:12px;background:#fff9ef;color:#79531f;box-shadow:0 12px 30px rgba(22,43,32,.16);font-size:12px;font-weight:700;text-align:center}
    @media(max-width:700px){
      #launchesPage.mobile-launch-list .tabs .mc-bulk-start{display:none!important}
      #launchesPage.mobile-launch-list .mc-bulk-toolbar.active{position:fixed;left:12px;right:12px;bottom:84px;z-index:1450;margin:0;padding:8px 9px;border-radius:14px;background:#fff;box-shadow:0 10px 30px rgba(20,40,30,.20);display:grid;grid-template-columns:minmax(0,1fr) auto auto auto;gap:6px;align-items:center}
      #launchesPage.mobile-launch-list .mc-bulk-toolbar .mc-bulk-count{margin:0;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #launchesPage.mobile-launch-list .mc-bulk-toolbar button{min-height:36px;padding:7px 9px;font-size:11px;white-space:nowrap}
      #launchesPage.mobile-launch-list .item.mc-bulk-selectable{padding-left:49px!important}
      #launchesPage.mobile-launch-list .mc-bulk-check-wrap{left:14px;top:24px;transform:none}
      .mc-bulk-notice{bottom:92px}
    }
  `;
  document.head.appendChild(style);

  function notice(text){
    document.querySelector('.mc-bulk-notice')?.remove();
    const n=document.createElement('div');n.className='mc-bulk-notice';n.textContent=text;document.body.appendChild(n);setTimeout(()=>n.remove(),3600);
  }
  async function ensureMutations(){
    if(window.MeuControleMutations?.deleteEntries)return window.MeuControleMutations;
    try{await import('./mutation-sync-v050.js?rev=20260907c')}catch(e){console.warn('[MeuControle bulk] mutation loader',e)}
    for(let i=0;i<20;i++){if(window.MeuControleMutations?.deleteEntries)return window.MeuControleMutations;await new Promise(r=>setTimeout(r,50))}
    return null;
  }

  const listPanel=document.querySelector('#launchesPage .list-panel');
  const tabs=listPanel?.querySelector('.tabs');
  if(!listPanel||!tabs||typeof createItemNode!=='function'||typeof renderList!=='function')return;

  const startBtn=document.createElement('button');
  startBtn.type='button';startBtn.className='ghost small mc-bulk-start';startBtn.textContent='Selecionar';
  tabs.appendChild(startBtn);
  const toolbar=document.createElement('div');toolbar.className='mc-bulk-toolbar';tabs.insertAdjacentElement('afterend',toolbar);

  const visibleIds=()=>[...document.querySelectorAll('#list .item[data-mc-entry-id]')].map(el=>el.dataset.mcEntryId).filter(Boolean);
  function updateToolbar(){
    const ids=visibleIds(),count=[...selected].filter(id=>ids.includes(id)).length;
    toolbar.classList.toggle('active',selectionMode);
    startBtn.hidden=selectionMode;
    if(!selectionMode){toolbar.innerHTML='';return}
    toolbar.innerHTML=`<span class="mc-bulk-count">${count} selecionado${count===1?'':'s'}</span><button type="button" class="ghost small mc-bulk-all">Todos</button><button type="button" class="mc-bulk-delete" ${count?'':'disabled'}>Excluir</button><button type="button" class="ghost small mc-bulk-cancel">Cancelar</button>`;
    toolbar.querySelector('.mc-bulk-all').onclick=()=>{ids.forEach(id=>selected.add(id));syncChecks();updateToolbar()};
    toolbar.querySelector('.mc-bulk-delete').onclick=deleteSelected;
    toolbar.querySelector('.mc-bulk-cancel').onclick=()=>setMode(false);
  }
  function syncChecks(){document.querySelectorAll('#list .item[data-mc-entry-id]').forEach(article=>{const id=article.dataset.mcEntryId,checked=selected.has(id);article.classList.toggle('mc-bulk-selected',checked);const input=article.querySelector('.mc-bulk-check');if(input)input.checked=checked})}
  function decorate(){
    const ids=visibleIds();for(const id of [...selected])if(!ids.includes(id))selected.delete(id);
    document.querySelectorAll('#list .item[data-mc-entry-id]').forEach(article=>{const wrap=article.querySelector('.mc-bulk-check-wrap');article.classList.toggle('mc-bulk-selectable',selectionMode);if(wrap)wrap.hidden=!selectionMode});
    syncChecks();updateToolbar();
  }
  function setMode(on,firstId=''){selectionMode=!!on;if(!selectionMode)selected.clear();else if(firstId)selected.add(firstId);decorate()}
  async function deleteSelected(){
    const ids=visibleIds().filter(id=>selected.has(id));if(!ids.length)return;
    const mutations=await ensureMutations();
    if(!mutations){notice('Não foi possível preparar a exclusão sincronizada. Reabra o MeuControle e tente novamente.');return}
    const ok=await mutations.deleteEntries(ids);if(!ok)return;
    selected.clear();selectionMode=false;decorate();try{window.MeuControlePush?.sync?.()}catch{}
  }
  startBtn.onclick=()=>setMode(true);

  const originalCreateItemNode=createItemNode;
  createItemNode=function(e,context='list'){
    const node=originalCreateItemNode(e,context);
    if(context==='list'){
      const article=node.querySelector('.item');if(article){
        article.dataset.mcEntryId=e.id;
        const wrap=document.createElement('label');wrap.className='mc-bulk-check-wrap';wrap.hidden=!selectionMode;wrap.title='Selecionar lançamento';
        const input=document.createElement('input');input.type='checkbox';input.className='mc-bulk-check';input.checked=selected.has(e.id);input.setAttribute('aria-label',`Selecionar ${e.description||'lançamento'}`);
        input.addEventListener('click',ev=>ev.stopPropagation());input.addEventListener('change',()=>{if(input.checked)selected.add(e.id);else selected.delete(e.id);article.classList.toggle('mc-bulk-selected',input.checked);updateToolbar()});wrap.addEventListener('click',ev=>ev.stopPropagation());wrap.appendChild(input);article.prepend(wrap);
        article.classList.toggle('mc-bulk-selectable',selectionMode);article.classList.toggle('mc-bulk-selected',selected.has(e.id));
        const begin=ev=>{if(!mobile()||selectionMode||ev.target.closest('button,input,label,a'))return;longPressFired=false;clearTimeout(longPressTimer);longPressTimer=setTimeout(()=>{longPressFired=true;navigator.vibrate?.(30);setMode(true,e.id)},520)};
        const cancel=()=>{clearTimeout(longPressTimer);longPressTimer=null};
        article.addEventListener('touchstart',begin,{passive:true});article.addEventListener('touchend',cancel,{passive:true});article.addEventListener('touchmove',cancel,{passive:true});article.addEventListener('touchcancel',cancel,{passive:true});
        article.addEventListener('click',ev=>{if(longPressFired){ev.preventDefault();ev.stopPropagation();longPressFired=false;return}if(mobile()&&selectionMode&&!ev.target.closest('button,input,label,a')){ev.preventDefault();const check=article.querySelector('.mc-bulk-check');if(check){check.checked=!check.checked;check.dispatchEvent(new Event('change',{bubbles:true}))}}},true);
      }
    }
    return node;
  };
  const originalRenderList=renderList;renderList=function(){originalRenderList();decorate()};
  window.addEventListener('resize',()=>{if(!mobile()&&selectionMode)decorate()});
  setTimeout(()=>ensureMutations(),120);
  updateToolbar();renderList();
})();