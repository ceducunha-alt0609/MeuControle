/* MeuControle V1.34 - arraste 2D do painel de acoes no desktop */
(function(){
 if(window.__mcDrag2dV134)return;window.__mcDrag2dV134=true;
 let moving=false,startX=0,startY=0,startLeft=0,startTop=0,panel=null;
 document.addEventListener('pointerdown',function(e){
  if(!matchMedia('(min-width:701px)').matches)return;
  if(!e.target.closest('.mc-desktop-actions-handle-v113'))return;
  panel=e.target.closest('.mc-desktop-actions-v113');if(!panel)return;
  const r=panel.getBoundingClientRect();moving=true;startX=e.clientX;startY=e.clientY;startLeft=r.left;startTop=r.top;
 },true);
 document.addEventListener('pointermove',function(e){
  if(!moving||!panel)return;
  const pad=8,maxLeft=Math.max(pad,innerWidth-panel.offsetWidth-pad),maxTop=Math.max(pad,innerHeight-panel.offsetHeight-pad);
  const left=Math.min(maxLeft,Math.max(pad,startLeft+e.clientX-startX));
  const top=Math.min(maxTop,Math.max(pad,startTop+e.clientY-startY));
  panel.style.left=left+'px';panel.style.top=top+'px';panel.style.right='auto';panel.style.bottom='auto';
 },true);
 document.addEventListener('pointerup',function(){moving=false;panel=null},true);
 document.addEventListener('pointercancel',function(){moving=false;panel=null},true);
 const css=document.createElement('style');css.textContent='@media(min-width:701px){.mc-desktop-actions-handle-v113{cursor:move!important}}';document.head.appendChild(css);
})();