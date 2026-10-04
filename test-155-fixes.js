import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

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

test('D: guarded :visited rule exists in exactly one form', async () => {
  const siteCss = await readFile('./src/site.css', 'utf-8');
  const cssWithoutComments = siteCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = cssWithoutComments.split('}').filter(r => r.includes('{'));
  
  const visitedRules = rules.filter(r => r.includes(':visited'));
  
  assert.equal(visitedRules.length, 1, 'Exactly one :visited rule must exist');
  
  const rule = visitedRules[0].trim();
  assert.ok(rule.includes(':where(body:not(.motor):not(.ether) a:visited)'), 
    'The :visited selector must be :where(body:not(.motor):not(.ether) a:visited)');
  assert.ok(rule.includes('color:LinkText'), 
    'The declaration must be color:LinkText');
});

test('D: the guarded rule is in built /about and /development', async () => {
  for (const path of ['/about', '/development']) {
    const response = await worker.default.fetch(new Request(`https://example.com${path}`), mockEnv);
    assert.equal(response.status, 200, `${path} returns 200`);
    
    const html = await response.text();
    assert.ok(html.includes(':where(body:not(.motor):not(.ether) a:visited)'), 
      `${path} contains the guarded :visited rule`);
    assert.ok(html.includes('color:LinkText'), 
      `${path} contains color:LinkText`);
  }
});

test('D: guard targets exist on /motor and /ether', async () => {
  const motorResponse = await worker.default.fetch(new Request('https://example.com/motor'), mockEnv);
  assert.equal(motorResponse.status, 200);
  const motorHtml = await motorResponse.text();
  assert.ok(motorHtml.includes('<body class="motor">'), '/motor has <body class="motor">');
  assert.ok(motorHtml.includes(':where(body:not(.motor):not(.ether) a:visited)'), 
    '/motor contains the rule (site.css is inlined)');
  
  const etherResponse = await worker.default.fetch(new Request('https://example.com/ether'), mockEnv);
  assert.equal(etherResponse.status, 200);
  const etherHtml = await etherResponse.text();
  assert.ok(etherHtml.includes('<body class="ether">'), '/ether has <body class="ether">');
  assert.ok(etherHtml.includes(':where(body:not(.motor):not(.ether) a:visited)'), 
    '/ether contains the rule (site.css is inlined)');
});

test('D: existing site.css rules intact (durable form)', async () => {
  const siteCss = await readFile('./src/site.css', 'utf-8');
  
  const expectedRootBlock = ':root{--ink:#08101a;--cream:#f4f1eb;--rust:#c77c55;--muted:#aebccc;--ink-label:#54626c;--ink-meta:#54626c;--ink-muted:#4a5760;--ink-label-warm:#654b52;--rust-small:#8a4526;--rust-label:#8a4526;--rust-on-rust:#5b2f15}';
  assert.ok(siteCss.includes(expectedRootBlock), ':root block is byte-identical');
  
  const expectedFocusRing = 'button:focus-visible,a:focus-visible,summary:focus-visible{outline:2px solid #f1ad79;outline-offset:4px}';
  assert.ok(siteCss.includes(expectedFocusRing), 'focus ring rule is byte-identical');
  
  assert.ok(siteCss.includes(':where(body:not(.motor):not(.ether) a:visited){color:LinkText}'), 
    ':visited rule is present');
});

test('D: the rule does not reach /form', async () => {
  const response = await worker.default.fetch(new Request('https://example.com/form'), mockEnv);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.ok(!html.includes(':visited'), '/form contains no :visited');
  assert.ok(!html.includes('site.css'), '/form contains no inlined site.css reference');
});

