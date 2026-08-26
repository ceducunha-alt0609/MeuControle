const CACHE='meu-controle-v2-5';
const ASSETS=[
  './','./index.html','./style.css','./app.js','./manifest.json',
  './favicon.png','./apple-touch-icon.png','./app-icon.svg','./logo-horizontal.svg',
  './icons/icon-72.png','./icons/icon-96.png','./icons/icon-144.png',
  './icons/icon-192.png','./icons/icon-512.png'
];

const CSS_FIX=`\n/* V2.5 — Merriweather local */\n@font-face{font-family:'MerriweatherLocal';src:local('Merriweather'),local('Merriweather Regular');font-style:normal;font-weight:100 900;font-display:swap}\nbody.font-merriweather{font-family:'MerriweatherLocal','Merriweather',Georgia,'Times New Roman',serif!important}\nbody.font-merriweather button,body.font-merriweather input,body.font-merriweather select,body.font-merriweather textarea{font-family:inherit!important}\n`;

const JS_FIX=`\n/* V2.5 — atualização confiável do estado de instalação */\n(function(){\n  const originalUpdateInstallUI=updateInstallUI;\n  updateInstallUI=function(){\n    const btn=$('installAppBtn'),title=$('installStatusTitle'),text=$('installStatusText');\n    if(!btn||!title||!text)return;\n    const standalone=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;\n    if(standalone){\n      title.textContent='Meu Controle instalado ✓';\n      text.textContent='Você já está usando o app instalado neste computador.';\n      btn.textContent='Aplicativo instalado';\n      btn.disabled=true;\n      const help=document.querySelector('.install-help');\n      if(help)help.textContent='Instalação concluída. O Meu Controle abre em janela própria como aplicativo.';\n      return;\n    }\n    originalUpdateInstallUI();\n  };\n  const refresh=()=>setTimeout(updateInstallUI,250);\n  window.addEventListener('load',refresh);\n  window.addEventListener('focus',refresh);\n  try{window.matchMedia('(display-mode: standalone)').addEventListener('change',refresh)}catch{}\n  setTimeout(updateInstallUI,700);\n})();\n`;

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(url.origin===self.location.origin && url.pathname.endsWith('/style.css')){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>r.text()).then(t=>new Response(t+CSS_FIX,{headers:{'Content-Type':'text/css; charset=utf-8','Cache-Control':'no-store'}})).catch(()=>caches.match(e.request)));
    return;
  }
  if(url.origin===self.location.origin && url.pathname.endsWith('/app.js')){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>r.text()).then(t=>new Response(t+JS_FIX,{headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-store'}})).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(fetch(e.request).then(resp=>{
    const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp;
  }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
