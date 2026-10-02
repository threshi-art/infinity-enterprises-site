import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const musicScript = await readFile('src/music.js', 'utf8');
assert.doesNotMatch(musicScript, /\bexport\b/, 'music.js must remain an inline build script');
assert.doesNotMatch(musicScript, /\$&|\$`|\$'|\$\$/, 'music.js must avoid build replacement tokens');
assert.doesNotMatch(musicScript, /<\/script>/i, 'music.js must remain safe to inline');

const module = { exports: {} };
new Function('module', musicScript)(module);
const { RoomSoundController } = module.exports;

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
  };
}

function createContext() {
  const calls = { buffers: [], oscillators: [], resumes: 0, suspends: 0, targets: [] };
  function node(extra = {}) {
    return {
      ...extra,
      connect(target) { this.connected = target; return target; },
    };
  }
  function gainNode() {
    return node({
      gain: {
        value: 0,
        cancelScheduledValues() {},
        setTargetAtTime(value, time, constant) { calls.targets.push({ value, time, constant }); this.value = value; },
      },
    });
  }
  const context = {
    calls,
    currentTime: 4,
    destination: node(),
    createGain: gainNode,
    createBiquadFilter() { return node({ frequency: { value: 0 }, type: '' }); },
    createOscillator() {
      const oscillator = node({
        frequency: { value: 0 },
        start() { this.started = true; },
        stop() { this.stopped = true; },
        type: '',
      });
      calls.oscillators.push(oscillator);
      return oscillator;
    },
    createBufferSource() {
      const source = node({
        loop: false,
        loopEnd: 0,
        loopStart: 0,
        start() { this.started = true; },
        stop() { this.stopped = true; },
      });
      calls.buffers.push(source);
      return source;
    },
    async decodeAudioData() { return { decoded: true }; },
    async resume() { calls.resumes += 1; },
    async suspend() { calls.suspends += 1; },
  };
  return context;
}

const readyRoom = {
  rooms: [{
    route: '/music',
    label: 'Music',
    loop: {
      designation: 'loop',
      display_name: 'Vinyl room tone',
      duration_s: 10,
      loop_end_s: 9.9,
      loop_start_s: 0.1,
      src: ['/audio/primary.m4a', '/audio/fallback.mp3'],
      status: 'ready',
    },
  }],
};

test('sound stays inactive before a user action even when preference is on', () => {
  const storage = createStorage({ 'infinity-sound': 'on' });
  let contextCreates = 0;
  let audioRequests = 0;
  const controller = RoomSoundController.create({
    contextFactory() { contextCreates += 1; return createContext(); },
    fetchImpl() { audioRequests += 1; return Promise.resolve({ ok: false }); },
    manifest: readyRoom,
    route: '/music',
    storage,
  });

  assert.equal(controller.preference(), 'on');
  assert.equal(controller.snapshot().playing, false);
  assert.equal(contextCreates, 0);
  assert.equal(audioRequests, 0);
});

test('placeholder rows make no audio request and fall back to the existing drone', async () => {
  const context = createContext();
  let audioRequests = 0;
  const controller = RoomSoundController.create({
    contextFactory() { return context; },
    fetchImpl() { audioRequests += 1; return Promise.resolve({ ok: false }); },
    manifest: { rooms: [{ route: '/music', label: 'Music', loop: { status: 'placeholder' } }] },
    route: '/music',
    storage: createStorage(),
  });

  const playing = await controller.toggleFromUserAction();
  assert.equal(playing, true);
  assert.equal(controller.snapshot().preference, 'on');
  assert.equal(controller.snapshot().nowPlaying, 'Ambient drone');
  assert.equal(audioRequests, 0);
  assert.equal(context.calls.oscillators.length, 5);
});

test('ready loop uses ordered sources and falls back to the drone after decode failure', async () => {
  const context = createContext();
  const attempted = [];
  const controller = RoomSoundController.create({
    contextFactory() { return context; },
    fetchImpl(sourcePath) {
      attempted.push(sourcePath);
      return Promise.resolve({ ok: false });
    },
    manifest: readyRoom,
    route: '/music',
    storage: createStorage(),
  });

  await controller.toggleFromUserAction();
  assert.deepEqual(attempted, ['/audio/primary.m4a', '/audio/fallback.mp3']);
  assert.equal(controller.snapshot().nowPlaying, 'Ambient drone');
  assert.equal(context.calls.buffers.length, 0);
  assert.equal(context.calls.oscillators.length, 5);
});

test('valid ready loop uses the decoded buffer and manifest loop points', async () => {
  const context = createContext();
  const controller = RoomSoundController.create({
    contextFactory() { return context; },
    fetchImpl() { return Promise.resolve({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) }); },
    manifest: readyRoom,
    route: '/music',
    storage: createStorage(),
  });

  await controller.toggleFromUserAction();
  assert.equal(controller.snapshot().nowPlaying, 'Vinyl room tone');
  assert.equal(context.calls.buffers.length, 1);
  assert.equal(context.calls.buffers[0].loop, true);
  assert.equal(context.calls.buffers[0].loopStart, 0.1);
  assert.equal(context.calls.buffers[0].loopEnd, 9.9);
  assert.equal(context.calls.oscillators.length, 0);
});

test('invalid route loop falls back to the drone without fetching', async () => {
  const context = createContext();
  let requests = 0;
  const controller = RoomSoundController.create({
    contextFactory() { return context; },
    fetchImpl() { requests += 1; return Promise.resolve({ ok: true }); },
    manifest: readyRoom,
    route: '/not-in-manifest',
    storage: createStorage(),
  });

  await controller.toggleFromUserAction();
  assert.equal(requests, 0);
  assert.equal(controller.snapshot().nowPlaying, 'Ambient drone');
});

test('external audio suppresses ambience and visibility resumes only after user activation remains eligible', async () => {
  const context = createContext();
  const storage = createStorage();
  const controller = RoomSoundController.create({
    contextFactory() { return context; },
    manifest: null,
    route: '/music',
    storage,
  });

  await controller.toggleFromUserAction();
  assert.equal(await controller.pauseForVisibility(), true);
  assert.equal(context.calls.suspends, 1);
  assert.equal(await controller.resumeForVisibility(), true);
  assert.equal(context.calls.resumes, 2);
  controller.suppressForExternalAudio();
  assert.equal(controller.snapshot().playing, false);
  assert.equal(await controller.resumeForVisibility(), false);

  const reloadController = RoomSoundController.create({ route: '/music', storage });
  assert.equal(reloadController.preference(), 'on');
  assert.equal(reloadController.snapshot().playing, false);
});
