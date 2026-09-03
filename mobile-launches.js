/* MeuControle — central mobile de lançamentos */
(function(){
  const mq=window.matchMedia('(max-width:700px)');
  const page=document.getElementById('launchesPage');
  const workspace=document.getElementById('workspace');
  const formPanel=document.getElementById('formPanel');
  const listPanel=workspace?.querySelector('.list-panel');
  if(!page||!workspace||!formPanel||!listPanel)return;

  const style=document.createElement('style');
  style.textContent=`
    .mobile-launch-home{display:none}
    @media(max-width:700px){
      #launchesPage{height:auto!important;min-height:calc(100vh - 190px)}
      #launchesPage .workspace{display:none!important}
      #launchesPage.mobile-launch-form .workspace,
      #launchesPage.mobile-launch-list .workspace{display:block!important}
      #launchesPage.mobile-launch-form .list-panel,
      #launchesPage.mobile-launch-list .form-panel,
      #launchesPage.mobile-launch-form .splitter,
      #launchesPage.mobile-launch-list .splitter{display:none!important}
      #launchesPage.mobile-launch-form .form-panel,
      #launchesPage.mobile-launch-list .list-panel{display:flex!important;width:100%!important;height:auto!important;min-height:0!important}
      #launchesPage.mobile-launch-form .form-panel{display:block!important;overflow:visible!important}
      #launchesPage.mobile-launch-list .list-panel{min-height:520px!important}
      .mobile-launch-home{display:block;padding:2px 0 18px}
      #launchesPage.mobile-launch-form .mobile-launch-home,
      #launchesPage.mobile-launch-list .mobile-launch-home{display:none!important}
      .mobile-launch-title{margin:4px 0 5px;font-size:25px}
      .mobile-launch-subtitle{margin:0 0 16px;color:#6d7a72;font-size:13px;line-height:1.45}
      .mobile-launch-actions{display:grid;grid-template-columns:1fr;gap:12px}
      .mobile-launch-card{min-height:132px;width:100%;padding:18px;border-radius:17px;background:#fff;color:var(--text);border:1px solid #dfe6e1;box-shadow:0 6px 18px rgba(0,0,0,.05);display:grid;grid-template-columns:52px 1fr 24px;gap:14px;align-items:center;text-align:left}
      .mobile-launch-card:active{transform:scale(.99)}
      .mobile-launch-icon{width:52px;height:52px;border-radius:15px;background:var(--primary-soft);color:var(--primary);display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;font-size:29px;font-weight:800}
      .mobile-launch-card strong{display:block;font-size:19px;color:#24352c}
      .mobile-launch-card small{display:block;margin-top:6px;color:#738078;font-size:12px;line-height:1.4;font-weight:500}
      .mobile-launch-arrow{font-family:system-ui,sans-serif;font-size:25px;color:#9aa6a0;text-align:right}
      .mobile-launch-back{display:flex!important;align-items:center;gap:7px;width:max-content;margin:0 0 10px;padding:7px 10px;background:transparent!important;color:var(--primary)!important;font-size:13px}
      #launchesPage .panel{border-radius:15px;padding:16px}
    }
  `;
  document.head.appendChild(style);

  const home=document.createElement('section');
  home.className='mobile-launch-home';
  home.innerHTML=`
    <h2 class="mobile-launch-title">Lançamentos</h2>
    <p class="mobile-launch-subtitle">O que você quer fazer?</p>
    <div class="mobile-launch-actions">
      <button type="button" class="mobile-launch-card" data-mobile-launch="form">
        <span class="mobile-launch-icon">＋</span>
        <span><strong>Novo lançamento</strong><small>Registrar despesa, compromisso, consulta ou lembrete.</small></span>
        <span class="mobile-launch-arrow">›</span>
      </button>
      <button type="button" class="mobile-launch-card" data-mobile-launch="list">
        <span class="mobile-launch-icon">☰</span>
        <span><strong>Consultar lançamentos</strong><small>Pesquisar, filtrar, editar, concluir ou excluir registros.</small></span>
        <span class="mobile-launch-arrow">›</span>
      </button>
    </div>`;
  page.insertBefore(home,workspace);

  function makeBack(){
    const b=document.createElement('button');
    b.type='button';b.className='mobile-launch-back';b.innerHTML='‹ Voltar para Lançamentos';
    b.onclick=()=>openHome();
    return b;
  }
  formPanel.insertBefore(makeBack(),formPanel.firstChild);
  listPanel.insertBefore(makeBack(),listPanel.firstChild);

  function clearMode(){page.classList.remove('mobile-launch-form','mobile-launch-list')}
  function openHome(){if(!mq.matches)return;clearMode();window.scrollTo({top:0,behavior:'smooth'})}
  function openMode(mode){
    if(!mq.matches)return;
    clearMode();page.classList.add(mode==='list'?'mobile-launch-list':'mobile-launch-form');
    window.scrollTo({top:0,behavior:'smooth'});
  }
  home.querySelector('[data-mobile-launch="form"]').onclick=()=>{if(typeof resetForm==='function')resetForm();openMode('form')};
  home.querySelector('[data-mobile-launch="list"]').onclick=()=>openMode('list');

  const originalShowPage=window.showPage;
  if(typeof originalShowPage==='function'){
    window.showPage=function(target){
      originalShowPage(target);
      if(target==='launches'&&mq.matches){
        if(window.editingId)openMode('form');else openHome();
      }
    };
  }

  document.querySelectorAll('.nav-btn[data-page="launches"]').forEach(btn=>{
    btn.addEventListener('click',()=>{if(mq.matches)setTimeout(openHome,0)});
  });

  mq.addEventListener?.('change',()=>{if(!mq.matches)clearMode()});
})();
