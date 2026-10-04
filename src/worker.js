const homeHtml = /* HOME_HTML */ null;
const coverStoryHtml = /* COVER_STORY_HTML */ null;
const aboutHtml = /* ABOUT_HTML */ null;
const standardsHtml = /* STANDARDS_HTML */ null;
const atlasHtml = /* ATLAS_HTML */ null;
const dianaHtml = /* DIANA_HTML */ null;
const developmentHtml = /* DEVELOPMENT_HTML */ null;
const learningHtml = /* LEARNING_HTML */ null;
const journalHtml = /* JOURNAL_HTML */ null;
const foundationHtml = /* FOUNDATION_HTML */ null;
const youthHtml = /* YOUTH_HTML */ null;
const techLoungeHtml = /* TECH_LOUNGE_HTML */ null;
const etherHtml = /* ETHER_HTML */ null;
const motorHtml = /* MOTOR_HTML */ null;
const formHtml = /* FORM_HTML */ null;
const enigmasHtml = /* ENIGMAS_HTML */ null;
const enigmaArticles = /* ENIGMA_ARTICLES */ null;
const osintHtml = /* OSINT_HTML */ null;
const notFoundHtml = /* NOT_FOUND_HTML */ null;
const publicationPages = /* PUBLICATION_PAGES */ null;
const feedXml = /* FEED_XML */ null;
const loginTemplate = /* LOGIN_HTML */ null;
const adminHtml = /* ADMIN_HTML */ null;
const heroBase64 = /* HERO_IMAGE */ null;
const detailBase64 = /* DETAIL_IMAGE */ null;
const dianaBase64 = /* DIANA_IMAGE */ null;
const dianaCardsBase64 = /* DIANA_CARDS_IMAGE */ null;
const developmentBase64 = /* DEVELOPMENT_IMAGE */ null;
const techLoungeBase64 = /* TECH_LOUNGE_IMAGE */ null;
const techMacroBase64 = /* TECH_MACRO_IMAGE */ null;
const politicsBase64 = /* ENIGMAS_POLITICS_IMAGE */ null;
const lawBase64 = /* ENIGMAS_LAW_IMAGE */ null;
const academyBase64 = /* ENIGMAS_ACADEMY_IMAGE */ null;
const researchBase64 = /* RESEARCH_IMAGE */ null;
const learningBase64 = /* LEARNING_IMAGE */ null;
const foundationBase64 = /* FOUNDATION_IMAGE */ null;
const youthBase64 = /* YOUTH_IMAGE */ null;
const coverBase64 = /* COVER_IMAGE */ null;
const foodBase64 = /* FOOD_IMAGE */ null;
const etherBase64 = /* ETHER_IMAGES */ null;
const motorBase64 = /* MOTOR_IMAGES */ null;
const formBase64 = /* FORM_IMAGES */ null;
const pvScript = /* PV_SCRIPT */ null;
const encoder = new TextEncoder();
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#08101a"/><circle cx="32" cy="32" r="21" fill="none" stroke="#e8a46d" stroke-width="3"/><path d="M32 10v44M10 32h44M21 43l22-22" fill="none" stroke="#e8a46d" stroke-width="2"/></svg>`;
const faviconLink = '<link rel="icon" type="image/svg+xml" href="/favicon.svg">';
const cookieName = 'infinity_staff_session';
const sessionHours = 12;
const decoded = new Map();

function image(name) {
  if (!decoded.has(name)) {
    const base64 = /^form-[1-7]$/.test(name) ? formBase64[Number(name.slice(-1)) - 1] : /^motor-[1-4]$/.test(name) ? motorBase64[Number(name.slice(-1)) - 1] : /^ether-[1-4]$/.test(name) ? etherBase64[Number(name.slice(-1)) - 1] : name === 'hero' ? heroBase64 : name === 'diana' ? dianaBase64 : name === 'diana-cards' ? dianaCardsBase64 : name === 'development' ? developmentBase64 : name === 'tech-lounge' ? techLoungeBase64 : name === 'tech-macro' ? techMacroBase64 : name === 'enigmas-politics' ? politicsBase64 : name === 'enigmas-law' ? lawBase64 : name === 'enigmas-academy' ? academyBase64 : name === 'research' ? researchBase64 : name === 'learning' ? learningBase64 : name === 'foundation' ? foundationBase64 : name === 'youth' ? youthBase64 : name === 'cover' ? coverBase64 : name === 'food' ? foodBase64 : detailBase64;
    decoded.set(name, Uint8Array.from(atob(base64), char => char.charCodeAt(0)));
  }
  return new Response(decoded.get(name), { headers: {
    'content-type': 'image/jpeg', 'cache-control': 'public, max-age=86400',
    'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY',
  } });
}

