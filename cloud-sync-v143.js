/* MeuControle — V1.43.1: sincronização Firestore sem reload/eco */
(()=>{
  if(window.__mcCloudSyncV143)return;window.__mcCloudSyncV143=true;
  const VERSION='1.43.1';
  const META_PREFIX='meu_controle_cloud_sync_meta_v1:';
  let uid=null,unsub=null,pollTimer=null,pushTimer=null,applyingRemote=false,lastHash='',status='idle',lastError='';

  const clone=v=>JSON.parse(JSON.stringify(v));
  const stable=v=>JSON.stringify({entries:v?.entries||[],profiles:v?.profiles||[],profileFilter:v?.profileFilter||'all'});
  function hashText(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16)}
  const workspaceHash=w=>hashText(stable(w));
  const isEmpty=w=>!(w?.entries?.length);
  const scope=()=>window.MeuControleUserDataScope;
  const cloud=()=>window.MeuControleCloud?.workspace;
  const session=()=>window.MeuControleUserSession?.get?.()||null;
  const metaKey=id=>META_PREFIX+id;
  function readMeta(id){try{return JSON.parse(localStorage.getItem(metaKey(id))||'{}')}catch{return{}}}
  function writeMeta(id,next){try{localStorage.setItem(metaKey(id),JSON.stringify({...readMeta(id),...next}))}catch{}}
  function currentWorkspace(){try{return scope()?.exportCurrent?.()||null}catch{return null}}

  function installStyle(){if(document.getElementById('mcCloudSyncV143Style'))return;const st=document.createElement('style');st.id='mcCloudSyncV143Style';st.textContent=`
    .mc-cloud-sync-v143{margin-top:10px;padding:10px 11px;border:1px solid #dfe7e2;border-radius:11px;background:#f8fbfa}.mc-cloud-sync-row-v143{display:flex;align-items:center;justify-content:space-between;gap:12px}.mc-cloud-sync-copy-v143 strong{display:block;font-size:11px;color:var(--text)}.mc-cloud-sync-copy-v143 span{display:block;margin-top:3px;font-size:10px;line-height:1.4;color:#718078}.mc-cloud-sync-badge-v143{padding:5px 8px;border-radius:999px;background:#eef3f0;color:#607068;font:800 9px system-ui,sans-serif;white-space:nowrap}.mc-cloud-sync-badge-v143.ok{background:#e9f6ef;color:#2d7651}.mc-cloud-sync-badge-v143.busy{background:#edf5fa;color:#315f79}.mc-cloud-sync-badge-v143.error{background:#fff0ed;color:#a23e36}.mc-cloud-sync-actions-v143{display:flex;gap:7px;margin-top:9px}.mc-cloud-sync-actions-v143 button{min-height:34px!important;padding:6px 10px!important;font-size:10px!important}.mc-cloud-sync-detail-v143{display:none;margin-top:8px;padding:8px 9px;border-radius:9px;background:#fff6dc;color:#765e14;font-size:10px;line-height:1.45}.mc-cloud-sync-detail-v143.show{display:block}
    body.mc-dark .mc-cloud-sync-v143{background:#1b262d;border-color:#314049}body.mc-dark .mc-cloud-sync-copy-v143 span{color:#9eabb3}body.mc-dark .mc-cloud-sync-badge-v143{background:#26343c;color:#c7d2d8}body.mc-dark .mc-cloud-sync-badge-v143.ok{background:#20382f;color:#aee0c5}body.mc-dark .mc-cloud-sync-badge-v143.busy{background:#203747;color:#b8dff7}body.mc-dark .mc-cloud-sync-badge-v143.error{background:#432b2c;color:#ffb8b1}body.mc-dark .mc-cloud-sync-detail-v143{background:#3b3520;color:#f1da87}
    @media(max-width:700px){.mc-cloud-sync-row-v143{align-items:flex-start}.mc-cloud-sync-actions-v143{display:grid;grid-template-columns:1fr}.mc-cloud-sync-actions-v143 button{width:100%}}
  `;document.head.appendChild(st)}

  function ensureUI(){installStyle();const host=document.querySelector('.mc-user-session-v141');if(!host)return null;let box=host.querySelector('.mc-cloud-sync-v143');if(box)return box;box=document.createElement('section');box.className='mc-cloud-sync-v143';box.innerHTML='<div class="mc-cloud-sync-row-v143"><div class="mc-cloud-sync-copy-v143"><strong>Sincronização na nuvem</strong><span>Preparando Firestore…</span></div><span class="mc-cloud-sync-badge-v143">Aguardando</span></div><div class="mc-cloud-sync-actions-v143"><button type="button" class="secondary-action mc-cloud-sync-now-v143">Sincronizar agora</button></div><div class="mc-cloud-sync-detail-v143"></div>';host.appendChild(box);box.querySelector('.mc-cloud-sync-now-v143').onclick=()=>manualSync();return box}
  function setStatus(next,text='',detail=''){
    status=next;lastError=detail||'';const box=ensureUI();if(!box)return;const badge=box.querySelector('.mc-cloud-sync-badge-v143'),copy=box.querySelector('.mc-cloud-sync-copy-v143 span'),d=box.querySelector('.mc-cloud-sync-detail-v143');badge.className='mc-cloud-sync-badge-v143';
    const map={idle:['Aguardando',''],loading:['Conectando','busy'],uploading:['Enviando…','busy'],downloading:['Recebendo…','busy'],synced:['Sincronizado ✓','ok'],offline:['Offline',''],error:['Atenção','error']};const [label,cls]=map[next]||map.idle;badge.textContent=label;if(cls)badge.classList.add(cls);copy.textContent=text||({synced:'Seus dados desta conta estão sincronizados.',offline:'Sem internet; o app continua funcionando localmente.',error:'A sincronização precisa de atenção.'}[next]||'Preparando sincronização…');d.textContent=detail||'';d.classList.toggle('show',!!detail)
  }
  function errorMessage(e){const code=e?.code||'';if(code.includes('permission-denied'))return 'O Firestore recusou o acesso. É preciso permitir que cada usuário autenticado leia e grave somente em users/{uid}/workspace/{doc}. Seus dados locais continuam preservados.';if(code.includes('unavailable')||!navigator.onLine)return 'Firestore indisponível no momento. Seus dados locais continuam funcionando e a sincronização tentará novamente.';return `Falha na sincronização${code?` (${code})`:''}. Os dados locais foram preservados.`}

  async function upload(reason='alteração local'){
    if(!uid||applyingRemote||!cloud())return;const w=currentWorkspace();if(!w)return;const h=workspaceHash(w);lastHash=h;setStatus('uploading',`Salvando ${reason}…`);try{const clientUpdatedAt=new Date().toISOString();await cloud().set(uid,{schema:1,clientUpdatedAt,workspace:clone(w)});writeMeta(uid,{lastCloudHash:h,lastUploadAt:clientUpdatedAt,lastLocalChangeAt:clientUpdatedAt});setStatus('synced')}catch(e){setStatus(navigator.onLine?'error':'offline','',errorMessage(e))}}
  function scheduleUpload(reason='alteração local'){clearTimeout(pushTimer);pushTimer=setTimeout(()=>upload(reason),900)}

  async function applyRemote(remote){
    if(!uid||!remote?.workspace||applyingRemote)return;
    const w=remote.workspace,h=workspaceHash(w),local=currentWorkspace(),lh=workspaceHash(local);
    if(h===lh){lastHash=h;writeMeta(uid,{lastCloudHash:h});setStatus('synced');return}
    applyingRemote=true;clearTimeout(pushTimer);setStatus('downloading','Atualizando este dispositivo com os dados da sua conta…');
    writeMeta(uid,{lastCloudHash:h,lastRemoteAt:remote.clientUpdatedAt||new Date().toISOString()});
    try{
      const ok=scope()?.importCurrent?.(w,{reload:false});
      if(ok===false)throw new Error('workspace-not-active');
      lastHash=h;
      writeMeta(uid,{lastCloudHash:h,lastLocalChangeAt:remote.clientUpdatedAt||new Date().toISOString()});
      setStatus('synced');
    }catch(e){setStatus('error','',errorMessage(e))}
    finally{setTimeout(()=>{applyingRemote=false;lastHash=workspaceHash(currentWorkspace())},0)}
  }

  async function bootstrap(){
    const s=session(),active=scope()?.activeUid?.();if(!s?.signedIn||!s.uid||active!==s.uid||!cloud()){setStatus('idle','Entre com sua conta para sincronizar.');return}
    if(uid===s.uid&&unsub)return;stop();uid=s.uid;setStatus('loading','Comparando este dispositivo com a nuvem…');
    try{
      const local=currentWorkspace(),remote=await cloud().get(uid);if(!remote){await upload('primeira cópia desta conta')}else{
        const lh=workspaceHash(local),rh=workspaceHash(remote.workspace||{}),meta=readMeta(uid);
        if(lh===rh){lastHash=lh;writeMeta(uid,{lastCloudHash:rh});setStatus('synced')}
        else if(isEmpty(local)&&!isEmpty(remote.workspace)){await applyRemote(remote)}
        else if(!isEmpty(local)&&isEmpty(remote.workspace)){await upload('dados locais desta conta')}
        else if(meta.lastCloudHash===lh){await applyRemote(remote)}
        else if(meta.lastCloudHash===rh){await upload('alterações locais pendentes')}
        else{
          const remoteTime=Date.parse(remote.clientUpdatedAt||0)||0,localTime=Date.parse(meta.lastLocalChangeAt||0)||0;
          if(remoteTime>localTime)await applyRemote(remote);else await upload('versão local mais recente');
        }
      }
      if(!uid)return;
      unsub=cloud().watch(uid,remote=>{
        if(!remote?.workspace||applyingRemote)return;
        const rh=workspaceHash(remote.workspace),lh=workspaceHash(currentWorkspace());
        if(rh===lh){lastHash=rh;writeMeta(uid,{lastCloudHash:rh});setStatus('synced');return}
        const meta=readMeta(uid),remoteTime=Date.parse(remote.clientUpdatedAt||0)||0,localTime=Date.parse(meta.lastLocalChangeAt||0)||0;
        if(remoteTime>localTime)applyRemote(remote);else if(rh!==lastHash)scheduleUpload('alteração local mais recente');
      },e=>setStatus(navigator.onLine?'error':'offline','',errorMessage(e)));
      startPolling();
    }catch(e){setStatus(navigator.onLine?'error':'offline','',errorMessage(e));startPolling()}
  }

  function startPolling(){clearInterval(pollTimer);lastHash=workspaceHash(currentWorkspace());pollTimer=setInterval(()=>{if(!uid||applyingRemote)return;const h=workspaceHash(currentWorkspace());if(h!==lastHash){lastHash=h;const now=new Date().toISOString();writeMeta(uid,{lastLocalChangeAt:now});scope()?.saveCurrent?.();scheduleUpload()}},1400)}
  function stop(){if(unsub){try{unsub()}catch{}unsub=null}clearInterval(pollTimer);pollTimer=null;clearTimeout(pushTimer);pushTimer=null;uid=null;applyingRemote=false}
  async function manualSync(){if(!navigator.onLine){setStatus('offline');return}stop();await bootstrap()}

  window.addEventListener('meucontrole:user-session-changed',()=>setTimeout(bootstrap,200));
  window.addEventListener('meucontrole:user-data-ready',()=>setTimeout(bootstrap,100));
  window.addEventListener('meucontrole:user-workspace-imported',e=>{if(e.detail?.uid===uid){lastHash=workspaceHash(currentWorkspace());applyingRemote=false;setStatus('synced')}});
  window.addEventListener('online',()=>setTimeout(bootstrap,100));
  window.addEventListener('offline',()=>setStatus('offline'));
  window.addEventListener('pagehide',()=>{if(uid)scope()?.saveCurrent?.()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{ensureUI();setTimeout(bootstrap,500)},{once:true});else{ensureUI();setTimeout(bootstrap,500)}
  window.MeuControleCloudSync={version:VERSION,status:()=>status,error:()=>lastError,syncNow:manualSync};
})();
