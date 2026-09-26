const homeHtml = /* HOME_HTML */ null;
const aboutHtml = /* ABOUT_HTML */ null;
const atlasHtml = /* ATLAS_HTML */ null;
const dianaHtml = /* DIANA_HTML */ null;
const developmentHtml = /* DEVELOPMENT_HTML */ null;
const learningHtml = /* LEARNING_HTML */ null;
const journalHtml = /* JOURNAL_HTML */ null;
const foundationHtml = /* FOUNDATION_HTML */ null;
const youthHtml = /* YOUTH_HTML */ null;
const techLoungeHtml = /* TECH_LOUNGE_HTML */ null;
const loginTemplate = /* LOGIN_HTML */ null;
const heroBase64 = /* HERO_IMAGE */ null;
const detailBase64 = /* DETAIL_IMAGE */ null;
const dianaBase64 = /* DIANA_IMAGE */ null;
const dianaCardsBase64 = /* DIANA_CARDS_IMAGE */ null;
const developmentBase64 = /* DEVELOPMENT_IMAGE */ null;
const techLoungeBase64 = /* TECH_LOUNGE_IMAGE */ null;
const techMacroBase64 = /* TECH_MACRO_IMAGE */ null;
const encoder = new TextEncoder();
const cookieName = 'atlas_session';
const sessionHours = 12;
const decoded = new Map();

function image(name) {
  if (!decoded.has(name)) {
    const base64 = name === 'hero' ? heroBase64 : name === 'diana' ? dianaBase64 : name === 'diana-cards' ? dianaCardsBase64 : name === 'development' ? developmentBase64 : name === 'tech-lounge' ? techLoungeBase64 : name === 'tech-macro' ? techMacroBase64 : detailBase64;
    decoded.set(name, Uint8Array.from(atob(base64), char => char.charCodeAt(0)));
  }
  return new Response(decoded.get(name), { headers: {
    'content-type': 'image/png', 'cache-control': 'private, max-age=86400',
    'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY',
  } });
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
  const match = request.headers.get('cookie')?.match(/(?:^|;\s*)atlas_session=([^;]+)/);
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
    if (!env.PIN_CODE || !env.SESSION_SECRET) return html('<h1>Site setup is incomplete</h1>', 503);
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === 'GET' && path === '/media/hero.png') return image('hero');
    if (request.method === 'GET' && path === '/media/detail.png') return image('detail');
    if (request.method === 'POST' && path === '/unlock') {
      if (request.headers.get('origin') && request.headers.get('origin') !== url.origin) return html('Invalid request', 403);
      if (!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')) return html('Invalid request', 400);
      const body = await request.text();
      if (body.length > 100) return html('Invalid request', 400);
      const pin = new URLSearchParams(body).get('pin') ?? '';
      if (pin !== env.PIN_CODE && pin !== env.GUEST_PIN_CODE) return html(login('That PIN is incorrect. Try again.'), 401);
      const expiry = String(Date.now() + sessionHours * 3600000);
      const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('');
      const mac = await signature(env.SESSION_SECRET, `${expiry}.${nonce}`);
      return new Response(null, { status: 303, headers: headers({ location: '/', 'set-cookie': `${cookieName}=${expiry}.${nonce}.${mac}; Path=/; HttpOnly; Secure; SameSite=Strict` }) });
    }
    if (request.method === 'POST' && path === '/lock') {
      return new Response(null, { status: 303, headers: headers({ location: '/', 'set-cookie': `${cookieName}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0` }) });
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') return html('Method not allowed', 405);
    const unlocked = await authenticated(request, env);
    if (!unlocked) return html(login());
    if (path === '/media/diana.png') return image('diana');
    if (path === '/media/diana-cards.png') return image('diana-cards');
    if (path === '/media/development.png') return image('development');
    if (path === '/media/tech-lounge.png') return image('tech-lounge');
    if (path === '/media/tech-macro.png') return image('tech-macro');
    if (!['/', '/about', '/atlas', '/diana', '/development', '/learning', '/journal', '/foundation', '/foundation/youth', '/tech-lounge'].includes(path)) return html('<h1>Page not found</h1>', 404);
    return html(path === '/' ? homeHtml : path === '/about' ? aboutHtml : path === '/diana' ? dianaHtml : path === '/development' ? developmentHtml : path === '/learning' ? learningHtml : path === '/journal' ? journalHtml : path === '/foundation' ? foundationHtml : path === '/foundation/youth' ? youthHtml : path === '/tech-lounge' ? techLoungeHtml : atlasHtml);
  },
};
