/* MeuControle — V1.38.3: Home mobile + card A receber */
(()=>{
  if(window.__mcMobileHomePrepaintV138)return;window.__mcMobileHomePrepaintV138=true;
  if(!matchMedia('(max-width:700px)').matches)return;
  import('./mobile-receivables-v167.js').catch(()=>{});

  const style=document.createElement('style');
  style.id='mcMobileHomePrepaintV138Style';
  style.textContent=`
    @media(max-width:700px){
      #dashboardPage .premium-card.today-card{display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:stretch!important;min-height:146px!important;padding:18px 20px!important}
      #dashboardPage .premium-card.today-card .premium-label{display:flex!important;align-items:center!important;gap:5px!important;width:100%!important;margin:0 0 8px!important;color:var(--primary-dark)!important;font-size:15px!important;line-height:1.1!important;font-weight:800!important;text-align:left!important}
      #dashboardPage .premium-card.today-card .premium-label::before{content:'☀';display:inline-block;color:#f3a900;font-family:system-ui,sans-serif;font-size:22px;line-height:1;font-weight:900;text-shadow:0 1px 0 rgba(167,105,0,.08);transform:translateY(-1px)}
      #dashboardPage .premium-card.today-card #dashTodayMain{display:block!important;width:100%!important;margin:1px 0 8px!important;color:var(--primary-dark)!important;font-size:48px!important;line-height:.95!important;font-weight:800!important;text-align:center!important}
      #dashboardPage .premium-card.today-card #dashTodaySub{display:block!important;width:100%!important;margin:0!important;color:#728078!important;font-size:14px!important;line-height:1.25!important;font-weight:700!important;text-align:center!important}
    }
  `;
  document.head.appendChild(style);

  const apply=()=>{const label=document.querySelector('#dashboardPage .premium-card.today-card .premium-label'),main=document.getElementById('dashTodayMain'),sub=document.getElementById('dashTodaySub');if(label)label.textContent='Meu dia';if(main&&sub){const count=Number(String(main.textContent||'0').replace(/[^0-9-]/g,''))||0;sub.textContent=count===0?'Sem tarefas pra hoje':count===1?'Tarefa para hoje':'Tarefas para hoje'}};
  const reveal=()=>{apply();requestAnimationFrame(()=>requestAnimationFrame(()=>document.documentElement.classList.remove('mc-mobile-home-boot','mc-dashboard-boot')))};
  apply();queueMicrotask(apply);
  const started=performance.now();
  const waitReady=()=>{const myDayReady=!!window.__mcMobileMyDayV106,centralReady=!!window.__meuControleCentralHojeV041Loaded;if(myDayReady&&centralReady){reveal();return}if(performance.now()-started>1200){reveal();return}setTimeout(waitReady,16)};
  waitReady();
})();