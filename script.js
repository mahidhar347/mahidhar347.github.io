(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reducedMotion) {
    document.documentElement.classList.add('js-motion');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  }
  const progress = document.querySelector('.progress');
  let scheduled = false;
  const update = () => {
    // Safari can restore an anchor after observer setup. Reveal content already
    // in view on scroll/pageshow as well, so headings never remain invisible.
    document.querySelectorAll('.reveal:not(.visible)').forEach(element => {
      const box = element.getBoundingClientRect();
      if (box.top < window.innerHeight && box.bottom > 0) element.classList.add('visible');
    });
    const height = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${height > 0 ? window.scrollY / height * 100 : 0}%`;
    scheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('pageshow', update);
  window.addEventListener('hashchange', update);
  const map = document.querySelector('#route-map');
  const openMap = document.querySelector('.log-pose');
  openMap.addEventListener('click', () => map.showModal());
  map.querySelector('.close-map').addEventListener('click', () => map.close());
  map.querySelectorAll('a').forEach(link => link.addEventListener('click', () => map.close()));
  map.addEventListener('click', event => { if (event.target === map) {
    const bounds = map.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) map.close();
  }});
  update();
})();
