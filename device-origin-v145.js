/* MeuControle — V1.45: identifica o dispositivo de origem das gravações do workspace */
(()=>{
  if(window.__mcDeviceOriginV145)return;window.__mcDeviceOriginV145=true;
  const VERSION='1.45',DEVICE_KEY='meu_controle_device_id_v1';
  function deviceId(){let id=localStorage.getItem(DEVICE_KEY);if(!id){id=crypto.randomUUID();localStorage.setItem(DEVICE_KEY,id)}return id}
  function patch(){
    const ws=window.MeuControleCloud?.workspace;if(!ws||ws.__mcOriginWrapped||typeof ws.set!=='function')return false;
    const original=ws.set.bind(ws);
    ws.set=(uid,data={})=>original(uid,{...data,sourceDeviceId:deviceId(),sourcePlatform:matchMedia('(max-width:700px)').matches?'mobile':'desktop'});
    ws.__mcOriginWrapped=true;return true;
  }
  window.addEventListener('meucontrole:firebase-ready',()=>setTimeout(patch,0));
  if(!patch()){let n=0;const t=setInterval(()=>{if(patch()||++n>40)clearInterval(t)},100)}
  window.MeuControleDeviceOrigin={version:VERSION,id:deviceId};
})();
