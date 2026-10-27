(() => {
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = media.matches;
  const hero = document.querySelector('.hero');
  const voyage = document.querySelector('.voyage');
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'motion-toggle';
  document.body.append(toggle);
  const applyMotion = () => {
    root.classList.toggle('motion-off', paused);
    root.classList.toggle('motion-ready', !paused);
    toggle.textContent = paused ? '▶ ENABLE MOTION' : 'Ⅱ PAUSE MOTION';
    toggle.setAttribute('aria-label', paused ? 'Enable decorative animations' : 'Pause decorative animations');
    toggle.setAttribute('aria-pressed', String(!paused));
    if (paused) {
      root.style.setProperty('--sea-x', '0px');
      root.style.setProperty('--sea-y', '0px');
    }
  };
  toggle.addEventListener('click', () => { paused = !paused; applyMotion(); });
  media.addEventListener('change', event => { paused = event.matches; applyMotion(); });
  applyMotion();
  const spray = document.createElement('div');
  spray.className = 'spray'; spray.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 18; i++) {
    const particle = document.createElement('i');
    particle.style.cssText = `--x:${(i * 37) % 100}%;--size:${2 + i % 3}px;--duration:${9 + i % 7}s;--delay:-${i * 1.7}s`;
    spray.append(particle);
  }
  hero.append(spray);
  const route = document.createElement('div');
  route.className = 'voyage-route'; route.setAttribute('aria-hidden', 'true');
  route.innerHTML = '<span class="route-trail"></span><span class="route-ship"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 47h48l-9 10H20z" fill="currentColor"/><path d="M32 7v40M29 12 12 40h17zm7 4v24h17z" fill="currentColor"/><path d="M6 61q8-5 16 0t16 0 16 0"/></svg></span>';
  voyage.querySelector('.section-top').after(route);
  const github = document.createElement('a');
  github.className = 'github-link'; github.href = 'https://github.com/mahidhar347';
  github.textContent = 'GitHub ↗';
  document.querySelector('.ink-link').after(github);
  let pending = false;
  const update = () => {
    pending = false;
    if (paused) return;
    const bounds = voyage.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (innerHeight * .8 - bounds.top) / (bounds.height + innerHeight * .2)));
    route.style.setProperty('--voyage-distance', `${fraction * Math.max(0, route.clientWidth - 46)}px`);
  };
  const schedule = () => { if (!pending) { pending = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  toggle.addEventListener('click', schedule);
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let pointerFrame = false, pointerX = 0, pointerY = 0;
  hero.addEventListener('pointermove', event => {
    if (paused || !finePointer.matches) return;
    pointerX = event.clientX; pointerY = event.clientY;
    if (pointerFrame) return;
    pointerFrame = true;
    requestAnimationFrame(() => {
      pointerFrame = false;
      if (paused) return;
      const bounds = hero.getBoundingClientRect();
      const x = pointerX / bounds.width - .5;
      const y = (pointerY - bounds.top) / bounds.height - .5;
      root.style.setProperty('--sea-x', `${x * -14}px`);
      root.style.setProperty('--sea-y', `${y * -10}px`);
      root.style.setProperty('--bearing', `${Math.atan2(y, x) * 180 / Math.PI + 90}deg`);
    });
  }, { passive: true });
  document.querySelectorAll('.journey-card, .skill-group').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (paused || !finePointer.matches) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty('--tilt-x', `${-(event.clientY - box.top - box.height / 2) / box.height * 7}deg`);
      card.style.setProperty('--tilt-y', `${(event.clientX - box.left - box.width / 2) / box.width * 7}deg`);
    }, { passive: true });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg'); card.style.setProperty('--tilt-y', '0deg');
    });
  });
  // A lightweight motion-graphics chart: decorative signals, not live telemetry.
  const arsenal = document.querySelector('.arsenal-grid');
  if (arsenal) {
    const chart = document.createElement('figure');
    chart.className = 'network-motion';
    chart.innerHTML = `<figcaption><span>THE GRAND LINE / SIGNAL CHART</span><small>Every connection has a course.</small></figcaption>
      <svg viewBox="0 0 900 240" role="img" aria-label="Animated illustration connecting access, network security and application delivery">
      <defs><pattern id="network-chart-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="currentColor" stroke-opacity=".07"/></pattern></defs>
      <rect width="900" height="240" fill="url(#network-chart-grid)"/>
      <g class="network-orbits" fill="none" stroke="currentColor"><circle cx="450" cy="112" r="83"/><circle cx="450" cy="112" r="70" stroke-dasharray="2 11"/></g>
      <g class="network-compass" fill="none"><path d="M450 18v10m0 168v10M356 112h10m168 0h10M390 52l7 7m106 106 7 7m-120 0 7-7m106-106 7-7"/><path d="M450 30l5 9h-10z" fill="currentColor"/></g>
      <g class="network-lines" fill="none"><path d="M150 112H360Q385 112 400 97L450 47"/><path d="M450 177L500 127Q515 112 540 112H750"/><path d="M150 112Q270 205 390 152"/><path d="M510 72Q630 10 750 112"/></g>
      <g class="network-signals" fill="none"><path d="M150 112H360Q385 112 400 97L450 47"/><path d="M450 177L500 127Q515 112 540 112H750"/><path d="M150 112Q270 205 390 152"/><path d="M510 72Q630 10 750 112"/></g>
      <g class="network-nodes"><circle cx="150" cy="112" r="31"/><circle cx="450" cy="112" r="48"/><circle cx="750" cy="112" r="31"/></g>
      <g class="network-node-pulses" fill="none"><circle cx="150" cy="112" r="37"/><circle cx="750" cy="112" r="37"/></g>
      <g class="network-glyphs" fill="none"><path d="M135 104h30v20h-30zm15 20v7m-10 0h20M450 85l19 8v15q0 17-19 29-19-12-19-29V93zM441 110l6 6 13-15M735 101h30v10h-30zm0 14h30v10h-30m6-19h3m-3 14h3"/></g>
      <g class="network-labels"><text x="150" y="181">ACCESS</text><text x="450" y="208">SECURITY</text><text x="750" y="181">DELIVERY</text></g></svg>`;
    arsenal.before(chart);
    if ('IntersectionObserver' in window) {
      const visibility = new IntersectionObserver(entries => {
        chart.classList.toggle('graphic-visible', entries[0].isIntersecting);
      }, { threshold: .05 });
      visibility.observe(chart);
    } else chart.classList.add('graphic-visible');
  }
  schedule();
})();
