/* MeuControle — V1.42.2: propriedade local por usuário + aplicação de workspace sem reload */
(()=>{
  if(window.__mcUserDataScopeV142)return;window.__mcUserDataScopeV142=true;
  const VERSION='1.42.2';
  const ACTIVE_UID_KEY='meu_controle_active_data_uid_v1';
  const MIGRATION_OWNER_KEY='meu_controle_legacy_data_owner_uid_v1';
  const USER_PREFIX='meu_controle_user_workspace_v1:';
  const KEYS={
    entries:'meu_controle_entries_v2',profiles:'meu_controle_profiles_v2',profileFilter:'meu_controle_profile_filter_v2',
    autoBackups:'meu_controle_auto_backups_v2',lastBackup:'meu_controle_last_backup_v2'
  };
  const DEFAULT_PROFILES=[{id:'pessoal',name:'Pessoal',locked:true},{id:'condominio',name:'Condomínio',locked:true},{id:'escolinha',name:'Escolinha',locked:true}];
  let switching=false;

  const parse=(raw,fallback)=>{try{return raw?JSON.parse(raw):fallback}catch{return fallback}};
  const clone=v=>JSON.parse(JSON.stringify(v));
  function readWorkspace(){
    return {
      schema:1,savedAt:new Date().toISOString(),
      entries:parse(localStorage.getItem(KEYS.entries),[]),
      profiles:parse(localStorage.getItem(KEYS.profiles),DEFAULT_PROFILES),
      profileFilter:localStorage.getItem(KEYS.profileFilter)||'all',
      autoBackups:parse(localStorage.getItem(KEYS.autoBackups),[]),
      lastBackup:localStorage.getItem(KEYS.lastBackup)||null
    };
  }
  function writeWorkspace(data){
    const d=data||{};
    localStorage.setItem(KEYS.entries,JSON.stringify(Array.isArray(d.entries)?d.entries:[]));
    localStorage.setItem(KEYS.profiles,JSON.stringify(Array.isArray(d.profiles)&&d.profiles.length?d.profiles:DEFAULT_PROFILES));
    localStorage.setItem(KEYS.profileFilter,d.profileFilter||'all');
    localStorage.setItem(KEYS.autoBackups,JSON.stringify(Array.isArray(d.autoBackups)?d.autoBackups:[]));
    if(d.lastBackup)localStorage.setItem(KEYS.lastBackup,d.lastBackup);else localStorage.removeItem(KEYS.lastBackup);
  }
  function applyWorkspaceToRuntime(data){
    const d=data||emptyWorkspace();
    try{entries=clone(Array.isArray(d.entries)?d.entries:[])}catch{}
    try{profiles=clone(Array.isArray(d.profiles)&&d.profiles.length?d.profiles:DEFAULT_PROFILES)}catch{}
    try{activeProfile=d.profileFilter||'all'}catch{}
    try{if(typeof renderProfileSelectors==='function')renderProfileSelectors()}catch{}
    try{if(typeof renderProfilesList==='function')renderProfilesList()}catch{}
    try{if(typeof updateAutoBackupLabel==='function')updateAutoBackupLabel()}catch{}
    try{if(typeof renderAll==='function')renderAll()}catch{}
    try{window.MeuControleFirstUseDashboardV043?.refresh?.()}catch{}
    try{window.MeuControleCentralHojeV041?.refresh?.()}catch{}
  }
  function emptyWorkspace(){return{schema:1,savedAt:new Date().toISOString(),entries:[],profiles:DEFAULT_PROFILES,profileFilter:'all',autoBackups:[],lastBackup:null}}
  function userKey(uid){return USER_PREFIX+uid}
  function saveUser(uid){if(!uid)return;localStorage.setItem(userKey(uid),JSON.stringify(readWorkspace()))}
  function loadUser(uid){return parse(localStorage.getItem(userKey(uid)),null)}
  function countLegacy(){return parse(localStorage.getItem(KEYS.entries),[]).length}
  function currentSession(){try{return window.MeuControleUserSession?.get?.()||null}catch{return null}}

  function style(){if(document.getElementById('mcUserDataScopeV142Style'))return;const st=document.createElement('style');st.id='mcUserDataScopeV142Style';st.textContent=`
    .mc-data-owner-backdrop-v142{position:fixed;inset:0;z-index:101500;background:rgba(9,25,35,.62);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px}
    .mc-data-owner-card-v142{width:min(520px,100%);background:#fff;border:1px solid #dfe7e2;border-radius:21px;padding:22px;color:#263a30;box-shadow:0 28px 80px rgba(0,0,0,.28)}
    .mc-data-owner-card-v142 h3{margin:0;font-size:22px}.mc-data-owner-card-v142 p{margin:8px 0 0;font-size:12px;line-height:1.55;color:#66756d}.mc-data-owner-account-v142{margin-top:15px;padding:12px;border-radius:12px;background:#f4f8f6;border:1px solid #e1e9e4}.mc-data-owner-account-v142 strong{display:block}.mc-data-owner-account-v142 span{display:block;margin-top:3px;font-size:11px;color:#6e7b74;overflow-wrap:anywhere}.mc-data-owner-warning-v142{margin-top:13px;padding:10px 11px;border-radius:10px;background:#fff6dc;color:#765e14;font-size:11px;line-height:1.5}.mc-data-owner-actions-v142{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:18px}.mc-data-owner-actions-v142 .mc-primary-v142{grid-column:1/-1}.mc-data-owner-actions-v142 button{min-height:44px}
    .mc-user-data-status-v142{margin-top:9px;padding:8px 10px;border-radius:10px;background:#edf5fa;color:#315f79;font-size:10px;line-height:1.45}.mc-dark .mc-user-data-status-v142{background:#203747;color:#b8dff7}.mc-dark .mc-data-owner-card-v142{background:#172127;color:#e7edf1;border-color:#34434c}.mc-dark .mc-data-owner-card-v142 p,.mc-dark .mc-data-owner-account-v142 span{color:#aebbc3}.mc-dark .mc-data-owner-account-v142{background:#1b262d;border-color:#314049}.mc-dark .mc-data-owner-warning-v142{background:#3b3520;color:#f1da87}
    @media(max-width:700px){.mc-data-owner-backdrop-v142{align-items:flex-end;padding:14px}.mc-data-owner-card-v142{border-radius:21px 21px 15px 15px}.mc-data-owner-actions-v142{grid-template-columns:1fr}.mc-data-owner-actions-v142 .mc-primary-v142{grid-column:auto}}
  `;document.head.appendChild(st)}

  function closePrompt(){document.querySelector('.mc-data-owner-backdrop-v142')?.remove()}
  function showMigrationPrompt(session){
    if(document.querySelector('.mc-data-owner-backdrop-v142')||!session?.signedIn)return;
    style();const count=countLegacy();
    const bd=document.createElement('div');bd.className='mc-data-owner-backdrop-v142';bd.innerHTML=`<section class="mc-data-owner-card-v142" role="dialog" aria-modal="true" aria-label="Vincular dados ao usuário"><h3>Quem é o dono destes dados?</h3><p>O MeuControle encontrou ${count} lançamento${count===1?'':'s'} já existente${count===1?'':'s'} neste navegador. Antes de separar as contas, escolha a conta que deve receber esse histórico.</p><div class="mc-data-owner-account-v142"><strong></strong><span></span></div><div class="mc-data-owner-warning-v142">Nada será apagado. Só vincule se esta for sua conta principal. Se estiver usando a conta de teste, escolha “Trocar conta”.</div><div class="mc-data-owner-actions-v142"><button type="button" class="mc-primary-v142">Vincular os dados atuais a esta conta</button><button type="button" class="secondary-action mc-switch-v142">Trocar conta</button><button type="button" class="ghost mc-later-v142">Agora não</button></div></section>`;
    bd.querySelector('.mc-data-owner-account-v142 strong').textContent=session.displayName||'Usuário Google';bd.querySelector('.mc-data-owner-account-v142 span').textContent=session.email||session.uid;
    bd.querySelector('.mc-primary-v142').onclick=()=>{saveUser(session.uid);localStorage.setItem(MIGRATION_OWNER_KEY,session.uid);localStorage.setItem(ACTIVE_UID_KEY,session.uid);closePrompt();renderStatus();window.dispatchEvent(new CustomEvent('meucontrole:user-data-ready',{detail:{uid:session.uid,migrated:true}}))};
    bd.querySelector('.mc-switch-v142').onclick=async()=>{closePrompt();try{await window.MeuControleUserSession?.switchAccount?.()}catch{}};
    bd.querySelector('.mc-later-v142').onclick=closePrompt;document.body.appendChild(bd);
  }

  function renderStatus(){
    const box=document.querySelector('.mc-user-session-v141');if(!box)return;let note=box.querySelector('.mc-user-data-status-v142');if(!note){note=document.createElement('div');note.className='mc-user-data-status-v142';box.appendChild(note)}
    const s=currentSession(),owner=localStorage.getItem(MIGRATION_OWNER_KEY),active=localStorage.getItem(ACTIVE_UID_KEY);
    if(!owner){note.textContent='Ciclo 2: aguardando definir qual conta será dona dos dados atuais.';return}
    if(s?.signedIn&&active===s.uid)note.textContent='Dados locais isolados para esta conta ✓';else if(s?.signedIn)note.textContent='Preparando o espaço de dados desta conta…';else note.textContent='Sem conta conectada. Os dados de usuários permanecem preservados neste dispositivo.';
  }

  function switchTo(uid){
    if(switching||!uid)return;const active=localStorage.getItem(ACTIVE_UID_KEY);if(active===uid){renderStatus();return}
    switching=true;
    if(active)saveUser(active);
    const target=loadUser(uid)||emptyWorkspace();writeWorkspace(target);localStorage.setItem(ACTIVE_UID_KEY,uid);
    location.reload();
  }
  function handleSession(s){
    renderStatus();if(!s?.ready)return;
    const owner=localStorage.getItem(MIGRATION_OWNER_KEY),active=localStorage.getItem(ACTIVE_UID_KEY);
    if(!owner){if(s.signedIn)showMigrationPrompt(s);return}
    if(!s.signedIn){if(active)saveUser(active);localStorage.removeItem(ACTIVE_UID_KEY);return}
    switchTo(s.uid);
  }
  function importWorkspace(uid,data,{reload=false}={}){
    if(!uid||uid!==localStorage.getItem(ACTIVE_UID_KEY))return false;
    const safe=clone(data||emptyWorkspace());
    writeWorkspace(safe);saveUser(uid);
    if(!reload)applyWorkspaceToRuntime(safe);
    window.dispatchEvent(new CustomEvent('meucontrole:user-workspace-imported',{detail:{uid}}));
    if(reload)location.reload();
    return true;
  }

  window.addEventListener('meucontrole:user-session-changed',e=>handleSession(e.detail||{}));
  window.addEventListener('pagehide',()=>{const uid=localStorage.getItem(ACTIVE_UID_KEY);if(uid)saveUser(uid)});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{style();renderStatus();setTimeout(()=>handleSession(currentSession()),100)},{once:true});else{style();renderStatus();setTimeout(()=>handleSession(currentSession()),100)}
  window.MeuControleUserDataScope={
    version:VERSION,
    activeUid:()=>localStorage.getItem(ACTIVE_UID_KEY),
    ownerUid:()=>localStorage.getItem(MIGRATION_OWNER_KEY),
    saveCurrent:()=>saveUser(localStorage.getItem(ACTIVE_UID_KEY)),
    hasWorkspace:uid=>!!loadUser(uid),
    exportCurrent:()=>clone(readWorkspace()),
    exportUser:uid=>clone(loadUser(uid)||emptyWorkspace()),
    importCurrent:(data,options)=>importWorkspace(localStorage.getItem(ACTIVE_UID_KEY),data,options),
    importUser:(uid,data,options)=>importWorkspace(uid,data,options)
  };
})();
