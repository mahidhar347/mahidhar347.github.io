(() => {
  const button = document.querySelector('#appearance-toggle');
  const panel = document.querySelector('#appearance-panel');
  const mobile = window.matchMedia('(max-width: 700px)');
  const close = (restoreFocus = false) => {
    panel.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    if (restoreFocus && mobile.matches) button.focus();
  };
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    panel.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', event => {
    if (!panel.contains(event.target) && !button.contains(event.target)) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true' && !document.querySelector('dialog[open]')) close(true);
  });
  document.querySelector('#weather-open').addEventListener('click', () => close());
  document.querySelector('#weather-dialog').addEventListener('close', () => {
    if (mobile.matches) button.focus();
  });
  mobile.addEventListener('change', () => close());
})();
