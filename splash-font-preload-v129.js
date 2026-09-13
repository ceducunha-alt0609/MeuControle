/* Meu Controle — preload robusto da fonte + tema/prepaint antes do primeiro paint */
(()=>{
  if(window.__mcSplashAlluraPreload)return;
  window.__mcSplashAlluraPreload=true;
  try{
    /* Este é o primeiro script do body. Resolve tema e tela salva antes do primeiro paint. */
    let savedPage='dashboard';
    try{
      const nav=JSON.parse(localStorage.getItem('meu_controle_nav_state_v2')||'{}');
      if(nav?.page)savedPage=nav.page;
    }catch{}

    /* Tema crítico: evita o flash branco antes do appearance-mode-v130 assumir. */
    try{
      const mode=localStorage.getItem('meu_controle_color_mode_v1')||'auto';
      const dark=mode==='dark'||(mode==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);
      if(dark){
        document.documentElement.classList.add('mc-pre-dark');
        document.documentElement.style.colorScheme='dark';
        document.body?.classList.add('mc-dark');
        const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content='#10171c';
        if(!document.getElementById('mcCriticalDarkPrepaint')){
          const critical=document.createElement('style');
          critical.id='mcCriticalDarkPrepaint';
          critical.textContent='html.mc-pre-dark,html.mc-pre-dark body{background:#10171c!important;color:#e7edf1;color-scheme:dark}html.mc-pre-dark .container{background:#10171c}';
          document.head.appendChild(critical);
        }
      }
    }catch{}

    /* Home: nunca deixa a disposição-base dos cards chegar à tela. */
    if(savedPage==='dashboard'){
      document.documentElement.classList.add('mc-dashboard-boot');
      if(!document.getElementById('mcDashboardBootStyle')){
        const boot=document.createElement('style');
        boot.id='mcDashboardBootStyle';
        boot.textContent='html.mc-dashboard-boot #dashboardPage{visibility:hidden!important}';
        document.head.appendChild(boot);
      }
      setTimeout(()=>document.documentElement.classList.remove('mc-dashboard-boot'),1800);
    }

    if(matchMedia('(max-width:700px)').matches&&savedPage==='dashboard'){
      document.documentElement.classList.add('mc-mobile-home-boot');
      if(!document.getElementById('mcMobileHomeBootStyle')){
        const boot=document.createElement('style');
        boot.id='mcMobileHomeBootStyle';
        boot.textContent='@media(max-width:700px){html.mc-mobile-home-boot #dashboardPage{visibility:hidden!important}}';
        document.head.appendChild(boot);
      }
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
      setTimeout(()=>document.documentElement.classList.remove('mc-desktop-calendar-boot'),1800);
    }

    if(!document.getElementById('mcSplashAlluraFont')){
      const pre1=document.createElement('link');pre1.rel='preconnect';pre1.href='https://fonts.googleapis.com';document.head.appendChild(pre1);
      const pre2=document.createElement('link');pre2.rel='preconnect';pre2.href='https://fonts.gstatic.com';pre2.crossOrigin='anonymous';document.head.appendChild(pre2);
      const link=document.createElement('link');link.id='mcSplashAlluraFont';link.rel='stylesheet';link.href='https://fonts.googleapis.com/css2?family=Allura&display=swap';document.head.appendChild(link);
    }
    if(document.fonts?.load)document.fonts.load('64px "Allura"').catch(()=>{});
  }catch{}
})();