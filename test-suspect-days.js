import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeSuspectDays, normalizeInput, formatReport } from './scripts/suspect-days.mjs';

test('14-day fake run: clear first 7 normal, all run days suspect', () => {
  const dailyViews = [];
  
  // 30 normal days at fixed ~100 views (deterministic pattern)
  const normalViews = [98, 102, 99, 101, 100, 97, 103, 99, 101, 98, 100, 102, 99, 97, 101, 
                       100, 98, 103, 99, 102, 100, 97, 101, 99, 98, 102, 100, 103, 99, 101];
  for (let i = 0; i < 30; i++) {
    dailyViews.push({
      day: `2026-09-${String(i + 1).padStart(2, '0')}`,
      views: normalViews[i]
    });
  }
  
  // 14-day fake traffic run at fixed ~2000 views
  const fakeViews = [1980, 2020, 1990, 2010, 2000, 1970, 2030, 1995, 2015, 1985, 2005, 1975, 2025, 1995];
  for (let i = 0; i < 14; i++) {
    dailyViews.push({
      day: `2026-10-${String(i + 1).padStart(2, '0')}`,
      views: fakeViews[i]
    });
  }
  
  // Clear first 7 normal days
  const clearedDays = [
    '2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04',
    '2026-09-05', '2026-09-06', '2026-09-07'
  ];
  
  const results = analyzeSuspectDays(dailyViews, clearedDays);
  
  // All 14 fake days should be suspect
  const fakeDaysSuspect = results.filter(
    r => r.day >= '2026-10-01' && r.day <= '2026-10-14' && r.status === 'suspect'
  );
  assert.equal(fakeDaysSuspect.length, 14, 'All 14 fake traffic days should be suspect');
  
  // No normal days should be suspect
  const normalDaysSuspect = results.filter(
    r => r.day < '2026-10-01' && r.status === 'suspect'
  );
  assert.equal(normalDaysSuspect.length, 0, 'No normal days should be suspect');
  
  // Prove plain unfiltered median would miss at least one run day
  // Use the REAL previous 14 calendar entries for 2026-10-14 (which includes 13 fake days)
  const lastFakeDay = dailyViews.find(d => d.day === '2026-10-14');
  const sortedDays = [...dailyViews].sort((a, b) => a.day.localeCompare(b.day));
  const lastFakeIndex = sortedDays.findIndex(d => d.day === '2026-10-14');
  const previous14 = sortedDays
    .slice(Math.max(0, lastFakeIndex - 14), lastFakeIndex)
    .map(d => d.views)
    .sort((a, b) => a - b);
  
  const plainMedian = previous14.length % 2 === 0
    ? (previous14[Math.floor(previous14.length / 2) - 1] + previous14[Math.floor(previous14.length / 2)]) / 2
    : previous14[Math.floor(previous14.length / 2)];
  
  assert.ok(
    lastFakeDay.views <= 3 * plainMedian,
    'Plain unfiltered median should fail to flag at least the last fake day'
  );
});

