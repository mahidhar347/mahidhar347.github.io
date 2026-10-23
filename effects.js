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
  schedule();
})();
