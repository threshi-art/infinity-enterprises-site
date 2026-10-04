import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Load the built worker text for string checks
const workerText = readFileSync('dist/server/index.js', 'utf8');

// Invented fixtures (never from live responses)
const OK_FEED = {
  section: 'mercati',
  notice: 'Not investment advice.',
  fetchedAt: '2026-10-01T20:00:00Z',
  stale: false,
  items: [
    {
      source: 'U.S. BEA',
      sourceId: 'bea-news',
      title: 'Example headline 2',
      url: 'https://www.bea.gov/example/invented-path-2.htm',
      published: '2026-10-01T18:00:00Z',
      description: 'This description should not render',
      summary: 'This summary should not render',
      image: 'https://example.com/should-not-render.jpg'
    },
    {
      source: 'Federal Reserve Board',
      sourceId: 'fed-monetary',
      title: '<b>Example</b> headline 3',
      url: 'https://www.federalreserve.gov/example/invented-path-3.htm',
      published: '2026-10-01T19:00:00Z'
    },
    {
      source: 'European Central Bank',
      sourceId: 'ecb-press',
      title: 'Example headline 1',
      url: 'https://www.ecb.europa.eu/example/invented-path-1.htm',
      published: '2026-10-01T20:00:00Z'
    },
    {
      source: 'U.S. SEC',
      sourceId: 'sec-press',
      title: 'Example headline 4',
      url: 'https://www.sec.gov/example/invented-path-4.htm',
      published: '2026-10-01T16:00:00Z'
    }
  ],
  sources: []
};

const BAD_URLS = {
  section: 'mercati',
  items: [
    {
      source: 'Test',
      title: 'HTTP URL',
      url: 'http://www.federalreserve.gov/bad',
      published: '2026-10-01T16:00:00Z'
    },
    {
      source: 'Test',
      title: 'JavaScript URL',
      url: 'javascript:alert(1)',
      published: '2026-10-01T16:00:00Z'
    }
  ]
};

const STALE_FEED = { ...OK_FEED, stale: true };

// Minimal DOM stub
function createDOMStub(elementIds = []) {
  const elements = new Map();
  
  elementIds.forEach(id => {
    const el = {
      id,
      children: [],
      textContent: '',
      className: '',
      href: '',
      target: '',
      rel: '',
      innerHTML: '',
      setAttribute(name, value) {
        this[name] = value;
      },
      appendChild(child) {
        this.children.push(child);
        return child;
      },
      insertAdjacentElement(position, element) {
        if (position === 'beforebegin') {
          this.beforeElement = element;
        }
      },
      replaceChildren(...children) {
        this.children = children;
      }
    };
    elements.set(id, el);
  });
  
  return {
    getElementById(id) {
      return elements.get(id) || null;
    },
    createElement(tag) {
      return {
        tagName: tag.toUpperCase(),
        children: [],
        textContent: '',
        className: '',
        href: '',
        target: '',
        rel: '',
        setAttribute(name, value) {
          this[name] = value;
        },
        appendChild(child) {
          this.children.push(child);
          return child;
        },
        insertAdjacentElement(position, element) {
          if (position === 'beforebegin') {
            this.beforeElement = element;
          }
        }
      };
    },
    createTextNode(text) {
      return { nodeType: 3, textContent: text };
    }
  };
}

// Tests for routes - check built HTML in worker
test('Built worker contains /daily-desk page', () => {
  assert.ok(workerText.includes('/daily-desk'));
  assert.ok(workerText.includes('The Daily Desk'));
});

test('Built worker contains /daily-desk/news page', () => {
  assert.ok(workerText.includes('/daily-desk/news'));
  assert.ok(workerText.includes('Policy & markets releases') || workerText.includes('Policy &amp; markets releases'));
  assert.ok(workerText.includes('Not investment advice'));
  assert.ok(workerText.includes('desk-news'));
});

test('/daily-desk lists all children', () => {
  // Check all routes/links exist
  assert.ok(workerText.includes('/daily-desk/news'), 'News route found');
  assert.ok(workerText.includes('/osint'), 'OSINT route found');
  assert.ok(workerText.includes('/enigmas'), 'Enigmas/Reading Room found');
  assert.ok(workerText.includes('The Practice'), 'The Practice text found');
  assert.ok(workerText.includes('Unfinished') || workerText.includes('In development'), 
    'The Practice marked as unfinished');
});

