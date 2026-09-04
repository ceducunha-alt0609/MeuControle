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

      /* Lançamentos em três zonas visuais: informação | valor | ações. */
      #launchesPage .item-side{
        display:grid;
        grid-template-columns:minmax(96px,120px) auto;
        align-items:center;
        column-gap:14px;
        text-align:right;
      }
      #launchesPage .amount{
        min-width:96px;
        font-size:17px;
        font-weight:800;
        line-height:1.2;
        white-space:nowrap;
        text-align:right;
      }
      #launchesPage .item-actions{
        margin-top:0;
        align-items:center;
        flex-wrap:nowrap;
      }
    }
  `;
  document.head.appendChild(st);
  window.MeuControleDesktopLaunchesV018={version:'0.18'};
})();
