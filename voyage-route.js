(function(scope){
  'use strict';
  const DAY=86400000, IST=19800000, DEPARTURE=6*3600000;
  const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
  function state(timestamp){
    if(!Number.isFinite(timestamp))throw new TypeError('A finite timestamp is required');
    const phase=((timestamp+IST-DEPARTURE)%DAY+DAY)%DAY/DAY;
    const angle=phase*Math.PI*2,depth=(1-Math.cos(angle))/2;
    const t=clamp((.04-Math.sin(angle))/.08,0,1);
    return {phase,depth,scale:.16+.84*Math.pow(1-depth,1.15),front:t*t*(3-2*t),returning:phase>=.5};
  }
  function layout(route,width,height){
    if(!(width>0&&height>0))throw new TypeError('Positive viewport dimensions are required');
    const compact=width<700;
    const nearWidth=compact?clamp(width*.38,110,180):clamp(width*.22,185,280);
    const shipWidth=nearWidth*route.scale;
    const cover=Math.max(width/1536,height/1024);
    const horizon=(height-1024*cover)/2+1024*cover*.49;
    const x=width*(.82-.14*route.depth+.025*Math.sin(route.phase*2*Math.PI));
    return {x:clamp(x,shipWidth*.55+12,width-shipWidth*.55-12),y:height*(compact?.91:.88)*(1-route.depth)+horizon*route.depth,width:shipWidth};
  }
  const api={state,layout,DAY,IST,DEPARTURE};
  if(typeof module==='object'&&module.exports)module.exports=api;else scope.VoyageRoute=api;
})(typeof window!=='undefined'?window:globalThis);
