/* MeuControle — ponte do sincronizador V1.44 -> V1.46 */
(()=>{
  if(window.__mcCloudSyncV146)return;
  if(document.querySelector('script[data-mc-cloud-sync-v146]'))return;
  const s=document.createElement('script');
  s.src='./cloud-sync-v146.js?v=146';
  s.dataset.mcCloudSyncV146='1';
  document.head.appendChild(s);
})();