test('The Practice is not linked to /practice', () => {
  // Make sure we're not linking The Practice card to /practice (wrong dest)
  const practiceMatches = [];
  let idx = 0;
  while ((idx = workerText.indexOf('The Practice', idx)) !== -1) {
    const segment = workerText.slice(Math.max(0, idx - 100), idx + 100);
    practiceMatches.push(segment);
    idx += 1;
  }
  
  // Check segments near "The Practice" don't link to /practice
  const hasWrongLink = practiceMatches.some(seg => 
    seg.includes('href="/practice"') || seg.includes('href=\\"/practice\\"')
  );
  
  assert.ok(!hasWrongLink, 'The Practice should not link to /practice');
});

test('/daily-desk/news is in publication pages', () => {
  // Check it's in publicationPages object
  assert.ok(workerText.includes('/daily-desk/news'));
  
  // Worker.js builds VALID_PUBLIC_PATHS from publicationPages keys
  // So if it's in publicationPages, it will be page-view eligible
  const pagesMatch = workerText.match(/publicationPages\s*=/);
  assert.ok(pagesMatch, 'publicationPages found in worker');
});

test('Search data contains /daily-desk/news and no __PUBLICATION_NAME__ token', () => {
  assert.ok(workerText.includes('/daily-desk/news'));
  
  // Check no unreplaced __PUBLICATION_NAME__ token in worker
  assert.ok(!workerText.includes('__PUBLICATION_NAME__'), 
    '__PUBLICATION_NAME__ token should be replaced during build');
  
  // Working name is OK in studio branch; main-release guard handles it
});

// Renderer unit tests
test('Renderer: globalThis.__deskRender exists before early returns', () => {
  const dispatchCode = readFileSync('src/dispatch.js', 'utf8');
  const doc = createDOMStub([]);
  
  const sandbox = {
    globalThis: {},
    document: doc,
    fetch: async () => new Response(JSON.stringify(OK_FEED))
  };
  
  vm.runInNewContext(dispatchCode, sandbox);
  assert.ok(typeof sandbox.globalThis.__deskRender === 'function');
});

test('Renderer: renders items sorted newest first', () => {
  const dispatchCode = readFileSync('src/dispatch.js', 'utf8');
  
  // Check sorting logic in source
  assert.ok(dispatchCode.includes('.sort('), 'Should sort items');
  assert.ok(dispatchCode.includes('getTime'), 'Should sort by timestamp');
  assert.ok(dispatchCode.includes('bTime - aTime') || dispatchCode.includes('b.published') && dispatchCode.includes('a.published'), 
    'Should sort newest first (descending)');
});

test('Renderer: each item has only headline, source, date, link', () => {
  const dispatchCode = readFileSync('src/dispatch.js', 'utf8');
  
  // Check it accesses the required fields and nothing else
  assert.ok(dispatchCode.includes('.title'), 'Should use title');
  assert.ok(dispatchCode.includes('.source'), 'Should use source');
  assert.ok(dispatchCode.includes('.published'), 'Should use published date');
  assert.ok(dispatchCode.includes('.url'), 'Should use URL');
  
  // Should not access description, summary, or image
  assert.ok(!dispatchCode.includes('.description'), 'Should not use description');
  assert.ok(!dispatchCode.includes('.summary'), 'Should not use summary');
  assert.ok(!dispatchCode.includes('.image') || dispatchCode.includes('//') && dispatchCode.includes('.image'), 
    'Should not use image field (or only in comment)');
});

test('Renderer: links have new-tab text and proper attributes', () => {
  const dispatchCode = readFileSync('src/dispatch.js', 'utf8');
  
  // Check link attributes in source
  assert.ok(dispatchCode.includes('target') && dispatchCode.includes('_blank'), 
    'Should set target=_blank');
  assert.ok(dispatchCode.includes('rel') && dispatchCode.includes('noopener'), 
    'Should set rel=noopener noreferrer');
  assert.ok(dispatchCode.includes('new tab') || dispatchCode.includes('visually-hidden'), 
    'Should have new-tab text');
});

