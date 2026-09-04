const CACHE='meu-controle-v2-16';
const ASSETS=[
  './','./index.html','./style.css','./app.js','./mobile-launches.js','./mobile-agenda.js','./mobile-settings.js','./profile-flex.js','./navigation-state.js','./firebase-bridge.js','./sync-diagnostic.js','./manifest.json',
  './favicon.png','./apple-touch-icon.png','./app-icon.svg','./logo-horizontal.svg',
  './icons/icon-72.png','./icons/icon-96.png','./icons/icon-144.png',
  './icons/icon-192.png','./icons/icon-512.png'
];

const FONT_LINKS=`<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap" rel="stylesheet">`;
const PROFILE_SCRIPT='<script src="./profile-flex.js"></script>';
const NAV_STATE_SCRIPT='<script src="./navigation-state.js"></script>';
const FIREBASE_SCRIPT='<script type="module" src="./firebase-bridge.js"></script>';
const SYNC_DIAGNOSTIC_SCRIPT='<script src="./sync-diagnostic.js"></script>';

const JS_FIX=`\n/* V2.16 — atualização confiável do PWA */\n(function(){\n  try{\n    if('serviceWorker' in navigator){\n      navigator.serviceWorker.getRegistration().then(r=>r&&r.update()).catch(()=>{});\n    }\n  }catch{}\n  try{\n    const originalUpdateInstallUI=updateInstallUI;\n    updateInstallUI=function(){\n      const btn=$('installAppBtn'),title=$('installStatusTitle'),text=$('installStatusText');\n      if(!btn||!title||!text)return;\n      const standalone=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;\n      if(standalone){\n        title.textContent='Meu Controle instalado ✓';\n        text.textContent='Você já está usando o app instalado neste computador.';\n        btn.textContent='Aplicativo instalado';\n        btn.disabled=true;\n        const help=document.querySelector('.install-help');\n        if(help)help.textContent='Instalação concluída. O Meu Controle abre em janela própria como aplicativo.';\n        return;\n      }\n      originalUpdateInstallUI();\n    };\n    const refresh=()=>setTimeout(updateInstallUI,250);\n    window.addEventListener('load',refresh);\n    window.addEventListener('focus',refresh);\n    try{window.matchMedia('(display-mode: standalone)').addEventListener('change',refresh)}catch{}\n    setTimeout(updateInstallUI,700);\n  }catch{}\n})();\n`;

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(
        keys.filter(k=>k.startsWith('meu-controle-')&&k!==CACHE).map(k=>caches.delete(k))
      ))
      .then(()=>self.clients.claim())
  );
});

async function cachePut(request,response){
  try{
    const cache=await caches.open(CACHE);
    await cache.put(request,response.clone());
  }catch{}
  return response;
}

async function htmlWithMerriweather(request){
  try{
    const response=await fetch(request,{cache:'no-store'});
    if(!response.ok)throw new Error('network');
    let html=await response.text();
    if(!html.includes('fonts.googleapis.com/css2?family=Merriweather')){
      html=html.replace('</head>',`${FONT_LINKS}</head>`);
    }
    if(!html.includes('profile-flex.js')){
      html=html.replace('</body>',`${PROFILE_SCRIPT}</body>`);
    }
    if(!html.includes('navigation-state.js')){
      html=html.replace('</body>',`${NAV_STATE_SCRIPT}</body>`);
    }
    if(!html.includes('firebase-bridge.js')){
      html=html.replace('</body>',`${FIREBASE_SCRIPT}</body>`);
    }
    if(!html.includes('sync-diagnostic.js')){
      html=html.replace('</body>',`${SYNC_DIAGNOSTIC_SCRIPT}</body>`);
    }
    const headers=new Headers(response.headers);
    headers.set('content-type','text/html; charset=utf-8');
    headers.set('cache-control','no-store');
    const fresh=new Response(html,{status:response.status,statusText:response.statusText,headers});
    await cachePut(new Request('./index.html',{method:'GET'}),fresh.clone());
    return fresh;
  }catch{
    return (await caches.match('./index.html'))||Response.error();
  }
}

async function freshAppJs(request){
  try{
    const response=await fetch(request,{cache:'no-store'});
    if(!response.ok)throw new Error('network');
    let text=await response.text();
    text=text.replace(
      "window.addEventListener('beforeinstallprompt',e=>{\n  e.preventDefault();\n  deferredInstallPrompt=e;\n  updateInstallUI();\n});",
      "window.addEventListener('beforeinstallprompt',e=>{\n  // Mantém a promoção nativa do navegador e também registra a oferta para instalação manual.\n  deferredInstallPrompt=e;\n  updateInstallUI();\n});"
    );
    const fresh=new Response(text+JS_FIX,{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-store'}});
    await cachePut(request,fresh.clone());
    return fresh;
  }catch{
    return (await caches.match(request))||Response.error();
  }
}

async function networkFirst(request){
  try{
    const response=await fetch(request,{cache:'no-store'});
    if(!response.ok)throw new Error('network');
    return cachePut(request,response);
  }catch{
    return (await caches.match(request))||(await caches.match('./index.html'))||Response.error();
  }
}

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);

  if(e.request.mode==='navigate'&&url.origin===self.location.origin&&url.pathname.startsWith('/MeuControle/')){
    e.respondWith(htmlWithMerriweather(e.request));
    return;
  }

  if(url.origin===self.location.origin&&url.pathname.endsWith('/app.js')){
    e.respondWith(freshAppJs(e.request));
    return;
  }

  if(url.origin===self.location.origin){
    e.respondWith(networkFirst(e.request));
    return;
  }

  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});
