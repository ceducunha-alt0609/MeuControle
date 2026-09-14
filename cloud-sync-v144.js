/* MeuControle — ponte do sincronizador V1.44 -> V1.45 */
(()=>{
  if(window.__mcCloudSyncV145)return;
  if(document.querySelector('script[data-mc-cloud-sync-v145]'))return;
  const s=document.createElement('script');
  s.src='./cloud-sync-v145.js?v=145';
  s.dataset.mcCloudSyncV145='1';
  document.head.appendChild(s);
})();