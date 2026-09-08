/* Meu Controle — V0.18: refino desktop de Lançamentos. */
(function(){
  if(window.__meuControleDesktopLaunchesV018Loaded)return;
  window.__meuControleDesktopLaunchesV018Loaded=true;
  const st=document.createElement('style');
  st.id='desktopLaunchesV018Style';
  st.textContent=`
    @media(min-width:701px){
      /* No desktop, o retorno para a própria tela é redundante. */
      #launchesPage .mobile-launch-back{display:none!important}

      /* Base desktop. O posicionamento de valor e ações é refinado pelo módulo V0.21. */
      #launchesPage .item{
        column-gap:14px;
      }
    }
  `;
  document.head.appendChild(st);
  window.MeuControleDesktopLaunchesV018={version:'0.18.1'};
})();
