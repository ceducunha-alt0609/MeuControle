/* MeuControle — V1.36.2: pulso suave e contorno continuo nos cards vencidos pendentes */
(function(){
 if(window.__mcOverduePulseV136)return;window.__mcOverduePulseV136=true;
 const st=document.createElement('style');st.id='mcOverduePulseV136Style';st.textContent=`
  @keyframes mc-overdue-pulse-v136{
    0%,100%{box-shadow:0 0 0 1px rgba(190,55,55,.34),0 0 0 0 rgba(190,55,55,0)}
    50%{box-shadow:0 0 0 1px rgba(220,72,72,.82),0 0 0 4px rgba(190,55,55,.10)}
  }
  .item.late:not(.done){
    animation:mc-overdue-pulse-v136 2.8s ease-in-out infinite!important;
    border-color:rgba(205,65,65,.72)!important;
  }
  .item.late:not(.done)::before{
    border-left-color:transparent!important;
    box-shadow:none!important;
  }
  body.mc-dark .item.late:not(.done){
    animation-name:mc-overdue-pulse-v136!important;
  }
  body.mc-dark .item.late:not(.done) .meta{
    color:#e36a6a!important;
  }
  @media(prefers-reduced-motion:reduce){
    .item.late:not(.done){animation:none!important;box-shadow:0 0 0 1px rgba(190,55,55,.58)!important}
  }
 `;document.head.appendChild(st);
})();