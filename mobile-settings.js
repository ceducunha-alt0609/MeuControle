/* MeuControle — central Mais / Configurações mobile */
(function(){
  const mq=window.matchMedia('(max-width:700px)');
  const page=document.getElementById('settingsPage');
  const shell=page?.querySelector('.settings-shell');
  const title=page?.querySelector('.settings-title');
  const grid=page?.querySelector('.settings-grid');
  if(!page||!shell||!title||!grid)return;

  const style=document.createElement('style');
  style.textContent=`
    .mobile-more-home,.mobile-settings-back,.mobile-app-notifications,.mobile-profile-choices{display:none}
    @media(max-width:700px){
      #settingsPage{height:auto!important;min-height:calc(100vh - 190px);overflow:visible!important}
      #settingsPage .settings-shell{max-width:none!important}
      #settingsPage .settings-title{margin:2px 0 16px!important}
      #settingsPage .settings-title h2{margin:0!important;font-size:25px!important}
      #settingsPage .settings-title p{margin:5px 0 0!important;font-size:13px!important;line-height:1.4!important}
      #settingsPage .settings-grid{display:none!important}
      #settingsPage.mobile-settings-detail .settings-grid{display:block!important}
      #settingsPage.mobile-settings-detail .settings-card{display:none!important}
      #settingsPage.mobile-settings-detail .settings-card.mobile-settings-active{display:block!important}
      #settingsPage.mobile-settings-detail .settings-title{display:none!important}
      .mobile-more-home{display:block!important}
      #settingsPage.mobile-settings-detail .mobile-more-home{display:none!important}
      .mobile-more-list{display:grid;grid-template-columns:1fr;gap:10px}
      .mobile-more-card{width:100%;min-height:82px;padding:14px 15px;border:1px solid #dfe6e1;border-radius:15px;background:#fff;color:var(--text);box-shadow:0 5px 16px rgba(0,0,0,.045);display:grid;grid-template-columns:46px minmax(0,1fr) 20px;gap:12px;align-items:center;text-align:left}
      .mobile-more-card:active{transform:scale(.99)}
      .mobile-more-icon{width:46px;height:46px;border-radius:13px;background:var(--primary-soft);color:var(--primary);display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;font-size:23px;font-weight:800}
      .mobile-more-copy strong{display:block;font-size:17px;line-height:1.2;color:#24352c}
      .mobile-more-copy small{display:block;margin-top:4px;color:#738078;font-size:11px;line-height:1.35;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .mobile-more-arrow{font-family:system-ui,sans-serif;font-size:24px;color:#9aa6a0;text-align:right}
      .mobile-settings-back{display:flex!important;align-items:center;width:max-content;margin:0 0 10px;padding:7px 4px;background:transparent!important;color:var(--primary)!important;font-size:13px}
      #settingsPage.mobile-settings-detail .settings-card.mobile-settings-active{padding:16px!important;border-radius:15px!important}
      #settingsPage.mobile-settings-detail .settings-card.mobile-settings-active>h3{font-size:22px!important;margin-bottom:5px!important}
      #settingsPage.mobile-settings-detail .settings-card.mobile-settings-active>p{font-size:13px!important;margin-bottom:14px!important}
      #settingsPage .mobile-profile-card{order:initial!important}
      #settingsPage .mobile-profile-card>label{display:none!important}
      #settingsPage .mobile-profile-card .mobile-profile-current{margin:13px 0 0!important;padding-top:12px;border-top:1px solid #e5ebe7;font-size:11px!important;line-height:1.45!important}
      .mobile-profile-choices{display:grid!important;grid-template-columns:1fr;gap:8px}
      .mobile-profile-choice{width:100%;min-height:52px;padding:11px 14px;border:1px solid #dfe6e1;border-radius:12px;background:#fff;color:#2b3c32;display:flex;align-items:center;justify-content:space-between;gap:12px;text-align:left;font-size:15px;font-weight:700}
      .mobile-profile-choice::after{content:"";width:22px;height:22px;flex:0 0 22px;border:2px solid #c7d1cc;border-radius:50%;box-sizing:border-box}
      .mobile-profile-choice.active{background:var(--primary-soft);border-color:rgba(var(--primary-rgb),.35);color:var(--primary)}
      .mobile-profile-choice.active::after{content:"✓";display:flex;align-items:center;justify-content:center;border-color:var(--primary);background:var(--primary);color:#fff;font-family:system-ui,sans-serif;font-size:13px;font-weight:900}

      /* Dados e segurança: ações equivalentes e backup automático mais compacto. */
      #settingsPage .mobile-data-card .settings-actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:9px!important}
      #settingsPage .mobile-data-card .settings-actions button{width:100%!important;min-width:0!important;min-height:48px!important;padding:10px 8px!important;font-size:14px!important;text-align:center!important}
      #settingsPage .mobile-data-card #importBackupBtn{background:var(--primary-soft)!important;color:var(--primary)!important;border:1px solid rgba(var(--primary-rgb),.24)!important}
      #settingsPage .mobile-data-card>.backup-status{margin-top:13px!important;padding-top:11px!important;font-size:11px!important}
      #settingsPage .mobile-data-card .auto-backup-box{margin-top:12px!important;padding-top:12px!important}
      #settingsPage .mobile-data-card .auto-backup-head{display:grid!important;grid-template-columns:1fr!important;gap:9px!important;align-items:stretch!important}
      #settingsPage .mobile-data-card .auto-backup-head>div{display:flex!important;flex-direction:row!important;justify-content:space-between!important;align-items:center!important;gap:10px!important}
      #settingsPage .mobile-data-card .auto-backup-head>div strong{font-size:17px!important}
      #settingsPage .mobile-data-card #autoBackupState{font-size:11px!important;white-space:nowrap!important}
      #settingsPage .mobile-data-card #viewAutoBackupsBtn{width:100%!important;min-height:44px!important;padding:9px 12px!important;font-size:13px!important;background:#eaf0ec!important;color:#31503e!important}
      #settingsPage .mobile-data-card .auto-backup-box>.backup-status{margin-top:9px!important;padding-top:9px!important;font-size:11px!important}
      #settingsPage .mobile-data-card .backup-status strong{text-align:right!important}

      .mobile-app-notifications{display:block!important;margin-top:16px;padding-top:15px;border-top:1px solid #e5ebe7}
      .mobile-app-notifications h4{margin:0 0 5px;font-size:16px}
      .mobile-app-notifications p{margin:0 0 10px!important;font-size:12px!important;color:#6d7a72!important}
      .mobile-notify-row{display:flex;align-items:center;justify-content:space-between;gap:10px}
      .mobile-notify-state{font-size:12px;font-weight:700;color:#647269}
      .mobile-notify-row button{flex:0 0 auto}
    }
  `;
  document.head.appendChild(style);

  const home=document.createElement('section');
  home.className='mobile-more-home';
  home.innerHTML=`
    <div class="mobile-more-list">
      <button type="button" class="mobile-more-card" data-more="profile"><span class="mobile-more-icon">◎</span><span class="mobile-more-copy"><strong>Perfil em uso</strong><small id="mobileMoreProfile">Todos</small></span><span class="mobile-more-arrow">›</span></button>
      <button type="button" class="mobile-more-card" data-more="data"><span class="mobile-more-icon">▣</span><span class="mobile-more-copy"><strong>Dados e segurança</strong><small id="mobileMoreData">Backups e restauração</small></span><span class="mobile-more-arrow">›</span></button>
      <button type="button" class="mobile-more-card" data-more="app"><span class="mobile-more-icon">▤</span><span class="mobile-more-copy"><strong>Aplicativo</strong><small id="mobileMoreApp">Instalação e notificações</small></span><span class="mobile-more-arrow">›</span></button>
      <button type="button" class="mobile-more-card" data-more="profiles"><span class="mobile-more-icon">♙</span><span class="mobile-more-copy"><strong>Perfis</strong><small id="mobileMoreProfiles">Perfis cadastrados</small></span><span class="mobile-more-arrow">›</span></button>
      <button type="button" class="mobile-more-card" data-more="appearance"><span class="mobile-more-icon">◐</span><span class="mobile-more-copy"><strong>Aparência</strong><small id="mobileMoreAppearance">Fonte e tema</small></span><span class="mobile-more-arrow">›</span></button>
    </div>`;
  title.after(home);

  const cards=()=>[...grid.querySelectorAll(':scope > .settings-card')];
  const findCard=kind=>{
    if(kind==='profile')return grid.querySelector('.mobile-profile-card');
    return cards().find(c=>{
      const h=c.querySelector('h3')?.textContent.trim().toLowerCase()||'';
      return kind==='data'?h.includes('dados e segurança'):kind==='app'?h==='aplicativo':kind==='profiles'?h==='perfis':kind==='appearance'?h==='aparência':false;
    });
  };
  findCard('data')?.classList.add('mobile-data-card');

  function ensureBack(card){
    if(card.querySelector('.mobile-settings-back'))return;
    const back=document.createElement('button');back.type='button';back.className='mobile-settings-back';back.textContent='‹ Voltar para Mais';back.onclick=openHome;card.insertBefore(back,card.firstChild);
  }
  function openHome(){
    if(!mq.matches)return;
    page.classList.remove('mobile-settings-detail');
    cards().forEach(c=>c.classList.remove('mobile-settings-active'));
    syncSummaries();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function openDetail(kind){
    if(!mq.matches)return;
    const card=findCard(kind);if(!card)return;
    cards().forEach(c=>c.classList.remove('mobile-settings-active'));
    ensureBack(card);card.classList.add('mobile-settings-active');page.classList.add('mobile-settings-detail');
    if(kind==='profile')ensureProfileChoices(card);
    if(kind==='app')ensureNotifications(card);
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function ensureProfileChoices(card){
    const source=document.getElementById('mobileProfileFilter')||document.getElementById('profileFilter');
    if(!source)return;
    let box=card.querySelector('.mobile-profile-choices');
    if(!box){box=document.createElement('div');box.className='mobile-profile-choices';const note=card.querySelector('.mobile-profile-current');card.insertBefore(box,note||null)}
    box.innerHTML='';
    [...source.options].forEach(opt=>{
      const btn=document.createElement('button');btn.type='button';btn.className='mobile-profile-choice';btn.dataset.value=opt.value;btn.textContent=opt.textContent;btn.classList.toggle('active',opt.value===source.value);
      btn.onclick=()=>{
        source.value=opt.value;
        source.dispatchEvent(new Event('change',{bubbles:true}));
        syncProfileChoices();syncSummaries();
      };
      box.appendChild(btn);
    });
  }
  function syncProfileChoices(){
    const source=document.getElementById('mobileProfileFilter')||document.getElementById('profileFilter');
    document.querySelectorAll('.mobile-profile-choice').forEach(btn=>btn.classList.toggle('active',btn.dataset.value===source?.value));
  }

  function notificationState(){
    if(!('Notification' in window))return'Indisponível neste navegador';
    if(Notification.permission==='granted')return'Ativas';
    if(Notification.permission==='denied')return'Bloqueadas no navegador';
    return'Desativadas';
  }
  function ensureNotifications(card){
    let box=card.querySelector('.mobile-app-notifications');
    if(!box){
      box=document.createElement('div');box.className='mobile-app-notifications';
      box.innerHTML='<h4>Notificações</h4><p>Receba os avisos definidos nos seus lançamentos.</p><div class="mobile-notify-row"><span class="mobile-notify-state"></span><button type="button" class="secondary-action">Ativar notificações</button></div>';
      card.appendChild(box);
      box.querySelector('button').onclick=()=>{document.getElementById('notifyBtn')?.click();setTimeout(()=>{syncNotify(box);syncSummaries()},350)};
    }
    syncNotify(box);
  }
  function syncNotify(box){
    const state=box.querySelector('.mobile-notify-state'),btn=box.querySelector('button');if(!state||!btn)return;
    state.textContent=notificationState();
    const granted='Notification' in window&&Notification.permission==='granted';
    btn.textContent=granted?'Notificações ativas':'Ativar notificações';btn.disabled=granted;
  }
  function syncSummaries(){
    const profile=document.getElementById('mobileProfileFilter')||document.getElementById('profileFilter');
    const profileText=profile?.selectedOptions?.[0]?.textContent||'Todos';
    const p=document.getElementById('mobileMoreProfile');if(p)p.textContent=profileText;
    const pc=document.getElementById('mobileMoreProfiles');if(pc){const n=grid.querySelectorAll('.profiles-list .profile-row').length;pc.textContent=`${n} perfil${n===1?'':'s'} cadastrado${n===1?'':'s'}`}
    const font=document.querySelector('[data-font].active')?.textContent.trim()||'Fonte';
    const theme=document.querySelector('[data-theme].active strong')?.textContent.trim()||'Tema';
    const ap=document.getElementById('mobileMoreAppearance');if(ap)ap.textContent=`${font} · ${theme}`;
    const app=document.getElementById('mobileMoreApp');if(app)app.textContent=`Instalação · Notificações ${notificationState().toLowerCase()}`;
    syncProfileChoices();
  }

  home.querySelectorAll('[data-more]').forEach(b=>b.onclick=()=>openDetail(b.dataset.more));
  document.querySelectorAll('.nav-btn[data-page="settings"]').forEach(btn=>btn.addEventListener('click',()=>{if(mq.matches)setTimeout(openHome,0)}));
  document.getElementById('mobileProfileFilter')?.addEventListener('change',syncSummaries);
  document.getElementById('profileFilter')?.addEventListener('change',syncSummaries);
  document.querySelectorAll('[data-theme],[data-font]').forEach(b=>b.addEventListener('click',()=>setTimeout(syncSummaries,0)));
  new MutationObserver(syncSummaries).observe(grid,{childList:true,subtree:true});
  mq.addEventListener?.('change',()=>{if(mq.matches)openHome();else page.classList.remove('mobile-settings-detail')});

  if(mq.matches){
    title.querySelector('h2').textContent='Mais';
    title.querySelector('p').textContent='Configurações e preferências.';
  }
  syncSummaries();
})();
