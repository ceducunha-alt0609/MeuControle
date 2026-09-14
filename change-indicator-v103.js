/* MeuControle — ponte do indicador remoto V1.03 -> V1.06 */
(()=>{
  if(window.__mcChangeIndicatorV106)return;
  if(document.querySelector('script[data-mc-change-indicator-v106]'))return;
  const s=document.createElement('script');
  s.src='./change-indicator-v106.js?v=106';
  s.dataset.mcChangeIndicatorV106='1';
  document.head.appendChild(s);
})();