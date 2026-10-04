import { test } from 'node:test';
import assert from 'node:assert/strict';

let worker;
try {
  worker = await import('./dist/server/index.js');
} catch (error) {
  console.error('Cannot import built worker:', error.message);
  process.exit(1);
}

const mockEnv = {
  DB: {
    _inserts: [],
    prepare(sql) {
      return {
        bind(...args) {
          return {
            async run() {
              if (sql.includes('INSERT INTO page_views')) {
                mockEnv.DB._inserts.push(args);
              }
              return { success: true };
            },
            async first() {
              return null;
            }
          };
        }
      };
    }
  }
};

function resetInserts() {
  mockEnv.DB._inserts = [];
}

test('POST /api/pv with normal browser stores normalized path and domain', async () => {
  resetInserts();
  const request = new Request('https://example.com/api/pv', {
    method: 'POST',
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'content-type': 'application/json'
    },
    body: JSON.stringify({ path: '/about?x=1', ref: 'https://news.example.com/a?b=c' })
  });
  
  const response = await worker.default.fetch(request, mockEnv);
  
  assert.equal(response.status, 204);
  assert.equal(mockEnv.DB._inserts.length, 1);
  const [id, path, day, referrerDomain, createdAt] = mockEnv.DB._inserts[0];
  assert.equal(path, '/about');
  assert.equal(referrerDomain, 'news.example.com');
  assert.match(day, /^\d{4}-\d{2}-\d{2}$/);
});

test('POST /api/pv with Googlebot UA returns 204 without storing', async () => {
  resetInserts();
  const request = new Request('https://example.com/api/pv', {
    method: 'POST',
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'content-type': 'application/json'
    },
    body: JSON.stringify({ path: '/page', ref: '' })
  });
  
  const response = await worker.default.fetch(request, mockEnv);
  
  assert.equal(response.status, 204);
  assert.equal(mockEnv.DB._inserts.length, 0);
});

test('POST /api/pv with /admin path returns 204 without storing', async () => {
  resetInserts();
  const request = new Request('https://example.com/api/pv', {
    method: 'POST',
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'content-type': 'application/json'
    },
    body: JSON.stringify({ path: '/admin/inbox', ref: '' })
  });
  
  const response = await worker.default.fetch(request, mockEnv);
  
  assert.equal(response.status, 204);
  assert.equal(mockEnv.DB._inserts.length, 0);
});

test('GET /pv.js returns JavaScript with correct content type', async () => {
  const request = new Request('https://example.com/pv.js', {
    method: 'GET'
  });
  
  const response = await worker.default.fetch(request, mockEnv);
  
  assert.equal(response.status, 200);
  assert.ok(response.headers.get('content-type').includes('javascript'));
  const text = await response.text();
  assert.ok(text.includes('sendBeacon'));
  assert.ok(text.includes('/api/pv'));
});

test('GET / contains pv.js script tag exactly once', async () => {
  const request = new Request('https://example.com/', {
    method: 'GET'
  });
  
  const response = await worker.default.fetch(request, mockEnv);
  
  assert.equal(response.status, 200);
  const html = await response.text();
  const matches = html.match(/pv\.js/g) || [];
  assert.equal(matches.length, 1, 'pv.js should appear exactly once');
  assert.ok(html.includes('<script src="/pv.js" defer></script>'));
});

test('GET /about (runtime-served page) contains pv.js script tag exactly once', async () => {
  const request = new Request('https://example.com/about', {
    method: 'GET'
  });
  
  const response = await worker.default.fetch(request, mockEnv);
  
  assert.equal(response.status, 200);
  const html = await response.text();
  const matches = html.match(/pv\.js/g) || [];
  assert.equal(matches.length, 1, 'pv.js should appear exactly once');
  assert.ok(html.includes('<script src="/pv.js" defer></script>'));
});

test('POST /api/pv with invalid path returns 204 without storing', async () => {
  resetInserts();
  const request = new Request('https://example.com/api/pv', {
    method: 'POST',
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'content-type': 'application/json'
    },
    body: JSON.stringify({ path: '/zzz-not-a-page', ref: '' })
  });
  
  const response = await worker.default.fetch(request, mockEnv);
  
  assert.equal(response.status, 204);
  assert.equal(mockEnv.DB._inserts.length, 0);
});

test('POST /api/pv with valid real page path stores the view', async () => {
  resetInserts();
  const request = new Request('https://example.com/api/pv', {
    method: 'POST',
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'content-type': 'application/json'
    },
    body: JSON.stringify({ path: '/learning', ref: '' })
  });
  
  const response = await worker.default.fetch(request, mockEnv);
  
  assert.equal(response.status, 204);
  assert.equal(mockEnv.DB._inserts.length, 1);
  const [id, path] = mockEnv.DB._inserts[0];
  assert.equal(path, '/learning');
});