test('C1: Journal masthead row no longer forces full width', async () => {
  const journalHtml = await readFile('./src/journal.html', 'utf-8');
  
  const mastRowRuleMatch = journalHtml.match(/\.journal\s+\.mast-row\s*\{[^}]*\}/);
  assert.ok(mastRowRuleMatch, '.journal .mast-row rule exists');
  
  const mastRowRule = mastRowRuleMatch[0];
  assert.ok(!mastRowRule.includes('width:100%'), '.mast-row rule does not contain width:100%');
  assert.ok(mastRowRule.includes('padding-top:130px'), '.mast-row rule keeps padding-top:130px');
  
  const response = await worker.default.fetch(new Request('https://example.com/journal'), mockEnv);
  const builtHtml = await response.text();
  const builtMastRowMatch = builtHtml.match(/\.journal\s+\.mast-row\s*\{[^}]*\}/);
  assert.ok(builtMastRowMatch && !builtMastRowMatch[0].includes('width:100%'), 
    'Built /journal .mast-row rule does not contain width:100%');
});

test('C1: .wrap rules are untouched', async () => {
  const journalHtml = await readFile('./src/journal.html', 'utf-8');
  
  assert.ok(journalHtml.includes('.wrap{width:min(1380px,calc(100% - 48px));margin:auto}'), 
    '.wrap rule is byte-identical');
  assert.ok(journalHtml.includes('@media(max-width:600px)') && 
            journalHtml.includes('.wrap{width:min(100% - 36px,560px)}'), 
    '.wrap mobile rule is byte-identical');
});

test('C1: the change is Journal-only', async () => {
  const journalHtml = await readFile('./src/journal.html', 'utf-8');
  assert.ok(journalHtml.includes('<div class="wrap mast-row">'), 
    'Journal still has wrap mast-row markup');
  assert.ok(journalHtml.includes('id="journal-title"'), 
    'Journal still has journal-title id');
});

test('regression: every base route returns 200 (checked as subset)', async () => {
  const baseRoutes = [
    '/', '/about', '/about/diana', '/development', '/development/atlas',
    '/journal', '/learning', '/foundation', '/foundation/youth',
    '/tech-lounge', '/enigmas', '/motor', '/ether', '/form',
    '/search', '/issues', '/contact',
    '/daily-desk', '/culture', '/music', '/osint'
  ];
  
  const sitemapResponse = await worker.default.fetch(new Request('https://example.com/sitemap.xml'), mockEnv);
  const sitemapXml = await sitemapResponse.text();
  const locMatches = sitemapXml.matchAll(/<loc>https:\/\/[^\/]+([^<]+)<\/loc>/g);
  const sitemapPaths = Array.from(locMatches, m => m[1]);
  
  const allRoutes = [...new Set([...baseRoutes, ...sitemapPaths, '/osint'])];
  
  for (const path of allRoutes) {
    const response = await worker.default.fetch(new Request(`https://example.com${path}`), mockEnv);
    assert.equal(response.status, 200, `${path} returns 200`);
  }
});

test('regression: redirects are unchanged including law image redirect', async () => {
  const redirects = [
    ['/diana', '/about/diana'],
    ['/atlas', '/development/atlas'],
    ['/media/hero.png', '/media/hero.jpg'],
    ['/media/enigmas-law.png', '/media/enigmas-law.jpg']
  ];
  
  for (const [from, to] of redirects) {
    const response = await worker.default.fetch(new Request(`https://example.com${from}`), mockEnv);
    assert.equal(response.status, 308, `${from} returns 308`);
    assert.equal(response.headers.get('location'), to, `${from} redirects to ${to}`);
  }
});

test('regression: /motor narrow checks on own rules', async () => {
  const response = await worker.default.fetch(new Request('https://example.com/motor'), mockEnv);
  assert.equal(response.status, 200);
  const html = await response.text();
  
  assert.ok(html.includes('<body class="motor">'), '/motor has correct body class');
  assert.ok(html.includes('∞ Infinity Enterprises'), '/motor has correct site-brand text');
  assert.ok(html.includes('MOTOR'), '/motor has MOTOR in hero');
  assert.ok(html.includes('motor-main'), '/motor has motor-main');
  
  const motorSourceHtml = await readFile('./src/motor.html', 'utf-8');
  const ownStyleMatches = motorSourceHtml.match(/<style>\s*([\s\S]*?)\s*<\/style>/g);
  assert.ok(ownStyleMatches && ownStyleMatches.length >= 2, 'motor.html has own <style> blocks');
  
  const lastStyleBlock = ownStyleMatches[ownStyleMatches.length - 1];
  const ownStyleContent = lastStyleBlock.replace(/<\/?style>/g, '').trim();
  assert.ok(html.includes(ownStyleContent.substring(0, 100)), '/motor contains its own inline <style>');
});

