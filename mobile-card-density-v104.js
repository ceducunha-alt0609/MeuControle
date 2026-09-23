/* MeuControle — V1.04: densidade final dos cards mobile */
(()=>{
  if(window.__mcMobileCardDensityV104)return;window.__mcMobileCardDensityV104=true;
  const st=document.createElement('style');st.id='mcMobileCardDensityV104Style';st.textContent=`
    @media(max-width:700px){
      #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102{
        height:104px!important;min-height:104px!important;max-height:104px!important;
        padding:11px 13px 10px 58px!important;
      }
      #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102:has(.mc-card-steps){
        height:auto!important;min-height:104px!important;max-height:none!important;overflow:visible!important;
      }
      #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .mc-card-steps{display:block!important;margin-top:5px!important;padding-top:4px!important}
      #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .mc-card-steps-toggle{display:inline-flex!important;align-items:center!important;gap:2px!important;position:relative!important;z-index:2}
      #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .mc-card-steps-list{padding-bottom:5px!important}
      #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .item-title{font-size:17px!important;line-height:1.2!important}
      #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .mc-mobile-inline-amount-v102{font-size:16px!important;line-height:1.15!important}
      #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .meta{margin-top:4px!important;font-size:11.5px!important;line-height:1.3!important}
      #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .notes{display:none!important}
      #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .status-dot{top:25px!important}
      #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102.mc-bulk-selectable .mc-bulk-check-wrap{top:16px!important}
    }
  `;document.head.appendChild(st);
})();
