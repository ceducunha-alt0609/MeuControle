/* Meu Controle — V1.40: sincroniza tema crítico e tema runtime sem refresh */
(()=>{
  if(window.__mcThemeTransitionV140)return;window.__mcThemeTransitionV140=true;
  const KEY='meu_controle_color_mode_v1';
  const mq=matchMedia('(prefers-color-scheme: dark)');
  function resolvedDark(){
    const mode=localStorage.getItem(KEY)||'auto';
    return mode==='dark'||(mode==='auto'&&mq.matches);
  }
  function sync(){
    const dark=resolvedDark();
    const html=document.documentElement;
    const body=document.body;
    html.classList.toggle('mc-head-dark',dark);
    html.classList.toggle('mc-pre-dark',dark);
    html.style.colorScheme=dark?'dark':'light';
    if(body)body.classList.toggle('mc-dark',dark);
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta){
      if(dark)meta.content='#10171c';
      else{
        const primary=body?getComputedStyle(body).getPropertyValue('--primary').trim():'';
        meta.content=primary||'#164f78';
      }
    }
  }
  document.addEventListener('click',e=>{
    if(!e.target.closest('[data-color-mode]'))return;
    queueMicrotask(sync);
    requestAnimationFrame(sync);
  });
  mq.addEventListener?.('change',()=>{if((localStorage.getItem(KEY)||'auto')==='auto')sync()});
  window.addEventListener('storage',e=>{if(e.key===KEY)sync()});
  window.addEventListener('focus',sync);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
  window.MeuControleThemeTransitionV140={sync};
})();