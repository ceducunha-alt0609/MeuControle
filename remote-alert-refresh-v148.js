/* MeuControle — V1.48: atualiza lembretes/push ao receber workspace remoto */
(()=>{
  if(window.__mcRemoteAlertRefreshV148)return;window.__mcRemoteAlertRefreshV148=true;
  const refresh=()=>{
    try{window.MeuControleSystemReminders?.schedule?.()}catch{}
    try{window.MeuControlePush?.sync?.()}catch{}
  };
  window.addEventListener('meucontrole:user-workspace-imported',()=>setTimeout(refresh,120));
  window.addEventListener('meucontrole:user-session-changed',()=>setTimeout(refresh,700));
  window.MeuControleRemoteAlertRefresh={version:'1.48',refresh};
})();
