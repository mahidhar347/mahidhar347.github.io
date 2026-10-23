const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const crypto=require('node:crypto');
const {build}=require('../build.cjs');
test('deployment versions every local script, stylesheet and icon with its exact content hash',()=>{
  const output=fs.mkdtempSync(path.join(os.tmpdir(),'mahidhar-build-test-'));
  build(output);
  const html=fs.readFileSync(path.join(output,'index.html'),'utf8');
  const resources=[...html.matchAll(/(?:href|src)="([^"?]+\.(?:css|js|svg|m4a))\?v=([a-f0-9]{12})"/g)];
  assert.equal(resources.length,18);
  for(const [,file,hash] of resources){
    const actual=crypto.createHash('sha256').update(fs.readFileSync(path.join(output,file))).digest('hex').slice(0,12);
    assert.equal(hash,actual);
  }
  assert.ok(fs.existsSync(path.join(output,'assets/grand-line-seascape.jpg')));
  assert.ok(!fs.existsSync(path.join(output,'weather.test.cjs')));
});