function textFromXml(value) {
  return value.replace(/^<!\[CDATA\[|\]\]>$/g, '').replace(/<[^>]*>/g, '').replace(/&(?:amp|lt|gt|quot|apos|#39);/g, entity => ({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'",'&#39;':"'"}[entity] ?? entity)).trim().slice(0, 180);
}
async function latestDispatch() {
  try {
    const response = await fetch('https://github.blog/changelog/feed/', { signal: AbortSignal.timeout(4500), headers: { accept: 'application/rss+xml' } });
    if (!response.ok) throw new Error('Source unavailable');
    const xml = (await response.text()).slice(0, 200000);
    const entries = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 3).map((match) => {
      const field = tag => match[1].match(new RegExp(`<${tag}(?: [^>]*)?>([\\s\\S]*?)<\\/${tag}>`))?.[1] ?? '';
      const url = textFromXml(field('link'));
      if (!url.startsWith('https://github.blog/changelog/')) return null;
      const rawDate = field('pubDate'); const parsed = Date.parse(rawDate);
      return { title: textFromXml(field('title')), url, date: Number.isFinite(parsed) ? new Date(parsed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) : '' };
    }).filter(item => item && item.title).slice(0, 2);
    return new Response(JSON.stringify({ source: 'GitHub Changelog', items: entries }), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=1800', 'x-content-type-options': 'nosniff' } });
  } catch {
    return new Response(JSON.stringify({ source: 'GitHub Changelog', items: [] }), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=300', 'x-content-type-options': 'nosniff' } });
  }
}

function headers(extra = {}) {
  return {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'private, no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'x-frame-options': 'DENY',
    ...extra,
  };
}

function html(markup, status = 200, extra = {}) {
  return new Response(markup, { status, headers: headers(extra) });
}

function notFound() {
  return html(notFoundHtml, 404, { 'x-robots-tag': 'noindex' });
}

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function noticePage(route, message, success = true, status = 200) {
  const page = publicationPages[route];
  const note = `<div class="hub-wrap"><div class="${success ? 'hub-success' : 'hub-error'}" role="status">${escapeHtml(message)}</div><p><a class="hub-link" href="${route}">Return to ${route === '/contact' ? 'contact' : 'the monthly letter'} ↗</a></p></div>`;
  return html(page.replace('</main>', note + '</main>'), status);
}
async function formValues(request) {
  if (request.headers.get('origin') && request.headers.get('origin') !== new URL(request.url).origin) return null;
  if (!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')) return null;
  const body = await request.text();
  return body.length <= 6000 ? new URLSearchParams(body) : null;
}
function validEmail(value) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function adminTable(title, rows) {
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(title)} · Infinity Staff</title><style>body{font:16px/1.6 system-ui,sans-serif;background:#102435;color:#f5f0e8;margin:0;padding:5vw}a{color:#e8ad83}article{padding:24px;border:1px solid #ffffff44;margin:18px 0;max-width:850px;overflow-wrap:anywhere}small{color:#aec1ce}h1{font-size:clamp(2rem,5vw,4rem)}nav{display:flex;gap:22px;flex-wrap:wrap}</style><nav><a href="/admin">Staff home</a><a href="/admin/inbox">Inbox</a><a href="/admin/subscribers">Issue list</a></nav><main><h1>${escapeHtml(title)}</h1>${rows || '<p>No records yet.</p>'}</main></html>`;
}

function login(error = '') {
  return loginTemplate.replace('</head>', faviconLink + '</head>').replace('<!-- LOGIN_ERROR -->', error ? '<p class="error" role="alert">'+error+'</p>' : '');
}

function equalBytes(a, b) {
  if (a.byteLength !== b.byteLength) return false;
  let mismatch = 0;
  for (let i = 0; i < a.byteLength; i++) mismatch |= a[i] ^ b[i];
  return mismatch === 0;
}

async function signature(secret, payload) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(payload))), byte => byte.toString(16).padStart(2, '0')).join('');
}

function sessionCookie(request) {
  const match = request.headers.get('cookie')?.match(/(?:^|;\s*)infinity_staff_session=([^;]+)/);
  return match?.[1] ?? '';
}

