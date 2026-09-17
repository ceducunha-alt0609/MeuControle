/* MeuControle — V0.42: atalho mobile + observações compactas */
(function(){
  if(window.__meuControleQuickEntryV040Loaded)return;
  window.__meuControleQuickEntryV040Loaded=true;

  const VERSION='0.42';
  const mq=matchMedia('(max-width:700px)');

  function installStyles(){
    if(document.getElementById('mcQuickEntryV040Style'))return;
    const style=document.createElement('style');
    style.id='mcQuickEntryV040Style';
    style.textContent=`
      .mc-quick-entry-v040{display:none}
      @media(max-width:700px){
        #launchesPage.mobile-launch-form #notes{height:72px!important;min-height:72px!important;max-height:72px!important;resize:none!important}
        .mc-quick-entry-v040{
          position:fixed;right:16px;bottom:calc(82px + env(safe-area-inset-bottom,0px));z-index:2400;
          width:54px;height:54px;padding:0!important;border:1px solid rgba(255,255,255,.35)!important;
          border-radius:16px!important;background:var(--primary)!important;color:#fff!important;
          box-shadow:0 12px 28px rgba(20,67,96,.28)!important;display:grid!important;place-items:center;
          font-family:system-ui,sans-serif!important;font-size:31px!important;font-weight:400!important;line-height:1!important;
          transition:opacity .16s ease,transform .16s ease,box-shadow .16s ease!important;
        }
        .mc-quick-entry-v040:active{transform:scale(.95)!important}
        .mc-quick-entry-v040.mc-quick-hidden-v040{display:none!important;opacity:0!important;pointer-events:none!important}
        .mc-quick-entry-v040::after{content:"Novo lançamento";position:absolute;right:0;bottom:62px;padding:6px 9px;border-radius:8px;background:#203a4a;color:#fff;font-family:system-ui,sans-serif;font-size:10px;font-weight:700;white-space:nowrap;opacity:0;pointer-events:none;transform:translateY(4px);transition:.14s ease;box-shadow:0 7px 18px rgba(0,0,0,.18)}
        .mc-quick-entry-v040:focus-visible::after{opacity:1;transform:translateY(0)}
      }
      @media(max-width:700px) and (prefers-reduced-motion:reduce){.mc-quick-entry-v040{transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  function ensureButton(){
    let btn=document.getElementById('mcQuickEntryV040');
    if(btn)return btn;
    btn=document.createElement('button');
    btn.id='mcQuickEntryV040';btn.type='button';btn.className='mc-quick-entry-v040 mc-quick-hidden-v040';
    btn.setAttribute('aria-label','Novo lançamento rápido');btn.setAttribute('title','Novo lançamento');btn.textContent='+';
    btn.onclick=openNewEntry;document.body.appendChild(btn);return btn;
  }

  function overlayVisible(){return !!document.querySelector('.mc-tour-v037,.mc-delete-backdrop-v038,.mobile-biometric-lock-v036,.startup-splash-v035,.startup-brief-backdrop-v035:not([hidden]),.desktop-settings-modal-v027.open')}
  function shouldHide(){
    if(!mq.matches)return true;
    const launches=document.getElementById('launchesPage');
    if(launches&&!launches.classList.contains('hidden')&&launches.classList.contains('mobile-launch-form'))return true;
    if(overlayVisible())return true;
    return false;
  }
  function updateVisibility(){ensureButton().classList.toggle('mc-quick-hidden-v040',shouldHide())}
  function refreshSoon(){requestAnimationFrame(()=>requestAnimationFrame(updateVisibility))}

  function openNewEntry(){
    if(!mq.matches)return;
    try{if(typeof resetForm==='function')resetForm()}catch{}
    const nav=document.querySelector('.nav-btn[data-page="launches"]');
    if(nav)nav.click();else{try{if(typeof showPage==='function')showPage('launches')}catch{}}
    setTimeout(()=>{
      try{if(typeof resetForm==='function')resetForm()}catch{}
      const launchPage=document.getElementById('launchesPage');
      const formShortcut=document.querySelector('.mobile-launch-card[data-mobile-launch="form"]');
      if(formShortcut)formShortcut.click();else if(launchPage){launchPage.classList.remove('mobile-launch-list');launchPage.classList.add('mobile-launch-form')}
      window.scrollTo({top:0,behavior:'smooth'});
      setTimeout(()=>document.getElementById('description')?.focus({preventScroll:true}),220);
      refreshSoon();
    },60);
  }

  function watch(){
    document.addEventListener('click',e=>{
      if(e.target.closest('.nav-btn[data-page],.mobile-launch-card,.mobile-launch-back,.mobile-settings-back,.mobile-more-card,.tab'))refreshSoon();
    },true);
    window.addEventListener('resize',refreshSoon);
    window.addEventListener('meucontrole:app-ready',refreshSoon);
    mq.addEventListener?.('change',refreshSoon);
  }

  function boot(){installStyles();ensureButton();watch();refreshSoon()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('load',refreshSoon,{once:true});
  window.MeuControleQuickEntryV040={version:VERSION,open:openNewEntry,refresh:updateVisibility};
})();
