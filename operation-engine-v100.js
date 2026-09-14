/* MeuControle — Motor de Operações V1.44
   Compatibilidade local: ações continuam usando a mesma API,
   mas a sincronização de nuvem é responsabilidade exclusiva do CloudSync V1.43+.
*/
(()=>{
  if(window.MeuControleOps)return;
  const bridge=()=>window.MeuControleLocalBridge;
  let modalResolve=null;

  function ensureUi(){
    if(document.getElementById('mcOpsStyle'))return;
    const st=document.createElement('style');st.id='mcOpsStyle';st.textContent=`
      .mc-ops-toasts{position:fixed;right:18px;bottom:20px;z-index:3600;display:grid;gap:8px;pointer-events:none}
      .mc-ops-toast{min-width:230px;max-width:min(380px,calc(100vw - 28px));padding:11px 13px;border:1px solid #dce5e0;border-left:4px solid var(--primary);border-radius:12px;background:#fff;color:#31443a;box-shadow:0 12px 30px rgba(22,43,32,.16);font:700 12px/1.4 system-ui,sans-serif}
      .mc-ops-toast.info{border-left-color:#6d8796}.mc-ops-toast.warn{border-left-color:#b7812e}
      .mc-ops-confirm{position:fixed;inset:0;z-index:3650;background:rgba(17,31,24,.42);display:flex;align-items:center;justify-content:center;padding:18px}.mc-ops-confirm[hidden]{display:none!important}
      .mc-ops-card{width:min(420px,100%);padding:20px;border-radius:17px;border:1px solid #dfe6e1;background:#fff;box-shadow:0 24px 70px rgba(0,0,0,.24)}
      .mc-ops-card h3{margin:0;font-size:20px}.mc-ops-card p{margin:9px 0 17px;color:#69766f;font-size:13px;line-height:1.5}.mc-ops-actions{display:flex;justify-content:flex-end;gap:9px}.mc-ops-actions button{min-height:40px}.mc-ops-delete{background:#a53b3b!important;border-color:#a53b3b!important;color:#fff!important}
      body.mc-dark .mc-ops-toast,body.mc-dark .mc-ops-card{background:#172127;color:#e7edf1;border-color:#34434c}body.mc-dark .mc-ops-card p{color:#aebbc3}
      @media(max-width:700px){.mc-ops-toasts{left:12px;right:12px;bottom:92px}.mc-ops-toast{width:100%;max-width:none}.mc-ops-actions{display:grid;grid-template-columns:1fr 1fr}.mc-ops-actions button{width:100%}}
    `;document.head.appendChild(st);
    const stack=document.createElement('div');stack.className='mc-ops-toasts';document.body.appendChild(stack);
    const modal=document.createElement('div');modal.className='mc-ops-confirm';modal.hidden=true;modal.innerHTML=`<div class="mc-ops-card" role="dialog" aria-modal="true"><h3>Confirmar exclusão</h3><p class="mc-ops-copy"></p><div class="mc-ops-actions"><button type="button" class="ghost mc-ops-cancel">Cancelar</button><button type="button" class="mc-ops-delete">Excluir</button></div></div>`;document.body.appendChild(modal);
    modal.querySelector('.mc-ops-cancel').onclick=()=>closeConfirm(false);modal.querySelector('.mc-ops-delete').onclick=()=>closeConfirm(true);modal.addEventListener('click',e=>{if(e.target===modal)closeConfirm(false)});
  }

  function toast(text,type='ok',duration=2600){ensureUi();const stack=document.querySelector('.mc-ops-toasts');if(!stack)return;const el=document.createElement('div');el.className=`mc-ops-toast ${type}`;el.textContent=text;stack.appendChild(el);setTimeout(()=>el.remove(),duration)}
  function confirmDelete(count){ensureUi();const modal=document.querySelector('.mc-ops-confirm');return new Promise(resolve=>{modalResolve=resolve;modal.querySelector('.mc-ops-copy').textContent=count===1?'Este lançamento será excluído desta conta e a alteração será sincronizada.':`Os ${count} lançamentos serão excluídos desta conta e a alteração será sincronizada.`;modal.querySelector('.mc-ops-delete').textContent=count===1?'Excluir lançamento':`Excluir ${count} lançamentos`;modal.hidden=false})}
  function closeConfirm(result){const modal=document.querySelector('.mc-ops-confirm');if(modal)modal.hidden=true;const r=modalResolve;modalResolve=null;r?.(result)}

  async function deleteEntries(ids){
    ids=[...new Set(ids||[])].filter(Boolean);if(!ids.length)return false;
    if(!(await confirmDelete(ids.length)))return false;
    bridge()?.removeEntries?.(ids,{backupReason:ids.length===1?'Antes de excluir lançamento':`Antes de excluir ${ids.length} lançamentos em lote`});
    try{window.MeuControleUserDataScope?.saveCurrent?.()}catch{}
    toast(ids.length===1?'Exclusão realizada ✓':`${ids.length} lançamentos excluídos ✓`);
    return true;
  }

  async function syncNow(){
    const sync=window.MeuControleCloudSync;
    if(!sync?.syncNow)throw new Error('Sincronização da conta ainda está carregando.');
    await sync.syncNow();
    return{removed:0,received:0,updated:0,uploaded:0,pending:0};
  }
  async function processPending(){return true}

  ensureUi();
  window.MeuControleOps={version:'1.44',toast,confirmDelete,deleteEntries,processPending,syncNow,pendingCount:()=>0};
})();
