(() => {
  'use strict';
  const videoId = 'YoeP9w5UIlg';
  const panel = document.querySelector('#music-radio');
  const play = document.querySelector('#music-play');
  const status = document.querySelector('#music-status');
  const volume = document.querySelector('#music-volume');
  let player = null, ready = false, playing = false, generation = 0, apiPromise = null;
  const launch = document.createElement('button');
  launch.id = 'music-open'; launch.type = 'button'; launch.textContent = '♪ One Piece music ↗';
  launch.setAttribute('aria-controls','music-radio');launch.setAttribute('aria-expanded','false');
  document.querySelector('#appearance-panel').append(launch);
  const settingsLaunch = document.createElement('button');
  settingsLaunch.type='button';settingsLaunch.className='music-launch-inline';settingsLaunch.textContent='Play One Piece music';
  document.querySelector('.sound-settings').append(settingsLaunch);
  function loadAPI() {
    if (window.YT?.Player) return Promise.resolve();
    if (apiPromise) return apiPromise;
    apiPromise = new Promise((resolve,reject)=>{
      const previous = window.onYouTubeIframeAPIReady;
      const timeout = setTimeout(()=>{apiPromise=null;reject(new Error('Player load timed out'));},15000);
      window.onYouTubeIframeAPIReady=()=>{clearTimeout(timeout);if(typeof previous==='function')previous();resolve();};
      const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;
      script.onerror=()=>{clearTimeout(timeout);apiPromise=null;script.remove();reject(new Error('Player API unavailable'));};
      document.head.append(script);
    });
    return apiPromise;
  }
  function pause(message) {
    if (ready) player.pauseVideo();
    playing=false;if(ready)play.textContent='Play music';
    if(message)status.textContent=message;
  }
  function close(restoreFocus=true) {
    ++generation;ready=false;playing=false;
    player?.destroy();player=null;panel.hidden=true;launch.setAttribute('aria-expanded','false');
    const holder=document.createElement('div');holder.id='onepiece-player';document.querySelector('.music-video').replaceChildren(holder);
    if(restoreFocus){const mobile=document.querySelector('#appearance-toggle');(mobile.getClientRects().length?mobile:launch).focus();}
  }
  async function open() {
    document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());
    document.querySelector('#appearance-panel').classList.remove('is-open');
    document.querySelector('#appearance-toggle').setAttribute('aria-expanded','false');
    panel.hidden=false;launch.setAttribute('aria-expanded','true');document.querySelector('#music-close').focus();
    if(player){status.textContent='Use the player or Play music to continue.';return;}
    const token=++generation;
    ready=false;play.disabled=true;play.textContent='Loading player…';status.textContent='Connecting to the official YouTube upload…';
    try {
      await loadAPI();if(token!==generation||panel.hidden)return;
      player=new window.YT.Player('onepiece-player',{
        host:'https://www.youtube-nocookie.com',width:'100%',height:'200',videoId,
        playerVars:{playsinline:1,controls:1,autoplay:0,loop:1,playlist:videoId,rel:0,...(location.protocol==='https:'||location.protocol==='http:'?{origin:location.origin}:{})},
        events:{
          onReady:event=>{
            if(token!==generation)return;
            ready=true;play.disabled=false;play.textContent='Play music';event.target.setVolume(Number(volume.value));
            status.textContent='Press Play to start the music. You can keep browsing with this player open.';
            if(!document.hidden)event.target.playVideo();
          },
          onStateChange:event=>{
            if(token!==generation)return;
            playing=event.data===1;
            play.textContent=playing?'Pause music':'Play music';
            if(playing){status.textContent='Playing · We Are! · Hiroshi Kitadani';window.dispatchEvent(new Event('voyage-music-play'));}
            else if(event.data===2)status.textContent='Music paused.';
            else if(event.data===0)status.textContent='Track finished. Press Play to listen again.';
          },
          onAutoplayBlocked:()=>{if(token===generation)status.textContent='Press Play inside the YouTube player to start the music.';},
          onError:()=>{if(token!==generation)return;ready=false;playing=false;play.disabled=false;play.textContent='Retry player';status.textContent='This upload cannot play here right now. Retry or use the official YouTube link below.';}
        }
      });
    } catch {
      if(token!==generation)return;
      play.disabled=false;play.textContent='Retry player';status.textContent='YouTube could not load. Retry or open the official upload below.';
    }
  }
  launch.addEventListener('click',open);settingsLaunch.addEventListener('click',open);
  play.addEventListener('click',()=>{
    if(!ready){close(false);open();return;}
    if(playing)pause('Music paused.');else player.playVideo();
  });
  volume.addEventListener('input',()=>{document.querySelector('#music-volume-label').value=volume.value+'%';if(ready)player.setVolume(Number(volume.value));});
  document.querySelector('#music-close').addEventListener('click',()=>close());
  panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.stopPropagation();close();}});
  window.addEventListener('voyage-ambience-play',()=>pause('Music paused while weather sounds are enabled.'));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause('Music paused while this tab is in the background.');});
  // Keep the official video visible: modal overlays pause it rather than hiding playback.
  const observer=new MutationObserver(()=>{if(document.querySelector('dialog[open]'))pause('Music paused while a dialog is open.');});
  document.querySelectorAll('dialog').forEach(dialog=>observer.observe(dialog,{attributes:true,attributeFilter:['open']}));
  window.addEventListener('pagehide',()=>close(false));
})();
