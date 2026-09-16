/* MeuControle — ponte V1.02: seletor antigo aposentado; carrega action sheet atual */
(()=>{
  if(window.__mcBulkDeleteV102)return;window.__mcBulkDeleteV102=true;
  const cleanup=()=>{
    document.body?.classList.remove('mc-bulk-active-mobile');
    document.querySelectorAll('.mc-bulk-toolbar,.mc-bulk-start,.mc-bulk-check-wrap,.mc-bulk-check').forEach(el=>el.remove());
    document.querySelectorAll('#list .mc-bulk-selectable,#list .mc-bulk-selected').forEach(el=>el.classList.remove('mc-bulk-selectable','mc-bulk-selected'));
  };
  cleanup();
  const load=()=>{
    cleanup();
    if(window.__mcBatchSelectionV151||document.querySelector('script[data-mc-batch-current]'))return;
    const s=document.createElement('script');
    s.src='./batch-selection-v149.js?rev=20260916b';
    s.dataset.mcBatchCurrent='1';
    s.onload=cleanup;
    document.head.appendChild(s);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
