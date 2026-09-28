import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const feedsScript = await readFile('src/feeds.js', 'utf8');
const feedsConfig = JSON.parse(await readFile('src/feeds.json', 'utf8'));

function cleanTitle(text) {
  const withoutTags = text.replace(/<[^>]*>/g, '');
  const decoded = withoutTags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  return decoded.replace(/\s+/g, ' ').trim().slice(0, 180);
}

function extractText(xmlSegment, tagName) {
  const pattern = new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = xmlSegment.match(pattern);
  if (!match) return '';
  let content = match[1].trim();
  if (content.startsWith('<![CDATA[') && content.endsWith(']]>')) {
    content = content.slice(9, -3);
  }
  return content;
}

function normalizeUrl(url, allowHosts) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    if (!allowHosts.includes(parsed.hostname)) return null;
    if (parsed.protocol === 'http:' && allowHosts.includes(parsed.hostname)) {
      parsed.protocol = 'https:';
    }
    let pathname = parsed.pathname.replace(/\/\/+/g, '/');
    parsed.pathname = pathname;
    return parsed.toString();
  } catch {
    return null;
  }
}

function parseDate(dateString) {
  const parsed = Date.parse(dateString);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : null;
}

function parseEntries(xml, config) {
  const items = [];
  const isAtom = xml.includes('<feed') && xml.includes('xmlns="http://www.w3.org/2005/Atom"');
  const entryPattern = isAtom
    ? /<entry>([\s\S]*?)<\/entry>/gi
    : /<item>([\s\S]*?)<\/item>/gi;
  const matches = [...xml.matchAll(entryPattern)].slice(0, 10);

  for (const match of matches) {
    const segment = match[1];
    const titleRaw = isAtom ? extractText(segment, 'title') : extractText(segment, 'title');
    const linkRaw = isAtom
      ? (segment.match(/<link[^>]*href=["']([^"']+)["']/i)?.[1] || extractText(segment, 'link'))
      : extractText(segment, 'link');
    const dateRaw = isAtom
      ? (extractText(segment, 'updated') || extractText(segment, 'published'))
      : (extractText(segment, 'pubDate') || extractText(segment, 'dc:date'));

    if (!titleRaw || !linkRaw) continue;

    const title = cleanTitle(titleRaw);
    const url = normalizeUrl(linkRaw, config.allowHosts);
    const published = parseDate(dateRaw);

    if (!title || !url || !published) continue;

    if (config.id === 'ecb-press' && !url.includes('/press/pr/')) continue;

    items.push({ title, url, published });
  }

  return items;
}

test('cleanTitle strips HTML tags', () => {
  const input = '<p>Hello <strong>World</strong></p>';
  const result = cleanTitle(input);
  assert.equal(result, 'Hello World');
});

test('cleanTitle decodes HTML entities', () => {
  const input = 'AT&amp;T announces &quot;5G&quot; rollout';
  const result = cleanTitle(input);
  assert.equal(result, 'AT&T announces "5G" rollout');
});

test('cleanTitle handles numeric entities', () => {
  const input = 'Price: &#36;100 &#8211; &#36;200';
  const result = cleanTitle(input);
  assert.equal(result, 'Price: $100 – $200');
});

test('cleanTitle collapses whitespace', () => {
  const input = '  Multiple   spaces  and\nnewlines  ';
  const result = cleanTitle(input);
  assert.equal(result, 'Multiple spaces and newlines');
});

test('cleanTitle truncates to 180 chars', () => {
  const input = 'a'.repeat(200);
  const result = cleanTitle(input);
  assert.equal(result.length, 180);
});

test('extractText extracts content from XML tag', () => {
  const xml = '<item><title>Test Title</title><link>http://example.com</link></item>';
  assert.equal(extractText(xml, 'title'), 'Test Title');
  assert.equal(extractText(xml, 'link'), 'http://example.com');
});

test('extractText handles CDATA', () => {
  const xml = '<item><title><![CDATA[Title with <html>]]></title></item>';
  const result = extractText(xml, 'title');
  assert.equal(result, 'Title with <html>');
});

