/* MeuControle — V1.31.1: acabamento dark de Lançamentos desktop */
(function(){
 if(window.__mcDarkLaunchesListV131)return;window.__mcDarkLaunchesListV131=true;
 const st=document.createElement('style');st.id='mcDarkLaunchesListV131Style';st.textContent=`
 @media(min-width:701px){
  body.mc-dark #launchesPage #list .item{background:#1b262d!important;color:#e7edf1!important;border-color:#314049!important}
  body.mc-dark #launchesPage #list .item:hover{box-shadow:0 8px 18px rgba(0,0,0,.18)!important}
  body.mc-dark #launchesPage #list .item-title{color:#e7edf1!important}
  body.mc-dark #launchesPage #list .item .meta{color:#aebbc3!important}
  body.mc-dark #launchesPage #list .item.done{background:#172127!important;opacity:.62!important;border-color:#2d3a42!important}
  body.mc-dark #launchesPage #list .item.done .item-title,body.mc-dark #launchesPage #list .item.done .meta{color:#9ca9b0!important}
  body.mc-dark #launchesPage .desktop-month-heading-v020,body.mc-dark #launchesPage .desktop-month-heading-v020.tone-1,body.mc-dark #launchesPage .desktop-month-heading-v020.tone-2,body.mc-dark #launchesPage .desktop-month-heading-v020.collapsed{background:linear-gradient(90deg,#26343c,#202b32)!important;border-color:#3a4952!important;border-left-color:rgba(var(--primary-rgb),.9)!important}
  body.mc-dark #launchesPage .desktop-month-heading-v020 strong{color:#c8dce8!important}
  body.mc-dark #launchesPage .desktop-month-heading-v020 .desktop-month-count{color:#aab7be!important}
  body.mc-dark #launchesPage .desktop-month-toggle{background:#314049!important;border-color:#485a64!important;color:#d8e8f1!important}
  body.mc-dark #launchesPage .desktop-done-heading-v020{background:linear-gradient(90deg,#202b31,#1c272d)!important;border-top-color:#3a4952!important;border-bottom-color:#314049!important;color:#aeb9bf!important}
  body.mc-dark #launchesPage .desktop-done-heading-v020 strong{color:#b9c5cb!important}
  body.mc-dark #launchesPage .desktop-done-heading-v020 span{color:#98a6ad!important}

  /* Formulário e cabeçalho: só contraste, sem alterar geometria */
  body.mc-dark #launchesPage .panel-head p,body.mc-dark #launchesPage .list-top p{color:#aebbc3!important}
  body.mc-dark #launchesPage form label,body.mc-dark #launchesPage .form-grid label{color:#b9c5cb!important}
  body.mc-dark #launchesPage form label>span,body.mc-dark #launchesPage .form-grid label>span{color:#b9c5cb!important}
  body.mc-dark #launchesPage .checkbox-row,body.mc-dark #launchesPage .checkbox-row label{color:#aebbc3!important}
  body.mc-dark #launchesPage input::placeholder,body.mc-dark #launchesPage textarea::placeholder{color:#83939c!important}
  body.mc-dark #launchesPage input,body.mc-dark #launchesPage select,body.mc-dark #launchesPage textarea{color:#eef3f6!important}
  body.mc-dark #launchesPage .filters button:not(.active),body.mc-dark #launchesPage .filter-btn:not(.active){color:#b8c4ca!important;background:#26343c!important;border-color:#314049!important}
  body.mc-dark #launchesPage .filters button:not(.active):hover,body.mc-dark #launchesPage .filter-btn:not(.active):hover{color:#e2eaee!important;background:#2d3d46!important}
 }
 `;document.head.appendChild(st);
})();