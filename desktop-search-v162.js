/* MeuControle — Pesquisa Global Desktop V1.0 */
(()=>{
  if(window.__mcDesktopSearchV162)return;window.__mcDesktopSearchV162=true;
  const desktop=()=>matchMedia('(min-width:701px)').matches;
  const install=()=>{
    if(document.getElementById('mcDesktopSearchV162Style'))return;
    const st=document.createElement('style');st.id='mcDesktopSearchV162Style';st.textContent=`
      @media(min-width:701px){
        .mc-search-results{background:rgba(18,35,46,.42)!important;backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);padding:42px 24px 80px!important;display:flex!important;flex-direction:column!important;align-items:center!important}
        .mc-search-results[hidden]{display:none!important}
        .mc-search-head{position:relative!important;top:auto!important;width:min(920px,calc(100vw - 48px))!important;box-sizing:border-box!important;border:1px solid #d9e2de!important;border-radius:20px 20px 0 0!important;padding:20px 24px 18px!important;box-shadow:0 20px 60px rgba(15,35,45,.18)!important}
        .mc-search-headrow,.mc-search-input-wrap{max-width:none!important}
        .mc-search-input-wrap{display:block!important;margin-top:15px!important}
        .mc-search-input{height:52px!important;font-size:17px!important}
        .mc-search-list{width:min(920px,calc(100vw - 48px))!important;max-width:none!important;box-sizing:border-box!important;margin:0!important;padding:18px 22px 26px!important;background:#f6f8f7!important;border:1px solid #d9e2de!important;border-top:0!important;border-radius:0 0 20px 20px!important;box-shadow:0 26px 60px rgba(15,35,45,.22)!important;max-height:calc(100vh - 230px)!important;overflow:auto!important}
        .mc-search-row{grid-template-columns:32px minmax(0,1fr) auto!important;padding:14px 17px!important}
        .mc-search-copy{grid-column:2!important;padding-right:18px!important}
        .mc-search-value{grid-column:3!important;grid-row:1!important;align-self:center!important;margin:0!important;min-width:125px!important;font-size:17px!important;text-align:right!important}
        .mc-search-empty{background:#fff;border-radius:14px}
        .mc-search-sheet-backdrop{z-index:2360!important}.mc-search-actions{max-width:860px!important}
        body.mc-dark .mc-search-list{background:#152128!important;border-color:#40505a!important}
      }
    `;document.head.appendChild(st);
  };
  const bind=()=>{
    const search=document.getElementById('globalSearch');if(!search||search.__mcDesktopDedicatedBound)return;search.__mcDesktopDedicatedBound=true;
    const open=e=>{if(!desktop())return;e.preventDefault();e.stopImmediatePropagation();search.blur();window.MeuControleSearchBatch?.open?.(search.value||'')};
    search.addEventListener('pointerdown',open,true);
    search.addEventListener('focus',open,true);
  };
  const boot=()=>{install();bind()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  setTimeout(boot,300);
})();