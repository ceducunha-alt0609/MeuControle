/* MeuControle — ponte do indicador remoto V1.03 -> V1.04 */
(()=>{
  if(window.__mcChangeIndicatorV104)return;
  if(document.querySelector('script[data-mc-change-indicator-v104]'))return;
  const s=document.createElement('script');
  s.src='./change-indicator-v104.js?v=104';
  s.dataset.mcChangeIndicatorV104='1';
  document.head.appendChild(s);
})();