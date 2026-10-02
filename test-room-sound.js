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

function createContext(options = {}) {
  const calls = { buffers: [], decodes: 0, oscillators: [], resumes: 0, suspends: 0, targets: [] };
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
    async decodeAudioData(encoded) {
      calls.decodes += 1;
      return options.decodeAudioData ? options.decodeAudioData(encoded) : { duration: 10 };
    },
    async resume() { calls.resumes += 1; },
    async suspend() { calls.suspends += 1; },
  };
  return context;
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, reject, resolve };
}

async function waitFor(predicate, label) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (predicate()) return;
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  assert.fail(`Timed out waiting for ${label}`);
}

function successfulResponse() {
  return { ok: true, arrayBuffer: async () => new ArrayBuffer(8) };
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

function placeholderManifest() {
  return {
    rooms: [{
      route: '/music',
      label: 'Music',
      loop: { ...readyRoom.rooms[0].loop, status: 'placeholder' },
    }],
  };
}

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

test('empty storage defaults to sound off before any toggle', () => {
  const controller = RoomSoundController.create({ route: '/music', storage: createStorage() });

  assert.equal(controller.preference(), 'off');
  assert.deepEqual(controller.snapshot(), { nowPlaying: null, playing: false, preference: 'off' });
});

test('complete placeholder rows make no audio request and fall back to the existing drone', async () => {
  const context = createContext();
  let audioRequests = 0;
  const controller = RoomSoundController.create({
    contextFactory() { return context; },
    fetchImpl() { audioRequests += 1; return Promise.resolve(successfulResponse()); },
    manifest: placeholderManifest(),
    route: '/music',
    storage: createStorage(),
  });

  const playing = await controller.toggleFromUserAction();
  assert.equal(playing, true);
  assert.equal(controller.snapshot().preference, 'on');
  assert.equal(controller.snapshot().nowPlaying, 'Ambient drone');
  assert.equal(audioRequests, 0);
  assert.equal(context.calls.buffers.length, 0);
  assert.equal(context.calls.oscillators.length, 5);
});

test('ready loop uses ordered sources and falls back to the drone after source failures', async () => {
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

test('ready loop uses the decoded buffer and manifest loop points', async () => {
  const context = createContext();
  const controller = RoomSoundController.create({
    contextFactory() { return context; },
    fetchImpl() { return Promise.resolve(successfulResponse()); },
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

test('relative manifest paths resolve from the site root instead of the page route', async () => {
  const context = createContext();
  const attempted = [];
  const controller = RoomSoundController.create({
    contextFactory() { return context; },
    fetchImpl(sourcePath) {
      attempted.push(sourcePath);
      return Promise.resolve({ ok: false });
    },
    manifest: {
      rooms: [{ ...readyRoom.rooms[0], loop: { ...readyRoom.rooms[0].loop, src: ['rooms/music/loop.m4a'] } }],
    },
    route: '/music',
    storage: createStorage(),
  });

  await controller.toggleFromUserAction();
  assert.deepEqual(attempted, ['/rooms/music/loop.m4a']);
});

test('invalid manifest or decoded loop points do not start a file loop', async () => {
  const invalidManifest = {
    rooms: [{ ...readyRoom.rooms[0], loop: { ...readyRoom.rooms[0].loop, loop_end_s: 11 } }],
  };
  const invalidContext = createContext();
  let invalidRequests = 0;
  const invalidController = RoomSoundController.create({
    contextFactory() { return invalidContext; },
    fetchImpl() { invalidRequests += 1; return Promise.resolve(successfulResponse()); },
    manifest: invalidManifest,
    route: '/music',
    storage: createStorage(),
  });

  await invalidController.toggleFromUserAction();
  assert.equal(invalidRequests, 0);
  assert.equal(invalidContext.calls.buffers.length, 0);
  assert.equal(invalidController.snapshot().nowPlaying, 'Ambient drone');

  const shortBufferContext = createContext({ decodeAudioData: async () => ({ duration: 9 }) });
  const shortBufferController = RoomSoundController.create({
    contextFactory() { return shortBufferContext; },
    fetchImpl() { return Promise.resolve(successfulResponse()); },
    manifest: readyRoom,
    route: '/music',
    storage: createStorage(),
  });

  await shortBufferController.toggleFromUserAction();
  assert.equal(shortBufferContext.calls.buffers.length, 0);
  assert.equal(shortBufferController.snapshot().nowPlaying, 'Ambient drone');
});

test('near-miss routes do not load a matching room loop', async () => {
  const context = createContext();
  let requests = 0;
  const controller = RoomSoundController.create({
    contextFactory() { return context; },
    fetchImpl() { requests += 1; return Promise.resolve(successfulResponse()); },
    manifest: readyRoom,
    route: '/music/',
    storage: createStorage(),
  });

  await controller.toggleFromUserAction();
  assert.equal(requests, 0);
  assert.equal(context.calls.buffers.length, 0);
  assert.equal(controller.snapshot().nowPlaying, 'Ambient drone');
});

test('external audio cancels an in-flight load before any source starts', async () => {
  const context = createContext();
  const pendingResponse = deferred();
  let requests = 0;
  const controller = RoomSoundController.create({
    contextFactory() { return context; },
    fetchImpl() {
      requests += 1;
      return pendingResponse.promise;
    },
    manifest: readyRoom,
    route: '/music',
    storage: createStorage(),
  });

  const firstStart = controller.toggleFromUserAction();
  await waitFor(() => requests === 1, 'the initial manifest fetch');
  controller.suppressForExternalAudio();
  pendingResponse.resolve(successfulResponse());

  assert.equal(await firstStart, false);
  assert.equal(controller.snapshot().playing, false);
  assert.equal(controller.snapshot().nowPlaying, null);
  assert.equal(context.calls.buffers.length, 0);
  assert.equal(context.calls.oscillators.length, 0);
});

test('a second click during a load cancels the pending start instead of creating another loop', async () => {
  const context = createContext();
  const pendingResponse = deferred();
  let requests = 0;
  const storage = createStorage();
  const controller = RoomSoundController.create({
    contextFactory() { return context; },
    fetchImpl() {
      requests += 1;
      return pendingResponse.promise;
    },
    manifest: readyRoom,
    route: '/music',
    storage,
  });

  const firstStart = controller.toggleFromUserAction();
  await waitFor(() => requests === 1, 'the initial manifest fetch');
  assert.equal(await controller.toggleFromUserAction(), false);
  pendingResponse.resolve(successfulResponse());

  assert.equal(await firstStart, false);
  assert.equal(controller.preference(), 'off');
  assert.equal(controller.snapshot().playing, false);
  assert.equal(context.calls.buffers.length, 0);
  assert.equal(context.calls.oscillators.length, 0);
});

test('a hidden-tab pause cancels a pending load and resumes safely after return', async () => {
  const context = createContext();
  const pendingResponse = deferred();
  let hidden = false;
  let requests = 0;
  const controller = RoomSoundController.create({
    contextFactory() { return context; },
    fetchImpl() {
      requests += 1;
      return requests === 1 ? pendingResponse.promise : Promise.resolve(successfulResponse());
    },
    isHidden() { return hidden; },
    manifest: readyRoom,
    route: '/music',
    storage: createStorage(),
  });

  const firstStart = controller.toggleFromUserAction();
  await waitFor(() => requests === 1, 'the initial manifest fetch');
  hidden = true;
  assert.equal(await controller.pauseForVisibility(), true);
  pendingResponse.resolve(successfulResponse());

  assert.equal(await firstStart, false);
  assert.equal(controller.snapshot().playing, false);
  assert.equal(context.calls.buffers.length, 0);

  hidden = false;
  assert.equal(await controller.resumeForVisibility(), true);
  assert.equal(controller.snapshot().playing, true);
  assert.equal(context.calls.buffers.length, 1);
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
  assert.equal(context.calls.resumes, 3);
  controller.suppressForExternalAudio();
  assert.equal(controller.snapshot().playing, false);
  assert.equal(await controller.resumeForVisibility(), false);

  const reloadController = RoomSoundController.create({ route: '/music', storage });
  assert.equal(reloadController.preference(), 'on');
  assert.equal(reloadController.snapshot().playing, false);
});