test('extractText returns empty for missing tag', () => {
  const xml = '<item><title>Test</title></item>';
  assert.equal(extractText(xml, 'description'), '');
});

test('normalizeUrl upgrades http to https', () => {
  const url = 'http://www.bea.gov/news/2026/gdp';
  const result = normalizeUrl(url, ['www.bea.gov']);
  assert.equal(result, 'https://www.bea.gov/news/2026/gdp');
});

test('normalizeUrl collapses double slashes in path', () => {
  const url = 'https://www.ecb.europa.eu//press//pr//date//2026//html//index.html';
  const result = normalizeUrl(url, ['www.ecb.europa.eu']);
  assert.equal(result, 'https://www.ecb.europa.eu/press/pr/date/2026/html/index.html');
});

test('normalizeUrl rejects disallowed hosts', () => {
  const url = 'https://malicious.com/fake-article';
  const result = normalizeUrl(url, ['example.com']);
  assert.equal(result, null);
});

test('normalizeUrl rejects non-http protocols', () => {
  const url = 'javascript:alert(1)';
  const result = normalizeUrl(url, ['example.com']);
  assert.equal(result, null);
});

test('parseDate handles RFC 2822 format', () => {
  const date = 'Mon, 16 Sep 2026 18:00:00 GMT';
  const result = parseDate(date);
  assert.ok(result);
  assert.ok(result.startsWith('2026-09-16'));
});

test('parseDate handles ISO 8601 format', () => {
  const date = '2026-09-16T18:00:00Z';
  const result = parseDate(date);
  assert.equal(result, '2026-09-16T18:00:00.000Z');
});

test('parseDate returns null for invalid date', () => {
  const result = parseDate('not a date');
  assert.equal(result, null);
});

test('parseEntries extracts items from RSS feed', () => {
  const rss = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <item>
      <title>First Item</title>
      <link>https://www.federalreserve.gov/1</link>
      <pubDate>Mon, 16 Sep 2026 18:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Second Item</title>
      <link>https://www.federalreserve.gov/2</link>
      <pubDate>Mon, 15 Sep 2026 18:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;
  const config = feedsConfig.find(c => c.id === 'fed-monetary');
  const items = parseEntries(rss, config);
  assert.equal(items.length, 2);
  assert.equal(items[0].title, 'First Item');
  assert.equal(items[0].url, 'https://www.federalreserve.gov/1');
  assert.ok(items[0].published);
});

test('parseEntries extracts items from Atom feed', () => {
  const atom = `<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <title>Atom Entry</title>
    <link href="https://www.sec.gov/atom/1"/>
    <updated>2026-09-16T18:00:00Z</updated>
  </entry>
</feed>`;
  const config = feedsConfig.find(c => c.id === 'sec-press');
  const items = parseEntries(atom, config);
  assert.equal(items.length, 1);
  assert.equal(items[0].title, 'Atom Entry');
  assert.equal(items[0].url, 'https://www.sec.gov/atom/1');
});

test('parseEntries filters ECB non-press-release items', () => {
  const rss = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <item>
      <title>Press Release</title>
      <link>https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.pr260916.en.html</link>
      <pubDate>Mon, 16 Sep 2026 18:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Speech</title>
      <link>https://www.ecb.europa.eu/press/speech/date/2026/html/ecb.sp260915.en.html</link>
      <pubDate>Mon, 15 Sep 2026 18:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;
  const config = feedsConfig.find(c => c.id === 'ecb-press');
  const items = parseEntries(rss, config);
  assert.equal(items.length, 1);
  assert.equal(items[0].title, 'Press Release');
  assert.ok(items[0].url.includes('/press/pr/'));
});

