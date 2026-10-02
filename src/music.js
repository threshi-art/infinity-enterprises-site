const RoomSoundController = (() => {
  const preferenceKey = 'infinity-sound';

  function safeGet(storage, key) {
    try {
      return storage ? storage.getItem(key) : null;
    } catch {
      return null;
    }
  }

  function safeSet(storage, key, value) {
    try {
      if (storage) storage.setItem(key, value);
    } catch {
      return false;
    }
    return true;
  }

  function validLoop(room) {
    if (!room || typeof room.route !== 'string') return null;
    const loop = room.loop;
    if (!loop || loop.status !== 'ready' || loop.designation !== 'loop' || !Array.isArray(loop.src) || !loop.src.length) return null;
    if (!Number.isFinite(loop.duration_s) || !Number.isFinite(loop.loop_start_s) || !Number.isFinite(loop.loop_end_s)) return null;
    if (loop.loop_start_s < 0 || loop.loop_start_s >= loop.loop_end_s || loop.loop_end_s > loop.duration_s) return null;
    return loop;
  }

  function create(options = {}) {
    const state = {
      activeStops: [],
      context: null,
      externallySuppressed: false,
      hasUserActivated: false,
      hiddenPause: false,
      master: null,
      nowPlaying: null,
      playing: false,
      route: options.route || '/',
      storage: options.storage || null,
    };
    const contextFactory = options.contextFactory;
    const fetchImpl = options.fetchImpl;
    const manifest = options.manifest && Array.isArray(options.manifest.rooms) ? options.manifest : null;

    function preference() {
      return safeGet(state.storage, preferenceKey) === 'on' ? 'on' : 'off';
    }

    function setPreference(value) {
      safeSet(state.storage, preferenceKey, value === 'on' ? 'on' : 'off');
    }

    function setMasterGain(value, timeConstant) {
      if (!state.master) return;
      const gain = state.master.gain;
      const now = state.context.currentTime || 0;
      if (typeof gain.cancelScheduledValues === 'function') gain.cancelScheduledValues(now);
      if (typeof gain.setTargetAtTime === 'function') gain.setTargetAtTime(value, now, timeConstant);
      else gain.value = value;
    }

    function stopActiveSources() {
      state.activeStops.splice(0).forEach(stop => {
        try {
          stop();
        } catch {
          return;
        }
      });
      state.nowPlaying = null;
    }

    function ensureContext() {
      if (state.context) return state.context;
      if (typeof contextFactory !== 'function') throw new Error('Audio is unavailable');
      state.context = contextFactory();
      state.master = state.context.createGain();
      state.master.gain.value = 0;
      state.master.connect(state.context.destination);
      return state.context;
    }

    function roomForRoute() {
      if (!manifest) return null;
      return manifest.rooms.find(room => room && room.route === state.route) || null;
    }

    function startDrone() {
      const context = state.context;
      const frequencies = [55, 82.41, 110.3, 164.5];
      frequencies.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const lowpass = context.createBiquadFilter();
        const gain = context.createGain();
        oscillator.type = index % 2 ? 'sine' : 'triangle';
        oscillator.frequency.value = frequency;
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 260;
        gain.gain.value = [0.15, 0.08, 0.05, 0.035][index];
        oscillator.connect(lowpass).connect(gain).connect(state.master);
        oscillator.start();
        state.activeStops.push(() => oscillator.stop());
      });
      const movement = context.createOscillator();
      const depth = context.createGain();
      movement.frequency.value = 0.075;
      depth.gain.value = 0.012;
      movement.connect(depth).connect(state.master.gain);
      movement.start();
      state.activeStops.push(() => movement.stop());
      state.nowPlaying = 'Ambient drone';
      return 'drone';
    }

    async function startManifestLoop(loop, room) {
      if (!loop || typeof fetchImpl !== 'function') return false;
      for (const sourcePath of loop.src) {
        try {
          const response = await fetchImpl(sourcePath);
          if (!response || !response.ok) continue;
          const encoded = await response.arrayBuffer();
          const buffer = await state.context.decodeAudioData(encoded);
          const source = state.context.createBufferSource();
          source.buffer = buffer;
          source.loop = true;
          source.loopStart = loop.loop_start_s;
          source.loopEnd = loop.loop_end_s;
          source.connect(state.master);
          source.start();
          state.activeStops.push(() => source.stop());
          state.nowPlaying = loop.display_name || room.label || 'Room ambience';
          return true;
        } catch {
          continue;
        }
      }
      return false;
    }

    async function start() {
      state.externallySuppressed = false;
      state.hiddenPause = false;
      state.hasUserActivated = true;
      const context = ensureContext();
      if (typeof context.resume === 'function') await context.resume();
      stopActiveSources();
      const room = roomForRoute();
      const loop = validLoop(room);
      const loaded = await startManifestLoop(loop, room);
      const source = loaded ? 'manifest-loop' : startDrone();
      setMasterGain(0.12, 0.12);
      state.playing = true;
      return source;
    }

    function stop() {
      setMasterGain(0, 0.12);
      stopActiveSources();
      state.hiddenPause = false;
      state.playing = false;
    }

    function suppressForExternalAudio() {
      state.externallySuppressed = true;
      stop();
    }

    async function pauseForVisibility() {
      if (!state.playing || !state.context) return false;
      state.hiddenPause = true;
      setMasterGain(0, 0.05);
      if (typeof state.context.suspend === 'function') await state.context.suspend();
      state.playing = false;
      return true;
    }

    async function resumeForVisibility() {
      if (!state.hiddenPause || state.externallySuppressed || preference() !== 'on' || !state.hasUserActivated || !state.context) return false;
      if (typeof state.context.resume === 'function') await state.context.resume();
      state.hiddenPause = false;
      setMasterGain(0.12, 0.12);
      state.playing = true;
      return true;
    }

    async function toggleFromUserAction() {
      if (state.playing) {
        setPreference('off');
        stop();
        return false;
      }
      setPreference('on');
      await start();
      return true;
    }

    function snapshot() {
      return {
        nowPlaying: state.nowPlaying,
        playing: state.playing,
        preference: preference(),
      };
    }

    return {
      pauseForVisibility,
      preference,
      resumeForVisibility,
      snapshot,
      suppressForExternalAudio,
      toggleFromUserAction,
    };
  }

  return { create };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = { RoomSoundController };

(() => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const musicButton = document.getElementById('music-toggle');
  if (!musicButton) return;
  const contextFactory = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error('Audio is unavailable');
    return new AudioContextClass();
  };
  const controller = RoomSoundController.create({
    contextFactory,
    fetchImpl: typeof window.fetch === 'function' ? window.fetch.bind(window) : null,
    manifest: window.infinityRoomSound || null,
    route: window.location.pathname,
    storage: window.localStorage,
  });

  function renderToggle(playing) {
    musicButton.setAttribute('aria-pressed', String(playing));
    musicButton.textContent = playing ? 'Mute sound' : 'Sound on';
  }

  renderToggle(false);
  window.addEventListener('infinity-audio-start', event => {
    if (event.detail !== 'ambient') {
      controller.suppressForExternalAudio();
      renderToggle(false);
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      controller.pauseForVisibility().then(() => renderToggle(false));
      return;
    }
    controller.resumeForVisibility().then(resumed => {
      if (resumed) renderToggle(true);
    });
  });
  musicButton.addEventListener('click', async () => {
    try {
      const playing = await controller.toggleFromUserAction();
      if (playing) window.dispatchEvent(new CustomEvent('infinity-audio-start', { detail: 'ambient' }));
      renderToggle(playing);
    } catch {
      musicButton.textContent = 'Sound unavailable';
      musicButton.disabled = true;
      musicButton.setAttribute('aria-pressed', 'false');
    }
  });
})();
