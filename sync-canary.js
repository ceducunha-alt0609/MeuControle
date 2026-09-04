/* MeuControle — Sincronização V0.2: lançamento-cobaia sintético no Firestore */
import { doc, setDoc, getDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js';

(()=>{
  if(window.__meuControleSyncCanaryLoaded)return;
  window.__meuControleSyncCanaryLoaded=true;

  function syncBox(){return document.querySelector('#settingsPage .firebase-sync-box')}
  function ensure(){
    const parent=syncBox();
    if(!parent)return null;
    let box=parent.querySelector('.sync-canary-box');
    if(box)return box;

    const style=document.createElement('style');
    style.textContent=`
      .sync-canary-box{margin-top:10px;padding:12px;border:1px solid #e4eae7;border-radius:12px;background:#fbfcfb}
      .sync-canary-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:7px}
      .sync-canary-head strong{font-size:12px;color:var(--text)}
      .sync-canary-pill{padding:4px 7px;border-radius:999px;background:#edf5fa;color:#164f78;font-size:9px;font-weight:800;white-space:nowrap}
      .sync-canary-text{margin:0!important;font-size:10px!important;line-height:1.45!important;color:#6e7973!important}
      .sync-canary-actions{display:grid;grid-template-columns:1fr;gap:7px;margin-top:9px}
      .sync-canary-actions button{width:100%;min-height:36px}
      .sync-canary-result{display:none;margin-top:9px;padding:9px 10px;border-radius:10px;font-size:10px;line-height:1.45;overflow-wrap:anywhere}
      .sync-canary-result.show{display:block}
      .sync-canary-result.ok{background:#eef7f0;color:#386245}
      .sync-canary-result.warn{background:#fff5e8;color:#875d22}
      .sync-canary-result.info{background:#edf5fa;color:#164f78}
    `;
    document.head.appendChild(style);

    box=document.createElement('div');
    box.className='sync-canary-box';
    box.innerHTML=`
      <div class="sync-canary-head"><strong>Teste do lançamento-cobaia</strong><span class="sync-canary-pill">V0.2</span></div>
      <p class="sync-canary-text">Cria um lançamento sintético temporário na área de diagnóstico do seu usuário, lê o mesmo documento para conferir a integridade e, se tudo der certo, apaga a cobaia. Seus 24 lançamentos reais não são tocados.</p>
      <div class="sync-canary-actions"><button type="button" class="secondary-action sync-canary-btn">Executar teste seguro</button></div>
      <div class="sync-canary-result"></div>`;
    parent.appendChild(box);
    box.querySelector('.sync-canary-btn').addEventListener('click',run);
    return box;
  }

  function result(type,text){
    const box=ensure();if(!box)return;
    const el=box.querySelector('.sync-canary-result');
    el.className=`sync-canary-result show ${type}`;
    el.textContent=text;
  }

  function cloud(){return window.MeuControleCloud||null}

  async function run(){
    const box=ensure();if(!box)return;
    const btn=box.querySelector('.sync-canary-btn');
    const c=cloud();
    const user=c?.currentUser?.();
    if(!c?.db||!user){
      result('warn','Entre com sua conta Google antes de executar o teste. Nenhum dado foi alterado.');
      return;
    }

    btn.disabled=true;
    const original=btn.textContent;
    btn.textContent='Testando Firebase...';
    const canaryId=`canary-${Date.now()}-${Math.random().toString(16).slice(2,8)}`;
    const ref=doc(c.db,'users',user.uid,'diagnostics','sync-canary');
    const payload={
      kind:'sync-canary',
      canaryId,
      description:'LANÇAMENTO-COBAIA — TESTE DE SINCRONIZAÇÃO',
      type:'despesa',
      value:0,
      profile:'pessoal',
      date:new Date().toISOString().slice(0,10),
      done:false,
      deviceId:window.MeuControleSync?.deviceId||'unknown',
      createdAt:new Date().toISOString(),
      schemaVersion:1
    };

    let created=false;
    try{
      result('info','1/3 — enviando a cobaia para o Firestore...');
      await setDoc(ref,payload);
      created=true;

      result('info','2/3 — lendo a cobaia de volta e conferindo...');
      const snap=await getDoc(ref);
      if(!snap.exists())throw new Error('A cobaia foi enviada, mas não voltou na leitura.');
      const received=snap.data()||{};
      if(received.canaryId!==payload.canaryId||received.description!==payload.description){
        throw new Error('A leitura voltou com conteúdo diferente do que foi enviado.');
      }

      result('info','3/3 — conferência aprovada; apagando a cobaia...');
      await deleteDoc(ref);
      created=false;
      result('ok','Teste aprovado ✓ Envio, leitura e exclusão funcionaram. Seus lançamentos reais continuaram somente locais.');
      window.dispatchEvent(new CustomEvent('meucontrole:canary-ok',{detail:{at:new Date().toISOString()}}));
    }catch(error){
      const code=error?.code||'';
      let text='O teste não foi concluído.';
      if(code==='permission-denied')text='O Firebase respondeu, mas as regras do Firestore ainda bloqueiam leitura/gravação. Isso é esperado se o banco continua no modo de produção padrão; nenhum lançamento real foi alterado.';
      else if(code==='unavailable')text='O Firestore ficou indisponível ou sem conexão durante o teste. Nenhum lançamento real foi alterado.';
      else text+=` ${error?.message||code||'Erro não identificado.'}`;
      result('warn',text);
      if(created){try{await deleteDoc(ref)}catch{}}
    }finally{
      btn.disabled=false;
      btn.textContent=original;
    }
  }

  window.MeuControleCanary={run,version:'0.2',safe:true};
  window.addEventListener('meucontrole:firebase-ready',()=>setTimeout(ensure,80));
  window.addEventListener('meucontrole:auth-changed',()=>setTimeout(ensure,80));
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-settings-detail="data"]')||e.target.closest('.mobile-settings-back'))setTimeout(ensure,100);
  });
  window.addEventListener('load',()=>{setTimeout(ensure,350);setTimeout(ensure,900)});
})();
