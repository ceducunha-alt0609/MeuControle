/* MeuControle — Motor Único de Operações V1.0
   Regra: ação local -> operação persistente -> Firebase -> confirmação.
*/
import { collection, doc, getDocs, getDoc, writeBatch, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js';

(()=>{
  if(window.MeuControleOps)return;
  const ENTRY_KEY='meu_controle_entries_v2';
  const OPS_KEY='meu_controle_operations_v1';
  const LAST_SYNC_KEY='meu_controle_last_sync_success_v018';
  const MIGRATION_KEY='meu_controle_ops_migration_v1';
  const DEVICE_KEY='meu_controle_device_id_v1';
  const bridge=()=>window.MeuControleLocalBridge;
  const cloud=()=>window.MeuControleCloud||null;
  const deviceId=()=>localStorage.getItem(DEVICE_KEY)||'unknown';
  const nativeSetItem=Storage.prototype.setItem;
  const nativeGetItem=Storage.prototype.getItem;
  let processing=false,suspendTrack=false,feedbackMuted=false,modalResolve=null,timer=null;

  const parseEntries=raw=>{try{const v=JSON.parse(raw||'[]');return Array.isArray(v)?v:[]}catch{return[]}};
  const clone=v=>JSON.parse(JSON.stringify(v));
  const clean=v=>{if(Array.isArray(v))return v.map(clean);if(v&&typeof v==='object'){const o={};for(const [k,x] of Object.entries(v)){if(k==='syncMeta'||k==='_syncTest'||x===undefined)continue;o[k]=clean(x)}return o}return v};
  const canonical=v=>JSON.stringify(clean(v),Object.keys(clean(v)||{}).sort());
  const readOps=()=>{try{const v=JSON.parse(nativeGetItem.call(localStorage,OPS_KEY)||'{}');return v&&typeof v==='object'?v:{}}catch{return{}}};
  const writeOps=ops=>nativeSetItem.call(localStorage,OPS_KEY,JSON.stringify(ops));
  const lastSync=()=>nativeGetItem.call(localStorage,LAST_SYNC_KEY)||'';
  const markSync=()=>nativeSetItem.call(localStorage,LAST_SYNC_KEY,new Date().toISOString());

  function ensureUi(){
    if(document.getElementById('mcOpsStyle'))return;
    const st=document.createElement('style');st.id='mcOpsStyle';st.textContent=`
      .mc-ops-toasts{position:fixed;right:18px;bottom:20px;z-index:3600;display:grid;gap:8px;pointer-events:none}
      .mc-ops-toast{min-width:230px;max-width:min(380px,calc(100vw - 28px));padding:11px 13px;border:1px solid #dce5e0;border-left:4px solid var(--primary);border-radius:12px;background:#fff;color:#31443a;box-shadow:0 12px 30px rgba(22,43,32,.16);font:700 12px/1.4 system-ui,sans-serif}
      .mc-ops-toast.info{border-left-color:#6d8796}.mc-ops-toast.warn{border-left-color:#b7812e}
      .mc-ops-confirm{position:fixed;inset:0;z-index:3650;background:rgba(17,31,24,.42);display:flex;align-items:center;justify-content:center;padding:18px}.mc-ops-confirm[hidden]{display:none!important}
      .mc-ops-card{width:min(420px,100%);padding:20px;border-radius:17px;border:1px solid #dfe6e1;background:#fff;box-shadow:0 24px 70px rgba(0,0,0,.24)}
      .mc-ops-card h3{margin:0;font-size:20px}.mc-ops-card p{margin:9px 0 17px;color:#69766f;font-size:13px;line-height:1.5}.mc-ops-actions{display:flex;justify-content:flex-end;gap:9px}.mc-ops-actions button{min-height:40px}.mc-ops-delete{background:#a53b3b!important;border-color:#a53b3b!important;color:#fff!important}
      @media(max-width:700px){.mc-ops-toasts{left:12px;right:12px;bottom:92px}.mc-ops-toast{width:100%;max-width:none}.mc-ops-actions{display:grid;grid-template-columns:1fr 1fr}.mc-ops-actions button{width:100%}}
    `;document.head.appendChild(st);
    const stack=document.createElement('div');stack.className='mc-ops-toasts';document.body.appendChild(stack);
    const modal=document.createElement('div');modal.className='mc-ops-confirm';modal.hidden=true;modal.innerHTML=`<div class="mc-ops-card" role="dialog" aria-modal="true"><h3>Confirmar exclusão</h3><p class="mc-ops-copy"></p><div class="mc-ops-actions"><button type="button" class="ghost mc-ops-cancel">Cancelar</button><button type="button" class="mc-ops-delete">Excluir</button></div></div>`;document.body.appendChild(modal);
    modal.querySelector('.mc-ops-cancel').onclick=()=>closeConfirm(false);modal.querySelector('.mc-ops-delete').onclick=()=>closeConfirm(true);modal.addEventListener('click',e=>{if(e.target===modal)closeConfirm(false)});
  }
  function toast(text,type='ok',duration=2600){ensureUi();const stack=document.querySelector('.mc-ops-toasts'),el=document.createElement('div');el.className=`mc-ops-toast ${type}`;el.textContent=text;stack.appendChild(el);setTimeout(()=>el.remove(),duration)}
  function confirmDelete(count){ensureUi();const modal=document.querySelector('.mc-ops-confirm');return new Promise(resolve=>{modalResolve=resolve;modal.querySelector('.mc-ops-copy').textContent=count===1?'Este lançamento será excluído deste aparelho e da nuvem.':`Os ${count} lançamentos selecionados serão excluídos deste aparelho e da nuvem.`;modal.querySelector('.mc-ops-delete').textContent=count===1?'Excluir lançamento':`Excluir ${count} lançamentos`;modal.hidden=false})}
  function closeConfirm(result){const modal=document.querySelector('.mc-ops-confirm');if(modal)modal.hidden=true;const r=modalResolve;modalResolve=null;r?.(result)}

  function queueOp(entryId,type,payload=null){
    if(!entryId)return;const ops=readOps();ops[entryId]={entryId,type,payload:type==='upsert'?clone(payload):null,createdAt:new Date().toISOString(),deviceId:deviceId()};writeOps(ops);scheduleProcess();
  }
  function recordDiff(before,after){
    const bm=new Map(before.filter(e=>e?.id).map(e=>[e.id,e])),am=new Map(after.filter(e=>e?.id).map(e=>[e.id,e]));
    const deletes=[],creates=[],updates=[];
    for(const [id,e] of bm)if(!am.has(id)){queueOp(id,'delete');deletes.push(id)}
    for(const [id,e] of am){if(!bm.has(id)){queueOp(id,'upsert',e);creates.push(id)}else if(canonical(bm.get(id))!==canonical(e)){queueOp(id,'upsert',e);updates.push(id)}}
    if(feedbackMuted)return;
    if(deletes.length)toast(deletes.length===1?'Exclusão realizada ✓':`${deletes.length} lançamentos excluídos ✓`);
    else if(creates.length)toast(creates.length===1?'Lançamento salvo ✓':`${creates.length} lançamentos salvos ✓`);
    else if(updates.length)toast(updates.length===1?'Alteração salva ✓':`${updates.length} alterações salvas ✓`);
  }

  const originalSetItem=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){
    if(this!==localStorage||key!==ENTRY_KEY||suspendTrack)return originalSetItem.call(this,key,value);
    const before=parseEntries(nativeGetItem.call(localStorage,ENTRY_KEY));originalSetItem.call(this,key,value);const after=parseEntries(value);recordDiff(before,after);
  };

  function scheduleProcess(){clearTimeout(timer);timer=setTimeout(()=>processPending({showFeedback:true}),180)}
  async function verifyOps(c,u,ops){
    const confirmed=[];
    for(const op of ops){
      const [entry,tomb]=await Promise.all([getDoc(doc(c.db,'users',u.uid,'entries',op.entryId)),getDoc(doc(c.db,'users',u.uid,'entryTombstones',op.entryId))]);
      if(op.type==='delete'&&!entry.exists()&&tomb.exists())confirmed.push(op.entryId);
      if(op.type==='upsert'&&entry.exists()&&!tomb.exists())confirmed.push(op.entryId);
    }
    return confirmed;
  }
  async function processPending({showFeedback=true}={}){
    if(processing)return false;const map=readOps(),ops=Object.values(map);if(!ops.length)return true;
    const c=cloud(),u=c?.currentUser?.();if(!c?.db||!u){if(showFeedback)toast('Operação salva neste aparelho · sincronização pendente','info',3200);return false}
    processing=true;
    try{
      const current=new Map((bridge()?.getEntries?.()||parseEntries(nativeGetItem.call(localStorage,ENTRY_KEY))).filter(e=>e?.id).map(e=>[e.id,e]));
      const batch=writeBatch(c.db),attempt=[];const at=new Date().toISOString();
      for(const op of ops){
        if(op.type==='delete'){
          batch.delete(doc(c.db,'users',u.uid,'entries',op.entryId));
          batch.set(doc(c.db,'users',u.uid,'entryTombstones',op.entryId),{entryId:op.entryId,deletedAt:serverTimestamp(),sourceDeviceId:deviceId(),mode:'operations-v1'});attempt.push(op);
        }else{
          const payload=op.payload||current.get(op.entryId);if(!payload)continue;
          batch.set(doc(c.db,'users',u.uid,'entries',op.entryId),{...clean(payload),syncMeta:{mode:'operations-v1',sourceDeviceId:deviceId(),uploadedAt:at,deletedAt:null}});
          batch.delete(doc(c.db,'users',u.uid,'entryTombstones',op.entryId));attempt.push(op);
        }
      }
      if(attempt.length)await batch.commit();
      const confirmed=await verifyOps(c,u,attempt),fresh=readOps();for(const id of confirmed)delete fresh[id];writeOps(fresh);
      if(confirmed.length===attempt.length){markSync();if(showFeedback)toast('Sincronizado com a nuvem ✓');return true}
      if(showFeedback)toast('Operação salva · confirmação da nuvem pendente','warn',3400);return false;
    }catch(e){console.warn('[MeuControle Ops]',e);if(showFeedback)toast('Operação salva neste aparelho · sincronização pendente','warn',3400);return false}finally{processing=false}
  }

  async function legacyRepair(c,u,remoteAll,tombIds){
    if(nativeGetItem.call(localStorage,MIGRATION_KEY)==='done')return{remoteAll,tombIds};
    const last=Date.parse(lastSync()||'');if(!Number.isFinite(last)){nativeSetItem.call(localStorage,MIGRATION_KEY,'done');return{remoteAll,tombIds}}
    const localIds=new Set((bridge()?.getEntries?.()||[]).map(e=>e.id)),toDelete=[];
    for(const e of remoteAll){if(localIds.has(e.id)||tombIds.has(e.id))continue;const uploaded=Date.parse(e.syncMeta?.uploadedAt||'');if(Number.isFinite(uploaded)&&uploaded<=last)toDelete.push(e.id)}
    if(toDelete.length){const batch=writeBatch(c.db),at=new Date().toISOString();for(const id of toDelete){batch.delete(doc(c.db,'users',u.uid,'entries',id));batch.set(doc(c.db,'users',u.uid,'entryTombstones',id),{entryId:id,deletedAt:serverTimestamp(),sourceDeviceId:deviceId(),mode:'operations-v1-migration'})}await batch.commit();toDelete.forEach(id=>tombIds.add(id));remoteAll=remoteAll.filter(e=>!toDelete.includes(e.id))}
    nativeSetItem.call(localStorage,MIGRATION_KEY,'done');return{remoteAll,tombIds};
  }

  async function syncNow(){
    const c=cloud(),u=c?.currentUser?.();if(!c?.db||!u)throw new Error('Entre com Google antes de sincronizar.');
    await processPending({showFeedback:false});
    const [entrySnap,tombSnap]=await Promise.all([getDocs(collection(c.db,'users',u.uid,'entries')),getDocs(collection(c.db,'users',u.uid,'entryTombstones'))]);
    let remoteAll=entrySnap.docs.map(d=>({...d.data(),id:d.id})),tombIds=new Set(tombSnap.docs.map(d=>d.id));
    ({remoteAll,tombIds}=await legacyRepair(c,u,remoteAll,tombIds));
    let local=bridge()?.getEntries?.()||parseEntries(nativeGetItem.call(localStorage,ENTRY_KEY));
    const localMap=new Map(local.filter(e=>e?.id).map(e=>[e.id,e])),remoteMap=new Map(remoteAll.filter(e=>e?.id&&!tombIds.has(e.id)).map(e=>[e.id,e]));
    let removed=0,received=0,uploaded=0;
    for(const id of tombIds)if(localMap.has(id)){localMap.delete(id);removed++}
    for(const [id,re] of remoteMap)if(!localMap.has(id)){localMap.set(id,clean(re));received++}
    const localOnly=[...localMap.values()].filter(e=>!remoteMap.has(e.id)&&!tombIds.has(e.id));
    if(localOnly.length){const batch=writeBatch(c.db),at=new Date().toISOString();for(const e of localOnly){batch.set(doc(c.db,'users',u.uid,'entries',e.id),{...clean(e),syncMeta:{mode:'operations-v1-reconcile',sourceDeviceId:deviceId(),uploadedAt:at,deletedAt:null}});batch.delete(doc(c.db,'users',u.uid,'entryTombstones',e.id));uploaded++}await batch.commit()}
    if(removed||received){feedbackMuted=true;suspendTrack=true;try{bridge()?.replaceEntries?.([...localMap.values()],{render:true,backupReason:'Antes de aplicar sincronização da nuvem'})}finally{suspendTrack=false;feedbackMuted=false}}
    markSync();return{removed,received,uploaded,pending:Object.keys(readOps()).length};
  }

  async function deleteEntries(ids){ids=[...new Set(ids||[])].filter(Boolean);if(!ids.length)return false;if(!(await confirmDelete(ids.length)))return false;feedbackMuted=true;try{bridge()?.removeEntries?.(ids,{backupReason:ids.length===1?'Antes de excluir lançamento':`Antes de excluir ${ids.length} lançamentos em lote`})}finally{feedbackMuted=false}toast(ids.length===1?'Exclusão realizada ✓':`${ids.length} lançamentos excluídos ✓`);return true}

  ensureUi();window.addEventListener('online',()=>processPending({showFeedback:true}));window.addEventListener('focus',()=>processPending({showFeedback:false}));window.addEventListener('meucontrole:auth-changed',()=>setTimeout(()=>processPending({showFeedback:false}),350));setTimeout(()=>processPending({showFeedback:false}),1000);
  window.MeuControleOps={version:'1.0',toast,confirmDelete,deleteEntries,processPending,syncNow,pendingCount:()=>Object.keys(readOps()).length};
})();
