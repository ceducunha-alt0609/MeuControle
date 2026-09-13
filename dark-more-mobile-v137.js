/* MeuControle — V1.37.1: acabamento dark consistente do Mais no mobile */
(function(){
 if(window.__mcDarkMoreMobileV137)return;window.__mcDarkMoreMobileV137=true;
 const st=document.createElement('style');st.id='mcDarkMoreMobileV137Style';st.textContent=`
 @media(max-width:700px){
  body.mc-dark #settingsPage .settings-title p,
  body.mc-dark #settingsPage.mobile-settings-detail .settings-card.mobile-settings-active>p,
  body.mc-dark #settingsPage .mobile-profile-current,
  body.mc-dark #settingsPage .settings-card>p{color:#aebbc3!important}

  body.mc-dark #settingsPage .mobile-more-card{background:#1b272e!important;border-color:#35454e!important;color:#edf3f6!important;box-shadow:none!important}
  body.mc-dark #settingsPage .mobile-more-copy strong{color:#edf3f6!important}
  body.mc-dark #settingsPage .mobile-more-copy small{color:#aebbc3!important}
  body.mc-dark #settingsPage .mobile-more-icon{background:#203442!important;color:#68a9cf!important}
  body.mc-dark #settingsPage .mobile-more-arrow{color:#91a2ab!important}

  body.mc-dark #settingsPage.mobile-settings-detail .settings-card.mobile-settings-active{background:#18242b!important;border-color:#35454e!important;color:#dce6eb!important}
  body.mc-dark #settingsPage .mobile-settings-back{color:#63a9d1!important}
  body.mc-dark #settingsPage .settings-card h3,
  body.mc-dark #settingsPage .settings-card h4,
  body.mc-dark #settingsPage .settings-card strong{color:#edf3f6!important}
  body.mc-dark #settingsPage .settings-card small,
  body.mc-dark #settingsPage .settings-card .muted{color:#aebbc3!important}

  body.mc-dark #settingsPage .mobile-profile-choice{background:#1b272e!important;color:#edf3f6!important;border-color:#40505a!important}
  body.mc-dark #settingsPage .mobile-profile-choice::after{border-color:#71818a!important}
  body.mc-dark #settingsPage .mobile-profile-choice.active{background:#20394a!important;color:#9ed5f3!important;border-color:#4d7790!important}
  body.mc-dark #settingsPage .mobile-profile-choice.active::after{background:#1d6b9c!important;border-color:#1d6b9c!important;color:#fff!important}
  body.mc-dark #settingsPage .mobile-profile-card .mobile-profile-current{border-color:#40505a!important}

  body.mc-dark #settingsPage .mobile-data-card #viewAutoBackupsBtn{background:#26343c!important;color:#dce6eb!important;border:1px solid #40515b!important}
  body.mc-dark #settingsPage .mobile-data-card #importBackupBtn{background:#203442!important;color:#9ed5f3!important;border-color:#40515b!important}
  body.mc-dark #settingsPage .firebase-sync-user{background:#202d34!important;color:#c4ced3!important;border:1px solid #40505a!important}
  body.mc-dark #settingsPage .backup-status,
  body.mc-dark #settingsPage .auto-backup-box,
  body.mc-dark #settingsPage .firebase-sync-box{border-color:#40505a!important}
  body.mc-dark #settingsPage .backup-status span,
  body.mc-dark #settingsPage .firebase-sync-head p{color:#aebbc3!important}

  body.mc-dark #settingsPage .mobile-app-notifications{border-color:#40505a!important}
  body.mc-dark #settingsPage .mobile-app-notifications h4{color:#edf3f6!important}
  body.mc-dark #settingsPage .mobile-app-notifications p{color:#aebbc3!important}
  body.mc-dark #settingsPage .mobile-notify-state{color:#b8c5cb!important}
  body.mc-dark #settingsPage .install-card p,
  body.mc-dark #settingsPage .install-card small,
  body.mc-dark #settingsPage [class*="install-"] p,
  body.mc-dark #settingsPage [class*="install-"] small{color:#aebbc3!important}

  body.mc-dark #settingsPage .profiles-list .profile-row{background:#1b272e!important;border-color:#35454e!important;color:#edf3f6!important}
  body.mc-dark #settingsPage .profiles-list .profile-row strong{color:#edf3f6!important}
  body.mc-dark #settingsPage .profiles-list .profile-row span,
  body.mc-dark #settingsPage .profiles-list .profile-row small{color:#aebbc3!important}
  body.mc-dark #settingsPage .profiles-list .profile-row button,
  body.mc-dark #settingsPage .profiles-list .profile-row .danger-action{background:#26343c!important;color:#dce6eb!important;border-color:#40515b!important}
  body.mc-dark #settingsPage .profile-create input{background:#152027!important;color:#edf3f6!important;border-color:#40505a!important}
  body.mc-dark #settingsPage .profile-create input::placeholder{color:#8f9da5!important;opacity:1!important}

  body.mc-dark #settingsPage .appearance-label,
  body.mc-dark #settingsPage .appearance-group>small{color:#aebbc3!important;opacity:1!important}
  body.mc-dark #settingsPage .appearance-choice,
  body.mc-dark #settingsPage .theme-choice{background:#202c33!important;color:#e4ebef!important;border-color:#40515b!important}
  body.mc-dark #settingsPage .theme-choice strong{color:#edf3f6!important}
  body.mc-dark #settingsPage .theme-choice small{color:#b3c0c7!important}

  body.mc-dark #settingsPage .mc-help-card-v037 summary{color:#dce6eb!important}
  body.mc-dark #settingsPage .mc-help-card-v037 details p{color:#b7c3c9!important}
  body.mc-dark #settingsPage .mc-help-card-v037 details{border-color:#40505a!important}
  body.mc-dark #settingsPage .mc-appdiag-v042{background:#1b272e!important;border-color:#40505a!important}
  body.mc-dark #settingsPage .mc-appdiag-head-v042 h4{color:#edf3f6!important}
  body.mc-dark #settingsPage .mc-appdiag-head-v042 p{color:#aebbc3!important}
  body.mc-dark #settingsPage .mc-appdiag-state-v042{background:#17384d!important;color:#9ed5f3!important}
  body.mc-dark #settingsPage .mc-appdiag-arrow-v042{color:#93a5ae!important}
 }
 `;document.head.appendChild(st);

 /* Corrige apenas a apresentacao do bloco Sobre, sem alterar seu conteudo. */
 function fixAboutSpacing(){
  if(!matchMedia('(max-width:700px)').matches)return;
  document.querySelectorAll('#settingsPage .settings-card').forEach(card=>{
   if(!/Aplicativo/i.test(card.querySelector('h3')?.textContent||''))return;
   const walker=document.createTreeWalker(card,NodeFilter.SHOW_TEXT);
   let n;while(n=walker.nextNode()){
    if(/Meu ControleVersão/.test(n.nodeValue||''))n.nodeValue=n.nodeValue.replace('Meu ControleVersão','Meu Controle · Versão');
   }
  });
 }
 fixAboutSpacing();new MutationObserver(fixAboutSpacing).observe(document.getElementById('settingsPage')||document.body,{childList:true,subtree:true});
})();