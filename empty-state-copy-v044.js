/* MeuControle — V0.44: microtextos e próximos passos nos estados vazios */
(function(){
  if(window.__meuControleEmptyStateCopyV044Loaded)return;
  window.__meuControleEmptyStateCopyV044Loaded=true;
  const VERSION='0.44';
  const isMobile=()=>matchMedia('(max-width:700px)').matches;
  const $=s=>document.querySelector(s);

  function installStyles(){
    if(document.getElementById('emptyStateCopyV044Style'))return;
    const st=document.createElement('style');st.id='emptyStateCopyV044Style';st.textContent=`
      .mc-calendar-empty-action-v044{display:none;width:max-content;margin:10px auto 0;min-height:40px!important;padding:8px 13px!important;font-size:11px!important}
      .mc-calendar-empty-action-v044.show{display:block}
      @media(max-width:700px){.mc-calendar-empty-action-v044{width:100%;min-height:42px!important}}
    `;document.head.appendChild(st);
  }

  function totalEntries(){try{return Array.isArray(entries)?entries.length:0}catch{return 0}}
  function visibleProfileEntries(){try{return profileFiltered(entries).length}catch{return totalEntries()}}

  function openNewEntry(){
    try{resetForm()}catch{}
    if(isMobile()&&window.MeuControleQuickEntryV040?.open){window.MeuControleQuickEntryV040.open();return}
    try{document.querySelector('.nav-btn[data-page="launches"]')?.click()}catch{}
    try{showPage('launches')}catch{}
    setTimeout(()=>{try{resetForm()}catch{};if(isMobile())document.querySelector('.mobile-launch-card[data-mobile-launch="form"]')?.click();setTimeout(()=>document.getElementById('description')?.focus(),100)},70);
  }

  function syncLaunchEmpty(){
    const empty=$('#emptyState'),btn=$('#mcEmptyActionV037');if(!empty||!btn||empty.classList.contains('hidden'))return;
    const q=String(document.getElementById('globalSearch')?.value||globalQuery||'').trim();
    let filter='all';try{filter=currentFilter||'all'}catch{}
    const total=totalEntries(),profileTotal=visibleProfileEntries();
    if(q){
      empty.textContent='Nenhum lançamento encontrado com esta pesquisa. Tente outro termo ou limpe a busca.';
      btn.textContent='Limpar pesquisa';btn.dataset.mode='clear-v044';
    }else if(total===0){
      empty.textContent='Nenhum lançamento ainda. Crie o primeiro para começar a organizar sua rotina.';
      btn.textContent='+ Criar primeiro lançamento';btn.dataset.mode='new-v044';
    }else if(profileTotal===0){
      empty.textContent='Este perfil ainda não possui lançamentos.';
      btn.textContent='+ Criar lançamento';btn.dataset.mode='new-v044';
    }else if(filter!=='all'){
      const labels={today:'hoje',next:'nos próximos dias',late:'vencido',done:'concluído'};
      empty.textContent=`Nenhum lançamento ${labels[filter]||'neste filtro'} por aqui.`;
      btn.textContent='Ver todos';btn.dataset.mode='all-v044';
    }else{
      empty.textContent='Nenhum lançamento para exibir neste momento.';
      btn.textContent='+ Criar lançamento';btn.dataset.mode='new-v044';
    }
    btn.classList.add('show');
    btn.onclick=()=>{
      if(btn.dataset.mode==='clear-v044'){
        const input=document.getElementById('globalSearch');if(input){input.value='';input.dispatchEvent(new Event('input',{bubbles:true}))}return;
      }
      if(btn.dataset.mode==='all-v044'){
        document.querySelector('.tab[data-filter="all"]')?.click();return;
      }
      openNewEntry();
    };
  }

  function ensureCalendarAction(){
    const empty=$('#calendarEmpty');if(!empty)return null;
    let btn=$('#mcCalendarEmptyActionV044');if(btn)return btn;
    btn=document.createElement('button');btn.id='mcCalendarEmptyActionV044';btn.type='button';btn.className='mc-calendar-empty-action-v044';empty.after(btn);return btn;
  }

  function syncCalendarEmpty(){
    const empty=$('#calendarEmpty'),btn=ensureCalendarAction();if(!empty||!btn)return;
    const shown=!empty.classList.contains('hidden');btn.classList.toggle('show',shown);if(!shown)return;
    const q=String(document.getElementById('calendarSearch')?.value||'').trim();
    if(q){
      empty.textContent='Nenhum lançamento encontrado neste mês com essa pesquisa.';
      btn.textContent='Limpar pesquisa';btn.onclick=()=>{const input=document.getElementById('calendarSearch');if(input){input.value='';input.dispatchEvent(new Event('input',{bubbles:true}))}};
    }else{
      empty.textContent='Nenhum lançamento neste mês. Quando você cadastrar um, ele aparecerá aqui automaticamente.';
      btn.textContent='+ Criar lançamento';btn.onclick=openNewEntry;
    }
  }

  function refineImportantEmpty(){
    const empty=$('#importantList .empty');if(empty)empty.textContent='Nenhum item importante pendente. Marque um lançamento com ★ para encontrá-lo aqui.';
  }

  function refineDashboardDetail(kind){
    const empty=$('#dashboardDetailList .empty');if(!empty)return;
    const text={
      today:'Nada pendente para hoje. Seu dia está em dia.',
      month:'Nenhum lançamento pendente neste mês.',
      important:'Nenhum item importante pendente neste mês.',
      expenses:'Nenhuma despesa pendente neste mês.',
      late:'Nenhum vencido. Tudo em dia por aqui.'
    }[kind]||'Nenhum item para mostrar aqui.';
    empty.textContent=text;
  }

  const originalRenderList=typeof renderList==='function'?renderList:null;
  if(originalRenderList)renderList=function(){const r=originalRenderList.apply(this,arguments);setTimeout(syncLaunchEmpty,0);return r};

  const originalRenderCalendar=typeof renderCalendar==='function'?renderCalendar:null;
  if(originalRenderCalendar)renderCalendar=function(){const r=originalRenderCalendar.apply(this,arguments);setTimeout(syncCalendarEmpty,0);return r};

  const originalImportant=typeof renderImportantModal==='function'?renderImportantModal:null;
  if(originalImportant)renderImportantModal=function(){const r=originalImportant.apply(this,arguments);refineImportantEmpty();return r};

  const originalDashboardDetail=typeof openDashboardDetail==='function'?openDashboardDetail:null;
  if(originalDashboardDetail)openDashboardDetail=function(kind){const r=originalDashboardDetail.apply(this,arguments);refineDashboardDetail(kind);return r};

  function boot(){installStyles();setTimeout(()=>{syncLaunchEmpty();syncCalendarEmpty();refineImportantEmpty()},80)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('load',()=>setTimeout(boot,500));
  window.MeuControleEmptyStateCopyV044={version:VERSION,refresh:boot};
})();
