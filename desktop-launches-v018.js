/* Meu Controle — V0.18.3: refino desktop + tipos adicionais + limpeza de atalho antigo. */
(function(){
  document.getElementById('desktopQuickEntryV023')?.remove();
  if(window.__meuControleDesktopLaunchesV018Loaded)return;
  window.__meuControleDesktopLaunchesV018Loaded=true;

  /* Tipos enxutos compartilhados por desktop e mobile. */
  function ensureExtraTypes(){
    const select=document.getElementById('type');
    if(!select)return;
    const add=(value,label,beforeValue)=>{
      if(select.querySelector(`option[value="${value}"]`))return;
      const option=document.createElement('option');
      option.value=value;
      option.textContent=label;
      const before=beforeValue?select.querySelector(`option[value="${beforeValue}"]`):null;
      before?select.insertBefore(option,before):select.appendChild(option);
    };
    add('recebimento','Recebimento','compromisso');
    add('exame','Exame','lembrete');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureExtraTypes,{once:true});
  else ensureExtraTypes();

  const st=document.createElement('style');
  st.id='desktopLaunchesV018Style';
  st.textContent=`
    @media(min-width:701px){
      #launchesPage .mobile-launch-back{display:none!important}
      #launchesPage .item{column-gap:14px}
    }
  `;
  document.head.appendChild(st);
  window.MeuControleDesktopLaunchesV018={version:'0.18.3'};
})();
