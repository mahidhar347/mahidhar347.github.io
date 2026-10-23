/* Real geometry, flowing water and shared wave sampling—not image colour filters.
   Three.js is pinned; if the CDN or WebGL is unavailable the artwork stays visible. */
(async () => {
  const root = document.documentElement, hero = document.querySelector('.hero');
  try {
    const T = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
    const renderer = new T.WebGLRenderer({antialias:true, alpha:false, powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    const canvas = renderer.domElement;
    canvas.className = 'ocean-canvas'; canvas.setAttribute('aria-hidden','true');
    hero.prepend(canvas);
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(46,1,.1,240);
    camera.position.set(0,7,25); camera.lookAt(0,2,-16);
    const light = new T.DirectionalLight(0xffe3b2,3.5); light.position.set(-12,22,-35); scene.add(light);
    const ambient = new T.HemisphereLight(0xb2dcff,0x1c4145,2.1); scene.add(ambient);
    const waves = [[.19,.45,1,.85],[.10,.87,-.6,1.2],[.055,1.6,.5,1.6]];
    const uniforms = {time:{value:0},strength:{value:1},sun:{value:new T.Vector3(-.3,.4,-.8).normalize()},sky:{value:new T.Color('#8fc9db')},deep:{value:new T.Color('#035367')},haze:{value:new T.Color('#b5d5d4')},cloud:{value:0}};
    const waveGLSL = `float wave(vec2 p){return strength*(.19*sin(p.x*.45+p.y+time*.85)+.10*sin(p.x*.87-p.y*.6+time*1.2)+.055*sin(p.x*1.6+p.y*.5+time*1.6));}`;
    const ocean = new T.Mesh(new T.PlaneGeometry(230,230,180,180), new T.ShaderMaterial({
      uniforms, vertexShader:`uniform float time; uniform float strength; varying vec3 pos; ${waveGLSL} void main(){vec3 p=position; p.z=wave(p.xy); pos=vec3(p.x,p.z,-p.y); gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
      fragmentShader:`uniform float time;uniform float strength;uniform vec3 sun;uniform vec3 sky;uniform vec3 deep;uniform vec3 haze;varying vec3 pos;${waveGLSL}
      void main(){vec2 p=vec2(pos.x,-pos.z);float e=.07;vec3 n=normalize(vec3(-(wave(p+vec2(e,0.))-wave(p-vec2(e,0.)))/(2.*e),1.,(wave(p+vec2(0.,e))-wave(p-vec2(0.,e)))/(2.*e)));vec3 v=normalize(cameraPosition-pos);float f=pow(1.-max(dot(n,v),0.),4.);float spec=pow(max(dot(reflect(-sun,n),v),0.),180.);float rip=sin(p.x*19.+sin(p.y*14.+time))*sin(p.y*22.-time*2.);vec3 c=mix(deep,sky,.16+.7*f)+vec3(1.,.84,.57)*spec*.9+vec3(.06,.14,.13)*rip*.1;float fog=1.-exp(-length(cameraPosition-pos)*.009);gl_FragColor=vec4(mix(c,haze,fog),1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`
    }));
    ocean.rotation.x=-Math.PI/2; scene.add(ocean);
    const sky = new T.Mesh(new T.SphereGeometry(180,32,20), new T.ShaderMaterial({side:T.BackSide, uniforms,
      vertexShader:'varying vec3 dir;void main(){dir=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:`uniform vec3 sky;uniform vec3 haze;uniform vec3 sun;uniform float cloud;uniform float time;varying vec3 dir;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
      void main(){vec3 d=normalize(dir);vec3 c=mix(haze,sky,smoothstep(0.,.65,d.y));float s=pow(max(dot(d,sun),0.),800.);c+=vec3(1.,.7,.35)*s*4.;vec2 p=d.xz/max(.12,d.y)*2.;float n=noise(p+time*.007)*.6+noise(p*2.3+time*.012)*.3+noise(p*5.)*.1;float clouds=smoothstep(.52-cloud*.16,.74-cloud*.1,n)*smoothstep(.01,.18,d.y);c=mix(c,mix(vec3(.94),vec3(.35),cloud),clouds*.8);gl_FragColor=vec4(c,1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`
    })); scene.add(sky);
    const wood = new T.MeshStandardMaterial({color:0x3c2117,roughness:.88});
    const trim = new T.MeshStandardMaterial({color:0xa67940,roughness:.7});
    const sailMat = new T.MeshStandardMaterial({color:0xeee2c2,roughness:1,side:T.DoubleSide});
    const boat = new T.Group(); scene.add(boat);
    // Tapered hull rings give the bow and stern an actual curved silhouette.
    const vertices=[], indices=[];
    for(let i=0;i<=16;i++){
      const z=(i/16-.5)*5.4, width=.12+Math.sin(i/16*Math.PI)*.95;
      for(let j=0;j<=12;j++){const a=j/12*Math.PI;vertices.push(Math.cos(a)*width,.25-Math.sin(a)*.95,z);}
    }
    for(let i=0;i<16;i++)for(let j=0;j<12;j++){const a=i*13+j;indices.push(a,a+1,a+13,a+1,a+14,a+13);}
    const hullGeo=new T.BufferGeometry();hullGeo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));hullGeo.setIndex(indices);hullGeo.computeVertexNormals();
    const hull=new T.Mesh(hullGeo,wood);hull.material.side=T.DoubleSide;boat.add(hull);
    function beam(a,b,r,mat,parent=boat){const start=new T.Vector3(...a),end=new T.Vector3(...b),v=end.clone().sub(start);const m=new T.Mesh(new T.CylinderGeometry(r,r,v.length(),8),mat);m.position.copy(start.add(end).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());parent.add(m);return m;}
    const deck=new T.Mesh(new T.BoxGeometry(1.55,.12,3.8),trim);deck.position.y=.22;boat.add(deck);
    beam([0,.2,0],[0,5,0],.065,wood);beam([-1.65,4.3,0],[1.65,4.3,0],.045,wood);
    beam([0,.3,-2.3],[0,1,-3.5],.045,wood);
    const sailGeo=new T.PlaneGeometry(3,3,20,20);const sail=new T.Mesh(sailGeo,sailMat);sail.position.set(0,2.8,.1);boat.add(sail);
    const rope=new T.MeshStandardMaterial({color:0xaaa184,roughness:1});
    for(const x of [-.8,.8]){beam([x,.4,1.8],[0,4.9,0],.012,rope);beam([x,.4,-1.8],[0,4.9,0],.012,rope);beam([x,.5,-1.8],[x,.5,1.8],.025,trim);}
    // Distant cliff, with a continuous vertical stream and spray at its foot.
    const cliff = new T.MeshStandardMaterial({color:0x374b40,roughness:1,flatShading:true});
    for(let i=0;i<9;i++){
      const height=4+Math.sin(i*1.8)*1.8;
      const rock=new T.Mesh(new T.CylinderGeometry(2.5,4,height,9,3),cliff);
      rock.position.set(11+i*3,height/2-1,-40-Math.sin(i)*2);scene.add(rock);
    }
    const fallU={time:uniforms.time,tint:{value:new T.Color('#cbe8e6')}};
    const fall=new T.Mesh(new T.PlaneGeometry(.95,5.2,10,30),new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:fallU,
      vertexShader:'varying vec2 uvv;uniform float time;void main(){uvv=uv;vec3 p=position;p.x+=sin(uv.y*20.-time*5.)*.035;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}',
      fragmentShader:'varying vec2 uvv;uniform float time;uniform vec3 tint;void main(){float edge=smoothstep(0.,.17,uvv.x)*smoothstep(1.,.83,uvv.x);float strands=.5+.5*sin(uvv.x*85.+sin(uvv.y*18.+time*9.));float drops=.6+.4*sin(uvv.y*85.+time*25.+uvv.x*13.);gl_FragColor=vec4(tint*(.7+.3*strands),edge*(.45+.35*strands+.2*drops));}'
    }));fall.position.set(18,2.1,-35.8);scene.add(fall);
    const count=150, sprayGeo=new T.BufferGeometry(), sprayPos=new Float32Array(count*3);
    sprayGeo.setAttribute('position',new T.BufferAttribute(sprayPos,3));
    const spray=new T.Points(sprayGeo,new T.PointsMaterial({color:0xd7eeed,size:.11,transparent:true,opacity:.38,depthWrite:false}));scene.add(spray);
    function height(x,z,t){return waves.reduce((sum,[a,kx,kz,speed])=>sum+a*Math.sin(x*kx-z*kz+t*speed),0)*uniforms.strength.value;}
    let time=0,last=0,frame=0,visible=true,dirty=true;
    function palette(){
      const theme=root.dataset.theme||'day', weather=root.dataset.weather;
      const p={day:['#78b8d8','#b8d6d4','#035467',3.5,2.1,.45],dawn:['#9fabbf','#e1c7bb','#244b5b',2,1.6,.20],sunset:['#665e8d','#e9ac84','#174451',2.8,1.4,.12],midnight:['#080f29','#24384c','#061b2c',.35,.7,.1]}[theme];
      uniforms.sky.value.set(p[0]);uniforms.haze.value.set(p[1]);uniforms.deep.value.set(p[2]);uniforms.sun.value.set(-.3,p[5],-.8).normalize();
      const storm=['rain','storm'].includes(weather);uniforms.cloud.value=storm?1:['cloud','fog','snow'].includes(weather)?.7:.1;
      uniforms.strength.value=weather==='storm'?2.2:weather==='wind'?1.7:1;
      light.intensity=p[3]*(storm?.4:1);ambient.intensity=p[4];scene.fog=new T.Fog(p[1],35,130);fallU.tint.value.set(theme==='midnight'?'#648caa':'#d9efec');dirty=true;schedule();
    }
    function resize(){const w=hero.clientWidth,h=hero.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.fov=w<700?57:46;camera.updateProjectionMatrix();dirty=true;schedule();}
    function draw(now){
      frame=0;if(document.hidden||!visible)return;
      const paused=root.classList.contains('motion-off');
      if(!paused&&last)time+=Math.min((now-last)/1000,.05);last=now;
      if(!paused||dirty){
        uniforms.time.value=time;
        boat.position.set(camera.aspect<.8?3.7:7.4,height(camera.aspect<.8?3.7:7.4,1,time)+.15,1);boat.rotation.y=-.45;
        const x=boat.position.x,z=boat.position.z;
        boat.rotation.z=Math.atan2(height(x+.8,z,time)-height(x-.8,z,time),1.6)*.7;
        boat.rotation.x=-Math.atan2(height(x,z+1.8,time)-height(x,z-1.8,time),3.6)*.8;
        const a=sailGeo.attributes.position;
        for(let i=0;i<a.count;i++)a.setZ(i,.28*Math.sin((a.getX(i)/3+.5)*Math.PI)*Math.sin((a.getY(i)/3+.5)*Math.PI)+Math.sin(time*1.8+a.getX(i)*3)*.035);
        a.needsUpdate=true;sailGeo.computeVertexNormals();
        for(let i=0;i<count;i++){const life=(time*.36+i*.618)%1,angle=i*2.4;sprayPos[i*3]=18+Math.cos(angle)*life*1.6;sprayPos[i*3+1]=.05+Math.sin(life*Math.PI)*.55;sprayPos[i*3+2]=-35.4+Math.sin(angle)*life*.8;}
        sprayGeo.attributes.position.needsUpdate=true;renderer.render(scene,camera);dirty=false;
        if(!root.classList.contains('ocean-live'))root.classList.add('ocean-live');canvas.dataset.sceneTime=time.toFixed(2);
      }
      if(!paused)schedule();
    }
    function schedule(){if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(draw);}
    new ResizeObserver(resize).observe(hero);
    new MutationObserver(palette).observe(root,{attributes:true,attributeFilter:['data-theme','data-weather','class']});
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;if(visible){dirty=true;schedule();}else{cancelAnimationFrame(frame);frame=0;}}).observe(hero);
    document.addEventListener('visibilitychange',()=>{last=0;if(document.hidden){cancelAnimationFrame(frame);frame=0;}else schedule();});
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(frame);frame=0;root.classList.remove('ocean-live');});
    canvas.addEventListener('webglcontextrestored',()=>{dirty=true;schedule();});
    palette();resize();
  } catch(error) {console.warn('Live ocean unavailable; keeping the illustrated fallback.',error);}
})();
