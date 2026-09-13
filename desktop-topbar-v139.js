/* Meu Controle — V1.39: topbar desktop pronta antes do primeiro reveal */
(function(){
  if(window.__meuControleDesktopTopbarV139Loaded)return;window.__meuControleDesktopTopbarV139Loaded=true;
  const mq=window.matchMedia('(min-width:701px)');
  function installStyles(){if(document.getElementById('desktopTopbarV139Style'))return;const st=document.createElement('style');st.id='desktopTopbarV139Style';st.textContent=`@media(min-width:701px){
    .topbar-upper{grid-template-columns:minmax(250px,1fr) auto minmax(190px,1fr)}
    .top-summary .top-stat{border:1px solid rgba(255,255,255,.22)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.035),0 2px 7px rgba(4,27,44,.055)}
    .top-summary button.top-stat:hover{border-color:rgba(255,255,255,.32)!important}
    .desktop-top-tools-v139{justify-self:end;display:flex;align-items:center;justify-content:flex-end;gap:8px;position:relative;min-width:0;width:max-content;margin-left:auto}
    .desktop-top-tools-v139 .sync-new-bell{position:relative!important;right:auto!important;top:auto!important;margin:0!important;flex:0 0 42px}
    .desktop-top-tools-v139 .sync-quick-v100{width:42px!important;min-width:42px!important;height:42px!important;padding:0!important;margin:0!important;font-size:0!important;border-radius:13px!important;flex:0 0 42px}
    .desktop-top-tools-v139 .sync-quick-v100 .sync-quick-icon{font-size:18px!important}
    .desktop-profile-btn-v139,.desktop-exit-btn-v139{width:42px;height:42px;min-width:42px;max-width:42px;padding:0;border:1px solid rgba(255,255,255,.28);border-radius:13px;background:rgba(255,255,255,.12);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:none;font:700 18px system-ui,sans-serif;flex:0 0 42px}
    .desktop-profile-btn-v139:hover,.desktop-profile-btn-v139:focus-visible,.desktop-exit-btn-v139:hover,.desktop-exit-btn-v139:focus-visible{background:rgba(255,255,255,.2);transform:none}
    .desktop-profile-menu-v139{position:absolute;right:50px;top:50px;width:230px;max-height:320px;overflow:auto;padding:7px;background:#fff;border:1px solid #dfe6e1;border-radius:13px;box-shadow:0 16px 38px rgba(0,0,0,.2);z-index:1600;color:var(--text)}
    .desktop-profile-menu-v139[hidden]{display:none!important}.desktop-profile-option-v139{width:100%;min-height:40px;padding:8px 10px;background:transparent;color:#263a30;display:flex;align-items:center;gap:9px;text-align:left;border-radius:9px;box-shadow:none}.desktop-profile-option-v139:hover{background:var(--primary-soft);transform:none}.desktop-profile-option-v139.active{background:var(--primary-soft);color:var(--primary)}.desktop-profile-check-v139{width:18px;text-align:center;font-weight:900}
    .topbar-lower .profile-filter-wrap{display:none!important}.topbar-lower{justify-content:flex-start}
  }`;document.head.appendChild(st)}
  function profileData(){try{const list=Array.isArray(profiles)?profiles:[];return [{id:'all',name:'Todos'},...list.map(p=>({id:p.id,name:p.name}))]}catch{return [{id:'all',name:'Todos'}]}}
  function currentId(){try{return typeof activeProfile!=='undefined'&&activeProfile?activeProfile:'all'}catch{return'all'}}
  function currentName(){const id=currentId();return profileData().find(p=>p.id===id)?.name||'Todos'}
  function selectProfile(id){const select=document.getElementById('profileFilter');if(!select)return;if([...select.options].some(o=>o.value===id)){select.value=id;select.dispatchEvent(new Event('change',{bubbles:true}))}updateButton()}
  function buildMenu(menu){menu.innerHTML='';const active=currentId();profileData().forEach(p=>{const b=document.createElement('button');b.type='button';b.className='desktop-profile-option-v139'+(p.id===active?' active':'');b.innerHTML=`<span class="desktop-profile-check-v139">${p.id===active?'✓':''}</span><span></span>`;b.lastElementChild.textContent=p.name;b.onclick=()=>{selectProfile(p.id);menu.hidden=true};menu.appendChild(b)})}
  function updateButton(){const btn=document.querySelector('.desktop-profile-btn-v139'),menu=document.querySelector('.desktop-profile-menu-v139');if(btn)btn.title=`Perfil em uso: ${currentName()} — clique para trocar`;if(menu&&!menu.hidden)buildMenu(menu)}
  function moveBell(tools){const bell=document.querySelector('.sync-new-bell');if(bell&&bell.parentElement!==tools)tools.insertBefore(bell,tools.firstChild)}
  function ensureExit(tools){let b=tools.querySelector('.desktop-exit-btn-v139');if(b)return b;b=document.createElement('button');b.type='button';b.className='desktop-exit-btn-v139';b.innerHTML='<span aria-hidden="true">🚪</span>';b.title='Sair do MeuControle';b.setAttribute('aria-label','Sair do MeuControle');b.onclick=()=>window.MeuControleSessionExitV045?.open?.();tools.appendChild(b);return b}
  function install(){installStyles();if(!mq.matches)return;const upper=document.querySelector('.topbar-upper');if(!upper)return;let tools=upper.querySelector('.desktop-top-tools-v139');if(!tools){tools=document.createElement('div');tools.className='desktop-top-tools-v139';const btn=document.createElement('button');btn.type='button';btn.className='desktop-profile-btn-v139';btn.setAttribute('aria-haspopup','menu');btn.setAttribute('aria-label','Trocar perfil');btn.innerHTML='<span aria-hidden="true">👤</span>';const menu=document.createElement('div');menu.className='desktop-profile-menu-v139';menu.hidden=true;btn.onclick=e=>{e.stopPropagation();buildMenu(menu);menu.hidden=!menu.hidden};menu.onclick=e=>e.stopPropagation();tools.append(btn,menu);upper.appendChild(tools)}moveBell(tools);ensureExit(tools);updateButton();document.documentElement.dataset.mcTopbarReady='1'}
  document.addEventListener('click',()=>{const m=document.querySelector('.desktop-profile-menu-v139');if(m)m.hidden=true});
  document.getElementById('profileFilter')?.addEventListener('change',()=>requestAnimationFrame(updateButton));
  window.addEventListener('meucontrole:ops-sync-complete',()=>requestAnimationFrame(()=>{install();const t=document.querySelector('.desktop-top-tools-v139');if(t)moveBell(t)}));
  mq.addEventListener?.('change',()=>requestAnimationFrame(install));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  window.MeuControleDesktopTopbarV139={version:'1.39',refresh:install};
})();