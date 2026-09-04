/* Meu Controle — V0.19: cards desktop em 2 colunas + ações ao abrir + concluídos no final */
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
        #launchesPage .desktop-done-heading-v019{
          grid-column:1/-1;
          display:flex;
          align-items:center;
          gap:10px;
          margin:8px 0 0;
          padding:10px 4px 2px;
          color:#6d7a72;
          font-size:12px;
          font-weight:800;
          text-transform:uppercase;
          letter-spacing:.05em;
        }
        #launchesPage .desktop-done-heading-v019::after{content:"";height:1px;background:#dfe6e1;flex:1}
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
    const pending=source.filter(e=>!e.done).sort(byDate);
    const done=source.filter(e=>e.done).sort(byDate);

    const box=$('list');
    box.innerHTML='';
    $('emptyState').classList.toggle('hidden',source.length>0);
    $('emptyState').textContent=q?'Nenhum lançamento encontrado.':'Nenhum lançamento ainda.';

    if(currentFilter==='done'){
      done.forEach(e=>box.appendChild(attachCardBehavior(createItemNode(e),e)));
      return;
    }

    pending.forEach(e=>box.appendChild(attachCardBehavior(createItemNode(e),e)));
    if(currentFilter==='all'&&done.length){
      const h=document.createElement('div');
      h.className='desktop-done-heading-v019';
      h.textContent=`Concluídos (${done.length})`;
      box.appendChild(h);
      done.forEach(e=>box.appendChild(attachCardBehavior(createItemNode(e),e)));
    }
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
  window.MeuControleDesktopLaunchesV019={version:'0.19'};
})();
