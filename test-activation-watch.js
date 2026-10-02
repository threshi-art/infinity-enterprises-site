import test from 'node:test';
import assert from 'node:assert/strict';
import { formatActivationWatch, latestExplicitMarker, loadLiveSnapshot } from './tools/activation-watch.mjs';

const plans = [
  { number: 88, rail: 'Now', gate: 'Exact-head reviews.' },
  { number: 94, rail: 'Next', gate: 'Staged pending #88 studio merge.' },
];

function response(json, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Failure',
    async json() { return json; },
  };
}

test('latestExplicitMarker accepts real start-of-comment headings and bold status markers', () => {
  const marker = latestExplicitMarker([
    { body: '## Ready\nOlder card', created_at: '2026-10-01T10:00:00Z', html_url: 'https://example.test/old' },
    { body: '**Status: Ready.**\nApproved parent card', created_at: '2026-10-01T11:00:00Z', html_url: 'https://example.test/ready' },
    { body: '## Blocked\nOne missing dependency', created_at: '2026-10-01T12:00:00Z', html_url: 'https://example.test/new' },
  ]);

  assert.deepEqual(marker, {
    kind: 'Blocked',
    createdAt: '2026-10-01T12:00:00Z',
    url: 'https://example.test/new',
  });
});

test('latestExplicitMarker ignores quoted and embedded reply-template markers', () => {
  const marker = latestExplicitMarker([
    { body: 'Discussion before a sample:\n\n> ## Ready\n> Do not copy this as a decision.', created_at: '2026-10-01T10:00:00Z' },
    { body: 'Copy this reply template:\n\n```markdown\n## Blocked\n```', created_at: '2026-10-01T11:00:00Z' },
    { body: 'A sentence with ## Ready is not a parent marker.', created_at: '2026-10-01T12:00:00Z' },
  ]);

  assert.equal(marker, null);
});

test('formatActivationWatch reports observations without authorizing source work', () => {
  const markdown = formatActivationWatch({
    repository: 'threshi-art/infinity-enterprises-site',
    generatedAt: '2026-10-02T00:00:00Z',
    issues: [
      {
        number: 88,
        rail: 'Now',
        gate: 'Exact-head reviews.',
        title: 'Room ambience controller',
        url: 'https://example.test/issues/88',
        state: 'open',
        labels: [{ name: 'owner:manus' }, { name: 'status:in-progress' }],
        updatedAt: '2026-10-01T23:00:00Z',
        marker: { kind: 'Ready', createdAt: '2026-10-01T22:00:00Z', url: 'https://example.test/comments/1' },
      },
    ],
  });

  assert.match(markdown, /Ready marker detected/);
  assert.match(markdown, /Automated observation only/);
  assert.match(markdown, /does \*\*not\*\* validate the card/);
  assert.match(markdown, /cannot verify marker authorship/);
  assert.match(markdown, /never comments, labels, assigns, opens, closes, merges, commits, deploys, publishes/);
  assert.doesNotMatch(markdown, /implementation authorized/i);
});

test('loadLiveSnapshot uses GET-only pagination and observes a marker on a later comment page', async () => {
  const calls = [];
  const oldDiscussion = Array.from({ length: 100 }, (_, index) => ({
    body: `Discussion ${index}`,
    created_at: `2026-10-01T10:${String(index % 60).padStart(2, '0')}:00Z`,
  }));
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url, method: init.method ?? 'GET' });
    if (url.includes('/comments?')) {
      const page = new URL(url).searchParams.get('page');
      if (page === '1') return response(oldDiscussion);
      if (page === '2') {
        return response([{ body: '**Status: Blocked.**\nA later parent update', created_at: '2026-10-02T12:00:00Z', html_url: `${url}#latest` }]);
      }
      throw new Error(`unexpected comments page: ${url}`);
    }
    const number = Number(url.match(/issues\/(\d+)(?:$|\?)/)?.[1]);
    return response({
      number,
      title: `Issue ${number}`,
      html_url: `https://example.test/issues/${number}`,
      state: 'open',
      labels: [{ name: 'owner:manus' }],
      updated_at: '2026-10-02T13:00:00Z',
    });
  };

  const snapshot = await loadLiveSnapshot({
    fetchImpl,
    repository: 'owner/repository',
    token: 'test-token',
    plans,
  });

  assert.equal(snapshot.issues.length, 2);
  assert.equal(snapshot.issues[0].marker.kind, 'Blocked');
  assert.equal(calls.length, 6);
  assert.ok(calls.every((call) => call.method === 'GET'));
  assert.ok(calls.every((call) => call.url.startsWith('https://api.github.com/repos/owner/repository/issues/')));
  assert.equal(calls.filter((call) => call.url.includes('/comments?')).length, 4);
  assert.ok(calls.some((call) => call.url.includes('per_page=100&page=2')));
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