test('Real growth: clear first 7 normal, with/without growth cleared', () => {
  const dailyViews = [];
  
  // 30 normal days at fixed ~100 views
  const normalViews = [98, 102, 99, 101, 100, 97, 103, 99, 101, 98, 100, 102, 99, 97, 101,
                       100, 98, 103, 99, 102, 100, 97, 101, 99, 98, 102, 100, 103, 99, 101];
  for (let i = 0; i < 30; i++) {
    dailyViews.push({
      day: `2026-09-${String(i + 1).padStart(2, '0')}`,
      views: normalViews[i]
    });
  }
  
  // Real growth: 20 days at fixed ~400 views
  const growthViews = [395, 405, 398, 402, 400, 393, 407, 399, 401, 397, 
                       400, 403, 398, 396, 404, 400, 395, 406, 399, 402];
  for (let i = 0; i < 20; i++) {
    dailyViews.push({
      day: `2026-10-${String(i + 1).padStart(2, '0')}`,
      views: growthViews[i]
    });
  }
  
  // Clear first 7 normal days only
  const normalCleared = [
    '2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04',
    '2026-09-05', '2026-09-06', '2026-09-07'
  ];
  
  // Without growth days cleared, ALL 20 growth days should be suspect
  const resultsWithoutGrowth = analyzeSuspectDays(dailyViews, normalCleared);
  const growthDaysSuspect = resultsWithoutGrowth.filter(
    r => r.day >= '2026-10-01' && r.day <= '2026-10-20' && r.status === 'suspect'
  );
  assert.equal(growthDaysSuspect.length, 20, 'All 20 growth days should be suspect without growth cleared');
  
  // With first 7 normal + first 7 growth days cleared, ALL 20 growth days non-suspect
  const allCleared = [
    ...normalCleared,
    '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04',
    '2026-10-05', '2026-10-06', '2026-10-07'
  ];
  const resultsWithGrowth = analyzeSuspectDays(dailyViews, allCleared);
  const allGrowthDays = resultsWithGrowth.filter(
    r => r.day >= '2026-10-01' && r.day <= '2026-10-20'
  );
  
  // Days 1-7 should be cleared
  const days1to7 = allGrowthDays.filter(r => r.day <= '2026-10-07');
  assert.equal(days1to7.length, 7, 'Should have 7 days 1-7');
  assert.ok(days1to7.every(r => r.status === 'cleared'), 'Days 1-7 should all be cleared');
  
  // Days 8-20 should be ok
  const days8to20 = allGrowthDays.filter(r => r.day > '2026-10-07');
  assert.equal(days8to20.length, 13, 'Should have 13 days 8-20');
  assert.ok(days8to20.every(r => r.status === 'ok'), 'Days 8-20 should all be ok');
  
  // No suspect days at all
  const anySuspect = allGrowthDays.filter(r => r.status === 'suspect');
  assert.equal(anySuspect.length, 0, 'No growth days should be suspect when first 7 normal + 7 growth are cleared');
});

test('Cold start: fewer than 7 baseline days means not_checked', () => {
  const dailyViews = [
    { day: '2026-09-01', views: 100 },
    { day: '2026-09-02', views: 100 },
    { day: '2026-09-03', views: 100 },
    { day: '2026-09-04', views: 2000 }, // Spike but only 3 baseline days
    { day: '2026-09-05', views: 2000 },
    { day: '2026-09-06', views: 2000 }
  ];
  
  const results = analyzeSuspectDays(dailyViews);
  
  // All days should be not_checked (not enough baseline)
  const notChecked = results.filter(r => r.status === 'not_checked');
  assert.equal(notChecked.length, 6, 'All 6 days should be not_checked');
  
  // No days should be suspect
  const suspect = results.filter(r => r.status === 'suspect');
  assert.equal(suspect.length, 0, 'No days should be suspect with insufficient baseline');
});

test('No baseline until cleared: requires first 7 days cleared', () => {
  const dailyViews = [];
  
  // 20 normal days at 100 views
  for (let i = 0; i < 20; i++) {
    dailyViews.push({
      day: `2026-09-${String(i + 1).padStart(2, '0')}`,
      views: 100
    });
  }
  
  // One spike day at 2000
  dailyViews.push({ day: '2026-09-21', views: 2000 });
  
  // Without anything cleared, every day is not_checked, nothing is suspect
  const resultsUncleared = analyzeSuspectDays(dailyViews);
  const notChecked = resultsUncleared.filter(r => r.status === 'not_checked');
  const suspect = resultsUncleared.filter(r => r.status === 'suspect');
  
  assert.equal(notChecked.length, 21, 'All 21 days should be not_checked');
  assert.equal(suspect.length, 0, 'No days should be suspect without baseline');
  
  // Verify the "no baseline yet" indicator (we'll check this in CLI output separately)
  const hasBaseline = resultsUncleared.some(r => r.status === 'ok' || r.status === 'suspect');
  assert.ok(!hasBaseline, 'Should have no baseline');
  
  // Clear first 7 days
  const clearedDays = [
    '2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04',
    '2026-09-05', '2026-09-06', '2026-09-07'
  ];
  const resultsCleared = analyzeSuspectDays(dailyViews, clearedDays);
  
  // Days 8-20 should be ok
  const days8to20 = resultsCleared.filter(
    r => r.day >= '2026-09-08' && r.day <= '2026-09-20' && r.status === 'ok'
  );
  assert.equal(days8to20.length, 13, 'Days 8-20 should be ok after clearing first 7');
  
  // Day 21 (2000 views) should be suspect
  const day21 = resultsCleared.find(r => r.day === '2026-09-21');
  assert.equal(day21.status, 'suspect', 'Day 21 with 2000 views should be suspect');
});

