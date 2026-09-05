/* Meu Controle — preserva navegação e contexto entre atualizações */
(function(){
  const KEY='meu_controle_nav_state_v2';
  const validPages=new Set(['dashboard','launches','calendar','settings']);
  let restoring=true;

  function readState(){
    try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{return{}}
  }
  function writeState(patch={}){
    const next={...readState(),...patch,updatedAt:new Date().toISOString()};
    try{localStorage.setItem(KEY,JSON.stringify(next))}catch{}
  }
  function reveal(){document.documentElement.classList.remove('nav-restore-pending')}
  function visiblePage(){
    for(const p of validPages){
      const el=document.getElementById(p+'Page');
      if(el&&!el.classList.contains('hidden'))return p;
    }
    return'dashboard';
  }
  function launchMode(){
    const page=document.getElementById('launchesPage');
    if(!page)return'home';
    if(page.classList.contains('mobile-launch-form'))return'form';
    if(page.classList.contains('mobile-launch-list'))return'list';
    return'home';
  }
  function settingsDetail(){
    const page=document.getElementById('settingsPage');
    if(!page?.classList.contains('mobile-settings-detail'))return'home';
    const card=page.querySelector('.settings-card.mobile-settings-active');
    if(!card)return'home';
    if(card.classList.contains('mobile-profile-card'))return'profile';
    const h=card.querySelector('h3')?.textContent.trim().toLowerCase()||'';
    if(h.includes('dados e segurança'))return'data';
    if(h==='aplicativo')return'app';
    if(h==='perfis')return'profiles';
    if(h==='aparência')return'appearance';
    return'home';
  }
  function monthFromLabel(id){
    const text=document.getElementById(id)?.textContent.trim()||'';
    const names=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const m=text.match(/^(.+)\s+(\d{4})$/);
    if(!m)return null;
    const month=names.indexOf(m[1]);
    return month<0?null:{month,year:Number(m[2])};
  }
  function saveContext(forcedPage){
    if(restoring)return;
    const page=validPages.has(forcedPage)?forcedPage:visiblePage();
    const patch={page,windowScrollY:window.scrollY||0};
    const listScroll=document.querySelector('#launchesPage .list-scroll');
    if(listScroll)patch.launchListScrollTop=listScroll.scrollTop||0;
    if(page==='launches'){
      patch.launchMode=launchMode();
      const activeTab=document.querySelector('#launchesPage .tab.active');
      if(activeTab?.dataset.filter)patch.launchFilter=activeTab.dataset.filter;
    }
    if(page==='settings')patch.settingsDetail=settingsDetail();
    const dash=monthFromLabel('dashMonthLabel');
    if(dash){patch.dashboardMonth=dash.month;patch.dashboardYear=dash.year}
    const cal=monthFromLabel('calendarMonthTitle');
    if(cal){patch.calendarMonth=cal.month;patch.calendarYear=cal.year}
    writeState(patch);
  }

  document.addEventListener('click',e=>{
    const nav=e.target.closest('.nav-btn[data-page]');
    if(nav&&validPages.has(nav.dataset.page)){
      writeState({page:nav.dataset.page});
      setTimeout(()=>saveContext(nav.dataset.page),80);
      return;
    }
    if(e.target.closest('.mobile-launch-card,.mobile-launch-back,.mobile-settings-back,.mobile-more-card,.tab,#dashPrevMonth,#dashNextMonth,#calendarPrevYear,#calendarNextYear,.calendar-month-btn,.mobile-month-slot,.mobile-dashboard-month-slot')){
      setTimeout(()=>saveContext(),100);
    }
  },true);

  function activatePage(page){
    ['dashboard','launches','calendar','settings'].forEach(p=>{
      document.getElementById(p+'Page')?.classList.toggle('hidden',p!==page);
    });
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
    if(page==='settings'&&typeof updateLastBackupLabel==='function')updateLastBackupLabel();
  }

  function restoreMonths(state){
    const clickUntil=(button,read,target,max=30)=>{
      let guard=0;
      while(guard++<max){
        const cur=read();
        if(!cur||cur.year===target.year&&cur.month===target.month)break;
        const diff=(target.year*12+target.month)-(cur.year*12+cur.month);
        (diff>0?button.next:button.prev)?.click();
      }
    };
    const parse=id=>monthFromLabel(id);
    if(Number.isInteger(state.dashboardMonth)&&Number.isInteger(state.dashboardYear)){
      clickUntil({prev:document.getElementById('dashPrevMonth'),next:document.getElementById('dashNextMonth')},()=>parse('dashMonthLabel'),{month:state.dashboardMonth,year:state.dashboardYear});
    }
    if(Number.isInteger(state.calendarMonth)&&Number.isInteger(state.calendarYear)){
      const current=parse('calendarMonthTitle');
      if(current){
        let guard=0;
        while(current&&current.year!==state.calendarYear&&guard++<15){
          (state.calendarYear>current.year?document.getElementById('calendarNextYear'):document.getElementById('calendarPrevYear'))?.click();
          const newer=parse('calendarMonthTitle');
          if(newer)Object.assign(current,newer);
        }
        const names=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
        [...document.querySelectorAll('#calendarMonths .calendar-month-btn')].find(b=>b.querySelector('span')?.textContent===names[state.calendarMonth])?.click();
      }
    }
  }

  function restoreDetails(state,page){
    if(page==='launches'&&state.launchFilter){
      document.querySelector(`#launchesPage .tab[data-filter="${state.launchFilter}"]`)?.click();
    }
    if(matchMedia('(max-width:700px)').matches){
      if(page==='launches'){
        const lp=document.getElementById('launchesPage');
        lp?.classList.remove('mobile-launch-form','mobile-launch-list');
        if(state.launchMode==='form')lp?.classList.add('mobile-launch-form');
        if(state.launchMode==='list')lp?.classList.add('mobile-launch-list');
      }
      if(page==='settings'&&state.settingsDetail&&state.settingsDetail!=='home'){
        document.querySelector(`.mobile-more-card[data-more="${state.settingsDetail}"]`)?.click();
      }
    }
  }

  function restoreScroll(state,page){
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if(page==='launches'&&Number.isFinite(state.launchListScrollTop)){
        const listScroll=document.querySelector('#launchesPage .list-scroll');
        if(listScroll)listScroll.scrollTop=state.launchListScrollTop;
      }
      if(Number.isFinite(state.windowScrollY))window.scrollTo(0,state.windowScrollY);
    }));
  }

  function restore(){
    const state=readState();
    const page=validPages.has(state.page)?state.page:'dashboard';
    activatePage(page);
    restoreMonths(state);
    restoreDetails(state,page);
    restoreScroll(state,page);
    reveal();
  }

  window.addEventListener('load',()=>{
    setTimeout(()=>{restore();restoring=false;saveContext();},120);
    setTimeout(()=>{restore();saveContext();},450);
  });
  /* Segurança: nunca deixa a interface escondida se algo externo falhar. */
  setTimeout(reveal,1400);
  window.addEventListener('pagehide',()=>saveContext());
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')saveContext()});
})();