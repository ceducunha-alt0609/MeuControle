/* MeuControle — V0.39: duplicar lançamento */
(function(){
  if(window.__meuControleDuplicateV039Loaded)return;
  window.__meuControleDuplicateV039Loaded=true;

  const VERSION='0.39';
  const clone=value=>{try{return structuredClone(value)}catch{return JSON.parse(JSON.stringify(value))}};
  let undoTimer=null;
  let undoSnapshot=null;

  function installStyles(){
    if(document.getElementById('mcDuplicateV039Style'))return;
    const st=document.createElement('style');
    st.id='mcDuplicateV039Style';
    st.textContent=`
      .mc-duplicate-toast-v039{position:fixed;right:22px;bottom:22px;z-index:100905;min-width:300px;max-width:min(430px,calc(100vw - 32px));padding:12px 12px 12px 15px;border:1px solid rgba(255,255,255,.13);border-radius:14px;background:#203a4a;color:#fff;box-shadow:0 16px 42px rgba(0,0,0,.26);display:flex;align-items:center;gap:14px;opacity:0;transform:translateY(12px);pointer-events:none;transition:.18s ease}
      .mc-duplicate-toast-v039.show{opacity:1;transform:translateY(0);pointer-events:auto}
      .mc-duplicate-copy-v039{min-width:0;flex:1}.mc-duplicate-copy-v039 strong{display:block;font-size:13px;line-height:1.3;color:#fff}.mc-duplicate-copy-v039 span{display:block;margin-top:2px;font-size:10px;line-height:1.35;color:rgba(255,255,255,.68)}
      .mc-duplicate-undo-v039{flex:0 0 auto;min-height:38px!important;padding:8px 11px!important;border:1px solid rgba(255,255,255,.28)!important;border-radius:10px!important;background:rgba(255,255,255,.11)!important;color:#fff!important;font-size:11px!important;font-weight:900!important;letter-spacing:.04em!important;box-shadow:none!important}
      @media(max-width:700px){.mc-duplicate-toast-v039{left:14px;right:14px;bottom:84px;min-width:0;max-width:none;border-radius:13px;padding:11px 10px 11px 13px}.mc-duplicate-copy-v039 strong{font-size:12px}.mc-duplicate-copy-v039 span{font-size:9px}.mc-duplicate-undo-v039{min-height:36px!important}}
    `;
    document.head.appendChild(st);
  }

  function ensureToast(){
    let toast=document.querySelector('.mc-duplicate-toast-v039');
    if(toast)return toast;
    toast=document.createElement('div');
    toast.className='mc-duplicate-toast-v039';
    toast.innerHTML='<div class="mc-duplicate-copy-v039"><strong>Lançamento duplicado</strong><span>A cópia foi criada como um novo lançamento pendente.</span></div><button type="button" class="mc-duplicate-undo-v039">DESFAZER</button>';
    document.body.appendChild(toast);
    toast.querySelector('.mc-duplicate-undo-v039').onclick=undoDuplicate;
    return toast;
  }

  function hideToast(){
    clearTimeout(undoTimer);undoTimer=null;undoSnapshot=null;
    document.querySelector('.mc-duplicate-toast-v039')?.classList.remove('show');
  }

  function showToast(snapshot){
    try{window.MeuControleUndo?.clear?.()}catch{}
    clearTimeout(undoTimer);undoSnapshot=clone(snapshot);
    const toast=ensureToast();
    toast.querySelector('strong').textContent='Lançamento duplicado';
    toast.querySelector('.mc-duplicate-copy-v039 span').textContent='A cópia foi criada como um novo lançamento pendente.';
    toast.querySelector('.mc-duplicate-undo-v039').style.display='';
    requestAnimationFrame(()=>toast.classList.add('show'));
    undoTimer=setTimeout(hideToast,7000);
  }

  function undoDuplicate(){
    if(!undoSnapshot)return;
    const before=clone(undoSnapshot);undoSnapshot=null;clearTimeout(undoTimer);undoTimer=null;
    try{
      entries=before;save();renderAll();
      const toast=ensureToast();
      toast.querySelector('strong').textContent='Duplicação desfeita ✓';
      toast.querySelector('.mc-duplicate-copy-v039 span').textContent='A cópia foi removida e o original permaneceu intacto.';
      toast.querySelector('.mc-duplicate-undo-v039').style.display='none';
      setTimeout(()=>toast.classList.remove('show'),1800);
    }catch(e){console.warn('[MeuControle Duplicate] Falha ao desfazer',e)}
  }

  function duplicateEntry(id){
    const source=entries.find(e=>e.id===id);if(!source)return;
    const before=clone(entries);
    try{
      createAutoBackup('Antes de duplicar lançamento');
      const copy=clone(source);
      copy.id=crypto.randomUUID();
      copy.done=false;
      copy.doneAt=null;
      copy.seriesId=null;
      entries.push(copy);
      save();renderAll();
      try{if(typeof checkNotifications==='function')checkNotifications()}catch{}
      showToast(before);
    }catch(e){console.warn('[MeuControle Duplicate] Falha ao duplicar',e)}
  }

  function wrapCreateItemNode(){
    if(typeof createItemNode!=='function'||createItemNode.__mcDuplicateWrapped)return;
    const original=createItemNode;
    const wrapped=function(e,context='list'){
      const fragment=original(e,context);
      const actions=fragment.querySelector?.('.item-actions');
      if(actions&&!actions.querySelector('.duplicateBtn')){
        const btn=document.createElement('button');
        btn.type='button';btn.className='duplicateBtn small secondary-action';btn.textContent='Duplicar';
        btn.onclick=ev=>{ev.stopPropagation();duplicateEntry(e.id)};
        const del=actions.querySelector('.deleteBtn');
        del?actions.insertBefore(btn,del):actions.appendChild(btn);
      }
      return fragment;
    };
    wrapped.__mcDuplicateWrapped=true;
    createItemNode=wrapped;
  }

  function boot(){installStyles();ensureToast();wrapCreateItemNode()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('load',()=>setTimeout(wrapCreateItemNode,250));
  window.MeuControleDuplicate={version:VERSION,duplicate:duplicateEntry};
})();
