/* MeuControle — V0.38: desfazer ações recentes de lançamentos */
(function(){
  if(window.__meuControleUndoV038Loaded)return;
  window.__meuControleUndoV038Loaded=true;

  const VERSION='0.38';
  const DURATION=7000;
  let timer=null;
  let settleTimer=null;
  let pendingUndo=null;

  const clone=value=>{
    try{return structuredClone(value)}catch{return JSON.parse(JSON.stringify(value))}
  };
  const same=(a,b)=>{
    try{return JSON.stringify(a)===JSON.stringify(b)}catch{return false}
  };

  function installStyles(){
    if(document.getElementById('mcUndoV038Style'))return;
    const style=document.createElement('style');
    style.id='mcUndoV038Style';
    style.textContent=`
      .mc-undo-v038{position:fixed;right:22px;bottom:22px;z-index:100900;min-width:300px;max-width:min(430px,calc(100vw - 32px));padding:12px 12px 12px 15px;border:1px solid rgba(255,255,255,.13);border-radius:14px;background:#203a4a;color:#fff;box-shadow:0 16px 42px rgba(0,0,0,.26);display:flex;align-items:center;gap:14px;opacity:0;transform:translateY(12px);pointer-events:none;transition:.18s ease}
      .mc-undo-v038.show{opacity:1;transform:translateY(0);pointer-events:auto}
      .mc-undo-copy-v038{min-width:0;flex:1}.mc-undo-copy-v038 strong{display:block;font-size:13px;line-height:1.3;color:#fff}.mc-undo-copy-v038 span{display:block;margin-top:2px;font-size:10px;line-height:1.35;color:rgba(255,255,255,.68)}
      .mc-undo-btn-v038{flex:0 0 auto;min-height:38px!important;padding:8px 11px!important;border:1px solid rgba(255,255,255,.28)!important;border-radius:10px!important;background:rgba(255,255,255,.11)!important;color:#fff!important;font-size:11px!important;font-weight:900!important;letter-spacing:.04em!important;box-shadow:none!important}
      .mc-undo-btn-v038:hover{background:rgba(255,255,255,.18)!important;transform:none!important}
      @media(max-width:700px){.mc-undo-v038{left:14px;right:14px;bottom:84px;min-width:0;max-width:none;border-radius:13px;padding:11px 10px 11px 13px}.mc-undo-copy-v038 strong{font-size:12px}.mc-undo-copy-v038 span{font-size:9px}.mc-undo-btn-v038{min-height:36px!important}}
    `;
    document.head.appendChild(style);
  }

  function ensureToast(){
    let toast=document.querySelector('.mc-undo-v038');
    if(toast)return toast;
    toast=document.createElement('div');
    toast.className='mc-undo-v038';
    toast.setAttribute('role','status');
    toast.setAttribute('aria-live','polite');
    toast.innerHTML='<div class="mc-undo-copy-v038"><strong></strong><span>Você pode desfazer esta ação por alguns segundos.</span></div><button type="button" class="mc-undo-btn-v038">DESFAZER</button>';
    document.body.appendChild(toast);
    toast.querySelector('.mc-undo-btn-v038').onclick=performUndo;
    return toast;
  }

  function hideToast(){
    clearTimeout(timer);timer=null;
    clearTimeout(settleTimer);settleTimer=null;
    const toast=document.querySelector('.mc-undo-v038');
    toast?.classList.remove('show');
    pendingUndo=null;
  }

  function offerUndo(label,snapshot){
    clearTimeout(timer);
    clearTimeout(settleTimer);settleTimer=null;
    pendingUndo={label,snapshot:clone(snapshot)};
    const toast=ensureToast();
    toast.querySelector('.mc-undo-copy-v038 strong').textContent=label;
    toast.querySelector('.mc-undo-copy-v038 span').textContent='Você pode desfazer esta ação por alguns segundos.';
    toast.querySelector('.mc-undo-btn-v038').style.display='';
    requestAnimationFrame(()=>toast.classList.add('show'));
    timer=setTimeout(hideToast,DURATION);
  }

  function performUndo(){
    if(!pendingUndo)return;
    clearTimeout(timer);timer=null;
    const snapshot=clone(pendingUndo.snapshot);
    pendingUndo=null;
    try{
      entries=snapshot;
      save();
      renderAll();
      const toast=ensureToast();
      toast.querySelector('.mc-undo-copy-v038 strong').textContent='Ação desfeita ✓';
      toast.querySelector('.mc-undo-copy-v038 span').textContent='O estado anterior foi restaurado.';
      toast.querySelector('.mc-undo-btn-v038').style.display='none';
      toast.classList.add('show');
      settleTimer=setTimeout(()=>{
        toast.classList.remove('show');
        settleTimer=null;
      },1800);
    }catch(e){console.warn('[MeuControle Undo] Falha ao restaurar estado',e)}
  }

  function wrapCoreActions(){
    if(typeof toggleDone==='function'&&!toggleDone.__mcUndoWrapped){
      const original=toggleDone;
      const wrapped=function(id){
        const before=clone(entries);
        const item=entries.find(e=>e.id===id);
        const wasDone=!!item?.done;
        original(id);
        if(!same(before,entries))offerUndo(wasDone?'Lançamento reaberto':'Lançamento concluído',before);
      };
      wrapped.__mcUndoWrapped=true;
      toggleDone=wrapped;
    }

    if(typeof removeEntry==='function'&&!removeEntry.__mcUndoWrapped){
      const original=removeEntry;
      const wrapped=function(id){
        const before=clone(entries);
        original(id);
        if(!same(before,entries))offerUndo('Lançamento excluído',before);
      };
      wrapped.__mcUndoWrapped=true;
      removeEntry=wrapped;
    }
  }

  function watchForm(){
    const form=document.getElementById('entryForm');
    if(!form||form.dataset.mcUndoV038==='1')return;
    form.dataset.mcUndoV038='1';
    form.addEventListener('submit',()=>{
      const before=clone(entries);
      let wasEditing=false;
      try{wasEditing=editingId!==null}catch{}
      setTimeout(()=>{
        if(!same(before,entries))offerUndo(wasEditing?'Alterações salvas':'Lançamento criado',before);
      },0);
    },true);
  }

  function boot(){installStyles();ensureToast();wrapCoreActions();watchForm()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('load',()=>setTimeout(()=>{wrapCoreActions();watchForm()},250));
  window.MeuControleUndo={version:VERSION,clear:hideToast};
})();
