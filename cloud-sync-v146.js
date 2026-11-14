/* MeuControle — V1.48: proteção atômica contra sobrescritas e cópias pré-recebimento */
(()=>{
  if(window.__mcCloudSyncV146)return;window.__mcCloudSyncV146=true;window.__mcCloudSyncV145=true;window.__mcCloudSyncV144=true;
  const VERSION='1.49',META_PREFIX='meu_controle_cloud_sync_meta_v1:';
  const TRACKED=new Set(['meu_controle_entries_v2','meu_controle_profiles_v2','meu_controle_profile_filter_v2']);
  let uid=null,unsub=null,pollTimer=null,pushTimer=null,bootTimer=null,retryTimer=null,retryCount=0,inFlightRun=null,uploadQueued=false,seenRevision=null,conflictBlocked=false,quotaBlocked=false,bootRun=0,applyingRemote=false,lastHash='',status='idle',lastError='',localDirty=false,bootstrapComplete=false;const TRACE_KEY='meu_controle_cloud_trace_v1';let trace=[];
  let renderedKey='',renderedBox=null;
  const clone=v=>JSON.parse(JSON.stringify(v));
  const revisionOf=r=>cloud()?.revisionOf?.(r)??null;
  function preserveBeforeRemote(reason){
    const current=scope()?.exportCurrent?.();if(!current)throw new Error('Não foi possível preservar o estado local');
    const k='meu_controle_cloud_safety_snapshots_v1';
    let previous=[];try{previous=JSON.parse(localStorage.getItem(k)||'[]')}catch{}
    const snapshots=[{savedAt:new Date().toISOString(),reason,workspace:clone(current)},...(Array.isArray(previous)?previous:[])].slice(0,3);
    try{localStorage.setItem(k,JSON.stringify(snapshots))}catch(e){throw new Error('Sem espaço para salvar cópia de segurança; recebimento bloqueado')}
    traceEvent('safety-snapshot',reason);
  }
  function isQuotaError(e){return String(e?.code||'').includes('resource-exhausted')}
  function blockQuota(){quotaBlocked=true;localDirty=true;clearTimeout(pushTimer);pushTimer=null;clearTimeout(retryTimer);retryTimer=null;traceEvent('quota-paused','Firestore quota exhausted: automatic retries paused');setStatus('error','Cota do Firestore atingida. Tentativas automáticas pausadas.','Os dados locais foram preservados. Evite novas alterações em vários aparelhos até a cota ser renovada. Depois use “Sincronizar agora” uma única vez.');}
  function blockConflict(reason){conflictBlocked=true;localDirty=true;clearTimeout(pushTimer);pushTimer=null;clearTimeout(retryTimer);retryTimer=null;traceEvent('conflict-blocked',reason);setStatus('error','Conflito de versões — nenhum dado foi substituído.','Existem alterações divergentes neste aparelho e na nuvem. Os dados locais foram preservados. Exporte um backup em cada dispositivo antes de resolver o conflito. Não force a sincronização.');}
  const stable=v=>JSON.stringify({entries:v?.entries||[],profiles:v?.profiles||[],profileFilter:v?.profileFilter||'all'});
  const entriesStable=v=>JSON.stringify(v?.entries||[]);
  function hashText(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16)}
  const workspaceHash=w=>hashText(stable(w||{}));
  const entriesHash=w=>hashText(entriesStable(w||{}));
  const isEmpty=w=>!(w?.entries?.length)&&!w?.profiles?.some(p=>Array.isArray(p.specialDates)&&p.specialDates.length);
  const scope=()=>window.MeuControleUserDataScope;
  const cloud=()=>window.MeuControleCloud?.workspace;
  const session=()=>window.MeuControleUserSession?.get?.()||null;
  const deviceId=()=>window.MeuControleCloud?.deviceId?.()||localStorage.getItem('meu_controle_device_id_v1')||'';
  const metaKey=id=>META_PREFIX+id;
  function readMeta(id){try{return JSON.parse(localStorage.getItem(metaKey(id))||'{}')}catch{return{}}}
  function writeMeta(id,next){try{localStorage.setItem(metaKey(id),JSON.stringify({...readMeta(id),...next}))}catch{}}
  function currentWorkspace(){
    try{
      const w=scope()?.exportCurrent?.()||null;
      if(!w)return null;
      /* A nuvem sincroniza somente os dados vivos. Backups automáticos ficam locais:
         eles contêm cópias completas do histórico e podem ultrapassar o limite de 1 MiB
         de um documento do Firestore. */
      return {schema:1,entries:Array.isArray(w.entries)?w.entries:[],profiles:Array.isArray(w.profiles)?w.profiles:[],profileFilter:w.profileFilter||'all'};
    }catch{return null}
  }

  function installStyle(){if(document.getElementById('mcCloudSyncV146Style'))return;const st=document.createElement('style');st.id='mcCloudSyncV146Style';st.textContent=`.mc-cloud-sync-v143{margin-top:10px;padding:10px 11px;border:1px solid #dfe7e2;border-radius:11px;background:#f8fbfa}.mc-cloud-sync-row-v143{display:flex;align-items:center;justify-content:space-between;gap:12px}.mc-cloud-sync-copy-v143 strong{display:block;font-size:11px;color:var(--text)}.mc-cloud-sync-copy-v143 span{display:block;margin-top:3px;font-size:10px;line-height:1.4;color:#718078}.mc-cloud-sync-badge-v143{padding:5px 8px;border-radius:999px;background:#eef3f0;color:#607068;font:800 9px system-ui,sans-serif;white-space:nowrap}.mc-cloud-sync-badge-v143.ok{background:#e9f6ef;color:#2d7651}.mc-cloud-sync-badge-v143.busy{background:#edf5fa;color:#315f79}.mc-cloud-sync-badge-v143.error{background:#fff0ed;color:#a23e36}.mc-cloud-sync-actions-v143{display:flex;gap:7px;margin-top:9px}.mc-cloud-sync-actions-v143 button{min-height:34px!important;padding:6px 10px!important;font-size:10px!important}.mc-cloud-sync-detail-v143{display:none;margin-top:8px;padding:8px 9px;border-radius:9px;background:#fff6dc;color:#765e14;font-size:10px;line-height:1.45}.mc-cloud-sync-detail-v143.show{display:block}.mc-cloud-sync-diagnostic-v7{margin-top:9px;padding:10px;border:1px solid #b4c6cd;border-radius:10px;background:var(--card,#fff);font:11px/1.5 ui-monospace,monospace;color:var(--text,#263a42);white-space:pre-wrap;overflow-wrap:anywhere;max-height:250px;overflow:auto}.mc-cloud-sync-diagnostic-v7[hidden]{display:none!important}body.mc-dark .mc-cloud-sync-v143{background:#1b262d;border-color:#314049}body.mc-dark .mc-cloud-sync-copy-v143 span{color:#9eabb3}body.mc-dark .mc-cloud-sync-badge-v143{background:#26343c;color:#c7d2d8}body.mc-dark .mc-cloud-sync-badge-v143.ok{background:#20382f;color:#aee0c5}body.mc-dark .mc-cloud-sync-badge-v143.busy{background:#203747;color:#b8dff7}body.mc-dark .mc-cloud-sync-badge-v143.error{background:#432b2c;color:#ffb8b1}body.mc-dark .mc-cloud-sync-detail-v143{background:#3b3520;color:#f1da87}body.theme-black .mc-cloud-sync-v143{background:#142129!important;border-color:#304550!important;color:#edf5f9!important}body.theme-black .mc-cloud-sync-copy-v143 strong{color:#edf5f9!important}body.theme-black .mc-cloud-sync-copy-v143 span{color:#a6bbc6!important}body.theme-black .mc-cloud-sync-badge-v143{background:#183447!important;color:#9fd4f4!important}body.theme-black .mc-cloud-sync-badge-v143.ok{background:#173a2b!important;color:#9ee0ba!important}body.theme-black .mc-cloud-sync-badge-v143.busy{background:#183447!important;color:#9fd4f4!important}body.theme-black .mc-cloud-sync-badge-v143.error{background:#44282a!important;color:#ffb7b2!important}body.theme-black .mc-cloud-sync-actions-v143 .secondary-action{background:#182932!important;color:#e5eff4!important;border-color:#38505c!important}body.theme-black .mc-cloud-sync-detail-v143{background:#3b3520!important;color:#f1da87!important}@media(max-width:700px){.mc-cloud-sync-row-v143{align-items:flex-start}.mc-cloud-sync-actions-v143{display:grid;grid-template-columns:1fr}.mc-cloud-sync-actions-v143 button{width:100%}}`;document.head.appendChild(st)}
  function ensureUI(){installStyle();const host=document.querySelector('.mc-user-session-v141');if(!host)return null;let box=host.querySelector('.mc-cloud-sync-v143');if(box)return box;box=document.createElement('section');box.className='mc-cloud-sync-v143';box.innerHTML='<div class="mc-cloud-sync-row-v143"><div class="mc-cloud-sync-copy-v143"><strong>Sincronização na nuvem</strong><span>Preparando Firestore…</span></div><span class="mc-cloud-sync-badge-v143">Aguardando</span></div><div class="mc-cloud-sync-actions-v143"><button type="button" class="secondary-action mc-cloud-sync-now-v143">Sincronizar agora</button><button type="button" class="secondary-action mc-cloud-diagnose-v7">Ver diagnóstico</button></div><div class="mc-cloud-sync-detail-v143"></div><pre class="mc-cloud-sync-diagnostic-v7" hidden></pre>';host.appendChild(box);box.querySelector('.mc-cloud-sync-now-v143').onclick=()=>manualSync();box.querySelector('.mc-cloud-diagnose-v7').onclick=()=>showDiagnostic(box);renderedKey='';renderedBox=null;return box}
  function setStatus(next,text='',detail=''){status=next;lastError=detail||'';const map={idle:['Aguardando',''],loading:['Conectando','busy'],uploading:['Enviando…','busy'],downloading:['Recebendo…','busy'],synced:['Sincronizado ✓','ok'],offline:['Offline',''],error:['Atenção','error']};const[label,cls]=map[next]||map.idle;const copyText=text||({synced:'Seus dados desta conta estão sincronizados.',offline:'Sem internet; o app continua funcionando localmente.',error:'A sincronização precisa de atenção.'}[next]||'Preparando sincronização…');const detailText=detail||'';const box=ensureUI();if(!box)return;const key=[next,label,cls,copyText,detailText].join('|');if(renderedBox===box&&renderedKey===key)return;renderedBox=box;renderedKey=key;const badge=box.querySelector('.mc-cloud-sync-badge-v143'),copy=box.querySelector('.mc-cloud-sync-copy-v143 span'),d=box.querySelector('.mc-cloud-sync-detail-v143');badge.className='mc-cloud-sync-badge-v143'+(cls?' '+cls:'');badge.textContent=label;copy.textContent=copyText;d.textContent=detailText;d.classList.toggle('show',!!detailText)}
  function traceEvent(type,detail=''){const item={at:new Date().toISOString(),type,detail:String(detail||''),uid:uid||''};trace.push(item);trace=trace.slice(-40);try{localStorage.setItem(TRACE_KEY,JSON.stringify(trace))}catch{};window.dispatchEvent(new CustomEvent('meucontrole:cloud-trace',{detail:item}))}
  function diagnostic(){const w=currentWorkspace(),m=uid?readMeta(uid):{};return{version:'1.49-diag4',quotaBlocked,conflictBlocked,seenRevision:seenRevision?'known':'unknown',retryCount,uploadInProgress:inFlightRun===bootRun,status,error:lastError,uid:uid||'',activeUid:scope()?.activeUid?.()||'',localDirty,applyingRemote,bootstrapComplete,lastHash,currentHash:workspaceHash(w),entries:Array.isArray(w?.entries)?w.entries.length:0,lastCloudHash:m.lastCloudHash||'',lastUploadAt:m.lastUploadAt||'',lastRemoteAt:m.lastRemoteAt||'',lastLocalChangeAt:m.lastLocalChangeAt||'',trace:trace.slice(-15)}}

  /* Diagnóstico somente de leitura: não importa, envia nem substitui dados. */
  async function showDiagnostic(box){
    const target=box?.querySelector('.mc-cloud-sync-diagnostic-v7'),button=box?.querySelector('.mc-cloud-diagnose-v7');
    if(!target)return;
    target.hidden=false;
    target.textContent='Consultando estado local e servidor (somente leitura)...';
    if(button)button.disabled=true;
    const w=currentWorkspace(),sessionInfo=session(),localProfiles=Array.isArray(w?.profiles)?w.profiles:[],localDates=localProfiles.reduce((n,p)=>n+(Array.isArray(p.specialDates)?p.specialDates.length:0),0);
    const report={versao:VERSION,status,conflitoBloqueado:conflictBlocked,cotaPausada:quotaBlocked,versaoNuvemConhecida:seenRevision!==null,contaConectada:!!sessionInfo?.signedIn,espacoLocalCorreto:!!uid&&scope()?.activeUid?.()===uid,cloudDisponivel:!!cloud(),online:navigator.onLine,alteracoesPendentes:localDirty,envioEmAndamento:inFlightRun===bootRun,tentativas:retryCount,erroAtual:lastError||'',lancamentosLocais:w?.entries?.length||0,datasEspeciaisLocais:localDates,ultimoEnvio:uid?readMeta(uid).lastUploadAt||'':'',ultimoRecebimento:uid?readMeta(uid).lastRemoteAt||'':'',ultimaMudancaLocal:uid?readMeta(uid).lastLocalChangeAt||'':'',nuvem:'nao consultada',lancamentosNuvem:null,datasEspeciaisNuvem:null,estadoIgual:null,ultimosEventos:trace.slice(-8).map(e=>({tipo:e.type,horario:e.at,detalhe:/error|retry|skip/.test(e.type)?String(e.detail).slice(0,100):''}))};
    try{
      if(!uid)report.nuvem='conta de sincronizacao indisponivel';
      else if(!cloud())report.nuvem='ponte de nuvem indisponivel';
      else{
        const remote=await cloud().get(uid);
        report.nuvem=remote?'leitura OK':'nenhum documento encontrado';
        if(remote?.workspace){
          const rw=remote.workspace;
          report.lancamentosNuvem=Array.isArray(rw.entries)?rw.entries.length:0;
          report.datasEspeciaisNuvem=(Array.isArray(rw.profiles)?rw.profiles:[]).reduce((n,p)=>n+(Array.isArray(p.specialDates)?p.specialDates.length:0),0);
          report.estadoIgual=workspaceHash(rw)===workspaceHash(w);
        }
      }
    }catch(e){report.nuvem='FALHA: '+String(e?.code||e?.message||'erro desconhecido').slice(0,160)}
    const printable='MeuControle - Diagnóstico de sincronização\\n'+JSON.stringify(report,null,2);
    target.textContent=printable;
    if(button){button.disabled=false;button.textContent='Copiar diagnóstico';button.onclick=async()=>{
      try{await navigator.clipboard.writeText(printable);button.textContent='Copiado ✓'}catch{
        const tmp=document.createElement('textarea');tmp.value=printable;tmp.style.position='fixed';tmp.style.opacity='0';document.body.appendChild(tmp);tmp.select();const ok=document.execCommand('copy');tmp.remove();button.textContent=ok?'Copiado ✓':'Selecione o texto abaixo';
      }
      setTimeout(()=>{button.textContent='Atualizar diagnóstico';button.onclick=()=>showDiagnostic(box)},1800);
    }}
  }

  function errorMessage(e){const code=e?.code||'';if(code.includes('permission-denied'))return'O Firestore recusou o acesso. Seus dados locais continuam preservados.';if(code.includes('resource-exhausted'))return'A cota do Firestore foi atingida. Seus dados locais estão preservados; a sincronização volta quando a cota estiver disponível.';if(code.includes('unavailable')||!navigator.onLine)return'Firestore indisponível no momento. Seus dados locais continuam funcionando.';return`Falha na sincronização${code?` (${code})`:''}. Os dados locais foram preservados.`}
  function clearRuntime({invalidate=false}={}){if(invalidate)bootRun++;seenRevision=null;conflictBlocked=false;quotaBlocked=false;if(unsub){try{unsub()}catch{}unsub=null}clearInterval(pollTimer);pollTimer=null;clearTimeout(pushTimer);pushTimer=null;clearTimeout(retryTimer);retryTimer=null;retryCount=0;inFlightRun=null;uploadQueued=false;clearTimeout(bootTimer);bootTimer=null;applyingRemote=false;bootstrapComplete=false}
  function scheduleBootstrap(delay=250){clearTimeout(bootTimer);const planned=++bootRun;bootTimer=setTimeout(()=>bootstrap(planned),delay)}
  function markLocalDirty(reason='alteração local'){if(applyingRemote)return;traceEvent('local-change',reason);localDirty=true;const now=new Date().toISOString();scope()?.saveCurrent?.();if(uid){writeMeta(uid,{lastLocalChangeAt:now});if(!conflictBlocked&&!quotaBlocked)scheduleUpload(reason)}}

  const nativeSetItem=Storage.prototype.setItem;
  if(!window.__mcCloudSyncStorageHookV146){window.__mcCloudSyncStorageHookV146=true;Storage.prototype.setItem=function(key,value){const r=nativeSetItem.call(this,key,value);if(this===localStorage&&TRACKED.has(String(key))&&!applyingRemote)markLocalDirty();return r}}


  /* Um envio de cada vez: evita inversao de gravacoes no Firestore. */
  async function upload(reason='alteração local',run=bootRun){
    if(run!==bootRun||!uid||applyingRemote||!cloud()||conflictBlocked||quotaBlocked){traceEvent('upload-skip',reason);return}
    if(inFlightRun===run){uploadQueued=true;traceEvent('upload-queued',reason);return}
    const w=currentWorkspace();if(!w)return;
    clearTimeout(retryTimer);retryTimer=null;
    inFlightRun=run;uploadQueued=false;
    const uploadHash=workspaceHash(w);
    let succeeded=false;
    traceEvent('upload-start',reason);
    setStatus('uploading','Salvando '+reason+'…');
    try{
      const clientUpdatedAt=new Date().toISOString();
      const savedRevision=await cloud().set(uid,{schema:1,clientUpdatedAt,workspace:clone(w)},seenRevision);
      traceEvent('upload-ok',reason+' | '+uploadHash);
      if(run!==bootRun)return;
      succeeded=true;retryCount=0;seenRevision=savedRevision;
      const currentHash=workspaceHash(currentWorkspace());
      writeMeta(uid,{lastCloudHash:uploadHash,lastUploadAt:clientUpdatedAt,...(currentHash===uploadHash?{lastLocalChangeAt:clientUpdatedAt}:{})});
      lastHash=uploadHash;
      if(currentHash===uploadHash&&!uploadQueued){
        localDirty=false;setStatus('synced');
      }else{
        localDirty=true;uploadQueued=true;
        setStatus('uploading','Enviando alterações mais recentes…');
      }
    }catch(e){
      traceEvent('upload-error',e?.code||e?.message||'erro');
      if(run!==bootRun)return;
      if(e?.code==='sync/conflict'){blockConflict('Gravação concorrente detectada no servidor');return}
      if(isQuotaError(e)){blockQuota();return}
      localDirty=true;
      setStatus(navigator.onLine?'error':'offline','',errorMessage(e));
      const n=++retryCount;
      if(navigator.onLine){
        const delay=Math.min(60000,1500*Math.pow(2,Math.min(n-1,6)));
        traceEvent('retry-scheduled',n+' em '+delay+'ms');
        clearTimeout(retryTimer);
        retryTimer=setTimeout(()=>{retryTimer=null;if(run===bootRun&&localDirty)upload('nova tentativa automática',run)},delay);
      }
    }finally{
      if(inFlightRun===run)inFlightRun=null;
      if(run===bootRun&&uploadQueued&&succeeded){
        uploadQueued=false;
        scheduleUpload('alterações registradas durante o envio');
      }
    }
  }
  function scheduleUpload(reason='alteração local'){
    if(conflictBlocked||quotaBlocked)return;
    clearTimeout(pushTimer);pushTimer=null;
    clearTimeout(retryTimer);retryTimer=null;
    const run=bootRun;
    pushTimer=setTimeout(()=>{pushTimer=null;upload(reason,run)},350);
  }

  function applyMetaOnly(w){
    const remoteProfiles=Array.isArray(w?.profiles)&&w.profiles.length?w.profiles:null;
    const filter=w?.profileFilter||'all';
    preserveBeforeRemote('Antes de aplicar perfis recebidos da nuvem');
    applyingRemote=true;
    try{
      if(remoteProfiles)localStorage.setItem('meu_controle_profiles_v2',JSON.stringify(remoteProfiles));
      localStorage.setItem('meu_controle_profile_filter_v2',filter);
      /* app.js declara profiles/activeProfile como let globais, nao propriedades de window.
         Atualize os bindings reais ao receber apenas metadados da nuvem. */
      try{if(remoteProfiles)profiles=clone(remoteProfiles)}catch{}
      try{activeProfile=filter}catch{}
      try{if(typeof renderProfileSelectors==='function')renderProfileSelectors()}catch{}
      try{if(typeof renderProfilesList==='function')renderProfilesList()}catch{}
      try{if(typeof renderAll==='function')renderAll()}catch{}
      scope()?.saveCurrent?.();
      window.dispatchEvent(new CustomEvent('meucontrole:profiles-cloud-applied'));
    }finally{applyingRemote=false}
  }

  async function applyRemote(remote,run=bootRun,{notify=true}={}){
    if(run!==bootRun||!uid||!remote?.workspace||applyingRemote)return;
    const raw=remote.workspace,localFull=scope()?.exportCurrent?.()||{},w={...raw,autoBackups:Array.isArray(localFull.autoBackups)?localFull.autoBackups:[],lastBackup:localFull.lastBackup||null},h=workspaceHash(raw),local=currentWorkspace(),lh=workspaceHash(local);
    if(h===lh){lastHash=h;seenRevision=revisionOf(remote);localDirty=false;writeMeta(uid,{lastCloudHash:h});if(status!=='synced')setStatus('synced');return}
    if(localDirty||conflictBlocked){blockConflict('Dados locais alterados durante o recebimento');return}
    const sameEntries=entriesHash(w)===entriesHash(local);
    if(sameEntries){
      applyMetaOnly(w);const nh=workspaceHash(currentWorkspace());lastHash=nh;seenRevision=revisionOf(remote);localDirty=false;writeMeta(uid,{lastCloudHash:h,lastRemoteAt:remote.clientUpdatedAt||new Date().toISOString()});setStatus('synced');return;
    }
    preserveBeforeRemote('Antes de aplicar lançamentos recebidos da nuvem');
    applyingRemote=true;clearTimeout(pushTimer);setStatus('downloading','Atualizando este dispositivo com os dados da sua conta…');
    try{const ok=scope()?.importCurrent?.(w,{reload:false});if(ok===false)throw new Error('workspace-not-active');if(run!==bootRun)return;lastHash=h;seenRevision=revisionOf(remote);localDirty=false;writeMeta(uid,{lastCloudHash:h,lastRemoteAt:remote.clientUpdatedAt||new Date().toISOString(),lastLocalChangeAt:remote.clientUpdatedAt||new Date().toISOString()});setStatus('synced');if(notify&&bootstrapComplete&&remote.sourceDeviceId&&remote.sourceDeviceId!==deviceId())window.dispatchEvent(new CustomEvent('meucontrole:remote-workspace-applied',{detail:{uid,sourceDeviceId:remote.sourceDeviceId,at:remote.clientUpdatedAt||new Date().toISOString()}}))}catch(e){if(run===bootRun)setStatus('error','',errorMessage(e))}finally{if(run===bootRun)setTimeout(()=>{applyingRemote=false;lastHash=workspaceHash(currentWorkspace())},0)}
  }

  async function bootstrap(run){
    if(run!==bootRun)return;const s=session(),active=scope()?.activeUid?.();if(!s?.signedIn||!s.uid||active!==s.uid||!cloud()){uid=null;setStatus('idle','Entre com sua conta para sincronizar.');return}if(uid===s.uid&&unsub)return;
    clearRuntime();if(run!==bootRun)return;uid=s.uid;localDirty=false;bootstrapComplete=false;setStatus('loading','Comparando este dispositivo com a nuvem…');
    try{
      const local=currentWorkspace(),remote=await cloud().get(uid);if(run!==bootRun)return;
      seenRevision=revisionOf(remote);
      if(!remote){
        if(!isEmpty(local)){localDirty=true;await upload('primeira cópia desta conta',run)}
        else{lastHash=workspaceHash(local);setStatus('synced')}
      }else{
        const lh=workspaceHash(local),rh=workspaceHash(remote.workspace||{}),meta=readMeta(uid);
        if(lh===rh){lastHash=lh;localDirty=false;writeMeta(uid,{lastCloudHash:rh});setStatus('synced')}
        else if(isEmpty(local)&&!isEmpty(remote.workspace)){await applyRemote(remote,run,{notify:false})}
        else if(meta.lastCloudHash===lh){await applyRemote(remote,run,{notify:false})}
        else if(meta.lastCloudHash===rh){
          localDirty=true;await upload('alterações locais pendentes',run)
        }else{
          blockConflict('Históricos divergentes ao entrar; sem ancestral comum comprovado');
        }
      }
      if(run!==bootRun||!uid)return;bootstrapComplete=true;lastHash=workspaceHash(currentWorkspace());
      window.dispatchEvent(new CustomEvent('meucontrole:cloud-bootstrap-complete',{detail:{uid}}));
      unsub=cloud().watch(uid,remote=>{
        traceEvent('remote-event',remote?.clientUpdatedAt||'sem data');
        if(run!==bootRun||!remote?.workspace||applyingRemote||conflictBlocked||quotaBlocked)return;
        const rh=workspaceHash(remote.workspace),lh=workspaceHash(currentWorkspace());
        if(rh===lh){lastHash=rh;seenRevision=revisionOf(remote);if(!localDirty){writeMeta(uid,{lastCloudHash:rh});setStatus('synced')}return}
        if(localDirty||inFlightRun===run||pushTimer){
          blockConflict('Alterações remotas recebidas com trabalho local pendente');
          return;
        }
        applyRemote(remote,run,{notify:true}).catch(e=>{blockConflict(e?.message||'Falha ao preservar dados locais')});
      },e=>{if(run===bootRun)isQuotaError(e)?blockQuota():setStatus(navigator.onLine?'error':'offline','',errorMessage(e))});
      startPolling(run);
    }catch(e){if(run!==bootRun)return;if(isQuotaError(e))blockQuota();else setStatus(navigator.onLine?'error':'offline','',errorMessage(e));bootstrapComplete=true;startPolling(run)}
  }
  function startPolling(run){clearInterval(pollTimer);pollTimer=setInterval(()=>{if(run!==bootRun||!uid||applyingRemote||conflictBlocked||quotaBlocked)return;const h=workspaceHash(currentWorkspace());if(h!==lastHash&&!localDirty){localDirty=true;writeMeta(uid,{lastLocalChangeAt:new Date().toISOString()});scope()?.saveCurrent?.();scheduleUpload('alteração detectada pelo monitor')}else if(localDirty&&navigator.onLine&&!pushTimer&&!retryTimer&&inFlightRun!==run){scheduleUpload('pendência local ainda não enviada')}},1200)}
  async function manualSync(){if(conflictBlocked){blockConflict('Sincronização manual bloqueada para proteger dados divergentes');return}if(!navigator.onLine){setStatus('offline');return}clearRuntime({invalidate:true});uid=null;const run=bootRun;await bootstrap(run)}
  window.addEventListener('meucontrole:user-session-changed',()=>scheduleBootstrap(280));window.addEventListener('meucontrole:user-data-ready',()=>scheduleBootstrap(180));window.addEventListener('online',()=>{if(!quotaBlocked)scheduleBootstrap(120)});window.addEventListener('pageshow',e=>{if(e.persisted&&!quotaBlocked)scheduleBootstrap(120)});document.addEventListener('visibilitychange',()=>{if(!document.hidden&&uid&&localDirty&&!conflictBlocked&&!quotaBlocked&&!pushTimer&&!retryTimer&&inFlightRun!==bootRun)scheduleUpload('retomada do aplicativo')});window.addEventListener('offline',()=>setStatus('offline'));window.addEventListener('pagehide',()=>{if(uid)scope()?.saveCurrent?.()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{ensureUI();scheduleBootstrap(550)},{once:true});else{ensureUI();scheduleBootstrap(550)}
  window.MeuControleCloudSync={version:VERSION,status:()=>status,error:()=>lastError,syncNow:manualSync,markLocalDirty,diagnostic,trace:()=>trace.slice()};
})();