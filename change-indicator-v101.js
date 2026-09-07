/* MeuControle — Indicador de Alterações Remotas V1.01 */
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js';

(()=>{
  if(window.__mcChangeIndicatorV101)return;window.__mcChangeIndicatorV101=true;
  const LAST_SYNC_KEY='meu_controle_last_sync_success_v018';
  const DEVICE_KEY='meu_controle_device_id_v1';
  const BASELINE_KEY='meu_controle_change_indicator_baseline_v1';
  let checking=false,lastResult={count:0,lastAt:0},timer=null;
  const cloud=()=>window.MeuControleCloud||null;
  const deviceId=()=>localStorage.getItem(DEVICE_KEY)||'unknown';
  const parseTime=v=>{if(!v)return 0;if(typeof v==='string')return Date.parse(v)||0;if(typeof v?.toMillis==='function')return v.toMillis();if(v?.seconds)return Number(v.seconds)*1000;return 0};
  const baseline=()=>Date.parse(localStorage.getItem(LAST_SYNC_KEY)||'')||Number(localStorage.getItem(BASELINE_KEY)||0)||0;
  const fmt=t=>t?new Date(t).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'—';

  function ensureUi(){
    let bell=document.querySelector('.sync-new-bell');
    if(!document.getElementById('mcChangeIndicatorStyle')){
      const st=document.createElement('style');st.id='mcChangeIndicatorStyle';st.textContent=`
        .sync-new-bell{display:none;position:relative;flex:0 0 auto;width:42px;height:42px;padding:0;border:1px solid rgba(255,255,255,.28);border-radius:13px;background:rgba(255,255,255,.12)!important;color:#fff!important;font:21px system-ui,sans-serif;align-items:center;justify-content:center;box-shadow:none!important}.sync-new-bell.show{display:flex}.sync-new-bell-count{position:absolute;right:-5px;top:-6px;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:#d27a00;color:#fff;font:800 11px/20px system-ui,sans-serif;text-align:center;border:2px solid var(--primary,#164f78)}
        .mc-change-pop{position:fixed;z-index:3500;width:min(340px,calc(100vw - 24px));padding:14px;border:1px solid #dfe6e1;border-radius:14px;background:#fff;color:#304239;box-shadow:0 18px 44px rgba(0,0,0,.22)}.mc-change-pop[hidden]{display:none!important}.mc-change-pop strong{display:block;font-size:14px}.mc-change-pop p{margin:6px 0 12px;font-size:11px;line-height:1.45;color:#69766f}.mc-change-pop button{width:100%;min-height:40px}
        @media(max-width:700px){.sync-new-bell{width:40px;height:40px}.mc-change-pop{left:12px!important;right:12px!important;top:76px!important;width:auto}}
      `;document.head.appendChild(st);
    }
    if(!bell){const brand=document.querySelector('.topbar .brand');if(!brand)return null;bell=document.createElement('button');bell.type='button';bell.className='sync-new-bell';bell.innerHTML='<span aria-hidden="true">🔔</span><span class="sync-new-bell-count">0</span>';brand.appendChild(bell)}
    let pop=document.querySelector('.mc-change-pop');if(!pop){pop=document.createElement('div');pop.className='mc-change-pop';pop.hidden=true;pop.innerHTML='<strong></strong><p></p><button type="button">Sincronizar agora</button>';document.body.appendChild(pop);pop.querySelector('button').onclick=async()=>{pop.hidden=true;await window.MeuControleSyncQuickV100?.sync?.()};document.addEventListener('click',e=>{if(!pop.hidden&&!e.target.closest('.mc-change-pop')&&!e.target.closest('.sync-new-bell'))pop.hidden=true})}
    bell.onclick=e=>{e.stopPropagation();renderPopover();};
    return bell;
  }
  function placePopover(pop,bell){if(matchMedia('(max-width:700px)').matches)return;const r=bell.getBoundingClientRect();pop.style.top=`${Math.min(innerHeight-150,r.bottom+9)}px`;pop.style.left=`${Math.max(12,Math.min(innerWidth-352,r.right-340))}px`}
  function renderPopover(){const bell=ensureUi(),pop=document.querySelector('.mc-change-pop');if(!bell||!pop)return;const n=lastResult.count;pop.querySelector('strong').textContent=n===1?'1 alteração disponível':`${n} alterações disponíveis`;pop.querySelector('p').textContent=`Última alteração na nuvem: ${fmt(lastResult.lastAt)}. Sincronize para atualizar este aparelho.`;placePopover(pop,bell);pop.hidden=false}
  function render(){const bell=ensureUi();if(!bell)return;const n=lastResult.count,count=bell.querySelector('.sync-new-bell-count');if(count)count.textContent=n>99?'99+':String(n);bell.classList.toggle('show',n>0);bell.title=n?`${n} alteração${n===1?'':'ões'} disponível${n===1?'':'is'} para sincronizar`:'Sem alterações pendentes';bell.setAttribute('aria-label',bell.title)}
  async function check(){
    if(checking)return lastResult;checking=true;
    try{
      const c=cloud(),u=c?.currentUser?.();if(!c?.db||!u)return lastResult;
      const [entriesSnap,tombsSnap]=await Promise.all([getDocs(collection(c.db,'users',u.uid,'entries')),getDocs(collection(c.db,'users',u.uid,'entryTombstones'))]);
      const base=baseline();
      const changes=[];
      entriesSnap.docs.forEach(d=>{const x=d.data()||{},t=parseTime(x.syncMeta?.uploadedAt);if(t>base&&x.syncMeta?.sourceDeviceId&&x.syncMeta.sourceDeviceId!==deviceId())changes.push(t)});
      tombsSnap.docs.forEach(d=>{const x=d.data()||{},t=parseTime(x.deletedAt);if(t>base&&x.sourceDeviceId&&x.sourceDeviceId!==deviceId())changes.push(t)});
      if(!base){const latest=Math.max(0,...changes,...entriesSnap.docs.map(d=>parseTime(d.data()?.syncMeta?.uploadedAt)),...tombsSnap.docs.map(d=>parseTime(d.data()?.deletedAt)));if(latest)localStorage.setItem(BASELINE_KEY,String(latest));lastResult={count:0,lastAt:0}}
      else lastResult={count:changes.length,lastAt:changes.length?Math.max(...changes):0};
      render();return lastResult;
    }catch(e){console.warn('[MeuControle Change Indicator]',e);return lastResult}finally{checking=false}
  }
  function schedule(){clearTimeout(timer);timer=setTimeout(async()=>{await check();schedule()},60000)}
  window.addEventListener('load',()=>setTimeout(()=>{ensureUi();check();schedule()},1700));
  window.addEventListener('focus',()=>setTimeout(check,250));
  window.addEventListener('online',()=>setTimeout(check,250));
  window.addEventListener('meucontrole:auth-changed',()=>setTimeout(check,650));
  window.addEventListener('meucontrole:ops-sync-complete',()=>setTimeout(check,250));
  matchMedia('(min-width:701px)').addEventListener?.('change',()=>setTimeout(()=>{ensureUi();render()},100));
  setTimeout(()=>ensureUi(),250);
  window.MeuControleChangeIndicator={version:'1.01',check,refresh:render,state:()=>({...lastResult})};
})();
