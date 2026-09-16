/* MeuControle — V1.23: pesquisa da Agenda como lista compacta */
(()=>{
  if(window.__mcAgendaSearchV122)return;window.__mcAgendaSearchV122=true;
  const mq=matchMedia('(max-width:700px)');
  let overlay=null,input=null,results=null;
  function installStyle(){if(document.getElementById('mcAgendaSearchV122Style'))return;const s=document.createElement('style');s.id='mcAgendaSearchV122Style';s.textContent=`
    @media(max-width:700px){
      #calendarPage .calendar-events-head .calendar-search{display:none!important}
      #calendarPage .mobile-agenda-head{position:relative;padding:0 48px}
      .mc-agenda-search-trigger-v122{position:absolute;right:4px;top:1px;width:42px;height:42px;border:1px solid #d7e1dc!important;border-radius:13px!important;background:#fff!important;color:var(--primary)!important;display:grid!important;place-items:center;padding:0!important;box-shadow:0 4px 12px rgba(0,0,0,.04)!important;font:700 23px/1 system-ui,sans-serif!important}
      .mc-agenda-search-overlay-v122{position:fixed;inset:0;z-index:2400;background:#f3f6f8;display:flex;flex-direction:column;padding:0 16px 22px;box-sizing:border-box;overflow:hidden}
      .mc-agenda-search-overlay-v122[hidden]{display:none!important}
      .mc-agenda-search-top-v122{display:flex;align-items:center;gap:10px;padding:18px 0 13px;flex:0 0 auto}
      .mc-agenda-search-back-v122{width:42px;height:42px;border:0!important;border-radius:12px!important;background:#fff!important;color:#405249!important;padding:0!important;font-size:24px!important;box-shadow:0 3px 10px rgba(0,0,0,.04)!important}
      .mc-agenda-search-field-v122{flex:1;display:flex;align-items:center;gap:9px;min-height:48px;padding:0 14px;border:1px solid #d5dfda;border-radius:14px;background:#fff;box-sizing:border-box}
      .mc-agenda-search-field-v122 span{font:700 21px/1 system-ui,sans-serif;color:#64766d}
      .mc-agenda-search-field-v122 input{width:100%;border:0!important;outline:0!important;background:transparent!important;padding:0!important;font:inherit;color:#24352c;box-shadow:none!important}
      .mc-agenda-search-caption-v122{margin:0 2px 12px;font-size:13px;font-weight:700;color:#718078}
      .mc-agenda-search-results-v122{flex:1;overflow:auto;padding:0 1px 24px}
      .mc-agenda-search-results-v122 .item{position:relative!important;display:block!important;box-sizing:border-box!important;height:104px!important;min-height:104px!important;max-height:104px!important;margin-bottom:10px!important;padding:11px 13px 10px 58px!important;overflow:hidden!important;cursor:pointer}
      .mc-agenda-search-results-v122 .item .item-main{min-width:0!important;width:100%!important}
      .mc-agenda-search-results-v122 .item .item-title-row{display:grid!important;grid-template-columns:minmax(0,1fr) auto auto!important;gap:7px!important;align-items:center!important;min-width:0!important}
      .mc-agenda-search-results-v122 .item .item-title{margin:0!important;min-width:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:17px!important;line-height:1.2!important}
      .mc-agenda-search-results-v122 .item .badge{white-space:nowrap!important;align-self:center!important}
      .mc-agenda-search-results-v122 .item .amount{margin:0!important;padding-left:4px!important;white-space:nowrap!important;font-size:16px!important;line-height:1.15!important;color:var(--primary-dark)!important;text-align:right!important}
      .mc-agenda-search-results-v122 .item .amount:empty{display:none!important}
      .mc-agenda-search-results-v122 .item .meta{margin-top:4px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:11.5px!important;line-height:1.3!important}
      .mc-agenda-search-results-v122 .item .notes,.mc-agenda-search-results-v122 .item .item-actions{display:none!important}
      .mc-agenda-search-results-v122 .item .item-side{display:contents!important}
      .mc-agenda-search-results-v122 .item .status-dot{position:absolute!important;left:20px!important;top:25px!important;margin:0!important}
      .mc-agenda-search-empty-v122{padding:28px 16px;text-align:center;color:#718078}
      body.mc-dark .mc-agenda-search-overlay-v122{background:#10171c}body.mc-dark .mc-agenda-search-trigger-v122,body.mc-dark .mc-agenda-search-back-v122,body.mc-dark .mc-agenda-search-field-v122{background:#182229!important;border-color:#34434c!important;color:#eef3f6!important}body.mc-dark .mc-agenda-search-field-v122 input{color:#eef3f6!important}body.mc-dark .mc-agenda-search-caption-v122{color:#9eabb3}
    }
  `;document.head.appendChild(s)}
  function monthLabel(){return document.querySelector('#calendarPage .mobile-agenda-current')?.textContent?.trim()||document.getElementById('calendarMonthTitle')?.textContent?.trim()||'este mês'}
  function openActions(card){if(!card)return;const sourceId=card.dataset.mcSearchEntryId,source=sourceId?[...document.querySelectorAll('#calendarPage .calendar-events-scroll .item')].find(x=>x.dataset.id===sourceId||x.getAttribute('data-id')===sourceId):null;if(source){source.click();return}card.querySelector('.item-title')?.click()}
  function bindResultCard(card,e){card.classList.add('mc-agenda-compact-v105');card.dataset.mcSearchEntryId=String(e.id||'');const row=card.querySelector('.item-title-row'),amount=card.querySelector('.amount');if(row&&amount&&!amount.classList.contains('mc-agenda-inline-amount-v105')){amount.classList.add('mc-agenda-inline-amount-v105');row.appendChild(amount)}card.addEventListener('click',ev=>{if(ev.target.closest('button,input,label,a'))return;const original=[...document.querySelectorAll('#calendarPage .calendar-events-scroll .item')].find(x=>{const edit=x.querySelector('.editBtn');return edit&&String(edit.dataset.id||'')===String(e.id||'')})||[...document.querySelectorAll('#calendarPage .calendar-events-scroll .item')].find(x=>x.querySelector('.item-title')?.textContent===card.querySelector('.item-title')?.textContent&&x.querySelector('.meta')?.textContent===card.querySelector('.meta')?.textContent);if(original){original.click();return}openActions(card)})}
  function render(){if(!results)return;const q=(input?.value||'').trim().toLowerCase(),all=typeof calendarEntries==='function'?calendarEntries().slice().sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||''))):[],items=q?all.filter(e=>typeof searchableText==='function'?searchableText(e).includes(q):JSON.stringify(e).toLowerCase().includes(q)):all;const cap=overlay.querySelector('.mc-agenda-search-caption-v122');cap.textContent=`Pesquisar em ${monthLabel()} • ${items.length} resultado${items.length===1?'':'s'}`;results.innerHTML='';if(!items.length){results.innerHTML='<div class="mc-agenda-search-empty-v122">Nenhum compromisso encontrado neste mês.</div>';return}items.forEach(e=>{const card=createItemNode(e,'calendar');bindResultCard(card,e);results.appendChild(card)})}
  function close(){if(!overlay)return;overlay.hidden=true;document.body.style.overflow='';input.value='';results.innerHTML=''}
  function open(){if(!mq.matches)return;ensure();overlay.hidden=false;document.body.style.overflow='hidden';render();requestAnimationFrame(()=>input.focus())}
  function ensure(){if(overlay)return;overlay=document.createElement('section');overlay.className='mc-agenda-search-overlay-v122';overlay.hidden=true;overlay.innerHTML='<div class="mc-agenda-search-top-v122"><button type="button" class="mc-agenda-search-back-v122" aria-label="Voltar">‹</button><label class="mc-agenda-search-field-v122"><span>⌕</span><input type="search" placeholder="Pesquisar na Agenda..." autocomplete="off" aria-label="Pesquisar na Agenda"></label></div><div class="mc-agenda-search-caption-v122"></div><div class="mc-agenda-search-results-v122"></div>';document.body.appendChild(overlay);input=overlay.querySelector('input');results=overlay.querySelector('.mc-agenda-search-results-v122');input.addEventListener('input',render);overlay.querySelector('.mc-agenda-search-back-v122').onclick=close}
  function decorate(){if(!mq.matches)return;installStyle();const head=document.querySelector('#calendarPage .mobile-agenda-head');if(!head||head.querySelector('.mc-agenda-search-trigger-v122'))return;const b=document.createElement('button');b.type='button';b.className='mc-agenda-search-trigger-v122';b.setAttribute('aria-label','Pesquisar na Agenda');b.textContent='⌕';b.onclick=open;head.appendChild(b)}
  function boot(){installStyle();decorate();document.querySelectorAll('.nav-btn[data-page="calendar"]').forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(decorate)));mq.addEventListener?.('change',()=>{if(!mq.matches)close();else decorate()})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.MeuControleAgendaSearchV122={version:'1.23',open,close,refresh:decorate};
})();