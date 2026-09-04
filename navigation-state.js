/* Meu Controle — preserva navegação e contexto entre atualizações */
(function(){
  const KEY='meu_controle_nav_state_v1';
  const validPages=new Set(['dashboard','launches','calendar','settings']);
  let restoring=false;

  function readState(){
    try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{return{}}
  }
  function writeState(patch={}){
    if(restoring)return;
    const next={...readState(),...patch,updatedAt:new Date().toISOString()};
    try{localStorage.setItem(KEY,JSON.stringify(next))}catch{}
  }
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
  function saveContext(){
    const page=visiblePage();
    const patch={page};
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

  /* Registra trocas de tela feitas por qualquer parte do app. */
  const originalShowPage=window.showPage;
  if(typeof originalShowPage==='function'){
    window.showPage=function(page){
      const result=originalShowPage.apply(this,arguments);
      if(validPages.has(page))setTimeout(saveContext,0);
      return result;
    };
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('.nav-btn,.mobile-launch-card,.mobile-launch-back,.mobile-settings-back,.mobile-more-card,.tab,#dashPrevMonth,#dashNextMonth,#calendarPrevYear,#calendarNextYear,.calendar-month-btn,.mobile-month-slot,.mobile-dashboard-month-slot')){
      setTimeout(saveContext,40);
    }
  },true);

  const watched=['launchesPage','settingsPage','dashMonthLabel','calendarMonthTitle'];
  watched.forEach(id=>{
    const el=document.getElementById(id);if(!el)return;
    new MutationObserver(()=>setTimeout(saveContext,0)).observe(el,{attributes:true,attributeFilter:['class'],childList:true,subtree:true,characterData:true});
  });

  function restore(){
    const state=readState();
    const page=validPages.has(state.page)?state.page:'dashboard';
    restoring=true;
    try{
      if(Number.isInteger(state.dashboardMonth)&&Number.isInteger(state.dashboardYear)&&typeof dashboardMonth!=='undefined'&&typeof dashboardYear!=='undefined'){
        dashboardMonth=state.dashboardMonth;dashboardYear=state.dashboardYear;
        if(typeof renderDashboard==='function')renderDashboard();
      }
      if(Number.isInteger(state.calendarMonth)&&Number.isInteger(state.calendarYear)&&typeof calendarMonth!=='undefined'&&typeof calendarYear!=='undefined'){
        calendarMonth=state.calendarMonth;calendarYear=state.calendarYear;
        if(typeof renderCalendar==='function')renderCalendar();
      }
      if(typeof window.showPage==='function')window.showPage(page);

      if(page==='launches'&&matchMedia('(max-width:700px)').matches){
        const lp=document.getElementById('launchesPage');
        lp?.classList.remove('mobile-launch-form','mobile-launch-list');
        if(state.launchMode==='form')lp?.classList.add('mobile-launch-form');
        if(state.launchMode==='list')lp?.classList.add('mobile-launch-list');
        if(state.launchMode==='list'&&state.launchFilter){
          document.querySelector(`#launchesPage .tab[data-filter="${state.launchFilter}"]`)?.click();
        }
      }
      if(page==='settings'&&matchMedia('(max-width:700px)').matches&&state.settingsDetail&&state.settingsDetail!=='home'){
        document.querySelector(`.mobile-more-card[data-more="${state.settingsDetail}"]`)?.click();
      }
    }finally{
      setTimeout(()=>{restoring=false;saveContext()},120);
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(restore,80));
  else setTimeout(restore,80);
  window.addEventListener('pagehide',saveContext);
})();
