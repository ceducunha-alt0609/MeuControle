/* MeuControle — V1.031: acordeão mensal na lista mobile */
(()=>{
  if(window.__mcMobileMonthAccordionV103)return;window.__mcMobileMonthAccordionV103=true;
  const mq=matchMedia('(max-width:700px)');
  const list=document.getElementById('list');
  if(!list)return;
  let openKey='';let scheduled=false;

  function installStyle(){
    if(document.getElementById('mcMobileMonthAccordionV103Style'))return;
    const st=document.createElement('style');st.id='mcMobileMonthAccordionV103Style';st.textContent=`
      @media(max-width:700px){
        #launchesPage.mobile-launch-list .mobile-month-header{cursor:pointer;user-select:none;transition:background .14s ease,border-color .14s ease}
        #launchesPage.mobile-launch-list .mobile-month-header:active{transform:scale(.995)}
        #launchesPage.mobile-launch-list .mobile-month-header::after{content:'⌄';flex:0 0 auto;margin-left:3px;font:800 15px/1 system-ui,sans-serif;color:var(--primary);transition:transform .16s ease}
        #launchesPage.mobile-launch-list .mobile-month-header.mc-month-collapsed-v103::after{transform:rotate(-90deg)}
        #launchesPage.mobile-launch-list .mobile-month-header.mc-month-collapsed-v103{background:linear-gradient(90deg,rgba(var(--primary-rgb),.045),rgba(255,255,255,.86));border-left-color:rgba(var(--primary-rgb),.38)}
        #launchesPage.mobile-launch-list .mobile-month-header>span{margin-left:auto}
        #launchesPage.mobile-launch-list #list .item.mc-month-hidden-v103,
        #launchesPage.mobile-launch-list #list .mobile-done-header.mc-month-hidden-v103{display:none!important}
      }
    `;document.head.appendChild(st);
  }

  const keyFromItem=item=>{const m=(item?.querySelector('.meta')?.textContent||'').match(/\b\d{2}\/([0-9]{2})\/([0-9]{4})\b/);return m?`${m[2]}-${m[1]}`:''};
  const currentKey=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`};

  function groups(){
    const out=[];let current=null;
    [...list.children].forEach(el=>{
      if(el.classList?.contains('mobile-month-header')){current={header:el,items:[],key:''};out.push(current);return}
      if(current){current.items.push(el);if(!current.key&&el.classList?.contains('item'))current.key=keyFromItem(el)}
    });
    return out.filter(g=>g.key);
  }

  function apply(){
    scheduled=false;if(!mq.matches)return;
    const gs=groups();if(!gs.length)return;
    const available=new Set(gs.map(g=>g.key));
    if(!openKey||!available.has(openKey))openKey=available.has(currentKey())?currentKey():gs[0].key;
    gs.forEach(g=>{
      const open=g.key===openKey;
      g.header.classList.toggle('mc-month-collapsed-v103',!open);
      g.header.setAttribute('role','button');g.header.setAttribute('tabindex','0');g.header.setAttribute('aria-expanded',String(open));
      g.items.forEach(el=>el.classList.toggle('mc-month-hidden-v103',!open));
      if(!g.header.__mcAccordionBound){
        g.header.__mcAccordionBound=true;
        const toggle=()=>{openKey=g.key===openKey?'':g.key;if(!openKey){g.header.classList.add('mc-month-collapsed-v103');g.items.forEach(el=>el.classList.add('mc-month-hidden-v103'));g.header.setAttribute('aria-expanded','false');return}apply()};
        g.header.addEventListener('click',toggle);
        g.header.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
      }
    });
  }

  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(apply)}
  installStyle();
  new MutationObserver(schedule).observe(list,{childList:true});
  mq.addEventListener?.('change',()=>{if(mq.matches)schedule();else list.querySelectorAll('.mc-month-hidden-v103').forEach(el=>el.classList.remove('mc-month-hidden-v103'))});
  window.addEventListener('load',()=>setTimeout(schedule,650));
  document.addEventListener('click',e=>{if(e.target.closest('#launchesPage .tabs .tab'))setTimeout(schedule,40)},true);
  setTimeout(schedule,220);
  window.MeuControleMobileMonthAccordionV103={version:'1.031',refresh:schedule,open:key=>{openKey=key||'';schedule()}};
})();
