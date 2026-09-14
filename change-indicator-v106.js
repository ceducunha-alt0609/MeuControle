/* MeuControle — Indicador remoto V1.06: novidade remota binária + ordem fixa */
(()=>{
  if(window.__mcChangeIndicatorV106)return;window.__mcChangeIndicatorV106=true;
  window.__mcChangeIndicatorV105=true;window.__mcChangeIndicatorV104=true;window.__mcChangeIndicatorV103=true;
  const VERSION='1.06',DEVICE_KEY='meu_controle_device_id_v1',STATE_PREFIX='meu_controle_remote_indicator_v6:';
  let unsub=null,watchUid=null,retryTimer=null,placeTimer=null,lastResult={count:0,lastAt:0};
  const session=()=>window.MeuControleUserSession?.get?.()||null;
  const workspaceApi=()=>window.MeuControleCloud?.workspace||null;
  function deviceId(){let id=localStorage.getItem(DEVICE_KEY);if(!id){id=crypto.randomUUID();localStorage.setItem(DEVICE_KEY,id)}return id}
  const stable=v=>JSON.stringify({entries:v?.entries||[],profiles:v?.profiles||[],profileFilter:v?.profileFilter||'all'});
  function hashText(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16)}
  const hashWorkspace=w=>hashText(stable(w||{}));
  const stateKey=uid=>STATE_PREFIX+uid;
  function readState(uid){try{return JSON.parse(localStorage.getItem(stateKey(uid))||'{}')}catch{return{}}}
  function saveState(uid,s){try{localStorage.setItem(stateKey(uid),JSON.stringify(s))}catch{}}
  const parseTime=v=>Date.parse(v||'')||0;
  const fmt=t=>t?new Date(t).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'—';
  function style(){if(document.getElementById('mcChangeIndicatorStyleV106'))return;const st=document.createElement('style');st.id='mcChangeIndicatorStyleV106';st.textContent=`
    .sync-new-bell{display:none;position:relative;flex:0 0 auto;width:42px;height:42px;padding:0;border:1px solid rgba(255,255,255,.28);border-radius:13px;background:rgba(255,255,255,.12)!important;color:#fff!important;font:21px system-ui,sans-serif;align-items:center;justify-content:center;box-shadow:none!important}.sync-new-bell.show{display:flex}.sync-new-bell-count{position:absolute;right:-5px;top:-6px;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:#d27a00;color:#fff;font:800 11px/20px system-ui,sans-serif;text-align:center;border:2px solid var(--primary,#164f78)}
    .mc-change-pop{position:fixed;z-index:3500;width:min(340px,calc(100vw - 24px));padding:14px;border:1px solid #dfe6e1;border-radius:14px;background:#fff;color:#304239;box-shadow:0 18px 44px rgba(0,0,0,.22)}.mc-change-pop[hidden]{display:none!important}.mc-change-pop strong{display:block;font-size:14px}.mc-change-pop p{margin:6px 0 12px;font-size:11px;line-height:1.45;color:#69766f}.mc-change-pop button{width:100%;min-height:40px}body.mc-dark .mc-change-pop{background:#172127;color:#e7edf1;border-color:#34434c}body.mc-dark .mc-change-pop p{color:#aebbc3}
    @media(min-width:701px){.desktop-top-tools-v139 .sync-new-bell{position:relative!important;right:auto!important;top:auto!important;transform:none!important;margin:0!important;flex:0 0 42px}}
    @media(max-width:700px){.sync-new-bell{width:40px;height:40px}.mc-change-pop{left:12px!important;right:12px!important;top:76px!important;width:auto}.topbar .brand .sync-new-bell{position:absolute;right:52px;top:50%;transform:translateY(-50%);margin:0!important}}
  `;document.head.appendChild(st)}
  function placeBell(bell){
    if(!bell)return false;
    if(matchMedia('(min-width:701px)').matches){
      const tools=document.querySelector('.desktop-top-tools-v139');if(!tools)return false;
      const sync=tools.querySelector('.sync-quick-v103'),profile=tools.querySelector('.desktop-profile-btn-v139');
      const anchor=sync||profile||null;
      if(bell.parentElement!==tools||bell.nextElementSibling!==anchor)tools.insertBefore(bell,anchor);
      return true;
    }
    const brand=document.querySelector('.topbar .brand');if(!brand)return false;if(bell.parentElement!==brand)brand.appendChild(bell);return true;
  }
  function ensureUi(){style();let bell=document.querySelector('.sync-new-bell');if(!bell){bell=document.createElement('button');bell.type='button';bell.className='sync-new-bell';bell.dataset.mcBell='v106';bell.innerHTML='<span aria-hidden="true">🔔</span><span class="sync-new-bell-count">0</span>'}placeBell(bell);let pop=document.querySelector('.mc-change-pop');if(!pop){pop=document.createElement('div');pop.className='mc-change-pop';pop.hidden=true;pop.innerHTML='<strong>Alteração recebida de outro dispositivo</strong><p></p><button type="button" class="secondary-action">Entendi</button>';document.body.appendChild(pop);pop.querySelector('button').onclick=()=>{lastResult.count=0;pop.hidden=true;render()};document.addEventListener('click',e=>{if(!pop.hidden&&!e.target.closest('.mc-change-pop')&&!e.target.closest('.sync-new-bell'))pop.hidden=true})}bell.onclick=e=>{e.stopPropagation();renderPopover()};return bell}
  function placePopover(pop,bell){if(matchMedia('(max-width:700px)').matches)return;const r=bell.getBoundingClientRect();pop.style.top=`${Math.min(innerHeight-150,r.bottom+9)}px`;pop.style.left=`${Math.max(12,Math.min(innerWidth-352,r.right-340))}px`}
  function renderPopover(){const bell=ensureUi(),pop=document.querySelector('.mc-change-pop');if(!bell||!pop)return;pop.querySelector('strong').textContent='Alteração recebida de outro dispositivo';pop.querySelector('p').textContent=`Seus dados já foram atualizados automaticamente.${lastResult.lastAt?` Última novidade: ${fmt(lastResult.lastAt)}.`:''}`;placePopover(pop,bell);pop.hidden=false}
  function render(){const bell=ensureUi();if(!bell)return;placeBell(bell);const count=bell.querySelector('.sync-new-bell-count');if(count)count.textContent='1';bell.classList.toggle('show',lastResult.count>0);bell.title=lastResult.count?'Há novidade recebida de outro dispositivo':'Sem alterações remotas novas';bell.setAttribute('aria-label',bell.title)}
  function stop(){if(unsub){try{unsub()}catch{}unsub=null}watchUid=null;clearTimeout(retryTimer)}
  function start(){const s=session(),ws=workspaceApi();if(!s?.signedIn||!s.uid||!ws?.watch){stop();render();retryTimer=setTimeout(start,500);return}if(watchUid===s.uid&&unsub)return;stop();watchUid=s.uid;lastResult={count:0,lastAt:0};render();unsub=ws.watch(s.uid,remote=>{if(!remote?.workspace)return;const uid=s.uid,t=parseTime(remote.clientUpdatedAt)||Date.now(),h=hashWorkspace(remote.workspace),prev=readState(uid);if(!prev.hash){saveState(uid,{hash:h,time:t});return}if(prev.hash===h){if(t>(prev.time||0))saveState(uid,{hash:h,time:t});return}saveState(uid,{hash:h,time:t});if(!remote.sourceDeviceId||remote.sourceDeviceId===deviceId())return;lastResult={count:1,lastAt:t};render()},()=>{})}
  function watchPlacement(){clearInterval(placeTimer);let tries=0;placeTimer=setInterval(()=>{tries++;const bell=document.querySelector('.sync-new-bell');if(bell)placeBell(bell);if(tries>40)clearInterval(placeTimer)},250)}
  window.addEventListener('meucontrole:user-session-changed',()=>setTimeout(start,250));
  window.addEventListener('meucontrole:firebase-ready',()=>setTimeout(start,250));
  window.addEventListener('meucontrole:user-workspace-imported',()=>setTimeout(()=>{render();watchPlacement()},50));
  window.addEventListener('load',()=>setTimeout(()=>{ensureUi();render();start();watchPlacement()},700));
  matchMedia('(min-width:701px)').addEventListener?.('change',()=>setTimeout(()=>{ensureUi();render();watchPlacement()},100));
  if(document.readyState!=='loading')setTimeout(()=>{ensureUi();render();start();watchPlacement()},350);
  window.MeuControleChangeIndicator={version:VERSION,refresh:render,state:()=>({...lastResult}),clear:()=>{lastResult.count=0;render()}};
})();
