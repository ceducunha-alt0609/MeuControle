/* MeuControle — V0.51: mutações confirmadas no Firebase antes de limpar a fila */
import { doc, getDoc, writeBatch, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js';

(()=>{
  if(window.__mcMutationSyncV051)return;window.__mcMutationSyncV051=true;
  const KEY='meu_controle_entries_v2',QUEUE_KEY='meu_controle_mutation_queue_v1',DEVICE_KEY='meu_controle_device_id_v1';
  let processing=false,modalResolve=null;
  const cloud=()=>window.MeuControleCloud||null;
  const localEntries=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch{return[]}};
  const deviceId=()=>localStorage.getItem(DEVICE_KEY)||'unknown';
  const readQueue=()=>{try{const q=JSON.parse(localStorage.getItem(QUEUE_KEY)||'{}');return{upserts:Array.isArray(q.upserts)?q.upserts:[],deletes:Array.isArray(q.deletes)?q.deletes:[]}}catch{return{upserts:[],deletes:[]}}};
  const writeQueue=q=>localStorage.setItem(QUEUE_KEY,JSON.stringify({upserts:[...new Set(q.upserts||[])],deletes:[...new Set(q.deletes||[])]}));

  function ensureStyle(){if(document.getElementById('mcMutationV051Style'))return;const style=document.createElement('style');style.id='mcMutationV051Style';style.textContent=`
    .mc-v051-toast-stack{position:fixed;right:18px;bottom:20px;z-index:3300;display:grid;gap:8px;pointer-events:none}
    .mc-v051-toast{min-width:220px;max-width:min(360px,calc(100vw - 28px));padding:11px 13px;border:1px solid #dce5e0;border-left:4px solid var(--primary);border-radius:12px;background:#fff;color:#31443a;box-shadow:0 12px 30px rgba(22,43,32,.16);font-size:12px;font-weight:700}
    .mc-v051-toast.info{border-left-color:#6d8796}.mc-v051-toast.warn{border-left-color:#b7812e}
    .mc-v051-confirm{position:fixed;inset:0;z-index:3350;background:rgba(17,31,24,.42);display:flex;align-items:center;justify-content:center;padding:18px}.mc-v051-confirm[hidden]{display:none!important}
    .mc-v051-card{width:min(420px,100%);padding:20px;border-radius:17px;border:1px solid #dfe6e1;background:#fff;box-shadow:0 24px 70px rgba(0,0,0,.24)}
    .mc-v051-card h3{margin:0;font-size:20px}.mc-v051-card p{margin:9px 0 17px;color:#69766f;font-size:13px;line-height:1.5}.mc-v051-actions{display:flex;justify-content:flex-end;gap:9px}.mc-v051-actions button{min-height:40px}.mc-v051-delete{background:#a53b3b!important;border-color:#a53b3b!important;color:#fff!important}
    @media(max-width:700px){.mc-v051-toast-stack{left:12px;right:12px;bottom:92px}.mc-v051-toast{width:100%;max-width:none}.mc-v051-actions{display:grid;grid-template-columns:1fr 1fr}.mc-v051-actions button{width:100%}}
  `;document.head.appendChild(style)}
  ensureStyle();
  let stack=document.querySelector('.mc-v051-toast-stack');if(!stack){stack=document.createElement('div');stack.className='mc-v051-toast-stack';document.body.appendChild(stack)}
  function toast(text,type='ok',duration=2600){const el=document.createElement('div');el.className=`mc-v051-toast ${type}`;el.textContent=text;stack.appendChild(el);setTimeout(()=>el.remove(),duration);return el}

  let modal=document.querySelector('.mc-v051-confirm');if(!modal){modal=document.createElement('div');modal.className='mc-v051-confirm';modal.hidden=true;modal.innerHTML=`<div class="mc-v051-card" role="dialog" aria-modal="true"><h3>Confirmar exclusão</h3><p class="mc-v051-copy"></p><div class="mc-v051-actions"><button type="button" class="ghost mc-v051-cancel">Cancelar</button><button type="button" class="mc-v051-delete">Excluir</button></div></div>`;document.body.appendChild(modal);modal.querySelector('.mc-v051-cancel').onclick=()=>closeModal(false);modal.querySelector('.mc-v051-delete').onclick=()=>closeModal(true);modal.addEventListener('click',e=>{if(e.target===modal)closeModal(false)})}
  function confirmDelete(count){return new Promise(resolve=>{modalResolve=resolve;modal.querySelector('.mc-v051-copy').textContent=count===1?'Este lançamento será excluído deste aparelho e da nuvem.':'Os lançamentos selecionados serão excluídos deste aparelho e da nuvem.';modal.querySelector('.mc-v051-delete').textContent=count===1?'Excluir lançamento':`Excluir ${count} lançamentos`;modal.hidden=false})}
  function closeModal(result){modal.hidden=true;const r=modalResolve;modalResolve=null;r?.(result)}

  function queueMutations({upserts=[],deletes=[]}){const q=readQueue(),del=new Set([...q.deletes,...deletes]),ups=new Set([...q.upserts,...upserts]);deletes.forEach(id=>ups.delete(id));upserts.forEach(id=>del.delete(id));writeQueue({upserts:[...ups],deletes:[...del]});setTimeout(processQueue,80)}

  async function processQueue(){
    if(processing)return false;const q=readQueue();if(!q.upserts.length&&!q.deletes.length)return true;
    const c=cloud(),u=c?.currentUser?.();if(!c?.db||!u){toast('Alteração salva neste aparelho · sincronização pendente','info',3000);return false}
    processing=true;
    try{
      const byId=new Map(localEntries().filter(e=>e?.id).map(e=>[e.id,e]));
      const batch=writeBatch(c.db),attemptUp=[],attemptDel=[];
      for(const id of q.upserts){const e=byId.get(id);if(!e)continue;batch.set(doc(c.db,'users',u.uid,'entries',id),{...e,syncMeta:{mode:'auto-mutation-v051',sourceDeviceId:deviceId(),uploadedAt:new Date().toISOString(),deletedAt:null}});batch.delete(doc(c.db,'users',u.uid,'entryTombstones',id));attemptUp.push(id)}
      for(const id of q.deletes){batch.delete(doc(c.db,'users',u.uid,'entries',id));batch.set(doc(c.db,'users',u.uid,'entryTombstones',id),{entryId:id,deletedAt:serverTimestamp(),sourceDeviceId:deviceId(),mode:'auto-mutation-v051'});attemptDel.push(id)}
      if(attemptUp.length||attemptDel.length)await batch.commit();

      const confirmedUp=[],confirmedDel=[];
      for(const id of attemptUp){const [entry,tomb]=await Promise.all([getDoc(doc(c.db,'users',u.uid,'entries',id)),getDoc(doc(c.db,'users',u.uid,'entryTombstones',id))]);if(entry.exists()&&!tomb.exists())confirmedUp.push(id)}
      for(const id of attemptDel){const [entry,tomb]=await Promise.all([getDoc(doc(c.db,'users',u.uid,'entries',id)),getDoc(doc(c.db,'users',u.uid,'entryTombstones',id))]);if(!entry.exists()&&tomb.exists())confirmedDel.push(id)}

      const fresh=readQueue();writeQueue({upserts:fresh.upserts.filter(id=>!confirmedUp.includes(id)),deletes:fresh.deletes.filter(id=>!confirmedDel.includes(id))});
      if(confirmedUp.length+confirmedDel.length===attemptUp.length+attemptDel.length){toast('Sincronizado com a nuvem ✓','ok');return true}
      toast('Alteração salva · confirmação da nuvem pendente','warn',3400);return false;
    }catch(e){console.warn('[MeuControle mutation v051]',e);toast('Salvo neste aparelho · sincronização pendente','warn',3200);return false}finally{processing=false}
  }

  async function deleteEntries(ids){ids=[...new Set(ids)].filter(Boolean);if(!ids.length)return false;if(!(await confirmDelete(ids.length)))return false;if(typeof createAutoBackup==='function')createAutoBackup(ids.length===1?'Antes de excluir lançamento':`Antes de excluir ${ids.length} lançamentos em lote`);const remove=new Set(ids);entries=entries.filter(e=>!remove.has(e.id));save();renderAll();queueMutations({deletes:ids});toast(ids.length===1?'Exclusão realizada ✓':`${ids.length} lançamentos excluídos ✓`,'ok');return true}

  window.addEventListener('online',()=>processQueue());window.addEventListener('focus',()=>processQueue());window.addEventListener('meucontrole:auth-changed',()=>setTimeout(processQueue,350));setTimeout(processQueue,1200);
  window.MeuControleMutationsV051={version:'0.51',toast,confirmDelete,deleteEntries,queueMutations,process:processQueue,readQueue};
})();
