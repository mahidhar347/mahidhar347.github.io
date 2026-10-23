const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function setup(options={}){
  const elements=new Map(),listeners={},events=[];let playCalls=0;
  const make=()=>({listeners:{},attributes:{},value:'35',textContent:'',append(){},setAttribute(k,v){this.attributes[k]=v;},addEventListener(k,f){this.listeners[k]=f;}});
  const get=selector=>{if(!elements.has(selector))elements.set(selector,make());return elements.get(selector);};
  const audio=get('#voyage-music');audio.paused=true;audio.error=null;
  audio.play=async()=>{playCalls++;if(options.reject)throw Error('blocked');audio.paused=false;audio.listeners.play?.();if(options.pending)await options.pending;};
  audio.pause=()=>{audio.paused=true;audio.listeners.pause?.();};audio.load=()=>{};
  const document={hidden:false,querySelector:get,createElement:make,addEventListener:(type,f)=>listeners[type]=f};
  const window={addEventListener:(type,f)=>listeners[type]=f,dispatchEvent:event=>events.push(event)};
  const stored={};
  vm.runInNewContext(fs.readFileSync(require.resolve('../music.js'),'utf8'),{document,window,localStorage:{getItem:()=>null,setItem:(k,v)=>stored[k]=v},Event:class{constructor(type){this.type=type;}}});
  return{get,audio,document,listeners,events,stored,calls:()=>playCalls};
}
test('audio-only music waits for a click, plays, changes volume, and pauses',async()=>{
  const h=setup();assert.equal(h.calls(),0);assert.equal(h.audio.volume,.35);
  await h.get('#music-toggle').listeners.click();assert.equal(h.calls(),1);assert.equal(h.audio.paused,false);
  assert.equal(h.get('#music-toggle').attributes['aria-pressed'],'true');assert.ok(h.events.some(e=>e.type==='voyage-music-play'));
  h.get('#music-volume').value='42';h.get('#music-volume').listeners.input();assert.equal(h.audio.volume,.42);assert.equal(h.stored['mahidhar-music-volume'],'42');
  await h.get('#music-toggle').listeners.click();assert.equal(h.audio.paused,true);assert.equal(h.get('#music-toggle').attributes['aria-pressed'],'false');
});
test('cancelling a pending audio load cannot restart music afterwards',async()=>{
  let release;const pending=new Promise(resolve=>release=resolve);const h=setup({pending});
  const first=h.get('#music-toggle').listeners.click();await h.get('#music-toggle').listeners.click();release();await first;
  assert.equal(h.audio.paused,true);assert.equal(h.get('#music-toggle').attributes['aria-pressed'],'false');
});
test('playback failure offers retry, and ambience or hidden tabs pause music',async()=>{
  const failed=setup({reject:true});await failed.get('#music-toggle').listeners.click();assert.match(failed.get('#music-status').textContent,/could not start/);
  const h=setup();await h.get('#music-toggle').listeners.click();h.listeners['voyage-ambience-play']();assert.equal(h.audio.paused,true);
  await h.get('#music-toggle').listeners.click();h.document.hidden=true;h.listeners.visibilitychange();assert.equal(h.audio.paused,true);
});