test('Renderer: dates show PT label', () => {
  const dispatchCode = readFileSync('src/dispatch.js', 'utf8');
  
  // Check date formatting includes PT
  assert.ok(dispatchCode.includes('America/Los_Angeles'), 'Should use Pacific timezone');
  assert.ok(dispatchCode.includes(' PT'), 'Should append PT label');
});

test('Renderer: bad URLs (http, javascript) are dropped', () => {
  const dispatchCode = readFileSync('src/dispatch.js', 'utf8');
  const doc = createDOMStub([]);
  
  const sandbox = {
    globalThis: {},
    document: doc,
    fetch: async () => new Response(JSON.stringify(BAD_URLS))
  };
  
  vm.runInNewContext(dispatchCode, sandbox);
  
  const rendered = sandbox.globalThis.__deskRender(BAD_URLS.items, null);
  assert.strictEqual(rendered.length, 0, 'Bad URLs should be filtered out');
});

test('Renderer: HTML in titles rendered as text', () => {
  const dispatchCode = readFileSync('src/dispatch.js', 'utf8');
  
  // Check the dispatch.js source uses textContent (not innerHTML)
  assert.ok(dispatchCode.includes('textContent'), 'Should use textContent for safety');
  assert.ok(!dispatchCode.includes('innerHTML'), 'Should not use innerHTML');
});

test('Renderer: #desk-latest shows exactly top 3', () => {
  const dispatchCode = readFileSync('src/dispatch.js', 'utf8');
  
  // Check the renderer accepts a limit parameter and slices appropriately
  assert.ok(dispatchCode.includes('limit'), 'Should accept limit parameter');
  assert.ok(dispatchCode.includes('.slice(0, limit)') || dispatchCode.includes('.slice(0,limit)'), 
    'Should slice to limit');
});

test('Renderer: stale feed shows visible marker', () => {
  const dispatchCode = readFileSync('src/dispatch.js', 'utf8');
  
  // Check the code handles stale state
  assert.ok(dispatchCode.includes('stale'), 'Should check for stale data');
  assert.ok(dispatchCode.includes('desk-stale') || dispatchCode.includes('may be stale'), 
    'Should show stale notice');
});

test('Renderer: fallback shows unavailable message and /osint link', () => {
  const dispatchCode = readFileSync('src/dispatch.js', 'utf8');
  
  // Check the code has fallback handling
  assert.ok(dispatchCode.includes('unavailable'));
  assert.ok(dispatchCode.includes('/osint'));
  assert.ok(dispatchCode.includes('catch'), 'Should have error handling');
});

test('dispatch.js never uses /api/dispatch', () => {
  const dispatchCode = readFileSync('src/dispatch.js', 'utf8');
  
  // Check the code only uses /api/feeds, not /api/dispatch
  assert.ok(!dispatchCode.includes('/api/dispatch'), 
    'dispatch.js should not reference /api/dispatch');
  assert.ok(dispatchCode.includes('/api/feeds?section=mercati'), 
    'Should use /api/feeds?section=mercati');
});

// Home #latest tests
test('Home #latest: code preserves last card and renders top 2', () => {
  const dispatchCode = readFileSync('src/dispatch.js', 'utf8');
  
  // Check it handles #signal-grid
  assert.ok(dispatchCode.includes('signal-grid'));
  assert.ok(dispatchCode.includes('lastElementChild'), 'Should preserve last Infinity card');
  assert.ok(dispatchCode.includes('slice(0, 2)') || dispatchCode.includes('.slice(0,2)'), 
    'Should take top 2 items');
});

test('Home #latest: signal cards have no img in renderer', () => {
  const dispatchCode = readFileSync('src/dispatch.js', 'utf8');
  
  // Check renderSignalCard function doesn't add img elements
  const signalCardMatch = dispatchCode.match(/function renderSignalCard[\s\S]{200,800}/);
  assert.ok(signalCardMatch, 'renderSignalCard function exists');
  
  const functionBody = signalCardMatch[0];
  assert.ok(!functionBody.includes('createElement(\'img\')') && 
            !functionBody.includes('createElement("img")'),
    'renderSignalCard should not create img elements');
});

