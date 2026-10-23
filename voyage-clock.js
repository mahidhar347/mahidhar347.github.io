(function(scope){
  'use strict';
  // One closed journey per day: 06:00 IST is the harbour departure/return.
  // Pure clock-based position means refreshes and new visits never reset it.
  function voyagePosition(timestamp,compact=false){
    const day=86400000,start=6*3600000,offset=19800000;
    const phase=((timestamp+offset-start)%day+day)%day/day;
    const angle=phase*Math.PI*2;
    return {phase,x:(compact?3.7:7.4)+(compact?1.1:2)*Math.sin(angle),z:-5.5+6.5*Math.cos(angle),heading:Math.atan2((compact?1.1:2)*Math.cos(angle),-6.5*Math.sin(angle))};
  }
  if(typeof module==='object'&&module.exports)module.exports={voyagePosition};
  else scope.VoyageClock={voyagePosition};
})(typeof window!=='undefined'?window:globalThis);
