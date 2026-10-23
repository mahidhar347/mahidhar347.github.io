(() => {
  'use strict';
  const themes = ['dawn', 'day', 'sunset', 'midnight'];
  const names = { dawn: 'Dawn Voyage', day: 'Grand Line', sunset: 'Golden Sunset', midnight: 'Midnight Seas' };
  const colors = { dawn: '#19383e', day: '#073b50', sunset: '#302039', midnight: '#080f29' };
  const preferenceKey = 'mahidhar-ocean-mood-v2';
  const root = document.documentElement;
  const select = document.querySelector('#theme-choice');
  const status = document.querySelector('#theme-status');
  const meta = document.querySelector('meta[name="theme-color"]');
  const hourLength = 3600000;
  const indiaOffset = 19800000;
  let timer;
  let preference = 'weather';
  let weatherState = null;
  let weatherLoading = true;
  const valid = value => value === 'weather' || value === 'auto' || themes.includes(value);
  // IST boundaries keep everyone on the same voyage, regardless of their device timezone.
  const themeForTime = now => themes[Math.floor((now + indiaOffset) / hourLength) % themes.length];
  const nextBoundary = now => hourLength - ((now + indiaOffset) % hourLength);
  try {
    const saved = localStorage.getItem(preferenceKey);
    const legacy = localStorage.getItem('mahidhar-ocean-mood');
    if (valid(saved)) preference = saved;
    else if (themes.includes(legacy)) preference = legacy;
  } catch { /* Themes still work when storage is unavailable. */ }
  const update = () => {
    clearTimeout(timer);
    const now = Date.now();
    const active = preference === 'weather' ? (weatherState?.theme || themeForTime(now)) : preference === 'auto' ? themeForTime(now) : preference;
    root.dataset.theme = active;
    select.value = preference;
    meta.content = colors[active];
    root.dataset.mode = preference;
    root.dataset.weather = preference === 'weather' && weatherState ? weatherState.kind : 'none';
    const text = preference === 'weather' ? (weatherState?.summary || (weatherLoading ? 'Checking the weather…' : 'Weather unavailable · hourly mood for now')) : names[active] + (preference === 'auto' ? ' · changes hourly, IST' : ' · your chosen mood');
    if (status.textContent !== text) status.textContent = text;
    if (preference === 'auto' || (preference === 'weather' && !weatherState)) {
      status.title = 'Next mood at ' + new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date(now + nextBoundary(now))) + ' IST';
      // Schedule against the clock, so opening at 10:59 changes at 11:00, not 11:59.
      timer = setTimeout(update, nextBoundary(now) + 50);
    } else status.title = preference === 'weather' ? 'Current modeled weather · refreshed every 15 minutes.' : 'Choose Automatic to resume hourly changes.';
  };
  select.addEventListener('change', () => {
    preference = valid(select.value) ? select.value : 'auto';
    try { localStorage.setItem(preferenceKey, preference); } catch { /* Keep the choice for this visit. */ }
    update();
    window.dispatchEvent(new CustomEvent('voyage-mode', { detail: preference }));
  });
  window.addEventListener('voyage-weather', event => { weatherState = event.detail; weatherLoading = false; update(); });
  window.addEventListener('voyage-weather-loading', () => { weatherLoading = true; update(); });
  window.addEventListener('storage', event => {
    if (event.key === preferenceKey || event.key === null) { preference = valid(event.newValue) ? event.newValue : 'weather'; update(); window.dispatchEvent(new CustomEvent('voyage-mode', { detail: preference })); }
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
  window.addEventListener('pageshow', update);
  window.addEventListener('focus', update);
  update();
})();
