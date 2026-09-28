import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isBot, normalizePath, extractDomain, getPacificDay } from './src/page-views.js';

test('isBot detects bot user agents', () => {
  assert.equal(isBot('Mozilla/5.0 (compatible; Googlebot/2.1)'), true);
  assert.equal(isBot('facebookexternalhit/1.1'), true);
  assert.equal(isBot('curl/7.64.1'), true);
  assert.equal(isBot('python-requests/2.25.1'), true);
  assert.equal(isBot('HeadlessChrome/91.0'), true);
  assert.equal(isBot('UptimeRobot/2.0'), true);
  assert.equal(isBot('SiteMonitor'), true);
  assert.equal(isBot('Slurp'), true);
  assert.equal(isBot('spider'), true);
  assert.equal(isBot('crawl'), true);
});

test('isBot allows normal browsers', () => {
  assert.equal(isBot('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'), false);
  assert.equal(isBot('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15'), false);
  assert.equal(isBot('Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)'), false);
});

test('isBot returns true for empty user agent', () => {
  assert.equal(isBot(''), true);
  assert.equal(isBot(null), true);
  assert.equal(isBot(undefined), true);
});

test('normalizePath removes query strings', () => {
  assert.equal(normalizePath('/page?foo=bar'), '/page');
  assert.equal(normalizePath('/page?foo=bar&baz=qux'), '/page');
});

test('normalizePath removes hash fragments', () => {
  assert.equal(normalizePath('/page#section'), '/page');
  assert.equal(normalizePath('/page?foo=bar#section'), '/page');
});

test('normalizePath handles edge cases', () => {
  assert.equal(normalizePath(''), '/');
  assert.equal(normalizePath(null), '/');
  assert.equal(normalizePath(undefined), '/');
  assert.equal(normalizePath('/'), '/');
  assert.equal(normalizePath('/?foo=bar'), '/');
});

test('normalizePath preserves path structure', () => {
  assert.equal(normalizePath('/about/standards'), '/about/standards');
  assert.equal(normalizePath('/enigmas/article-name'), '/enigmas/article-name');
});

test('extractDomain extracts hostname from URL', () => {
  assert.equal(extractDomain('https://example.com/page'), 'example.com');
  assert.equal(extractDomain('https://www.example.com/page'), 'www.example.com');
  assert.equal(extractDomain('https://subdomain.example.com/page'), 'subdomain.example.com');
});

test('extractDomain returns null for same-site', () => {
  assert.equal(extractDomain('https://infinity-enterprises.infinity-ent-8507.chatgpt.site/page'), null);
  assert.equal(extractDomain('http://localhost/page'), null);
  assert.equal(extractDomain('http://127.0.0.1/page'), null);
});

test('extractDomain returns null for empty referrer', () => {
  assert.equal(extractDomain(''), null);
  assert.equal(extractDomain(null), null);
  assert.equal(extractDomain(undefined), null);
});

test('extractDomain returns null for invalid URLs', () => {
  assert.equal(extractDomain('not a url'), null);
  assert.equal(extractDomain('javascript:alert(1)'), null);
});

test('extractDomain lowercases domain', () => {
  assert.equal(extractDomain('https://Example.COM/page'), 'example.com');
  assert.equal(extractDomain('https://WWW.EXAMPLE.COM/page'), 'www.example.com');
});

test('getPacificDay returns YYYY-MM-DD format', () => {
  const day = getPacificDay(Date.UTC(2026, 8, 28, 12, 0, 0));
  assert.match(day, /^\d{4}-\d{2}-\d{2}$/);
});

test('getPacificDay handles Pacific timezone correctly', () => {
  const utcMidnight = Date.UTC(2026, 8, 28, 8, 0, 0);
  const day = getPacificDay(utcMidnight);
  assert.equal(day, '2026-09-28');
});

test('getPacificDay handles date boundary', () => {
  const beforeMidnight = Date.UTC(2026, 8, 28, 7, 59, 0);
  const afterMidnight = Date.UTC(2026, 8, 28, 8, 1, 0);
  assert.equal(getPacificDay(beforeMidnight), '2026-09-27');
  assert.equal(getPacificDay(afterMidnight), '2026-09-28');
});