async function authenticated(request, env) {
  const token = sessionCookie(request);
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [expiry, nonce, mac] = parts;
  if (!/^\d{13}$/.test(expiry) || !/^[0-9a-f]{32}$/.test(nonce) || !/^[0-9a-f]{64}$/.test(mac)) return false;
  if (Number(expiry) <= Date.now()) return false;
  const expected = await signature(env.SESSION_SECRET, `${expiry}.${nonce}`);
  return equalBytes(encoder.encode(expected), encoder.encode(mac));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const adminPath = path === '/admin' || path === '/admin/unlock' || path === '/admin/lock' || path === '/admin/inbox' || path === '/admin/subscribers';
    if (adminPath && (!env.PIN_CODE || !env.SESSION_SECRET)) return html('<h1>Staff area is unavailable</h1>', 503);
    if (request.method === 'GET' && path === '/api/dispatch') return latestDispatch();
    if (request.method === 'GET' && path === '/api/feeds') {
      const section = url.searchParams.get('section') || '';
      return getFeeds(section, env);
    }
    if (request.method === 'POST' && path === '/api/pv') return recordPageView(request, env);
    if (request.method === 'GET' && path === '/pv.js') return new Response(pvScript, { headers: {'content-type':'application/javascript; charset=utf-8','cache-control':'public, max-age=86400','x-content-type-options':'nosniff'} });
    if (request.method === 'GET' && path === '/feed.xml') return new Response(feedXml, { headers: {'content-type':'application/rss+xml; charset=utf-8','cache-control':'public, max-age=3600'} });
    if (request.method === 'POST' && path === '/api/subscribe') {
      const fields = await formValues(request);
      if (!fields) return noticePage('/subscribe', 'The request could not be read. Please try again.', false, 400);
      if (fields.get('website')) return noticePage('/subscribe', 'Your request was received.');
      const email = (fields.get('email') || '').trim().toLowerCase();
      if (!validEmail(email) || fields.get('consent') !== 'yes') return noticePage('/subscribe', 'Enter a valid email address and confirm that you want issue updates.', false, 400);
      if (!env.DB) return noticePage('/subscribe', 'The issue list is temporarily unavailable. Please try again later.', false, 503);
      try {
        const now = new Date().toISOString();
        const token = crypto.randomUUID().replaceAll('-', '') + crypto.randomUUID().replaceAll('-', '');
        await env.DB.prepare("INSERT INTO subscribers (email,token,status,consent_at,updated_at) VALUES (?,?, 'active',?,?) ON CONFLICT(email) DO UPDATE SET token=excluded.token,status='active',consent_at=excluded.consent_at,updated_at=excluded.updated_at").bind(email,token,now,now).run();
        return noticePage('/subscribe', 'You are on the issue list. Email delivery is being prepared; no letter has been sent yet.');
      } catch (error) { console.error('Issue list storage error',error); return noticePage('/subscribe', 'The list could not be saved right now. Please try again later.', false, 503); }
    }
    if (request.method === 'POST' && path === '/api/contact') {
      const fields = await formValues(request);
      if (!fields) return noticePage('/contact', 'The request could not be read. Please try again.', false, 400);
      if (fields.get('website')) return noticePage('/contact', 'Your note was received.');
      const name = (fields.get('name') || '').trim();
      const email = (fields.get('email') || '').trim().toLowerCase();
      const topic = fields.get('topic') || 'General note';
      const message = (fields.get('message') || '').trim();
      if (!name || name.length > 100 || !validEmail(email) || !['Editorial correction','Project inquiry','Partnership','General note'].includes(topic) || message.length < 10 || message.length > 3000) return noticePage('/contact', 'Check your name, email, and message, then try again.', false, 400);
      if (!env.DB) return noticePage('/contact', 'The contact desk is temporarily unavailable. Please try again later.', false, 503);
      try {
        const recent = await env.DB.prepare('SELECT COUNT(*) AS count FROM messages WHERE email=? AND created_at>?').bind(email,new Date(Date.now()-3600000).toISOString()).first();
        if ((recent?.count || 0) >= 3) return noticePage('/contact', 'This address has sent several notes recently. Please return later.', false, 429);
        await env.DB.prepare("INSERT INTO messages (id,name,email,topic,body,created_at,status) VALUES (?,?,?,?,?,?, 'new')").bind(crypto.randomUUID(),name,email,topic,message,new Date().toISOString()).run();
        return noticePage('/contact', 'Your note was saved for review. Thank you for writing.');
      } catch (error) { console.error('Contact storage error',error); return noticePage('/contact', 'Your note could not be saved right now. Please try again later.', false, 503); }
    }
    if (request.method === 'GET' && path === '/api/unsubscribe') {
      const token = url.searchParams.get('token') || '';
      if (!/^[a-f0-9]{64}$/.test(token) || !env.DB) return html('<h1>Link unavailable</h1>', 400);
      try { await env.DB.prepare("UPDATE subscribers SET status='unsubscribed',updated_at=? WHERE token=?").bind(new Date().toISOString(),token).run(); return noticePage('/subscribe','This address has been removed from the issue list.'); }
      catch (error) { console.error('Unsubscribe storage error',error); return html('<h1>Could not process this link</h1>',503); }
    }
    if (path === '/robots.txt') return new Response('User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://infinity-enterprises.infinity-ent-8507.chatgpt.site/sitemap.xml\n', { headers: { 'content-type': 'text/plain; charset=utf-8' } });
    if (path === '/sitemap.xml') {
      const base = 'https://infinity-enterprises.infinity-ent-8507.chatgpt.site';
      const paths = ['/', '/about', '/about/standards', '/about/diana', '/development', '/development/atlas', '/learning', '/journal', '/foundation', '/foundation/youth', '/tech-lounge', '/ether', '/motor', '/form', '/enigmas', '/cover-story', ...Object.keys(publicationPages), ...Object.keys(enigmaArticles).map(slug => '/enigmas/' + slug)];
      return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + paths.map(item => '<url><loc>' + base + item + '</loc></url>').join('') + '</urlset>', { headers: { 'content-type': 'application/xml; charset=utf-8' } });
    }
    if (request.method === 'GET' && (path === '/favicon.svg' || path === '/favicon.ico')) return new Response(faviconSvg, { headers: { 'content-type': 'image/svg+xml; charset=utf-8', 'cache-control': 'public, max-age=86400', 'x-content-type-options': 'nosniff' } });
    if (path.startsWith('/media/') && path.endsWith('.png')) return new Response(null, { status: 308, headers: { location: path.slice(0, -4) + '.jpg' } });
    if (request.method === 'GET' && path === '/media/hero.jpg') return image('hero');
    if (request.method === 'GET' && path === '/media/detail.jpg') return image('detail');
    if (request.method === 'POST' && path === '/admin/unlock') {
      if (request.headers.get('origin') && request.headers.get('origin') !== url.origin) return html('Invalid request', 403);
      if (!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')) return html('Invalid request', 400);
      const body = await request.text();
      if (body.length > 100) return html('Invalid request', 400);
      const pin = new URLSearchParams(body).get('pin') ?? '';
      if (env.DB) {
        const ip = request.headers.get('cf-connecting-ip');
        if (ip) {
          const key = await signature(env.SESSION_SECRET, 'staff-login:' + ip);
          const attempt = await env.DB.prepare('SELECT attempts,blocked_until FROM login_attempts WHERE key=?').bind(key).first();
          if (attempt?.blocked_until > Date.now()) return html(login('Too many attempts. Try again later.'), 429);
          if (pin !== env.PIN_CODE) {
            const attempts = (attempt?.attempts || 0) + 1;
            await env.DB.prepare('INSERT INTO login_attempts (key,attempts,blocked_until,updated_at) VALUES (?,?,?,?) ON CONFLICT(key) DO UPDATE SET attempts=excluded.attempts,blocked_until=excluded.blocked_until,updated_at=excluded.updated_at').bind(key,attempts,attempts >= 5 ? Date.now()+900000 : 0,Date.now()).run();
            return html(login('That PIN is incorrect. Try again.'), 401);
          }
          await env.DB.prepare('DELETE FROM login_attempts WHERE key=?').bind(key).run();
        }
      }
      if (pin !== env.PIN_CODE) return html(login('That PIN is incorrect. Try again.'), 401);
      const expiry = String(Date.now() + sessionHours * 3600000);
      const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('');
      const mac = await signature(env.SESSION_SECRET, `${expiry}.${nonce}`);
      return new Response(null, { status: 303, headers: headers({ location: '/admin', 'set-cookie': `${cookieName}=${expiry}.${nonce}.${mac}; Path=/admin; HttpOnly; Secure; SameSite=Strict` }) });
    }
    if (request.method === 'POST' && path === '/admin/lock') {
      return new Response(null, { status: 303, headers: headers({ location: '/admin', 'set-cookie': `${cookieName}=; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=0` }) });
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') return html('Method not allowed', 405);
    if (path === '/admin') return await authenticated(request, env) ? html(adminHtml) : html(login());
    if (path === '/admin/inbox' || path === '/admin/subscribers') {
      if (!await authenticated(request,env)) return html(login(),401);
      if (!env.DB) return html(adminTable('Database unavailable',''),503);
      try {
        if (path === '/admin/inbox') {
          const {results} = await env.DB.prepare('SELECT name,email,topic,body,created_at FROM messages ORDER BY created_at DESC LIMIT 100').all();
          const rows = results.map(row => `<article><small>${escapeHtml(row.created_at)} · ${escapeHtml(row.topic)}</small><h2>${escapeHtml(row.name)}</h2><p>${escapeHtml(row.email)}</p><p>${escapeHtml(row.body).replace(/\n/g,'<br>')}</p></article>`).join('');
          return html(adminTable('Reader inbox',rows));
        }
        const {results} = await env.DB.prepare("SELECT email,consent_at,token FROM subscribers WHERE status='active' ORDER BY consent_at DESC LIMIT 500").all();
        const rows = results.map(row => `<article><strong>${escapeHtml(row.email)}</strong><p><small>Opted in ${escapeHtml(row.consent_at)}</small></p><p><a href="/api/unsubscribe?token=${row.token}">Remove address</a></p></article>`).join('');
        return html(adminTable(`Issue list · ${results.length} addresses`,rows));
      } catch (error) { console.error('Staff database error',error); return html(adminTable('Database unavailable',''),503); }
    }
    if (path === '/media/diana.jpg') return image('diana');
    if (path === '/media/diana-cards.jpg') return image('diana-cards');
    if (path === '/media/development.jpg') return image('development');
    if (path === '/media/tech-lounge.jpg') return image('tech-lounge');
    if (path === '/media/tech-macro.jpg') return image('tech-macro');
    if (path === '/media/enigmas-politics.jpg') return image('enigmas-politics');
    if (path === '/media/enigmas-law.jpg') return image('enigmas-law');
    if (path === '/media/enigmas-academy.jpg') return image('enigmas-academy');
    if (path === '/media/research.jpg') return image('research');
    if (path === '/media/learning.jpg') return image('learning');
    if (path === '/media/foundation.jpg') return image('foundation');
    if (path === '/media/youth.jpg') return image('youth');
    if (path === '/media/cover.jpg') return image('cover');
    if (path === '/media/food.jpg') return image('food');
    if (/^\/media\/ether-[1-4]\.jpg$/.test(path)) return image(path.slice(7, -4));
    if (/^\/media\/motor-[1-4]\.jpg$/.test(path)) return image(path.slice(7, -4));
    if (/^\/media\/form-[1-7]\.jpg$/.test(path)) return image(path.slice(7, -4));
    if (path === '/diana' || path === '/atlas') return new Response(null, { status: 308, headers: headers({ location: path === '/diana' ? '/about/diana' : '/development/atlas' }) });
    if (path.startsWith('/enigmas/')) {
      try {
        const mapJson = env.REDIRECT_MAP;
        if (mapJson) {
          const redirectMap = JSON.parse(mapJson);
          const normalizedPath = decodeURIComponent(path.toLowerCase()).replace(/\/$/, '');
          if (redirectMap[normalizedPath]) {
            return new Response(null, { status: 308, headers: headers({ location: redirectMap[normalizedPath] }) });
          }
        }
      } catch (e) {}
      return enigmaArticles[path.slice('/enigmas/'.length)] ? html(enigmaArticles[path.slice('/enigmas/'.length)]) : notFound();
    }
    if (publicationPages[path]) return html(publicationPages[path]);
    if (!['/', '/about', '/about/standards', '/about/diana', '/development', '/development/atlas', '/learning', '/journal', '/foundation', '/foundation/youth', '/tech-lounge', '/ether', '/motor', '/form', '/enigmas', '/osint', '/cover-story'].includes(path)) return notFound();
    return html(path === '/' ? homeHtml : path === '/cover-story' ? coverStoryHtml : path === '/about' ? aboutHtml : path === '/about/standards' ? standardsHtml : path === '/about/diana' ? dianaHtml : path === '/development' ? developmentHtml : path === '/learning' ? learningHtml : path === '/journal' ? journalHtml : path === '/foundation' ? foundationHtml : path === '/foundation/youth' ? youthHtml : path === '/tech-lounge' ? techLoungeHtml : path === '/ether' ? etherHtml : path === '/motor' ? motorHtml : path === '/form' ? formHtml : path === '/enigmas' ? enigmasHtml : path === '/osint' ? osintHtml : atlasHtml);
  },
};
