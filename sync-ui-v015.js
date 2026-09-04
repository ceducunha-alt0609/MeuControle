/* MeuControle — V0.15: atualização imediata pós-sync + alerta interno de novidades */
(()=>{
 if(window.__meuControleSyncUiV015Loaded)return;window.__meuControleSyncUiV015Loaded=true;
 const VERSION='0.15',NEW_KEY='meu_controle_sync_new_received_v1';
 const getPending=()=>Math.max(0,Number(localStorage.getItem(NEW_KEY)||0)||0);
 const setPending=n=>{n=Math.max(0,Number(n)||0);if(n)localStorage.setItem(NEW_KEY,String(n));else localStorage.removeItem(NEW_KEY);renderBell(n)};
 function refreshFromStorage(){
  try{
   if(typeof loadEntries==='function')entries=loadEntries();
   if(typeof renderAll==='function')renderAll();
   if(typeof updateAutoBackupLabel==='function')updateAutoBackupLabel();
  }catch(e){console.warn('MeuControle V0.15: não foi possível atualizar a interface após sincronização.',e)}
 }
 function ensureBell(){
  let bell=document.querySelector('.sync-new-bell');if(bell)return bell;
  const brand=document.querySelector('.topbar .brand');if(!brand)return null;
  const st=document.createElement('style');st.textContent=`
   .sync-new-bell{display:none;position:relative;margin-left:auto;flex:0 0 auto;width:42px;height:42px;padding:0;border:1px solid rgba(255,255,255,.28);border-radius:13px;background:rgba(255,255,255,.12)!important;color:#fff!important;font-family:system-ui,sans-serif;font-size:21px;align-items:center;justify-content:center;box-shadow:none!important}
   .sync-new-bell.show{display:flex}.sync-new-bell-count{position:absolute;right:-5px;top:-6px;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:#d27a00;color:#fff;font:800 11px/20px system-ui,sans-serif;text-align:center;border:2px solid var(--primary,#164f78)}
   @media(max-width:700px){.topbar .brand{display:flex!important;align-items:center!important;width:100%!important}.sync-new-bell{width:40px;height:40px;margin-left:auto}}
  `;document.head.appendChild(st);
  bell=document.createElement('button');bell.type='button';bell.className='sync-new-bell';bell.setAttribute('aria-label','Novos lançamentos recebidos');bell.title='Novos lançamentos recebidos';bell.innerHTML='<span aria-hidden="true">🔔</span><span class="sync-new-bell-count">0</span>';
  brand.appendChild(bell);
  bell.onclick=()=>{
   setPending(0);
   try{if(typeof showPage==='function')showPage('launches');else document.querySelector('.nav-btn[data-page="launches"]')?.click()}catch{}
   setTimeout(()=>{const page=document.getElementById('launchesPage');if(matchMedia('(max-width:700px)').matches&&page){page.classList.remove('mobile-launch-form');page.classList.add('mobile-launch-list')}window.scrollTo({top:0,behavior:'smooth'})},40);
  };
  return bell;
 }
 function renderBell(n=getPending()){
  const bell=ensureBell();if(!bell)return;
  const count=bell.querySelector('.sync-new-bell-count');if(count)count.textContent=n>99?'99+':String(n);
  bell.classList.toggle('show',n>0);
  bell.setAttribute('aria-label',n===1?'1 novo lançamento recebido':`${n} novos lançamentos recebidos`);
 }
 function markVersion(){
  const pill=document.querySelector('.sync-operational-pill');if(pill)pill.textContent=`V${VERSION}`;
 }
 window.addEventListener('meucontrole:sync-manual-v012-complete',e=>{
  const received=Math.max(0,Number(e.detail?.received)||0);
  refreshFromStorage();
  if(received)setPending(getPending()+received);else renderBell();
  setTimeout(()=>{refreshFromStorage();markVersion()},80);
 });
 window.addEventListener('load',()=>setTimeout(()=>{renderBell();markVersion()},2050));
 window.addEventListener('meucontrole:auth-changed',()=>setTimeout(markVersion,650));
 document.addEventListener('click',e=>{if(e.target.closest('[data-settings-detail="data"]'))setTimeout(markVersion,650)});
 window.MeuControleSyncUiV015={version:VERSION,refresh:refreshFromStorage,pending:getPending,clear:()=>setPending(0)};
})();
