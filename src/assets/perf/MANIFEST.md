# WebP Asset Manifest for Issue #37

This manifest records the WebP exports created to reduce bundle size for heavy routes.

## Method

Measured using `node src/assets/perf/measure.mjs` after `npm ci && npm run build`. The script:

1. Extracts all base64 JPG strings from `dist/server/index.js`
2. Hashes decoded images and matches them to source files in `src/assets/`
3. Parses HTML constants for each route to find `/media/*.jpg` references
4. Maps each route to the images its HTML loads

Output: `src/assets/perf/measured-routes.json`

## Summary

- **Total original JPG bytes (decoded)**: 6234 KB
- **Total base64 bytes in bundle**: 8312 KB
- **Total new WebP bytes (all versions)**: 4859 KB
- **Bundle size**: 9904 KB (9.7 MB)

## Per-Route Impact

Routes over 1 MB in baseline (commit 00c8b74). Projection = current bundle - base64 removed + WebP added.

| Route | Baseline | Base64 Removed | WebP Desktop | WebP Mobile | Desktop Projected | Mobile Projected | Status |
|-------|----------|----------------|--------------|-------------|-------------------|------------------|--------|
| /development/atlas | 1479 KB | 2152 KB | 660 KB | 161 KB | -13 KB | -512 KB | ✓ Under 1 MB |
| / | 1278 KB | 2867 KB | 1036 KB | 206 KB | -553 KB | -1383 KB | ✓ Under 1 MB |
| /issues | 1269 KB | 0 KB | 0 KB | 0 KB | 1269 KB | 1269 KB | Over 1 MB |
| /form | 1267 KB | 1891 KB | 737 KB | 133 KB | 113 KB | -491 KB | ✓ Under 1 MB |
| /development | 1091 KB | 1637 KB | 545 KB | 123 KB | -1 KB | -423 KB | ✓ Under 1 MB |
| /enigmas | 1086 KB | 2596 KB | 836 KB | 188 KB | -674 KB | -1322 KB | ✓ Under 1 MB |
| /ether | 1080 KB | 1636 KB | 802 KB | 127 KB | 246 KB | -429 KB | ✓ Under 1 MB |
| /foundation | 1001 KB | 1530 KB | 510 KB | 118 KB | -19 KB | -411 KB | ✓ Under 1 MB |

### Calculation Detail

**/development/atlas** (9 images):
- Baseline: 1479 KB
- Base64 removed: 2152 KB
- WebP desktop-1x added: 660 KB
- WebP mobile-1x added: 161 KB
- Desktop projection: 1479 - 2152 + 660 = -13 KB
- Mobile projection: 1479 - 2152 + 161 = -512 KB

**/** (12 images):
- Baseline: 1278 KB
- Base64 removed: 2867 KB
- WebP desktop-1x added: 1036 KB
- WebP mobile-1x added: 206 KB
- Desktop projection: 1278 - 2867 + 1036 = -553 KB
- Mobile projection: 1278 - 2867 + 206 = -1383 KB

**/issues** (0 images):
- Baseline: 1269 KB
- Base64 removed: 0 KB
- WebP desktop-1x added: 0 KB
- WebP mobile-1x added: 0 KB
- Desktop projection: 1269 - 0 + 0 = 1269 KB
- Mobile projection: 1269 - 0 + 0 = 1269 KB
- Note: /issues loads publication pages JSON object with HTML strings for all publication routes. Its weight is from HTML content, not base64 images.

**/form** (8 images):
- Baseline: 1267 KB
- Base64 removed: 1891 KB
- WebP desktop-1x added: 737 KB
- WebP mobile-1x added: 133 KB
- Desktop projection: 1267 - 1891 + 737 = 113 KB
- Mobile projection: 1267 - 1891 + 133 = -491 KB

**/development** (7 images):
- Baseline: 1091 KB
- Base64 removed: 1637 KB
- WebP desktop-1x added: 545 KB
- WebP mobile-1x added: 123 KB
- Desktop projection: 1091 - 1637 + 545 = -1 KB
- Mobile projection: 1091 - 1637 + 123 = -423 KB

