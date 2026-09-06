/* MeuControle — V0.43: Painel vazio orientado para o primeiro uso */
(function(){
  if(window.__meuControleFirstUseDashboardV043Loaded)return;
  window.__meuControleFirstUseDashboardV043Loaded=true;
  const VERSION='0.43';
  const mq=matchMedia('(max-width:700px)');
  const originalRenderDashboard=typeof renderDashboard==='function'?renderDashboard:null;

  function installStyles(){
    if(document.getElementById('firstUseDashboardV043Style'))return;
    const st=document.createElement('style');
    st.id='firstUseDashboardV043Style';
    st.textContent=`
      .mc-first-use-v043{margin-top:18px;padding:24px;border:1px solid #dfe7e2;border-radius:18px;background:linear-gradient(145deg,#fff,#f8fbfa);box-shadow:0 10px 28px rgba(22,79,120,.055);display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:18px;align-items:center}
      .mc-first-use-icon-v043{width:58px;height:58px;border-radius:16px;background:var(--primary-soft);color:var(--primary);display:grid;place-items:center;font:900 29px system-ui,sans-serif}
      .mc-first-use-copy-v043 h3{margin:0;color:#263a30;font-size:21px}.mc-first-use-copy-v043 p{margin:6px 0 0;color:#718078;font-size:13px;line-height:1.55;max-width:660px}
      .mc-first-use-action-v043{min-height:44px!important;padding:10px 16px!important;white-space:nowrap}
      #dashboardPage.mc-dashboard-empty-v043 .premium-cards,#dashboardPage.mc-dashboard-empty-v043 .dashboard-hint,#dashboardPage.mc-dashboard-empty-v043 .central-hoje-v041{display:none!important}
      @media(max-width:700px){
        .mc-first-use-v043{margin-top:14px;padding:18px 16px;border-radius:15px;grid-template-columns:48px minmax(0,1fr);gap:13px;align-items:start}
        .mc-first-use-icon-v043{width:48px;height:48px;border-radius:14px;font-size:24px}.mc-first-use-copy-v043 h3{font-size:18px}.mc-first-use-copy-v043 p{font-size:11px;line-height:1.5}.mc-first-use-action-v043{grid-column:1/-1;width:100%;margin-top:3px}
      }
    `;
    document.head.appendChild(st);
  }

  function entryCount(){
    try{if(Array.isArray(entries))return entries.length}catch{}
    try{const v=JSON.parse(localStorage.getItem('meu_controle_entries_v2')||'[]');return Array.isArray(v)?v.length:0}catch{return 0}
  }

  function openFirstEntry(){
    try{resetForm()}catch{}
    if(mq.matches&&window.MeuControleQuickEntryV040?.open){window.MeuControleQuickEntryV040.open();return}
    try{document.querySelector('.nav-btn[data-page="launches"]')?.click()}catch{}
    try{if(!document.querySelector('.nav-btn[data-page="launches"]'))showPage('launches')}catch{}
    setTimeout(()=>{
      try{resetForm()}catch{}
      if(mq.matches){
        const card=document.querySelector('.mobile-launch-card[data-mobile-launch="form"]');
        if(card)card.click();
      }
      setTimeout(()=>document.getElementById('description')?.focus(),120);
    },80);
  }

  function ensureBlock(){
    const host=document.querySelector('#dashboardPage .premium-dashboard');if(!host)return null;
    let block=host.querySelector('.mc-first-use-v043');
    if(block)return block;
    block=document.createElement('section');
    block.className='mc-first-use-v043';
    block.setAttribute('aria-label','Comece a usar o MeuControle');
    block.innerHTML=`<div class="mc-first-use-icon-v043">＋</div><div class="mc-first-use-copy-v043"><h3>Comece por aqui</h3><p>Cadastre uma despesa, compromisso, consulta ou lembrete. Depois disso, o MeuControle organiza automaticamente datas, vencimentos e o que merece sua atenção.</p></div><button type="button" class="mc-first-use-action-v043">+ Criar primeiro lançamento</button>`;
    const cards=host.querySelector('.premium-cards');
    if(cards)cards.before(block);else host.appendChild(block);
    block.querySelector('.mc-first-use-action-v043').onclick=openFirstEntry;
    return block;
  }

  function renderFirstUse(){
    installStyles();
    const page=document.getElementById('dashboardPage');if(!page)return;
    const empty=entryCount()===0;
    const block=ensureBlock();
    if(block)block.hidden=!empty;
    page.classList.toggle('mc-dashboard-empty-v043',empty);
  }

  if(originalRenderDashboard){
    renderDashboard=function(){const r=originalRenderDashboard();try{renderFirstUse()}catch{}return r};
  }
  function boot(){installStyles();renderFirstUse()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('load',()=>setTimeout(renderFirstUse,500));
  window.addEventListener('storage',e=>{if(e.key==='meu_controle_entries_v2')renderFirstUse()});
  window.MeuControleFirstUseDashboardV043={version:VERSION,refresh:renderFirstUse,open:openFirstEntry};
})();
