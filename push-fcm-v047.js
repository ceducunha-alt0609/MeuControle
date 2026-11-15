/* MeuControle — V0.48: fila push incremental (sem limpeza periódica completa) */
import { getMessaging, getToken, deleteToken, isSupported } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-messaging.js';
import { collection, doc, getDocs, writeBatch, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js';

(()=>{
  if(window.__mcPushFcmV047)return;window.__mcPushFcmV047=true;
  const VERSION='0.48.0',ENTRIES_KEY='meu_controle_entries_v2',ENABLED_KEY='meu_controle_notifications_enabled_v1',DEVICE_KEY='meu_controle_device_id_v1',DAY=86400000;
  const VAPID_KEY='BMAb3SY40giuzwWw9fTToAhDp-G41POwcBPkqj6zKJiFEFnZBb4GVyO0aoXYUx-7DKZtTcDz4m6BtnaPY1GHjB0';
  const VAPID_MARKER_KEY='meu_controle_fcm_vapid_marker_v1',VAPID_MARKER='firebase-webpush-2026-09-07';
  let busy=false,lastHash='',lastToken='',lastDeviceWrite=0,previousUid='';
  const QUOTA_PAUSE_KEY='meu_controle_push_quota_pause_until_v1';
  function quotaPaused(){return Date.now()<Number(localStorage.getItem(QUOTA_PAUSE_KEY)||0)}
  const QUEUE_STATE_PREFIX='meu_controle_push_queue_state_v2:';
  const queueStateKey=(uid,did)=>QUEUE_STATE_PREFIX+uid+':'+did;
  const queueState=(uid,did)=>{try{const v=JSON.parse(localStorage.getItem(queueStateKey(uid,did))||'null');return v&&v.items&&typeof v.items==='object'?v:null}catch{return null}};
  function persistQueueState(uid,did,state){localStorage.setItem(queueStateKey(uid,did),JSON.stringify(state))}
  const reminderId=(did,a)=>`${did}__${a.entryId}__${a.phase}__${a.fireAt}`.replace(/[^A-Za-z0-9_-]/g,'_');const DEVICE_WRITE_TTL=6*60*60*1000;
  const cloud=()=>window.MeuControleCloud||null;
  const readEntries=()=>{try{const v=JSON.parse(localStorage.getItem(ENTRIES_KEY)||'[]');return Array.isArray(v)?v:[]}catch{return[]}};
  const enabled=()=>localStorage.getItem(ENABLED_KEY)==='1'&&'Notification'in window&&Notification.permission==='granted';
  function deviceId(){let id=localStorage.getItem(DEVICE_KEY);if(!id){id=crypto.randomUUID();localStorage.setItem(DEVICE_KEY,id)}return id}
  const hash=()=>localStorage.getItem(ENTRIES_KEY)||'[]';
  const entryDate=e=>{const[y,m,d]=String(e.date||'').split('-').map(Number),hm=String(e.time||'09:00').split(':').map(Number);const x=new Date(y,m-1,d);x.setHours(hm[0]||9,hm[1]||0,0,0);return x};
  function queue(){const now=Date.now(),out=[];readEntries().filter(e=>!e.done&&e.date).forEach(e=>{const due=entryDate(e),remind=Math.max(0,Number(e.remind||0)),fire=+due-remind*DAY,title=e.description||'Meu Controle';if(fire>=now-60000)out.push({entryId:e.id,phase:'remind',fireAt:fire,title:`🔔 ${title}`,body:remind?`${remind} dia(s) para ${e.type==='despesa'?'o vencimento':'o compromisso'}`:(e.type==='despesa'?'Vence hoje.':'Lembrete para hoje.')});if(+due>=now-60000&&+due!==fire)out.push({entryId:e.id,phase:'due',fireAt:+due,title:`⏰ ${title}`,body:e.type==='despesa'?'Vence agora.':'Está na hora.'})});return out.sort((a,b)=>a.fireAt-b.fireAt).slice(0,800)}
  function ensureStatus(){const hosts=[document.querySelector('.mobile-app-notifications'),document.getElementById('systemNotificationSettings')].filter(Boolean);hosts.forEach(host=>{if(host.querySelector('.mc-push-status-v047'))return;const row=document.createElement('div');row.className='mc-push-status-v047';row.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:9px;padding-top:9px;border-top:1px solid #e5ebe7;font-size:11px';row.innerHTML='<span>Com app fechado</span><strong style="font-size:11px">Verificando...</strong>';host.appendChild(row)})}
  function status(text){ensureStatus();document.querySelectorAll('.mc-push-status-v047 strong').forEach(x=>x.textContent=text)}
  /* Remoção integral utilizada UMA vez apenas ao migrar filas anteriores à v0.48. */
  async function migrateLegacyQueue(db,uid,did){
    const ref=collection(db,'users',uid,'pushReminders'),snap=await getDocs(ref);
    const docs=snap.docs.filter(d=>d.data()?.deviceId===did&&!d.data()?.sent);
    for(let i=0;i<docs.length;i+=400){
      const batch=writeBatch(db);
      for(const d of docs.slice(i,i+400))batch.delete(d.ref);
      await batch.commit();
    }
  }
  function desiredItems(did,token){
    const out={};
    for(const a of queue()){
      const id=reminderId(did,a);
      out[id]=a;
    }
    return out;
  }
  function itemSignature(a,token){return JSON.stringify([a.entryId,a.phase,a.fireAt,a.title,a.body,token])}
  async function reconcileQueue(db,uid,did,token){
    let prior=queueState(uid,did);
    if(!prior){
      /* A migração é pontual: o acesso antigo fazia esta consulta em toda atualização. */
      await migrateLegacyQueue(db,uid,did);
      prior={items:{}};
      persistQueueState(uid,did,prior);
    }
    const desired=desiredItems(did,token),previous=prior.items||{},next={},operations=[];
    for(const [id,a] of Object.entries(desired)){
      const signature=itemSignature(a,token);next[id]=signature;
      if(previous[id]!==signature){
        operations.push({type:'set',id,value:{...a,deviceId:did,token,sent:false,updatedAt:serverTimestamp()}});
      }
    }
    for(const id of Object.keys(previous))if(!(id in next))operations.push({type:'delete',id});
    for(let i=0;i<operations.length;i+=400){
      const batch=writeBatch(db);
      for(const op of operations.slice(i,i+400)){
        const ref=doc(db,'users',uid,'pushReminders',op.id);
        if(op.type==='delete')batch.delete(ref);else batch.set(ref,op.value);
      }
      await batch.commit();
    }
    persistQueueState(uid,did,{items:next});
    return{count:Object.keys(next).length,changes:operations.length};
  }
  async function clearTrackedQueue(db,uid,did){
    const state=queueState(uid,did);
    const ids=Object.keys(state?.items||{});
    for(let i=0;i<ids.length;i+=400){
      const batch=writeBatch(db);
      for(const id of ids.slice(i,i+400))batch.delete(doc(db,'users',uid,'pushReminders',id));
      await batch.commit();
    }
    if(state)persistQueueState(uid,did,{items:{}});
  }

  async function ensureVapidToken(messaging,reg){if(localStorage.getItem(VAPID_MARKER_KEY)!==VAPID_MARKER){status('Atualizando registro...');try{await deleteToken(messaging)}catch{}lastToken=''}const token=await getToken(messaging,{serviceWorkerRegistration:reg,vapidKey:VAPID_KEY});if(token)localStorage.setItem(VAPID_MARKER_KEY,VAPID_MARKER);return token}
  async function sync(force=false){
    if(busy)return;
    if(quotaPaused()){status('Cota do Firestore atingida — novas tentativas pausadas');return;}
    busy=true;
    try{
      ensureStatus();
      const c=cloud(),u=c?.currentUser?.();
      if(!c?.db||!u){status('Entre no Google');return}
      const did=deviceId();
      if(previousUid!==u.uid){lastHash='';lastToken='';previousUid=u.uid}
      if(!enabled()){
        status('Desativado');
        /* Não consultar toda a coleção quando push já está desabilitado. */
        if(Object.keys(queueState(u.uid,did)?.items||{}).length)await clearTrackedQueue(c.db,u.uid,did);
        lastHash=hash();lastToken='';
        return;
      }
      if(!('serviceWorker'in navigator)){status('Sem service worker');return}
      if(!(await isSupported())){status('Push indisponível');return}
      const reg=await navigator.serviceWorker.ready,messaging=getMessaging(c.app);
      const token=await ensureVapidToken(messaging,reg);
      if(!token){status('Registro pendente');return}
      if(!lastDeviceWrite||Date.now()-lastDeviceWrite>DEVICE_WRITE_TTL||token!==lastToken){
        await writeDevice(c.db,u.uid,did,token);
        lastDeviceWrite=Date.now();
      }
      const state=queueState(u.uid,did),changed=hash()!==lastHash||token!==lastToken||!state;
      if(changed){
        const result=await reconcileQueue(c.db,u.uid,did,token);
        status('Registrado ✓ · '+result.count+' aviso'+(result.count===1?'':'s'));
      }else status('Registrado ✓');
      lastToken=token;lastHash=hash();
    }catch(e){
      console.warn('[MeuControle push]',e);
      if(String(e?.code||'').includes('resource-exhausted'))localStorage.setItem(QUOTA_PAUSE_KEY,String(Date.now()+6*60*60*1000));
      status(String(e?.code||'').includes('resource-exhausted')?'Cota do Firestore atingida — novas tentativas pausadas':e?.code==='permission-denied'?'Firebase recusou registro':'Não configurado');
    }finally{busy=false}
  }
  async function writeDevice(db,uid,did,token){const b=writeBatch(db);b.set(doc(db,'users',uid,'pushDevices',did),{deviceId:did,token,active:true,updatedAt:serverTimestamp(),platform:navigator.userAgent.includes('Android')?'android':'web',vapid:'custom-v1'});await b.commit()}
  function trigger(){setTimeout(()=>sync(true),350)}
  function remoteRefresh(){setTimeout(()=>{try{window.MeuControleSystemReminders?.schedule?.()}catch{}sync(true)},180)}
  function boot(){ensureStatus();sync(true);setInterval(()=>{ensureStatus();if(enabled()&&(hash()!==lastHash||!lastToken))sync(false)},60000);window.addEventListener('focus',()=>sync(false));window.addEventListener('meucontrole:auth-changed',trigger);window.addEventListener('meucontrole:user-workspace-imported',remoteRefresh);document.getElementById('entryForm')?.addEventListener('submit',trigger);document.addEventListener('click',e=>{if(e.target.closest('.doneBtn,.deleteBtn,[data-duplicate-entry]'))trigger()})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,900),{once:true});else setTimeout(boot,900);
  window.MeuControlePush={version:VERSION,sync:()=>sync(true),status:()=>lastToken?'registered':'pending'};
})();
