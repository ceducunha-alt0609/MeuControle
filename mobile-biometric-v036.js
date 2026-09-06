/* MeuControle — V0.37: desbloqueio local por autenticador do aparelho somente no mobile */
(function(){
  if(window.__meuControleMobileBiometricV036Loaded)return;
  window.__meuControleMobileBiometricV036Loaded=true;

  const mq=window.matchMedia('(max-width:700px)');
  if(!mq.matches)return;

  const KEY='meu_controle_mobile_biometric_v1';
  const SESSION_KEY='meu_controle_mobile_biometric_unlocked_v1';
  const VERSION='0.37';

  const bytes=n=>crypto.getRandomValues(new Uint8Array(n));
  const toB64=urlBytes=>btoa(String.fromCharCode(...new Uint8Array(urlBytes))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const fromB64=s=>{
    const base=s.replace(/-/g,'+').replace(/_/g,'/');
    const padded=base+'='.repeat((4-base.length%4)%4);
    return Uint8Array.from(atob(padded),c=>c.charCodeAt(0));
  };
  function rawRead(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}
  function read(){
    const state=rawRead();
    if(state&&state.version!==VERSION){
      try{localStorage.removeItem(KEY);sessionStorage.removeItem(SESSION_KEY)}catch{}
      return null;
    }
    return state;
  }
  function save(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch{}}
  function clear(){try{localStorage.removeItem(KEY);sessionStorage.removeItem(SESSION_KEY)}catch{}}
  function unlocked(){try{return sessionStorage.getItem(SESSION_KEY)==='1'}catch{return false}}
  function markUnlocked(){try{sessionStorage.setItem(SESSION_KEY,'1')}catch{}}
  function supported(){return !!(window.isSecureContext&&window.PublicKeyCredential&&navigator.credentials)}

  function installStyles(){
    if(document.getElementById('mobileBiometricV036Style'))return;
    const st=document.createElement('style');
    st.id='mobileBiometricV036Style';
    st.textContent=`
      @media(max-width:700px){
        .mobile-biometric-box-v036{margin-top:16px;padding-top:15px;border-top:1px solid #e5ebe7}
        .mobile-biometric-head-v036{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
        .mobile-biometric-head-v036 h4{margin:0 0 5px;font-size:16px;color:var(--text)}
        .mobile-biometric-head-v036 p{margin:0!important;font-size:12px!important;line-height:1.45!important;color:#6d7a72!important}
        .mobile-biometric-state-v036{flex:0 0 auto;padding:5px 8px;border-radius:999px;background:#eef3f0;color:#68776f;font-size:10px;font-weight:800;white-space:nowrap}
        .mobile-biometric-state-v036.active{background:var(--primary-soft);color:var(--primary)}
        .mobile-biometric-action-v036{width:100%;margin-top:11px;min-height:44px}
        .mobile-biometric-note-v036{margin-top:8px;font-size:10px;line-height:1.45;color:#85918b}
        .mobile-biometric-message-v036{display:none;margin-top:9px;padding:9px 10px;border-radius:10px;background:#fff5e8;color:#875d22;font-size:11px;line-height:1.4}
        .mobile-biometric-message-v036.show{display:block}
        .mobile-biometric-lock-v036{position:fixed;inset:0;z-index:100500;background:linear-gradient(145deg,#164f78,#103c5c);display:flex;align-items:center;justify-content:center;padding:22px;color:#fff}
        .mobile-biometric-lock-card-v036{width:min(390px,100%);text-align:center}
        .mobile-biometric-lock-card-v036 img{width:82px;height:82px;border-radius:22px;box-shadow:0 14px 36px rgba(0,0,0,.22)}
        .mobile-biometric-lock-card-v036 h1{margin:16px 0 5px;font-size:25px}
        .mobile-biometric-lock-card-v036 p{margin:0 auto 20px;max-width:300px;font-size:13px;line-height:1.5;opacity:.82}
        .mobile-biometric-unlock-v036{width:100%;min-height:50px;background:#fff!important;color:#164f78!important;border-radius:13px!important;font-size:15px!important}
        .mobile-biometric-lock-msg-v036{min-height:18px;margin-top:10px;font-size:11px;line-height:1.4;color:#ffe1ae}
        .mobile-biometric-emergency-v036{margin-top:12px;background:transparent!important;color:rgba(255,255,255,.72)!important;font-size:11px!important;font-weight:600!important;padding:8px!important}
      }
    `;
    document.head.appendChild(st);
  }

  function appCard(){
    return [...document.querySelectorAll('#settingsPage .settings-card')].find(c=>(c.querySelector('h3')?.textContent||'').trim().toLowerCase()==='aplicativo');
  }
  function setMessage(box,text=''){
    const el=box?.querySelector('.mobile-biometric-message-v036');if(!el)return;
    el.textContent=text;el.classList.toggle('show',!!text);
  }
  async function platformAvailable(){
    if(!supported())return false;
    try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return false}
  }

  async function registerBiometric(box){
    setMessage(box);
    if(!await platformAvailable()){
      setMessage(box,'Este aparelho ou navegador não disponibilizou biometria/PIN para sites e PWAs.');return false;
    }
    const btn=box.querySelector('.mobile-biometric-action-v036');
    btn.disabled=true;btn.textContent='Confirmando no aparelho...';
    try{
      const userId=bytes(32);
      const credential=await navigator.credentials.create({publicKey:{
        challenge:bytes(32),
        rp:{name:'Meu Controle',id:location.hostname},
        user:{id:userId,name:'meucontrole-local',displayName:'Meu Controle'},
        pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],
        authenticatorSelection:{
          authenticatorAttachment:'platform',
          residentKey:'discouraged',
          requireResidentKey:false,
          userVerification:'required'
        },
        timeout:60000,
        attestation:'none'
      }});
      if(!credential)throw new Error('credential-empty');
      save({enabled:true,credentialId:toB64(credential.rawId),userId:toB64(userId),createdAt:new Date().toISOString(),version:VERSION});
      markUnlocked();
      renderSettings(box);
      setMessage(box,'Entrada por biometria ativada neste aparelho.');
      return true;
    }catch(e){
      if(e?.name==='NotAllowedError')setMessage(box,'Ativação cancelada ou não confirmada no aparelho.');
      else if(e?.name==='InvalidStateError')setMessage(box,'O aparelho recusou criar uma nova credencial local. Tente desativar e ativar novamente após fechar o app.');
      else setMessage(box,'Não foi possível ativar a entrada por biometria neste aparelho.');
      return false;
    }finally{btn.disabled=false;renderSettings(box)}
  }

  async function authenticate(messageEl){
    const state=read();
    if(!state?.enabled||!state.credentialId)return false;
    try{
      const assertion=await navigator.credentials.get({publicKey:{
        challenge:bytes(32),
        rpId:location.hostname,
        allowCredentials:[{type:'public-key',id:fromB64(state.credentialId),transports:['internal']}],
        userVerification:'required',
        timeout:60000
      }});
      if(!assertion)throw new Error('assertion-empty');
      markUnlocked();
      return true;
    }catch(e){
      if(messageEl)messageEl.textContent=e?.name==='NotAllowedError'?'Não confirmado. Toque no botão para tentar novamente.':'Não foi possível validar neste aparelho.';
      return false;
    }
  }

  function renderSettings(box){
    const state=read();
    const badge=box.querySelector('.mobile-biometric-state-v036');
    const btn=box.querySelector('.mobile-biometric-action-v036');
    if(state?.enabled){
      badge.textContent='Ativa ✓';badge.classList.add('active');
      btn.textContent='Desativar entrada por biometria';
      btn.classList.add('secondary-action');
    }else{
      badge.textContent='Desativada';badge.classList.remove('active');
      btn.textContent='Ativar entrada por biometria';
      btn.classList.remove('secondary-action');
    }
  }

  function ensureSettings(){
    const card=appCard();if(!card)return null;
    let box=card.querySelector('.mobile-biometric-box-v036');
    if(box)return box;
    box=document.createElement('div');
    box.className='mobile-biometric-box-v036';
    box.innerHTML=`<div class="mobile-biometric-head-v036"><div><h4>Entrada por biometria</h4><p>Desbloqueie o MeuControle usando a segurança do próprio celular.</p></div><span class="mobile-biometric-state-v036">Desativada</span></div><button type="button" class="mobile-biometric-action-v036">Ativar entrada por biometria</button><div class="mobile-biometric-note-v036">Usa somente o autenticador local do aparelho quando o navegador permitir. O MeuControle não recebe nem armazena sua impressão digital, rosto ou PIN.</div><div class="mobile-biometric-message-v036"></div>`;
    card.appendChild(box);
    box.querySelector('.mobile-biometric-action-v036').onclick=async()=>{
      const state=read();
      if(state?.enabled){
        if(confirm('Desativar a entrada por biometria neste aparelho?')){clear();renderSettings(box);setMessage(box,'Entrada por biometria desativada neste aparelho.');}
      }else await registerBiometric(box);
    };
    renderSettings(box);
    const old=rawRead();
    if(old&&old.version!==VERSION){
      clear();
      setMessage(box,'A configuração anterior foi removida. Ative novamente para usar o modo local corrigido.');
      renderSettings(box);
    }else{
      platformAvailable().then(ok=>{if(!ok&&!read()?.enabled)setMessage(box,'Biometria/PIN não disponível para este PWA neste aparelho ou navegador.')});
    }
    return box;
  }

  function showLock(){
    if(document.querySelector('.mobile-biometric-lock-v036')||unlocked())return;
    const state=read();if(!state?.enabled)return;
    const lock=document.createElement('div');lock.className='mobile-biometric-lock-v036';
    lock.innerHTML=`<div class="mobile-biometric-lock-card-v036"><img src="icons/icon-192.png" alt=""><h1>Meu Controle</h1><p>Confirme sua identidade no celular para entrar.</p><button type="button" class="mobile-biometric-unlock-v036">Desbloquear com biometria</button><div class="mobile-biometric-lock-msg-v036"></div><button type="button" class="mobile-biometric-emergency-v036">Problemas para entrar?</button></div>`;
    document.body.appendChild(lock);
    const unlock=lock.querySelector('.mobile-biometric-unlock-v036');
    const msg=lock.querySelector('.mobile-biometric-lock-msg-v036');
    unlock.onclick=async()=>{
      unlock.disabled=true;unlock.textContent='Confirmando...';msg.textContent='';
      const ok=await authenticate(msg);
      if(ok)lock.remove();
      else{unlock.disabled=false;unlock.textContent='Desbloquear com biometria';}
    };
    lock.querySelector('.mobile-biometric-emergency-v036').onclick=()=>{
      if(confirm('Se a biometria deste aparelho não estiver mais disponível, você pode desativar esta trava local e entrar normalmente. Deseja desativar?')){
        clear();lock.remove();ensureSettings();
      }
    };
  }

  installStyles();
  const boot=()=>{ensureSettings();showLock()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0),{once:true});else setTimeout(boot,0);
  window.addEventListener('load',()=>setTimeout(ensureSettings,350));
  window.MeuControleMobileBiometric={version:VERSION,enabled:()=>!!read()?.enabled,lock:()=>{try{sessionStorage.removeItem(SESSION_KEY)}catch{}showLock()}};
})();