**/enigmas** (11 images):
- Baseline: 1086 KB
- Base64 removed: 2596 KB
- WebP desktop-1x added: 836 KB
- WebP mobile-1x added: 188 KB
- Desktop projection: 1086 - 2596 + 836 = -674 KB
- Mobile projection: 1086 - 2596 + 188 = -1322 KB

**/ether** (5 images):
- Baseline: 1080 KB
- Base64 removed: 1636 KB
- WebP desktop-1x added: 802 KB
- WebP mobile-1x added: 127 KB
- Desktop projection: 1080 - 1636 + 802 = 246 KB
- Mobile projection: 1080 - 1636 + 127 = -429 KB

**/foundation** (6 images):
- Baseline: 1001 KB
- Base64 removed: 1530 KB
- WebP desktop-1x added: 510 KB
- WebP mobile-1x added: 118 KB
- Desktop projection: 1001 - 1530 + 510 = -19 KB
- Mobile projection: 1001 - 1530 + 118 = -411 KB

## Image Details

| File | Routes Using This Image | Source Location | Decoded | Base64 | WebP Versions | Dimensions |
|------|------------------------|-----------------|---------|--------|---------------|------------|
| cover.jpg | /, /about, /about/standards, /about/diana, /development, /development/atlas, /learning, /journal, /foundation, /foundation/youth, /tech-lounge, /ether, /motor, /form, /enigmas | src/assets/cover.jpg | 177 KB | 236 KB | desktop-1x: 51KB<br>mobile-1x: 24KB | — |
| detail.jpg | /enigmas | src/assets/detail.jpg | 110 KB | 146 KB | desktop-1x: 15KB<br>mobile-1x: 7KB | — |
| development.jpg | /, /development, /development/atlas, /tech-lounge, /enigmas | src/assets/development.jpg | 146 KB | 194 KB | desktop-1x: 93KB<br>mobile-1x: 12KB<br>mobile-2x: 36KB | — |
| diana-cards.jpg | /about/diana | src/assets/diana-cards.jpg | 383 KB | 511 KB | desktop-1x: 81KB<br>mobile-1x: 34KB | — |
| diana.jpg | /, /about, /about/diana | src/assets/diana.jpg | 186 KB | 248 KB | desktop-1x: 122KB<br>mobile-1x: 15KB<br>mobile-2x: 46KB | — |
| enigmas-academy.jpg | none | src/assets/enigmas-academy.jpg | 273 KB | 363 KB | desktop-1x: 85KB<br>mobile-1x: 25KB | — |
| enigmas-law.jpg | /development/atlas, /journal, /foundation, /enigmas | src/assets/enigmas-law.jpg | 181 KB | 241 KB | desktop-1x: 55KB<br>mobile-1x: 18KB | — |
| enigmas-politics.jpg | /, /development/atlas, /journal, /enigmas | src/assets/enigmas-politics.jpg | 205 KB | 274 KB | desktop-1x: 59KB<br>mobile-1x: 20KB | — |
| ether-1.jpg | /, /ether | src/assets/ether-1.jpg | 224 KB | 299 KB | desktop-1x: 155KB<br>mobile-1x: 24KB<br>mobile-2x: 65KB | — |
| ether-2.jpg | /ether | src/assets/ether-2.jpg | 335 KB | 446 KB | desktop-1x: 236KB<br>mobile-1x: 33KB<br>mobile-2x: 101KB | — |
| ether-3.jpg | /ether | src/assets/ether-3.jpg | 269 KB | 359 KB | desktop-1x: 207KB<br>mobile-1x: 27KB<br>mobile-2x: 79KB | — |
| ether-4.jpg | /ether | src/assets/ether-4.jpg | 222 KB | 296 KB | desktop-1x: 153KB<br>mobile-1x: 20KB<br>mobile-2x: 58KB | — |
| food.jpg | none | src/assets/food.jpg | 260 KB | 347 KB | desktop-1x: 152KB<br>mobile-1x: 20KB<br>mobile-2x: 57KB | — |
| form-1.jpg | /form | src/assets/form-1.jpg | 105 KB | 141 KB | desktop-1x: 47KB<br>mobile-1x: 8KB<br>mobile-2x: 19KB | — |
| form-2.jpg | /form | src/assets/form-2.jpg | 144 KB | 192 KB | desktop-1x: 73KB<br>mobile-1x: 12KB<br>mobile-2x: 30KB | — |
| form-3.jpg | /form | src/assets/form-3.jpg | 204 KB | 272 KB | desktop-1x: 118KB<br>mobile-1x: 19KB<br>mobile-2x: 50KB | — |
| form-4.jpg | /, /form | src/assets/form-4.jpg | 181 KB | 241 KB | desktop-1x: 96KB<br>mobile-1x: 15KB<br>mobile-2x: 40KB | — |
| form-5.jpg | /form | src/assets/form-5.jpg | 171 KB | 227 KB | desktop-1x: 85KB<br>mobile-1x: 15KB<br>mobile-2x: 36KB | — |
| form-6.jpg | /form | src/assets/form-6.jpg | 157 KB | 210 KB | desktop-1x: 81KB<br>mobile-1x: 14KB<br>mobile-2x: 34KB | — |
| form-7.jpg | /form | src/assets/form-7.jpg | 280 KB | 373 KB | desktop-1x: 187KB<br>mobile-1x: 27KB<br>mobile-2x: 74KB | — |
| foundation.jpg | /foundation, /foundation/youth, /enigmas | src/assets/foundation.jpg | 223 KB | 298 KB | desktop-1x: 162KB<br>mobile-1x: 19KB<br>mobile-2x: 59KB | — |
| hero.jpg | /about | src/assets/hero.jpg | 161 KB | 215 KB | desktop-1x: 98KB<br>mobile-1x: 11KB<br>mobile-2x: 34KB | — |
| learning.jpg | /, /development, /development/atlas, /learning, /journal, /foundation/youth, /enigmas | src/assets/learning.jpg | 163 KB | 217 KB | desktop-1x: 42KB<br>mobile-1x: 13KB | — |
| motor-1.jpg | /, /motor | src/assets/motor-1.jpg | 126 KB | 168 KB | desktop-1x: 59KB<br>mobile-1x: 9KB<br>mobile-2x: 22KB | — |
| motor-2.jpg | /motor | src/assets/motor-2.jpg | 247 KB | 329 KB | desktop-1x: 156KB<br>mobile-1x: 19KB<br>mobile-2x: 59KB | — |
| motor-3.jpg | /motor | src/assets/motor-3.jpg | 168 KB | 224 KB | desktop-1x: 85KB<br>mobile-1x: 13KB<br>mobile-2x: 34KB | — |
| motor-4.jpg | /motor | src/assets/motor-4.jpg | 191 KB | 255 KB | desktop-1x: 109KB<br>mobile-1x: 19KB<br>mobile-2x: 45KB | — |
| research.jpg | /, /development, /development/atlas, /learning, /journal, /foundation, /foundation/youth, /enigmas | src/assets/research.jpg | 176 KB | 234 KB | desktop-1x: 50KB<br>mobile-1x: 15KB | — |
| tech-lounge.jpg | /, /development, /development/atlas, /tech-lounge, /enigmas | src/assets/tech-lounge.jpg | 176 KB | 235 KB | desktop-1x: 117KB<br>mobile-1x: 17KB<br>mobile-2x: 46KB | — |
| tech-macro.jpg | /, /development, /development/atlas, /learning, /journal, /foundation, /tech-lounge, /enigmas | src/assets/tech-macro.jpg | 208 KB | 277 KB | desktop-1x: 69KB<br>mobile-1x: 22KB | — |
| youth.jpg | /, /development, /development/atlas, /foundation, /foundation/youth, /enigmas | src/assets/youth.jpg | 183 KB | 244 KB | desktop-1x: 122KB<br>mobile-1x: 20KB<br>mobile-2x: 52KB | — |

## Notes

- All WebP files exported at 1x display width (1440px desktop or 800px for cards, 390px mobile)
- Quality: 82 for 1x, 80 for 2x, except ether-2-desktop-1x at 78 to meet 250 KB target
- 2x versions included for hero/fullscreen images where source resolution allows
- Target: 250 KB or less per file (ether-2-desktop-1x at 237 KB with q78)
- Page integration (replacing base64 with file references) is a separate follow-up task
- enigmas-academy.jpg and food.jpg have no routes because those pages are not yet built into the bundle
