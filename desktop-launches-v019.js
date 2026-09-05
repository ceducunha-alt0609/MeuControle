/* Meu Controle — V0.20: cards desktop em 2 colunas + agrupamento mensal + concluídos por mês */
(function(){
  if(window.__meuControleDesktopLaunchesV019Loaded)return;
  window.__meuControleDesktopLaunchesV019Loaded=true;

  const originalRenderList = typeof renderList==='function' ? renderList : null;

  function installStyles(){
    if(document.getElementById('desktopLaunchesV019Style'))return;
    const st=document.createElement('style');
    st.id='desktopLaunchesV019Style';
    st.textContent=`
      @media(min-width:701px){
        #launchesPage .mobile-launch-back{display:none!important}
        #launchesPage #list{
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:12px;
          align-items:start;
        }
        #launchesPage .item{
          display:grid;
          grid-template-columns:12px minmax(0,1fr);
          gap:10px 12px;
          align-items:start;
          min-height:118px;
          padding:16px;
          cursor:pointer;
          transition:.16s ease;
          background:#fff;
        }
        #launchesPage .item:hover{transform:translateY(-1px);box-shadow:0 8px 18px rgba(0,0,0,.06)}
        #launchesPage .item-main{min-width:0}
        #launchesPage .item-title-row{align-items:center;flex-wrap:wrap}
        #launchesPage .item-title{font-size:18px;line-height:1.15}
        #launchesPage .meta{line-height:1.45}
        #launchesPage .notes{display:none;margin-top:8px;padding-top:8px;border-top:1px solid #e7ece9}
        #launchesPage .item-side{
          grid-column:2;
          display:flex;
          flex-direction:column;
          align-items:flex-start;
          gap:10px;
          text-align:left;
          min-width:0;
        }
        #launchesPage .amount{
          display:block;
          min-width:0;
          font-size:24px;
          font-weight:800;
          line-height:1.05;
          color:var(--primary);
          white-space:nowrap;
        }
        #launchesPage .amount:empty{display:none}
        #launchesPage .item-actions{
          display:none;
          gap:7px;
          margin-top:0;
          flex-wrap:wrap;
        }
        #launchesPage .item.desktop-card-open{box-shadow:0 10px 24px rgba(0,0,0,.08)}
        #launchesPage .item.desktop-card-open .item-actions{display:flex}
        #launchesPage .item.desktop-card-open .notes:not(:empty){display:block}
        #launchesPage .item.done{opacity:.52}
        #launchesPage .item.done .item-main,
        #launchesPage .item.done .amount{text-decoration:line-through;text-decoration-thickness:1.2px;text-decoration-color:rgba(70,84,76,.48)}

        #launchesPage .desktop-month-heading-v020{
          grid-column:1/-1;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:14px;
          margin:10px 0 0;
          padding:11px 14px;
          border:1px solid rgba(var(--primary-rgb),.13);
          border-left:4px solid rgba(var(--primary-rgb),.72);
          border-radius:10px;
          background:linear-gradient(90deg,rgba(var(--primary-rgb),.085),rgba(var(--primary-rgb),.02));
        }
        #launchesPage .desktop-month-heading-v020:first-child{margin-top:0}
        #launchesPage .desktop-month-heading-v020 strong{font-size:13px;letter-spacing:.045em;text-transform:uppercase;color:var(--primary-dark)}
        #launchesPage .desktop-month-heading-v020 span{font-size:11px;font-weight:700;color:#748078;white-space:nowrap}
        #launchesPage .desktop-month-heading-v020.tone-1{background:linear-gradient(90deg,rgba(var(--primary-rgb),.055),rgba(255,255,255,.74));border-left-color:rgba(var(--primary-rgb),.5)}
        #launchesPage .desktop-month-heading-v020.tone-2{background:linear-gradient(90deg,rgba(209,168,0,.07),rgba(255,255,255,.8));border-color:rgba(209,168,0,.16);border-left-color:rgba(209,168,0,.62)}

        #launchesPage .desktop-done-heading-v020{
          grid-column:1/-1;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          margin:2px 0 0;
          padding:8px 10px;
          border-top:1px solid #dfe6e1;
          border-bottom:1px solid #edf1ee;
          background:linear-gradient(90deg,rgba(98,112,104,.07),rgba(255,255,255,.3));
          color:#69766f;
        }
        #launchesPage .desktop-done-heading-v020 strong{font-size:11px;letter-spacing:.055em;text-transform:uppercase;color:#637168}
        #launchesPage .desktop-done-heading-v020 span{font-size:10px;font-weight:700;color:#8a958f;white-space:nowrap}
        #launchesPage .desktop-card-hint-v019{font-size:10px;color:#87928c;margin-top:auto}
      }
      @media(min-width:701px) and (max-width:1180px){
        #launchesPage #list{grid-template-columns:1fr}
      }
    `;
    document.head.appendChild(st);
  }

  function attachCardBehavior(fragment,e){
    const article=fragment.querySelector('.item');
    if(!article)return fragment;
    article.dataset.entryId=e.id||'';
    article.setAttribute('tabindex','0');
    article.setAttribute('role','button');
    article.setAttribute('aria-expanded','false');
    article.title='Clique para ver ações';

    const toggle=()=>{
      const open=article.classList.toggle('desktop-card-open');
      article.setAttribute('aria-expanded',open?'true':'false');
      article.title=open?'Clique para recolher':'Clique para ver ações';
    };
    article.addEventListener('click',ev=>{
      if(ev.target.closest('button'))return;
      toggle();
    });
    article.addEventListener('keydown',ev=>{
      if(ev.key==='Enter'||ev.key===' '){
        if(ev.target.closest('button'))return;
        ev.preventDefault();toggle();
      }
    });
    return fragment;
  }

  function desktopRenderList(){
    const q=globalQuery.trim().toLowerCase();
    const source=profileFiltered(entries).slice().filter(e=>{
      const d=daysFromToday(e.date);let pass=true;
      if(currentFilter==='today')pass=!e.done&&d===0;
      else if(currentFilter==='next')pass=!e.done&&d>=0&&d<=7;
      else if(currentFilter==='late')pass=!e.done&&d<0;
      else if(currentFilter==='done')pass=e.done;
      return pass&&(!q||searchableText(e).includes(q));
    });
    const byDate=(a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||''));

    const box=$('list');
    box.innerHTML='';
    $('emptyState').classList.toggle('hidden',source.length>0);
    $('emptyState').textContent=q?'Nenhum lançamento encontrado.':'Nenhum lançamento ainda.';
    if(!source.length)return;

    const sorted=source.slice().sort(byDate);
    const groups=[];
    const map=new Map();
    sorted.forEach(e=>{
      const [year,month]=e.date.split('-');
      const key=`${year}-${month}`;
      if(!map.has(key)){
        const group={key,year:Number(year),month:Number(month),items:[]};
        map.set(key,group);groups.push(group);
      }
      map.get(key).items.push(e);
    });

    groups.forEach(group=>{
      const monthIndex=group.month-1;
      const label=new Date(group.year,monthIndex,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'}).replace(/^./,c=>c.toUpperCase());
      const monthHeading=document.createElement('div');
      monthHeading.className=`desktop-month-heading-v020 tone-${monthIndex%3}`;
      monthHeading.innerHTML=`<strong>${label}</strong><span>${group.items.length} ${group.items.length===1?'item':'itens'}</span>`;
      box.appendChild(monthHeading);

      const pending=group.items.filter(e=>!e.done).sort(byDate);
      const done=group.items.filter(e=>e.done).sort(byDate);

      pending.forEach(e=>box.appendChild(attachCardBehavior(createItemNode(e),e)));

      if(done.length&&currentFilter==='all'){
        const doneHeading=document.createElement('div');
        doneHeading.className='desktop-done-heading-v020';
        doneHeading.innerHTML=`<strong>✓ Concluídos</strong><span>${done.length} ${done.length===1?'item':'itens'}</span>`;
        box.appendChild(doneHeading);
      }

      done.forEach(e=>box.appendChild(attachCardBehavior(createItemNode(e),e)));
    });
  }

  if(originalRenderList){
    renderList=function(){
      if(matchMedia('(min-width:701px)').matches)return desktopRenderList();
      return originalRenderList();
    };
  }

  installStyles();
  window.addEventListener('load',()=>setTimeout(()=>{try{if(typeof renderList==='function')renderList()}catch{}},500));
  matchMedia('(min-width:701px)').addEventListener?.('change',()=>setTimeout(()=>{try{renderList()}catch{}},50));
  window.MeuControleDesktopLaunchesV019={version:'0.20'};
})();
