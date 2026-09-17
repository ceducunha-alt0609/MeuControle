/* Meu Controle — V1.69: ajuste final de altura do “Meu dia” no Painel mobile */
(()=>{
 if(window.__mcMobileReceivablesV167)return;window.__mcMobileReceivablesV167=true;
 const mq=matchMedia('(max-width:700px)');
 const money=n=>Number(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
 const scoped=()=>{try{return typeof profileFiltered==='function'?profileFiltered(entries):(Array.isArray(entries)?entries:[])}catch{return[]}};
 const isReceipt=e=>e?.type==='recebimento'||e?.type==='receita';
 function css(){if(document.getElementById('mcMobileReceivablesV167Style'))return;const s=document.createElement('style');s.id='mcMobileReceivablesV167Style';s.textContent=`@media(max-width:700px){
  #dashboardPage .premium-cards{grid-template-columns:1fr 1fr!important;gap:8px!important}
  #dashboardPage .premium-card.today-card{min-height:116px!important;padding:10px 20px!important}
  #dashboardPage .premium-card.today-card .premium-label{margin-bottom:2px!important}
  #dashboardPage .premium-card.today-card #dashTodayMain{margin:0 0 2px!important;font-size:43px!important;line-height:.92!important}
  #dashboardPage .premium-card.today-card #dashTodaySub{line-height:1.15!important}
  #dashboardPage .premium-card:not(.today-card):not(.mc-receivables-v167){min-height:102px!important;padding:11px 14px!important}
  #dashboardPage .premium-card:not(.today-card):not(.mc-receivables-v167) .premium-label{margin-bottom:4px!important}
  #dashboardPage .mc-receivables-v167{grid-column:1/-1!important;min-height:88px!important;padding:11px 18px!important;text-align:left!important;border:1px solid #9bc9aa!important;border-radius:16px!important;background:linear-gradient(135deg,#f3fbf5,#edf8f0)!important;color:#17683a!important;box-shadow:none!important;display:grid!important;grid-template-columns:1fr auto!important;grid-template-areas:'label arrow' 'main arrow' 'sub arrow'!important;align-content:center!important;align-items:center!important}
  #dashboardPage .mc-receivables-v167 .premium-label{grid-area:label;color:#4f6d5a!important;font-size:14px!important;font-weight:800!important}
  #dashboardPage .mc-receivables-v167 strong{grid-area:main;color:#13713d!important;font-size:26px!important;line-height:1.05!important;margin:2px 0 1px!important}
  #dashboardPage .mc-receivables-v167 small{grid-area:sub;color:#60776a!important;font-size:12px!important;font-weight:700!important}
  #dashboardPage .mc-receivables-arrow-v167{grid-area:arrow;font:800 28px/1 system-ui;color:#5b7466;padding-left:12px}
  body.mc-dark #dashboardPage .mc-receivables-v167{background:linear-gradient(135deg,#173329,#142d25)!important;border-color:#356b50!important}body.mc-dark #dashboardPage .mc-receivables-v167 .premium-label,body.mc-dark #dashboardPage .mc-receivables-v167 small{color:#a8c8b4!important}body.mc-dark #dashboardPage .mc-receivables-v167 strong{color:#71d79b!important}body.mc-dark #dashboardPage .mc-receivables-arrow-v167{color:#8eb9a0!important}
}`;document.head.appendChild(s)}
 function monthItems(){return scoped().filter(e=>{if(!isReceipt(e))return false;const[y,m]=String(e.date||'').split('-').map(Number);return y===dashboardYear&&m===dashboardMonth+1})}
 function allOpen(){return scoped().filter(e=>isReceipt(e)&&!e.done)}
 function values(){const month=monthItems().filter(e=>!e.done),open=allOpen();return{month,totalMonth:month.reduce((s,e)=>s+Number(e.value||0),0),totalOpen:open.reduce((s,e)=>s+Number(e.value||0),0)}}
 function showDetails(){const v=values(),modal=document.getElementById('dashboardDetailModal'),title=document.getElementById('dashboardDetailTitle'),sub=document.getElementById('dashboardDetailSubtitle'),box=document.getElementById('dashboardDetailList');if(!modal||!title||!sub||!box)return;title.textContent='A receber no mês';sub.textContent=`${v.month.length} recebimento${v.month.length===1?'':'s'} pendente${v.month.length===1?'':'s'} • ${money(v.totalMonth)}`;box.innerHTML='';if(!v.month.length){box.innerHTML='<div class="empty">Nenhum recebimento pendente neste mês.</div>'}else v.month.slice().sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||''))).forEach(e=>box.appendChild(createItemNode(e,'dashboard')));modal.classList.remove('hidden')}
 function ensure(){if(!mq.matches)return;css();const grid=document.querySelector('#dashboardPage .premium-cards');if(!grid)return;let card=grid.querySelector('.mc-receivables-v167');if(!card){card=document.createElement('button');card.type='button';card.className='premium-card mc-receivables-v167';card.innerHTML='<span class="premium-label">A receber no mês</span><strong>R$ 0,00</strong><small>R$ 0,00 total a receber</small><span class="mc-receivables-arrow-v167">›</span>';card.onclick=showDetails;grid.appendChild(card)}const v=values();card.querySelector('strong').textContent=money(v.totalMonth);card.querySelector('small').textContent=`${money(v.totalOpen)} total a receber`}
 const old=typeof renderDashboard==='function'?renderDashboard:null;if(old)renderDashboard=function(){const r=old.apply(this,arguments);requestAnimationFrame(ensure);return r};
 function boot(){ensure();setTimeout(ensure,250)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();window.addEventListener('load',()=>setTimeout(ensure,500));window.addEventListener('meucontrole:sync-manual-v012-complete',()=>setTimeout(ensure,80));mq.addEventListener?.('change',ensure);window.MeuControleMobileReceivablesV167={version:'1.69',refresh:ensure};
})();