const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function setup(){
  const elements=new Map(),listeners={},events=[],players=[];
  const make=()=>({listeners:{},attributes:{},hidden:false,disabled:false,value:'35',textContent:'',classList:{remove(){}},append(){},replaceChildren(){},focus(){},getClientRects:()=>[],setAttribute(k,v){this.attributes[k]=v;},addEventListener(k,f){this.listeners[k]=f;}});
  const get=selector=>{if(!elements.has(selector))elements.set(selector,make());return elements.get(selector);};
  get('#music-radio').hidden=true;
  class Player{
    constructor(id,options){this.options=options;this.pauses=0;this.destroyed=false;players.push(this);}
    playVideo(){this.options.events.onStateChange({data:1});}
    pauseVideo(){this.pauses++;this.options.events.onStateChange({data:2});}
    setVolume(value){this.volume=value;}destroy(){this.destroyed=true;}
  }
  const document={hidden:false,head:make(),querySelector:get,querySelectorAll:()=>[],createElement:make,addEventListener:(type,f)=>listeners[type]=f};
  const window={YT:{Player},addEventListener:(type,f)=>listeners[type]=f,dispatchEvent:event=>{events.push(event);listeners[event.type]?.(event);}};
  let launch;
  document.querySelector('#appearance-panel').append=element=>launch=element;
  vm.runInNewContext(fs.readFileSync(require.resolve('../music.js'),'utf8'),{document,window,location:{protocol:'https:',origin:'https://mahidhar347.github.io'},Event:class{constructor(type){this.type=type;}},MutationObserver:class{observe(){}},setTimeout,clearTimeout,console});
  return{get,document,window,players,listeners,events,launch};
}
test('official music creates no player until clicked and keeps YouTube controls visible',async()=>{
  const h=setup();assert.equal(h.players.length,0);assert.equal(h.get('#music-radio').hidden,true);
  await h.launch.listeners.click();const player=h.players[0];
  assert.equal(h.get('#music-radio').hidden,false);assert.equal(player.options.videoId,'YoeP9w5UIlg');
  assert.equal(player.options.host,'https://www.youtube-nocookie.com');assert.equal(player.options.playerVars.controls,1);
  player.options.events.onReady({target:player});assert.equal(player.volume,35);
  assert.ok(h.events.some(e=>e.type==='voyage-music-play'));
  h.get('#music-play').listeners.click();assert.match(h.get('#music-status').textContent,/paused/);
  h.get('#music-volume').value='42';h.get('#music-volume').listeners.input();assert.equal(player.volume,42);
  h.get('#music-close').listeners.click();assert.equal(player.destroyed,true);assert.equal(h.get('#music-radio').hidden,true);
});
test('weather audio and background-tab transitions pause music; player errors offer a retry',async()=>{
  const h=setup();await h.launch.listeners.click();const player=h.players[0];player.options.events.onReady({target:player});
  h.listeners['voyage-ambience-play']();assert.ok(player.pauses>0);
  h.document.hidden=true;h.listeners.visibilitychange();assert.ok(player.pauses>1);
  player.options.events.onError({data:150});assert.match(h.get('#music-status').textContent,/official YouTube link/);assert.equal(h.get('#music-play').textContent,'Retry player');
  h.listeners.pagehide();assert.equal(player.destroyed,true);
});
