function isBot(userAgent) {
  if (!userAgent) return true;
  const ua = userAgent.toLowerCase();
  const botPatterns = [
    'bot', 'crawl', 'spider', 'slurp', 'preview',
    'facebookexternalhit', 'headless', 'curl', 'wget',
    'python', 'uptime', 'monitor', 'check'
  ];
  return botPatterns.some(pattern => ua.includes(pattern));
}

function normalizePath(path) {
  if (!path || typeof path !== 'string') return '/';
  const normalized = path.split('?')[0].split('#')[0];
  return normalized || '/';
}

function extractDomain(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname.toLowerCase();
    if (!domain ||
        domain === 'infinity-enterprises.infinity-ent-8507.chatgpt.site' ||
        domain === 'localhost' ||
        domain === '127.0.0.1') {
      return null;
    }
    return domain;
  } catch {
    return null;
  }
}

function getPacificDay(timestamp) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(new Date(timestamp));
}

async function recordPageView(request, env) {
  if (!env.DB) {
    return new Response(null, { status: 204 });
  }

  const userAgent = request.headers.get('user-agent') || '';
  if (isBot(userAgent)) {
    return new Response(null, { status: 204 });
  }

  let body;
  try {
    const text = await request.text();
    if (text.length > 500) {
      return new Response(null, { status: 400 });
    }
    body = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }

  const path = normalizePath(body.path);
  if (path.startsWith('/admin') || path.startsWith('/login')) {
    return new Response(null, { status: 204 });
  }

  const referrerDomain = extractDomain(body.ref);
  const day = getPacificDay(Date.now());
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  try {
    await env.DB.prepare(
      'INSERT INTO page_views (id, path, day, referrer_domain, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(id, path, day, referrerDomain, createdAt).run();
  } catch (error) {
    console.error('Page view storage error', error);
  }

  return new Response(null, { status: 204 });
}

export { isBot, normalizePath, extractDomain, getPacificDay, recordPageView };
