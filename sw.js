const CACHE='meu-controle-v2-4';
const ASSETS=[
  './','./index.html','./style.css','./app.js','./manifest.json',
  './favicon.png','./apple-touch-icon.png','./app-icon.svg','./logo-horizontal.svg',
  './icons/icon-72.png','./icons/icon-96.png','./icons/icon-144.png',
  './icons/icon-192.png','./icons/icon-512.png'
];
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
    const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp;
  }).catch(()=>caches.match('./index.html'))));
});
