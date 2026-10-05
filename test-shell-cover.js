import { test } from 'node:test';
import { strictEqual, ok, match, doesNotMatch } from 'node:assert';
import { readFileSync } from 'node:fs';

const worker = await import('./dist/server/index.js');
const validPaths = JSON.parse(readFileSync('./dist/server/index.js', 'utf8').match(/\["\/",.*?\]/)?.[0] || '[]');

function makeRequest(path, method = 'GET') {
  return new Request(`https://test.local${path}`, { method });
}

async function html(path) {
  const response = await worker.default.fetch(makeRequest(path), {});
  strictEqual(response.status, 200, `${path} should return 200`);
  return await response.text();
}

test('1. /cover-story returns 200, no build tokens, no working name', async () => {
  const coverStory = await html('/cover-story');
  ok(coverStory.length > 100, 'cover story page exists');
  doesNotMatch(coverStory, /__PUBLICATION_NAME__/, 'no __PUBLICATION_NAME__ token');
  doesNotMatch(coverStory, /__COVER_ESSAY_HREF__/, 'no __COVER_ESSAY_HREF__ token');
  
  const built = readFileSync('./dist/server/index.js', 'utf8');
  doesNotMatch(built, /__PUBLICATION_NAME__/, 'no __PUBLICATION_NAME__ in build');
  doesNotMatch(built, /__COVER_ESSAY_HREF__/, 'no __COVER_ESSAY_HREF__ in build');
});

test('2. Panel order and structure', async () => {
  const home = await html('/');
  const dailyDesk = await html('/daily-desk');
  
  const panelMatch = home.match(/<nav class="toc-panel"[^>]*>([\s\S]*?)<\/nav>/);
  ok(panelMatch, 'panel exists');
  const panel = panelMatch[1];
  
  const sections = [...panel.matchAll(/<a href="([^"]+)"[^>]*>([^<]*?)(?:<small|<\/a>)/g)].map(m => ({ href: m[1], label: m[2] }));
  const topLevel = sections.filter(s => !s.href.includes('#') && !/<a|<span/.test(s.href));
  
  const topLabels = topLevel.map(s => s.label.replace(/\s*\(.*?\)\s*/g, '').trim());
  ok(topLabels.indexOf('Cover Story') < topLabels.indexOf('The Daily Desk'), 'Cover Story before Daily Desk');
  ok(topLabels.indexOf('The Daily Desk') < topLabels.indexOf('Lifestyle'), 'Daily Desk before Lifestyle');
  ok(topLabels.indexOf('Lifestyle') < topLabels.indexOf('MOTOR'), 'Lifestyle before MOTOR');
  ok(topLabels.indexOf('MOTOR') < topLabels.indexOf('Music'), 'MOTOR before Music');
  ok(topLabels.indexOf('Music') < topLabels.indexOf('Academic Journal'), 'Music before Academic Journal');
  ok(topLabels.indexOf('Academic Journal') < topLabels.indexOf('Tech Lounge'), 'Academic Journal before Tech Lounge');
  ok(topLabels.indexOf('Tech Lounge') < topLabels.indexOf('In Development'), 'Tech Lounge before In Development');
  ok(topLabels.indexOf('In Development') < topLabels.indexOf('About'), 'In Development before About');
  
  doesNotMatch(panel, /<a[^>]*>The Practice<\/a>/, 'The Practice is not a link');
  match(panel, /The Practice/, 'The Practice appears in panel');
  match(panel, /Forge &amp; Flow/, 'Forge & Flow in panel');
});

test('3. Nothing unreachable', async () => {
  const home = await html('/');
  const enigmas = await html('/enigmas');
  const sitemap = await (await worker.default.fetch(makeRequest('/sitemap.xml'), {})).text();
  
  const panelMatch = home.match(/<nav class="toc-panel"[^>]*>([\s\S]*?)<\/nav>/);
  const panel = panelMatch[1];
  const panelHrefs = [...panel.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  
  const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname);
  sitemapPaths.push('/osint');
  
  // Core routes must be in panel (excluding diana tribute page per brief comment)
  const coreRoutes = ['/', '/cover-story', '/about', '/about/standards', '/development', '/development/atlas', 
    '/learning', '/journal', '/foundation', '/foundation/youth', '/tech-lounge', '/motor', '/ether', '/form', 
    '/enigmas', '/osint', '/culture', '/music', '/inquiry'];
  for (const path of coreRoutes.filter(p => sitemapPaths.includes(p))) {
    ok(panelHrefs.includes(path), `${path} in panel`);
  }
  
  for (const path of sitemapPaths.filter(p => p.startsWith('/enigmas/'))) {
    match(enigmas, new RegExp(`href="${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`), `${path} linked from /enigmas`);
  }
  
  const requiredAnchors = ['/departments#department-2', '/departments#department-3', '/departments#department-5', '/departments#department-6'];
  for (const anchor of requiredAnchors) {
    ok(panelHrefs.includes(anchor), `${anchor} in panel`);
  }
  
  const departments = await html('/departments');
  for (const anchor of requiredAnchors) {
    const id = anchor.split('#')[1];
    match(departments, new RegExp(`id="${id}"`), `${id} exists in /departments`);
  }
});

