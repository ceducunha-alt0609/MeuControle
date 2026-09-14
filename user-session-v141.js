/* MeuControle — V1.41.1: identidade/sessão do usuário, integrada ao escopo de dados */
(()=>{
  if(window.__mcUserSessionV141)return;window.__mcUserSessionV141=true;
  const VERSION='1.41.1';
  const SNAPSHOT_KEY='meu_controle_user_identity_v1';
  let state={ready:false,signedIn:false,uid:null,email:null,displayName:null,photoURL:null};

  function normalize(detail={}){
    return {
      ready:true,
      signedIn:!!detail.signedIn,
      uid:detail.uid||null,
      email:detail.email||null,
      displayName:detail.displayName||null,
      photoURL:detail.photoURL||null
    };
  }
  function fromCloud(){
    try{
      const u=window.MeuControleCloud?.currentUser?.();
      return normalize({signedIn:!!u,uid:u?.uid,email:u?.email,displayName:u?.displayName,photoURL:u?.photoURL});
    }catch{return normalize({signedIn:false})}
  }
  function persist(){
    try{
      if(state.signedIn)localStorage.setItem(SNAPSHOT_KEY,JSON.stringify({uid:state.uid,email:state.email,displayName:state.displayName,photoURL:state.photoURL}));
      else localStorage.removeItem(SNAPSHOT_KEY);
    }catch{}
  }
  function emit(){
    window.dispatchEvent(new CustomEvent('meucontrole:user-session-changed',{detail:{...state}}));
  }
  function setState(next){state={...state,...next,ready:true};persist();render();emit()}

  function style(){
    if(document.getElementById('mcUserSessionV141Style'))return;
    const st=document.createElement('style');st.id='mcUserSessionV141Style';st.textContent=`
      .mc-user-session-v141{margin-top:16px;padding:14px;border:1px solid #dfe7e2;border-radius:14px;background:#fafcfb}
      .mc-user-session-head-v141{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.mc-user-session-head-v141 h4{margin:0;font-size:16px;color:var(--text)}.mc-user-session-head-v141 p{margin:4px 0 0!important;font-size:11px!important;line-height:1.45!important;color:#6f7c75!important}
      .mc-user-session-badge-v141{padding:5px 8px;border-radius:999px;background:#eef3f0;color:#607068;font:800 10px system-ui,sans-serif;white-space:nowrap}.mc-user-session-badge-v141.on{background:var(--primary-soft);color:var(--primary)}
      .mc-user-session-person-v141{display:grid;grid-template-columns:42px minmax(0,1fr);gap:10px;align-items:center;margin-top:12px}.mc-user-session-avatar-v141{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:var(--primary-soft);color:var(--primary);font:800 15px system-ui,sans-serif;overflow:hidden}.mc-user-session-avatar-v141 img{width:100%;height:100%;object-fit:cover}.mc-user-session-copy-v141 strong{display:block;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis}.mc-user-session-copy-v141 span{display:block;margin-top:3px;font-size:10px;color:#738078;overflow-wrap:anywhere}
      .mc-user-session-actions-v141{display:flex;gap:8px;margin-top:12px}.mc-user-session-actions-v141 button{min-height:40px}.mc-user-session-note-v141{margin-top:11px;padding:9px 10px;border-radius:10px;background:#eef6f1;color:#426451;font-size:10px;line-height:1.45}
      .mc-profile-scope-note-v141{margin-top:7px!important;font-size:10px!important;line-height:1.45!important;color:#78847e!important}
      body.mc-dark .mc-user-session-v141{background:#1b262d;border-color:#314049}.mc-dark .mc-user-session-head-v141 p,.mc-dark .mc-user-session-copy-v141 span,.mc-dark .mc-profile-scope-note-v141{color:#9eabb3!important}.mc-dark .mc-user-session-note-v141{background:#22352a;color:#b9dec9}
      @media(max-width:700px){.mc-user-session-actions-v141{display:grid;grid-template-columns:1fr}.mc-user-session-actions-v141 button{width:100%}}
    `;document.head.appendChild(st);
  }

  function dataCard(){return [...document.querySelectorAll('#settingsPage .settings-card')].find(c=>(c.querySelector('h3')?.textContent||'').trim().toLowerCase().includes('dados e segurança'))}
  function profileCard(){return [...document.querySelectorAll('#settingsPage .settings-card')].find(c=>(c.querySelector('h3')?.textContent||'').trim()==='Perfis')}
  function initials(){const s=(state.displayName||state.email||'?').trim();const parts=s.split(/\s+/).filter(Boolean);return ((parts[0]?.[0]||'?')+(parts.length>1?(parts.at(-1)?.[0]||''):'' )).toUpperCase()}

  function ensure(){
    style();
    const card=dataCard();if(card&&!card.querySelector('.mc-user-session-v141')){
      const box=document.createElement('section');box.className='mc-user-session-v141';box.innerHTML=`
        <div class="mc-user-session-head-v141"><div><h4>Usuário do MeuControle</h4><p>Conta identifica a pessoa; perfis organizam os contextos dela.</p></div><span class="mc-user-session-badge-v141">Verificando</span></div>
        <div class="mc-user-session-person-v141"><div class="mc-user-session-avatar-v141">?</div><div class="mc-user-session-copy-v141"><strong>Verificando conta...</strong><span></span></div></div>
        <div class="mc-user-session-actions-v141"><button type="button" class="mc-user-login-v141">Entrar com Google</button><button type="button" class="secondary-action mc-user-switch-v141" hidden>Trocar conta</button><button type="button" class="ghost mc-user-logout-v141" hidden>Sair da conta</button></div>
        <div class="mc-user-session-note-v141">Ciclo 2: cada conta passa a ter seu próprio espaço local de dados. A sincronização com Firestore continua desativada por enquanto.</div>`;
      const sync=card.querySelector('.firebase-sync-box');if(sync)card.insertBefore(box,sync);else card.appendChild(box);
      box.querySelector('.mc-user-login-v141').onclick=async()=>{try{await window.MeuControleCloud?.signIn?.()}catch{}};
      box.querySelector('.mc-user-switch-v141').onclick=async()=>{try{await window.MeuControleCloud?.switchAccount?.()}catch{}};
      box.querySelector('.mc-user-logout-v141').onclick=async()=>{try{await window.MeuControleCloud?.signOut?.()}catch{}};
    }
    const pc=profileCard();if(pc&&!pc.querySelector('.mc-profile-scope-note-v141')){
      const p=document.createElement('p');p.className='mc-profile-scope-note-v141';p.textContent='Perfis são áreas de organização dentro do usuário conectado; não representam contas diferentes.';pc.appendChild(p);
    }
  }

  function render(){
    ensure();const box=document.querySelector('.mc-user-session-v141');if(!box)return;
    const badge=box.querySelector('.mc-user-session-badge-v141'),avatar=box.querySelector('.mc-user-session-avatar-v141'),name=box.querySelector('.mc-user-session-copy-v141 strong'),mail=box.querySelector('.mc-user-session-copy-v141 span'),login=box.querySelector('.mc-user-login-v141'),sw=box.querySelector('.mc-user-switch-v141'),out=box.querySelector('.mc-user-logout-v141');
    if(!state.ready){badge.textContent='Verificando';return}
    if(state.signedIn){
      badge.textContent='Conectado ✓';badge.classList.add('on');name.textContent=state.displayName||'Usuário Google';mail.textContent=state.email||'';login.hidden=true;sw.hidden=false;out.hidden=false;
      avatar.innerHTML=state.photoURL?`<img src="${state.photoURL}" alt="">`:initials();
    }else{
      badge.textContent='Modo local';badge.classList.remove('on');name.textContent='Sem conta conectada';mail.textContent='Entre com sua conta para acessar o espaço de dados correspondente.';login.hidden=false;sw.hidden=true;out.hidden=true;avatar.textContent='?';
    }
  }

  window.addEventListener('meucontrole:auth-changed',e=>setState(normalize(e.detail||{})));
  window.addEventListener('meucontrole:firebase-ready',()=>setTimeout(()=>setState(fromCloud()),0));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{ensure();render()},{once:true});else{ensure();render()}
  if(window.MeuControleCloud?.ready)setTimeout(()=>setState(fromCloud()),0);

  window.MeuControleUserSession={
    version:VERSION,
    get:()=>({...state}),
    isReady:()=>state.ready,
    isSignedIn:()=>state.signedIn,
    uid:()=>state.uid,
    signIn:()=>window.MeuControleCloud?.signIn?.(),
    signOut:()=>window.MeuControleCloud?.signOut?.(),
    switchAccount:()=>window.MeuControleCloud?.switchAccount?.()
  };
})();
