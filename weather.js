(() => {
  'use strict';
  const root = document.documentElement, choice = document.querySelector('#theme-choice');
  const dialog = document.querySelector('#weather-dialog'), details = document.querySelector('#weather-details');
  const soundButton = document.querySelector('#sound-toggle'), soundStatus = document.querySelector('#sound-status');
  const sound = new window.VoyageSoundscape();
  let coordinates = {latitude:12.97, longitude:77.59}, locationName = 'Bengaluru';
  let timer, controller, requestId = 0, lastSuccess = 0, weather = null;
  const refreshPeriod = 15 * 60 * 1000;
  const active = () => choice.value === 'weather';
  const publish = value => window.dispatchEvent(new CustomEvent('voyage-weather', {detail:value}));
  const ocean = document.querySelector('.hero');
  const rain = document.createElement('div'); rain.className = 'weather-particles'; rain.setAttribute('aria-hidden','true');
  for (let i=0;i<36;i++) { const drop = document.createElement('i'); drop.style.cssText=`--drop-x:${(i*29)%100}%;--drop-delay:-${i*.37}s;--drop-duration:${.65+i%5*.13}s`; rain.append(drop); }
  ocean.append(rain);
  const mist = document.createElement('div'); mist.className='weather-mist';mist.setAttribute('aria-hidden','true');ocean.append(mist);
  async function stopSound(message = 'Sound is off.') {
    try { await sound.stop(); } catch { /* The page remains usable if audio suspension fails. */ }
    soundButton.textContent='Enable sound';soundButton.setAttribute('aria-pressed','false');soundStatus.textContent=message;
  }
  async function refresh(force=false) {
    clearTimeout(timer);
    if (!active()) return;
    if (!force && weather && Date.now()-lastSuccess < refreshPeriod) {
      publish(weather);timer=setTimeout(refresh,refreshPeriod-(Date.now()-lastSuccess)+50);return;
    }
    controller?.abort();controller=new AbortController();const currentController=controller;
    const id=++requestId;
    const timeout=setTimeout(()=>currentController.abort(),10000);
    details.textContent=`Checking ${locationName}’s horizon…`;
    try {
      const params = new URLSearchParams({...coordinates,current:'temperature_2m,is_day,weather_code,wind_speed_10m',timezone:'auto',forecast_days:'1',timeformat:'unixtime'});
      const response=await fetch('https://api.open-meteo.com/v1/forecast?'+params,{signal:currentController.signal,credentials:'omit',referrerPolicy:'no-referrer'});
      if (!response.ok) throw new Error('Weather request failed');
      const data=await response.json();const scene=window.VoyageWeather.describe(data.current);
      if(!Number.isFinite(data.current.time)||Math.abs(Date.now()/1000-data.current.time)>7200)throw new Error('Weather data is stale');
      if (id!==requestId || !active()) return;
      const units=data.current_units;
      if (units?.temperature_2m!=='°C' || units?.wind_speed_10m!=='km/h') throw new Error('Unexpected weather units');
      weather={...scene,summary:`${locationName} · ${scene.label} · ${scene.temperature}°C`};
      lastSuccess=Date.now();publish(weather);sound.setWeather(scene.kind);
      details.textContent=`${locationName}: ${scene.label}, ${scene.temperature}°C, wind ${scene.wind} km/h. Updated ${new Intl.DateTimeFormat(undefined,{hour:'numeric',minute:'2-digit'}).format(new Date())}. Current conditions are modeled, not a live camera or sensor.`;
      if(sound.enabled)soundStatus.textContent=`Sound on · ${scene.label.toLowerCase()}.`;
    } catch (error) {
      if(id!==requestId || !active())return;
      weather=null;lastSuccess=0;publish(null);
      details.textContent='Weather is temporarily unavailable. The voyage is using the hourly mood cycle. You can retry with Use Bengaluru.';
      await stopSound('Sound is off while current weather is unavailable.');
    } finally {
      clearTimeout(timeout);
      if(id===requestId && active())timer=setTimeout(refresh,refreshPeriod);
    }
  }
  window.addEventListener('voyage-mode',()=>{
    if(active())refresh();
    else { clearTimeout(timer);controller?.abort();requestId++;root.dataset.weather='none';stopSound('Choose Live weather to enable the weather soundscape.'); }
  });
  document.querySelector('#weather-open').addEventListener('click',()=>dialog.showModal());
  document.querySelector('#weather-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();}});
  function chooseWeather() {choice.value='weather';choice.dispatchEvent(new Event('change'));}
  document.querySelector('#weather-home').addEventListener('click',()=>{
    controller?.abort();requestId++;weather=null;lastSuccess=0;publish(null);
    coordinates={latitude:12.97,longitude:77.59};locationName='Bengaluru';chooseWeather();
  });
  const locate=document.querySelector('#weather-location');
  locate.addEventListener('click',()=>{
    if(!navigator.geolocation){details.textContent='Location is unavailable in this browser. Use Bengaluru instead.';return;}
    locate.disabled=true;details.textContent='Waiting for your browser’s location permission…';
    navigator.geolocation.getCurrentPosition(position=>{
      locate.disabled=false;controller?.abort();requestId++;weather=null;lastSuccess=0;publish(null);
      coordinates={latitude:Math.round(position.coords.latitude*10)/10,longitude:Math.round(position.coords.longitude*10)/10};
      locationName='Your area';chooseWeather();
    },()=>{locate.disabled=false;details.textContent='Location was not shared. Your previous weather source remains selected. Choose Use Bengaluru to reset it.';},{enableHighAccuracy:false,timeout:12000,maximumAge:900000});
  });
  soundButton.addEventListener('click',async()=>{
    if(sound.enabled){await stopSound();return;}
    if(!active()||!weather){soundStatus.textContent='Choose Live weather and wait for a current forecast before enabling sound.';return;}
    soundButton.disabled=true;
    try {sound.setWeather(weather.kind);await sound.start();if(!active()||!weather||document.hidden){await stopSound();return;}soundButton.textContent='Mute sound';soundButton.setAttribute('aria-pressed','true');soundStatus.textContent=`Sound on · ${weather.label.toLowerCase()}.`;}
    catch(error){await stopSound('Audio could not start. Try Enable sound again, or check your browser’s audio settings.');}
    finally{soundButton.disabled=false;}
  });
  document.querySelector('#sound-volume').addEventListener('input',event=>{
    const value=Number(event.target.value);sound.setVolume(value/100);document.querySelector('#sound-volume-label').value=value+'%';
  });
  document.addEventListener('visibilitychange',()=>{sound.visibility().catch(()=>stopSound('Tap Enable sound to resume.'));if(!document.hidden&&active())refresh();});
  window.addEventListener('pagehide',()=>{stopSound();clearTimeout(timer);controller?.abort();requestId++;});
  window.addEventListener('pageshow',()=>{if(active())refresh();});
  refresh();
})();
