(() => {
  const splash = document.getElementById('issue-splash');
  const replay = document.getElementById('replay-intro');
  if (!splash || !replay) return;
  const key = 'infinity-opening-september-2026';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  let lastFocus;
  const seen = () => { try { return sessionStorage.getItem(key) === 'seen'; } catch { return false; } };
  const markSeen = () => { try { sessionStorage.setItem(key, 'seen'); } catch {} };
  function close() {
    clearTimeout(timer);
    splash.hidden = true;
    document.body.classList.remove('splash-open');
    document.querySelectorAll('body > header, body > .room-bar, body > main, body > footer').forEach(el => el.inert = false);
    markSeen();
    if (lastFocus && lastFocus.isConnected) lastFocus.focus();
    else document.querySelector('.cover-actions .button')?.focus();
  }
  function open() {
    clearTimeout(timer);
    lastFocus = document.activeElement === document.body ? null : document.activeElement;
    splash.hidden = false;
    document.body.classList.add('splash-open');
    document.querySelectorAll('body > header, body > .room-bar, body > main, body > footer').forEach(el => el.inert = true);
    splash.classList.remove('playing');
    void splash.offsetWidth;
    splash.classList.add('playing');
    document.getElementById('splash-enter').focus();
    if (!reduced.matches) timer = setTimeout(close, 5400);
  }
  document.getElementById('splash-enter').addEventListener('click', close);
  document.getElementById('splash-skip').addEventListener('click', close);
  replay.addEventListener('click', open);
  splash.addEventListener('keydown', event => {
    if (event.key === 'Escape') close();
    if (event.key === 'Tab') {
      const buttons = [...splash.querySelectorAll('button')];
      if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === buttons.at(-1)) { event.preventDefault(); buttons[0].focus(); }
    }
  });
  if (!seen() && !location.hash) open();
})();
