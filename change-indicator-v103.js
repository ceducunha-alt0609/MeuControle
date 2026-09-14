/* MeuControle — ponte do indicador remoto V1.03 -> V1.07 */
(()=>{
  if(window.__mcChangeIndicatorV107)return;
  if(document.querySelector('script[data-mc-change-indicator-v107]'))return;
  const s=document.createElement('script');
  s.src='./change-indicator-v107.js?v=107';
  s.dataset.mcChangeIndicatorV107='1';
  document.head.appendChild(s);
})();