test('regression: /ether narrow checks on own rules', async () => {
  const response = await worker.default.fetch(new Request('https://example.com/ether'), mockEnv);
  assert.equal(response.status, 200);
  const html = await response.text();
  
  assert.ok(html.includes('<body class="ether">'), '/ether has correct body class');
  assert.ok(html.includes('∞ Infinity Enterprises'), '/ether has correct site-brand text');
  assert.ok(html.includes('id="ether-player"'), '/ether has ether-player id');
  assert.ok(html.includes('player-frame'), '/ether has player-frame');
  assert.ok(html.includes('<script>') && html.includes('player'), '/ether includes player script');
  
  const etherSourceHtml = await readFile('./src/ether.html', 'utf-8');
  const ownStyleMatches = etherSourceHtml.match(/<style>\s*([\s\S]*?)\s*<\/style>/g);
  assert.ok(ownStyleMatches && ownStyleMatches.length >= 2, 'ether.html has own <style> blocks');
  
  const lastStyleBlock = ownStyleMatches[ownStyleMatches.length - 1];
  const ownStyleContent = lastStyleBlock.replace(/<\/?style>/g, '').trim();
  assert.ok(html.includes(ownStyleContent.substring(0, 100)), '/ether contains its own inline <style>');
});

test('regression: /form narrow checks on own rules', async () => {
  const response = await worker.default.fetch(new Request('https://example.com/form'), mockEnv);
  assert.equal(response.status, 200);
  const html = await response.text();
  
  assert.ok(!html.includes('class="site-header"'), '/form has no site-header');
  assert.ok(!html.includes(':visited'), '/form has no :visited');
  assert.ok(!html.includes('SHARED_CSS'), '/form has no SHARED_CSS placeholder');
  
  const formSourceHtml = await readFile('./src/form.html', 'utf-8');
  const ownStyleMatch = formSourceHtml.match(/<style>\s*([\s\S]*?)\s*<\/style>/);
  assert.ok(ownStyleMatch, 'form.html has own <style> block');
  
  const ownStyle = ownStyleMatch[1].trim();
  assert.ok(html.includes(ownStyle.substring(0, 100)), '/form contains its own inline <style>');
});

test('regression: no autoplay attributes in built pages', async () => {
  const routes = ['/', '/about', '/journal', '/motor', '/ether'];
  
  for (const path of routes) {
    const response = await worker.default.fetch(new Request(`https://example.com${path}`), mockEnv);
    const html = await response.text();
    
    const autoplayTags = html.match(/<(?:audio|video)[^>]*autoplay/gi);
    assert.ok(!autoplayTags || autoplayTags.length === 0, 
      `${path} has no autoplay on audio/video tags`);
    
    const urlAutoplay = html.match(/src=["'][^"']*autoplay=1/g);
    if (urlAutoplay) {
      assert.ok(path === '/ether', 
        'autoplay=1 in src only allowed in /ether click-time frame.src assignment');
    }
  }
});

test('regression: package.json test line keeps every entry', async () => {
  const packageJson = JSON.parse(await readFile('./package.json', 'utf-8'));
  const testScript = packageJson.scripts.test;
  
  const expectedTests = [
    'test-155-fixes.js',
    'test-feeds.js',
    'test-feeds-integration.js',
    'test-page-views.js',
    'test-publication-name.js',
    'test-room-sound.js',
    'test-smoke.js',
    'test-suspect-days.js',
    'test-ukraine-map.js'
  ];
  
  for (const testFile of expectedTests) {
    assert.ok(testScript.includes(testFile), 
      `test script includes ${testFile}`);
  }
  
  assert.ok(testScript.includes('node --test'), 
    'test script uses node --test');
  assert.ok(testScript.endsWith('&& test/image-metadata.test.sh'), 
    'test script ends with && test/image-metadata.test.sh');
});
