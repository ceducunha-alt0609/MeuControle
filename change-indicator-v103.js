/* MeuControle — ponte do indicador remoto V1.03 -> V1.08 */
(()=>{
  if(window.__mcChangeIndicatorV108)return;
  if(document.querySelector('script[data-mc-change-indicator-v108]'))return;
  const s=document.createElement('script');
  s.src='./change-indicator-v108.js?v=108';
  s.dataset.mcChangeIndicatorV108='1';
  document.head.appendChild(s);
})();