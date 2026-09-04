/* Meu Controle — V0.18: refino desktop de Lançamentos. Remove apenas os retornos redundantes. */
(function(){
  if(window.__meuControleDesktopLaunchesV018Loaded)return;
  window.__meuControleDesktopLaunchesV018Loaded=true;
  const st=document.createElement('style');
  st.id='desktopLaunchesV018Style';
  st.textContent=`
    @media(min-width:701px){
      #launchesPage .mobile-launch-back{display:none!important}
    }
  `;
  document.head.appendChild(st);
  window.MeuControleDesktopLaunchesV018={version:'0.18'};
})();
