(() => {
  'use strict';
  const audio = document.querySelector('#voyage-music');
  const controls = document.querySelector('#music-controls');
  const toggle = document.querySelector('#music-toggle');
  const status = document.querySelector('#music-status');
  const volume = document.querySelector('#music-volume');
  const label = document.querySelector('#music-volume-label');
  const storageKey = 'mahidhar-music-volume';
  const secondary = document.createElement('button');
  secondary.type = 'button'; secondary.className = 'music-inline-toggle';
  secondary.setAttribute('aria-pressed','false');
  document.querySelector('.sound-settings').append(secondary);
  document.querySelector('#appearance-panel').append(controls);
  let generation = 0;
  let loading = false;
  try {
    const saved=localStorage.getItem(storageKey);
    if(saved!==null && Number.isFinite(Number(saved)))volume.value=String(Math.max(0,Math.min(100,Number(saved))));
  } catch { /* Music works without browser storage. */ }
  function applyVolume(){audio.volume=Number(volume.value)/100;label.value=volume.value+'%';}
  applyVolume();
  function render(){
    const playing=!audio.paused;
    toggle.textContent=playing?'Ⅱ Pause background music':loading?'Cancel music loading':'♪ Play background music';
    secondary.textContent=playing?'Pause background music':loading?'Cancel music loading':'Play background music';
    for(const button of [toggle,secondary])button.setAttribute('aria-pressed',String(playing));
  }
  function pause(message='Music paused.'){
    ++generation;loading=false;audio.pause();render();status.textContent=message;
  }
  async function toggleMusic(){
    if(!audio.paused || loading){pause();return;}
    const token=++generation;loading=true;render();status.textContent='Loading the voyage soundtrack…';
    try {
      if(audio.error)audio.load();
      await audio.play();
      if(token!==generation){audio.pause();return;}
      loading=false;render();status.textContent='Playing · The Buccaneer’s Haul';
    } catch {
      if(token!==generation)return;
      loading=false;render();status.textContent='Music could not start. Tap Play to retry, or check your browser’s sound settings.';
    }
  }
  toggle.addEventListener('click',toggleMusic);secondary.addEventListener('click',toggleMusic);
  audio.addEventListener('play',()=>{
    render();window.dispatchEvent(new Event('voyage-music-play'));
  });
  audio.addEventListener('pause',()=>{render();});
  audio.addEventListener('waiting',()=>{if(!audio.paused)status.textContent='Buffering the soundtrack…';});
  audio.addEventListener('playing',()=>{if(!audio.paused)status.textContent='Playing · The Buccaneer’s Haul';});
  audio.addEventListener('error',()=>{loading=false;render();status.textContent='The soundtrack could not load. Tap Play to retry.';});
  volume.addEventListener('input',()=>{applyVolume();try{localStorage.setItem(storageKey,volume.value);}catch{}});
  window.addEventListener('voyage-ambience-play',()=>pause('Music paused while weather sounds play.'));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause('Music paused while this tab is in the background.');});
  window.addEventListener('pagehide',()=>pause());
  render();
})();
