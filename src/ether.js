(() => {
  const scenes = [...document.querySelectorAll('.scene')];
  const player = document.getElementById('ether-player');
  const frame = document.getElementById('player-frame');
  const title = document.getElementById('player-title');
  let current = -1;
  let listening = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  scenes.forEach((scene, index) => {
    const wave = scene.querySelector('.wave');
    for (let i = 0; i < 56; i++) {
      const bar = document.createElement('span');
      const height = 12 + Math.abs(Math.sin(i * .37 + index * 2) * Math.cos(i * .13 + index)) * 88;
      bar.style.cssText = `--h:${height}%;--d:${(i % 7) * .07}s;--delay:${-(i % 11) * .08}s`;
      wave.append(bar);
    }
    scene.querySelector('button').addEventListener('click', () => activate(index, true));
  });
  function activate(index, play = false) {
    if (index === current && !play) return;
    current = index;
    scenes.forEach((scene, i) => {
      scene.classList.toggle('active', i === index);
      scene.classList.toggle('playing', i === index && listening && !reduced.matches);
    });
    if (play) listening = true;
    if (listening) {
      window.dispatchEvent(new CustomEvent('infinity-audio-start', {detail:'ether'}));
      scenes[index].classList.toggle('playing', !reduced.matches);
      player.classList.add('visible');
      title.textContent = 'Now playing / ' + scenes[index].dataset.name;
      frame.src = `https://www.youtube-nocookie.com/embed/8kr7fyOGEMw?start=${scenes[index].dataset.start}&autoplay=1&playsinline=1&rel=0`;
    }
  }
  const observer = new IntersectionObserver(entries => {
    if (!listening) return;
    const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) activate(scenes.indexOf(visible.target));
  }, {threshold:[.5,.7]});
  scenes.forEach(scene => observer.observe(scene));
  document.getElementById('player-stop').addEventListener('click', () => {
    listening = false;
    frame.removeAttribute('src');
    player.classList.remove('visible');
    scenes.forEach(scene => scene.classList.remove('playing'));
  });
})();
