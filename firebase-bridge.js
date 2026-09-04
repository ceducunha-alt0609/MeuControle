/* MeuControle — ponte inicial com Firebase (sem sincronização de dados ainda) */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js';

const firebaseConfig={
  apiKey:'AIzaSyANa-pk5bj3phYlAm2X1jPulpVw3U4eMOI',
  authDomain:'meucontrole-b8f2d.firebaseapp.com',
  projectId:'meucontrole-b8f2d',
  storageBucket:'meucontrole-b8f2d.firebasestorage.app',
  messagingSenderId:'919790043994',
  appId:'1:919790043994:web:74fea56aa6029a00e82963'
};

const app=initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);
const provider=new GoogleAuthProvider();
provider.setCustomParameters({prompt:'select_account'});

try{await setPersistence(auth,browserLocalPersistence)}catch{}

window.MeuControleCloud={
  app,
  auth,
  db,
  currentUser:()=>auth.currentUser,
  ready:true
};
window.dispatchEvent(new CustomEvent('meucontrole:firebase-ready'));

function dataCard(){
  return [...document.querySelectorAll('#settingsPage .settings-card')].find(card=>
    (card.querySelector('h3')?.textContent||'').trim().toLowerCase().includes('dados e segurança')
  );
}

function ensureUI(){
  const card=dataCard();
  if(!card||card.querySelector('.firebase-sync-box'))return card?.querySelector('.firebase-sync-box')||null;

  const style=document.createElement('style');
  style.textContent=`
    .firebase-sync-box{margin-top:16px;padding-top:15px;border-top:1px solid #e5ebe7}
    .firebase-sync-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
    .firebase-sync-head h4{margin:0 0 4px;font-size:16px;color:var(--text)}
    .firebase-sync-head p{margin:0!important;font-size:12px!important;line-height:1.45!important;color:#6d7a72!important}
    .firebase-sync-badge{flex:0 0 auto;padding:5px 8px;border-radius:999px;background:#eef3f0;color:#607068;font-size:10px;font-weight:800;white-space:nowrap}
    .firebase-sync-badge.connected{background:var(--primary-soft);color:var(--primary)}
    .firebase-sync-user{margin-top:11px;padding:10px 11px;border-radius:11px;background:#f6f8f7;font-size:11px;line-height:1.45;color:#647269;overflow-wrap:anywhere}
    .firebase-sync-actions{display:flex;gap:8px;margin-top:10px}
    .firebase-sync-actions button{min-height:42px}
    .firebase-sync-message{display:none;margin-top:9px;padding:9px 10px;border-radius:10px;background:#fff5e8;color:#875d22;font-size:11px;line-height:1.4}
    .firebase-sync-message.show{display:block}
    @media(max-width:700px){
      .firebase-sync-head{display:grid;grid-template-columns:1fr auto}
      .firebase-sync-actions{display:grid;grid-template-columns:1fr}
      .firebase-sync-actions button{width:100%}
    }
  `;
  document.head.appendChild(style);

  const box=document.createElement('div');
  box.className='firebase-sync-box';
  box.innerHTML=`
    <div class="firebase-sync-head">
      <div><h4>Sincronização</h4><p>Firebase preparado. Nesta etapa, apenas autenticamos e testamos a conexão; seus lançamentos continuam somente locais.</p></div>
      <span class="firebase-sync-badge">Preparado</span>
    </div>
    <div class="firebase-sync-user">Nenhuma conta conectada.</div>
    <div class="firebase-sync-actions"><button type="button" class="firebase-login-btn">Entrar com Google</button></div>
    <div class="firebase-sync-message"></div>`;
  card.appendChild(box);

  box.querySelector('.firebase-login-btn').addEventListener('click',async()=>{
    const btn=box.querySelector('.firebase-login-btn');
    clearMessage(box);
    if(auth.currentUser){
      btn.disabled=true;
      try{await signOut(auth)}catch(e){showMessage(box,errorText(e))}
      finally{btn.disabled=false}
      return;
    }
    btn.disabled=true;btn.textContent='Abrindo Google...';
    try{await signInWithPopup(auth,provider)}
    catch(e){showMessage(box,errorText(e))}
    finally{btn.disabled=false;if(!auth.currentUser)btn.textContent='Entrar com Google'}
  });
  return box;
}

function clearMessage(box){
  const el=box?.querySelector('.firebase-sync-message');if(!el)return;
  el.textContent='';el.classList.remove('show');
}
function showMessage(box,text){
  const el=box?.querySelector('.firebase-sync-message');if(!el)return;
  el.textContent=text;el.classList.add('show');
}
function errorText(error){
  const code=error?.code||'';
  if(code==='auth/unauthorized-domain')return 'Este endereço ainda não está autorizado no Firebase. Adicione o domínio do MeuControle em Authentication > Configurações > Domínios autorizados.';
  if(code==='auth/popup-blocked')return 'O navegador bloqueou a janela do Google. Libere pop-ups para o MeuControle e tente novamente.';
  if(code==='auth/popup-closed-by-user'||code==='auth/cancelled-popup-request')return 'Login cancelado. Nenhum dado foi alterado.';
  return `Não foi possível conectar ao Google${code?` (${code})`:''}.`;
}

function renderAuth(user){
  const box=ensureUI();if(!box)return;
  const badge=box.querySelector('.firebase-sync-badge');
  const info=box.querySelector('.firebase-sync-user');
  const btn=box.querySelector('.firebase-login-btn');
  clearMessage(box);
  if(user){
    badge.textContent='Conectado ✓';badge.classList.add('connected');
    info.textContent=`Conta conectada: ${user.email||user.displayName||'Google'}. Firestore inicializado; sincronização de lançamentos ainda não foi ativada.`;
    btn.textContent='Sair da conta';
  }else{
    badge.textContent='Preparado';badge.classList.remove('connected');
    info.textContent='Nenhuma conta conectada.';
    btn.textContent='Entrar com Google';
  }
}

ensureUI();
onAuthStateChanged(auth,user=>{
  renderAuth(user);
  window.dispatchEvent(new CustomEvent('meucontrole:auth-changed',{detail:{signedIn:!!user,uid:user?.uid||null,email:user?.email||null}}));
});
