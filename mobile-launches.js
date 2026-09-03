/* MeuControle — refinamentos mobile */
(function(){
  const mq=window.matchMedia('(max-width:700px)');
  const page=document.getElementById('launchesPage');
  const workspace=document.getElementById('workspace');
  const formPanel=document.getElementById('formPanel');
  const listPanel=workspace?.querySelector('.list-panel');
  if(!page||!workspace||!formPanel||!listPanel)return;

  const style=document.createElement('style');
  style.textContent=`
    .mobile-launch-home,.mobile-profile-card{display:none}
    @media(max-width:700px){
      .topbar-lower{padding:0!important;margin:0!important;background:transparent!important}
      .profile-filter-wrap{display:none!important}
      #launchesPage{height:auto!important;min-height:calc(100vh - 190px)}
      #launchesPage .workspace{display:none!important}
      #launchesPage.mobile-launch-form .workspace,
      #launchesPage.mobile-launch-list .workspace{display:block!important}
      #launchesPage.mobile-launch-form .list-panel,
      #launchesPage.mobile-launch-list .form-panel,
      #launchesPage.mobile-launch-form .splitter,
      #launchesPage.mobile-launch-list .splitter{display:none!important}
      #launchesPage.mobile-launch-form .form-panel,
      #launchesPage.mobile-launch-list .list-panel{width:100%!important;height:auto!important;min-height:0!important}
      #launchesPage.mobile-launch-form .form-panel{display:block!important;overflow:visible!important}
      #launchesPage.mobile-launch-list .list-panel{display:flex!important;min-height:520px!important}
      .mobile-launch-home{display:block;padding:2px 0 18px}
      #launchesPage.mobile-launch-form .mobile-launch-home,
      #launchesPage.mobile-launch-list .mobile-launch-home{display:none!important}
      .mobile-launch-title{margin:4px 0 5px;font-size:25px}
      .mobile-launch-subtitle{margin:0 0 16px;color:#6d7a72;font-size:13px;line-height:1.45}
      .mobile-launch-actions{display:grid;grid-template-columns:1fr;gap:12px}
      .mobile-launch-card{position:relative;overflow:hidden;min-height:132px;width:100%;padding:18px;border-radius:17px;background:#fff;color:var(--text);border:1px solid #dfe6e1;box-shadow:0 6px 18px rgba(0,0,0,.05);display:grid;grid-template-columns:52px 1fr 24px;gap:14px;align-items:center;text-align:left}
      .mobile-launch-card[data-mobile-launch="form"]::before{content:"";position:absolute;left:0;top:15px;bottom:15px;width:4px;border-radius:0 4px 4px 0;background:var(--primary)}
      .mobile-launch-card:active{transform:scale(.99)}
      .mobile-launch-icon{width:52px;height:52px;border-radius:15px;background:var(--primary-soft);color:var(--primary);display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;font-size:29px;font-weight:800}
      .mobile-launch-card strong{display:block;font-size:19px;color:#24352c}
      .mobile-launch-card small{display:block;margin-top:6px;color:#738078;font-size:12px;line-height:1.4;font-weight:500}
      .mobile-launch-arrow{font-family:system-ui,sans-serif;font-size:25px;color:#9aa6a0;text-align:right}
      .mobile-launch-back{display:flex!important;align-items:center;gap:7px;width:max-content;margin:0 0 10px;padding:7px 10px;background:transparent!important;color:var(--primary)!important;font-size:13px}
      #launchesPage .panel{border-radius:15px;padding:16px}
      .mobile-profile-card{display:block!important;order:-1}
      .mobile-profile-card label{font-size:13px;font-weight:800;color:#4c5c52}
      .mobile-profile-card select{height:48px;margin-top:9px;font-size:16px}
      .mobile-profile-current{margin-top:9px!important;margin-bottom:0!important;font-size:12px!important;color:#718078!important}

      /* Formulário mobile: pares compactos e ordem operacional. */
      #entryForm{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:12px 10px!important}
      #entryForm>label,.mobile-form-pair{min-width:0}
      #entryForm .span-2{grid-column:1/-1!important}
      #entryForm .mobile-profile-important{grid-column:1/-1!important;display:grid!important;grid-template-columns:minmax(0,1fr) 150px!important;gap:10px!important;align-items:end!important}
      #entryForm .mobile-profile-important .mobile-profile{grid-column:auto!important;min-width:0!important}
      #entryForm .mobile-profile-important .important-toggle{grid-column:auto!important;width:150px!important;height:48px!important;align-self:end!important;margin:0!important;padding:0 9px!important;border:1px solid #dfe6e1!important;border-radius:10px!important;background:#f8faf9!important;white-space:nowrap!important;display:flex!important;align-items:center!important;gap:7px!important}
      #entryForm .mobile-profile-important .important-toggle input{flex:0 0 auto!important}
      #entryForm .mobile-profile-important .important-toggle span{font-size:0!important}
      #entryForm .mobile-profile-important .important-toggle span::after{content:"☆ Importante";font-size:13px!important}
      #entryForm .mobile-type{grid-column:1/2!important}
      #entryForm .mobile-category{grid-column:2/3!important}
      #entryForm .mobile-category select{font-size:14px!important}
      #entryForm .mobile-date{grid-column:1/2!important}
      #entryForm .mobile-time{grid-column:2/3!important}
      #entryForm .mobile-recurrence{grid-column:1/2!important}
      #entryForm .mobile-remind{grid-column:2/3!important}
      #entryForm .mobile-value,#entryForm .mobile-description{grid-column:1/-1!important}
      #entryForm .businessday-toggle{grid-column:1/-1!important}
      #entryForm .recurrence-options{grid-column:1/-1!important}
      #entryForm .mobile-notes{grid-column:1/-1!important}
      #entryForm .mobile-actions{grid-column:1/-1!important}
    }
  `;
  document.head.appendChild(style);

  /* Perfil global: no mobile sai do cabeçalho e passa para Configurações. */
  const settingsGrid=document.querySelector('#settingsPage .settings-grid');
  const sourceProfile=document.getElementById('profileFilter');
  if(settingsGrid&&sourceProfile){
    const profileCard=document.createElement('article');
    profileCard.className='settings-card mobile-profile-card';
    profileCard.innerHTML=`<h3>Perfil em uso</h3><p>Escolha quais lançamentos deseja visualizar no aplicativo.</p><label>Exibir<select id="mobileProfileFilter" aria-label="Perfil em uso"></select></label><p class="mobile-profile-current">A escolha vale para Visão geral, consultas e Agenda.</p>`;
    settingsGrid.insertBefore(profileCard,settingsGrid.firstChild);
    const mobileSelect=profileCard.querySelector('#mobileProfileFilter');
    const syncMobileProfile=()=>{
      mobileSelect.innerHTML=sourceProfile.innerHTML;
      mobileSelect.value=sourceProfile.value;
    };
    syncMobileProfile();
    mobileSelect.onchange=()=>{
      sourceProfile.value=mobileSelect.value;
      sourceProfile.dispatchEvent(new Event('change',{bubbles:true}));
      syncMobileProfile();
    };
    sourceProfile.addEventListener('change',syncMobileProfile);
    const observer=new MutationObserver(syncMobileProfile);
    observer.observe(sourceProfile,{childList:true,subtree:true});
  }

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

  /* Reorganiza somente a apresentação mobile do formulário; ids e lógica permanecem intactos. */
  const form=document.getElementById('entryForm');
  if(form){
    const labelOf=id=>document.getElementById(id)?.closest('label');
    const profile=labelOf('profile'),type=labelOf('type'),category=labelOf('category'),value=labelOf('value'),description=labelOf('description'),date=labelOf('date'),time=labelOf('time'),business=labelOf('useBusinessDay'),businessInfo=document.getElementById('businessDayInfo'),recurrence=labelOf('recurrence'),remind=labelOf('remind'),recurrenceOptions=document.getElementById('recurrenceOptions'),important=labelOf('important'),notes=labelOf('notes'),actions=form.querySelector('.actions');
    if(profile&&type&&category&&value&&description&&date&&time&&business&&recurrence&&remind&&important&&notes&&actions){
      profile.classList.add('mobile-profile');type.classList.add('mobile-type');category.classList.add('mobile-category');value.classList.add('mobile-value');description.classList.add('mobile-description');date.classList.add('mobile-date');time.classList.add('mobile-time');recurrence.classList.add('mobile-recurrence');remind.classList.add('mobile-remind');notes.classList.add('mobile-notes');actions.classList.add('mobile-actions');
      const profileImportant=document.createElement('div');profileImportant.className='mobile-profile-important';
      profile.before(profileImportant);profileImportant.append(profile,important);
      [type,category,date,time,value,description,business,businessInfo,recurrence,remind,recurrenceOptions,notes,actions].forEach(el=>el&&form.appendChild(el));
    }
  }

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
  home.querySelector('[data-mobile-launch="form"]').onclick=()=>{
    document.getElementById('clearBtn')?.click();
    openMode('form');
  };
  home.querySelector('[data-mobile-launch="list"]').onclick=()=>openMode('list');

  const originalShowPage=window.showPage;
  if(typeof originalShowPage==='function'){
    window.showPage=function(target){
      originalShowPage(target);
      if(target==='launches'&&mq.matches){
        if(formPanel.classList.contains('editing'))openMode('form');else openHome();
      }
    };
  }

  document.querySelectorAll('.nav-btn[data-page="launches"]').forEach(btn=>{
    btn.addEventListener('click',()=>{if(mq.matches)setTimeout(openHome,0)});
  });

  mq.addEventListener?.('change',()=>{if(!mq.matches)clearMode()});
})();
