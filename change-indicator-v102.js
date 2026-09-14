/* MeuControle — Indicador de alterações remotas V1.02: acompanha workspace atual */
(()=>{
  if(window.__mcChangeIndicatorV102)return;window.__mcChangeIndicatorV102=true;
  const VERSION='1.02',DEVICE_KEY='meu_controle_device_id_v1',SEEN_PREFIX='meu_controle_remote_workspace_seen_v2:';
  let unsub=null,lastResult={count:0,lastAt:0},watchUid=null,retryTimer=null;
  function deviceId(){let id=localStorage.getItem(DEVICE_KEY);if(!id){id=crypto.randomUUID();localStorage.setItem(DEVICE_KEY,id)}return id}
  const session=()=>window.MeuControleUserSession?.get?.()||null;
  const workspace=()=>window.MeuControleCloud?.workspace||null;
  const seenKey=uid=>SEEN_PREFIX+uid;
  const parseTime=v=>Date.parse(v||'')||0;
  const fmt=t=>t?new Date(t).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'—';
  function style(){if(document.getElementById('mcChangeIndicatorStyleV102'))return;const st=document.createElement('style');st.id='mcChangeIndicatorStyleV102';st.textContent=`
    .sync-new-bell{display:none;position:relative;flex:0 0 auto;width:42px;height:42px;padding:0;border:1px solid rgba(255,255,255,.28);border-radius:13px;background:rgba(255,255,255,.12)!important;color:#fff!important;font:21px system-ui,sans-serif;align-items:center;justify-content:center;box-shadow:none!important}.sync-new-bell.show{display:flex}.sync-new-bell-count{position:absolute;right:-5px;top:-6px;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:#d27a00;color:#fff;font:800 11px/20px system-ui,sans-serif;text-align:center;border:2px solid var(--primary,#164f78)}
    .mc-change-pop{position:fixed;z-index:3500;width:min(340px,calc(100vw - 24px));padding:14px;border:1px solid #dfe6e1;border-radius:14px;background:#fff;color:#304239;box-shadow:0 18px 44px rgba(0,0,0,.22)}.mc-change-pop[hidden]{display:none!important}.mc-change-pop strong{display:block;font-size:14px}.mc-change-pop p{margin:6px 0 12px;font-size:11px;line-height:1.45;color:#69766f}.mc-change-pop button{width:100%;min-height:40px}
    body.mc-dark .mc-change-pop{background:#172127;color:#e7edf1;border-color:#34434c}body.mc-dark .mc-change-pop p{color:#aebbc3}
    @media(max-width:700px){.sync-new-bell{width:40px;height:40px}.mc-change-pop{left:12px!important;right:12px!important;top:76px!important;width:auto}}
  `;document.head.appendChild(st)}
  function ensureUi(){style();let bell=document.querySelector('.sync-new-bell');if(!bell){const brand=document.querySelector('.topbar .brand');if(!brand)return null;bell=document.createElement('button');bell.type='button';bell.className='sync-new-bell';bell.innerHTML='<span aria-hidden="true">🔔</span><span class="sync-new-bell-count">0</span>';brand.appendChild(bell)}let pop=document.querySelector('.mc-change-pop');if(!pop){pop=document.createElement('div');pop.className='mc-change-pop';pop.hidden=true;pop.innerHTML='<strong></strong><p></p><button type="button" class="secondary-action">Entendi</button>';document.body.appendChild(pop);pop.querySelector('button').onclick=()=>{lastResult.count=0;pop.hidden=true;render()};document.addEventListener('click',e=>{if(!pop.hidden&&!e.target.closest('.mc-change-pop')&&!e.target.closest('.sync-new-bell'))pop.hidden=true})}bell.onclick=e=>{e.stopPropagation();renderPopover()};return bell}
  function placePopover(pop,bell){if(matchMedia('(max-width:700px)').matches)return;const r=bell.getBoundingClientRect();pop.style.top=`${Math.min(innerHeight-150,r.bottom+9)}px`;pop.style.left=`${Math.max(12,Math.min(innerWidth-352,r.right-340))}px`}
  function renderPopover(){const bell=ensureUi(),pop=document.querySelector('.mc-change-pop');if(!bell||!pop)return;const n=lastResult.count;pop.querySelector('strong').textContent=n===1?'Alteração recebida de outro dispositivo':`${n} alterações recebidas de outro dispositivo`;pop.querySelector('p').textContent=`Seus dados já foram atualizados automaticamente. Última alteração: ${fmt(lastResult.lastAt)}.`;placePopover(pop,bell);pop.hidden=false}
  function render(){const bell=ensureUi();if(!bell)return;const n=lastResult.count,count=bell.querySelector('.sync-new-bell-count');if(count)count.textContent=n>99?'99+':String(n);bell.classList.toggle('show',n>0);bell.title=n?`${n} alteração${n===1?'':'ões'} recebida${n===1?'':'s'} de outro dispositivo`:'Sem alterações remotas novas';bell.setAttribute('aria-label',bell.title)}
  function stop(){if(unsub){try{unsub()}catch{}unsub=null}watchUid=null;clearTimeout(retryTimer)}
  function start(){
    const s=session(),ws=workspace();if(!s?.signedIn||!s.uid||!ws?.watch){stop();render();retryTimer=setTimeout(start,500);return}
    if(watchUid===s.uid&&unsub)return;stop();watchUid=s.uid;
    unsub=ws.watch(s.uid,remote=>{
      const t=parseTime(remote?.clientUpdatedAt);if(!t)return;
      const key=seenKey(s.uid),seen=Number(localStorage.getItem(key)||0);
      if(!seen){localStorage.setItem(key,String(t));return}
      if(t<=seen)return;
      localStorage.setItem(key,String(t));
      if(!remote?.sourceDeviceId||remote.sourceDeviceId===deviceId())return;
      lastResult={count:lastResult.count+1,lastAt:t};render();
    },()=>{});
  }
  window.addEventListener('meucontrole:user-session-changed',()=>setTimeout(start,250));
  window.addEventListener('meucontrole:firebase-ready',()=>setTimeout(start,250));
  window.addEventListener('load',()=>setTimeout(()=>{ensureUi();render();start()},900));
  matchMedia('(min-width:701px)').addEventListener?.('change',()=>setTimeout(()=>{ensureUi();render()},100));
  if(document.readyState!=='loading')setTimeout(()=>{ensureUi();render();start()},400);
  window.MeuControleChangeIndicator={version:VERSION,refresh:render,state:()=>({...lastResult}),clear:()=>{lastResult.count=0;render()}};
})();
