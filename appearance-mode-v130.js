/* MeuControle — V1.30.6: modo Claro / Escuro / Automático, isolado da lógica do app */
(function(){
 if(window.__mcAppearanceModeV130)return;window.__mcAppearanceModeV130=true;
 const KEY='meu_controle_color_mode_v1',mq=matchMedia('(prefers-color-scheme: dark)');
 const css=document.createElement('style');css.id='mcAppearanceModeV130Style';css.textContent=`
 body.mc-dark{--page-bg:#10171c;--text:#e7edf1;--primary-soft:#1b2c38}
 body.mc-dark{background:#10171c;color:#e7edf1}
 body.mc-dark .container,body.mc-dark .settings-page{background:#10171c}
 body.mc-dark .panel,body.mc-dark .calendar-shell,body.mc-dark .premium-cards,body.mc-dark .premium-card,body.mc-dark .settings-card,body.mc-dark .calendar-events-panel,body.mc-dark .calendar-months{background:#182229;color:#e7edf1;border-color:#2d3b44}
 body.mc-dark .premium-card strong,body.mc-dark .premium-card .premium-label,body.mc-dark .panel h2,body.mc-dark .calendar-shell h2,body.mc-dark .calendar-shell h3,body.mc-dark .settings-card h3{color:#eef3f6}
 body.mc-dark .premium-card small,body.mc-dark .dashboard-toolbar p,body.mc-dark .dashboard-hint,body.mc-dark .panel-head p,body.mc-dark .list-top p,body.mc-dark .calendar-head p,body.mc-dark .calendar-events-head p,body.mc-dark .settings-title p,body.mc-dark .settings-card p,body.mc-dark .meta,body.mc-dark .notes{color:#9eabb3}
 body.mc-dark #dashboardPage .premium-card .premium-label{color:#c4d0d7!important}
 body.mc-dark #dashboardPage .premium-card small{color:#aebbc3!important}
 body.mc-dark #dashboardPage .dashboard-toolbar p,body.mc-dark #dashboardPage .dashboard-hint{color:#9fadb5!important}
 body.mc-dark #dashboardPage .today-card .premium-label{color:#c3dce9!important}
 body.mc-dark #dashboardPage .today-card small{color:#abc4d1!important}
 body.mc-dark .today-card{background:#1a3040;border-color:#31536a}
 body.mc-dark .today-card strong{color:#d9edf9}
 body.mc-dark .item,body.mc-dark .dashboard-card,body.mc-dark .profile-row,body.mc-dark .auto-backup-row,body.mc-dark .businessday-info,body.mc-dark .recurrence-options{background:#1b262d;color:#e7edf1;border-color:#314049}
 body.mc-dark input,body.mc-dark select,body.mc-dark textarea,body.mc-dark .search-wrap{background:#121b21;color:#e7edf1;border-color:#3a4952}
 body.mc-dark input::placeholder,body.mc-dark textarea::placeholder{color:#829099}
 body.mc-dark .ghost,body.mc-dark .secondary-action{background:#26343c;color:#dce6eb}
 body.mc-dark .secondary{background:#edf3f6;color:var(--primary)}
 body.mc-dark .tabs .tab:not(.active){background:#26343c;color:#dce6eb}
 body.mc-dark .calendar-month-btn{color:#dce6eb}
 body.mc-dark .calendar-month-btn:hover{background:#24333c}
 body.mc-dark .modal-card,body.mc-dark .desktop-settings-dialog-v027{background:#172127;color:#e7edf1;border-color:#34434c}
 body.mc-dark .important-row,body.mc-dark .dashboard-detail-row{background:#1b262d;border-color:#4a4634}
 body.mc-dark .desktop-settings-card-v027{background:linear-gradient(145deg,#1b262d,#172127)!important;border-color:#304049!important;color:#e7edf1!important}
 body.mc-dark .desktop-settings-card-v027 strong{color:#eef3f6!important}
 body.mc-dark .desktop-settings-card-v027 small{color:#9eabb3!important}
 body.mc-dark .desktop-settings-dialog-head-v027 h2{color:#eef3f6!important}
 body.mc-dark .desktop-settings-close-v027{background:#26343c!important;color:#e7edf1!important}
 body.mc-dark .desktop-settings-slot-v027 .profiles-list .profile-row{background:#1b262d!important;border-color:#314049!important}
 body.mc-dark .theme-choice,body.mc-dark .appearance-choice{background:#202c33;color:#e4ebef;border-color:#35444d}
 body.mc-dark .theme-choice small{color:#9eabb3}
 body.mc-dark .appearance-choice.active{background:#263d4c;color:#e8f4fb;border-color:#54758b}
 body.mc-dark .topnav .nav-btn.active{background:#182229;color:#dcebf5}
 body.mc-dark .central-hoje-v041{background:#182229!important;border-color:#2d3b44!important;box-shadow:0 8px 24px rgba(0,0,0,.16)!important}
 body.mc-dark .central-hoje-head-v041{border-bottom-color:#2d3b44!important}
 body.mc-dark .central-hoje-head-v041 h3,body.mc-dark .central-lane-title-v041 strong{color:#eef3f6!important}
 body.mc-dark .central-hoje-head-v041 p{color:#9eabb3!important}
 body.mc-dark .central-hoje-date-v041{color:#a9c9dd!important}
 body.mc-dark .central-lane-v041{border-right-color:#2d3b44!important}
 body.mc-dark .central-item-v041{background:#1b262d!important;border-color:#314049!important}
 body.mc-dark .central-item-main-v041 strong{color:#e7edf1!important}
 body.mc-dark .central-item-main-v041 span{color:#9eabb3!important}
 body.mc-dark .central-empty-v041{background:#172127!important;border-color:#3a4952!important;color:#8f9da5!important}
 body.mc-dark .central-done-v041{background:#223139!important;border-color:#3a4c56!important;color:#b9d9eb!important}
 body.mc-dark .central-done-v041:hover{background:#29404e!important}
 body.mc-dark .central-more-v041{color:#a9c9dd!important}
 body.mc-dark .central-lane-count-v041{background:#26343c!important;color:#dce6eb!important}
 body.mc-dark .central-lane-v041.late .central-lane-count-v041{background:#432b2c!important;color:#ffb8b1!important}
 body.mc-dark .central-lane-v041.today .central-lane-count-v041{background:#203747!important;color:#b8dff7!important}
 body.mc-dark .central-lane-v041.important .central-lane-count-v041{background:#40391f!important;color:#f2d878!important}
 @media(max-width:900px) and (min-width:701px){body.mc-dark .central-lane-v041{border-bottom-color:#2d3b44!important}}
 @media(max-width:700px){
  body.mc-dark .topbar-lower{background:#10171c!important}body.mc-dark .topnav{background:#172127!important;border-top-color:#34434c!important}body.mc-dark .topnav .nav-btn{color:#a8b5bd!important}body.mc-dark .topnav .nav-btn.active{background:#223746!important;color:#dcebf5!important}
  body.mc-dark #dashboardPage .premium-card[data-dash="today"] #dashTodayMain{color:#eef7fb!important;-webkit-text-fill-color:#eef7fb!important;text-shadow:0 1px 12px rgba(121,202,241,.16)!important;opacity:1!important}
  body.mc-dark #dashboardPage #dashTodaySub{color:#c9dbe4!important}
  body.mc-dark #dashboardPage .mobile-dashboard-month-wheel{background:#182229!important;border-color:#34434c!important}
  body.mc-dark #dashboardPage .mobile-dashboard-month-slot.prev,body.mc-dark #dashboardPage .mobile-dashboard-month-slot.next{background:#182229!important;color:#b6c2c9!important}
  body.mc-dark #dashboardPage .mobile-dashboard-month-slot.current{background:#fff!important;color:var(--primary)!important;border-left-color:#dce7ee!important;border-right-color:#dce7ee!important}
  body.mc-dark #dashboardPage .mobile-dashboard-month-slot.current span{color:var(--primary)!important}
  body.mc-dark #dashboardPage .mobile-dashboard-month-slot.current .dash-month-year{color:#718078!important}
  body.mc-dark #dashboardPage .mobile-dashboard-month-slot.current::after{background:var(--primary)!important}
  body.mc-dark .central-mobile-card-v041,body.mc-dark .central-mobile-sheet-card-v041{background:#182229!important;color:#e7edf1!important;border-color:#2d3b44!important}
  body.mc-dark .central-mobile-copy-v041 strong,body.mc-dark .central-mobile-sheet-head-v041 h3{color:#eef3f6!important}
  body.mc-dark .central-mobile-copy-v041 span,body.mc-dark .central-mobile-sheet-head-v041 p{color:#b4c0c7!important}
  body.mc-dark .central-mobile-sheet-grid-v041 .central-lane-v041{border-color:#314049!important}
  body.mc-dark .central-mobile-card-v041 .late,body.mc-dark .central-mobile-card-v041 [data-kind="late"],body.mc-dark .central-mobile-card-v041 [data-status="late"]{background:#3b2528!important;color:#ffb8b1!important}
  body.mc-dark .central-mobile-card-v041 .today,body.mc-dark .central-mobile-card-v041 [data-kind="today"],body.mc-dark .central-mobile-card-v041 [data-status="today"]{background:#203747!important;color:#c7e5f7!important}
  body.mc-dark .central-mobile-card-v041 .important,body.mc-dark .central-mobile-card-v041 [data-kind="important"],body.mc-dark .central-mobile-card-v041 [data-status="important"]{background:#40391f!important;color:#f2d878!important}

  /* Lançamentos mobile — acabamento dark sem alterar geometria ou comportamento. */
  body.mc-dark #launchesPage .mobile-launch-subtitle{color:#aebbc3!important}
  body.mc-dark #launchesPage .mobile-launch-card{background:#182229!important;color:#e7edf1!important;border-color:#34434c!important;box-shadow:0 7px 20px rgba(0,0,0,.16)!important}
  body.mc-dark #launchesPage .mobile-launch-card strong{color:#eef3f6!important}
  body.mc-dark #launchesPage .mobile-launch-card small{color:#aebbc3!important}
  body.mc-dark #launchesPage .mobile-launch-arrow{color:#8fa1aa!important}
  body.mc-dark #launchesPage .mobile-launch-icon{background:#203747!important;color:#62b8e6!important}
  body.mc-dark #launchesPage .mobile-launch-back{color:#72b9df!important}
  body.mc-dark #launchesPage .panel-head p,body.mc-dark #launchesPage .list-top p{color:#aebbc3!important}
  body.mc-dark #launchesPage #entryForm label,body.mc-dark #launchesPage #entryForm label>span{color:#c2ced4!important}
  body.mc-dark #launchesPage #entryForm .important-toggle{background:#202c33!important;color:#e7edf1!important;border-color:#3a4952!important}
  body.mc-dark #launchesPage #entryForm .important-toggle span,body.mc-dark #launchesPage #entryForm .important-toggle span::after{color:#dce6eb!important}
  body.mc-dark #launchesPage #entryForm .businessday-toggle{color:#b9c5cb!important}
  body.mc-dark #launchesPage #entryForm input::placeholder,body.mc-dark #launchesPage #entryForm textarea::placeholder{color:#8e9ca4!important;opacity:1!important}
  body.mc-dark #launchesPage #entryForm input,body.mc-dark #launchesPage #entryForm select,body.mc-dark #launchesPage #entryForm textarea{color:#eef3f6!important}
  body.mc-dark #launchesPage.mobile-launch-list .search-wrap input{color:#eef3f6!important}
  body.mc-dark #launchesPage.mobile-launch-list .search-wrap input::placeholder{color:#94a3ab!important;opacity:1!important}
  body.mc-dark #launchesPage.mobile-launch-list .tabs .tab:not(.active){background:#26343c!important;color:#c5d0d6!important;border-color:#314049!important}
  body.mc-dark #launchesPage.mobile-launch-list .mobile-month-header,body.mc-dark #launchesPage.mobile-launch-list .mobile-month-header.tone-1,body.mc-dark #launchesPage.mobile-launch-list .mobile-month-header.tone-2{background:linear-gradient(90deg,#26343c,#202b32)!important;border-color:#3a4952!important}
  body.mc-dark #launchesPage.mobile-launch-list .mobile-month-header strong{color:#d9e7ef!important}
  body.mc-dark #launchesPage.mobile-launch-list .mobile-month-header span{color:#aebbc3!important}
  body.mc-dark #launchesPage.mobile-launch-list .mobile-month-header.tone-1{border-left-color:rgba(var(--primary-rgb),.58)!important}
  body.mc-dark #launchesPage.mobile-launch-list .mobile-month-header.tone-2{border-left-color:rgba(209,168,0,.78)!important}
  body.mc-dark #launchesPage.mobile-launch-list .mobile-done-header{background:linear-gradient(90deg,#202b31,#1c272d)!important;border-top-color:#3a4952!important;border-bottom-color:#314049!important;color:#aeb9bf!important}
  body.mc-dark #launchesPage.mobile-launch-list .mobile-done-header strong{color:#bdc9cf!important}
  body.mc-dark #launchesPage.mobile-launch-list .mobile-done-header span{color:#9eabb3!important}
  body.mc-dark #launchesPage.mobile-launch-list .item:not(.late) .meta{color:#aebbc3!important}
  body.mc-dark #launchesPage.mobile-launch-list .item.late:not(.done) .meta{color:#ef6a6a!important}
 }
 `;document.head.appendChild(css);
 function mode(){return localStorage.getItem(KEY)||'auto'}
 function apply(){const m=mode(),dark=m==='dark'||(m==='auto'&&mq.matches);document.body.classList.toggle('mc-dark',dark);document.documentElement.style.colorScheme=dark?'dark':'light';document.querySelectorAll('[data-color-mode]').forEach(b=>b.classList.toggle('active',b.dataset.colorMode===m));const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=dark?'#10171c':getComputedStyle(document.body).getPropertyValue('--primary').trim()||'#164f78'}
 function install(){const card=[...document.querySelectorAll('.settings-card')].find(c=>(c.querySelector('h3')?.textContent||'').trim()==='Aparência');if(!card||card.querySelector('#mcColorModeV130'))return;const box=document.createElement('div');box.id='mcColorModeV130';box.className='appearance-group';box.innerHTML='<span class="appearance-label">Modo</span><div class="choice-row"><button type="button" class="appearance-choice" data-color-mode="light">☀ Claro</button><button type="button" class="appearance-choice" data-color-mode="dark">☾ Escuro</button><button type="button" class="appearance-choice" data-color-mode="auto">◐ Automático</button></div><small style="display:block;margin-top:7px;opacity:.72;line-height:1.35">Automático acompanha o tema claro ou escuro do aparelho.</small>';const themeGroup=[...card.querySelectorAll('.appearance-group')].find(g=>g.querySelector('.appearance-label')?.textContent.trim()==='Tema');if(themeGroup)card.insertBefore(box,themeGroup);else card.appendChild(box);box.querySelectorAll('[data-color-mode]').forEach(b=>b.onclick=()=>{localStorage.setItem(KEY,b.dataset.colorMode);apply()});apply()}
 mq.addEventListener?.('change',()=>{if(mode()==='auto')apply()});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{install();apply()},{once:true});else{install();apply()}
 window.addEventListener('focus',install);setTimeout(install,700);setTimeout(install,2200);
 window.MeuControleAppearanceModeV130={apply,mode};
})();