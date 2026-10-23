(() => {
  'use strict';
  const themes = ['dawn', 'day', 'sunset', 'midnight'];
  const names = { dawn: 'Dawn Voyage', day: 'Grand Line', sunset: 'Golden Sunset', midnight: 'Midnight Seas' };
  const colors = { dawn: '#19383e', day: '#073b50', sunset: '#302039', midnight: '#080f29' };
  const preferenceKey = 'mahidhar-ocean-mood';
  const root = document.documentElement;
  const select = document.querySelector('#theme-choice');
  const status = document.querySelector('#theme-status');
  const meta = document.querySelector('meta[name="theme-color"]');
  const hourLength = 3600000;
  const indiaOffset = 19800000;
  let timer;
  let preference = 'auto';
  const valid = value => value === 'auto' || themes.includes(value);
  // IST boundaries keep everyone on the same voyage, regardless of their device timezone.
  const themeForTime = now => themes[Math.floor((now + indiaOffset) / hourLength) % themes.length];
  const nextBoundary = now => hourLength - ((now + indiaOffset) % hourLength);
  try { const saved = localStorage.getItem(preferenceKey); if (valid(saved)) preference = saved; } catch { /* Themes still work when storage is unavailable. */ }
  const update = () => {
    clearTimeout(timer);
    const now = Date.now();
    const active = preference === 'auto' ? themeForTime(now) : preference;
    root.dataset.theme = active;
    select.value = preference;
    meta.content = colors[active];
    const text = names[active] + (preference === 'auto' ? ' · changes hourly, IST' : ' · your chosen mood');
    if (status.textContent !== text) status.textContent = text;
    if (preference === 'auto') {
      status.title = 'Next mood at ' + new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date(now + nextBoundary(now))) + ' IST';
      // Schedule against the clock, so opening at 10:59 changes at 11:00, not 11:59.
      timer = setTimeout(update, nextBoundary(now) + 50);
    } else status.title = 'Choose Automatic to resume hourly changes.';
  };
  select.addEventListener('change', () => {
    preference = valid(select.value) ? select.value : 'auto';
    try { localStorage.setItem(preferenceKey, preference); } catch { /* Keep the choice for this visit. */ }
    update();
  });
  window.addEventListener('storage', event => {
    if (event.key === preferenceKey || event.key === null) { preference = valid(event.newValue) ? event.newValue : 'auto'; update(); }
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
  window.addEventListener('pageshow', update);
  window.addEventListener('focus', update);
  update();
})();
