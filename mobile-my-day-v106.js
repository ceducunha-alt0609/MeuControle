/* MeuControle — V1.06: destaque “Meu dia” no Painel mobile */
(()=>{
  if(window.__mcMobileMyDayV106)return;window.__mcMobileMyDayV106=true;
  import('./global-contrast-v107.js').catch(()=>{});
  const mq=matchMedia('(max-width:700px)');

  function installStyle(){
    if(document.getElementById('mcMobileMyDayV106Style'))return;
    const st=document.createElement('style');st.id='mcMobileMyDayV106Style';st.textContent=`
      @media(max-width:700px){
        #dashboardPage .premium-card.today-card{
          display:flex!important;
          flex-direction:column!important;
          justify-content:center!important;
          align-items:stretch!important;
          min-height:146px!important;
          padding:18px 20px!important;
        }
        #dashboardPage .premium-card.today-card .premium-label{
          display:flex!important;
          align-items:center!important;
          gap:5px!important;
          width:100%!important;
          margin:0 0 8px!important;
          color:var(--primary-dark)!important;
          font-size:15px!important;
          line-height:1.1!important;
          font-weight:800!important;
          text-align:left!important;
        }
        #dashboardPage .premium-card.today-card .premium-label::before{
          content:'☀';
          display:inline-block;
          color:#f3a900;
          font-family:system-ui,sans-serif;
          font-size:22px;
          line-height:1;
          font-weight:900;
          text-shadow:0 1px 0 rgba(167,105,0,.08);
          transform:translateY(-1px);
        }
        #dashboardPage .premium-card.today-card #dashTodayMain{
          display:block!important;
          width:100%!important;
          margin:1px 0 8px!important;
          color:var(--primary-dark)!important;
          font-size:48px!important;
          line-height:.95!important;
          font-weight:800!important;
          text-align:center!important;
        }
        #dashboardPage .premium-card.today-card #dashTodaySub{
          display:block!important;
          width:100%!important;
          margin:0!important;
          color:#728078!important;
          font-size:14px!important;
          line-height:1.25!important;
          font-weight:700!important;
          text-align:center!important;
        }
      }
    `;document.head.appendChild(st);
  }

  function refresh(){
    if(!mq.matches)return;
    const card=document.querySelector('#dashboardPage .premium-card.today-card');
    const label=card?.querySelector('.premium-label'),main=document.getElementById('dashTodayMain'),sub=document.getElementById('dashTodaySub');
    if(!card||!label||!main||!sub)return;
    label.textContent='Meu dia';
    const count=Number(String(main.textContent||'0').replace(/[^0-9-]/g,''))||0;
    sub.textContent=count===0?'Sem tarefas pra hoje':count===1?'Tarefa para hoje':'Tarefas para hoje';
  }

  function boot(){installStyle();refresh();
    const main=document.getElementById('dashTodayMain');
    if(main)new MutationObserver(refresh).observe(main,{childList:true,subtree:true,characterData:true});
    const page=document.getElementById('dashboardPage');
    if(page)new MutationObserver(()=>requestAnimationFrame(refresh)).observe(page,{childList:true,subtree:true});
    mq.addEventListener?.('change',refresh);
    document.querySelectorAll('.nav-btn[data-page="dashboard"]').forEach(b=>b.addEventListener('click',()=>setTimeout(refresh,30)));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('load',()=>setTimeout(refresh,450));
  window.MeuControleMobileMyDayV106={version:'1.06',refresh};
})();