test('Wrangler format: parses array with results wrapper', () => {
  // Simulate wrangler d1 execute --json output
  const wranglerOutput = [{
    results: [
      { day: '2026-09-01', views: 100 },
      { day: '2026-09-02', views: 100 },
      { day: '2026-09-03', views: 100 },
      { day: '2026-09-04', views: 100 },
      { day: '2026-09-05', views: 100 },
      { day: '2026-09-06', views: 100 },
      { day: '2026-09-07', views: 100 },
      { day: '2026-09-08', views: 2000 }
    ],
    success: true,
    meta: { duration: 0.123 }
  }];
  
  // Use the real exported normalizeInput function
  const dailyViews = normalizeInput(wranglerOutput);
  
  assert.equal(dailyViews.length, 8, 'Should parse 8 days');
  assert.equal(dailyViews[0].day, '2026-09-01', 'Should have correct first day');
  assert.equal(dailyViews[7].views, 2000, 'Should coerce views to Number');
  
  // Clear first 7 days to establish baseline
  const clearedDays = [
    '2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04',
    '2026-09-05', '2026-09-06', '2026-09-07'
  ];
  
  const results = analyzeSuspectDays(dailyViews, clearedDays);
  
  const suspect = results.filter(r => r.status === 'suspect');
  assert.equal(suspect.length, 1, 'Should have one suspect day');
  assert.equal(suspect[0].day, '2026-09-08', 'Should flag the spike day');
  assert.equal(suspect[0].views, 2000, 'Should have correct views count');
});

test('formatReport includes no-baseline message for uncleared, not for cleared', () => {
  const dailyViews = [];
  
  // 20 normal days at 100 views
  for (let i = 0; i < 20; i++) {
    dailyViews.push({
      day: `2026-09-${String(i + 1).padStart(2, '0')}`,
      views: 100
    });
  }
  
  dailyViews.push({ day: '2026-09-21', views: 2000 });
  
  // Without cleared days: should include no-baseline message
  const resultsUncleared = analyzeSuspectDays(dailyViews);
  const outputUncleared = formatReport(resultsUncleared);
  
  assert.ok(
    outputUncleared.includes('no baseline yet: clear the first 7 days'),
    'Should include no-baseline message when nothing is cleared'
  );
  
  // With first 7 cleared: should NOT include no-baseline message
  const clearedDays = [
    '2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04',
    '2026-09-05', '2026-09-06', '2026-09-07'
  ];
  const resultsCleared = analyzeSuspectDays(dailyViews, clearedDays);
  const outputCleared = formatReport(resultsCleared);
  
  assert.ok(
    !outputCleared.includes('no baseline yet'),
    'Should NOT include no-baseline message once first 7 are cleared'
  );
  assert.ok(
    outputCleared.includes('Suspect days:'),
    'Should include suspect days section'
  );
});

test('Empty input prints no-data message', () => {
  // Empty array
  const emptyArray = [];
  const normalized1 = normalizeInput(emptyArray);
  assert.equal(normalized1.length, 0, 'Empty array normalizes to empty');
  
  // Wrangler format with empty results
  const emptyWrangler = [{ results: [], success: true, meta: {} }];
  const normalized2 = normalizeInput(emptyWrangler);
  assert.equal(normalized2.length, 0, 'Empty wrangler results normalize to empty');
  
  // Verify the report message
  const results = analyzeSuspectDays(normalized1);
  const output = formatReport(results);
  assert.equal(output.trim(), 'no data: 0 days in input', 'Empty input should produce exact no-data message');
});

test('Null input does not throw and prints no-data message', () => {
  // null should be handled like empty input
  const normalizedNull = normalizeInput(null);
  assert.equal(normalizedNull.length, 0, 'Null normalizes to empty');
  
  // undefined should be handled like empty input
  const normalizedUndefined = normalizeInput(undefined);
  assert.equal(normalizedUndefined.length, 0, 'Undefined normalizes to empty');
  
  // Verify the report message for null
  const resultsNull = analyzeSuspectDays(normalizedNull);
  const outputNull = formatReport(resultsNull);
  assert.equal(outputNull.trim(), 'no data: 0 days in input', 'Null input should produce exact no-data message');
});
