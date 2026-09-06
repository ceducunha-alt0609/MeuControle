/* Meu Controle — V0.41.1: Central Hoje operacional no Painel */
(function(){
  if(window.__meuControleCentralHojeV041Loaded)return;
  window.__meuControleCentralHojeV041Loaded=true;
  const VERSION='0.41.1';
  const MAX_ITEMS=3;
  const originalRenderDashboard=typeof renderDashboard==='function'?renderDashboard:null;

  const escLocal=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isoToday=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
  const byDateTime=(a,b)=>(a.date+(a.time||'23:59')).localeCompare(b.date+(b.time||'23:59'));

  function installStyles(){
    if(document.getElementById('centralHojeV041Style'))return;
    const st=document.createElement('style');
    st.id='centralHojeV041Style';
    st.textContent=`
      .central-hoje-v041{margin-top:18px;border:1px solid #dfe7e2;border-radius:18px;background:#fff;box-shadow:0 8px 24px rgba(0,0,0,.045);overflow:hidden}
      .central-hoje-head-v041{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;padding:18px 18px 14px;border-bottom:1px solid #e7ece9}
      .central-hoje-head-v041 h3{margin:0;color:#263a30;font-size:20px}.central-hoje-head-v041 p{margin:5px 0 0;color:#748078;font-size:12px;line-height:1.45}
      .central-hoje-date-v041{font-size:11px;font-weight:800;color:var(--primary);white-space:nowrap}
      .central-hoje-grid-v041{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0}
      .central-lane-v041{min-width:0;padding:15px 16px 16px;border-right:1px solid #e7ece9}.central-lane-v041:last-child{border-right:0}
      .central-lane-title-v041{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.central-lane-title-v041 strong{font-size:13px;color:#34483e}.central-lane-count-v041{min-width:26px;height:24px;padding:0 7px;border-radius:8px;display:grid;place-items:center;background:#edf4f0;color:#40564a;font:800 11px system-ui,sans-serif}
      .central-lane-v041.late .central-lane-count-v041{background:#fff0ed;color:#a23e36}.central-lane-v041.today .central-lane-count-v041{background:#edf5fa;color:#164f78}.central-lane-v041.important .central-lane-count-v041{background:#fff8df;color:#8b6b00}
      .central-items-v041{display:grid;gap:8px}.central-item-v041{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px 10px 10px 11px;border:1px solid #e7ece9;border-radius:11px;background:#fafcfb}
      .central-item-main-v041{min-width:0}.central-item-main-v041 strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;color:#2d4036}.central-item-main-v041 span{display:block;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10px;color:#7b8781}
      .central-done-v041{width:32px!important;height:32px!important;min-height:32px!important;padding:0!important;border-radius:9px!important;background:#edf4f0!important;color:var(--primary)!important;border:1px solid #d8e4dd!important;box-shadow:none!important;font-size:15px!important}
      .central-done-v041:hover{background:var(--primary-soft)!important;transform:none!important}
      .central-empty-v041{min-height:70px;padding:14px 10px;border:1px dashed #dfe6e1;border-radius:11px;display:flex;align-items:center;justify-content:center;text-align:center;color:#89948e;font-size:11px;line-height:1.45}
      .central-more-v041{width:100%;margin-top:10px;padding:7px 0!important;min-height:30px!important;background:transparent!important;color:var(--primary)!important;border:0!important;box-shadow:none!important;font-size:11px!important;font-weight:800!important}.central-more-v041:hover{transform:none!important;text-decoration:underline}
      .central-mobile-card-v041,.central-mobile-sheet-v041{display:none}
      @media(max-width:900px) and (min-width:701px){.central-hoje-grid-v041{grid-template-columns:1fr}.central-lane-v041{border-right:0;border-bottom:1px solid #e7ece9}.central-lane-v041:last-child{border-bottom:0}}
      @media(max-width:700px){
        .central-hoje-v041{margin-top:14px;border:0;background:transparent;box-shadow:none;overflow:visible}
        .central-hoje-head-v041,.central-hoje-grid-v041{display:none!important}
        .central-mobile-card-v041{display:grid;grid-template-columns:44px minmax(0,1fr) auto;gap:12px;align-items:center;width:100%;min-height:88px;padding:14px 15px;border:1px solid #dfe7e2;border-radius:15px;background:#fff;color:var(--text);box-shadow:0 6px 18px rgba(0,0,0,.045);text-align:left}
        .central-mobile-card-v041:active{transform:scale(.99)}
        .central-mobile-icon-v041{width:44px;height:44px;border-radius:13px;background:var(--primary-soft);color:var(--primary);display:grid;place-items:center;font:800 20px system-ui,sans-serif}
        .central-mobile-copy-v041 strong{display:block;font-size:15px;color:#2b4035}.central-mobile-copy-v041 span{display:block;margin-top:4px;font-size:10px;line-height:1.45;color:#77847d}
        .central-mobile-arrow-v041{font:400 24px system-ui,sans-serif;color:#9aa6a0}
        .central-mobile-badges-v041{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px}.central-mobile-badge-v041{padding:3px 6px;border-radius:7px;background:#f1f5f3;color:#5c6c63;font:800 9px system-ui,sans-serif}.central-mobile-badge-v041.late{background:#fff0ed;color:#a23e36}.central-mobile-badge-v041.today{background:#edf5fa;color:#164f78}.central-mobile-badge-v041.important{background:#fff8df;color:#8b6b00}
        .central-mobile-sheet-v041{position:fixed;inset:0;z-index:101020;background:rgba(13,31,43,.48);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);align-items:flex-end;padding:14px}
        .central-mobile-sheet-v041.show{display:flex}
        .central-mobile-sheet-card-v041{width:100%;max-height:86vh;overflow:auto;background:#fff;border:1px solid #e1e8e4;border-radius:21px 21px 15px 15px;box-shadow:0 28px 80px rgba(0,0,0,.28);padding:17px;color:#20342a}
        .central-mobile-sheet-head-v041{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}.central-mobile-sheet-head-v041 h3{margin:0;font-size:20px}.central-mobile-sheet-head-v041 p{margin:4px 0 0;font-size:10px;color:#77847d}.central-mobile-close-v041{width:36px!important;height:36px!important;min-height:36px!important;padding:0!important;border-radius:10px!important;background:#eef3f0!important;color:#56665d!important;box-shadow:none!important}
        .central-mobile-sheet-grid-v041{display:grid;gap:10px}.central-mobile-sheet-grid-v041 .central-lane-v041{padding:12px;border:1px solid #e6ece8;border-radius:13px}.central-mobile-sheet-grid-v041 .central-empty-v041{min-height:56px}.central-mobile-sheet-grid-v041 .central-item-v041{padding:10px}.central-mobile-sheet-grid-v041 .central-done-v041{width:34px!important;height:34px!important;min-height:34px!important}
      }
    `;
    document.head.appendChild(st);
  }

  function sourceData(){
    let list=[];
    try{list=profileFiltered(entries).filter(e=>e&&!e.done&&e.date)}catch{return{late:[],today:[],important:[]}}
    const today=isoToday();
    return{
      late:list.filter(e=>e.date<today).sort(byDateTime),
      today:list.filter(e=>e.date===today).sort(byDateTime),
      important:list.filter(e=>e.date>today&&e.important).sort(byDateTime)
    };
  }

  function metaFor(item,kind){
    const bits=[];
    if(kind==='today'){if(item.time)bits.push(item.time);try{bits.push(typeLabel(item.type))}catch{}}
    else{try{bits.push(fmtDate(item.date))}catch{bits.push(item.date||'')}if(item.time)bits.push(item.time)}
    try{bits.push(profileName(item.profile))}catch{}
    return bits.filter(Boolean).join(' • ');
  }

  function openAll(kind){
    try{
      closeMobileSheet();
      if(kind==='important'){renderImportantModal();document.getElementById('importantModal')?.classList.remove('hidden')}
      else openDashboardDetail(kind==='late'?'late':'today');
    }catch{}
  }

  function lane(kind,title,items,emptyText){
    const el=document.createElement('section');el.className=`central-lane-v041 ${kind}`;
    el.innerHTML=`<div class="central-lane-title-v041"><strong>${escLocal(title)}</strong><span class="central-lane-count-v041">${items.length}</span></div><div class="central-items-v041"></div><button type="button" class="central-more-v041">Ver todos</button>`;
    const box=el.querySelector('.central-items-v041');
    if(!items.length){box.innerHTML=`<div class="central-empty-v041">${escLocal(emptyText)}</div>`;el.querySelector('.central-more-v041').style.display='none'}
    else items.slice(0,MAX_ITEMS).forEach(item=>{
      const row=document.createElement('div');row.className='central-item-v041';
      row.innerHTML=`<div class="central-item-main-v041"><strong>${item.important?'★ ':''}${escLocal(item.description||'Lançamento')}</strong><span>${escLocal(metaFor(item,kind))}</span></div><button type="button" class="central-done-v041" title="Concluir">✓</button>`;
      row.querySelector('.central-done-v041').onclick=e=>{e.stopPropagation();try{toggleDone(item.id);if(matchMedia('(max-width:700px)').matches)openMobileSheet()}catch{}};
      box.appendChild(row);
    });
    const more=el.querySelector('.central-more-v041');more.textContent=items.length<=MAX_ITEMS?'Abrir detalhes':`Ver todos (${items.length})`;more.onclick=()=>openAll(kind);
    return el;
  }

  function ensureMobileSheet(){
    let sheet=document.querySelector('.central-mobile-sheet-v041');if(sheet)return sheet;
    sheet=document.createElement('div');sheet.className='central-mobile-sheet-v041';
    sheet.innerHTML='<section class="central-mobile-sheet-card-v041" role="dialog" aria-modal="true" aria-label="Central Hoje"><div class="central-mobile-sheet-head-v041"><div><h3>Central Hoje</h3><p>O que precisa da sua atenção agora.</p></div><button type="button" class="central-mobile-close-v041" aria-label="Fechar">×</button></div><div class="central-mobile-sheet-grid-v041"></div></section>';
    document.body.appendChild(sheet);sheet.querySelector('.central-mobile-close-v041').onclick=closeMobileSheet;sheet.onclick=e=>{if(e.target===sheet)closeMobileSheet()};return sheet;
  }
  function closeMobileSheet(){const sheet=document.querySelector('.central-mobile-sheet-v041');if(sheet)sheet.classList.remove('show');document.body.style.overflow=''}
  function openMobileSheet(){
    if(!matchMedia('(max-width:700px)').matches)return;
    const sheet=ensureMobileSheet(),grid=sheet.querySelector('.central-mobile-sheet-grid-v041'),data=sourceData();grid.innerHTML='';
    grid.append(lane('late','⚠ Vencidos',data.late,'Nenhuma pendência vencida.'),lane('today','Hoje',data.today,'Nada previsto para hoje.'),lane('important','★ Importantes a seguir',data.important,'Nenhum importante futuro pendente.'));
    sheet.classList.add('show');document.body.style.overflow='hidden';
  }

  function renderCentral(){
    installStyles();
    const host=document.querySelector('#dashboardPage .premium-dashboard');if(!host)return;
    let panel=host.querySelector('.central-hoje-v041');
    if(!panel){
      panel=document.createElement('section');panel.className='central-hoje-v041';
      panel.innerHTML='<div class="central-hoje-head-v041"><div><h3>Central Hoje</h3><p>O que precisa da sua atenção, sem sair do Painel.</p></div><span class="central-hoje-date-v041"></span></div><div class="central-hoje-grid-v041"></div><button type="button" class="central-mobile-card-v041"><span class="central-mobile-icon-v041">✓</span><span class="central-mobile-copy-v041"><strong>Central Hoje</strong><span>Resumo das prioridades do dia.</span><span class="central-mobile-badges-v041"></span></span><span class="central-mobile-arrow-v041">›</span></button>';
      host.appendChild(panel);panel.querySelector('.central-mobile-card-v041').onclick=openMobileSheet;
    }
    const d=new Date(),dateLabel=d.toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'});panel.querySelector('.central-hoje-date-v041').textContent=dateLabel.charAt(0).toUpperCase()+dateLabel.slice(1);
    const data=sourceData(),grid=panel.querySelector('.central-hoje-grid-v041');grid.innerHTML='';grid.append(lane('late','⚠ Vencidos',data.late,'Nenhuma pendência vencida.'),lane('today','Hoje',data.today,'Nada previsto para hoje.'),lane('important','★ Importantes a seguir',data.important,'Nenhum importante futuro pendente.'));
    const badges=panel.querySelector('.central-mobile-badges-v041');badges.innerHTML=`<span class="central-mobile-badge-v041 late">${data.late.length} vencido${data.late.length===1?'':'s'}</span><span class="central-mobile-badge-v041 today">${data.today.length} hoje</span><span class="central-mobile-badge-v041 important">${data.important.length} importante${data.important.length===1?'':'s'}</span>`;
  }

  if(originalRenderDashboard)renderDashboard=function(){const r=originalRenderDashboard();try{renderCentral()}catch{}return r};
  function boot(){installStyles();renderCentral()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('load',()=>setTimeout(renderCentral,500));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMobileSheet()});
  window.MeuControleCentralHojeV041={version:VERSION,refresh:renderCentral,open:openMobileSheet};
})();
