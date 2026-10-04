/* Meu Controle — Central de Feriados V1 */
(function(){
  if(window.__mcHolidayCenterV1)return;window.__mcHolidayCenterV1=true;
  const KEY='meu_controle_holidays_v1';
  const pad=n=>String(n).padStart(2,'0');
  const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const easter=y=>{const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=(h+l-7*m+114)%31+1;return new Date(y,mo-1,da)};
  const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
  const defaults=y=>{
    const e=easter(y);
    return [
      {date:`${y}-01-01`,name:'Confraternização Universal',scope:'Nacional'},
      {date:`${y}-01-25`,name:'Aniversário da Cidade de São Paulo',scope:'Municipal'},
      {date:iso(addDays(e,-2)),name:'Paixão de Cristo',scope:'Municipal'},
      {date:`${y}-04-21`,name:'Tiradentes',scope:'Nacional'},
      {date:`${y}-05-01`,name:'Dia Mundial do Trabalho',scope:'Nacional'},
      {date:iso(addDays(e,60)),name:'Corpus Christi',scope:'Municipal'},
      {date:`${y}-07-09`,name:'Data Magna do Estado de São Paulo',scope:'Estadual'},
      {date:`${y}-09-07`,name:'Independência do Brasil',scope:'Nacional'},
      {date:`${y}-10-12`,name:'Nossa Senhora Aparecida',scope:'Nacional'},
      {date:`${y}-11-02`,name:'Finados',scope:'Nacional'},
      {date:`${y}-11-15`,name:'Proclamação da República',scope:'Nacional'},
      {date:`${y}-11-20`,name:'Dia Nacional de Zumbi e da Consciência Negra',scope:'Nacional'},
      {date:`${y}-12-25`,name:'Natal',scope:'Nacional'}
    ].map(x=>({...x,id:'base:'+x.date,enabled:true,builtin:true}));
  };
  function state(){try{return JSON.parse(localStorage.getItem(KEY)||'{"disabled":[],"custom":[]}')}catch{return{disabled:[],custom:[]}}}
  function save(s){localStorage.setItem(KEY,JSON.stringify(s));window.dispatchEvent(new CustomEvent('meucontrole:holidays-changed'));refresh()}
  function holidays(y){const s=state(),base=defaults(y).map(x=>({...x,enabled:!s.disabled.includes(x.id)})),custom=(s.custom||[]).map(x=>{const yy=x.annual?String(y)+x.date.slice(4):x.date;return{...x,date:yy,scope:'Personalizado',builtin:false,enabled:x.enabled!==false}}).filter(x=>x.date.startsWith(String(y)));return [...base,...custom].sort((a,b)=>a.date.localeCompare(b.date))}
  function activeMap(y){return new Map(holidays(y).filter(x=>x.enabled).map(x=>[x.date,x.name]))}
  window.MeuControleHolidaysV1={list:holidays,map:activeMap};

  /* Integra com a regra já existente de próximo dia útil. */
  try{
    holidayMapSP=function(year){return activeMap(year)};
  }catch{}

  const css=document.createElement('style');css.textContent=`
    .mc-holiday-card{grid-column:1/-1}
    .mc-holiday-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:13px}
    .mc-holiday-head p{margin:4px 0 0!important}
    .mc-holiday-list{display:grid;gap:7px;max-height:330px;overflow:auto;padding-right:3px}
    .mc-holiday-row{display:grid;grid-template-columns:76px minmax(0,1fr) auto;gap:10px;align-items:center;padding:9px 10px;border:1px solid #e1e8e4;border-radius:11px;background:#fff}
    .mc-holiday-row time{font-size:12px;font-weight:800;color:var(--primary)}
    .mc-holiday-row strong{display:block;font-size:13px}.mc-holiday-row small{display:block;margin-top:2px;color:#718078;font-size:10px}
    .mc-holiday-toggle{width:36px;height:22px;padding:0;border-radius:99px;background:#c8d2cd;position:relative}
    .mc-holiday-toggle:after{content:"";position:absolute;width:16px;height:16px;left:3px;top:3px;border-radius:50%;background:#fff;transition:.15s}
    .mc-holiday-toggle.on{background:var(--primary)}.mc-holiday-toggle.on:after{left:17px}
    .mc-holiday-add{display:grid;grid-template-columns:150px minmax(0,1fr) 120px auto;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid #e5ebe7}
    .mc-holiday-add input,.mc-holiday-add select{min-width:0}
    .mc-holiday-dot-v1{width:6px;height:6px;border-radius:50%;display:block;background:#1684c6;box-shadow:0 0 0 1px rgba(255,255,255,.8)}
    .mc-holiday-banner-v1{margin:0 0 10px;padding:9px 11px;border:1px solid #cfe3f0;border-radius:10px;background:#eef7fc;color:#195f89;font-size:12px;font-weight:700}
    body.mc-dark .mc-holiday-row{background:#182229;border-color:#34434c}body.mc-dark .mc-holiday-row strong{color:#eef3f6}body.mc-dark .mc-holiday-row small{color:#aebbc3}
    @media(max-width:700px){
      .mc-holiday-card{padding:16px!important}.mc-holiday-head{align-items:flex-start}
      .mc-holiday-list{max-height:none}.mc-holiday-row{grid-template-columns:68px minmax(0,1fr) auto}
      .mc-holiday-add{grid-template-columns:1fr}.mc-holiday-add button{width:100%}
    }`;document.head.appendChild(css);

  function ensureCard(){
    const grid=document.querySelector('#settingsPage .settings-grid');if(!grid||document.querySelector('.mc-holiday-card'))return;
    const card=document.createElement('article');card.className='settings-card mc-holiday-card';
    card.innerHTML=`<div class="mc-holiday-head"><div><h3>Feriados</h3><p>Nacionais, estaduais, municipais e datas personalizadas.</p></div><span style="font-size:22px">●</span></div><div class="mc-holiday-list"></div><form class="mc-holiday-add"><input type="date" required aria-label="Data"><input type="text" maxlength="60" required placeholder="Nome da data"><select aria-label="Repetição"><option value="annual">Repetir todo ano</option><option value="once">Somente esta data</option></select><button type="submit">Adicionar</button></form>`;
    grid.appendChild(card);
    card.querySelector('form').onsubmit=e=>{e.preventDefault();const [date,name,repeat]=e.currentTarget.elements;if(!date.value||!name.value.trim())return;const s=state();s.custom=s.custom||[];s.custom.push({id:'custom:'+Date.now(),date:date.value,name:name.value.trim(),annual:repeat.value==='annual',enabled:true});save(s);e.currentTarget.reset();renderCard()};
    renderCard();
  }
  function renderCard(){
    const box=document.querySelector('.mc-holiday-list');if(!box)return;const y=new Date().getFullYear(),s=state();
    box.innerHTML=holidays(y).map(h=>`<div class="mc-holiday-row"><time>${h.date.slice(8,10)}/${h.date.slice(5,7)}</time><span><strong>${h.name.replace(/[<>&"]/g,'')}</strong><small>${h.scope}${h.builtin?' · padrão':' · personalizado'}</small></span><button type="button" class="mc-holiday-toggle ${h.enabled?'on':''}" data-id="${h.id}" data-custom="${h.builtin?'0':'1'}" aria-label="${h.enabled?'Desativar':'Ativar'} ${h.name}"></button></div>`).join('');
    box.querySelectorAll('.mc-holiday-toggle').forEach(b=>b.onclick=()=>{const st=state(),id=b.dataset.id;if(b.dataset.custom==='1'){const x=(st.custom||[]).find(v=>v.id===id);if(x)x.enabled=x.enabled===false}else{st.disabled=st.disabled||[];st.disabled=st.disabled.includes(id)?st.disabled.filter(x=>x!==id):[...st.disabled,id]}save(st);renderCard()});
  }
  function decorateCalendar(){
    const y=typeof calendarYear==='number'?calendarYear:new Date().getFullYear(),map=activeMap(y);
    document.querySelectorAll('.mobile-calendar-day-v109[data-date]').forEach(btn=>{
      const date=btn.dataset.date,name=map.get(date),dots=btn.querySelector('.mc-day-dots-v109');
      btn.querySelector('.mc-holiday-dot-v1')?.remove();
      if(name&&dots){const d=document.createElement('i');d.className='mc-holiday-dot-v1';d.title=name;dots.appendChild(d);btn.setAttribute('aria-label',(btn.getAttribute('aria-label')||'')+', feriado: '+name)}
    });
    const list=document.getElementById('calendarEventsList');if(!list)return;
    const selected=localStorage.getItem('meu_controle_mobile_calendar_selected_v1');
    let b=list.parentElement?.querySelector('.mc-holiday-banner-v1');
    const name=matchMedia('(max-width:700px)').matches&&selected?map.get(selected):'';
    if(name){
      if(!b){b=document.createElement('div');b.className='mc-holiday-banner-v1';list.before(b)}
      b.textContent='● '+name+' · Feriado';
      b.hidden=false;
    }else if(b){b.hidden=true}
  }
  function refresh(){renderCard();setTimeout(decorateCalendar,0);setTimeout(decorateCalendar,150)}
  ensureCard();
  /* Observa somente mudanças estruturais relevantes, sem repintar o DOM dentro do próprio observer. */
  let holidaySyncQueued=false;
  const mo=new MutationObserver(mutations=>{
    if(holidaySyncQueued)return;
    const relevant=mutations.some(m=>[...m.addedNodes].some(n=>n.nodeType===1&&(n.matches?.('#settingsPage,.mobile-calendar-grid-v109')||n.querySelector?.('#settingsPage,.mobile-calendar-grid-v109'))));
    if(!relevant)return;
    holidaySyncQueued=true;
    requestAnimationFrame(()=>{holidaySyncQueued=false;ensureCard();decorateCalendar()});
  });
  mo.observe(document.body,{childList:true,subtree:true});
  window.addEventListener('meucontrole:holidays-changed',refresh);
  document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click',()=>setTimeout(refresh,60)));
  setTimeout(refresh,500);
})();