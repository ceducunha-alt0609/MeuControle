const CACHE='meu-controle-v2-7';
const ASSETS=[
  './','./index.html','./style.css','./app.js','./manifest.json',
  './favicon.png','./apple-touch-icon.png','./app-icon.svg','./logo-horizontal.svg',
  './icons/icon-72.png','./icons/icon-96.png','./icons/icon-144.png',
  './icons/icon-192.png','./icons/icon-512.png'
];

const FONT_LINKS=`<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap" rel="stylesheet">`;

const JS_FIX=`\n/* V2.6 — atualização confiável do estado de instalação */\n(function(){\n  const originalUpdateInstallUI=updateInstallUI;\n  updateInstallUI=function(){\n    const btn=$('installAppBtn'),title=$('installStatusTitle'),text=$('installStatusText');\n    if(!btn||!title||!text)return;\n    const standalone=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;\n    if(standalone){\n      title.textContent='Meu Controle instalado ✓';\n      text.textContent='Você já está usando o app instalado neste computador.';\n      btn.textContent='Aplicativo instalado';\n      btn.disabled=true;\n      const help=document.querySelector('.install-help');\n      if(help)help.textContent='Instalação concluída. O Meu Controle abre em janela própria como aplicativo.';\n      return;\n    }\n    originalUpdateInstallUI();\n  };\n  const refresh=()=>setTimeout(updateInstallUI,250);\n  window.addEventListener('load',refresh);\n  window.addEventListener('focus',refresh);\n  try{window.matchMedia('(display-mode: standalone)').addEventListener('change',refresh)}catch{}\n  setTimeout(updateInstallUI,700);\n})();\n\n/* V2.2 — navegação mobile inferior */\n(function(){\n  const style=document.createElement('style');\n  style.textContent=\\`\n    .mobile-bottom-nav{display:none}\n    .mobile-profile-bar{display:none}\n    @media(max-width:700px){\n      body{padding-bottom:calc(70px + env(safe-area-inset-bottom))}\n      .topbar-lower{display:none!important}\n      .mobile-profile-bar{display:block;padding:10px 16px 2px;background:var(--page-bg)}\n      .mobile-profile-bar select{height:44px;border-radius:12px;background:#fff;font-size:16px}\n      .mobile-bottom-nav{position:fixed;left:0;right:0;bottom:0;z-index:950;display:grid;grid-template-columns:repeat(4,1fr);background:#fff;border-top:1px solid #dbe3e7;box-shadow:0 -5px 18px rgba(0,0,0,.10);padding:5px 6px calc(5px + env(safe-area-inset-bottom))}\n      .mobile-bottom-nav button{min-height:56px;padding:5px 2px;border-radius:11px;background:transparent;color:#66747c;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:11px;font-weight:700}\n      .mobile-bottom-nav button .mobile-nav-icon{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:21px;line-height:1}\n      .mobile-bottom-nav button.active{background:var(--primary-soft);color:var(--primary)}\n      .container{padding-bottom:18px}\n    }\n  \\`;\n  document.head.appendChild(style);\n\n  const lower=document.querySelector('.topbar-lower');\n  const originalProfile=document.querySelector('.profile-filter-wrap');\n  if(lower&&originalProfile){\n    const profileBar=document.createElement('div');\n    profileBar.className='mobile-profile-bar';\n    const mobileSelect=document.createElement('select');\n    mobileSelect.setAttribute('aria-label','Perfil exibido');\n    const syncFromOriginal=()=>{mobileSelect.innerHTML=$('profileFilter').innerHTML;mobileSelect.value=$('profileFilter').value};\n    syncFromOriginal();\n    mobileSelect.onchange=()=>{$('profileFilter').value=mobileSelect.value;$('profileFilter').dispatchEvent(new Event('change'))};\n    $('profileFilter').addEventListener('change',()=>{mobileSelect.value=$('profileFilter').value});\n    profileBar.appendChild(mobileSelect);\n    document.querySelector('.topbar').insertAdjacentElement('afterend',profileBar);\n    setTimeout(syncFromOriginal,0);\n  }\n\n  const nav=document.createElement('nav');\n  nav.className='mobile-bottom-nav';\n  nav.setAttribute('aria-label','Navegação principal');\n  nav.innerHTML=\\`\n    <button type="button" data-mobile-page="dashboard" class="active"><span class="mobile-nav-icon">⌂</span><span>Painel</span></button>\n    <button type="button" data-mobile-page="launches"><span class="mobile-nav-icon">＋</span><span>Lançar</span></button>\n    <button type="button" data-mobile-page="calendar"><span class="mobile-nav-icon">▣</span><span>Agenda</span></button>\n    <button type="button" data-mobile-page="settings"><span class="mobile-nav-icon">•••</span><span>Mais</span></button>\n  \\`;\n  document.body.appendChild(nav);\n\n  const originalShowPage=showPage;\n  showPage=function(page){\n    originalShowPage(page);\n    nav.querySelectorAll('[data-mobile-page]').forEach(b=>b.classList.toggle('active',b.dataset.mobilePage===page));\n    if(innerWidth<=700)window.scrollTo({top:0,behavior:'auto'});\n  };\n  nav.querySelectorAll('[data-mobile-page]').forEach(b=>b.onclick=()=>showPage(b.dataset.mobilePage));\n  showPage('dashboard');\n})();\n`;

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
