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
  assert.equal(resources.length,21);
  for(const [,file,hash] of resources){
    const actual=crypto.createHash('sha256').update(fs.readFileSync(path.join(output,file))).digest('hex').slice(0,12);
    assert.equal(hash,actual);
  }
  assert.ok(fs.existsSync(path.join(output,'assets/grand-line-seascape.jpg')));
  for(const mood of ['dawn','day','sunset','midnight']){
    assert.ok(fs.existsSync(path.join(output,`assets/seascape-real-${mood}-v1.jpg`)));
    for(const name of [`ocean-empty-${mood}-v1.jpg`,`sunny-front-${mood}-v1.webp`,`sunny-rear-${mood}-v1.webp`])assert.ok(fs.existsSync(path.join(output,'assets',name)));
  }
  assert.ok(!fs.existsSync(path.join(output,'weather.test.cjs')));
});
test('hero moods use distinct artwork with no colour filters or synthetic tint overlays',()=>{
  const themes=fs.readFileSync(path.join(__dirname,'../themes.css'),'utf8');
  const weather=fs.readFileSync(path.join(__dirname,'../weather.css'),'utf8');
  for(const mood of ['dawn','day','sunset','midnight'])assert.ok(themes.includes(`seascape-real-${mood}-v1.jpg`));
  assert.doesNotMatch(themes+weather,/hue-rotate|sepia\(|saturate\(|grayscale\(|--mood-filter|--mood-overlay/);
  assert.match(themes,/\.hero-art:before,\.hero-art:after\{content:none\}/);
});