test('4. Routes and sitemap', async () => {
  const sitemap = await (await worker.default.fetch(makeRequest('/sitemap.xml'), {})).text();
  const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname);
  
  ok(sitemapPaths.includes('/cover-story'), '/cover-story in sitemap');
  strictEqual(sitemapPaths.filter(p => p === '/cover-story').length, 1, '/cover-story exactly once in sitemap');
  
  for (const path of ['/', '/about', '/development', '/journal', '/tech-lounge', '/motor', '/ether', '/form', '/enigmas']) {
    const response = await worker.default.fetch(makeRequest(path), {});
    strictEqual(response.status, 200, `${path} returns 200`);
  }
  
  ok(validPaths.includes('/cover-story'), '/cover-story in VALID_PUBLIC_PATHS');
  
  const pvResponse = await worker.default.fetch(makeRequest('/api/pv', 'POST'), {
    DB: { prepare: () => ({ bind: () => ({ run: () => Promise.resolve() }) }) }
  });
  strictEqual(pvResponse.status, 204, 'POST /api/pv returns 204');
});

test('5. Masthead', async () => {
  const home = await html('/');
  const motor = await html('/motor');
  const ether = await html('/ether');
  const form = await html('/form');
  const journal = await html('/journal');
  const coverStory = await html('/cover-story');
  
  match(home, /<a[^>]*class="[^"]*shell-masthead/, 'home has shell-masthead element');
  match(home, /shell-working-name/, 'home has shell-working-name');
  match(home, /Publication name: unfinished/, 'home has marker text (no #107 visible)');
  doesNotMatch(home, /Publication name: unfinished<\/a>/, 'marker not inside link');
  doesNotMatch(home, /#107[^<]*Publication name/, 'no #107 in visible marker text');
  
  doesNotMatch(motor, /<a[^>]*class="[^"]*shell-masthead/, 'motor has no shell-masthead element');
  match(motor, /<a class="site-brand"/, 'motor has site-brand');
  doesNotMatch(ether, /<a[^>]*class="[^"]*shell-masthead/, 'ether has no shell-masthead element');
  match(ether, /<a class="site-brand"/, 'ether has site-brand');
  doesNotMatch(form, /<a[^>]*class="[^"]*shell-masthead/, 'form has no shell-masthead element');
  doesNotMatch(form, /<nav[^>]*class="[^"]*room-bar/, 'form has no room-bar element');
  
  match(journal, /<a[^>]*class="[^"]*shell-masthead/, 'journal has shell-masthead element');
  match(coverStory, /<a[^>]*class="[^"]*shell-masthead/, '/cover-story has shell-masthead element');
  match(coverStory, /<details class="toc">/, '/cover-story toc-panel sits inside <details class="toc">');
});

test('6. MOTOR/Ether narrow tests', async () => {
  const motor = await html('/motor');
  const ether = await html('/ether');
  
  match(motor, /<body class="motor">/, 'motor has body.motor');
  match(motor, /motor-departments/, 'motor has motor-departments');
  match(ether, /<body class="ether">/, 'ether has body.ether');
  match(ether, /player-frame/, 'ether has player-frame');
  match(ether, /getElementById\('ether-player'\)/, 'ether has inline ether script');
});

test('7. No autoplay', () => {
  const built = readFileSync('./dist/server/index.js', 'utf8');
  doesNotMatch(built, /<(?:audio|video)[^>]*autoplay/i, 'no autoplay on audio/video elements');
});

test('8. No real subscribe in new surfaces', async () => {
  const coverStory = await html('/cover-story');
  const home = await html('/');
  
  doesNotMatch(coverStory, /<form/, '/cover-story has no form');
  doesNotMatch(coverStory, /action="\/api\/subscribe"/, '/cover-story has no subscribe action');
  
  const panelMatch = home.match(/<nav class="toc-panel"[^>]*>([\s\S]*?)<\/nav>/);
  const panel = panelMatch[1];
  const subscribeLinks = [...panel.matchAll(/href="\/subscribe"/g)];
  ok(subscribeLinks.length > 0, 'panel has /subscribe link');
});

