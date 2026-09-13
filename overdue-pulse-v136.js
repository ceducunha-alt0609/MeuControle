/* MeuControle — V1.36: pulso suave nos cards vencidos pendentes */
(function(){
 if(window.__mcOverduePulseV136)return;window.__mcOverduePulseV136=true;
 const st=document.createElement('style');st.id='mcOverduePulseV136Style';st.textContent=`
  @keyframes mc-overdue-pulse-v136{
    0%,100%{box-shadow:0 0 0 0 rgba(190,55,55,0),0 0 0 1px rgba(190,55,55,.34)}
    50%{box-shadow:0 0 0 4px rgba(190,55,55,.10),0 0 0 1px rgba(220,72,72,.78)}
  }
  .item.late:not(.done){
    animation:mc-overdue-pulse-v136 2.8s ease-in-out infinite!important;
  }
  body.mc-dark .item.late:not(.done){
    animation-name:mc-overdue-pulse-v136!important;
  }
  @media(prefers-reduced-motion:reduce){
    .item.late:not(.done){animation:none!important;box-shadow:0 0 0 1px rgba(190,55,55,.58)!important}
  }
 `;document.head.appendChild(st);
})();