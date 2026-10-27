(() => {
  'use strict';
  const root=document.documentElement,art=document.querySelector('.hero-art');
  const panel=document.querySelector('#appearance-panel'),route=window.VoyageRoute;
  if(!art||!panel||!route)return;
  const base=new URL('assets/',document.currentScript.src);
  const scene=document.createElement('div');scene.className='sunny-journey';scene.hidden=true;scene.setAttribute('aria-hidden','true');
  const position=document.createElement('div');position.className='sunny-position';
  const wake=document.createElement('div');wake.className='sunny-wake';
  const bob=document.createElement('div');bob.className='sunny-bob';
  const rear=document.createElement('img'),front=document.createElement('img');
  for(const [image,view] of [[rear,'rear'],[front,'front']]){image.className='sunny-face sunny-'+view;image.alt='';image.width=1230;image.height=1278;image.draggable=false;bob.append(image);}
  position.append(wake,bob);scene.append(position);art.append(scene);
  const controls=document.createElement('div');controls.className='voyage-controls';
  const status=document.createElement('p');status.id='voyage-clock-status';status.textContent='Preparing the daily voyage…';
  const preview=document.createElement('button');preview.id='voyage-preview';preview.type='button';preview.textContent='Preview a full day · 40 seconds';preview.disabled=true;preview.setAttribute('aria-pressed','false');
  controls.append(status,preview);panel.append(controls);
  const cache=new Map(),clock=new Intl.DateTimeFormat('en-IN',{hour:'numeric',minute:'2-digit',timeZone:'Asia/Kolkata'});
  let token=0,ready=false,visible=true,frame=0,lastDraw=0,frozen=Date.now(),demoStart=null,demoPaused=0,lastStatus='',failed=false;
  const paused=()=>root.classList.contains('motion-off');
  let wasPaused=paused();
  function load(url){
    if(cache.has(url))return cache.get(url);
    const promise=new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(Error('Journey artwork failed to load'));image.src=url;});
    cache.set(url,promise);promise.catch(()=>cache.delete(url));return promise;
  }
  function urls(mood){return {ocean:new URL(`ocean-empty-${mood}-v1.jpg`,base).href,rear:new URL(`sunny-rear-${mood}-v1.webp`,base).href,front:new URL(`sunny-front-${mood}-v1.webp`,base).href};}
  async function artwork(){
    const id=++token,mood=['dawn','day','sunset','midnight'].includes(root.dataset.theme)?root.dataset.theme:'sunset';
    const paths=urls(mood);ready=false;failed=false;preview.disabled=true;scene.classList.add('sunny-idle');
    // Keep the previous complete scene visible while the new mood's three images load.
    try {
      await Promise.all(Object.values(paths).map(load));if(id!==token)return;
      rear.src=paths.rear;front.src=paths.front;
      art.style.backgroundImage=`url("${paths.ocean}")`;scene.hidden=false;ready=true;lastStatus='';preview.disabled=paused();
      root.classList.add('layered-voyage');syncMotion();draw(performance.now(),true);
    }catch(error){
      if(id!==token)return;failed=true;scene.hidden=true;art.style.removeProperty('background-image');
      status.textContent='Journey artwork unavailable · original scene shown.';
    }
  }
  function timestamp(now){
    if(demoStart!==null){
      const progress=Math.min(1,((demoPaused||now)-demoStart)/40000);
      if(progress>=1){demoStart=null;preview.textContent='Preview a full day · 40 seconds';preview.setAttribute('aria-pressed','false');return Date.now();}
      const midnight=Date.now()+route.IST;
      return Math.floor(midnight/route.DAY)*route.DAY-route.IST+route.DEPARTURE+progress*route.DAY;
    }
    return paused()?frozen:Date.now();
  }
  function draw(now,force=false){
    if(force)cancelAnimationFrame(frame);
    frame=0;if(!ready||document.hidden||!visible)return;
    // Route movement is very slow; four updates/second suffice. Bobbing uses CSS.
    if(force||now-lastDraw>=250){
      lastDraw=now;const time=timestamp(now),state=route.state(time),layout=route.layout(state,art.clientWidth,art.clientHeight);
      position.style.setProperty('--ship-x',layout.x.toFixed(2)+'px');position.style.setProperty('--ship-y',layout.y.toFixed(2)+'px');
      position.style.setProperty('--ship-width',layout.width.toFixed(2)+'px');position.style.setProperty('--front-opacity',state.front.toFixed(4));
      scene.dataset.phase=state.phase.toFixed(6);scene.dataset.shipWidth=layout.width.toFixed(2);scene.dataset.direction=state.returning?'returning':'outbound';
      const text=(demoStart!==null?'Preview · ':'Daily voyage · ')+clock.format(new Date(time))+' IST · '+(state.returning?'sailing home':'sailing outward')+' · returns 6 am';
      if(text!==lastStatus){lastStatus=text;status.textContent=text;}
    }
    if(!paused())schedule();
  }
  function schedule(){if(!frame&&ready&&visible&&!document.hidden)frame=requestAnimationFrame(draw);}
  function syncMotion(){
    const stop=paused()||document.hidden||!visible;
    scene.classList.toggle('sunny-idle',stop);preview.disabled=!ready||paused();
    if(stop){cancelAnimationFrame(frame);frame=0;if(demoStart!==null&&!demoPaused)demoPaused=performance.now();if(paused()&&!wasPaused)frozen=Date.now();}
    else {if(demoPaused){if(demoStart!==null)demoStart+=performance.now()-demoPaused;demoPaused=0;}lastDraw=0;schedule();}
    wasPaused=paused();
  }
  preview.addEventListener('click',()=>{
    if(!ready||paused())return;
    if(demoStart===null){demoStart=performance.now();preview.textContent='Return to actual time';preview.setAttribute('aria-pressed','true');}
    else{demoStart=null;preview.textContent='Preview a full day · 40 seconds';preview.setAttribute('aria-pressed','false');}
    draw(performance.now(),true);
  });
  new MutationObserver(records=>{
    if(records.some(r=>r.attributeName==='data-theme'))artwork();
    if(records.some(r=>r.attributeName==='class'))syncMotion();
  }).observe(root,{attributes:true,attributeFilter:['data-theme','class']});
  new ResizeObserver(()=>{if(ready)draw(performance.now(),true);}).observe(art);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncMotion();}).observe(art);
  document.addEventListener('visibilitychange',syncMotion);
  window.addEventListener('pageshow',()=>{syncMotion();if(failed)artwork();});
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);frame=0;});
  artwork();
})();
