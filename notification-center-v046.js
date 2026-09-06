/* MeuControle — V0.46: central de alertas + notificações locais PWA */
(function(){
  if(window.__meuControleNotificationCenterV046Loaded)return;
  window.__meuControleNotificationCenterV046Loaded=true;

  const VERSION='0.46';
  const STORAGE_KEY='meu_controle_entries_v2';
  const PREF_KEY='meu_controle_notifications_v1';
  const LAST_STATE_KEY='meu_controle_notification_state_v1';
  const DAY=86400000;

  function readEntries(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')}catch{return[]}}
  function readPrefs(){try{return JSON.parse(localStorage.getItem(PREF_KEY)||'{}')}catch{return{}}}
  function savePrefs(v){try{localStorage.setItem(PREF_KEY,JSON.stringify(v))}catch{}}
  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[m])}
  function localISO(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
  function dateOnly(s){if(!s)return null;const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)}
  function daysFromToday(s){const d=dateOnly(s);if(!d)return 9999;const t=dateOnly(localISO());return Math.round((d-t)/DAY)}
  function profileName(id){try{return (window.profiles||[]).find(p=>p.id===(id||'pessoal'))?.name||id||'Pessoal'}catch{return id||'Pessoal'}}
  function fmtMoney(v){return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
  function effectiveDate(e){
    try{
      if(e?.useBusinessDay&&typeof window.nextBusinessDay==='function')return window.nextBusinessDay(e.date)?.date||e.date;
    }catch{}
    return e.date;
  }
  function itemDateTime(e){
    const date=effectiveDate(e);if(!date)return null;
    const d=dateOnly(date);const hm=(e.time||'09:00').split(':').map(Number);
    d.setHours(Number.isFinite(hm[0])?hm[0]:9,Number.isFinite(hm[1])?hm[1]:0,0,0);
    return d;
  }
  function alertDateTime(e){
    const base=itemDateTime(e);if(!base)return null;
    const days=Math.max(0,Number(e.remind||0));
    return new Date(base.getTime()-days*DAY);
  }
  function pending(){return readEntries().filter(e=>!e.done&&e.date)}
  function groups(){
    const list=pending();
    return {
      late:list.filter(e=>daysFromToday(effectiveDate(e))<0).sort((a,b)=>effectiveDate(a).localeCompare(effectiveDate(b))),
      today:list.filter(e=>daysFromToday(effectiveDate(e))===0).sort((a,b)=>(a.time||'99:99').localeCompare(b.time||'99:99')),
      next:list.filter(e=>{const d=daysFromToday(effectiveDate(e));return d>0&&d<=7}).sort((a,b)=>effectiveDate(a).localeCompare(effectiveDate(b)))
    };
  }

  function installStyles(){
    if(document.getElementById('notificationCenterV046Style'))return;
    const st=document.createElement('style');st.id='notificationCenterV046Style';
    st.textContent=`
      .mc-notify-wrap-v046{position:relative;display:flex;align-items:center;justify-content:center}
      .mc-notify-btn-v046{position:relative;width:40px;height:40px;border-radius:12px;border:1px solid rgba(255,255,255,.24)!important;background:rgba(255,255,255,.10)!important;color:#fff!important;padding:0!important;font-size:19px;display:grid;place-items:center;box-shadow:none!important}
      .mc-notify-btn-v046:hover{background:rgba(255,255,255,.17)!important}
      .mc-notify-badge-v046{position:absolute;right:-5px;top:-5px;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:#d94d45;color:#fff;font-size:10px;line-height:18px;font-weight:900;text-align:center;border:2px solid rgba(20,61,91,.95)}
      .mc-notify-badge-v046[hidden]{display:none!important}
      .mc-notify-panel-v046{position:fixed;z-index:100020;top:68px;right:18px;width:min(390px,calc(100vw - 28px));max-height:min(620px,calc(100vh - 86px));overflow:auto;background:#fff;border:1px solid #e2e8e4;border-radius:18px;box-shadow:0 22px 60px rgba(20,43,58,.26);color:#23342d;padding:0}
      .mc-notify-panel-v046[hidden]{display:none!important}
      .mc-notify-head-v046{position:sticky;top:0;background:#fff;z-index:1;padding:15px 16px 12px;border-bottom:1px solid #edf1ef;display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
      .mc-notify-head-v046 strong{display:block;font-size:16px}.mc-notify-head-v046 span{display:block;margin-top:3px;font-size:11px;color:#74827b}
      .mc-notify-close-v046{background:transparent!important;color:#64746b!important;border:0!important;padding:5px 7px!important;min-height:0!important;font-size:18px}
      .mc-notify-permission-v046{margin:12px 14px;padding:12px;border-radius:13px;background:#f5f8f6;border:1px solid #e6ece8;font-size:11px;line-height:1.45;color:#627169}
      .mc-notify-permission-v046 button{width:100%;margin-top:9px;min-height:38px}
      .mc-notify-section-v046{padding:6px 14px 11px}.mc-notify-section-v046 h4{margin:8px 2px 6px;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#738179}
      .mc-notify-item-v046{width:100%;border:0!important;background:#fff!important;color:inherit!important;text-align:left!important;padding:10px 9px!important;border-radius:11px!important;display:block!important;min-height:0!important}
      .mc-notify-item-v046:hover{background:#f5f8f6!important}.mc-notify-item-v046 strong{display:block;font-size:13px;color:#23342d}.mc-notify-item-v046 span{display:block;margin-top:3px;font-size:10px;line-height:1.4;color:#7b8881}
      .mc-notify-item-v046.late strong{color:#b43f39}.mc-notify-empty-v046{padding:22px 16px 25px;text-align:center;color:#7a8880;font-size:12px}
      @media(max-width:700px){.mc-notify-panel-v046{top:65px;right:10px;width:calc(100vw - 20px);max-height:calc(100vh - 82px)}.mc-notify-wrap-v046{position:absolute;right:14px;top:14px}.brand{padding-right:48px}}
    `;
    document.head.appendChild(st);
  }

  function ensureUI(){
    const top=document.querySelector('.topbar-upper');if(!top)return null;
    let wrap=top.querySelector('.mc-notify-wrap-v046');if(wrap)return wrap;
    wrap=document.createElement('div');wrap.className='mc-notify-wrap-v046';
    wrap.innerHTML=`<button type="button" class="mc-notify-btn-v046" aria-label="Alertas e lembretes" title="Alertas e lembretes">🔔<span class="mc-notify-badge-v046" hidden></span></button><section class="mc-notify-panel-v046" hidden><div class="mc-notify-head-v046"><div><strong>Alertas e lembretes</strong><span>O que merece sua atenção agora.</span></div><button type="button" class="mc-notify-close-v046" aria-label="Fechar">×</button></div><div class="mc-notify-body-v046"></div></section>`;
    const summary=top.querySelector('.top-summary');if(summary)top.insertBefore(wrap,summary);else top.appendChild(wrap);
    wrap.querySelector('.mc-notify-btn-v046').onclick=e=>{e.stopPropagation();const p=wrap.querySelector('.mc-notify-panel-v046');p.hidden=!p.hidden;if(!p.hidden)renderPanel()};
    wrap.querySelector('.mc-notify-close-v046').onclick=()=>wrap.querySelector('.mc-notify-panel-v046').hidden=true;
    document.addEventListener('click',e=>{const p=wrap.querySelector('.mc-notify-panel-v046');if(!p.hidden&&!wrap.contains(e.target))p.hidden=true});
    return wrap;
  }

  function permissionText(){
    if(!('Notification'in window))return 'Este navegador não oferece notificações do sistema.';
    if(Notification.permission==='granted')return 'Notificações do Windows/celular estão ativadas neste aparelho.';
    if(Notification.permission==='denied')return 'As notificações estão bloqueadas no navegador. Libere a permissão do MeuControle nas configurações do site.';
    return 'Ative para receber avisos do MeuControle mesmo quando estiver usando outra janela.';
  }

  function itemMeta(e,label){
    const parts=[label];if(e.time)parts.push(e.time);if(e.type==='despesa'&&!e.valuePending)parts.push(fmtMoney(e.value));parts.push(profileName(e.profile));return parts.join(' • ');
  }
  function openEntry(e){
    try{if(typeof window.startEdit==='function')window.startEdit(e.id);if(typeof window.showPage==='function')window.showPage('launches');else document.querySelector('[data-page="launches"]')?.click()}catch{}
    ensureUI()?.querySelector('.mc-notify-panel-v046').setAttribute('hidden','');
  }
  function sectionHTML(title,list,kind){
    if(!list.length)return'';
    return `<div class="mc-notify-section-v046"><h4>${title}</h4>${list.slice(0,12).map(e=>{const d=daysFromToday(effectiveDate(e));const label=kind==='late'?`${Math.abs(d)} dia${Math.abs(d)===1?'':'s'} atrasado${Math.abs(d)===1?'':'s'}`:kind==='today'?'Hoje':`Em ${d} dia${d===1?'':'s'}`;return `<button type="button" class="mc-notify-item-v046 ${kind==='late'?'late':''}" data-mc-notify-id="${esc(e.id)}"><strong>${esc(e.description||'Lançamento')}</strong><span>${esc(itemMeta(e,label))}</span></button>`}).join('')}</div>`;
  }
  function renderPanel(){
    const wrap=ensureUI();if(!wrap)return;const body=wrap.querySelector('.mc-notify-body-v046');const g=groups();
    const permission=`<div class="mc-notify-permission-v046">${esc(permissionText())}${('Notification'in window)&&Notification.permission==='default'?'<button type="button" class="mc-enable-notifications-v046">Ativar notificações</button>':''}</div>`;
    const content=sectionHTML('Vencidos',g.late,'late')+sectionHTML('Hoje',g.today,'today')+sectionHTML('Próximos 7 dias',g.next,'next');
    body.innerHTML=permission+(content||'<div class="mc-notify-empty-v046">Tudo em ordem por aqui. ✓</div>');
    body.querySelector('.mc-enable-notifications-v046')?.addEventListener('click',requestPermission);
    body.querySelectorAll('[data-mc-notify-id]').forEach(btn=>btn.onclick=()=>{const e=readEntries().find(x=>String(x.id)===btn.dataset.mcNotifyId);if(e)openEntry(e)});
    updateBadge();
  }
  function updateBadge(){
    const wrap=ensureUI();if(!wrap)return;const g=groups();const count=g.late.length+g.today.length;const badge=wrap.querySelector('.mc-notify-badge-v046');badge.hidden=count===0;badge.textContent=count>99?'99+':String(count);
  }

  async function requestPermission(){
    if(!('Notification'in window))return;
    try{
      const p=await Notification.requestPermission();savePrefs({...readPrefs(),enabled:p==='granted',askedAt:new Date().toISOString()});
      if(p==='granted'){await schedule();try{new Notification('Meu Controle',{body:'Alertas ativados neste aparelho. 🔔',icon:'icons/icon-192.png',tag:'mc-notifications-enabled'})}catch{}}
    }catch{}
    renderPanel();
  }

  function buildAlarms(){
    const now=Date.now(),max=now+24*60*60*1000,alarms=[];
    pending().forEach(e=>{
      const fire=alertDateTime(e);if(!fire)return;
      const base=itemDateTime(e);const remindDays=Math.max(0,Number(e.remind||0));
      if(fire.getTime()>=now&&fire.getTime()<=max){
        alarms.push({fireAt:fire.getTime(),entryId:e.id,title:remindDays?`🔔 ${e.description}`:`🔔 Hoje: ${e.description}`,body:remindDays?`${remindDays} dia${remindDays===1?'':'s'} para ${e.type==='despesa'?'o vencimento':'este compromisso'}${e.time?` • ${e.time}`:''}`:`${e.time?`${e.time} • `:''}${e.type==='despesa'&&!e.valuePending?fmtMoney(e.value):'Lembrete do MeuControle'}`,tag:`mc-entry-${e.id}-remind`,phase:'remind'});
      }
      if(base&&base.getTime()>=now&&base.getTime()<=max&&base.getTime()!==fire.getTime()){
        alarms.push({fireAt:base.getTime(),entryId:e.id,title:`⏰ ${e.description}`,body:e.type==='despesa'?`Vence agora${!e.valuePending?` • ${fmtMoney(e.value)}`:''}`:'Está na hora deste compromisso.',tag:`mc-entry-${e.id}-due`,phase:'due'});
      }
    });
    return alarms;
  }
  async function registration(){
    if(!('serviceWorker'in navigator))return null;
    try{return await navigator.serviceWorker.ready}catch{return null}
  }
  async function schedule(){
    if(!('Notification'in window)||Notification.permission!=='granted')return;
    const reg=await registration();if(!reg?.active)return;
    reg.active.postMessage({type:'SCHEDULE_ENTRY_ALERTS',alarms:buildAlarms()});
    try{localStorage.setItem(LAST_STATE_KEY,JSON.stringify({scheduledAt:new Date().toISOString(),count:buildAlarms().length}))}catch{}
  }

  function refresh(){updateBadge();const p=ensureUI()?.querySelector('.mc-notify-panel-v046');if(p&&!p.hidden)renderPanel();schedule()}
  function boot(){installStyles();ensureUI();updateBadge();schedule();setInterval(refresh,5*60*1000)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0),{once:true});else setTimeout(boot,0);
  window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});window.addEventListener('storage',refresh);
  navigator.serviceWorker?.addEventListener('message',e=>{if(e.data?.type==='REQUEST_ENTRY_ALERT_REFRESH')schedule();if(e.data?.type==='OPEN_ENTRY'&&e.data.entryId){const item=readEntries().find(x=>String(x.id)===String(e.data.entryId));if(item)openEntry(item)}});
  window.MeuControleNotifications={version:VERSION,refresh,schedule,requestPermission,groups};
})();
