const {test}=require('node:test');
const assert=require('node:assert/strict');
const {voyagePosition}=require('../voyage-clock.js');
const morning=Date.parse('2026-10-23T06:00:00+05:30');
test('daily voyage starts at 6 AM IST and returns after exactly 24 hours',()=>{
  const a=voyagePosition(morning),b=voyagePosition(morning+86400000);
  assert.deepEqual(a,b);assert.equal(a.phase,0);assert.equal(a.z,1);
  assert.equal(voyagePosition(morning+43200000).phase,.5);
  assert.equal(voyagePosition(morning+43200000).z,-12);
});
test('route is continuous across midnight and across its 6 AM seam',()=>{
  for(const time of [morning,morning+18*3600000]){
    const a=voyagePosition(time-1000),b=voyagePosition(time+1000);
    assert.ok(Math.hypot(a.x-b.x,a.z-b.z)<.002);
    assert.ok(Math.abs(Math.sin(a.heading)-Math.sin(b.heading))<.001);
  }
});
test('compact route stays in its viewing area and visiting does not reset progress',()=>{
  for(let i=0;i<24;i++){
    const t=morning+i*3600000,a=voyagePosition(t,true);
    assert.deepEqual(a,voyagePosition(t,true));assert.ok(a.x>=2.6-1e-12&&a.x<=4.8+1e-12);
    assert.ok(a.z>=-12&&a.z<=1);
  }
});
