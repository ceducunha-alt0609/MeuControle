/* MeuControle — V0.46.1: fechar aplicativo com modal compatível com tema escuro */
(function(){
  if(window.__meuControleSessionExitV045Loaded)return;
  window.__meuControleSessionExitV045Loaded=true;
  const VERSION='0.47';
  const isMobile=()=>matchMedia('(max-width:700px)').matches;

  function style(){
    if(document.getElementById('sessionExitV045Style'))return;
    const st=document.createElement('style');st.id='sessionExitV045Style';st.textContent=`
      .mc-exit-card-v045{width:100%;min-height:64px;margin-top:14px;padding:13px 15px;border:1px solid #ead8d5;border-radius:14px;background:#fff;color:#8d3933;display:flex;align-items:center;justify-content:space-between;gap:14px;text-align:left;box-shadow:0 5px 16px rgba(0,0,0,.035)}
      .mc-exit-card-v045 strong{display:block;font-size:15px;color:#7f302c}.mc-exit-card-v045 small{display:block;margin-top:3px;font-size:10px;color:#9a6b67;font-weight:500}.mc-exit-card-v045 span:last-child{font:700 22px system-ui,sans-serif;color:#b38c88}
      .mc-exit-backdrop-v045{position:fixed;inset:0;z-index:100800;background:rgba(12,27,38,.48);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:20px}
      .mc-exit-dialog-v045{width:min(430px,100%);background:#fff;border-radius:20px;padding:21px;box-shadow:0 26px 70px rgba(0,0,0,.28);color:#263a30}.mc-exit-dialog-v045 h3{margin:0;font-size:21px}.mc-exit-dialog-v045 p{margin:8px 0 0;font-size:12px;line-height:1.5;color:#6f7d75}.mc-exit-actions-v045{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:18px}.mc-exit-actions-v045 button{min-height:44px}.mc-exit-confirm-v045{background:#983d36!important;color:#fff!important}
      body.theme-black .mc-exit-card-v045{background:#142129!important;border-color:#503a3c!important;color:#f1c0bc!important}body.theme-black .mc-exit-card-v045 strong{color:#ffb8b2!important}body.theme-black .mc-exit-card-v045 small{color:#c79a97!important}body.theme-black .mc-exit-card-v045 span:last-child{color:#a97471!important}body.mc-dark .mc-exit-backdrop-v045{background:rgba(5,12,16,.68)!important}
      body.mc-dark .mc-exit-dialog-v045{background:#182229!important;color:#e7edf1!important;border:1px solid #34434c!important;box-shadow:0 28px 80px rgba(0,0,0,.5)!important}
      body.mc-dark .mc-exit-dialog-v045 h3{color:#eef4f7!important}
      body.mc-dark .mc-exit-dialog-v045 p{color:#b7c3c9!important}
      body.mc-dark .mc-exit-cancel-v045{background:#26343c!important;color:#eef4f7!important;border:1px solid #40515b!important}
      body.mc-dark .mc-exit-confirm-v045{background:#a53b3b!important;color:#fff!important;border-color:#b94a4a!important}
      @media(max-width:700px){.mc-exit-backdrop-v045{align-items:flex-end;padding:14px}.mc-exit-dialog-v045{border-radius:20px 20px 15px 15px}.mc-exit-card-v045{margin-top:10px;min-height:76px}}
    `;document.head.appendChild(st);
  }

  function closeDialog(){document.querySelector('.mc-exit-backdrop-v045')?.remove()}
  function performExit(){
    /* Um PWA Android nao possui permissao garantida para fechar a propria
       janela. Tentar apenas um fechamento autorizado; caso nao ocorra,
       orientar o usuario sem simular uma saida ou alterar a sessao. */
    try{window.close()}catch{}
    if(!isMobile()){closeDialog();return}
    setTimeout(()=>{
      if(document.visibilityState==='hidden')return;
      const bd=document.querySelector('.mc-exit-backdrop-v045');
      if(!bd)return;
      const title=bd.querySelector('h3'),body=bd.querySelector('p');
      const cancel=bd.querySelector('.mc-exit-cancel-v045'),confirm=bd.querySelector('.mc-exit-confirm-v045');
      if(title)title.textContent='Como sair no Android';
      if(body)body.textContent='O Android não permitiu fechar esta janela pelo aplicativo. Use o gesto Início para sair, ou abra os aplicativos recentes e deslize MeuControle para fechá-lo. Sua conta continuará conectada para a próxima abertura.';
      if(cancel)cancel.hidden=true;
      if(confirm){confirm.textContent='Entendi';confirm.onclick=closeDialog}
    },300);
  }
  function askExit(){
    if(document.querySelector('.mc-exit-backdrop-v045'))return;
    const bd=document.createElement('div');bd.className='mc-exit-backdrop-v045';bd.innerHTML='<section class="mc-exit-dialog-v045" role="dialog" aria-modal="true" aria-label="Fechar MeuControle"><h3>Fechar MeuControle?</h3><p>O aplicativo será fechado, mas sua conta continuará conectada para manter a sincronização quando você abrir novamente.</p><div class="mc-exit-actions-v045"><button type="button" class="secondary-action mc-exit-cancel-v045">Cancelar</button><button type="button" class="mc-exit-confirm-v045">Fechar</button></div></section>';document.body.appendChild(bd);
    bd.querySelector('.mc-exit-cancel-v045').onclick=closeDialog;bd.querySelector('.mc-exit-confirm-v045').onclick=performExit;bd.onclick=e=>{if(e.target===bd)closeDialog()};bd.querySelector('.mc-exit-cancel-v045').focus();
  }
  function addDesktop(){
    if(matchMedia('(max-width:700px)').matches)return;
    const help=[...document.querySelectorAll('#settingsPage .settings-card')].find(c=>(c.querySelector('h3')?.textContent||'').trim().toLowerCase()==='ajuda');if(!help||help.querySelector('.mc-exit-card-v045'))return;
    const b=document.createElement('button');b.type='button';b.className='mc-exit-card-v045';b.innerHTML='<span><strong>Fechar MeuControle</strong><small>Fechar o aplicativo sem desconectar a sincronização</small></span><span>›</span>';b.onclick=askExit;help.appendChild(b);
  }
  function addMobile(){
    /* O menu Mais ja possui a entrada Fechar. Eliminar apenas a duplicata
       criada por versoes anteriores deste modulo. */
    document.querySelectorAll('.mobile-more-list [data-more="exit-v045"]').forEach(b=>b.remove());
  }
  function install(){style();addDesktop();addMobile()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,120),{once:true});else setTimeout(install,120);
  window.addEventListener('load',()=>setTimeout(install,700));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDialog()});
  window.MeuControleSessionExitV045={version:VERSION,open:askExit,exit:performExit};
})();