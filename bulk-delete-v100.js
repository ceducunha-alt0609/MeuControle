/* MeuControle — ponte V1.08: pesquisa em lote + pesquisa dedicada desktop + observações da Agenda + proteção de prepaint */
(()=>{
  if(window.__mcBulkDeleteV108)return;window.__mcBulkDeleteV108=true;

  /* O app.js monta primeiro o card-base. Enquanto o módulo de categorias ainda
     não inseriu o ícone que identifica o card já decorado, não permitimos que
     o navegador pinte essa versão bruta (badge, perfil, categoria e valor). */
  if(!document.getElementById('mcCardPrepaintV160')){
    const st=document.createElement('style');
    st.id='mcCardPrepaintV160';
    st.textContent='.item:not(:has(.mc-card-icon-v112)){visibility:hidden!important}';
    document.head.appendChild(st);
  }

  const cleanup=()=>{
    document.body?.classList.remove('mc-bulk-active-mobile');
    document.querySelectorAll('.mc-bulk-toolbar,.mc-bulk-start,.mc-bulk-check-wrap,.mc-bulk-check').forEach(el=>el.remove());
    document.querySelectorAll('#list .mc-bulk-selectable,#list .mc-bulk-selected').forEach(el=>el.classList.remove('mc-bulk-selectable','mc-bulk-selected'));
  };
  cleanup();
  const loadPremium=()=>{
    if(window.__mcBatchConfirmPremiumV157||document.querySelector('script[data-mc-batch-premium]'))return;
    const p=document.createElement('script');p.src='./batch-confirm-premium-v157.js?rev=20260916a';p.dataset.mcBatchPremium='1';document.head.appendChild(p);
  };
  const loadDesktop=()=>{
    if(window.__mcDesktopSearchV162||document.querySelector('script[data-mc-desktop-search]'))return;
    const d=document.createElement('script');d.src='./desktop-search-v162.js?rev=20260916a';d.dataset.mcDesktopSearch='1';document.head.appendChild(d);
  };
  const loadAgendaNotes=()=>{
    if(window.__mcAgendaObsV121||document.querySelector('script[data-mc-agenda-obs]'))return;
    const a=document.createElement('script');a.src='./agenda-observacoes-v121.js?rev=20260916a';a.dataset.mcAgendaObs='1';document.head.appendChild(a);
  };
  const load=()=>{
    cleanup();loadAgendaNotes();
    if(window.__mcBatchSelectionV159||document.querySelector('script[data-mc-batch-current]')){loadPremium();loadDesktop();return}
    const s=document.createElement('script');s.src='./batch-selection-v149.js?rev=20260916d';s.dataset.mcBatchCurrent='1';s.onload=()=>{cleanup();loadPremium();loadDesktop()};document.head.appendChild(s);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();