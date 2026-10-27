const {test}=require('node:test'),assert=require('node:assert/strict');
const {state,layout,DAY}=require('../voyage-route.js');
const morning=Date.parse('2026-10-27T06:00:00+05:30');
test('daily journey is tied to IST and repeats exactly after 24 hours',()=>{
  assert.deepEqual(state(morning),state(morning+DAY));assert.equal(state(morning).depth,0);
  assert.equal(state(morning+DAY/2).depth,1);
  assert.equal(state(morning+DAY/4).returning,false);assert.equal(state(morning+DAY*.75).returning,true);
});
test('outbound ship shrinks, return ship grows and views face the direction of travel',()=>{
  const hours=[0,3,6,9,12].map(h=>state(morning+h*3600000).scale);
  assert.ok(hours.every((x,i)=>!i||x<hours[i-1]));
  assert.ok(state(morning+18*3600000).scale>state(morning+12*3600000).scale);
  assert.equal(state(morning+6*3600000).front,0);assert.equal(state(morning+18*3600000).front,1);
});
test('position and scale have no jump at either end of the daily route',()=>{
  for(const time of [morning,morning+DAY/2]){
    const a=state(time-1000),b=state(time+1000),pa=layout(a,1280,920),pb=layout(b,1280,920);
    assert.ok(Math.hypot(pa.x-pb.x,pa.y-pb.y)<.1);assert.ok(Math.abs(a.scale-b.scale)<.001);
    assert.ok(Math.abs(a.front-b.front)<.01);
  }
});
test('every route stage fits mobile and desktop widths and stays below the horizon',()=>{
  for(const width of [320,390,768,1280,1920])for(let h=0;h<24;h+=.25){
    const s=state(morning+h*3600000),p=layout(s,width,920);
    assert.ok(p.x-p.width/2>=0);assert.ok(p.x+p.width/2<=width);
    assert.ok(p.y>0&&p.y<920);assert.ok(Number.isFinite(p.width));
  }
  assert.throws(()=>state(NaN));assert.throws(()=>layout(state(morning),0,920));
});