test('parseEntries strips description and other fields', () => {
  const rss = `<?xml version="1.0"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <item>
      <title>News Item</title>
      <link>https://www.bea.gov/news</link>
      <pubDate>Mon, 16 Sep 2026 18:00:00 GMT</pubDate>
      <description>Full article text that should not be included</description>
      <content:encoded><![CDATA[<p>Even more content</p>]]></content:encoded>
      <media:content url="https://www.bea.gov/image.jpg"/>
      <enclosure url="https://www.bea.gov/video.mp4"/>
      <category>Business</category>
      <dc:creator>Author Name</dc:creator>
    </item>
  </channel>
</rss>`;
  const config = feedsConfig.find(c => c.id === 'bea-news');
  const items = parseEntries(rss, config);
  assert.equal(items.length, 1);
  assert.ok(!items[0].description);
  assert.ok(!items[0].content);
  assert.ok(!items[0].media);
  assert.ok(!items[0].enclosure);
  assert.ok(!items[0].category);
  assert.ok(!items[0].creator);
  assert.deepEqual(Object.keys(items[0]).sort(), ['published', 'title', 'url']);
});

test('parseEntries handles empty feed', () => {
  const rss = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>Empty Feed</title>
  </channel>
</rss>`;
  const config = feedsConfig[0];
  const items = parseEntries(rss, config);
  assert.equal(items.length, 0);
});

test('parseEntries handles malformed XML gracefully', () => {
  const rss = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <item>
      <title>Valid Item</title>
      <link>https://www.federalreserve.gov/valid</link>
      <pubDate>Mon, 16 Sep 2026 18:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Missing Link</title>
      <pubDate>Mon, 15 Sep 2026 18:00:00 GMT</pubDate>
    </item>
    <item>
      <link>https://www.federalreserve.gov/no-title</link>
      <pubDate>Mon, 14 Sep 2026 18:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;
  const config = feedsConfig.find(c => c.id === 'fed-monetary');
  const items = parseEntries(rss, config);
  assert.equal(items.length, 1);
  assert.equal(items[0].title, 'Valid Item');
});

test('parseEntries handles CDATA in RSS', () => {
  const rss = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <item>
      <title><![CDATA[Title with <special> characters & "quotes"]]></title>
      <link>https://www.federalreserve.gov/1</link>
      <pubDate>Mon, 16 Sep 2026 18:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;
  const config = feedsConfig.find(c => c.id === 'fed-monetary');
  const items = parseEntries(rss, config);
  assert.equal(items.length, 1);
  assert.equal(items[0].title, 'Title with characters & "quotes"');
});

test('parseEntries upgrades http to https for BEA', () => {
  const rss = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <item>
      <title>BEA News</title>
      <link>http://www.bea.gov/news/2026/gdp</link>
      <pubDate>Mon, 16 Sep 2026 18:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;
  const config = feedsConfig.find(c => c.id === 'bea-news');
  const items = parseEntries(rss, config);
  assert.equal(items.length, 1);
  assert.equal(items[0].url, 'https://www.bea.gov/news/2026/gdp');
});

test('parseEntries handles ECB double slashes', () => {
  const rss = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <item>
      <title>ECB Press Release</title>
      <link>https://www.ecb.europa.eu//press//pr//date//2026//html//ecb.pr260916.en.html</link>
      <pubDate>Mon, 16 Sep 2026 18:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;
  const config = feedsConfig.find(c => c.id === 'ecb-press');
  const items = parseEntries(rss, config);
  assert.equal(items.length, 1);
  assert.equal(items[0].url, 'https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.pr260916.en.html');
});

test('feedsConfig has correct structure', () => {
  assert.ok(Array.isArray(feedsConfig));
  assert.ok(feedsConfig.length > 0);
  for (const config of feedsConfig) {
    assert.ok(config.id);
    assert.ok(config.name);
    assert.ok(config.url);
    assert.ok(config.section);
    assert.ok(Array.isArray(config.allowHosts));
    assert.ok(config.terms);
    assert.ok(config.terms.url);
    assert.ok(config.terms.note);
    assert.ok(config.terms.checked);
    assert.ok(config.terms.by);
  }
});

test('feedsConfig sources match requirements', () => {
  const ids = feedsConfig.map(c => c.id);
  assert.ok(ids.includes('fed-monetary'));
  assert.ok(ids.includes('fed-speeches'));
  assert.ok(ids.includes('sec-press'));
  assert.ok(ids.includes('bea-news'));
  assert.ok(ids.includes('ecb-press'));
});
