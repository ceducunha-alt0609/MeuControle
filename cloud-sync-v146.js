/* MeuControle — V1.46: bootstrap silencioso + conflito local-first + eventos remotos reais */
(()=>{
  if(window.__mcCloudSyncV146)return;window.__mcCloudSyncV146=true;window.__mcCloudSyncV145=true;window.__mcCloudSyncV144=true;
  const VERSION='1.46',META_PREFIX='meu_controle_cloud_sync_meta_v1:';
  const TRACKED=new Set(['meu_controle_entries_v2','meu_controle_profiles_v2','meu_controle_profile_filter_v2']);
  let uid=null,unsub=null,pollTimer=null,pushTimer=null,bootTimer=null,bootRun=0,applyingRemote=false,lastHash='',status='idle',lastError='',localDirty=false,bootstrapComplete=false;
  let renderedKey='',renderedBox=null;
  const clone=v=>JSON.parse(JSON.stringify(v));
  const stable=v=>JSON.stringify({entries:v?.entries||[],profiles:v?.profiles||[],profileFilter:v?.profileFilter||'all'});
  const entriesStable=v=>JSON.stringify(v?.entries||[]);
  function hashText(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16)}
  const workspaceHash=w=>hashText(stable(w||{}));
  const entriesHash=w=>hashText(entriesStable(w||{}));
  const isEmpty=w=>!(w?.entries?.length);
  const scope=()=>window.MeuControleUserDataScope;
  const cloud=()=>window.MeuControleCloud?.workspace;
  const session=()=>window.MeuControleUserSession?.get?.()||null;
  const deviceId=()=>window.MeuControleCloud?.deviceId?.()||localStorage.getItem('meu_controle_device_id_v1')||'';
  const metaKey=id=>META_PREFIX+id;
  function readMeta(id){try{return JSON.parse(localStorage.getItem(metaKey(id))||'{}')}catch{return{}}}
  function writeMeta(id,next){try{localStorage.setItem(metaKey(id),JSON.stringify({...readMeta(id),...next}))}catch{}}
  function currentWorkspace(){try{return scope()?.exportCurrent?.()||null}catch{return null}}

  function installStyle(){if(document.getElementById('mcCloudSyncV146Style'))return;const st=document.createElement('style');st.id='mcCloudSyncV146Style';st.textContent=`.mc-cloud-sync-v143{margin-top:10px;padding:10px 11px;border:1px solid #dfe7e2;border-radius:11px;background:#f8fbfa}.mc-cloud-sync-row-v143{display:flex;align-items:center;justify-content:space-between;gap:12px}.mc-cloud-sync-copy-v143 strong{display:block;font-size:11px;color:var(--text)}.mc-cloud-sync-copy-v143 span{display:block;margin-top:3px;font-size:10px;line-height:1.4;color:#718078}.mc-cloud-sync-badge-v143{padding:5px 8px;border-radius:999px;background:#eef3f0;color:#607068;font:800 9px system-ui,sans-serif;white-space:nowrap}.mc-cloud-sync-badge-v143.ok{background:#e9f6ef;color:#2d7651}.mc-cloud-sync-badge-v143.busy{background:#edf5fa;color:#315f79}.mc-cloud-sync-badge-v143.error{background:#fff0ed;color:#a23e36}.mc-cloud-sync-actions-v143{display:flex;gap:7px;margin-top:9px}.mc-cloud-sync-actions-v143 button{min-height:34px!important;padding:6px 10px!important;font-size:10px!important}.mc-cloud-sync-detail-v143{display:none;margin-top:8px;padding:8px 9px;border-radius:9px;background:#fff6dc;color:#765e14;font-size:10px;line-height:1.45}.mc-cloud-sync-detail-v143.show{display:block}body.mc-dark .mc-cloud-sync-v143{background:#1b262d;border-color:#314049}body.mc-dark .mc-cloud-sync-copy-v143 span{color:#9eabb3}body.mc-dark .mc-cloud-sync-badge-v143{background:#26343c;color:#c7d2d8}body.mc-dark .mc-cloud-sync-badge-v143.ok{background:#20382f;color:#aee0c5}body.mc-dark .mc-cloud-sync-badge-v143.busy{background:#203747;color:#b8dff7}body.mc-dark .mc-cloud-sync-badge-v143.error{background:#432b2c;color:#ffb8b1}body.mc-dark .mc-cloud-sync-detail-v143{background:#3b3520;color:#f1da87}@media(max-width:700px){.mc-cloud-sync-row-v143{align-items:flex-start}.mc-cloud-sync-actions-v143{display:grid;grid-template-columns:1fr}.mc-cloud-sync-actions-v143 button{width:100%}}`;document.head.appendChild(st)}
  function ensureUI(){installStyle();const host=document.querySelector('.mc-user-session-v141');if(!host)return null;let box=host.querySelector('.mc-cloud-sync-v143');if(box)return box;box=document.createElement('section');box.className='mc-cloud-sync-v143';box.innerHTML='<div class="mc-cloud-sync-row-v143"><div class="mc-cloud-sync-copy-v143"><strong>Sincronização na nuvem</strong><span>Preparando Firestore…</span></div><span class="mc-cloud-sync-badge-v143">Aguardando</span></div><div class="mc-cloud-sync-actions-v143"><button type="button" class="secondary-action mc-cloud-sync-now-v143">Sincronizar agora</button></div><div class="mc-cloud-sync-detail-v143"></div>';host.appendChild(box);box.querySelector('.mc-cloud-sync-now-v143').onclick=()=>manualSync();renderedKey='';renderedBox=null;return box}
  function setStatus(next,text='',detail=''){status=next;lastError=detail||'';const map={idle:['Aguardando',''],loading:['Conectando','busy'],uploading:['Enviando…','busy'],downloading:['Recebendo…','busy'],synced:['Sincronizado ✓','ok'],offline:['Offline',''],error:['Atenção','error']};const[label,cls]=map[next]||map.idle;const copyText=text||({synced:'Seus dados desta conta estão sincronizados.',offline:'Sem internet; o app continua funcionando localmente.',error:'A sincronização precisa de atenção.'}[next]||'Preparando sincronização…');const detailText=detail||'';const box=ensureUI();if(!box)return;const key=[next,label,cls,copyText,detailText].join('|');if(renderedBox===box&&renderedKey===key)return;renderedBox=box;renderedKey=key;const badge=box.querySelector('.mc-cloud-sync-badge-v143'),copy=box.querySelector('.mc-cloud-sync-copy-v143 span'),d=box.querySelector('.mc-cloud-sync-detail-v143');badge.className='mc-cloud-sync-badge-v143'+(cls?' '+cls:'');badge.textContent=label;copy.textContent=copyText;d.textContent=detailText;d.classList.toggle('show',!!detailText)}
  function errorMessage(e){const code=e?.code||'';if(code.includes('permission-denied'))return'O Firestore recusou o acesso. Seus dados locais continuam preservados.';if(code.includes('unavailable')||!navigator.onLine)return'Firestore indisponível no momento. Seus dados locais continuam funcionando.';return`Falha na sincronização${code?` (${code})`:''}. Os dados locais foram preservados.`}
  function clearRuntime({invalidate=false}={}){if(invalidate)bootRun++;if(unsub){try{unsub()}catch{}unsub=null}clearInterval(pollTimer);pollTimer=null;clearTimeout(pushTimer);pushTimer=null;clearTimeout(bootTimer);bootTimer=null;applyingRemote=false;bootstrapComplete=false}
  function scheduleBootstrap(delay=250){clearTimeout(bootTimer);const planned=++bootRun;bootTimer=setTimeout(()=>bootstrap(planned),delay)}
  function markLocalDirty(reason='alteração local'){if(applyingRemote||!uid)return;localDirty=true;writeMeta(uid,{lastLocalChangeAt:new Date().toISOString()});scope()?.saveCurrent?.();scheduleUpload(reason)}

  const nativeSetItem=Storage.prototype.setItem;
  if(!window.__mcCloudSyncStorageHookV146){window.__mcCloudSyncStorageHookV146=true;Storage.prototype.setItem=function(key,value){const r=nativeSetItem.call(this,key,value);if(this===localStorage&&TRACKED.has(String(key))&&!applyingRemote)queueMicrotask(()=>markLocalDirty());return r}}

  async function upload(reason='alteração local',run=bootRun){if(run!==bootRun||!uid||applyingRemote||!cloud())return;const w=currentWorkspace();if(!w)return;const h=workspaceHash(w),uploadHash=h;lastHash=h;setStatus('uploading',`Salvando ${reason}…`);try{const clientUpdatedAt=new Date().toISOString();await cloud().set(uid,{schema:1,clientUpdatedAt,workspace:clone(w)});if(run!==bootRun)return;const currentHash=workspaceHash(currentWorkspace());writeMeta(uid,{lastCloudHash:uploadHash,lastUploadAt:clientUpdatedAt,lastLocalChangeAt:clientUpdatedAt});if(currentHash===uploadHash){localDirty=false;lastHash=uploadHash;setStatus('synced')}else{localDirty=true;lastHash=uploadHash;scheduleUpload('alteração local mais recente')}}catch(e){if(run!==bootRun)return;setStatus(navigator.onLine?'error':'offline','',errorMessage(e))}}
  function scheduleUpload(reason='alteração local'){clearTimeout(pushTimer);const run=bootRun;pushTimer=setTimeout(()=>upload(reason,run),350)}

  function applyMetaOnly(w){
    const profiles=Array.isArray(w?.profiles)&&w.profiles.length?w.profiles:null;
    const filter=w?.profileFilter||'all';
    applyingRemote=true;
    try{
      if(profiles)localStorage.setItem('meu_controle_profiles_v2',JSON.stringify(profiles));
      localStorage.setItem('meu_controle_profile_filter_v2',filter);
      try{if(profiles)window.profiles=clone(profiles)}catch{}
      try{window.activeProfile=filter}catch{}
      try{if(typeof renderProfileSelectors==='function')renderProfileSelectors()}catch{}
      try{if(typeof renderProfilesList==='function')renderProfilesList()}catch{}
      scope()?.saveCurrent?.();
    }finally{applyingRemote=false}
  }

  async function applyRemote(remote,run=bootRun,{notify=true}={}){
    if(run!==bootRun||!uid||!remote?.workspace||applyingRemote)return;
    const w=remote.workspace,h=workspaceHash(w),local=currentWorkspace(),lh=workspaceHash(local);
    if(h===lh){lastHash=h;localDirty=false;writeMeta(uid,{lastCloudHash:h});if(status!=='synced')setStatus('synced');return}
    if(localDirty||lh!==lastHash){scheduleUpload('alteração local pendente');return}
    const sameEntries=entriesHash(w)===entriesHash(local);
    if(sameEntries){
      applyMetaOnly(w);const nh=workspaceHash(currentWorkspace());lastHash=nh;localDirty=false;writeMeta(uid,{lastCloudHash:h,lastRemoteAt:remote.clientUpdatedAt||new Date().toISOString()});setStatus('synced');return;
    }
    applyingRemote=true;clearTimeout(pushTimer);setStatus('downloading','Atualizando este dispositivo com os dados da sua conta…');
    try{const ok=scope()?.importCurrent?.(w,{reload:false});if(ok===false)throw new Error('workspace-not-active');if(run!==bootRun)return;lastHash=h;localDirty=false;writeMeta(uid,{lastCloudHash:h,lastRemoteAt:remote.clientUpdatedAt||new Date().toISOString(),lastLocalChangeAt:remote.clientUpdatedAt||new Date().toISOString()});setStatus('synced');if(notify&&bootstrapComplete&&remote.sourceDeviceId&&remote.sourceDeviceId!==deviceId())window.dispatchEvent(new CustomEvent('meucontrole:remote-workspace-applied',{detail:{uid,sourceDeviceId:remote.sourceDeviceId,at:remote.clientUpdatedAt||new Date().toISOString()}}))}catch(e){if(run===bootRun)setStatus('error','',errorMessage(e))}finally{if(run===bootRun)setTimeout(()=>{applyingRemote=false;lastHash=workspaceHash(currentWorkspace())},0)}
  }

  async function bootstrap(run){
    if(run!==bootRun)return;const s=session(),active=scope()?.activeUid?.();if(!s?.signedIn||!s.uid||active!==s.uid||!cloud()){uid=null;setStatus('idle','Entre com sua conta para sincronizar.');return}if(uid===s.uid&&unsub)return;
    clearRuntime();if(run!==bootRun)return;uid=s.uid;localDirty=false;bootstrapComplete=false;setStatus('loading','Comparando este dispositivo com a nuvem…');
    try{
      const local=currentWorkspace(),remote=await cloud().get(uid);if(run!==bootRun)return;
      if(!remote){await upload('primeira cópia desta conta',run)}else{
        const lh=workspaceHash(local),rh=workspaceHash(remote.workspace||{}),meta=readMeta(uid);lastHash=meta.lastCloudHash||lh;
        if(lh===rh){lastHash=lh;localDirty=false;writeMeta(uid,{lastCloudHash:rh});setStatus('synced')}
        else if(entriesHash(local)===entriesHash(remote.workspace||{})){
          if(meta.lastCloudHash===rh){localDirty=true;await upload('ajustes locais desta conta',run)}
          else await applyRemote(remote,run,{notify:false});
        }
        else if(isEmpty(local)&&!isEmpty(remote.workspace)){await applyRemote(remote,run,{notify:false})}
        else if(!isEmpty(local)&&isEmpty(remote.workspace)){localDirty=true;await upload('dados locais desta conta',run)}
        else if(meta.lastCloudHash===lh){await applyRemote(remote,run,{notify:false})}
        else if(meta.lastCloudHash===rh){localDirty=true;await upload('alterações locais pendentes',run)}
        else{const remoteTime=Date.parse(remote.clientUpdatedAt||0)||0,localTime=Date.parse(meta.lastLocalChangeAt||0)||0;if(localTime&&localTime>=remoteTime){localDirty=true;await upload('versão local mais recente',run)}else await applyRemote(remote,run,{notify:false})}
      }
      if(run!==bootRun||!uid)return;bootstrapComplete=true;
      window.dispatchEvent(new CustomEvent('meucontrole:cloud-bootstrap-complete',{detail:{uid}}));
      unsub=cloud().watch(uid,remote=>{if(run!==bootRun||!remote?.workspace||applyingRemote)return;const rh=workspaceHash(remote.workspace),lh=workspaceHash(currentWorkspace());if(rh===lh){lastHash=rh;localDirty=false;writeMeta(uid,{lastCloudHash:rh});if(status!=='synced')setStatus('synced');return}if(localDirty||lh!==lastHash){localDirty=true;scheduleUpload('alteração local pendente');return}applyRemote(remote,run,{notify:true})},e=>{if(run===bootRun)setStatus(navigator.onLine?'error':'offline','',errorMessage(e))});
      startPolling(run);
    }catch(e){if(run!==bootRun)return;setStatus(navigator.onLine?'error':'offline','',errorMessage(e));bootstrapComplete=true;startPolling(run)}
  }
  function startPolling(run){clearInterval(pollTimer);lastHash=workspaceHash(currentWorkspace());pollTimer=setInterval(()=>{if(run!==bootRun||!uid||applyingRemote)return;const h=workspaceHash(currentWorkspace());if(h!==lastHash){localDirty=true;writeMeta(uid,{lastLocalChangeAt:new Date().toISOString()});scheduleUpload()}},1200)}
  async function manualSync(){if(!navigator.onLine){setStatus('offline');return}clearRuntime({invalidate:true});uid=null;const run=bootRun;await bootstrap(run)}
  window.addEventListener('meucontrole:user-session-changed',()=>scheduleBootstrap(280));window.addEventListener('meucontrole:user-data-ready',()=>scheduleBootstrap(180));window.addEventListener('online',()=>scheduleBootstrap(120));window.addEventListener('offline',()=>setStatus('offline'));window.addEventListener('pagehide',()=>{if(uid)scope()?.saveCurrent?.()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{ensureUI();scheduleBootstrap(550)},{once:true});else{ensureUI();scheduleBootstrap(550)}
  window.MeuControleCloudSync={version:VERSION,status:()=>status,error:()=>lastError,syncNow:manualSync};
})();