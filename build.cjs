const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

// Keep the local preview simple, and version deployed assets by their content.
function build(output = path.join(__dirname, '_site')) {
  fs.mkdirSync(output, {recursive:true});
  const files = ['favicon.svg','style.css','map.css','effects.css','layout.css','themes.css','weather.css','usability.css','music.css','script.js','effects.js','themes.js','weather-model.js','soundscape.js','weather.js','controls.js','music.js','.nojekyll'];
  files.push('ship-voyage.css','voyage-route.js','ship-voyage.js');
  for (const file of files) fs.copyFileSync(path.join(__dirname,file),path.join(output,file));
  fs.mkdirSync(path.join(output,'assets'),{recursive:true});
  fs.copyFileSync(path.join(__dirname,'assets/grand-line-seascape.jpg'),path.join(output,'assets/grand-line-seascape.jpg'));
  for(const mood of ['dawn','day','sunset','midnight']){
    const image=`assets/seascape-real-${mood}-v1.jpg`;
    fs.copyFileSync(path.join(__dirname,image),path.join(output,image));
    for(const name of [`ocean-empty-${mood}-v1.jpg`,`sunny-front-${mood}-v1.webp`,`sunny-rear-${mood}-v1.webp`]){
      fs.copyFileSync(path.join(__dirname,'assets',name),path.join(output,'assets',name));
    }
  }
  fs.copyFileSync(path.join(__dirname,'assets/voyage-theme.m4a'),path.join(output,'assets/voyage-theme.m4a'));
  fs.copyFileSync(path.join(__dirname,'assets/MUSIC-LICENSE.md'),path.join(output,'assets/MUSIC-LICENSE.md'));
  const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8').replace(/(href|src)="([^"?]+\.(?:css|js|svg|m4a))(?:\?[^\"]*)?"/g,(match,attribute,file)=>{
    if (/^(?:https?:|\/|#)/.test(file)) return match;
    const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(output,file))).digest('hex').slice(0,12);
    return `${attribute}="${file}?v=${hash}"`;
  });
  fs.writeFileSync(path.join(output,'index.html'),html);
  return output;
}
if (require.main === module) console.log('Built static portfolio:',build());
module.exports={build};
