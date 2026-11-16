/* MeuControle — Sininho V1.09: atividades detalhadas por conta */
(()=>{
 'use strict';
 if(window.__mcChangeIndicatorV108)return;window.__mcChangeIndicatorV108=true;
 const VERSION='1.11',PREFIX='meu_controle_remote_activity_v109:',MAX=500;
 let account='',events=[],ready=false,placeTimer=null;
 const uid=()=>{try{return window.MeuControleUserDataScope?.activeUid?.()||window.MeuControleUserSession?.get?.()?.uid||''}catch{return''}};
 const fmt=t=>{try{return new Date(t).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}catch{return'—'}};
 const labels={added:'Novo lançamento',removed:'Ausente na versão recebida',edited:'Lançamento editado',completed:'Marcado como concluído',reopened:'Reaberto'};
 function accountSync(){
  const a=uid();if(a===account)return;account=a;events=[];
  if(a)try{const v=JSON.parse(localStorage.getItem(PREFIX+a)||'[]');if(Array.isArray(v))events=v.slice(-MAX)}catch{}
 }
 function save(){if(account)try{localStorage.setItem(PREFIX+account,JSON.stringify(events.slice(-MAX)))}catch{}}
 function style(){
  if(document.getElementById('mcChangeIndicatorStyleV109'))return;
  const x=document.createElement('style');x.id='mcChangeIndicatorStyleV109';
  x.textContent='.sync-new-bell{display:none;position:relative;flex:0 0 auto;width:42px;height:42px;padding:0;border:1px solid rgba(255,255,255,.28);border-radius:13px;background:rgba(255,255,255,.12)!important;color:#fff!important;font:21px system-ui,sans-serif;align-items:center;justify-content:center;box-shadow:none!important}.sync-new-bell.show{display:flex}.sync-new-bell-count{position:absolute;right:-5px;top:-6px;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:#d27a00;color:#fff;font:800 11px/20px system-ui,sans-serif;text-align:center;border:2px solid var(--primary,#164f78)}.sync-new-bell-count[hidden]{display:none!important}.mc-change-pop{position:fixed;z-index:3500;width:min(420px,calc(100vw - 24px));max-height:74vh;padding:14px;border:1px solid #dfe6e1;border-radius:14px;background:#fff;color:#304239;box-shadow:0 18px 44px rgba(0,0,0,.22);display:flex;flex-direction:column;gap:9px}.mc-change-pop[hidden]{display:none!important}.mc-change-pop-head{display:flex;justify-content:space-between;gap:8px}.mc-change-pop-head strong{font-size:15px}.mc-change-pop p{margin:0;font-size:11px;line-height:1.4;color:#69766f}.mc-change-pop-list{overflow-y:auto;overscroll-behavior:contain;display:flex;flex-direction:column;gap:7px;max-height:49vh}.mc-change-row{padding:10px;border:1px solid #e4eae7;border-radius:10px;background:rgba(126,144,154,.055)}.mc-change-row.pending{border-color:#e4c592;background:rgba(229,174,66,.095)}.mc-change-row-top{display:flex;justify-content:space-between;gap:7px;align-items:flex-start}.mc-change-row-top strong{font-size:12px;line-height:1.4;overflow-wrap:anywhere}.mc-change-row small{display:block;margin-top:3px;font-size:10px;color:#718078}.mc-change-status{font-size:9px;font-weight:800;white-space:nowrap;color:#287955}.mc-change-row.pending .mc-change-status{color:#a36b16}.mc-change-ack{width:100%;min-height:40px;flex-shrink:0}body.mc-dark .mc-change-pop,body.theme-black .mc-change-pop{background:#172127;color:#e7edf1;border-color:#34434c}body.mc-dark .mc-change-row,body.theme-black .mc-change-row{background:#1d2b32;border-color:#34434c}body.mc-dark .mc-change-row.pending,body.theme-black .mc-change-row.pending{background:#352b1e;border-color:#6c5734}@media(min-width:701px){.desktop-top-tools-v139 .sync-new-bell{position:relative!important;right:auto!important;top:auto!important;transform:none!important;margin:0!important;flex:0 0 42px}}@media(max-width:700px){.sync-new-bell{width:40px;height:40px}.mc-change-pop{left:12px!important;right:12px!important;top:76px!important;width:auto;max-height:72vh}.topbar .brand .sync-new-bell{position:absolute;right:52px;top:50%;transform:translateY(-50%);margin:0!important}}';
  document.head.appendChild(x);
 }
 function placement(b){
  if(!b)return;
  if(matchMedia('(min-width:701px)').matches){
   const t=document.querySelector('.desktop-top-tools-v139');if(!t)return;
   const a=t.querySelector('.sync-quick-v103')||t.querySelector('.desktop-profile-btn-v139');
   if(b.parentElement!==t||b.nextElementSibling!==a)t.insertBefore(b,a||null);
  }else{const p=document.querySelector('.topbar .brand');if(p&&b.parentElement!==p)p.appendChild(b)}
 }
 function ensureUi(){
  style();let bell=document.querySelector('.sync-new-bell[data-mc-bell="v109"]');
  if(!bell){document.querySelectorAll('.sync-new-bell').forEach(x=>x.remove());bell=document.createElement('button');bell.type='button';bell.className='sync-new-bell';bell.dataset.mcBell='v109';bell.innerHTML='<span aria-hidden="true">🔔</span><span class="sync-new-bell-count"></span>'}
  placement(bell);
  let pop=document.querySelector('.mc-change-pop[data-mc-pop="v109"]');
  if(!pop){
   document.querySelectorAll('.mc-change-pop').forEach(x=>x.remove());
   pop=document.createElement('section');pop.className='mc-change-pop';pop.dataset.mcPop='v109';pop.hidden=true;
   pop.innerHTML='<div class="mc-change-pop-head"><strong>🔔 Central de Atividades</strong><span class="mc-change-pop-total"></span></div><p>Atualizações de outros equipamentos; consultar não altera os dados.</p><div class="mc-change-pop-list"></div><button type="button" class="secondary-action mc-change-ack">Entendi · Marcar como lidas</button>';
   document.body.appendChild(pop);
   pop.querySelector('.mc-change-ack').onclick=()=>{events.forEach(x=>x.read=true);save();pop.hidden=true;render()};
  }
  bell.onclick=e=>{e.stopPropagation();accountSync();paint();pop.hidden=!pop.hidden};
  return bell;
 }
 function paint(){
  const bell=ensureUi(),pop=document.querySelector('.mc-change-pop[data-mc-pop="v109"]');if(!pop||!bell)return;
  const unread=events.filter(x=>!x.read).length;
  pop.querySelector('.mc-change-pop-total').textContent=unread?unread+' não lidas':events.length+' no histórico';
  const list=pop.querySelector('.mc-change-pop-list');list.replaceChildren();
  if(!events.length){const p=document.createElement('p');p.textContent='Nenhuma atividade recebida nesta conta.';list.appendChild(p)}
  else{
   let date='';
   for(const e of events.slice().reverse()){
    const d=fmt(e.at).split(' ')[0];
    if(d!==date){date=d;const day=document.createElement('small');day.textContent=d;day.style.cssText='font-weight:800;color:#829099;padding:5px 3px 0';list.appendChild(day)}
    const row=document.createElement('div');row.className='mc-change-row'+(e.state==='pending'?' pending':'');
    const top=document.createElement('div');top.className='mc-change-row-top';
    const title=document.createElement('strong');title.textContent=e.title;
    const state=document.createElement('span');state.className='mc-change-status';state.textContent=e.state==='pending'?'Aguardando revisão':'Aplicado ✓';
    top.append(title,state);row.appendChild(top);
    const sub=document.createElement('small');sub.textContent=e.action+' · '+fmt(e.at)+(e.detail?' · '+e.detail:'');row.appendChild(sub);list.appendChild(row);
   }
  }
  if(matchMedia('(min-width:701px)').matches){
   const r=bell.getBoundingClientRect();pop.style.top=Math.max(10,Math.min(innerHeight-120,r.bottom+9))+'px';
   pop.style.left=Math.max(12,Math.min(innerWidth-432,r.right-420))+'px';
  }else{pop.style.removeProperty('left');pop.style.removeProperty('top')}
 }
 function render(){
  accountSync();const b=ensureUi();if(!b)return;
  const n=events.filter(x=>!x.read).length;
  b.classList.toggle('show',!!account&&events.length>0);
  const badge=b.querySelector('.sync-new-bell-count');badge.textContent=n>99?'99+':String(n);badge.hidden=!n;
  b.title=n?n+' novidades não lidas':'Abrir histórico de atividades';
  b.setAttribute('aria-label',b.title);
  const p=document.querySelector('.mc-change-pop[data-mc-pop="v109"]');if(p&&!p.hidden)paint();
 }
 /* Promover apenas eventos da MESMA revisao confirmada como aplicada.
    Nunca transformar aviso pendente em aplicado somente porque um conflito sumiu. */
 function reconcileRevision(detail){
  accountSync();if(!account||detail?.uid!==account||!detail?.revision)return false;
  const revision=String(detail.revision);
  let changed=false;
  for(const item of events){
   if(item.state==='pending'&&item.id?.startsWith('pending:'+revision+':')){
    item.state='applied';
    item.appliedAt=new Date().toISOString();
    changed=true;
   }
  }
  if(changed){save();render()}
  return changed;
 }
 function onRemote(state,detail){
  accountSync();if(!account||detail?.uid!==account)return;
  const at=detail?.at||new Date().toISOString(),revision=String(detail?.revision||at);
  if(state==='applied')reconcileRevision(detail);
  const changes=Array.isArray(detail?.changes)&&detail.changes.length?detail.changes:[{kind:'workspace',action:'updated',name:'Atualização da conta'}];
  for(let i=0;i<changes.length;i++){
   const ch=changes[i],id=state+':'+revision+':'+i;
   if(state==='applied'&&events.some(x=>x.id==='pending:'+revision+':'+i))continue;
   if(events.some(x=>x.id===id))continue;
   const action=ch.kind==='workspace'?'Workspace atualizado':ch.kind==='special'
     ?(ch.action==='added'?'Nova data especial':ch.action==='removed'?'Data especial ausente na versão recebida':'Data especial alterada')
     :(labels[ch.action]||'Alteração recebida');
   const from=String(ch.from||''),to=String(ch.to||'');
   events.push({id,at,state,title:String(ch.name||'Atualização da conta').slice(0,140),action,detail:from&&to&&from!==to?from+' → '+to:'',read:false});
  }
  events=events.slice(-MAX);save();render();
 }
 /* Recolhe avisos recebidos antes de o sininho terminar de carregar.
    A deduplicacao de onRemote impede contagem dupla. */
 function consumeMailbox(){
  const a=uid();if(!a)return;
  try{
   const key='meu_controle_activity_mailbox_v1:'+a;
   const list=JSON.parse(sessionStorage.getItem(key)||'[]');
   if(!Array.isArray(list))return;
   for(const detail of list.slice(-24))if(detail?.uid===a)onRemote('applied',detail);
  }catch{}
 }
 function watchPlacement(){clearInterval(placeTimer);let n=0;placeTimer=setInterval(()=>{n++;const b=document.querySelector('.sync-new-bell[data-mc-bell="v109"]');if(b)placement(b);if(n>30)clearInterval(placeTimer)},250)}
 accountSync();ensureUi();consumeMailbox();render();watchPlacement();
 window.addEventListener('meucontrole:cloud-bootstrap-complete',()=>{ready=true;consumeMailbox();render();watchPlacement()});
 window.addEventListener('meucontrole:remote-workspace-applied',e=>onRemote('applied',e.detail));
 window.addEventListener('meucontrole:cloud-workspace-confirmed',e=>reconcileRevision(e.detail));
 window.addEventListener('meucontrole:remote-workspace-pending',e=>onRemote('pending',e.detail));
 window.addEventListener('meucontrole:user-session-changed',()=>{account='';events=[];ready=false;accountSync();render()});
 window.addEventListener('load',()=>setTimeout(()=>{consumeMailbox();render();watchPlacement()},500));
 matchMedia('(min-width:701px)').addEventListener?.('change',()=>setTimeout(()=>{render();watchPlacement()},100));
 window.MeuControleChangeIndicator={version:VERSION,refresh:render,state:()=>({count:events.filter(x=>!x.read).length,total:events.length,ready}),clear:()=>{events.forEach(x=>x.read=true);save();render()}};
})();