test('GET unknown public path returns the branded noindex 404 shell', async () => {
  const response = await worker.default.fetch(new Request('https://example.com/nope'), mockEnv);

  assert.equal(response.status, 404);
  assert.equal(response.headers.get('x-robots-tag'), 'noindex');
  const html = await response.text();
  assert.match(html, /^<!doctype html>/i);
  assert.match(html, /<html lang="en">/i);
  assert.match(html, /<meta name="robots" content="noindex">/i);
  assert.match(html, /<title>Page not found · Infinity Enterprises<\/title>/i);
  assert.match(html, /class="site-header"/);
  assert.match(html, /class="site-footer"/);
  assert.match(html, /href="\/favicon\.svg"/);
  assert.match(html, /href="\/"/);
  assert.match(html, /href="\/search"/);
  assert.match(html, /href="\/issues"/);
});

test('GET unknown Enigmas slug returns the same branded noindex 404 shell', async () => {
  const response = await worker.default.fetch(new Request('https://example.com/enigmas/nope'), mockEnv);

  assert.equal(response.status, 404);
  assert.equal(response.headers.get('x-robots-tag'), 'noindex');
  const html = await response.text();
  assert.match(html, /Page not found\./);
  assert.match(html, /Find your way back/);
  assert.match(html, /class="site-header"/);
});

test('favicon SVG and legacy ICO paths return non-404 SVG responses', async () => {
  for (const path of ['/favicon.svg', '/favicon.ico']) {
    const response = await worker.default.fetch(new Request(`https://example.com${path}`), mockEnv);
    assert.equal(response.status, 200, path);
    assert.ok(response.headers.get('content-type').includes('image/svg+xml'), path);
    assert.match(await response.text(), /<svg/);
  }
});

test('GET / declares the shared SVG favicon once', async () => {
  const response = await worker.default.fetch(new Request('https://example.com/'), mockEnv);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.equal((html.match(/href="\/favicon\.svg"/g) || []).length, 1);
});

test('existing 308 redirects remain unchanged', async () => {
  for (const [path, location] of [['/diana', '/about/diana'], ['/atlas', '/development/atlas'], ['/media/hero.png', '/media/hero.jpg']]) {
    const response = await worker.default.fetch(new Request(`https://example.com${path}`), mockEnv);
    assert.equal(response.status, 308, path);
    assert.equal(response.headers.get('location'), location, path);
  }
});

test('secret-map redirect normalizes paths and returns 308 on hit', async () => {
  const testMap = JSON.stringify({'/enigmas/old-test-slug': '/enigmas/new-test-slug'});
  const envWithMap = {...mockEnv, REDIRECT_MAP: testMap};
  
  const cases = [
    '/enigmas/old-test-slug',
    '/enigmas/Old-Test-Slug',
    '/enigmas/old-test-slug/',
    '/enigmas/Old%2DTest%2DSlug'
  ];
  
  for (const path of cases) {
    const response = await worker.default.fetch(new Request(`https://example.com${path}`), envWithMap);
    assert.equal(response.status, 308, `should redirect ${path}`);
    assert.equal(response.headers.get('location'), '/enigmas/new-test-slug', `should redirect ${path} to new slug`);
  }
});

test('secret-map redirect returns 404 on miss without throwing', async () => {
  const testMap = JSON.stringify({'/enigmas/old-test-slug': '/enigmas/new-test-slug'});
  const envWithMap = {...mockEnv, REDIRECT_MAP: testMap};
  
  const response = await worker.default.fetch(new Request('https://example.com/enigmas/nonexistent-slug'), envWithMap);
  assert.equal(response.status, 404, 'should return 404 on miss');
});

test('secret-map redirect returns 404 when REDIRECT_MAP is missing', async () => {
  const envWithoutMap = {...mockEnv, REDIRECT_MAP: undefined};
  
  const response = await worker.default.fetch(new Request('https://example.com/enigmas/old-test-slug'), envWithoutMap);
  assert.equal(response.status, 404, 'should return 404 when secret is missing');
});

test('secret-map redirect returns 404 on malformed JSON without throwing', async () => {
  const envWithBadMap = {...mockEnv, REDIRECT_MAP: '{invalid json'};
  
  const response = await worker.default.fetch(new Request('https://example.com/enigmas/old-test-slug'), envWithBadMap);
  assert.equal(response.status, 404, 'should return 404 on malformed JSON');
});
