/* Meu Controle — V1.39: libera a Home somente depois do shell atual estar pronto */
(()=>{
  if(window.__mcDashboardReadyV139)return;window.__mcDashboardReadyV139=true;
  const html=document.documentElement;
  const readSavedPage=()=>{try{return JSON.parse(localStorage.getItem('meu_controle_nav_state_v2')||'{}')?.page||'dashboard'}catch{return'dashboard'}};
  const savedPage=readSavedPage();
  if(savedPage!=='dashboard'){html.classList.remove('mc-dashboard-shell-boot');return}
  const mobile=()=>matchMedia('(max-width:700px)').matches;
  function currentOrderReady(){
    const grid=document.querySelector('#dashboardPage .premium-cards');if(!grid)return false;
    const order=[...grid.querySelectorAll(':scope > .premium-card')].map(el=>el.dataset.dash).filter(Boolean);
    return order.join('|')==='month|important|today|expenses|late';
  }
  function todayReady(){
    const label=document.querySelector('#dashboardPage .premium-card[data-dash="today"] .premium-label');
    const text=(label?.textContent||'').trim().toLowerCase();
    return text.includes('meu dia');
  }
  function centralReady(){return !!document.querySelector('#dashboardPage .central-hoje-v041')}
  function topbarReady(){
    if(mobile())return getComputedStyle(document.querySelector('.profile-filter-wrap')||document.body).display==='none';
    return !!document.querySelector('.desktop-top-tools-v139')&&getComputedStyle(document.querySelector('.profile-filter-wrap')).display==='none';
  }
  function ready(){
    if(mobile())return todayReady()&&centralReady()&&topbarReady();
    return currentOrderReady()&&todayReady()&&centralReady()&&topbarReady();
  }
  let released=false;
  function release(){
    if(released)return;released=true;
    html.dataset.mcAppReady='1';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      html.classList.remove('mc-dashboard-shell-boot','mc-dashboard-boot','mc-mobile-home-boot');
    }));
  }
  function wait(){if(ready()){release();return}requestAnimationFrame(wait)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
  setTimeout(release,1800);
})();