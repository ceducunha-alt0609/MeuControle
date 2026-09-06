/* MeuControle — V0.38.1: desfazer ações recentes + confirmação premium de exclusão */
(function(){
  if(window.__meuControleUndoV038Loaded)return;
  window.__meuControleUndoV038Loaded=true;

  const VERSION='0.38.1';
  const DURATION=7000;
  let timer=null;
  let settleTimer=null;
  let pendingUndo=null;

  const clone=value=>{try{return structuredClone(value)}catch{return JSON.parse(JSON.stringify(value))}};
  const same=(a,b)=>{try{return JSON.stringify(a)===JSON.stringify(b)}catch{return false}};

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
      .mc-delete-backdrop-v038{position:fixed;inset:0;z-index:100950;background:rgba(13,31,43,.48);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:20px}
      .mc-delete-dialog-v038{width:min(430px,100%);background:#fff;border:1px solid #e1e8e4;border-radius:20px;box-shadow:0 28px 80px rgba(0,0,0,.28);padding:22px;color:#20342a}
      .mc-delete-icon-v038{width:50px;height:50px;border-radius:15px;background:#fff1ef;color:#b93b32;display:grid;place-items:center;font-family:system-ui,sans-serif;font-size:24px;font-weight:900;margin-bottom:15px}
      .mc-delete-dialog-v038 h2{margin:0 0 7px;font-size:22px;color:#26392f}.mc-delete-dialog-v038 p{margin:0;color:#6d7a72;font-size:13px;line-height:1.5}.mc-delete-name-v038{display:block;margin-top:12px;padding:10px 12px;border-radius:11px;background:#f6f8f7;color:#394c42;font-size:12px;font-weight:800;overflow-wrap:anywhere}
      .mc-delete-actions-v038{display:flex;justify-content:flex-end;gap:9px;margin-top:20px}.mc-delete-cancel-v038{background:#edf2ef!important;color:#4b5d53!important}.mc-delete-confirm-v038{background:#b93b32!important;color:#fff!important}.mc-delete-actions-v038 button{min-height:43px!important;padding:9px 15px!important;border-radius:11px!important}
      @media(max-width:700px){.mc-undo-v038{left:14px;right:14px;bottom:84px;min-width:0;max-width:none;border-radius:13px;padding:11px 10px 11px 13px}.mc-undo-copy-v038 strong{font-size:12px}.mc-undo-copy-v038 span{font-size:9px}.mc-undo-btn-v038{min-height:36px!important}.mc-delete-backdrop-v038{align-items:flex-end;padding:14px}.mc-delete-dialog-v038{border-radius:20px 20px 15px 15px;padding:20px 17px}.mc-delete-actions-v038{display:grid;grid-template-columns:1fr 1fr}.mc-delete-actions-v038 button{width:100%}}
    `;
    document.head.appendChild(style);
  }

  function ensureToast(){
    let toast=document.querySelector('.mc-undo-v038');
    if(toast)return toast;
    toast=document.createElement('div');toast.className='mc-undo-v038';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');
    toast.innerHTML='<div class="mc-undo-copy-v038"><strong></strong><span>Você pode desfazer esta ação por alguns segundos.</span></div><button type="button" class="mc-undo-btn-v038">DESFAZER</button>';
    document.body.appendChild(toast);toast.querySelector('.mc-undo-btn-v038').onclick=performUndo;return toast;
  }
  function hideToast(){clearTimeout(timer);timer=null;clearTimeout(settleTimer);settleTimer=null;document.querySelector('.mc-undo-v038')?.classList.remove('show');pendingUndo=null}
  function offerUndo(label,snapshot){
    clearTimeout(timer);clearTimeout(settleTimer);settleTimer=null;pendingUndo={label,snapshot:clone(snapshot)};
    const toast=ensureToast();toast.querySelector('strong').textContent=label;toast.querySelector('.mc-undo-copy-v038 span').textContent='Você pode desfazer esta ação por alguns segundos.';toast.querySelector('.mc-undo-btn-v038').style.display='';requestAnimationFrame(()=>toast.classList.add('show'));timer=setTimeout(hideToast,DURATION);
  }
  function performUndo(){
    if(!pendingUndo)return;clearTimeout(timer);timer=null;const snapshot=clone(pendingUndo.snapshot);pendingUndo=null;
    try{entries=snapshot;save();renderAll();const toast=ensureToast();toast.querySelector('strong').textContent='Ação desfeita ✓';toast.querySelector('.mc-undo-copy-v038 span').textContent='O estado anterior foi restaurado.';toast.querySelector('.mc-undo-btn-v038').style.display='none';toast.classList.add('show');settleTimer=setTimeout(()=>{toast.classList.remove('show');settleTimer=null},1800)}catch(e){console.warn('[MeuControle Undo] Falha ao restaurar estado',e)}
  }

  function askDelete(item){
    return new Promise(resolve=>{
      document.querySelector('.mc-delete-backdrop-v038')?.remove();
      const back=document.createElement('div');back.className='mc-delete-backdrop-v038';
      back.innerHTML=`<section class="mc-delete-dialog-v038" role="dialog" aria-modal="true" aria-labelledby="mcDeleteTitleV038"><div class="mc-delete-icon-v038">×</div><h2 id="mcDeleteTitleV038">Excluir lançamento?</h2><p>Esta ação remove o lançamento da sua lista. Você ainda poderá desfazer logo em seguida.</p><span class="mc-delete-name-v038"></span><div class="mc-delete-actions-v038"><button type="button" class="mc-delete-cancel-v038">Cancelar</button><button type="button" class="mc-delete-confirm-v038">Excluir</button></div></section>`;
      back.querySelector('.mc-delete-name-v038').textContent=item?.description||'Lançamento selecionado';
      document.body.appendChild(back);document.body.style.overflow='hidden';
      const finish=value=>{document.body.style.overflow='';back.remove();document.removeEventListener('keydown',onKey);resolve(value)};
      const onKey=e=>{if(e.key==='Escape')finish(false);if(e.key==='Enter')finish(true)};
      back.querySelector('.mc-delete-cancel-v038').onclick=()=>finish(false);back.querySelector('.mc-delete-confirm-v038').onclick=()=>finish(true);back.addEventListener('click',e=>{if(e.target===back)finish(false)});document.addEventListener('keydown',onKey);setTimeout(()=>back.querySelector('.mc-delete-cancel-v038')?.focus(),0);
    });
  }

  function wrapCoreActions(){
    if(typeof toggleDone==='function'&&!toggleDone.__mcUndoWrapped){
      const original=toggleDone;const wrapped=function(id){const before=clone(entries);const item=entries.find(e=>e.id===id);const wasDone=!!item?.done;original(id);if(!same(before,entries))offerUndo(wasDone?'Lançamento reaberto':'Lançamento concluído',before)};wrapped.__mcUndoWrapped=true;toggleDone=wrapped;
    }
    if(typeof removeEntry==='function'&&!removeEntry.__mcUndoWrapped){
      const wrapped=async function(id){
        const item=entries.find(e=>e.id===id);if(!item)return;
        const confirmed=await askDelete(item);if(!confirmed)return;
        const before=clone(entries);createAutoBackup('Antes de excluir lançamento');entries=entries.filter(e=>e.id!==id);save();renderAll();offerUndo('Lançamento excluído',before);
      };
      wrapped.__mcUndoWrapped=true;removeEntry=wrapped;
    }
  }

  function watchForm(){
    const form=document.getElementById('entryForm');if(!form||form.dataset.mcUndoV038==='1')return;form.dataset.mcUndoV038='1';
    form.addEventListener('submit',()=>{const before=clone(entries);let wasEditing=false;try{wasEditing=editingId!==null}catch{}setTimeout(()=>{if(!same(before,entries))offerUndo(wasEditing?'Alterações salvas':'Lançamento criado',before)},0)},true);
  }

  function boot(){installStyles();ensureToast();wrapCoreActions();watchForm()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('load',()=>setTimeout(()=>{wrapCoreActions();watchForm()},250));
  window.MeuControleUndo={version:VERSION,clear:hideToast};
})();
