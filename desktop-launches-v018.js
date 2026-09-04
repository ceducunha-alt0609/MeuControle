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
      #launchesPage .item{
        grid-template-columns:12px minmax(0,1fr) minmax(96px,120px) auto;
        column-gap:14px;
      }
      /* O contêiner antigo deixa de ocupar uma coluna única; seus filhos passam a participar da grade principal. */
      #launchesPage .item-side{display:contents}
      #launchesPage .amount{
        grid-column:3;
        align-self:center;
        justify-self:end;
        min-width:96px;
        font-size:17px;
        font-weight:800;
        line-height:1.2;
        white-space:nowrap;
        text-align:right;
      }
      #launchesPage .item-actions{
        grid-column:4;
        align-self:center;
        justify-self:end;
        margin-top:0;
        flex-wrap:nowrap;
      }
    }
  `;
  document.head.appendChild(st);
  window.MeuControleDesktopLaunchesV018={version:'0.18'};
})();
