import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const feedsScript = await readFile('src/feeds.js', 'utf8');
const feedsConfigJson = await readFile('src/feeds.json', 'utf8');

const mockFetchWith10Items = (url, options) => {
  return Promise.resolve({
    ok: true,
    text: () => {
      const items = [];
      for (let i = 1; i <= 10; i++) {
        items.push(`
    <item>
      <title>Item ${i}</title>
      <link>https://www.federalreserve.gov/${i}</link>
      <pubDate>Mon, ${27 - i} Sep 2026 18:00:00 GMT</pubDate>
    </item>`);
      }
      return Promise.resolve(`<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    ${items.join('')}
  </channel>
</rss>`);
    }
  });
};

const mockFetchFailure = (url, options) => {
  return Promise.reject(new Error('Network error'));
};

global.AbortSignal = {
  timeout: () => ({})
};

const code = feedsScript
  .replace('/* FEEDS_CONFIG */ null', feedsConfigJson)
  .replace('export { getFeeds };', 'module.exports = { fetchFeed: fetchFeed, getFeeds };');

const module = { exports: {} };
new Function('module', 'fetch', 'AbortSignal', code)(module, mockFetchWith10Items, global.AbortSignal);
const { fetchFeed } = module.exports;

test('fresh fetch returns at most 5 items', async () => {
  global.fetch = mockFetchWith10Items;
  
  const mockDb = {
    prepare: () => ({
      bind: () => ({
        first: () => Promise.resolve(null),
        run: () => Promise.resolve()
      })
    })
  };
  
  const config = JSON.parse(feedsConfigJson).find(c => c.id === 'fed-monetary');
  const result = await fetchFeed(config, null, mockDb);
  
  assert.ok(result.items.length <= 5);
  assert.equal(result.items.length, 5);
});

test('cached path returns at most 5 items', async () => {
  global.fetch = mockFetchWith10Items;
  
  const tenItems = [];
  for (let i = 1; i <= 10; i++) {
    tenItems.push({
      title: `Cached Item ${i}`,
      url: `https://www.federalreserve.gov/cached/${i}`,
      published: `2026-09-${27 - i}T18:00:00.000Z`
    });
  }
  
  const mockDb = {
    prepare: (sql) => ({
      bind: () => ({
        first: () => {
          if (sql.includes('SELECT')) {
            const now = new Date();
            const recentTime = new Date(now.getTime() - 10 * 60 * 1000);
            return Promise.resolve({
              items_json: JSON.stringify(tenItems),
              fetched_at: recentTime.toISOString()
            });
          }
          return Promise.resolve(null);
        },
        run: () => Promise.resolve()
      })
    })
  };
  
  const config = JSON.parse(feedsConfigJson).find(c => c.id === 'fed-monetary');
  const result = await fetchFeed(config, null, mockDb);
  
  assert.equal(result.sourceResult.stale, false);
  assert.ok(result.items.length <= 5);
  assert.equal(result.items.length, 5);
  assert.equal(result.items[0].title, 'Cached Item 1');
});

test('fallback path returns at most 5 items when feed fails', async () => {
  const tenItems = [];
  for (let i = 1; i <= 10; i++) {
    tenItems.push({
      title: `Stale Item ${i}`,
      url: `https://www.federalreserve.gov/stale/${i}`,
      published: `2026-09-${27 - i}T18:00:00.000Z`
    });
  }
  
  const mockDb = {
    prepare: (sql) => ({
      bind: () => ({
        first: () => {
          if (sql.includes('SELECT')) {
            const oldTime = new Date(Date.now() - 60 * 60 * 1000);
            return Promise.resolve({
              items_json: JSON.stringify(tenItems),
              fetched_at: oldTime.toISOString()
            });
          }
          return Promise.resolve(null);
        },
        run: () => Promise.resolve()
      })
    })
  };
  
  const codeWithFailure = feedsScript
    .replace('/* FEEDS_CONFIG */ null', feedsConfigJson)
    .replace('export { getFeeds };', 'module.exports = { fetchFeed: fetchFeed };');
  const moduleWithFailure = { exports: {} };
  new Function('module', 'fetch', 'AbortSignal', codeWithFailure)(moduleWithFailure, mockFetchFailure, global.AbortSignal);
  const { fetchFeed: fetchFeedWithFailure } = moduleWithFailure.exports;
  
  const config = JSON.parse(feedsConfigJson).find(c => c.id === 'fed-monetary');
  const result = await fetchFeedWithFailure(config, null, mockDb);
  
  assert.equal(result.sourceResult.stale, true);
  assert.ok(result.items.length <= 5);
  assert.equal(result.items.length, 5);
  assert.equal(result.items[0].title, 'Stale Item 1');
});

test('SEC disabled path returns at most 5 items', async () => {
  global.fetch = mockFetchWith10Items;
  
  const tenItems = [];
  for (let i = 1; i <= 10; i++) {
    tenItems.push({
      title: `SEC Item ${i}`,
      url: `https://www.sec.gov/news/${i}`,
      published: `2026-09-${27 - i}T18:00:00.000Z`
    });
  }
  
  const mockDb = {
    prepare: (sql) => ({
      bind: () => ({
        first: () => {
          if (sql.includes('SELECT')) {
            return Promise.resolve({
              items_json: JSON.stringify(tenItems),
              fetched_at: new Date().toISOString()
            });
          }
          return Promise.resolve(null);
        },
        run: () => Promise.resolve()
      })
    })
  };
  
  const config = JSON.parse(feedsConfigJson).find(c => c.id === 'sec-press');
  const result = await fetchFeed(config, null, mockDb);
  
  assert.equal(result.sourceResult.disabled, 'missing contact');
  assert.ok(result.items.length <= 5);
  assert.equal(result.items.length, 5);
});
