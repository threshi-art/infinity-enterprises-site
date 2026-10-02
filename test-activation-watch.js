import test from 'node:test';
import assert from 'node:assert/strict';
import { formatActivationWatch, latestExplicitMarker, loadLiveSnapshot } from './tools/activation-watch.mjs';

const plans = [
  { number: 88, rail: 'Now', gate: 'Parent Ready card.' },
  { number: 94, rail: 'Next', gate: 'Forge confirmation.' },
];

function response(json, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Failure',
    async json() { return json; },
  };
}

test('latestExplicitMarker selects the newest explicit Ready or Blocked heading', () => {
  const marker = latestExplicitMarker([
    { body: '## Ready\nOlder card', created_at: '2026-10-01T10:00:00Z', html_url: 'https://example.test/old' },
    { body: 'Plain discussion', created_at: '2026-10-01T11:00:00Z', html_url: 'https://example.test/plain' },
    { body: '## Blocked\nOne missing dependency', created_at: '2026-10-01T12:00:00Z', html_url: 'https://example.test/new' },
  ]);

  assert.deepEqual(marker, {
    kind: 'Blocked',
    createdAt: '2026-10-01T12:00:00Z',
    url: 'https://example.test/new',
  });
});

test('formatActivationWatch reports observations without authorizing source work', () => {
  const markdown = formatActivationWatch({
    repository: 'threshi-art/infinity-enterprises-site',
    generatedAt: '2026-10-02T00:00:00Z',
    issues: [
      {
        number: 88,
        rail: 'Now',
        gate: 'Parent Ready card.',
        title: 'Room ambience controller',
        url: 'https://example.test/issues/88',
        state: 'open',
        labels: [{ name: 'owner:manus' }, { name: 'status:in-progress' }],
        updatedAt: '2026-10-01T23:00:00Z',
        marker: { kind: 'Ready', createdAt: '2026-10-01T22:00:00Z', url: 'https://example.test/comments/1' },
      },
    ],
  });

  assert.match(markdown, /Ready heading detected/);
  assert.match(markdown, /Automated observation only/);
  assert.match(markdown, /does \*\*not\*\* validate the card/);
  assert.match(markdown, /never comments, labels, assigns, opens, closes, merges, commits, deploys, publishes/);
  assert.doesNotMatch(markdown, /implementation authorized/i);
});

test('loadLiveSnapshot uses only GET requests and keeps fixed issue scope', async () => {
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url, method: init.method ?? 'GET' });
    if (url.includes('/comments?')) {
      return response([{ body: '## Ready\nComplete parent card', created_at: '2026-10-01T12:00:00Z', html_url: `${url}#comment` }]);
    }
    const number = Number(url.match(/issues\/(\d+)$/)?.[1]);
    return response({
      number,
      title: `Issue ${number}`,
      html_url: `https://example.test/issues/${number}`,
      state: 'open',
      labels: [{ name: 'owner:manus' }],
      updated_at: '2026-10-01T13:00:00Z',
    });
  };

  const snapshot = await loadLiveSnapshot({
    fetchImpl,
    repository: 'owner/repository',
    token: 'test-token',
    plans,
  });

  assert.equal(snapshot.issues.length, 2);
  assert.equal(snapshot.issues[0].marker.kind, 'Ready');
  assert.equal(calls.length, 4);
  assert.ok(calls.every((call) => call.method === 'GET'));
  assert.ok(calls.every((call) => call.url.startsWith('https://api.github.com/repos/owner/repository/issues/')));
});

test('loadLiveSnapshot rejects a missing token before network activity', async () => {
  let called = false;
  await assert.rejects(
    loadLiveSnapshot({
      fetchImpl: async () => { called = true; return response({}); },
      repository: 'owner/repository',
      token: '',
      plans,
    }),
    /GITHUB_TOKEN is required/,
  );
  assert.equal(called, false);
});
