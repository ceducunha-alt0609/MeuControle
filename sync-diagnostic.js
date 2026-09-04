/* MeuControle — Sincronização V0.1: diagnóstico seguro, sem leitura/gravação na nuvem */
(()=>{
  if(window.__meuControleSyncDiagnosticLoaded)return;
  window.__meuControleSyncDiagnosticLoaded=true;

  const ENTRIES_KEY='meu_controle_entries_v2';
  const PROFILES_KEY='meu_controle_profiles_v2';
  const DEVICE_KEY='meu_controle_device_id_v1';
  const MODE_KEY='meu_controle_sync_mode_v1';

  function jsonArray(key){
    try{const v=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(v)?v:[]}catch{return[]}
  }
  function deviceId(){
    let id=localStorage.getItem(DEVICE_KEY);
    if(!id){
      id=(crypto?.randomUUID?.()||`dev-${Date.now()}-${Math.random().toString(16).slice(2)}`);
      localStorage.setItem(DEVICE_KEY,id);
    }
    return id;
  }
  function summary(){
    const entries=jsonArray(ENTRIES_KEY);
    const profiles=jsonArray(PROFILES_KEY);
    return {
      entries:entries.length,
      profiles:profiles.length,
      entriesWithId:entries.filter(e=>e&&e.id).length,
      entriesMissingUpdatedAt:entries.filter(e=>e&&e.id&&!e.updatedAt).length,
      deviceId:deviceId()
    };
  }
  function shortId(id){return id.length>16?`${id.slice(0,8)}…${id.slice(-6)}`:id}
  function syncBox(){return document.querySelector('#settingsPage .firebase-sync-box')}
  function ensure(){
    const parent=syncBox();
    if(!parent)return null;
    let box=parent.querySelector('.sync-diagnostic-box');
    if(box)return box;

    const style=document.createElement('style');
    style.textContent=`
      .sync-diagnostic-box{margin-top:12px;padding:12px;border:1px solid #e4eae7;border-radius:12px;background:#fbfcfb}
      .sync-diagnostic-title{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px}
      .sync-diagnostic-title strong{font-size:12px;color:var(--text)}
      .sync-diagnostic-pill{padding:4px 7px;border-radius:999px;background:#f2f4f3;color:#68746e;font-size:9px;font-weight:800;white-space:nowrap}
      .sync-diagnostic-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
      .sync-diagnostic-item{padding:8px 9px;border-radius:9px;background:#f5f7f6;min-width:0}
      .sync-diagnostic-item span{display:block;font-size:9px;color:#78827d;margin-bottom:2px}
      .sync-diagnostic-item strong{display:block;font-size:11px;color:#394740;overflow-wrap:anywhere}
      .sync-diagnostic-note{margin:9px 0 0!important;font-size:10px!important;line-height:1.45!important;color:#6e7973!important}
      .sync-diagnostic-refresh{margin-top:9px;width:100%;min-height:36px}
      @media(max-width:700px){.sync-diagnostic-grid{grid-template-columns:1fr 1fr}}
    `;
    document.head.appendChild(style);

    box=document.createElement('div');
    box.className='sync-diagnostic-box';
    box.innerHTML=`
      <div class="sync-diagnostic-title"><strong>Diagnóstico da sincronização</strong><span class="sync-diagnostic-pill">V0.1 • seguro</span></div>
      <div class="sync-diagnostic-grid">
        <div class="sync-diagnostic-item"><span>Lançamentos locais</span><strong data-sync-entries>—</strong></div>
        <div class="sync-diagnostic-item"><span>Perfis locais</span><strong data-sync-profiles>—</strong></div>
        <div class="sync-diagnostic-item"><span>Identificação</span><strong data-sync-ids>—</strong></div>
        <div class="sync-diagnostic-item"><span>Dispositivo</span><strong data-sync-device>—</strong></div>
        <div class="sync-diagnostic-item"><span>Nuvem</span><strong data-sync-cloud>Bloqueada por segurança</strong></div>
        <div class="sync-diagnostic-item"><span>Sincronização</span><strong data-sync-mode>Desativada</strong></div>
      </div>
      <p class="sync-diagnostic-note">Nenhum lançamento é enviado, alterado ou excluído no Firebase nesta etapa. O diagnóstico apenas lê a base local deste aparelho.</p>
      <button type="button" class="secondary-action sync-diagnostic-refresh">Atualizar diagnóstico</button>`;
    parent.appendChild(box);
    box.querySelector('.sync-diagnostic-refresh').addEventListener('click',render);
    return box;
  }
  function render(){
    const box=ensure();if(!box)return;
    const s=summary();
    box.querySelector('[data-sync-entries]').textContent=String(s.entries);
    box.querySelector('[data-sync-profiles]').textContent=String(s.profiles);
    box.querySelector('[data-sync-ids]').textContent=s.entries?`${s.entriesWithId}/${s.entries} com ID`:'Base vazia';
    box.querySelector('[data-sync-device]').textContent=shortId(s.deviceId);
    const user=window.MeuControleCloud?.currentUser?.();
    box.querySelector('[data-sync-cloud]').textContent=user?'Conectada • sem dados':'Aguardando login';
    box.querySelector('[data-sync-mode]').textContent='Desativada';
  }

  localStorage.setItem(MODE_KEY,'diagnostic');
  const api={
    version:'0.1',
    mode:'diagnostic',
    enabled:false,
    deviceId:deviceId(),
    localSummary:summary,
    refresh:render
  };
  window.MeuControleSync=api;
  if(window.MeuControleCloud)window.MeuControleCloud.sync=api;

  window.addEventListener('meucontrole:firebase-ready',()=>{
    if(window.MeuControleCloud)window.MeuControleCloud.sync=api;
    setTimeout(render,50);
  });
  window.addEventListener('meucontrole:auth-changed',()=>setTimeout(render,50));
  window.addEventListener('storage',e=>{if(e.key===ENTRIES_KEY||e.key===PROFILES_KEY)render()});
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-settings-detail="data"]')||e.target.closest('.mobile-settings-back'))setTimeout(render,80);
  });
  window.addEventListener('load',()=>{setTimeout(render,250);setTimeout(render,800)});
})();
