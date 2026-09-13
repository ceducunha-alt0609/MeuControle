/* MeuControle — V1.33: acabamento dark do painel flutuante de ações desktop */
(function(){
 if(window.__mcDarkActionsV133)return;window.__mcDarkActionsV133=true;
 const st=document.createElement('style');st.id='mcDarkActionsV133Style';st.textContent=`
 @media(min-width:701px){
  body.mc-dark .mc-desktop-actions-v113{background:#182229!important;border-color:#34434c!important;color:#e7edf1!important;box-shadow:0 18px 48px rgba(0,0,0,.38)!important}
  body.mc-dark .mc-desktop-actions-handle-v113{color:#74838c!important}
  body.mc-dark .mc-desktop-actions-copy-v113 strong{color:#eef3f6!important}
  body.mc-dark .mc-desktop-actions-copy-v113 span{color:#aebbc3!important}
  body.mc-dark .mc-desktop-actions-close-v113{background:#26343c!important;color:#cdd8de!important;border:1px solid #3a4952!important}
  body.mc-dark .mc-desktop-actions-grid-v113 .secondary-action{background:#26343c!important;color:#e0e8ec!important;border-color:#34434c!important}
  body.mc-dark .mc-desktop-actions-grid-v113 .secondary-action:hover{background:#2d3d46!important}
  body.mc-dark .mc-desktop-actions-grid-v113 [data-action="done"]{background:var(--primary)!important;color:#fff!important;border-color:var(--primary)!important}
  body.mc-dark .mc-desktop-actions-grid-v113 .mc-desktop-delete-v113{background:#a83f3f!important;border-color:#a83f3f!important;color:#fff!important}
 }
 `;document.head.appendChild(st);
})();