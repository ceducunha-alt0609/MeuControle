/* MeuControle — V1.07: sistema global de contraste e legibilidade */
(()=>{
  if(window.__mcGlobalContrastV107)return;window.__mcGlobalContrastV107=true;
  const st=document.createElement('style');st.id='mcGlobalContrastV107Style';st.textContent=`
    :root{
      --mc-text-strong:#20312a;
      --mc-text-body:#34483e;
      --mc-text-secondary:#53635a;
      --mc-text-muted:#647269;
      --mc-placeholder:#66766d;
      --mc-chip-text:#355541;
      --mc-inactive-text:#4f6257;
      --mc-border-readable:#c8d4cd;
    }

    /* Textos secundários e de apoio */
    .panel-head p,.list-top p,.calendar-head p,.calendar-events-head p,
    .settings-title p,.settings-card p,.dashboard-toolbar p,.modal-head p,
    .dashboard-card span,.profile-row-main span,.important-row-main span,
    .restore-stat span,.meta,.notes,.empty{
      color:var(--mc-text-secondary)!important;
    }

    /* Placeholders: legíveis sem competir com o conteúdo digitado */
    input::placeholder,textarea::placeholder{
      color:var(--mc-placeholder)!important;
      opacity:1!important;
    }

    /* Chips, etiquetas e estados inativos */
    .badge{color:var(--mc-chip-text)!important}
    .tab:not(.active),.calendar-month-btn:not(.active){color:var(--mc-inactive-text)!important}

    /* Campos e elementos de pesquisa */
    .search-wrap{border-color:var(--mc-border-readable)!important}
    .search-wrap span{color:#536b5d!important}
    input,select,textarea{border-color:#c7d2cc}

    /* Topbar: textos pequenos deixam de depender de opacity baixa */
    .brand p{opacity:1!important;color:rgba(255,255,255,.92)!important}
    .top-stat span{opacity:1!important;color:rgba(255,255,255,.9)!important}

    /* Painel premium: reforça apoio, preservando cores semânticas */
    .premium-card:not(.late-card):not(.important-card) .premium-label{color:#56685e!important}
    .premium-card:not(.late-card):not(.important-card) small{color:#5d6d64!important}
    .dashboard-hint{color:#5d6d64!important}

    /* Central Hoje */
    .central-hoje-head-v041 p{color:#5b6b62!important}
    .central-item-main-v041 span{color:#617169!important}
    .central-empty-v041{color:#6a7770!important}
    .central-mobile-copy-v041>span:not(.central-mobile-badges-v041){color:#5f6e66!important}
    .central-mobile-sheet-head-v041 p{color:#5f6e66!important}
    .central-mobile-arrow-v041{color:#718078!important}

    /* Mobile: meses e textos auxiliares mais firmes */
    @media(max-width:700px){
      #calendarPage .mobile-month-slot.prev,#calendarPage .mobile-month-slot.next,
      #dashboardPage .mobile-dashboard-month-slot.prev,#dashboardPage .mobile-dashboard-month-slot.next{
        color:#66766d!important;
      }
      #dashboardPage .premium-card.today-card #dashTodaySub{color:#5d6d64!important}
      #calendarPage .calendar-search input::placeholder,
      #launchesPage input::placeholder{color:#66766d!important}
    }
  `;document.head.appendChild(st);
  window.MeuControleGlobalContrastV107={version:'1.07'};
})();
