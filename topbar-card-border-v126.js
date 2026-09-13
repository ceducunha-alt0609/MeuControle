/* MeuControle — V1.26: contorno sutil nos indicadores da topbar desktop */
(function(){
  if(window.__mcTopbarCardBorderV126)return;
  window.__mcTopbarCardBorderV126=true;
  const st=document.createElement('style');
  st.id='mcTopbarCardBorderV126';
  st.textContent=`
    @media (min-width:701px){
      .top-summary .top-stat{
        border:1px solid rgba(255,255,255,.22)!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.035),0 2px 7px rgba(4,27,44,.055);
      }
      .top-summary button.top-stat:hover{
        border-color:rgba(255,255,255,.32)!important;
      }
    }
  `;
  document.head.appendChild(st);
})();