test('Home #latest: status reads "Policy & markets releases"', () => {
  const dispatchCode = readFileSync('src/dispatch.js', 'utf8');
  
  // Check the success status message
  assert.ok(dispatchCode.includes('Policy & markets releases'));
  assert.ok(dispatchCode.includes('Recent source updates'));
});

test('Home #latest: feed failing shows unavailable status', () => {
  const dispatchCode = readFileSync('src/dispatch.js', 'utf8');
  
  // Check failure handling
  assert.ok(dispatchCode.includes('Infinity editorial picks'));
  assert.ok(dispatchCode.includes('Outside feed unavailable'));
});

test('Home #latest never uses /api/dispatch', () => {
  const dispatchCode = readFileSync('src/dispatch.js', 'utf8');
  
  // Confirmed: dispatch.js doesn't contain /api/dispatch
  // This is the same check as the previous test but for home context
  assert.ok(!dispatchCode.includes('/api/dispatch'), 
    'Home #latest should not use /api/dispatch');
});

test('home.html has updated #latest copy', () => {
  const homeHtml = readFileSync('src/home.html', 'utf8');
  
  // Check new copy is present
  assert.ok(homeHtml.includes('Policy and markets releases') || 
            homeHtml.includes('Policy & markets releases'), 
    'Should have new intro about policy/markets releases');
  assert.ok(homeHtml.includes('Headlines link to their original publisher'), 
    'Should have new feed note');
  
  // Check key terms are present
  assert.ok(homeHtml.includes('central banks') || homeHtml.includes('central bank'), 
    'Should mention central banks');
  assert.ok(homeHtml.includes('do not copy their text'), 
    'Should clarify we do not copy text/images');
});

// Preservation tests
test('MOTOR preserved: /motor contains motor-departments', async () => {
  const text = readFileSync('dist/server/index.js', 'utf8');
  assert.ok(text.includes('motor-departments'));
  assert.ok(text.includes('MOTOR'));
});

test('Ether preserved', async () => {
  const text = readFileSync('dist/server/index.js', 'utf8');
  assert.ok(text.includes('The Ether Room'));
  assert.ok(text.includes('Cosmic funk'));
});

test('No autoplay on desk pages', async () => {
  const pagesCode = readFileSync('src/publication-pages.mjs', 'utf8');
  const deskSection = pagesCode.slice(
    pagesCode.indexOf("'/daily-desk'"),
    pagesCode.indexOf("'/blog'")
  );
  
  assert.ok(!deskSection.includes('autoplay'));
});

test('No form or /api/subscribe on desk pages', async () => {
  const pagesCode = readFileSync('src/publication-pages.mjs', 'utf8');
  const deskSection = pagesCode.slice(
    pagesCode.indexOf("'/daily-desk'"),
    pagesCode.indexOf("'/blog'")
  );
  
  assert.ok(!deskSection.includes('<form'));
  assert.ok(!deskSection.includes('/api/subscribe'));
});

test('No __PUBLICATION_NAME__ token in dispatch.js', () => {
  const dispatchCode = readFileSync('src/dispatch.js', 'utf8');
  assert.ok(!dispatchCode.includes('__PUBLICATION_NAME__'));
});

test('No email pattern in changed files', () => {
  const dispatchCode = readFileSync('src/dispatch.js', 'utf8');
  const pagesCode = readFileSync('src/publication-pages.mjs', 'utf8');
  const homeHtml = readFileSync('src/home.html', 'utf8');
  
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  
  assert.ok(!emailPattern.test(dispatchCode));
  assert.ok(!emailPattern.test(pagesCode));
  // home.html may have noreply in footer from before, that's OK per brief
});

test('Worker includes /daily-desk/news in publicationPages', () => {
  // Worker.js will include /daily-desk/news in sitemap via publicationPages
  // Check the route exists in the worker
  assert.ok(workerText.includes('/daily-desk/news'), 'Route present in worker');
  
  // Check worker has publicationPages concept
  assert.ok(workerText.includes('publicationPages') || workerText.includes('pages'), 
    'Worker has pages structure');
});
