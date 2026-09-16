/* MeuControle — ponte V1.03: seletor antigo aposentado; carrega pesquisa em lote + confirmação premium */
(()=>{
  if(window.__mcBulkDeleteV103)return;window.__mcBulkDeleteV103=true;
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
  const load=()=>{
    cleanup();
    if(window.__mcBatchSelectionV156||document.querySelector('script[data-mc-batch-current]')){loadPremium();return}
    const s=document.createElement('script');
    s.src='./batch-selection-v149.js?rev=20260916c';
    s.dataset.mcBatchCurrent='1';
    s.onload=()=>{cleanup();loadPremium()};
    document.head.appendChild(s);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();