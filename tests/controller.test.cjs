const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const {describe}=require('../weather-model.js');
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function harness(fetchImplementation) {
  const elements=new Map(), events=[], listeners={}, timers=new Map();let timerId=0;
  const element=()=>({style:{},attributes:{},listeners:{},textContent:'',disabled:false,value:'',append(){},setAttribute(k,v){this.attributes[k]=v;},addEventListener(k,f){this.listeners[k]=f;},dispatchEvent(e){return this.listeners[e.type]?.(e);},showModal(){},close(){}});
  const get=selector=>{if(!elements.has(selector))elements.set(selector,element());return elements.get(selector);};
  get('#theme-choice').value='weather';
  const sound={enabled:false,stops:0,async stop(){this.enabled=false;this.stops++;},async start(){this.enabled=true;},setWeather(){},setVolume(){},async visibility(){}};
  const window={VoyageWeather:{describe},VoyageSoundscape:class{constructor(){return sound;}},addEventListener:(type,f)=>listeners[type]=f,dispatchEvent:event=>{events.push(event);listeners[event.type]?.(event);}};
  const document={documentElement:{dataset:{}},hidden:false,querySelector:get,createElement:element,addEventListener:(type,f)=>listeners[type]=f};
  const context={window,document,navigator:{},AbortController,URLSearchParams,Date,Intl,fetch:fetchImplementation,CustomEvent:class{constructor(type,options={}){this.type=type;this.detail=options.detail;}},Event:class{constructor(type){this.type=type;}},setTimeout:(f,delay)=>{const id=++timerId;timers.set(id,{f,delay});return id;},clearTimeout:id=>timers.delete(id)};
  vm.runInNewContext(fs.readFileSync(require.resolve('../weather.js'),'utf8'),context);
  return {get,events,listeners,sound,document,timers};
}
const validResponse=()=>({current:{weather_code:61,is_day:1,temperature_2m:23,wind_speed_10m:15,time:Math.floor(Date.now()/1000)},current_units:{temperature_2m:'°C',wind_speed_10m:'km/h'}});
test('publishes fetched rain, avoids autoplay, and enables and mutes only through controls',async()=>{
  const h=harness(async()=>({ok:true,json:async()=>validResponse()}));await tick();
  const published=h.events.filter(e=>e.type==='voyage-weather').at(-1).detail;
  assert.equal(published.kind,'rain');assert.match(h.get('#weather-details').textContent,/Bengaluru/);assert.equal(h.sound.enabled,false);
  await h.get('#sound-toggle').listeners.click();assert.equal(h.sound.enabled,true);assert.equal(h.get('#sound-toggle').attributes['aria-pressed'],'true');
  await h.get('#sound-toggle').listeners.click();assert.equal(h.sound.enabled,false);assert.equal(h.get('#sound-toggle').attributes['aria-pressed'],'false');
});
test('failed, stale and wrong-unit forecasts clear the weather and stop sound',async()=>{
  for(const reply of ['network','stale','units']){
    const h=harness(async()=>{if(reply==='network')throw Error('offline');const data=validResponse();if(reply==='stale')data.current.time-=9000;if(reply==='units')data.current_units.temperature_2m='°F';return{ok:true,json:async()=>data};});await tick();
    assert.equal(h.events.filter(e=>e.type==='voyage-weather').at(-1).detail,null);
    assert.match(h.get('#weather-details').textContent,/temporarily unavailable/);assert.ok(h.sound.stops>0);
    assert.ok([...h.timers.values()].some(t=>t.delay===900000));
  }
});
test('a late weather response cannot override a visitor choosing a fixed mood',async()=>{
  let resolve;const promise=new Promise(r=>resolve=r);const h=harness(()=>promise);
  h.get('#theme-choice').value='sunset';h.listeners['voyage-mode']();
  resolve({ok:true,json:async()=>validResponse()});await tick();
  assert.equal(h.events.filter(e=>e.type==='voyage-weather').length,0);assert.equal(h.sound.enabled,false);
});
test('rapid mute clicks are ignored until the first asynchronous stop finishes',async()=>{
  const h=harness(async()=>({ok:true,json:async()=>validResponse()}));await tick();
  await h.get('#sound-toggle').listeners.click();
  let release;h.sound.stop=()=>new Promise(resolve=>{release=()=>{h.sound.enabled=false;resolve();};});
  const stopping=h.get('#sound-toggle').listeners.click();assert.equal(h.get('#sound-toggle').disabled,true);
  await h.get('#sound-toggle').listeners.click();release();await stopping;
  assert.equal(h.sound.enabled,false);assert.equal(h.get('#sound-toggle').disabled,false);
});
