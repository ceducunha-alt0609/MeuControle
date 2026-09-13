/* MeuControle — V1.35.1: acabamento dark de Configuracoes — Dados e seguranca + Perfis */
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
 }
 `;document.head.appendChild(st);
})();