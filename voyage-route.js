(function(scope){
  'use strict';
  const DAY=86400000, IST=19800000, DEPARTURE=6*3600000;
  const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
  function state(timestamp){
    if(!Number.isFinite(timestamp))throw new TypeError('A finite timestamp is required');
    const phase=((timestamp+IST-DEPARTURE)%DAY+DAY)%DAY/DAY;
    const angle=phase*Math.PI*2,depth=(1-Math.cos(angle))/2;
    const t=clamp((.04-Math.sin(angle))/.08,0,1);
    // Perspective scale is inverse distance, rather than an unrelated size tween.
    return {phase,depth,scale:1/(1+5.25*depth),front:t*t*(3-2*t),returning:phase>=.5,speed:Math.abs(Math.sin(angle))};
  }
  function layout(route,width,height){
    if(!(width>0&&height>0))throw new TypeError('Positive viewport dimensions are required');
    const compact=width<700;
    const nearWidth=compact?clamp(width*.38,110,180):clamp(width*.22,185,280);
    const shipWidth=nearWidth*route.scale;
    const cover=Math.max(width/1536,height/1024);
    const offsetY=(height-1024*cover)/2;
    const offsetX=(width-1536*cover)*(compact?.62:.5);
    const horizon=offsetY+400*cover;
    // Leave the phone/tablet's fixed controls below the contact point.
    const nearY=Math.min(offsetY+870*cover,width<1000?height*.82:Infinity);
    const nearX=offsetX+1000*cover,vanishingX=offsetX+1180*cover;
    // One ground-plane projection determines both contact point and apparent size.
    // The approved rear view points up/right; its outbound path must do the same.
    const x=vanishingX+(nearX-vanishingX)*route.scale;
    const heading=Math.atan2(vanishingX-nearX,nearY-horizon)*180/Math.PI;
    return {x:clamp(x,shipWidth*.55+12,width-shipWidth*.55-12),y:horizon+(nearY-horizon)*route.scale,width:shipWidth,horizon,heading:heading+(route.returning?180:0)};
  }
  const api={state,layout,DAY,IST,DEPARTURE};
  if(typeof module==='object'&&module.exports)module.exports=api;else scope.VoyageRoute=api;
})(typeof window!=='undefined'?window:globalThis);
