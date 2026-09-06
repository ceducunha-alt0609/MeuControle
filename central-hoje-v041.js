/* Meu Controle — V0.41: Central Hoje operacional no Painel */
(function(){
  if(window.__meuControleCentralHojeV041Loaded)return;
  window.__meuControleCentralHojeV041Loaded=true;
  const VERSION='0.41';
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
      @media(max-width:900px){.central-hoje-grid-v041{grid-template-columns:1fr}.central-lane-v041{border-right:0;border-bottom:1px solid #e7ece9}.central-lane-v041:last-child{border-bottom:0}}
      @media(max-width:700px){.central-hoje-v041{margin-top:14px;border-radius:15px}.central-hoje-head-v041{padding:15px 14px 12px;align-items:flex-start}.central-hoje-head-v041 h3{font-size:18px}.central-hoje-head-v041 p{font-size:11px}.central-hoje-date-v041{display:none}.central-lane-v041{padding:13px 13px 14px}.central-item-v041{padding:10px}.central-done-v041{width:34px!important;height:34px!important;min-height:34px!important}}
    `;
    document.head.appendChild(st);
  }

  function sourceData(){
    let list=[];
    try{list=profileFiltered(entries).filter(e=>e&&!e.done&&e.date)}catch{return{late:[],today:[],important:[]}}
    const today=isoToday();
    const late=list.filter(e=>e.date<today).sort(byDateTime);
    const todayItems=list.filter(e=>e.date===today).sort(byDateTime);
    const important=list.filter(e=>e.date>today&&e.important).sort(byDateTime);
    return{late,today:todayItems,important};
  }

  function metaFor(item,kind){
    const bits=[];
    if(kind==='today'){
      if(item.time)bits.push(item.time);
      try{bits.push(typeLabel(item.type))}catch{}
    }else{
      try{bits.push(fmtDate(item.date))}catch{bits.push(item.date||'')}
      if(item.time)bits.push(item.time);
    }
    try{bits.push(profileName(item.profile))}catch{}
    return bits.filter(Boolean).join(' • ');
  }

  function lane(kind,title,items,emptyText){
    const el=document.createElement('section');
    el.className=`central-lane-v041 ${kind}`;
    el.innerHTML=`<div class="central-lane-title-v041"><strong>${escLocal(title)}</strong><span class="central-lane-count-v041">${items.length}</span></div><div class="central-items-v041"></div><button type="button" class="central-more-v041">Ver todos</button>`;
    const box=el.querySelector('.central-items-v041');
    if(!items.length){box.innerHTML=`<div class="central-empty-v041">${escLocal(emptyText)}</div>`;el.querySelector('.central-more-v041').style.display='none'}
    else items.slice(0,MAX_ITEMS).forEach(item=>{
      const row=document.createElement('div');
      row.className='central-item-v041';
      row.innerHTML=`<div class="central-item-main-v041"><strong>${item.important?'★ ':''}${escLocal(item.description||'Lançamento')}</strong><span>${escLocal(metaFor(item,kind))}</span></div><button type="button" class="central-done-v041" title="Concluir" aria-label="Concluir ${escLocal(item.description||'lançamento')}">✓</button>`;
      row.querySelector('.central-done-v041').onclick=e=>{e.stopPropagation();try{toggleDone(item.id)}catch{}};
      box.appendChild(row);
    });
    const more=el.querySelector('.central-more-v041');
    if(items.length<=MAX_ITEMS)more.textContent='Abrir detalhes';else more.textContent=`Ver todos (${items.length})`;
    more.onclick=()=>{
      try{
        if(kind==='important'){
          renderImportantModal();
          document.getElementById('importantModal')?.classList.remove('hidden');
        }else openDashboardDetail(kind==='late'?'late':'today');
      }catch{}
    };
    return el;
  }

  function renderCentral(){
    installStyles();
    const host=document.querySelector('#dashboardPage .premium-dashboard');
    if(!host)return;
    let panel=host.querySelector('.central-hoje-v041');
    if(!panel){
      panel=document.createElement('section');panel.className='central-hoje-v041';
      panel.innerHTML='<div class="central-hoje-head-v041"><div><h3>Central Hoje</h3><p>O que precisa da sua atenção, sem sair do Painel.</p></div><span class="central-hoje-date-v041"></span></div><div class="central-hoje-grid-v041"></div>';
      host.appendChild(panel);
    }
    const d=new Date();
    const dateLabel=d.toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'});
    panel.querySelector('.central-hoje-date-v041').textContent=dateLabel.charAt(0).toUpperCase()+dateLabel.slice(1);
    const data=sourceData(),grid=panel.querySelector('.central-hoje-grid-v041');grid.innerHTML='';
    grid.append(
      lane('late','⚠ Vencidos',data.late,'Nenhuma pendência vencida.'),
      lane('today','Hoje',data.today,'Nada previsto para hoje.'),
      lane('important','★ Importantes a seguir',data.important,'Nenhum importante futuro pendente.')
    );
  }

  if(originalRenderDashboard){
    renderDashboard=function(){const r=originalRenderDashboard();try{renderCentral()}catch{}return r};
  }
  function boot(){installStyles();renderCentral()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('load',()=>setTimeout(renderCentral,500));
  window.MeuControleCentralHojeV041={version:VERSION,refresh:renderCentral};
})();
