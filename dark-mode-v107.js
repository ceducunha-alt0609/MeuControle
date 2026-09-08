/* MeuControle — V1.07: modo claro/escuro/sistema experimental */
(function(){
  if(window.__mcDarkModeV107)return;window.__mcDarkModeV107=true;
  const KEY='meu_controle_color_mode_v2';
  const mq=window.matchMedia('(prefers-color-scheme: dark)');
  const getMode=()=>localStorage.getItem(KEY)||'light';
  const effective=mode=>mode==='system'?(mq.matches?'dark':'light'):mode;

  const style=document.createElement('style');
  style.id='mc-dark-mode-v107-style';
  style.textContent=`
  html[data-mc-color-mode="dark"]{
    color-scheme:dark;
    --page-bg:#10171c;
    --text:#e7edf1;
    --primary-soft:#162b39;
  }
  html[data-mc-color-mode="dark"] body{background:#10171c!important;color:#e7edf1!important}
  html[data-mc-color-mode="dark"] .panel,
  html[data-mc-color-mode="dark"] .calendar-shell,
  html[data-mc-color-mode="dark"] .settings-card,
  html[data-mc-color-mode="dark"] .modal-card,
  html[data-mc-color-mode="dark"] .premium-card,
  html[data-mc-color-mode="dark"] .calendar-events-panel,
  html[data-mc-color-mode="dark"] .calendar-months,
  html[data-mc-color-mode="dark"] .item,
  html[data-mc-color-mode="dark"] .dashboard-card,
  html[data-mc-color-mode="dark"] .profile-row,
  html[data-mc-color-mode="dark"] .restore-stat,
  html[data-mc-color-mode="dark"] .important-row{background:#172127!important;border-color:#2a3942!important;color:#e7edf1!important}
  html[data-mc-color-mode="dark"] input,
  html[data-mc-color-mode="dark"] select,
  html[data-mc-color-mode="dark"] textarea,
  html[data-mc-color-mode="dark"] .search-wrap{background:#111b21!important;color:#e7edf1!important;border-color:#34454f!important}
  html[data-mc-color-mode="dark"] input::placeholder,
  html[data-mc-color-mode="dark"] textarea::placeholder{color:#7f9099!important}
  html[data-mc-color-mode="dark"] label,
  html[data-mc-color-mode="dark"] .meta,
  html[data-mc-color-mode="dark"] .notes,
  html[data-mc-color-mode="dark"] .panel-head p,
  html[data-mc-color-mode="dark"] .list-top p,
  html[data-mc-color-mode="dark"] .calendar-head p,
  html[data-mc-color-mode="dark"] .calendar-events-head p,
  html[data-mc-color-mode="dark"] .settings-title p,
  html[data-mc-color-mode="dark"] .settings-card p,
  html[data-mc-color-mode="dark"] .dashboard-toolbar p,
  html[data-mc-color-mode="dark"] .premium-card .premium-label,
  html[data-mc-color-mode="dark"] .profile-row-main span,
  html[data-mc-color-mode="dark"] .important-row-main span,
  html[data-mc-color-mode="dark"] .restore-stat span,
  html[data-mc-color-mode="dark"] .empty{color:#9cabb3!important}
  html[data-mc-color-mode="dark"] h1,
  html[data-mc-color-mode="dark"] h2,
  html[data-mc-color-mode="dark"] h3,
  html[data-mc-color-mode="dark"] strong,
  html[data-mc-color-mode="dark"] .item-title,
  html[data-mc-color-mode="dark"] .amount,
  html[data-mc-color-mode="dark"] .premium-card strong{color:#edf3f6!important}
  html[data-mc-color-mode="dark"] .topbar h1,
  html[data-mc-color-mode="dark"] .topbar strong{color:#fff!important}
  html[data-mc-color-mode="dark"] .secondary{background:#22313a!important;color:#d8e9f4!important}
  html[data-mc-color-mode="dark"] .ghost,
  html[data-mc-color-mode="dark"] .secondary-action,
  html[data-mc-color-mode="dark"] .tab{background:#24323a!important;color:#c7d3d9!important}
  html[data-mc-color-mode="dark"] .tab.active{background:var(--primary)!important;color:#fff!important}
  html[data-mc-color-mode="dark"] .recurrence-options,
  html[data-mc-color-mode="dark"] .businessday-info{background:#132028!important;border-color:#2c3c45!important;color:#c8d5db!important}
  html[data-mc-color-mode="dark"] .calendar-month-btn{color:#d0dae0!important}
  html[data-mc-color-mode="dark"] .calendar-month-btn:hover{background:#213039!important}
  html[data-mc-color-mode="dark"] .calendar-month-btn.active{background:var(--primary)!important;color:#fff!important}
  html[data-mc-color-mode="dark"] .badge{background:#22332c!important;color:#c9dfd3!important}
  html[data-mc-color-mode="dark"] .restore-warning{background:#332c19!important;border-color:#66562b!important;color:#e0c987!important}
  html[data-mc-color-mode="dark"] .modal-backdrop{background:rgba(0,0,0,.68)!important}
  html[data-mc-color-mode="dark"] .splitter::before{background:#3a4d58!important}
  html[data-mc-color-mode="dark"] .backup-status{border-color:#2c3b44!important}
  html[data-mc-color-mode="dark"] .appearance-choice,
  html[data-mc-color-mode="dark"] .theme-choice{background:#172127!important;color:#e7edf1!important;border-color:#33444e!important}
  html[data-mc-color-mode="dark"] .appearance-choice.active,
  html[data-mc-color-mode="dark"] .theme-choice.active{border-color:#5b92b5!important;box-shadow:0 0 0 1px #5b92b5 inset!important}
  html[data-mc-color-mode="dark"] .mobile-bottom-nav{background:#121b21!important;border-color:#27353d!important}
  html[data-mc-color-mode="dark"] .mobile-bottom-nav button{color:#9aabb4!important}
  html[data-mc-color-mode="dark"] .mobile-bottom-nav button.active{background:#1c2d38!important;color:#74b8e0!important}
  html[data-mc-color-mode="dark"] #calendarPage .mobile-month-wheel,
  html[data-mc-color-mode="dark"] #dashboardPage .mobile-dashboard-month-wheel{background:#172127!important;border-color:#2d3c45!important}
  html[data-mc-color-mode="dark"] #calendarPage .mobile-month-slot.current,
  html[data-mc-color-mode="dark"] #dashboardPage .mobile-dashboard-month-slot.current{background:#1b303e!important}
  html[data-mc-color-mode="dark"] #calendarPage .mobile-agenda-current{color:#dbe6eb!important}
  html[data-mc-color-mode="dark"] .mobile-settings-screen,
  html[data-mc-color-mode="dark"] .mobile-subpage,
  html[data-mc-color-mode="dark"] .mobile-page-shell{background:#10171c!important;color:#e7edf1!important}
  @media(max-width:700px){
    html[data-mc-color-mode="dark"] .container{background:#10171c!important}
    html[data-mc-color-mode="dark"] #calendarPage .calendar-events-panel,
    html[data-mc-color-mode="dark"] #calendarPage .calendar-shell{background:transparent!important}
  }
  `;
  document.head.appendChild(style);

  function apply(mode=getMode()){
    const e=effective(mode);
    document.documentElement.dataset.mcColorMode=e;
    document.documentElement.dataset.mcColorPreference=mode;
    render();
  }
  function setMode(mode){
    if(!['light','dark','system'].includes(mode))return;
    localStorage.setItem(KEY,mode);apply(mode);
  }
  function render(){
    const mode=getMode();
    document.querySelectorAll('[data-color-mode]').forEach(b=>{
      const active=b.dataset.colorMode===mode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));
    });
    const status=document.getElementById('mcColorModeStatus');if(status)status.textContent=mode==='light'?'Claro':mode==='dark'?'Escuro':`Sistema (${mq.matches?'escuro':'claro'})`;
  }
  function addControl(){
    if(document.getElementById('mcColorModeControl'))return;
    const cards=[...document.querySelectorAll('.settings-card')];const appearance=cards.find(c=>c.querySelector('h3')?.textContent.trim()==='Aparência');if(!appearance)return;
    const box=document.createElement('div');box.id='mcColorModeControl';box.className='appearance-group';
    box.innerHTML='<span class="appearance-label">Modo</span><div class="choice-row"><button type="button" class="appearance-choice" data-color-mode="light">☀ Claro</button><button type="button" class="appearance-choice" data-color-mode="dark">🌙 Escuro</button><button type="button" class="appearance-choice" data-color-mode="system">◐ Sistema</button></div><small style="display:block;margin-top:8px;opacity:.72">Modo atual: <strong id="mcColorModeStatus"></strong></small>';
    const notifications=appearance.querySelector('#systemNotificationSettings');const reset=appearance.querySelector('#resetAppearanceBtn');
    if(notifications)appearance.insertBefore(box,notifications);else if(reset)appearance.insertBefore(box,reset);else appearance.appendChild(box);
    box.querySelectorAll('[data-color-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.colorMode)));render();
  }
  function boot(){addControl();apply();setTimeout(addControl,400);setTimeout(addControl,1200)}
  mq.addEventListener?.('change',()=>{if(getMode()==='system')apply('system')});
  new MutationObserver(()=>{addControl();render()}).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.MeuControleDarkMode={setMode,getMode,apply};
})();