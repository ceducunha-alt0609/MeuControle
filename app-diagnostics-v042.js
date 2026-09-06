/* MeuControle — V0.42: diagnóstico geral do aplicativo */
(function(){
  if(window.__meuControleAppDiagnosticsV042Loaded)return;
  window.__meuControleAppDiagnosticsV042Loaded=true;
  const VERSION='0.42';
  const LAST_SYNC_KEY='meu_controle_last_sync_success_v018';
  const ENTRIES_KEY='meu_controle_entries_v2';
  const PROFILES_KEY='meu_controle_profiles_v2';
  const AUTO_BACKUPS_KEY='meu_controle_auto_backups_v2';

  const safeJSON=(key,fallback=[])=>{try{const v=JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));return v}catch{return fallback}};
  const fmtDateTime=iso=>{if(!iso)return'Ainda não realizada';const d=new Date(iso);if(Number.isNaN(d.getTime()))return'Indisponível';return d.toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})};
  const bytes=n=>{if(!Number.isFinite(n))return'Indisponível';if(n<1024)return`${n} B`;if(n<1048576)return`${(n/1024).toFixed(1)} KB`;return`${(n/1048576).toFixed(1)} MB`};
  const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;

  function installStyles(){
    if(document.getElementById('appDiagnosticsV042Style'))return;
    const st=document.createElement('style');st.id='appDiagnosticsV042Style';st.textContent=`
      .mc-appdiag-v042{margin-top:16px;padding-top:15px;border-top:1px solid #e2e9e5}
      .mc-appdiag-head-v042{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.mc-appdiag-head-v042 h4{margin:0;font-size:15px;color:#2b4035}.mc-appdiag-head-v042 p{margin:4px 0 0!important;font-size:11px!important;color:#748079!important;line-height:1.45!important}
      .mc-appdiag-state-v042{padding:5px 8px;border-radius:8px;background:#edf5fa;color:#164f78;font:800 10px system-ui,sans-serif;white-space:nowrap}
      .mc-appdiag-grid-v042{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:12px}.mc-appdiag-item-v042{padding:10px 11px;border:1px solid #e5ebe7;border-radius:10px;background:#fafcfb;min-width:0}.mc-appdiag-item-v042 span{display:block;font-size:9px;color:#7b8780;text-transform:uppercase;letter-spacing:.035em}.mc-appdiag-item-v042 strong{display:block;margin-top:4px;font-size:11px;color:#34473d;overflow-wrap:anywhere}
      .mc-appdiag-actions-v042{display:flex;gap:8px;margin-top:11px}.mc-appdiag-actions-v042 button{min-height:38px!important;padding:8px 12px!important;font-size:11px!important}.mc-appdiag-copy-v042{background:var(--primary)!important;color:#fff!important}.mc-appdiag-note-v042{margin:10px 0 0!important;font-size:10px!important;color:#7a8580!important;line-height:1.45!important}
      @media(max-width:700px){.mc-appdiag-grid-v042{grid-template-columns:1fr 1fr}.mc-appdiag-actions-v042{display:grid;grid-template-columns:1fr 1fr}.mc-appdiag-actions-v042 button{width:100%}.mc-appdiag-v042{margin-top:18px}}
    `;document.head.appendChild(st);
  }

  async function collect(){
    const entries=safeJSON(ENTRIES_KEY,[]),profiles=safeJSON(PROFILES_KEY,[]),backups=safeJSON(AUTO_BACKUPS_KEY,[]);
    const pending=Array.isArray(entries)?entries.filter(e=>e&&!e.done).length:0;
    const done=Array.isArray(entries)?entries.filter(e=>e&&e.done).length:0;
    let sw='Não suportado',cache='Indisponível',storage='Indisponível';
    try{
      if('serviceWorker' in navigator){
        const reg=await navigator.serviceWorker.getRegistration();
        if(navigator.serviceWorker.controller)sw='Ativo ✓';
        else if(reg?.active)sw='Ativo • aguardando controle';
        else if(reg?.installing||reg?.waiting)sw='Atualizando…';
        else sw='Registrado, sem worker ativo';
      }
    }catch{sw='Erro ao verificar'}
    try{const keys=await caches.keys();const own=keys.filter(k=>k.startsWith('meu-controle-'));cache=own.length?own.sort().slice(-1)[0]:'Nenhum cache do app'}catch{}
    try{const est=await navigator.storage?.estimate?.();if(est&&Number.isFinite(est.usage))storage=`${bytes(est.usage)} usados`;}catch{}
    const cloudReady=!!window.MeuControleCloud;
    let cloud='Carregando…';
    if(cloudReady){try{cloud=window.MeuControleCloud.currentUser?.()?'Conta conectada ✓':'Sem login'}catch{cloud='Disponível'}}
    const lastSync=fmtDateTime(localStorage.getItem(LAST_SYNC_KEY)||'');
    return{
      version:'MeuControle 2.0',module:`Diagnóstico ${VERSION}`,online:navigator.onLine?'Online ✓':'Offline',installed:isStandalone()?'Instalado ✓':'Navegador',sw,cache,cloud,lastSync,
      entries:Array.isArray(entries)?entries.length:0,pending,done,profiles:Array.isArray(profiles)?profiles.length:0,backups:Array.isArray(backups)?backups.length:0,storage,
      generated:new Date().toLocaleString('pt-BR')
    };
  }

  function diagnosticText(d){return [
    'MEUCONTROLE — DIAGNÓSTICO',
    `Gerado em: ${d.generated}`,
    `Versão: ${d.version}`,
    `Módulo: ${d.module}`,
    `Conexão: ${d.online}`,
    `Execução: ${d.installed}`,
    `Service Worker: ${d.sw}`,
    `Cache: ${d.cache}`,
    `Firebase: ${d.cloud}`,
    `Última sincronização: ${d.lastSync}`,
    `Lançamentos locais: ${d.entries} (${d.pending} pendentes / ${d.done} concluídos)`,
    `Perfis locais: ${d.profiles}`,
    `Backups automáticos: ${d.backups}`,
    `Armazenamento do site: ${d.storage}`
  ].join('\n')}

  async function render(){
    const box=document.querySelector('.mc-appdiag-v042');if(!box)return;
    const d=await collect();box._diag=d;
    const map={version:d.version,online:d.online,installed:d.installed,sw:d.sw,cache:d.cache,cloud:d.cloud,lastSync:d.lastSync,entries:`${d.entries} • ${d.pending} pendentes`,profiles:String(d.profiles),backups:String(d.backups),storage:d.storage};
    Object.entries(map).forEach(([k,v])=>{const el=box.querySelector(`[data-diag="${k}"]`);if(el)el.textContent=v});
    const state=box.querySelector('.mc-appdiag-state-v042');if(state){state.textContent=navigator.onLine?'Sistema verificado ✓':'Modo offline';state.style.background=navigator.onLine?'#edf5fa':'#fff4df';state.style.color=navigator.onLine?'#164f78':'#8a5b1d'}
  }

  function ensure(){
    installStyles();
    const help=document.querySelector('.mc-help-card-v037');if(!help)return null;
    let box=help.querySelector('.mc-appdiag-v042');if(box)return box;
    box=document.createElement('section');box.className='mc-appdiag-v042';box.innerHTML=`
      <div class="mc-appdiag-head-v042"><div><h4>Diagnóstico do aplicativo</h4><p>Estado técnico do MeuControle neste aparelho. Apenas leitura.</p></div><span class="mc-appdiag-state-v042">Verificando…</span></div>
      <div class="mc-appdiag-grid-v042">
        <div class="mc-appdiag-item-v042"><span>Versão</span><strong data-diag="version">—</strong></div>
        <div class="mc-appdiag-item-v042"><span>Conexão</span><strong data-diag="online">—</strong></div>
        <div class="mc-appdiag-item-v042"><span>Execução</span><strong data-diag="installed">—</strong></div>
        <div class="mc-appdiag-item-v042"><span>Service Worker</span><strong data-diag="sw">—</strong></div>
        <div class="mc-appdiag-item-v042"><span>Cache</span><strong data-diag="cache">—</strong></div>
        <div class="mc-appdiag-item-v042"><span>Firebase</span><strong data-diag="cloud">—</strong></div>
        <div class="mc-appdiag-item-v042"><span>Última sincronização</span><strong data-diag="lastSync">—</strong></div>
        <div class="mc-appdiag-item-v042"><span>Lançamentos</span><strong data-diag="entries">—</strong></div>
        <div class="mc-appdiag-item-v042"><span>Perfis</span><strong data-diag="profiles">—</strong></div>
        <div class="mc-appdiag-item-v042"><span>Backups automáticos</span><strong data-diag="backups">—</strong></div>
        <div class="mc-appdiag-item-v042"><span>Armazenamento</span><strong data-diag="storage">—</strong></div>
      </div>
      <div class="mc-appdiag-actions-v042"><button type="button" class="secondary-action mc-appdiag-refresh-v042">Atualizar diagnóstico</button><button type="button" class="mc-appdiag-copy-v042">Copiar diagnóstico</button></div>
      <p class="mc-appdiag-note-v042">O relatório não inclui descrições dos lançamentos, e-mail da conta, identificadores do dispositivo ou outros dados pessoais.</p>`;
    help.appendChild(box);
    box.querySelector('.mc-appdiag-refresh-v042').onclick=render;
    box.querySelector('.mc-appdiag-copy-v042').onclick=async()=>{const d=box._diag||await collect(),text=diagnosticText(d),btn=box.querySelector('.mc-appdiag-copy-v042');try{await navigator.clipboard.writeText(text);const old=btn.textContent;btn.textContent='Copiado ✓';setTimeout(()=>btn.textContent=old,1600)}catch{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');btn.textContent='Copiado ✓';setTimeout(()=>btn.textContent='Copiar diagnóstico',1600)}catch{}ta.remove()}};
    return box;
  }

  function boot(){const box=ensure();if(box)render();else setTimeout(boot,250)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,80),{once:true});else setTimeout(boot,80);
  window.addEventListener('online',render);window.addEventListener('offline',render);window.addEventListener('meucontrole:auth-changed',()=>setTimeout(render,120));window.addEventListener('meucontrole:sync-manual-v012-complete',()=>setTimeout(render,180));
  document.addEventListener('click',e=>{if(e.target.closest('[data-settings-kind="help"]')||e.target.closest('[data-more="help-v037"]'))setTimeout(()=>{ensure();render()},120)});
  window.MeuControleAppDiagnosticsV042={version:VERSION,refresh:render,collect};
})();
