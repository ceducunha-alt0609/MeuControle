/* MeuControle — V0.43.1: Painel vazio orientado para o primeiro uso */
(function(){
  if(window.__meuControleFirstUseDashboardV043Loaded)return;
  window.__meuControleFirstUseDashboardV043Loaded=true;
  const VERSION='0.43.1';
  const mq=matchMedia('(max-width:700px)');
  const originalRenderDashboard=typeof renderDashboard==='function'?renderDashboard:null;

  function installStyles(){
    if(document.getElementById('firstUseDashboardV043Style'))return;
    const st=document.createElement('style');
    st.id='firstUseDashboardV043Style';
    st.textContent=`
      .mc-first-use-v043{margin:14px 0 18px;padding:18px 20px;border:1px solid #dfe7e2;border-radius:16px;background:linear-gradient(145deg,#fff,#f8fbfa);box-shadow:0 7px 20px rgba(22,79,120,.045);display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:15px;align-items:center}
      .mc-first-use-icon-v043{width:48px;height:48px;border-radius:14px;background:var(--primary-soft);color:var(--primary);display:grid;place-items:center;font:900 25px system-ui,sans-serif}
      .mc-first-use-copy-v043 h3{margin:0;color:#263a30;font-size:18px}.mc-first-use-copy-v043 p{margin:4px 0 0;color:#718078;font-size:12px;line-height:1.5;max-width:620px}
      .mc-first-use-action-v043{min-height:42px!important;padding:9px 15px!important;white-space:nowrap}
      #dashboardPage.mc-dashboard-empty-v043 .premium-cards,#dashboardPage.mc-dashboard-empty-v043 .dashboard-hint,#dashboardPage.mc-dashboard-empty-v043 .central-hoje-v041{display:none!important}
      @media(max-width:700px){
        .mc-first-use-v043{margin:14px 0 16px;padding:18px 16px;border-radius:15px;grid-template-columns:48px minmax(0,1fr);gap:13px;align-items:start}
        .mc-first-use-icon-v043{width:48px;height:48px;border-radius:14px;font-size:24px}.mc-first-use-copy-v043 h3{font-size:18px}.mc-first-use-copy-v043 p{font-size:11px;line-height:1.5}.mc-first-use-action-v043{grid-column:1/-1;width:100%;margin-top:3px}
      }
    `;
    document.head.appendChild(st);
  }

  function memoryCount(){try{return Array.isArray(entries)?entries.length:null}catch{return null}}
  function storageCount(){try{const v=JSON.parse(localStorage.getItem('meu_controle_entries_v2')||'[]');return Array.isArray(v)?v.length:null}catch{return null}}
  function dashboardSignals(){
    const ids=['countToday','countNext','countLate','countImportant','dashTodayMain','dashMonthMain','dashImportantMain','dashLateMain'];
    return ids.some(id=>{const n=Number(String(document.getElementById(id)?.textContent||'').replace(/[^0-9,-]/g,'').replace(',','.'));return Number.isFinite(n)&&n>0});
  }
  function isTrulyEmpty(){
    const mem=memoryCount(),stored=storageCount();
    if((mem!==null&&mem>0)||(stored!==null&&stored>0)||dashboardSignals())return false;
    return mem===0&&stored===0;
  }

  function openFirstEntry(){
    try{resetForm()}catch{}
    if(mq.matches&&window.MeuControleQuickEntryV040?.open){window.MeuControleQuickEntryV040.open();return}
    try{document.querySelector('.nav-btn[data-page="launches"]')?.click()}catch{}
    try{if(!document.querySelector('.nav-btn[data-page="launches"]'))showPage('launches')}catch{}
    setTimeout(()=>{
      try{resetForm()}catch{}
      if(mq.matches){const card=document.querySelector('.mobile-launch-card[data-mobile-launch="form"]');if(card)card.click()}
      setTimeout(()=>document.getElementById('description')?.focus(),120);
    },80);
  }

  function makeBlock(){
    const block=document.createElement('section');
    block.className='mc-first-use-v043';
    block.setAttribute('aria-label','Comece a usar o MeuControle');
    block.innerHTML=`<div class="mc-first-use-icon-v043">＋</div><div class="mc-first-use-copy-v043"><h3>Comece por aqui</h3><p>Cadastre uma despesa, compromisso, consulta ou lembrete. Depois disso, o MeuControle organiza automaticamente datas, vencimentos e o que merece sua atenção.</p></div><button type="button" class="mc-first-use-action-v043">+ Criar primeiro lançamento</button>`;
    block.querySelector('.mc-first-use-action-v043').onclick=openFirstEntry;
    return block;
  }

  function renderFirstUse(){
    installStyles();
    const page=document.getElementById('dashboardPage'),host=document.querySelector('#dashboardPage .premium-dashboard');if(!page||!host)return;
    const empty=isTrulyEmpty();
    let block=host.querySelector('.mc-first-use-v043');
    if(!empty){block?.remove();page.classList.remove('mc-dashboard-empty-v043');return}
    if(!block){block=makeBlock();const cards=host.querySelector('.premium-cards');if(cards)cards.before(block);else host.appendChild(block)}
    page.classList.add('mc-dashboard-empty-v043');
  }

  if(originalRenderDashboard){renderDashboard=function(){const r=originalRenderDashboard();try{renderFirstUse()}catch{}return r}}
  function boot(){installStyles();setTimeout(renderFirstUse,120)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('load',()=>{setTimeout(renderFirstUse,450);setTimeout(renderFirstUse,1400)});
  window.addEventListener('storage',e=>{if(e.key==='meu_controle_entries_v2')renderFirstUse()});
  window.addEventListener('meucontrole:sync-manual-v012-complete',()=>setTimeout(renderFirstUse,180));
  window.MeuControleFirstUseDashboardV043={version:VERSION,refresh:renderFirstUse,open:openFirstEntry};
})();
