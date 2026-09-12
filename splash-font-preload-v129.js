/* Meu Controle — preload robusto da fonte manuscrita */
(()=>{
  if(window.__mcSplashAlluraPreload)return;
  window.__mcSplashAlluraPreload=true;
  try{
    if(!document.getElementById('mcSplashAlluraFont')){
      const pre1=document.createElement('link');pre1.rel='preconnect';pre1.href='https://fonts.googleapis.com';document.head.appendChild(pre1);
      const pre2=document.createElement('link');pre2.rel='preconnect';pre2.href='https://fonts.gstatic.com';pre2.crossOrigin='anonymous';document.head.appendChild(pre2);
      const link=document.createElement('link');link.id='mcSplashAlluraFont';link.rel='stylesheet';link.href='https://fonts.googleapis.com/css2?family=Allura&display=swap';document.head.appendChild(link);
    }
    if(document.fonts?.load) document.fonts.load('64px "Allura"').catch(()=>{});
  }catch{}
})();