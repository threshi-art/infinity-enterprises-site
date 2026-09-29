# WebP Asset Manifest for Issue #37

This manifest records the WebP exports created to reduce bundle size for heavy routes.

## Summary

- **Total original JPG bytes (decoded)**: 8540 KB
- **Total base64 overhead in bundle**: 3160 KB
- **Total new WebP bytes**: 4901 KB
- **Projected savings (base64)**: 3639 KB

## Per-Route Impact

Routes over 1 MB in baseline (commit 00c8b74):

- **/development/atlas**: 1479 KB → ~1479 KB (saves ~0 KB)
- **/**: 1278 KB → ~-450 KB (saves ~1728 KB)
- **/issues**: 1269 KB → ~1269 KB (saves ~0 KB)
- **/form**: 1267 KB → ~361 KB (saves ~906 KB)
- **/development**: 1091 KB → ~996 KB (saves ~95 KB)
- **/enigmas**: 1086 KB → ~1086 KB (saves ~0 KB)
- **/ether**: 1080 KB → ~538 KB (saves ~542 KB)
- **/foundation**: 1001 KB → ~332 KB (saves ~669 KB)

## Image Details

| File | Routes | Source Location | Original (decoded) | Base64 | New WebP | Dimensions | Display Size |
|------|--------|-----------------|-------------------|---------|----------|------------|-------------|
| hero.jpg | / | src/assets/hero.jpg | 161 KB | 220 KB | desktop-1x: 98KB<br>mobile-1x: 11KB<br>mobile-2x: 34KB | 1600×900 | Desktop: 1440x900<br>Mobile: 390x844 |
| detail.jpg | / | src/assets/detail.jpg | 110 KB | 150 KB | desktop-1x: 15KB<br>mobile-1x: 7KB | 1448×1086 | Desktop: 640x480<br>Mobile: 390x300 |
| diana.jpg | /about/diana, / | src/assets/diana.jpg | 186 KB | 255 KB | desktop-1x: 122KB<br>mobile-1x: 15KB<br>mobile-2x: 46KB | 1600×900 | Desktop: 1440x900<br>Mobile: 390x844 |
| diana-cards.jpg | /about/diana | src/assets/diana-cards.jpg | 383 KB | 525 KB | desktop-1x: 81KB<br>mobile-1x: 34KB | 1448×1086 | Desktop: 640x480<br>Mobile: 390x300 |
| development.jpg | /development, /, /tech-lounge | src/assets/development.jpg | 146 KB | 200 KB | desktop-1x: 93KB<br>mobile-1x: 12KB<br>mobile-2x: 36KB | 1600×686 | Desktop: 1440x900<br>Mobile: 390x844 |
| tech-lounge.jpg | /tech-lounge, /, / | src/assets/tech-lounge.jpg | 176 KB | 241 KB | desktop-1x: 117KB<br>mobile-1x: 17KB<br>mobile-2x: 46KB | 1600×900 | Desktop: 1440x900<br>Mobile: 390x844 |
| tech-macro.jpg | /, /learning, /foundation, /tech-lounge | src/assets/tech-macro.jpg | 208 KB | 285 KB | desktop-1x: 69KB<br>mobile-1x: 22KB | 1600×900 | Desktop: 800x600<br>Mobile: 390x300 |
| enigmas-politics.jpg | /, /journal | src/assets/enigmas-politics.jpg | 205 KB | 281 KB | desktop-1x: 59KB<br>mobile-1x: 20KB | 1536×1024 | Desktop: 800x600<br>Mobile: 390x300 |
| enigmas-law.jpg | /foundation, /journal | src/assets/enigmas-law.jpg | 181 KB | 248 KB | desktop-1x: 55KB<br>mobile-1x: 18KB | 1600×800 | Desktop: 800x600<br>Mobile: 390x300 |
| enigmas-academy.jpg | unused | src/assets/enigmas-academy.jpg | 273 KB | 373 KB | desktop-1x: 85KB<br>mobile-1x: 25KB | 1600×900 | Desktop: 800x600<br>Mobile: 390x300 |
| research.jpg | /, /journal, /learning, /foundation | src/assets/research.jpg | 176 KB | 241 KB | desktop-1x: 50KB<br>mobile-1x: 15KB | 1600×900 | Desktop: 800x600<br>Mobile: 390x300 |
| learning.jpg | /learning, /youth, /journal | src/assets/learning.jpg | 163 KB | 223 KB | desktop-1x: 42KB<br>mobile-1x: 13KB | 1600×900 | Desktop: 800x600<br>Mobile: 390x300 |
| foundation.jpg | /foundation, /youth | src/assets/foundation.jpg | 223 KB | 306 KB | desktop-1x: 162KB<br>mobile-1x: 19KB<br>mobile-2x: 59KB | 1600×900 | Desktop: 1440x900<br>Mobile: 390x844 |
| youth.jpg | /foundation/youth, / | src/assets/youth.jpg | 183 KB | 250 KB | desktop-1x: 122KB<br>mobile-1x: 20KB<br>mobile-2x: 52KB | 1600×900 | Desktop: 1440x900<br>Mobile: 390x844 |
| cover.jpg | / | src/assets/cover.jpg | 177 KB | 242 KB | desktop-1x: 51KB<br>mobile-1x: 24KB | 1122×1402 | Desktop: 640x480<br>Mobile: 390x300 |
| food.jpg | unused | src/assets/food.jpg | 260 KB | 356 KB | desktop-1x: 152KB<br>mobile-1x: 20KB<br>mobile-2x: 57KB | 1672×941 | Desktop: 1440x900<br>Mobile: 390x844 |
| ether-1.jpg | /ether, / | src/assets/ether-1.jpg | 224 KB | 307 KB | desktop-1x: 155KB<br>mobile-1x: 24KB<br>mobile-2x: 65KB | 1599×900 | Desktop: 1440x900<br>Mobile: 390x844 |
| ether-2.jpg | /ether | src/assets/ether-2.jpg | 335 KB | 458 KB | desktop-1x: 278KB<br>mobile-1x: 33KB<br>mobile-2x: 101KB | 1599×900 | Desktop: 1440x900<br>Mobile: 390x844 |
| ether-3.jpg | /ether | src/assets/ether-3.jpg | 269 KB | 369 KB | desktop-1x: 207KB<br>mobile-1x: 27KB<br>mobile-2x: 79KB | 1599×900 | Desktop: 1440x900<br>Mobile: 390x844 |
| ether-4.jpg | /ether | src/assets/ether-4.jpg | 222 KB | 304 KB | desktop-1x: 153KB<br>mobile-1x: 20KB<br>mobile-2x: 58KB | 1599×900 | Desktop: 1440x900<br>Mobile: 390x844 |
| motor-1.jpg | /motor, / | src/assets/motor-1.jpg | 126 KB | 172 KB | desktop-1x: 59KB<br>mobile-1x: 9KB<br>mobile-2x: 22KB | 1599×900 | Desktop: 1440x900<br>Mobile: 390x844 |
| motor-2.jpg | /motor | src/assets/motor-2.jpg | 247 KB | 338 KB | desktop-1x: 156KB<br>mobile-1x: 19KB<br>mobile-2x: 59KB | 1599×900 | Desktop: 1440x900<br>Mobile: 390x844 |
| motor-3.jpg | /motor | src/assets/motor-3.jpg | 168 KB | 231 KB | desktop-1x: 85KB<br>mobile-1x: 13KB<br>mobile-2x: 34KB | 1599×900 | Desktop: 1440x900<br>Mobile: 390x844 |
| motor-4.jpg | /motor | src/assets/motor-4.jpg | 191 KB | 262 KB | desktop-1x: 109KB<br>mobile-1x: 19KB<br>mobile-2x: 45KB | 1599×900 | Desktop: 1440x900<br>Mobile: 390x844 |
| form-1.jpg | /form, / | src/assets/form-1.jpg | 105 KB | 145 KB | desktop-1x: 47KB<br>mobile-1x: 8KB<br>mobile-2x: 19KB | 1599×900 | Desktop: 1440x900<br>Mobile: 390x844 |
| form-2.jpg | /form | src/assets/form-2.jpg | 144 KB | 197 KB | desktop-1x: 73KB<br>mobile-1x: 12KB<br>mobile-2x: 30KB | 1599×900 | Desktop: 1440x900<br>Mobile: 390x844 |
| form-3.jpg | /form | src/assets/form-3.jpg | 204 KB | 280 KB | desktop-1x: 118KB<br>mobile-1x: 19KB<br>mobile-2x: 50KB | 1600×900 | Desktop: 1440x900<br>Mobile: 390x844 |
| form-4.jpg | /form | src/assets/form-4.jpg | 181 KB | 248 KB | desktop-1x: 96KB<br>mobile-1x: 15KB<br>mobile-2x: 40KB | 1599×900 | Desktop: 1440x900<br>Mobile: 390x844 |
| form-5.jpg | /form | src/assets/form-5.jpg | 171 KB | 234 KB | desktop-1x: 85KB<br>mobile-1x: 15KB<br>mobile-2x: 36KB | 1599×900 | Desktop: 1440x900<br>Mobile: 390x844 |
| form-6.jpg | /form | src/assets/form-6.jpg | 157 KB | 215 KB | desktop-1x: 81KB<br>mobile-1x: 14KB<br>mobile-2x: 34KB | 1599×900 | Desktop: 1440x900<br>Mobile: 390x844 |
| form-7.jpg | /form | src/assets/form-7.jpg | 280 KB | 383 KB | desktop-1x: 187KB<br>mobile-1x: 27KB<br>mobile-2x: 74KB | 1599×900 | Desktop: 1440x900<br>Mobile: 390x844 |

## Notes

- All WebP files are exported at 1x display width, with 2x versions for large fullscreen images where source resolution allows
- Quality set to 82 for 1x, 80 for 2x to balance size and visual fidelity
- No upscaling beyond source pixel dimensions
- Target: 250 KB or less per file (400 KB allowed for 2x versions where justified)
- Page integration (replacing base64 with file references) is a separate follow-up task