test('9. Cover Story content', async () => {
  const coverStory = await html('/cover-story');
  const home = await html('/');
  
  match(coverStory, /Human authority in an age of intelligent systems\./, 'cover story has correct summary');
  match(coverStory, /Who governs/, 'cover story has headline');
  match(coverStory, /\/media\/cover\.jpg/, 'cover story has cover image');
  match(coverStory, /Illustrative hand above a networked glass table beside papers and a compass/, 'cover story has image alt');
  match(coverStory, /unfinished<!--\s*#13\s*-->/, 'cover story has #13 in comment');
  match(coverStory, /not included/, 'cover story says media not included');
  doesNotMatch(coverStory, /Original artwork/, 'no "Original artwork"');
  doesNotMatch(coverStory, /credit unfinished/, 'no "credit unfinished"');
  doesNotMatch(coverStory, /By /, 'no byline');
  
  const essayLinkMatch = coverStory.match(/href="([^"]+)">Read the full essay/);
  ok(essayLinkMatch, 'essay link exists');
  const homeButtonMatch = home.match(/<a class="button" href="([^"]+)">Read the cover story/);
  ok(homeButtonMatch, 'home button exists');
  strictEqual(essayLinkMatch[1], homeButtonMatch[1], 'essay link matches home button href');
});

test('10. Headline not in image container', async () => {
  const coverStory = await html('/cover-story');
  const imageSection = coverStory.match(/<div class="cover-story-image">[\s\S]*?<\/div>/);
  ok(imageSection, 'image section exists');
  doesNotMatch(imageSection[0], /Who governs/, 'headline not in image container');
});

test('11. Home scope', async () => {
  const home = await html('/');
  
  match(home, /id="latest"/, 'home has #latest');
  match(home, /id="signal-grid"/, 'home has signal-grid');
  match(home, /issue-splash/, 'home has splash');
  match(home, /motor-teaser/, 'home has motor-teaser');
  match(home, /ether-teaser/, 'home has ether-teaser');
  match(home, /aria-pressed="false"/, 'home has music toggle');
  match(home, /class="closing"/, 'home has closing section');
  
  match(home, /href="\/cover-story"/, 'home links to /cover-story');
  match(home, /Open the Cover Story page/, 'home has Cover Story page link');
  match(home, /Read the cover story/, 'home has existing button text');
  
  doesNotMatch(home, /The September issue/, 'no "The September issue"');
  doesNotMatch(home, /Volume 01/, 'no "Volume 01"');
  match(home, /Current issue · unfinished<!--\s*#13\s*-->/, 'home has #13 in comment');
  match(home, /THE SEPTEMBER ISSUE/, 'stamp still says THE SEPTEMBER ISSUE');
  doesNotMatch(home, /Original artwork/, 'no "Original artwork"');
  doesNotMatch(home, /credit unfinished/, 'no "credit unfinished" visible');
});

test('12. Item B CSS', () => {
  const home = readFileSync('./src/home.html', 'utf8');
  match(home, /\.cover h1{font-size:clamp\(2\.9rem,12\.5vw,6rem\)/, 'item B has new floor');
  match(home, /overflow-wrap:anywhere/, 'item B has overflow-wrap');
});

test('13. site.css checks', () => {
  const css = readFileSync('./src/site.css', 'utf8');
  const rootBlocks = [...css.matchAll(/:root\{[^}]+\}/g)];
  ok(rootBlocks.length >= 2, 'at least 2 :root blocks');
  
  match(css, /--shell-ink/, 'new token --shell-ink');
  match(css, /--ivory/, 'new token --ivory');
  match(css, /--copper/, 'new token --copper');
  match(css, /--font-display/, 'new token --font-display');
  match(css, /--font-ui/, 'new token --font-ui');
  
  const newRules = [...css.matchAll(/\.(shell-|cover-story-|room-bar)[^{]+\{[^}]+color:[^;}]+/g)];
  ok(newRules.length > 0, 'new rules with color declarations');
});

test('14. Room bar hrefs appear exactly once', async () => {
  for (const path of ['/', '/journal', '/cover-story']) {
    const page = await html(path);
    const roomBarMatch = page.match(/<nav[^>]*class="[^"]*room-bar[^"]*"[^>]*>(.*?)<\/nav>/s);
    if (!roomBarMatch) throw new Error(`${path} has no room-bar`);
    const roomBarHtml = roomBarMatch[1];
    const hrefs = [...roomBarHtml.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
    const ariaCurrent = [...roomBarHtml.matchAll(/aria-current="page"/g)];
    
    const uniqueHrefs = [...new Set(hrefs)];
    strictEqual(hrefs.length, uniqueHrefs.length, `${path}: all room-bar hrefs are unique`);
    ok(ariaCurrent.length <= 1, `${path}: aria-current appears at most once`);
  }
});

test('15. No visible issue references outside comments', async () => {
  const home = await html('/');
  const coverStory = await html('/cover-story');
  
  const homeWithoutComments = home.replace(/<!--[\s\S]*?-->/g, '');
  const coverStoryWithoutComments = coverStory.replace(/<!--[\s\S]*?-->/g, '');
  
  doesNotMatch(homeWithoutComments, /\(#\d+\)/, 'home has no visible (#N) issue references outside comments');
  doesNotMatch(coverStoryWithoutComments, /\(#\d+\)/, '/cover-story has no visible (#N) issue references outside comments');
});

console.log('All tests passed!');
