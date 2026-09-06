/* MeuControle — V0.45: saída segura do aplicativo */
(function(){
  if(window.__meuControleSessionExitV045Loaded)return;
  window.__meuControleSessionExitV045Loaded=true;
  const VERSION='0.45';
  const isMobile=()=>matchMedia('(max-width:700px)').matches;

  function style(){
    if(document.getElementById('sessionExitV045Style'))return;
    const st=document.createElement('style');st.id='sessionExitV045Style';st.textContent=`
      .mc-exit-card-v045{width:100%;min-height:64px;margin-top:14px;padding:13px 15px;border:1px solid #ead8d5;border-radius:14px;background:#fff;color:#8d3933;display:flex;align-items:center;justify-content:space-between;gap:14px;text-align:left;box-shadow:0 5px 16px rgba(0,0,0,.035)}
      .mc-exit-card-v045 strong{display:block;font-size:15px;color:#7f302c}.mc-exit-card-v045 small{display:block;margin-top:3px;font-size:10px;color:#9a6b67;font-weight:500}.mc-exit-card-v045 span:last-child{font:700 22px system-ui,sans-serif;color:#b38c88}
      .mc-exit-backdrop-v045{position:fixed;inset:0;z-index:100800;background:rgba(12,27,38,.48);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:20px}
      .mc-exit-dialog-v045{width:min(430px,100%);background:#fff;border-radius:20px;padding:21px;box-shadow:0 26px 70px rgba(0,0,0,.28);color:#263a30}.mc-exit-dialog-v045 h3{margin:0;font-size:21px}.mc-exit-dialog-v045 p{margin:8px 0 0;font-size:12px;line-height:1.5;color:#6f7d75}.mc-exit-actions-v045{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:18px}.mc-exit-actions-v045 button{min-height:44px}.mc-exit-confirm-v045{background:#983d36!important;color:#fff!important}
      .mc-signedout-v045{position:fixed;inset:0;z-index:100850;background:linear-gradient(145deg,#164f78,#103c5c);display:flex;align-items:center;justify-content:center;padding:22px;color:#fff}.mc-signedout-card-v045{width:min(390px,100%);text-align:center}.mc-signedout-card-v045 img{width:82px;height:82px;border-radius:22px;box-shadow:0 14px 36px rgba(0,0,0,.22)}.mc-signedout-card-v045 h1{margin:16px 0 5px;font-size:25px}.mc-signedout-card-v045 p{margin:0 auto 20px;max-width:310px;font-size:13px;line-height:1.5;opacity:.82}.mc-signedout-card-v045 button{width:100%;min-height:50px;background:#fff!important;color:#164f78!important;border-radius:13px!important}
      @media(max-width:700px){.mc-exit-backdrop-v045{align-items:flex-end;padding:14px}.mc-exit-dialog-v045{border-radius:20px 20px 15px 15px}.mc-exit-card-v045{margin-top:10px;min-height:76px}}
    `;document.head.appendChild(st);
  }

  function closeDialog(){document.querySelector('.mc-exit-backdrop-v045')?.remove()}
  function signedOutScreen(){
    document.querySelector('.mc-signedout-v045')?.remove();
    const root=document.createElement('div');root.className='mc-signedout-v045';root.innerHTML='<div class="mc-signedout-card-v045"><img src="icons/icon-192.png" alt=""><h1>Sessão encerrada</h1><p>Seus dados continuam salvos neste aparelho. Entre novamente quando quiser continuar.</p><button type="button">Entrar novamente</button></div>';document.body.appendChild(root);
    root.querySelector('button').onclick=()=>root.remove();
  }
  async function performExit(){
    closeDialog();
    try{await window.MeuControleCloud?.signOut?.()}catch{}
    try{sessionStorage.removeItem('meu_controle_mobile_biometric_unlocked_v1')}catch{}
    if(isMobile()&&window.MeuControleMobileBiometric?.enabled?.()){
      try{window.MeuControleMobileBiometric.lock()}catch{}
      return;
    }
    signedOutScreen();
    if(!isMobile()&&(matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true)){
      setTimeout(()=>{try{window.close()}catch{}},180);
    }
  }
  function askExit(){
    if(document.querySelector('.mc-exit-backdrop-v045'))return;
    const bd=document.createElement('div');bd.className='mc-exit-backdrop-v045';bd.innerHTML='<section class="mc-exit-dialog-v045" role="dialog" aria-modal="true" aria-label="Sair do MeuControle"><h3>Sair do MeuControle?</h3><p>Isso encerra sua sessão neste aparelho, mas não apaga lançamentos, perfis, backups ou configurações.</p><div class="mc-exit-actions-v045"><button type="button" class="secondary-action mc-exit-cancel-v045">Cancelar</button><button type="button" class="mc-exit-confirm-v045">Sair</button></div></section>';document.body.appendChild(bd);
    bd.querySelector('.mc-exit-cancel-v045').onclick=closeDialog;bd.querySelector('.mc-exit-confirm-v045').onclick=performExit;bd.onclick=e=>{if(e.target===bd)closeDialog()};bd.querySelector('.mc-exit-cancel-v045').focus();
  }
  function addDesktop(){
    if(matchMedia('(max-width:700px)').matches)return;
    const help=[...document.querySelectorAll('#settingsPage .settings-card')].find(c=>(c.querySelector('h3')?.textContent||'').trim().toLowerCase()==='ajuda');if(!help||help.querySelector('.mc-exit-card-v045'))return;
    const b=document.createElement('button');b.type='button';b.className='mc-exit-card-v045';b.innerHTML='<span><strong>Sair</strong><small>Encerrar a sessão do MeuControle neste aparelho</small></span><span>›</span>';b.onclick=askExit;help.appendChild(b);
  }
  function addMobile(){
    const list=document.querySelector('.mobile-more-list');if(!list||list.querySelector('[data-more="exit-v045"]'))return;
    const b=document.createElement('button');b.type='button';b.className='mobile-more-card';b.dataset.more='exit-v045';b.innerHTML='<span class="mobile-more-icon">↪</span><span class="mobile-more-copy"><strong>Sair</strong><small>Encerrar sessão neste aparelho</small></span><span class="mobile-more-arrow">›</span>';b.onclick=askExit;list.appendChild(b);
  }
  function install(){style();addDesktop();addMobile()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,120),{once:true});else setTimeout(install,120);
  window.addEventListener('load',()=>setTimeout(install,700));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDialog()});
  window.MeuControleSessionExitV045={version:VERSION,open:askExit,exit:performExit};
})();
