/* MeuControle — V0.50: feedback visual + sincronização automática de inclusões/exclusões */
import { collection, doc, getDocs, writeBatch, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js';

(()=>{
  if(window.__mcMutationSyncV050)return;window.__mcMutationSyncV050=true;
  const KEY='meu_controle_entries_v2',QUEUE_KEY='meu_controle_mutation_queue_v1',DEVICE_KEY='meu_controle_device_id_v1';
  let processing=false,modalResolve=null;
  const cloud=()=>window.MeuControleCloud||null;
  const localEntries=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch{return[]}};
  const deviceId=()=>localStorage.getItem(DEVICE_KEY)||'unknown';
  const readQueue=()=>{try{const q=JSON.parse(localStorage.getItem(QUEUE_KEY)||'{}');return{upserts:Array.isArray(q.upserts)?q.upserts:[],deletes:Array.isArray(q.deletes)?q.deletes:[]}}catch{return{upserts:[],deletes:[]}}};
  const writeQueue=q=>localStorage.setItem(QUEUE_KEY,JSON.stringify({upserts:[...new Set(q.upserts)],deletes:[...new Set(q.deletes)]}));
  const canonical=v=>JSON.stringify(v,Object.keys(v||{}).sort());

  const style=document.createElement('style');
  style.textContent=`
    .mc-toast-stack{position:fixed;right:18px;bottom:20px;z-index:2600;display:grid;gap:8px;pointer-events:none}
    .mc-toast{min-width:220px;max-width:min(360px,calc(100vw - 28px));padding:11px 13px;border:1px solid #dce5e0;border-radius:12px;background:#fff;color:#31443a;box-shadow:0 12px 30px rgba(22,43,32,.16);font-size:12px;font-weight:700;animation:mcToastIn .2s ease-out}
    .mc-toast.ok{border-left:4px solid var(--primary)}.mc-toast.info{border-left:4px solid #6d8796}.mc-toast.warn{border-left:4px solid #b7812e}
    .mc-confirm-backdrop{position:fixed;inset:0;z-index:2700;background:rgba(17,31,24,.42);display:flex;align-items:center;justify-content:center;padding:18px}
    .mc-confirm-backdrop[hidden]{display:none!important}
    .mc-confirm-card{width:min(420px,100%);padding:20px;border-radius:17px;border:1px solid #dfe6e1;background:#fff;box-shadow:0 24px 70px rgba(0,0,0,.24)}
    .mc-confirm-card h3{margin:0;font-size:20px}.mc-confirm-card p{margin:9px 0 17px;color:#69766f;font-size:13px;line-height:1.5}.mc-confirm-actions{display:flex;justify-content:flex-end;gap:9px}.mc-confirm-actions button{min-height:40px}.mc-confirm-delete{background:#a53b3b!important;border-color:#a53b3b!important;color:#fff!important}
    @keyframes mcToastIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
    @media(max-width:700px){.mc-toast-stack{left:12px;right:12px;bottom:92px}.mc-toast{width:100%;max-width:none}.mc-confirm-card{border-radius:16px}.mc-confirm-actions{display:grid;grid-template-columns:1fr 1fr}.mc-confirm-actions button{width:100%}}
  `;document.head.appendChild(style);

  const toastStack=document.createElement('div');toastStack.className='mc-toast-stack';document.body.appendChild(toastStack);
  function toast(text,type='ok',duration=2600){const el=document.createElement('div');el.className=`mc-toast ${type}`;el.textContent=text;toastStack.appendChild(el);setTimeout(()=>{el.style.opacity='0';el.style.transform='translateY(5px)';setTimeout(()=>el.remove(),220)},duration);return el}

  const modal=document.createElement('div');modal.className='mc-confirm-backdrop';modal.hidden=true;modal.innerHTML=`<div class="mc-confirm-card" role="dialog" aria-modal="true" aria-labelledby="mcConfirmTitle"><h3 id="mcConfirmTitle">Confirmar exclusão</h3><p class="mc-confirm-copy"></p><div class="mc-confirm-actions"><button type="button" class="ghost mc-confirm-cancel">Cancelar</button><button type="button" class="mc-confirm-delete">Excluir</button></div></div>`;document.body.appendChild(modal);
  function confirmDelete(count){return new Promise(resolve=>{modalResolve=resolve;modal.querySelector('.mc-confirm-copy').textContent=count===1?'Este lançamento será excluído deste aparelho e da nuvem.':'Os lançamentos selecionados serão excluídos deste aparelho e da nuvem.';modal.querySelector('.mc-confirm-delete').textContent=count===1?'Excluir lançamento':`Excluir ${count} lançamentos`;modal.hidden=false;setTimeout(()=>modal.querySelector('.mc-confirm-delete').focus(),30)})}
  function closeModal(result){modal.hidden=true;const r=modalResolve;modalResolve=null;r?.(result)}
  modal.querySelector('.mc-confirm-cancel').onclick=()=>closeModal(false);modal.querySelector('.mc-confirm-delete').onclick=()=>closeModal(true);modal.addEventListener('click',e=>{if(e.target===modal)closeModal(false)});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeModal(false)});

  function queueMutations({upserts=[],deletes=[]}){
    const q=readQueue(),del=new Set([...q.deletes,...deletes]),ups=new Set([...q.upserts,...upserts]);
    deletes.forEach(id=>ups.delete(id));upserts.forEach(id=>del.delete(id));writeQueue({upserts:[...ups],deletes:[...del]});
    setTimeout(processQueue,80);
  }

  async function processQueue(){
    if(processing)return;const q=readQueue();if(!q.upserts.length&&!q.deletes.length)return;
    const c=cloud(),u=c?.currentUser?.();if(!c?.db||!u){toast('Alteração salva neste aparelho · sincronização pendente','info',3000);return}
    processing=true;
    try{
      const byId=new Map(localEntries().filter(e=>e?.id).map(e=>[e.id,e]));
      const batch=writeBatch(c.db),doneUpserts=[],doneDeletes=[];
      for(const id of q.upserts){const e=byId.get(id);if(!e)continue;batch.set(doc(c.db,'users',u.uid,'entries',id),{...e,syncMeta:{mode:'auto-mutation-v050',sourceDeviceId:deviceId(),uploadedAt:new Date().toISOString(),deletedAt:null}});batch.delete(doc(c.db,'users',u.uid,'entryTombstones',id));doneUpserts.push(id)}
      for(const id of q.deletes){batch.delete(doc(c.db,'users',u.uid,'entries',id));batch.set(doc(c.db,'users',u.uid,'entryTombstones',id),{entryId:id,deletedAt:serverTimestamp(),sourceDeviceId:deviceId(),mode:'auto-mutation-v050'});doneDeletes.push(id)}
      if(doneUpserts.length||doneDeletes.length)await batch.commit();
      const fresh=readQueue();writeQueue({upserts:fresh.upserts.filter(id=>!doneUpserts.includes(id)),deletes:fresh.deletes.filter(id=>!doneDeletes.includes(id))});
      toast('Sincronizado com a nuvem ✓','ok');try{window.MeuControlePush?.sync?.()}catch{}
    }catch(e){console.warn('[MeuControle mutation sync]',e);toast('Salvo neste aparelho · sincronização pendente','warn',3200)}finally{processing=false}
  }

  async function reconcileTombstones(){
    const c=cloud(),u=c?.currentUser?.();if(!c?.db||!u)return;
    try{
      const snap=await getDocs(collection(c.db,'users',u.uid,'entryTombstones'));const ids=new Set(snap.docs.map(d=>d.id));if(!ids.size)return;
      const local=localEntries(),stale=local.filter(e=>ids.has(e.id));if(!stale.length)return;
      if(typeof createAutoBackup==='function')createAutoBackup(`Antes de aplicar ${stale.length} exclusão${stale.length===1?'':'ões'} sincronizada${stale.length===1?'':'s'}`);
      entries=entries.filter(e=>!ids.has(e.id));save();renderAll();
      const q=readQueue();writeQueue({upserts:q.upserts.filter(id=>!ids.has(id)),deletes:q.deletes});
    }catch(e){console.warn('[MeuControle tombstones]',e)}
  }

  async function deleteEntries(ids){
    ids=[...new Set(ids)].filter(Boolean);if(!ids.length)return false;
    if(!(await confirmDelete(ids.length)))return false;
    if(typeof createAutoBackup==='function')createAutoBackup(ids.length===1?'Antes de excluir lançamento':`Antes de excluir ${ids.length} lançamentos em lote`);
    const remove=new Set(ids);entries=entries.filter(e=>!remove.has(e.id));save();renderAll();
    queueMutations({deletes:ids});
    toast(ids.length===1?'Exclusão realizada ✓':`${ids.length} lançamentos excluídos ✓`,'ok');
    return true;
  }

  /* Substitui a confirmação nativa da exclusão individual. */
  window.removeEntry=async id=>{await deleteEntries([id])};

  /* Depois do submit do app, detecta somente os IDs realmente criados/alterados. */
  const form=document.getElementById('entryForm');
  if(form){
    form.addEventListener('submit',()=>{
      const before=new Map(localEntries().filter(e=>e?.id).map(e=>[e.id,canonical(e)]));
      setTimeout(()=>{
        const after=localEntries(),changed=after.filter(e=>!before.has(e.id)||before.get(e.id)!==canonical(e)).map(e=>e.id);if(!changed.length)return;
        queueMutations({upserts:changed});toast(changed.length===1?'Lançamento salvo ✓':`${changed.length} lançamentos salvos ✓`,'ok');
      },0);
    },true);
  }

  window.addEventListener('online',()=>{processQueue();reconcileTombstones()});window.addEventListener('focus',()=>{processQueue();reconcileTombstones()});window.addEventListener('meucontrole:auth-changed',()=>setTimeout(()=>{reconcileTombstones();processQueue()},350));
  setTimeout(()=>{reconcileTombstones();processQueue()},1200);
  window.MeuControleMutations={version:'0.50',toast,confirmDelete,deleteEntries,queueMutations,process:processQueue,reconcile:reconcileTombstones};
})();