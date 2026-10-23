const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {describe}=require('../weather-model.js');
test('maps weather codes, wind and day/night without confusing snow with rain',()=>{
  const base={weather_code:0,is_day:1,temperature_2m:26,wind_speed_10m:5};
  for(const [code,kind] of [[0,'clear'],[1,'clear'],[2,'cloud'],[3,'cloud'],[45,'fog'],[48,'fog'],[51,'rain'],[55,'rain'],[61,'rain'],[67,'rain'],[80,'rain'],[82,'rain'],[71,'snow'],[77,'snow'],[85,'snow'],[86,'snow'],[95,'storm'],[96,'storm'],[99,'storm']])assert.equal(describe({...base,weather_code:code}).kind,kind);
  assert.equal(describe({...base,wind_speed_10m:30}).kind,'wind');
  assert.equal(describe({...base,weather_code:95,wind_speed_10m:50}).kind,'storm');
  assert.equal(describe({...base,is_day:0}).theme,'midnight');
  for(const bad of [{},null,{...base,weather_code:123},{...base,temperature_2m:null},{...base,wind_speed_10m:-1},{...base,is_day:7}])assert.throws(()=>describe(bad));
});
test('sound never autoplays, clamps volume and suspends when the page is hidden',async()=>{
  let instances=0;
  const param=()=>({value:0,setTargetAtTime(){},setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}});
  const node=()=>({connect(){},disconnect(){},start(){},stop(){},gain:param(),frequency:param(),Q:param()});
  class AudioContext{
    constructor(){instances++;this.sampleRate=100;this.currentTime=0;this.destination={};this.state='suspended';}
    createGain(){return node();}createBiquadFilter(){return node();}createBufferSource(){return node();}createOscillator(){return node();}
    createBuffer(channels,length){return{getChannelData:()=>new Float32Array(length)};}
    createDynamicsCompressor(){return Object.fromEntries(['threshold','knee','ratio','attack','release'].map(k=>[k,param()]).concat([['connect',()=>{}]]));}
    async resume(){this.state='running';}async suspend(){this.state='suspended';}
  }
  const context={window:{AudioContext},document:{hidden:false},setTimeout:()=>1,clearTimeout:()=>{}};
  vm.runInNewContext(fs.readFileSync(require.resolve('../soundscape.js'),'utf8'),context);
  const sound=new context.window.VoyageSoundscape();assert.equal(instances,0);assert.equal(sound.enabled,false);
  await sound.start();assert.equal(instances,1);assert.equal(sound.enabled,true);
  sound.setVolume(5);assert.equal(sound.volume,1);sound.setVolume(-1);assert.equal(sound.volume,0);
  sound.setWeather('storm');context.document.hidden=true;await sound.visibility();assert.equal(sound.context.state,'suspended');
  context.document.hidden=false;await sound.visibility();assert.equal(sound.context.state,'running');
  await sound.stop();assert.equal(sound.enabled,false);assert.equal(sound.context.state,'suspended');
});
test('weather mode, failure fallback, manual choice and hourly boundaries coexist',()=>{
  let now=Date.UTC(2026,9,23,5,29), saved=null, timer;
  const listeners={};const root={dataset:{}};
  const choice={value:'',addEventListener:(n,f)=>listeners[n]=f};const status={textContent:''};const meta={};
  const window={addEventListener:(n,f)=>listeners[n]=f,dispatchEvent:event=>listeners[event.type]?.(event)};
  const context={window,document:{documentElement:root,querySelector:s=>s==='#theme-choice'?choice:s==='#theme-status'?status:meta,addEventListener:(n,f)=>listeners[n]=f},localStorage:{getItem:()=>saved,setItem:(k,v)=>saved=v},Date:class extends Date{static now(){return now}},Intl,CustomEvent:class{constructor(type,init){this.type=type;this.detail=init.detail}},setTimeout:(f,delay)=>{timer={f,delay};return 1},clearTimeout:()=>{}};
  vm.runInNewContext(fs.readFileSync(require.resolve('../themes.js'),'utf8'),context);
  assert.equal(choice.value,'weather');assert.equal(root.dataset.weather,'none');assert.equal(root.dataset.theme,'sunset');
  listeners['voyage-weather']({detail:{kind:'rain',theme:'midnight',summary:'Bengaluru · rain'}});assert.equal(root.dataset.weather,'rain');assert.equal(root.dataset.theme,'midnight');
  listeners['voyage-weather']({detail:null});assert.equal(root.dataset.weather,'none');assert.equal(root.dataset.theme,'sunset');
  choice.value='day';listeners.change();assert.equal(root.dataset.theme,'day');assert.equal(saved,'day');
  choice.value='auto';listeners.change();assert.equal(timer.delay,60050);
  now+=60000;timer.f();assert.equal(root.dataset.theme,'midnight');
});
