/* Meu Controle — Impressão V1.0: resumo mensal também para período único */
(()=>{
  if(window.__mcDesktopPrintSingleSummaryV166)return;
  window.__mcDesktopPrintSingleSummaryV166=true;
  const desktop=()=>matchMedia('(min-width:701px)').matches;

  function enhance(frame){
    if(!desktop()||!frame||frame.dataset.mcSingleSummaryV166)return;
    frame.dataset.mcSingleSummaryV166='1';
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      try{
        const d=frame.contentDocument;
        if(!d||!d.body){if(tries>80)clearInterval(timer);return}
        if(d.querySelector('.month-summary')){clearInterval(timer);return}
        const heads=[...d.querySelectorAll('.pr-section-head')];
        if(heads.length!==1){if(heads.length>1||tries>80)clearInterval(timer);return}
        const head=heads[0],name=head.querySelector('strong')?.textContent?.trim()||'',info=head.querySelector('span')?.textContent?.trim()||'';
        if(!name){if(tries>80)clearInterval(timer);return}
        const parts=info.split('·').map(x=>x.trim()),qty=parts[0]||'',subtotal=parts.slice(1).join(' · ');
        const summary=d.createElement('div');summary.className='month-summary mc-single-month-summary-v166';summary.style.setProperty('--cols','1');
        const card=d.createElement('div');card.className='month-card';
        const strong=d.createElement('strong');strong.textContent=name;
        const span=d.createElement('span');span.textContent=qty.replace(/\bitens?\b/i,m=>m.toLowerCase().startsWith('item')?'lançamento':'lançamentos');
        const b=d.createElement('b');b.textContent=subtotal;
        card.append(strong,span,b);summary.appendChild(card);
        const header=d.querySelector('.head');header?.insertAdjacentElement('afterend',summary);
        const style=d.createElement('style');style.textContent='.mc-single-month-summary-v166 .month-card{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:18px;padding:8px 10px}.mc-single-month-summary-v166 .month-card strong,.mc-single-month-summary-v166 .month-card span,.mc-single-month-summary-v166 .month-card b{margin:0}.mc-single-month-summary-v166 .month-card strong{font-size:8pt}.mc-single-month-summary-v166 .month-card span{font-size:7.2pt}.mc-single-month-summary-v166 .month-card b{font-size:9pt}';d.head.appendChild(style);
        clearInterval(timer);
      }catch{if(tries>80)clearInterval(timer)}
    },10);
  }

  function scan(){document.querySelectorAll('#printFrameV022').forEach(enhance)}
  function boot(){if(!desktop())return;scan();new MutationObserver(scan).observe(document.body,{childList:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.MeuControleDesktopPrintSingleSummaryV166={version:'1.0',refresh:scan};
})();