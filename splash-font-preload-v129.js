/* Meu Controle — preload robusto da fonte manuscrita + trava de primeiro paint */
(()=>{
  if(window.__mcSplashAlluraPreload)return;
  window.__mcSplashAlluraPreload=true;
  try{
    /* Este arquivo é o primeiro script do body. Ele arma as travas de prepaint antes
       dos módulos visuais tardios, usando a última tela salva para não esconder áreas
       que não serão exibidas. */
    let savedPage='dashboard';
    try{
      const nav=JSON.parse(localStorage.getItem('meu_controle_nav_state_v2')||'{}');
      if(nav?.page)savedPage=nav.page;
    }catch{}

    if(matchMedia('(max-width:700px)').matches&&savedPage==='dashboard'){
      document.documentElement.classList.add('mc-mobile-home-boot');
      if(!document.getElementById('mcMobileHomeBootStyle')){
        const boot=document.createElement('style');
        boot.id='mcMobileHomeBootStyle';
        boot.textContent='@media(max-width:700px){html.mc-mobile-home-boot #dashboardPage{visibility:hidden!important}}';
        document.head.appendChild(boot);
      }
      /* Fail-safe: nunca deixa a Home escondida se algum módulo externo falhar. */
      setTimeout(()=>document.documentElement.classList.remove('mc-mobile-home-boot'),1800);
    }

    if(matchMedia('(min-width:701px)').matches&&savedPage==='calendar'){
      document.documentElement.classList.add('mc-desktop-calendar-boot');
      if(!document.getElementById('mcDesktopCalendarBootStyle')){
        const boot=document.createElement('style');
        boot.id='mcDesktopCalendarBootStyle';
        boot.textContent='@media(min-width:701px){html.mc-desktop-calendar-boot #calendarPage .calendar-layout{visibility:hidden!important}}';
        document.head.appendChild(boot);
      }
      /* O desktop-calendar-prepaint-v138 libera assim que o board atual v124 existe. */
      setTimeout(()=>document.documentElement.classList.remove('mc-desktop-calendar-boot'),1800);
    }

    if(!document.getElementById('mcSplashAlluraFont')){
      const pre1=document.createElement('link');pre1.rel='preconnect';pre1.href='https://fonts.googleapis.com';document.head.appendChild(pre1);
      const pre2=document.createElement('link');pre2.rel='preconnect';pre2.href='https://fonts.gstatic.com';pre2.crossOrigin='anonymous';document.head.appendChild(pre2);
      const link=document.createElement('link');link.id='mcSplashAlluraFont';link.rel='stylesheet';link.href='https://fonts.googleapis.com/css2?family=Allura&display=swap';document.head.appendChild(link);
    }
    if(document.fonts?.load) document.fonts.load('64px "Allura"').catch(()=>{});
  }catch{}
})();