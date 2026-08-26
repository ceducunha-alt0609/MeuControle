const CACHE='meu-controle-v2-6';
const ASSETS=[
  './','./index.html','./style.css','./app.js','./manifest.json',
  './favicon.png','./apple-touch-icon.png','./app-icon.svg','./logo-horizontal.svg',
  './icons/icon-72.png','./icons/icon-96.png','./icons/icon-144.png',
  './icons/icon-192.png','./icons/icon-512.png'
];

const FONT_LINKS=`<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap" rel="stylesheet">`;

const JS_FIX=`\n/* V2.6 — atualização confiável do estado de instalação */\n(function(){\n  const originalUpdateInstallUI=updateInstallUI;\n  updateInstallUI=function(){\n    const btn=$('installAppBtn'),title=$('installStatusTitle'),text=$('installStatusText');\n    if(!btn||!title||!text)return;\n    const standalone=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;\n    if(standalone){\n      title.textContent='Meu Controle instalado ✓';\n      text.textContent='Você já está usando o app instalado neste computador.';\n      btn.textContent='Aplicativo instalado';\n      btn.disabled=true;\n      const help=document.querySelector('.install-help');\n      if(help)help.textContent='Instalação concluída. O Meu Controle abre em janela própria como aplicativo.';\n      return;\n    }\n    originalUpdateInstallUI();\n  };\n  const refresh=()=>setTimeout(updateInstallUI,250);\n  window.addEventListener('load',refresh);\n  window.addEventListener('focus',refresh);\n  try{window.matchMedia('(display-mode: standalone)').addEventListener('change',refresh)}catch{}\n  setTimeout(updateInstallUI,700);\n})();\n`;

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(
        keys
          .filter(k=>k.startsWith('meu-controle-') && k!==CACHE)
          .map(k=>caches.delete(k))
      ))
      .then(()=>self.clients.claim())
  );
});

async function htmlWithMerriweather(request){
  try{
    const response=await fetch(request,{cache:'no-store'});
    if(!response.ok)return response;
    let html=await response.text();
    if(!html.includes('fonts.googleapis.com/css2?family=Merriweather')){
      html=html.replace('</head>',`${FONT_LINKS}</head>`);
    }
    const headers=new Headers(response.headers);
    headers.set('content-type','text/html; charset=utf-8');
    return new Response(html,{status:response.status,statusText:response.statusText,headers});
  }catch{
    return caches.match('./index.html');
  }
}

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);

  if(e.request.mode==='navigate' && url.origin===self.location.origin && url.pathname.startsWith('/MeuControle/')){
    e.respondWith(htmlWithMerriweather(e.request));
    return;
  }

  if(url.origin===self.location.origin && url.pathname.endsWith('/app.js')){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>r.text()).then(t=>new Response(t+JS_FIX,{headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-store'}})).catch(()=>caches.match(e.request)));
    return;
  }

  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
      const copy=resp.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
      return resp;
    }).catch(()=>caches.match('./index.html')))
  );
});
