/* MeuControle — V1.35.3: acabamento dark de Configuracoes — Dados, Perfis, Aparencia e Aplicativo */
(function(){
 if(window.__mcDarkSettingsV135)return;window.__mcDarkSettingsV135=true;
 const st=document.createElement('style');st.id='mcDarkSettingsV135Style';st.textContent=`
 @media(min-width:701px){
  body.mc-dark #settingsPage .settings-card>p{color:#aebbc3!important}
  body.mc-dark #settingsPage .backup-status{color:#c4ced3!important;border-color:#40505a!important}
  body.mc-dark #settingsPage .backup-status span{color:#c4ced3!important}
  body.mc-dark #settingsPage .backup-status strong{color:#edf3f6!important}
  body.mc-dark #settingsPage .auto-backup-box{border-color:#40505a!important}
  body.mc-dark #settingsPage .auto-backup-head strong{color:#edf3f6!important}
  body.mc-dark #settingsPage #autoBackupState{color:#70b6dc!important}
  body.mc-dark #settingsPage #viewAutoBackupsBtn{background:#293840!important;color:#d9e5eb!important;border-color:#40505a!important}

  body.mc-dark #settingsPage .sync-box,body.mc-dark #settingsPage .sync-section,body.mc-dark #settingsPage [class*="sync-"]{color:#c0cbd1}
  body.mc-dark #settingsPage .sync-box p,body.mc-dark #settingsPage .sync-section p{color:#aebbc3!important}
  body.mc-dark #settingsPage .sync-box input,body.mc-dark #settingsPage .sync-section input,body.mc-dark #settingsPage .sync-status-box{background:#202d34!important;color:#dce6eb!important;border-color:#40505a!important}
  body.mc-dark #settingsPage .firebase-sync-box{border-color:#40505a!important}
  body.mc-dark #settingsPage .firebase-sync-head h4{color:#edf3f6!important}
  body.mc-dark #settingsPage .firebase-sync-head p{color:#aebbc3!important}
  body.mc-dark #settingsPage .firebase-sync-user{background:#202d34!important;color:#c4ced3!important;border:1px solid #40505a!important}

  body.mc-dark #settingsPage .profiles-list .profile-row{background:#1b262d!important;border-color:#35454e!important;color:#edf3f6!important}
  body.mc-dark #settingsPage .profiles-list .profile-row strong{color:#edf3f6!important}
  body.mc-dark #settingsPage .profiles-list .profile-row span,body.mc-dark #settingsPage .profiles-list .profile-row small{color:#aebbc3!important}
  body.mc-dark #settingsPage .profile-create input{background:#152027!important;color:#edf3f6!important;border-color:#40505a!important}
  body.mc-dark #settingsPage .profile-create input::placeholder{color:#8f9da5!important;opacity:1!important}

  /* Aparencia — manter a hierarquia e apenas recuperar contraste no dark. */
  body.mc-dark #settingsPage .appearance-group{color:#dce6eb!important}
  body.mc-dark #settingsPage .appearance-label{color:#aebbc3!important}
  body.mc-dark #settingsPage .appearance-group>small{color:#aebbc3!important;opacity:1!important}
  body.mc-dark #settingsPage .appearance-choice,body.mc-dark #settingsPage .theme-choice{background:#202c33!important;color:#e4ebef!important;border-color:#40515b!important}
  body.mc-dark #settingsPage .appearance-choice.active{background:#263d4c!important;color:#eef7fc!important;border-color:#63849a!important;box-shadow:inset 0 0 0 1px rgba(120,174,207,.18)!important}
  body.mc-dark #settingsPage .theme-choice strong{color:#edf3f6!important}
  body.mc-dark #settingsPage .theme-choice small{color:#b3c0c7!important}
  body.mc-dark #settingsPage .theme-choice.active{border-color:#63849a!important;background:#233642!important}

  body.mc-dark #settingsPage .settings-card hr{border-color:#40505a!important}
  body.mc-dark #settingsPage .settings-card h4{color:#edf3f6!important}
  body.mc-dark #settingsPage .settings-card [class*="notify"] p,body.mc-dark #settingsPage .settings-card [class*="notification"] p{color:#aebbc3!important}
  body.mc-dark #settingsPage .settings-card [class*="notify"] small,body.mc-dark #settingsPage .settings-card [class*="notification"] small{color:#b4c0c7!important}
  body.mc-dark #settingsPage .settings-card [class*="notify"] strong,body.mc-dark #settingsPage .settings-card [class*="notification"] strong{color:#edf3f6!important}
  body.mc-dark #settingsPage #notifyBtn,body.mc-dark #settingsPage #notifyTestBtn,body.mc-dark #settingsPage #testTodayOverdueBtn{background:#26343c!important;color:#e2ebef!important;border-color:#40515b!important}

  /* Aplicativo — pincel fino: somente recuperar os textos secundarios. */
  body.mc-dark #settingsPage .install-card p,body.mc-dark #settingsPage .install-card small,body.mc-dark #settingsPage [class*="install-"] p,body.mc-dark #settingsPage [class*="install-"] small{color:#aebbc3!important}
  body.mc-dark #settingsPage .install-card strong,body.mc-dark #settingsPage [class*="install-"] strong{color:#edf3f6!important}
  body.mc-dark #settingsPage .app-install-box p,body.mc-dark #settingsPage .app-install-box small{color:#aebbc3!important}
  body.mc-dark #settingsPage .app-install-box strong{color:#edf3f6!important}
  body.mc-dark #settingsPage .settings-card .app-about,body.mc-dark #settingsPage .settings-card [class*="about"]{color:#aebbc3!important}
 }
 `;document.head.appendChild(st);
})();