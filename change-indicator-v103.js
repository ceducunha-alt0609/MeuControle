/* MeuControle — ponte do indicador remoto V1.03 -> V1.05 */
(()=>{
  if(window.__mcChangeIndicatorV105)return;
  if(document.querySelector('script[data-mc-change-indicator-v105]'))return;
  const s=document.createElement('script');
  s.src='./change-indicator-v105.js?v=105';
  s.dataset.mcChangeIndicatorV105='1';
  document.head.appendChild(s);
})();