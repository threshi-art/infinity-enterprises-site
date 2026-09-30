# WebP Asset Manifest for Issue #37

This manifest records the WebP exports created to reduce bundle size for heavy routes.

## Method

Measured using Playwright browser automation after `npm ci && npm run build`:

1. Start local server wrapping built worker (same as tools/a11y-gate.mjs)
2. For each over-budget route at both viewports, load in Playwright and record all responses
3. Load again with request interception replacing /media/*.jpg with WebP (desktop-1x at 1440px, mobile-1x at 390px)
4. Projection is the measured total with WebP substitution

Script: `src/assets/perf/measure.mjs` (uses Playwright; no new dependencies beyond existing test setup)

## Per-Route Results

| Route | Viewport | Baseline KB | Measured KB | JPG KB | Projected KB | Under 1 MB |
|-------|----------|-------------|-------------|--------|--------------|------------|
| /development/atlas | 1440x900 | 1479 | 1480 | 1437 | 652 | ✓ |
| /development/atlas | 390x844 | 1479 | 1480 | 1437 | 180 | ✓ |
| / | 1440x900 | 1278 | 1280 | 1228 | 597 | ✓ |
| / | 390x844 | 787 | 951 | 899 | 143 | ✓ |
| /issues | 1440x900 | 1269 | 1270 | 1243 | 641 | ✓ |
| /issues | 390x844 | 1123 | 1270 | 1243 | 136 | ✓ |
| /form | 1440x900 | 1267 | 1269 | 1242 | 713 | ✓ |
| /form | 390x844 | 1267 | 1269 | 1242 | 136 | ✓ |
| /development | 1440x900 | 1091 | 1092 | 1051 | 535 | ✓ |
| /development | 390x844 | 1091 | 1092 | 1051 | 140 | ✓ |
| /enigmas | 1440x900 | 1086 | 1088 | 1047 | 458 | ✓ |
| /enigmas | 390x844 | 748 | 749 | 708 | 108 | ✓ |
| /ether | 1440x900 | 1080 | 1081 | 1050 | 783 | ✓ |
| /ether | 390x844 | 1080 | 1081 | 1050 | 134 | ✓ |
| /foundation | 1440x900 | 1001 | 1002 | 971 | 490 | ✓ |
| /foundation | 390x844 | 1001 | 1002 | 971 | 126 | ✓ |

## Routes Still Over Budget

All measured routes are projected under 1 MB after WebP integration.

## Image Details

| File | Requested on Over-Budget Routes | WebP Versions (KB) |
|------|----------------------------------|--------------------|
| hero.jpg | not requested on over-budget routes | desktop-1x: 98<br>mobile-1x: 11<br>mobile-2x: 34 |
| detail.jpg | not requested on over-budget routes | desktop-1x: 15<br>mobile-1x: 7 |
| diana.jpg | not requested on over-budget routes | desktop-1x: 122<br>mobile-1x: 15<br>mobile-2x: 46 |
| diana-cards.jpg | not requested on over-budget routes | desktop-1x: 81<br>mobile-1x: 34 |
| development.jpg | /, /development, /development/atlas, /enigmas, /issues | desktop-1x: 93<br>mobile-1x: 12<br>mobile-2x: 36 |
| tech-lounge.jpg | /, /development, /development/atlas, /enigmas | desktop-1x: 117<br>mobile-1x: 17<br>mobile-2x: 46 |
| tech-macro.jpg | /, /development, /development/atlas, /foundation | desktop-1x: 69<br>mobile-1x: 22 |
| enigmas-politics.jpg | /development/atlas, /enigmas, /issues | desktop-1x: 59<br>mobile-1x: 20 |
| enigmas-law.jpg | /development/atlas, /enigmas, /foundation | desktop-1x: 55<br>mobile-1x: 18 |
| enigmas-academy.jpg | not requested on over-budget routes | desktop-1x: 85<br>mobile-1x: 25 |
| research.jpg | /, /development, /development/atlas, /enigmas, /foundation, /issues | desktop-1x: 50<br>mobile-1x: 15 |
| learning.jpg | /, /development, /development/atlas, /enigmas | desktop-1x: 42<br>mobile-1x: 13 |
| foundation.jpg | /foundation | desktop-1x: 162<br>mobile-1x: 19<br>mobile-2x: 59 |
| youth.jpg | /, /development, /development/atlas, /foundation | desktop-1x: 122<br>mobile-1x: 20<br>mobile-2x: 52 |
| cover.jpg | / | desktop-1x: 51<br>mobile-1x: 24 |
| food.jpg | /issues | desktop-1x: 152<br>mobile-1x: 20<br>mobile-2x: 57 |
| ether-1.jpg | /ether, /issues | desktop-1x: 155<br>mobile-1x: 24<br>mobile-2x: 65 |
| ether-2.jpg | /ether | desktop-1x: 236<br>mobile-1x: 33<br>mobile-2x: 101 |
| ether-3.jpg | /ether | desktop-1x: 207<br>mobile-1x: 27<br>mobile-2x: 79 |
| ether-4.jpg | /ether | desktop-1x: 153<br>mobile-1x: 20<br>mobile-2x: 58 |
| motor-1.jpg | /issues | desktop-1x: 59<br>mobile-1x: 9<br>mobile-2x: 22 |
| motor-2.jpg | not requested on over-budget routes | desktop-1x: 156<br>mobile-1x: 19<br>mobile-2x: 59 |
| motor-3.jpg | not requested on over-budget routes | desktop-1x: 85<br>mobile-1x: 13<br>mobile-2x: 34 |
| motor-4.jpg | not requested on over-budget routes | desktop-1x: 109<br>mobile-1x: 19<br>mobile-2x: 45 |
| form-1.jpg | /form, /issues | desktop-1x: 47<br>mobile-1x: 8<br>mobile-2x: 19 |
| form-2.jpg | /form | desktop-1x: 73<br>mobile-1x: 12<br>mobile-2x: 30 |
| form-3.jpg | /form | desktop-1x: 118<br>mobile-1x: 19<br>mobile-2x: 50 |
| form-4.jpg | /form | desktop-1x: 96<br>mobile-1x: 15<br>mobile-2x: 40 |
| form-5.jpg | /form | desktop-1x: 85<br>mobile-1x: 15<br>mobile-2x: 36 |
| form-6.jpg | /form | desktop-1x: 81<br>mobile-1x: 14<br>mobile-2x: 34 |
| form-7.jpg | /form | desktop-1x: 187<br>mobile-1x: 27<br>mobile-2x: 74 |

## Notes

- WebP files exported at display width: 1440px (desktop-1x), 390px (mobile-1x)
- Quality: 82 for 1x, 80 for 2x, except ether-2-desktop-1x at 78 (237 KB target)
- 2x versions for hero/fullscreen images where source resolution allows
- Projections are real browser measurements with WebP interception, not arithmetic
- Page integration (updating HTML/build to reference WebP files) is a separate follow-up task
