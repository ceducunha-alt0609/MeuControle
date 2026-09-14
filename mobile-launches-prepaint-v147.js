/* MeuControle — V1.47: revela Lançamentos mobile somente após restauração da navegação */
(()=>{
  if(window.__mcMobileLaunchesPrepaintV147)return;window.__mcMobileLaunchesPrepaintV147=true;
  const root=document.documentElement;
  function release(){
    if(!root.classList.contains('mc-mobile-launches-boot'))return;
    requestAnimationFrame(()=>requestAnimationFrame(()=>root.classList.remove('mc-mobile-launches-boot')));
  }
  window.addEventListener('meucontrole:app-ready',release,{once:true});
  window.addEventListener('load',()=>setTimeout(release,120),{once:true});
  setTimeout(release,1800);
})();
