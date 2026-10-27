const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const route=require('../voyage-route.js');
const tick=()=>new Promise(r=>setImmediate(r));
function harness({fail=false}={}){
  const observers=[],listeners={},frames=new Map(),elements=[];let nextFrame=0,now=1000;
  const el=()=>{
    const classes=new Set(),properties={};
    const e={hidden:false,dataset:{},children:[],listeners:{},clientWidth:1280,clientHeight:920,style:{setProperty:(k,v)=>properties[k]=v,removeProperty:k=>delete properties[k]},properties,
      classList:{contains:k=>classes.has(k),add:k=>classes.add(k),toggle:(k,on)=>{if(on===undefined)on=!classes.has(k);on?classes.add(k):classes.delete(k);}},
      setAttribute(k,v){this[k]=v;},append(...kids){this.children.push(...kids);},addEventListener(k,f){this.listeners[k]=f;}};
    elements.push(e);return e;
  };
  const root=el();root.dataset.theme='day';const art=el(),panel=el();
  const document={documentElement:root,currentScript:{src:'https://example.com/ship-voyage.js?v=test'},hidden:false,createElement:el,querySelector:s=>s==='.hero-art'?art:panel,addEventListener:(k,f)=>listeners[k]=f};
  const context={window:{VoyageRoute:route,addEventListener:(k,f)=>listeners[k]=f},document,Date,Intl,URL,Map,Promise,Image:class{set src(value){queueMicrotask(()=>fail?this.onerror():this.onload());}},
    performance:{now:()=>now},requestAnimationFrame:f=>{const id=++nextFrame;frames.set(id,f);return id;},cancelAnimationFrame:id=>frames.delete(id),
    MutationObserver:class{constructor(f){observers.push(f);}observe(){}},ResizeObserver:class{constructor(f){this.f=f;}observe(){}},IntersectionObserver:class{constructor(f){this.f=f;}observe(){}},};
  vm.runInNewContext(fs.readFileSync(require.resolve('../ship-voyage.js'),'utf8'),context);
  return{document,root,art,panel,frames,listeners,observers,elements,setNow:v=>now=v};
}
test('loads a complete boat-free scene with matched front/rear images and a live clock',async()=>{
  const h=harness();await tick();const scene=h.art.children[0];
  assert.equal(scene.hidden,false);assert.match(h.art.style.backgroundImage,/ocean-empty-day-v1.jpg/);
  const images=h.elements.filter(e=>e.className?.startsWith('sunny-face'));
  assert.ok(images.every(i=>i.src.includes('-day-v2.webp')));assert.ok(scene.dataset.phase);
  assert.match(h.elements.find(e=>e.id==='voyage-clock-status').textContent,/Daily voyage/);
});
test('motion-off freezes route updates and disables the preview',async()=>{
  const h=harness();await tick();h.root.classList.add('motion-off');h.observers[0]([{attributeName:'class'}]);
  assert.equal(h.frames.size,0);assert.equal(h.elements.find(e=>e.id==='voyage-preview').disabled,true);
});
test('full-day preview starts explicitly and returns to clock time',async()=>{
  const h=harness();await tick();const button=h.elements.find(e=>e.id==='voyage-preview');
  button.listeners.click();assert.equal(button['aria-pressed'],'true');assert.equal(h.art.children[0].dataset.phase,'0.000000');
  assert.equal(h.frames.size,1);
  button.listeners.click();assert.equal(button['aria-pressed'],'false');
  assert.equal(h.frames.size,1);
  assert.match(h.elements.find(e=>e.id==='voyage-clock-status').textContent,/Daily voyage/);
});
test('artwork failure hides the extra ship and retains the original scene',async()=>{
  const h=harness({fail:true});await tick();assert.equal(h.art.children[0].hidden,true);
  assert.match(h.elements.find(e=>e.id==='voyage-clock-status').textContent,/unavailable/);
  assert.equal(h.elements.find(e=>e.id==='voyage-preview').disabled,true);
});
test('inspection selects a fixed time and a paused demo can still return to actual time',async()=>{
  const h=harness();await tick();const button=h.elements.find(e=>e.id==='voyage-preview');
  button.listeners.click();const inspect=h.elements.find(e=>e.id==='voyage-inspect');inspect.value='18';inspect.listeners.change();
  assert.equal(h.art.children[0].dataset.phase,'0.500000');
  assert.equal(h.art.children[0].children[0].properties['--front-opacity'],'1.0000');
  inspect.value='6';inspect.listeners.change();assert.equal(h.art.children[0].children[0].properties['--front-opacity'],'0.0000');
  h.root.classList.add('motion-off');h.observers[0]([{attributeName:'class'}]);
  assert.equal(button.disabled,false);button.listeners.click();assert.equal(button['aria-pressed'],'false');assert.equal(button.disabled,true);
});
