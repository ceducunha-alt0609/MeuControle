/* Meu Controle — V1.00: limpeza dos testes de layout dos cards do calendário desktop */
(()=>{
  if(window.__mcDesktopCalendarRecoveryV100)return;
  window.__mcDesktopCalendarRecoveryV100=true;

  function unwrapCreateItemNode(){
    try{
      let fn=window.createItemNode;
      let guard=0;
      while(fn&&fn.__mcOriginal&&guard++<6)fn=fn.__mcOriginal;
      if(typeof fn!=='function')return false;

      const base=fn;
      const safe=function(e,context='list'){
        const node=base.apply(this,arguments);
        if(context==='calendar'){
          const item=node?.nodeType===1?node:node?.querySelector?.('.item');
          if(item){
            item.dataset.mcInlineV100='1';
            item.dataset.mcCalHookV101='1';
          }
        }
        return node;
      };
      safe.__mcCalendarHookV101=true;
      safe.__mcRecoveryV100=true;
      safe.__mcOriginal=base;
      window.createItemNode=safe;
      return true;
    }catch{return false}
  }

  function removeExperimentalStyles(){
    [
      'mcDesktopCalendarCardInlineV100Style',
      'mcDesktopCalendarCardHookV101Style'
    ].forEach(id=>document.getElementById(id)?.remove());
  }

  function restoreExistingCards(){
    document.querySelectorAll('#calendarPage #calendarEventsList .item').forEach(item=>{
      const side=item.querySelector('.item-side');
      let amount=side?.querySelector('.amount')||null;

      const candidates=[
        item.querySelector('.mc-cal-inline-amount-v100'),
        item.querySelector('.mc-cal-value-v101'),
        item.querySelector('.mc-cal-card-value-v126')
      ].filter(Boolean);
      const valueText=(candidates.find(x=>(x.textContent||'').trim())?.textContent||'').trim();

      if(!amount&&side){
        amount=document.createElement('strong');
        amount.className='amount';
        side.prepend(amount);
      }
      if(amount&&!amount.textContent.trim()&&valueText)amount.textContent=valueText;

      [
        '.mc-cal-inline-meta-v100',
        '.mc-cal-meta-row-v101',
        '.mc-cal-card-meta-v126'
      ].forEach(sel=>{
        const row=item.querySelector(sel);
        if(!row)return;
        const meta=row.querySelector('.meta');
        if(meta)row.parentNode?.insertBefore(meta,row);
        row.remove();
      });

      candidates.forEach(x=>x.remove());
      delete item.dataset.mcInlineV100;
      delete item.dataset.mcCalHookV101;
    });
  }

  function rebuild(){
    try{window.MeuControleDesktopCalendarSplitV124?.refresh?.()}catch{}
  }

  function run(){
    removeExperimentalStyles();
    unwrapCreateItemNode();
    restoreExistingCards();
    requestAnimationFrame(()=>{
      rebuild();
      requestAnimationFrame(restoreExistingCards);
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();

  window.addEventListener('load',()=>setTimeout(run,250),{once:true});
  setTimeout(run,700);
  setTimeout(run,1800);

  window.MeuControleDesktopCalendarRecoveryV100={version:'1.00',run};
})();