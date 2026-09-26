(() => {
  const musicButton = document.getElementById('music-toggle');
  if (!musicButton) return;
  let sound;
  function createAmbience() {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const master = context.createGain();
    master.gain.value = 0;
    master.connect(context.destination);
    [55, 82.41, 110.3, 164.5].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const lowpass = context.createBiquadFilter();
      const gain = context.createGain();
      oscillator.type = index % 2 ? 'sine' : 'triangle';
      oscillator.frequency.value = frequency;
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 260;
      gain.gain.value = [0.15, 0.08, 0.05, 0.035][index];
      oscillator.connect(lowpass).connect(gain).connect(master);
      oscillator.start();
    });
    const movement = context.createOscillator();
    const depth = context.createGain();
    movement.frequency.value = 0.075;
    depth.gain.value = 0.012;
    movement.connect(depth).connect(master.gain);
    movement.start();
    return { context, master };
  }
  musicButton.addEventListener('click', async () => {
    try {
      if (!sound) sound = createAmbience();
      await sound.context.resume();
      const playing = musicButton.getAttribute('aria-pressed') === 'true';
      sound.master.gain.cancelScheduledValues(sound.context.currentTime);
      sound.master.gain.setTargetAtTime(playing ? 0 : 0.12, sound.context.currentTime, 0.25);
      musicButton.setAttribute('aria-pressed', String(!playing));
      musicButton.textContent = playing ? 'Sound on' : 'Mute sound';
    } catch {
      musicButton.textContent = 'Sound unavailable';
      musicButton.disabled = true;
    }
  });
})();
