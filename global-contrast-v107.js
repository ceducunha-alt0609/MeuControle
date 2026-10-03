/* MeuControle — V1.07.2: refinamento de contraste da Central Hoje e navegação mobile */
(()=>{
  if(window.__mcGlobalContrastV107)return;window.__mcGlobalContrastV107=true;
  const st=document.createElement('style');st.id='mcGlobalContrastV107Style';st.textContent=`
    :root{--mc-text-strong:#20312a;--mc-text-body:#34483e;--mc-text-secondary:#53635a;--mc-text-muted:#647269;--mc-placeholder:#66766d;--mc-chip-text:#355541;--mc-inactive-text:#4f6257;--mc-border-readable:#c8d4cd}
    .panel-head p,.list-top p,.calendar-head p,.calendar-events-head p,.settings-title p,.settings-card p,.dashboard-toolbar p,.modal-head p,.dashboard-card span,.profile-row-main span,.important-row-main span,.restore-stat span,.meta,.notes,.empty{color:var(--mc-text-secondary)!important}
    input::placeholder,textarea::placeholder{color:var(--mc-placeholder)!important;opacity:1!important}.badge{color:var(--mc-chip-text)!important}.tab:not(.active),.calendar-month-btn:not(.active){color:var(--mc-inactive-text)!important}.search-wrap{border-color:var(--mc-border-readable)!important}.search-wrap span{color:#536b5d!important}input,select,textarea{border-color:#c7d2cc}
    .brand p{opacity:1!important;color:rgba(255,255,255,.92)!important}.top-stat span{opacity:1!important;color:rgba(255,255,255,.9)!important}.premium-card:not(.late-card):not(.important-card) .premium-label{color:#56685e!important}.premium-card:not(.late-card):not(.important-card) small{color:#5d6d64!important}.dashboard-hint{color:#5d6d64!important}.central-hoje-head-v041 p{color:#5b6b62!important}.central-item-main-v041 span{color:#617169!important}.central-empty-v041{color:#6a7770!important}.central-mobile-copy-v041>span:not(.central-mobile-badges-v041){color:#5f6e66!important}.central-mobile-sheet-head-v041 p{color:#5f6e66!important}.central-mobile-arrow-v041{color:#718078!important}
    button:focus-visible,[role="button"]:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid rgba(var(--primary-rgb),.34)!important;outline-offset:2px!important}
    #dashboardPage .premium-card:focus-visible,#dashboardPage .central-mobile-card-v041:focus-visible,#dashboardPage .central-more-v041:focus-visible{box-shadow:0 0 0 4px rgba(var(--primary-rgb),.12),0 8px 22px rgba(22,79,120,.09)!important}
    @media(max-width:700px){
      #calendarPage .mobile-month-slot.prev,#calendarPage .mobile-month-slot.next,#dashboardPage .mobile-dashboard-month-slot.prev,#dashboardPage .mobile-dashboard-month-slot.next{color:#66766d!important}
      #dashboardPage .premium-card.today-card #dashTodaySub{color:#5d6d64!important}
      #calendarPage .calendar-search input::placeholder,#launchesPage input::placeholder{color:#66766d!important}
      button,.premium-card,.central-mobile-card-v041{touch-action:manipulation}

      /* Contraste mobile: sem alterar medidas, posição ou comportamento. */
      .central-mobile-card-v041{background:#fbfdfc!important;border-color:#c7d5ce!important}
      .central-mobile-copy-v041 strong{color:#21372d!important}
      .central-mobile-copy-v041>span:not(.central-mobile-badges-v041){color:#52655b!important}
      .central-mobile-arrow-v041{color:#526a5e!important}
      .central-mobile-badge-v041{background:#e8efeb!important;color:#465c50!important}
      .central-mobile-badge-v041.late{background:#f9dfdc!important;color:#8b312b!important}
      .central-mobile-badge-v041.today{background:#dcecf6!important;color:#154f78!important}
      .central-mobile-badge-v041.important{background:#f7ecc4!important;color:#765b00!important}

      .topnav{background:#f8fbfd!important;border-top-color:#c9d6dd!important;box-shadow:0 -5px 18px rgba(18,48,68,.13)!important}
      .topnav .nav-btn{color:#4f6470!important}
      .topnav .nav-btn.active{background:rgba(var(--primary-rgb),.14)!important;color:var(--primary-dark)!important}

      body.mc-dark .central-mobile-card-v041{background:#1b2830!important;border-color:#405562!important;box-shadow:0 7px 20px rgba(0,0,0,.22)!important}
      body.mc-dark .central-mobile-copy-v041 strong{color:#f2f6f8!important}
      body.mc-dark .central-mobile-copy-v041>span:not(.central-mobile-badges-v041){color:#c0cdd4!important}
      body.mc-dark .central-mobile-arrow-v041{color:#aebdc5!important}
      body.mc-dark .central-mobile-badge-v041{background:#293a43!important;color:#d5e0e5!important}
      body.mc-dark .central-mobile-badge-v041.late{background:#4a2d31!important;color:#ffc6c0!important}
      body.mc-dark .central-mobile-badge-v041.today{background:#21445b!important;color:#d3edfb!important}
      body.mc-dark .central-mobile-badge-v041.important{background:#4d4526!important;color:#f8e59b!important}

      body.mc-dark .topnav{background:#111c23!important;border-top-color:#354b57!important;box-shadow:0 -6px 20px rgba(0,0,0,.32)!important}
      body.mc-dark .topnav .nav-btn{color:#c3d0d7!important}
      body.mc-dark .topnav .nav-btn.active{background:#213f52!important;color:#8fd3f7!important}
    }
    @media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
  `;document.head.appendChild(st);
  window.MeuControleGlobalContrastV107={version:'1.07.2'};
})();