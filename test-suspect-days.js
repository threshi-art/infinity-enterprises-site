import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeSuspectDays } from './scripts/suspect-days.mjs';

test('14-day fake run: all flagged, plain median would miss some', () => {
  const dailyViews = [];
  
  // 30 normal days at ~100 views
  for (let i = 0; i < 30; i++) {
    dailyViews.push({
      day: `2026-09-${String(i + 1).padStart(2, '0')}`,
      views: 95 + Math.floor(Math.random() * 10)
    });
  }
  
  // 14-day fake traffic run at ~2000 views
  for (let i = 0; i < 14; i++) {
    dailyViews.push({
      day: `2026-10-${String(i + 1).padStart(2, '0')}`,
      views: 1950 + Math.floor(Math.random() * 100)
    });
  }
  
  const flagged = analyzeSuspectDays(dailyViews);
  
  // All 14 fake days should be flagged
  const fakeDaysFlagged = flagged.filter(f => f.day >= '2026-10-01' && f.day <= '2026-10-14');
  assert.equal(fakeDaysFlagged.length, 14, 'All 14 fake traffic days should be flagged');
  
  // No normal days should be flagged
  const normalDaysFlagged = flagged.filter(f => f.day < '2026-10-01');
  assert.equal(normalDaysFlagged.length, 0, 'No normal days should be flagged');
  
  // Prove plain unfiltered median would miss at least one run day
  // Simulate plain 14-day median for the last fake day
  const lastFakeDay = dailyViews.find(d => d.day === '2026-10-14');
  const previous14 = dailyViews
    .filter(d => d.day < '2026-10-14' && d.day >= '2026-10-01')
    .slice(0, 14)
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

test('Real growth: stays flagged without cleared days, unflagged with cleared days', () => {
  const dailyViews = [];
  
  // 30 normal days at ~100 views
  for (let i = 0; i < 30; i++) {
    dailyViews.push({
      day: `2026-09-${String(i + 1).padStart(2, '0')}`,
      views: 95 + Math.floor(Math.random() * 10)
    });
  }
  
  // Real growth: 20 days at ~400 views
  for (let i = 0; i < 20; i++) {
    dailyViews.push({
      day: `2026-10-${String(i + 1).padStart(2, '0')}`,
      views: 390 + Math.floor(Math.random() * 20)
    });
  }
  
  // Without cleared days, growth days stay flagged
  const flaggedWithoutCleared = analyzeSuspectDays(dailyViews);
  const growthDaysFlagged = flaggedWithoutCleared.filter(
    f => f.day >= '2026-10-01' && f.day <= '2026-10-20'
  );
  assert.ok(growthDaysFlagged.length > 0, 'Growth days should be flagged without cleared days');
  
  // With first 7 growth days cleared, later growth days should not be flagged
  const clearedDays = [
    '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04',
    '2026-10-05', '2026-10-06', '2026-10-07'
  ];
  const flaggedWithCleared = analyzeSuspectDays(dailyViews, clearedDays);
  const laterGrowthDaysFlagged = flaggedWithCleared.filter(
    f => f.day > '2026-10-07' && f.day <= '2026-10-20'
  );
  assert.equal(
    laterGrowthDaysFlagged.length,
    0,
    'Later growth days should not be flagged when first 7 are cleared'
  );
});

test('Cold start: fewer than 7 baseline days means nothing flagged', () => {
  const dailyViews = [
    { day: '2026-09-01', views: 100 },
    { day: '2026-09-02', views: 100 },
    { day: '2026-09-03', views: 100 },
    { day: '2026-09-04', views: 2000 }, // Spike but only 3 baseline days
    { day: '2026-09-05', views: 2000 },
    { day: '2026-09-06', views: 2000 }
  ];
  
  const flagged = analyzeSuspectDays(dailyViews);
  
  // Days 4-6 have huge spikes but not enough baseline days
  assert.equal(flagged.length, 0, 'Nothing should be flagged with fewer than 7 baseline days');
});
