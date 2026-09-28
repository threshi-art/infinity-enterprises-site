const feedsConfig = /* FEEDS_CONFIG */ null;

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

async function fetchFeed(config, secContactEmail, db) {
  const sourceResult = {
    id: config.id,
    name: config.name,
    fetchedAt: null,
    stale: false,
    disabled: null,
  };

  if (config.id === 'sec-press' && !secContactEmail) {
    sourceResult.disabled = 'missing contact';
    const snapshot = db ? await getSnapshot(db, config.id) : null;
    return { sourceResult, items: snapshot?.items || [] };
  }

  let snapshot = null;
  if (db) {
    snapshot = await getSnapshot(db, config.id);
    if (snapshot && snapshot.fetchedAt) {
      const age = Date.now() - new Date(snapshot.fetchedAt).getTime();
      if (age < 30 * 60 * 1000) {
        sourceResult.fetchedAt = snapshot.fetchedAt;
        sourceResult.stale = false;
        return { sourceResult, items: snapshot.items };
      }
    }
  }

  const userAgent = config.id === 'sec-press'
    ? `Infinity Enterprises <${secContactEmail}>`
    : 'Infinity Enterprises market news aggregator (infinity-enterprises.infinity-ent-8507.chatgpt.site)';

  try {
    const response = await fetch(config.url, {
      signal: AbortSignal.timeout(4500),
      headers: {
        'user-agent': userAgent,
        accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml',
      },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const text = await response.text();
    if (text.length > 500000) throw new Error('Response too large');

    const items = parseEntries(text.slice(0, 500000), config);

    if (items.length > 0) {
      const now = new Date().toISOString();
      sourceResult.fetchedAt = now;
      sourceResult.stale = false;
      if (db) await saveSnapshot(db, config.id, items, now, null);
      return { sourceResult, items: items.slice(0, 5) };
    } else {
      throw new Error('No valid items');
    }
  } catch (error) {
    if (snapshot) {
      sourceResult.fetchedAt = snapshot.fetchedAt;
      sourceResult.stale = true;
      if (db) await updateAttempt(db, config.id, error.message);
      return { sourceResult, items: snapshot.items };
    } else {
      if (db) await updateAttempt(db, config.id, error.message);
      return { sourceResult, items: [] };
    }
  }
}

async function getSnapshot(db, sourceId) {
  try {
    const row = await db
      .prepare('SELECT items_json, fetched_at FROM feed_snapshots WHERE source_id = ?')
      .bind(sourceId)
      .first();
    if (!row) return null;
    return {
      items: JSON.parse(row.items_json),
      fetchedAt: row.fetched_at,
    };
  } catch {
    return null;
  }
}

async function saveSnapshot(db, sourceId, items, fetchedAt, error) {
  try {
    await db
      .prepare(`
        INSERT INTO feed_snapshots (source_id, items_json, fetched_at, last_attempt_at, last_error)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(source_id) DO UPDATE SET
          items_json = excluded.items_json,
          fetched_at = excluded.fetched_at,
          last_attempt_at = excluded.last_attempt_at,
          last_error = excluded.last_error
      `)
      .bind(sourceId, JSON.stringify(items), fetchedAt, fetchedAt, error)
      .run();
  } catch (err) {
    console.error('Error saving feed snapshot:', err);
  }
}

async function updateAttempt(db, sourceId, error) {
  try {
    const now = new Date().toISOString();
    await db
      .prepare(`
        INSERT INTO feed_snapshots (source_id, items_json, fetched_at, last_attempt_at, last_error)
        VALUES (?, '[]', NULL, ?, ?)
        ON CONFLICT(source_id) DO UPDATE SET
          last_attempt_at = excluded.last_attempt_at,
          last_error = excluded.last_error
      `)
      .bind(sourceId, now, error)
      .run();
  } catch (err) {
    console.error('Error updating feed attempt:', err);
  }
}

async function getFeeds(section, env) {
  const configs = feedsConfig.filter(c => c.section === section);
  if (configs.length === 0) {
    return new Response(JSON.stringify({ error: 'Unknown section' }), {
      status: 404,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=300',
      },
    });
  }

  const secContactEmail = env.SEC_CONTACT_EMAIL || null;
  const db = env.DB || null;

  const results = await Promise.all(
    configs.map(config => fetchFeed(config, secContactEmail, db))
  );

  const allItems = [];
  const sources = [];
  const seenUrls = new Set();

  for (const { sourceResult, items } of results) {
    sources.push(sourceResult);
    for (const item of items) {
      if (!seenUrls.has(item.url)) {
        seenUrls.add(item.url);
        allItems.push({
          source: sourceResult.name,
          sourceId: sourceResult.id,
          title: item.title,
          url: item.url,
          published: item.published,
        });
      }
    }
  }

  allItems.sort((a, b) => new Date(b.published) - new Date(a.published));
  const topItems = allItems.slice(0, 20);

  const activeSources = sources.filter(s => !s.disabled && s.fetchedAt);
  const oldestFetch = activeSources.length > 0
    ? activeSources.reduce((oldest, s) => {
        const time = new Date(s.fetchedAt).getTime();
        return time < oldest ? time : oldest;
      }, Infinity)
    : null;

  const isStale = activeSources.some(s => s.stale);

  const response = {
    section,
    notice: 'Not investment advice.',
    fetchedAt: oldestFetch ? new Date(oldestFetch).toISOString() : null,
    stale: isStale,
    items: topItems,
    sources,
  };

  return new Response(JSON.stringify(response), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': isStale ? 'public, max-age=300' : 'public, max-age=1800',
      'x-content-type-options': 'nosniff',
    },
  });
}

export { getFeeds };
