import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

let worker;
try {
  worker = await import('./dist/server/index.js');
} catch (error) {
  console.error('Cannot import built worker:', error.message);
  process.exit(1);
}

const mockEnv = {
  DB: {
    prepare() {
      return {
        bind() {
          return {
            async run() {
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

test('story 8 discovery-with-purpose references /media/enigmas-discovery.jpg in enigmas data', async () => {
  const request = new Request('https://example.com/enigmas', {
    method: 'GET'
  });
  
  const response = await worker.default.fetch(request, mockEnv);
  assert.equal(response.status, 200);
  
  const html = await response.text();
  assert.ok(html.includes('discovery-with-purpose'));
  assert.ok(html.includes('/media/enigmas-discovery.jpg'));
  assert.ok(!html.match(/discovery-with-purpose[\s\S]{0,500}enigmas-law\.jpg/), 'story 8 should not reference enigmas-law.jpg');
});

test('story 8 rendered page includes /media/enigmas-discovery.jpg and correct alt text', async () => {
  const request = new Request('https://example.com/enigmas/discovery-with-purpose', {
    method: 'GET'
  });
  
  const response = await worker.default.fetch(request, mockEnv);
  assert.equal(response.status, 200);
  
  const html = await response.text();
  assert.ok(html.includes('/media/enigmas-discovery.jpg'));
  assert.ok(html.includes('A pair of hands lifts a single ivory folder from an open archive drawer under a warm lamp in a dark records room.'));
  assert.ok(!html.includes('enigmas-law.jpg'));
});

test('/media/enigmas-discovery.jpg returns 200 with image content type', async () => {
  const request = new Request('https://example.com/media/enigmas-discovery.jpg', {
    method: 'GET'
  });
  
  const response = await worker.default.fetch(request, mockEnv);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'image/jpeg');
});

test('/media/enigmas-discovery.jpg bytes hash to expected SHA-256', async () => {
  const request = new Request('https://example.com/media/enigmas-discovery.jpg', {
    method: 'GET'
  });
  
  const response = await worker.default.fetch(request, mockEnv);
  const bytes = await response.arrayBuffer();
  
  const hash = createHash('sha256').update(Buffer.from(bytes)).digest('hex');
  assert.equal(hash, '70ac0fc14cd836acf55ba9309e02772bd337917096216d5ec27b9eabf414372c');
});

test('src/projects.json still references enigmas-law.jpg', async () => {
  const request = new Request('https://example.com/projects', {
    method: 'GET'
  });
  
  const response = await worker.default.fetch(request, mockEnv);
  assert.equal(response.status, 200);
  
  const html = await response.text();
  assert.ok(html.includes('enigmas-law.jpg'));
});

test('all routes that returned 200 at start still return 200', async () => {
  const routes = [
    '/',
    '/about',
    '/standards',
    '/development',
    '/learning',
    '/journal',
    '/foundation',
    '/tech-lounge',
    '/enigmas',
    '/projects',
    '/media/hero.jpg',
    '/media/detail.jpg',
    '/media/development.jpg',
    '/media/tech-lounge.jpg',
    '/media/tech-macro.jpg',
    '/media/enigmas-politics.jpg',
    '/media/enigmas-law.jpg',
    '/media/enigmas-academy.jpg',
    '/media/research.jpg',
    '/media/learning.jpg',
    '/media/foundation.jpg',
    '/media/youth.jpg',
    '/media/cover.jpg'
  ];
  
  for (const route of routes) {
    const request = new Request(`https://example.com${route}`, {
      method: 'GET'
    });
    const response = await worker.default.fetch(request, mockEnv);
    assert.equal(response.status, 200, `${route} should return 200`);
  }
});
