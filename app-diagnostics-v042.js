/* MeuControle — V0.42.1: diagnóstico geral + card mobile */
(function(){
  if(window.__meuControleAppDiagnosticsV042Loaded)return;
  window.__meuControleAppDiagnosticsV042Loaded=true;
  const VERSION='0.42.1';
  const LAST_SYNC_KEY='meu_controle_last_sync_success_v018';
  const ENTRIES_KEY='meu_controle_entries_v2';
  const PROFILES_KEY='meu_controle_profiles_v2';
  const AUTO_BACKUPS_KEY='meu_controle_auto_backups_v2';
  const isMobile=()=>matchMedia('(max-width:700px)').matches;
  const safeJSON=(key,fallback=[])=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
  const fmtDateTime=iso=>{if(!iso)return'Ainda não realizada';const d=new Date(iso);if(Number.isNaN(d.getTime()))return'Indisponível';return d.toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})};
  const bytes=n=>!Number.isFinite(n)?'Indisponível':n<1024?`${n} B`:n<1048576?`${(n/1024).toFixed(1)} KB`:`${(n/1048576).toFixed(1)} MB`;
  const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;

  function installStyles(){
    if(document.getElementById('appDiagnosticsV042Style'))return;
    const st=document.createElement('style');st.id='appDiagnosticsV042Style';st.textContent=`
      .mc-appdiag-v042{margin-top:16px;padding-top:15px;border-top:1px solid #e2e9e5}
      .mc-appdiag-head-v042{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.mc-appdiag-head-v042 h4{margin:0;font-size:15px;color:#2b4035}.mc-appdiag-head-v042 p{margin:4px 0 0!important;font-size:11px!important;color:#748079!important;line-height:1.45!important}
      .mc-appdiag-state-v042{padding:5px 8px;border-radius:8px;background:#edf5fa;color:#164f78;font:800 10px system-ui,sans-serif;white-space:nowrap}
      .mc-appdiag-grid-v042{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:12px}.mc-appdiag-item-v042{padding:10px 11px;border:1px solid #e5ebe7;border-radius:10px;background:#fafcfb;min-width:0}.mc-appdiag-item-v042 span{display:block;font-size:9px;color:#7b8780;text-transform:uppercase;letter-spacing:.035em}.mc-appdiag-item-v042 strong{display:block;margin-top:4px;font-size:11px;color:#34473d;overflow-wrap:anywhere}
      .mc-appdiag-actions-v042{display:flex;gap:8px;margin-top:11px}.mc-appdiag-actions-v042 button{min-height:38px!important;padding:8px 12px!important;font-size:11px!important}.mc-appdiag-copy-v042{background:var(--primary)!important;color:#fff!important}.mc-appdiag-note-v042{margin:10px 0 0!important;font-size:10px!important;color:#7a8580!important;line-height:1.45!important}
      .mc-appdiag-mobile-arrow-v042{display:none;color:#9aa69f;font:700 24px system-ui,sans-serif}
      .mc-appdiag-backdrop-v042{position:fixed;inset:0;z-index:100650;background:rgba(13,29,40,.5);backdrop-filter:blur(5px);display:flex;align-items:flex-end;padding:14px}.mc-appdiag-sheet-v042{width:100%;max-height:86vh;overflow:auto;background:#fff;border-radius:20px 20px 15px 15px;padding:18px 16px calc(18px + env(safe-area-inset-bottom,0px));box-shadow:0 -16px 45px rgba(0,0,0,.22);color:#263a30}.mc-appdiag-sheet-head-v042{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}.mc-appdiag-sheet-head-v042 h3{margin:0;font-size:19px}.mc-appdiag-sheet-head-v042 p{margin:4px 0 0;font-size:11px;color:#748079}.mc-appdiag-sheet-close-v042{width:36px;height:36px;padding:0!important;border:0!important;border-radius:10px!important;background:#eef3f0!important;color:#526158!important;font-size:20px!important;box-shadow:none!important}
      @media(max-width:700px){
        .mc-appdiag-v042{margin-top:16px;padding:0;border:1px solid #e2e9e5;border-radius:14px;background:#fafcfb;overflow:hidden}
        .mc-appdiag-v042>.mc-appdiag-head-v042{padding:14px;align-items:center;cursor:pointer}
        .mc-appdiag-v042>.mc-appdiag-head-v042 h4{font-size:14px}.mc-appdiag-v042>.mc-appdiag-head-v042 p{font-size:10px!important;margin-top:3px!important}
        .mc-appdiag-v042>.mc-appdiag-head-v042 .mc-appdiag-state-v042{margin-left:auto}.mc-appdiag-mobile-arrow-v042{display:block}
        .mc-appdiag-v042>.mc-appdiag-grid-v042,.mc-appdiag-v042>.mc-appdiag-actions-v042,.mc-appdiag-v042>.mc-appdiag-note-v042{display:none!important}
        .mc-appdiag-sheet-v042 .mc-appdiag-grid-v042{grid-template-columns:1fr 1fr}.mc-appdiag-sheet-v042 .mc-appdiag-actions-v042{display:grid;grid-template-columns:1fr 1fr}.mc-appdiag-sheet-v042 .mc-appdiag-actions-v042 button{width:100%}
      }
    `;document.head.appendChild(st);
  }

  async function collect(){
    const entries=safeJSON(ENTRIES_KEY,[]),profiles=safeJSON(PROFILES_KEY,[]),backups=safeJSON(AUTO_BACKUPS_KEY,[]);
    const pending=Array.isArray(entries)?entries.filter(e=>e&&!e.done).length:0,done=Array.isArray(entries)?entries.filter(e=>e&&e.done).length:0;
    let sw='Não suportado',cache='Indisponível',storage='Indisponível';
    try{if('serviceWorker'in navigator){const reg=await navigator.serviceWorker.getRegistration();sw=navigator.serviceWorker.controller?'Ativo ✓':reg?.active?'Ativo • aguardando controle':(reg?.installing||reg?.waiting)?'Atualizando…':'Registrado, sem worker ativo'}}catch{sw='Erro ao verificar'}
    try{const keys=await caches.keys(),own=keys.filter(k=>k.startsWith('meu-controle-'));cache=own.length?own.sort().slice(-1)[0]:'Nenhum cache do app'}catch{}
    try{const est=await navigator.storage?.estimate?.();if(est&&Number.isFinite(est.usage))storage=`${bytes(est.usage)} usados`}catch{}
    let cloud='Carregando…';if(window.MeuControleCloud){try{cloud=window.MeuControleCloud.currentUser?.()?'Conta conectada ✓':'Sem login'}catch{cloud='Disponível'}}
    return{version:'MeuControle 2.0',module:`Diagnóstico ${VERSION}`,online:navigator.onLine?'Online ✓':'Offline',installed:isStandalone()?'Instalado ✓':'Navegador',sw,cache,cloud,lastSync:fmtDateTime(localStorage.getItem(LAST_SYNC_KEY)||''),entries:Array.isArray(entries)?entries.length:0,pending,done,profiles:Array.isArray(profiles)?profiles.length:0,backups:Array.isArray(backups)?backups.length:0,storage,generated:new Date().toLocaleString('pt-BR')};
  }

  function diagnosticText(d){return ['MEUCONTROLE — DIAGNÓSTICO',`Gerado em: ${d.generated}`,`Versão: ${d.version}`,`Módulo: ${d.module}`,`Conexão: ${d.online}`,`Execução: ${d.installed}`,`Service Worker: ${d.sw}`,`Cache: ${d.cache}`,`Firebase: ${d.cloud}`,`Última sincronização: ${d.lastSync}`,`Lançamentos locais: ${d.entries} (${d.pending} pendentes / ${d.done} concluídos)`,`Perfis locais: ${d.profiles}`,`Backups automáticos: ${d.backups}`,`Armazenamento do site: ${d.storage}`].join('\n')}
  function detailHTML(){return `<div class="mc-appdiag-grid-v042"><div class="mc-appdiag-item-v042"><span>Versão</span><strong data-diag="version">—</strong></div><div class="mc-appdiag-item-v042"><span>Conexão</span><strong data-diag="online">—</strong></div><div class="mc-appdiag-item-v042"><span>Execução</span><strong data-diag="installed">—</strong></div><div class="mc-appdiag-item-v042"><span>Service Worker</span><strong data-diag="sw">—</strong></div><div class="mc-appdiag-item-v042"><span>Cache</span><strong data-diag="cache">—</strong></div><div class="mc-appdiag-item-v042"><span>Firebase</span><strong data-diag="cloud">—</strong></div><div class="mc-appdiag-item-v042"><span>Última sincronização</span><strong data-diag="lastSync">—</strong></div><div class="mc-appdiag-item-v042"><span>Lançamentos</span><strong data-diag="entries">—</strong></div><div class="mc-appdiag-item-v042"><span>Perfis</span><strong data-diag="profiles">—</strong></div><div class="mc-appdiag-item-v042"><span>Backups automáticos</span><strong data-diag="backups">—</strong></div><div class="mc-appdiag-item-v042"><span>Armazenamento</span><strong data-diag="storage">—</strong></div></div><div class="mc-appdiag-actions-v042"><button type="button" class="secondary-action mc-appdiag-refresh-v042">Atualizar diagnóstico</button><button type="button" class="mc-appdiag-copy-v042">Copiar diagnóstico</button></div><p class="mc-appdiag-note-v042">O relatório não inclui descrições dos lançamentos, e-mail da conta, identificadores do dispositivo ou outros dados pessoais.</p>`}

  async function render(){
    const d=await collect(),map={version:d.version,online:d.online,installed:d.installed,sw:d.sw,cache:d.cache,cloud:d.cloud,lastSync:d.lastSync,entries:`${d.entries} • ${d.pending} pendentes`,profiles:String(d.profiles),backups:String(d.backups),storage:d.storage};
    document.querySelectorAll('.mc-appdiag-v042,.mc-appdiag-sheet-v042').forEach(box=>{box._diag=d;Object.entries(map).forEach(([k,v])=>box.querySelectorAll(`[data-diag="${k}"]`).forEach(el=>el.textContent=v));box.querySelectorAll('.mc-appdiag-state-v042').forEach(state=>{state.textContent=navigator.onLine?'Sistema verificado ✓':'Modo offline';state.style.background=navigator.onLine?'#edf5fa':'#fff4df';state.style.color=navigator.onLine?'#164f78':'#8a5b1d'})});
  }

  async function copyFrom(box,btn){const d=box?._diag||await collect(),text=diagnosticText(d);try{await navigator.clipboard.writeText(text)}catch{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch{}ta.remove()}const old=btn.textContent;btn.textContent='Copiado ✓';setTimeout(()=>btn.textContent=old,1600)}
  function bindActions(root){root.querySelectorAll('.mc-appdiag-refresh-v042').forEach(b=>b.onclick=render);root.querySelectorAll('.mc-appdiag-copy-v042').forEach(b=>b.onclick=()=>copyFrom(root,b))}
  function closeSheet(){document.querySelector('.mc-appdiag-backdrop-v042')?.remove();document.body.style.overflow=''}
  function openSheet(){if(!isMobile()||document.querySelector('.mc-appdiag-backdrop-v042'))return;const bd=document.createElement('div');bd.className='mc-appdiag-backdrop-v042';bd.innerHTML=`<section class="mc-appdiag-sheet-v042" role="dialog" aria-modal="true" aria-label="Diagnóstico do aplicativo"><div class="mc-appdiag-sheet-head-v042"><div><h3>Diagnóstico do aplicativo</h3><p>Estado técnico do MeuControle neste aparelho.</p></div><button type="button" class="mc-appdiag-sheet-close-v042" aria-label="Fechar">×</button></div>${detailHTML()}</section>`;document.body.appendChild(bd);document.body.style.overflow='hidden';bd.querySelector('.mc-appdiag-sheet-close-v042').onclick=closeSheet;bd.onclick=e=>{if(e.target===bd)closeSheet()};bindActions(bd.querySelector('.mc-appdiag-sheet-v042'));render()}

  function ensure(){
    installStyles();const help=document.querySelector('.mc-help-card-v037');if(!help)return null;let box=help.querySelector('.mc-appdiag-v042');if(box)return box;
    box=document.createElement('section');box.className='mc-appdiag-v042';box.innerHTML=`<div class="mc-appdiag-head-v042" role="button" tabindex="0" aria-label="Abrir diagnóstico do aplicativo"><div><h4>Diagnóstico do aplicativo</h4><p>Estado técnico do MeuControle neste aparelho. Apenas leitura.</p></div><span class="mc-appdiag-state-v042">Verificando…</span><span class="mc-appdiag-mobile-arrow-v042">›</span></div>${detailHTML()}`;help.appendChild(box);bindActions(box);const head=box.querySelector('.mc-appdiag-head-v042');head.onclick=()=>{if(isMobile())openSheet()};head.onkeydown=e=>{if(isMobile()&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openSheet()}};return box;
  }

  function boot(){const box=ensure();if(box)render();else setTimeout(boot,250)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,80),{once:true});else setTimeout(boot,80);
  window.addEventListener('online',render);window.addEventListener('offline',render);window.addEventListener('meucontrole:auth-changed',()=>setTimeout(render,120));window.addEventListener('meucontrole:sync-manual-v012-complete',()=>setTimeout(render,180));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});document.addEventListener('click',e=>{if(e.target.closest('[data-settings-kind="help"]')||e.target.closest('[data-more="help-v037"]'))setTimeout(()=>{ensure();render()},120)});
  window.MeuControleAppDiagnosticsV042={version:VERSION,refresh:render,collect,open:openSheet};
})();
