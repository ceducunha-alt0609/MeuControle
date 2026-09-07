/* MeuControle — V0.49: seleção e exclusão em lote nos lançamentos */
(()=>{
  if(window.__mcBulkDeleteV049)return;window.__mcBulkDeleteV049=true;
  const selected=new Set();
  let selectionMode=false;

  const style=document.createElement('style');
  style.textContent=`
    .mc-bulk-toolbar{display:flex;align-items:center;justify-content:flex-end;gap:8px;margin:0 0 10px;min-height:34px}
    .mc-bulk-toolbar .mc-bulk-count{margin-right:auto;font-size:12px;font-weight:700;color:#65736b}
    .mc-bulk-toolbar button{min-height:34px;padding:7px 11px;font-size:12px;border-radius:9px}
    .mc-bulk-toolbar .mc-bulk-delete{background:#a53b3b!important;border-color:#a53b3b!important;color:#fff!important}
    .mc-bulk-toolbar .mc-bulk-delete:disabled{opacity:.45!important;cursor:not-allowed!important}
    #launchesPage .item.mc-bulk-selectable{position:relative;padding-left:46px!important}
    .mc-bulk-check-wrap{position:absolute;left:14px;top:50%;transform:translateY(-50%);display:flex;align-items:center;justify-content:center;width:22px;height:22px;z-index:3}
    .mc-bulk-check{width:18px;height:18px;margin:0;accent-color:var(--primary);cursor:pointer}
    #launchesPage .item.mc-bulk-selected{outline:2px solid rgba(var(--primary-rgb),.42);outline-offset:-1px;background:rgba(var(--primary-rgb),.045)}
    @media(max-width:700px){
      #launchesPage.mobile-launch-list .mc-bulk-toolbar{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:0 0 11px}
      #launchesPage.mobile-launch-list .mc-bulk-toolbar .mc-bulk-count{grid-column:1/-1;margin:0;font-size:11px}
      #launchesPage.mobile-launch-list .mc-bulk-toolbar button{width:100%;min-width:0;padding:8px 7px}
      #launchesPage.mobile-launch-list .mc-bulk-toolbar:not(.active){display:flex;justify-content:flex-end}
      #launchesPage.mobile-launch-list .mc-bulk-toolbar:not(.active) button{width:auto}
      #launchesPage.mobile-launch-list .item.mc-bulk-selectable{padding-left:45px!important}
      #launchesPage.mobile-launch-list .mc-bulk-check-wrap{left:12px}
    }
  `;
  document.head.appendChild(style);

  const listPanel=document.querySelector('#launchesPage .list-panel');
  const tabs=listPanel?.querySelector('.tabs');
  if(!listPanel||!tabs||typeof createItemNode!=='function'||typeof renderList!=='function')return;

  const toolbar=document.createElement('div');
  toolbar.className='mc-bulk-toolbar';
  tabs.insertAdjacentElement('afterend',toolbar);

  const visibleIds=()=>[...document.querySelectorAll('#list .item[data-mc-entry-id]')].map(el=>el.dataset.mcEntryId).filter(Boolean);

  function updateToolbar(){
    const ids=visibleIds();
    const count=[...selected].filter(id=>ids.includes(id)).length;
    toolbar.classList.toggle('active',selectionMode);
    if(!selectionMode){toolbar.innerHTML='<button type="button" class="ghost small mc-bulk-start">Selecionar</button>';toolbar.querySelector('.mc-bulk-start').onclick=()=>setMode(true);return}
    toolbar.innerHTML=`<span class="mc-bulk-count">${count} selecionado${count===1?'':'s'}</span><button type="button" class="ghost small mc-bulk-all">Selecionar todos</button><button type="button" class="mc-bulk-delete" ${count?'':'disabled'}>Excluir selecionados</button><button type="button" class="ghost small mc-bulk-cancel">Cancelar</button>`;
    toolbar.querySelector('.mc-bulk-all').onclick=()=>{ids.forEach(id=>selected.add(id));syncChecks();updateToolbar()};
    toolbar.querySelector('.mc-bulk-delete').onclick=deleteSelected;
    toolbar.querySelector('.mc-bulk-cancel').onclick=()=>setMode(false);
  }

  function syncChecks(){
    document.querySelectorAll('#list .item[data-mc-entry-id]').forEach(article=>{
      const id=article.dataset.mcEntryId,checked=selected.has(id);
      article.classList.toggle('mc-bulk-selected',checked);
      const input=article.querySelector('.mc-bulk-check');if(input)input.checked=checked;
    });
  }

  function decorate(){
    const ids=visibleIds();
    for(const id of [...selected])if(!ids.includes(id))selected.delete(id);
    document.querySelectorAll('#list .item[data-mc-entry-id]').forEach(article=>{
      const wrap=article.querySelector('.mc-bulk-check-wrap');
      article.classList.toggle('mc-bulk-selectable',selectionMode);
      if(wrap)wrap.hidden=!selectionMode;
    });
    syncChecks();updateToolbar();
  }

  function setMode(on){selectionMode=!!on;if(!selectionMode)selected.clear();decorate()}

  function deleteSelected(){
    const ids=visibleIds().filter(id=>selected.has(id));
    if(!ids.length)return;
    if(!confirm(`Excluir ${ids.length} lançamento${ids.length===1?'':'s'} selecionado${ids.length===1?'':'s'}?\n\nEssa ação criará um backup automático antes da exclusão.`))return;
    if(typeof createAutoBackup==='function')createAutoBackup(`Antes de excluir ${ids.length} lançamentos em lote`);
    const remove=new Set(ids);
    entries=entries.filter(e=>!remove.has(e.id));
    save();
    selected.clear();selectionMode=false;
    renderAll();
    try{window.MeuControlePush?.sync?.()}catch{}
  }

  const originalCreateItemNode=createItemNode;
  createItemNode=function(e,context='list'){
    const node=originalCreateItemNode(e,context);
    if(context==='list'){
      const article=node.querySelector('.item');
      if(article){
        article.dataset.mcEntryId=e.id;
        const wrap=document.createElement('label');
        wrap.className='mc-bulk-check-wrap';wrap.hidden=!selectionMode;
        wrap.title='Selecionar lançamento';
        const input=document.createElement('input');input.type='checkbox';input.className='mc-bulk-check';input.checked=selected.has(e.id);input.setAttribute('aria-label',`Selecionar ${e.description||'lançamento'}`);
        input.addEventListener('click',ev=>ev.stopPropagation());
        input.addEventListener('change',()=>{if(input.checked)selected.add(e.id);else selected.delete(e.id);article.classList.toggle('mc-bulk-selected',input.checked);updateToolbar()});
        wrap.addEventListener('click',ev=>ev.stopPropagation());wrap.appendChild(input);article.prepend(wrap);
        article.classList.toggle('mc-bulk-selectable',selectionMode);article.classList.toggle('mc-bulk-selected',selected.has(e.id));
      }
    }
    return node;
  };

  const originalRenderList=renderList;
  renderList=function(){originalRenderList();decorate()};

  updateToolbar();
  renderList();
})();