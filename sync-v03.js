/* MeuControle — Sincronização V0.3: espelho controlado de um lançamento real */
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js';

(()=>{
  if(window.__meuControleSyncV03Loaded)return;
  window.__meuControleSyncV03Loaded=true;

  const ENTRIES_KEY='meu_controle_entries_v2';
  const DEVICE_KEY='meu_controle_device_id_v1';
  const TEST_VERSION='0.3';

  function localEntries(){
    try{const v=JSON.parse(localStorage.getItem(ENTRIES_KEY)||'[]');return Array.isArray(v)?v:[]}catch{return[]}
  }
  function deviceId(){return localStorage.getItem(DEVICE_KEY)||window.MeuControleSync?.deviceId||'unknown'}
  function cloud(){return window.MeuControleCloud||null}
  function parent(){return document.querySelector('#settingsPage .firebase-sync-box')}
  function fmtMoney(v){return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
  function fmtEntry(e){
    if(!e)return '—';
    const parts=[e.description||'(sem descrição)',e.date||'',e.type==='despesa'?fmtMoney(e.value):''].filter(Boolean);
    return parts.join(' • ');
  }
  function clean(value){
    if(Array.isArray(value))return value.map(clean);
    if(value&&typeof value==='object'){
      const out={};
      Object.entries(value).forEach(([k,v])=>{if(v!==undefined)out[k]=clean(v)});
      return out;
    }
    return value;
  }
  function baseEntry(e){
    const copy=clean(JSON.parse(JSON.stringify(e)));
    delete copy.syncMeta;
    delete copy._syncTest;
    return copy;
  }
  function sameEntry(a,b){return JSON.stringify(baseEntry(a))===JSON.stringify(baseEntry(b))}

  function ensure(){
    const root=parent();if(!root)return null;
    let box=root.querySelector('.sync-v03-box');if(box){refreshSelect(box);return box}

    const style=document.createElement('style');
    style.textContent=`
      .sync-v03-box{margin-top:10px;padding:12px;border:1px solid #dfe8e4;border-radius:12px;background:#fbfcfb}
      .sync-v03-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:7px}
      .sync-v03-head strong{font-size:12px;color:var(--text)}
      .sync-v03-pill{padding:4px 7px;border-radius:999px;background:#edf5fa;color:#164f78;font-size:9px;font-weight:800;white-space:nowrap}
      .sync-v03-text{margin:0!important;font-size:10px!important;line-height:1.45!important;color:#6e7973!important}
      .sync-v03-select{width:100%;margin-top:9px;min-height:38px;border:1px solid #d8e1dd;border-radius:9px;background:#fff;padding:7px 9px;color:var(--text)}
      .sync-v03-actions{display:grid;grid-template-columns:1fr;gap:7px;margin-top:8px}
      .sync-v03-actions button{width:100%;min-height:36px}
      .sync-v03-result{display:none;margin-top:9px;padding:9px 10px;border-radius:10px;font-size:10px;line-height:1.45;overflow-wrap:anywhere}
      .sync-v03-result.show{display:block}.sync-v03-result.ok{background:#eef7f0;color:#386245}.sync-v03-result.warn{background:#fff5e8;color:#875d22}.sync-v03-result.info{background:#edf5fa;color:#164f78}
      .sync-v03-cloud{margin-top:8px;padding:8px 9px;border-radius:9px;background:#f5f7f6;font-size:10px;color:#56645d;line-height:1.4}
    `;
    document.head.appendChild(style);

    box=document.createElement('div');box.className='sync-v03-box';
    box.innerHTML=`
      <div class="sync-v03-head"><strong>Espelho controlado de um lançamento real</strong><span class="sync-v03-pill">V0.3</span></div>
      <p class="sync-v03-text">Escolha um único lançamento local. O MeuControle envia uma cópia para a coleção real de sincronização, lê de volta para conferir a integridade e mantém o lançamento local intacto. A cópia fica na nuvem apenas para testarmos PC ↔ celular e pode ser removida aqui.</p>
      <select class="sync-v03-select"></select>
      <div class="sync-v03-actions">
        <button type="button" class="secondary-action sync-v03-send">Enviar cópia controlada</button>
        <button type="button" class="secondary-action sync-v03-read">Ler cópia da nuvem</button>
        <button type="button" class="secondary-action sync-v03-delete">Remover cópia de teste</button>
      </div>
      <div class="sync-v03-cloud">Nuvem ainda não consultada nesta tela.</div>
      <div class="sync-v03-result"></div>`;
    root.appendChild(box);
    box.querySelector('.sync-v03-send').addEventListener('click',sendSelected);
    box.querySelector('.sync-v03-read').addEventListener('click',readCloudCopy);
    box.querySelector('.sync-v03-delete').addEventListener('click',deleteCloudCopy);
    refreshSelect(box);
    return box;
  }

  function refreshSelect(box=ensure()){
    if(!box)return;
    const select=box.querySelector('.sync-v03-select');
    const current=select.value;
    const entries=localEntries().slice().sort((a,b)=>(a.date||'').localeCompare(b.date||'')||(a.description||'').localeCompare(b.description||''));
    select.innerHTML='';
    if(!entries.length){select.innerHTML='<option value="">Nenhum lançamento local</option>';return}
    entries.forEach(e=>{
      const o=document.createElement('option');o.value=e.id||'';o.textContent=fmtEntry(e);select.appendChild(o);
    });
    if(current&&entries.some(e=>e.id===current))select.value=current;
  }

  function status(type,text){
    const box=ensure();if(!box)return;
    const el=box.querySelector('.sync-v03-result');el.className=`sync-v03-result show ${type}`;el.textContent=text;
  }
  function cloudLine(text){const box=ensure();if(box)box.querySelector('.sync-v03-cloud').textContent=text}
  function selectedEntry(){const box=ensure();const id=box?.querySelector('.sync-v03-select')?.value;return localEntries().find(e=>e.id===id)||null}
  function entryRef(c,user,id){return doc(c.db,'users',user.uid,'entries',id)}

  async function sendSelected(){
    const c=cloud(),user=c?.currentUser?.(),entry=selectedEntry();
    if(!c?.db||!user){status('warn','Entre com Google antes de enviar a cópia.');return}
    if(!entry?.id){status('warn','Escolha um lançamento válido.');return}
    const ref=entryRef(c,user,entry.id);
    try{
      status('info','Conferindo se já existe algo com este ID na nuvem...');
      const existing=await getDoc(ref);
      if(existing.exists()&&existing.data()?._syncTest!==TEST_VERSION){
        status('warn','Já existe um documento real na nuvem com este ID. O teste foi interrompido para não sobrescrever nada.');return;
      }
      const payload={...baseEntry(entry),_syncTest:TEST_VERSION,syncMeta:{mode:'controlled-copy',sourceDeviceId:deviceId(),uploadedAt:new Date().toISOString(),localUpdatedAt:entry.updatedAt||null,deletedAt:null}};
      await setDoc(ref,payload);
      const snap=await getDoc(ref);
      if(!snap.exists()||!sameEntry(entry,snap.data()))throw new Error('A cópia voltou diferente do lançamento local.');
      cloudLine(`Cópia presente na nuvem: ${fmtEntry(snap.data())}`);
      status('ok','Cópia aprovada ✓ O lançamento real foi enviado e lido de volta sem alterar a base local. A cópia ficou na nuvem para o teste com o outro aparelho.');
    }catch(e){status('warn',`Não foi possível concluir o espelho controlado${e?.code?` (${e.code})`:''}. ${e?.message||''}`.trim())}
  }

  async function findTestDocs(){
    const c=cloud(),user=c?.currentUser?.();if(!c?.db||!user)return [];
    const snap=await getDocs(collection(c.db,'users',user.uid,'entries'));
    return snap.docs.map(d=>({id:d.id,data:d.data()})).filter(x=>x.data?._syncTest===TEST_VERSION);
  }

  async function readCloudCopy(){
    const c=cloud(),user=c?.currentUser?.();if(!c?.db||!user){status('warn','Entre com Google antes de consultar a nuvem.');return}
    try{
      status('info','Lendo a coleção de lançamentos do seu usuário...');
      const docs=await findTestDocs();
      if(!docs.length){cloudLine('Nenhuma cópia V0.3 encontrada na nuvem.');status('warn','Nenhuma cópia controlada V0.3 foi encontrada.');return}
      const x=docs[0];cloudLine(`Encontrada na nuvem: ${fmtEntry(x.data)} • origem ${x.data?.syncMeta?.sourceDeviceId||'desconhecida'}`);
      const local=localEntries().find(e=>e.id===x.id);
      if(local&&sameEntry(local,x.data))status('ok','Leitura aprovada ✓ A cópia da nuvem é idêntica ao lançamento local deste aparelho.');
      else if(local)status('warn','A cópia foi encontrada, mas difere da versão local deste aparelho. Nada foi alterado.');
      else status('ok','Leitura entre dispositivos aprovada ✓ A cópia existe na nuvem, mesmo sem este lançamento estar na base local deste aparelho. Nenhum dado local foi importado automaticamente.');
    }catch(e){status('warn',`Falha ao ler a cópia da nuvem${e?.code?` (${e.code})`:''}. ${e?.message||''}`.trim())}
  }

  async function deleteCloudCopy(){
    const c=cloud(),user=c?.currentUser?.();if(!c?.db||!user){status('warn','Entre com Google antes de remover a cópia.');return}
    try{
      const docs=await findTestDocs();
      if(!docs.length){cloudLine('Nenhuma cópia V0.3 encontrada na nuvem.');status('info','Não havia cópia de teste para remover.');return}
      for(const x of docs)await deleteDoc(entryRef(c,user,x.id));
      cloudLine('Nenhuma cópia V0.3 presente na nuvem.');
      status('ok',`Cópia de teste removida ✓ ${docs.length} documento${docs.length===1?'':'s'} apagado${docs.length===1?'':'s'} da nuvem; a base local permaneceu intacta.`);
    }catch(e){status('warn',`Não foi possível remover a cópia${e?.code?` (${e.code})`:''}. ${e?.message||''}`.trim())}
  }

  window.MeuControleSyncV03={version:TEST_VERSION,sendSelected,readCloudCopy,deleteCloudCopy,safe:true,automatic:false};
  window.addEventListener('meucontrole:firebase-ready',()=>setTimeout(ensure,100));
  window.addEventListener('meucontrole:auth-changed',()=>setTimeout(ensure,100));
  window.addEventListener('storage',e=>{if(e.key===ENTRIES_KEY)setTimeout(()=>refreshSelect(),50)});
  document.addEventListener('click',e=>{if(e.target.closest('[data-settings-detail="data"]')||e.target.closest('.mobile-settings-back'))setTimeout(ensure,100)});
  window.addEventListener('load',()=>{setTimeout(ensure,450);setTimeout(ensure,1000)});
})();
