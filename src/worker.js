const homeHtml = /* HOME_HTML */ null;
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
const enigmasHtml = /* ENIGMAS_HTML */ null;
const enigmaArticles = /* ENIGMA_ARTICLES */ null;
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
const encoder = new TextEncoder();
const cookieName = 'infinity_staff_session';
const sessionHours = 12;
const decoded = new Map();

function image(name) {
  if (!decoded.has(name)) {
    const base64 = name === 'hero' ? heroBase64 : name === 'diana' ? dianaBase64 : name === 'diana-cards' ? dianaCardsBase64 : name === 'development' ? developmentBase64 : name === 'tech-lounge' ? techLoungeBase64 : name === 'tech-macro' ? techMacroBase64 : name === 'enigmas-politics' ? politicsBase64 : name === 'enigmas-law' ? lawBase64 : name === 'enigmas-academy' ? academyBase64 : name === 'research' ? researchBase64 : name === 'learning' ? learningBase64 : name === 'foundation' ? foundationBase64 : name === 'youth' ? youthBase64 : name === 'cover' ? coverBase64 : detailBase64;
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
      const field = tag => match[1].match(new RegExp('<' + tag + '(?: [^>]*)?>([\s\S]*?)<\/' + tag + '>'))?.[1] ?? '';
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

function login(error = '') {
  return loginTemplate.replace('<!-- LOGIN_ERROR -->', error ? '<p class="error" role="alert">'+error+'</p>' : '');
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
    const adminPath = path === '/admin' || path === '/admin/unlock' || path === '/admin/lock';
    if (adminPath && (!env.PIN_CODE || !env.SESSION_SECRET)) return html('<h1>Staff area is unavailable</h1>', 503);
    if (request.method === 'GET' && path === '/api/dispatch') return latestDispatch();
    if (path === '/robots.txt') return new Response('User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://infinity-enterprises.infinity-ent-8507.chatgpt.site/sitemap.xml\n', { headers: { 'content-type': 'text/plain; charset=utf-8' } });
    if (path === '/sitemap.xml') {
      const base = 'https://infinity-enterprises.infinity-ent-8507.chatgpt.site';
      const paths = ['/', '/about', '/about/standards', '/about/diana', '/development', '/development/atlas', '/learning', '/journal', '/foundation', '/foundation/youth', '/tech-lounge', '/enigmas', ...Object.keys(enigmaArticles).map(slug => '/enigmas/' + slug)];
      return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + paths.map(item => '<url><loc>' + base + item + '</loc></url>').join('') + '</urlset>', { headers: { 'content-type': 'application/xml; charset=utf-8' } });
    }
    if (path.startsWith('/media/') && path.endsWith('.png')) return new Response(null, { status: 308, headers: { location: path.slice(0, -4) + '.jpg' } });
    if (request.method === 'GET' && path === '/media/hero.jpg') return image('hero');
    if (request.method === 'GET' && path === '/media/detail.jpg') return image('detail');
    if (request.method === 'POST' && path === '/admin/unlock') {
      if (request.headers.get('origin') && request.headers.get('origin') !== url.origin) return html('Invalid request', 403);
      if (!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')) return html('Invalid request', 400);
      const body = await request.text();
      if (body.length > 100) return html('Invalid request', 400);
      const pin = new URLSearchParams(body).get('pin') ?? '';
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
    if (path === '/diana' || path === '/atlas') return new Response(null, { status: 308, headers: headers({ location: path === '/diana' ? '/about/diana' : '/development/atlas' }) });
    if (path.startsWith('/enigmas/')) return enigmaArticles[path.slice('/enigmas/'.length)] ? html(enigmaArticles[path.slice('/enigmas/'.length)]) : html('<h1>Page not found</h1>', 404);
    if (!['/', '/about', '/about/standards', '/about/diana', '/development', '/development/atlas', '/learning', '/journal', '/foundation', '/foundation/youth', '/tech-lounge', '/enigmas'].includes(path)) return html('<h1>Page not found</h1>', 404);
    return html(path === '/' ? homeHtml : path === '/about' ? aboutHtml : path === '/about/standards' ? standardsHtml : path === '/about/diana' ? dianaHtml : path === '/development' ? developmentHtml : path === '/learning' ? learningHtml : path === '/journal' ? journalHtml : path === '/foundation' ? foundationHtml : path === '/foundation/youth' ? youthHtml : path === '/tech-lounge' ? techLoungeHtml : path === '/enigmas' ? enigmasHtml : atlasHtml);
  },
};
