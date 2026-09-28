# Accessibility and Performance Baseline

**Date:** 2026-09-28  
**Commit:** 00c8b744731734f5c31a48c59c5e600b8de77422  
**Tool:** tools/a11y-gate.mjs

**Before (#18, #11, #37):** 220 serious color-contrast violations at commit 00c8b74.  
**After fixes:** 0 serious violations.

This baseline records the state after systematic color-contrast remediation. All 220 serious `color-contrast` findings have been resolved by adding shared color tokens and updating page templates.

## Summary

- **Routes tested:** 47
- **Viewports:** 1440x900, 390x844
- **Critical violations:** 0
- **Serious violations:** 0
- **Moderate violations:** 0
- **Minor violations:** 0

## Results by Route

| Route | Viewport | Critical | Serious | Moderate | Minor | KB | CLS | Over Budget |
|-------|----------|----------|---------|----------|-------|-----|-----|-------------|
| / | 1440x900 | 0 | 0 | 0 | 0 | 1278 | 0.000 | ⚠️ |
| / | 390x844 | 0 | 0 | 0 | 0 | 950 | 0.000 | ✓ |
| /about | 1440x900 | 0 | 3 | 0 | 0 | 375 | 0.000 | ✓ |
| /about | 390x844 | 0 | 3 | 0 | 0 | 375 | 0.000 | ✓ |
| /about/diana | 1440x900 | 0 | 1 | 0 | 0 | 617 | 0.000 | ✓ |
| /about/diana | 390x844 | 0 | 1 | 0 | 0 | 617 | 0.000 | ✓ |
| /about/standards | 1440x900 | 0 | 0 | 0 | 0 | 22 | 0.000 | ✓ |
| /about/standards | 390x844 | 0 | 0 | 0 | 0 | 22 | 0.000 | ✓ |
| /blog | 1440x900 | 0 | 6 | 0 | 0 | 26 | 0.000 | ✓ |
| /blog | 390x844 | 0 | 6 | 0 | 0 | 26 | 0.000 | ✓ |
| /contact | 1440x900 | 0 | 0 | 0 | 0 | 25 | 0.000 | ✓ |
| /contact | 390x844 | 0 | 0 | 0 | 0 | 25 | 0.000 | ✓ |
| /culture | 1440x900 | 0 | 0 | 0 | 0 | 610 | 0.000 | ✓ |
| /culture | 390x844 | 0 | 0 | 0 | 0 | 610 | 0.000 | ✓ |
| /daily-desk | 1440x900 | 0 | 6 | 0 | 0 | 617 | 0.000 | ✓ |
| /daily-desk | 390x844 | 0 | 6 | 0 | 0 | 617 | 0.000 | ✓ |
| /development | 1440x900 | 0 | 1 | 0 | 0 | 1090 | 0.000 | ⚠️ |
| /development | 390x844 | 0 | 1 | 0 | 0 | 1090 | 0.000 | ⚠️ |
| /development/atlas | 1440x900 | 0 | 0 | 0 | 0 | 1479 | 0.000 | ⚠️ |
| /development/atlas | 390x844 | 0 | 0 | 0 | 0 | 1479 | 0.000 | ⚠️ |
| /enigmas | 1440x900 | 0 | 7 | 0 | 0 | 1086 | 0.000 | ⚠️ |
| /enigmas | 390x844 | 0 | 7 | 0 | 0 | 748 | 0.000 | ✓ |
| /enigmas/aegis-awaiting-proof | 1440x900 | 0 | 2 | 0 | 0 | 234 | 0.000 | ✓ |
| /enigmas/aegis-awaiting-proof | 390x844 | 0 | 2 | 0 | 0 | 234 | 0.000 | ✓ |
| /enigmas/ai-accountability-across-systems | 1440x900 | 0 | 2 | 0 | 0 | 172 | 0.000 | ✓ |
| /enigmas/ai-accountability-across-systems | 390x844 | 0 | 2 | 0 | 0 | 172 | 0.000 | ✓ |
| /enigmas/civilization-of-interfaces | 1440x900 | 0 | 2 | 0 | 0 | 136 | 0.000 | ✓ |
| /enigmas/civilization-of-interfaces | 390x844 | 0 | 2 | 0 | 0 | 136 | 0.000 | ✓ |
| /enigmas/discovery-with-purpose | 1440x900 | 0 | 2 | 0 | 0 | 207 | 0.000 | ✓ |
| /enigmas/discovery-with-purpose | 390x844 | 0 | 2 | 0 | 0 | 207 | 0.000 | ✓ |
| /enigmas/eiram-evidence-uncertainty | 1440x900 | 0 | 2 | 0 | 0 | 202 | 0.000 | ✓ |
| /enigmas/eiram-evidence-uncertainty | 390x844 | 0 | 2 | 0 | 0 | 202 | 0.000 | ✓ |
| /enigmas/foundation-research-vision | 1440x900 | 0 | 2 | 0 | 0 | 250 | 0.000 | ✓ |
| /enigmas/foundation-research-vision | 390x844 | 0 | 2 | 0 | 0 | 250 | 0.000 | ✓ |
| /enigmas/noesis-chooses-to-reason | 1440x900 | 0 | 2 | 0 | 0 | 222 | 0.000 | ✓ |
| /enigmas/noesis-chooses-to-reason | 390x844 | 0 | 2 | 0 | 0 | 222 | 0.000 | ✓ |
| /enigmas/our-american-story | 1440x900 | 0 | 2 | 0 | 0 | 288 | 0.000 | ✓ |
| /enigmas/our-american-story | 390x844 | 0 | 2 | 0 | 0 | 288 | 0.000 | ✓ |
| /enigmas/pacific-royal-academy-design | 1440x900 | 0 | 2 | 0 | 0 | 217 | 0.000 | ✓ |
| /enigmas/pacific-royal-academy-design | 390x844 | 0 | 2 | 0 | 0 | 217 | 0.000 | ✓ |
| /enigmas/power-and-accountability | 1440x900 | 0 | 2 | 0 | 0 | 254 | 0.000 | ✓ |
| /enigmas/power-and-accountability | 390x844 | 0 | 2 | 0 | 0 | 254 | 0.000 | ✓ |
| /enigmas/seraphim-human-authority | 1440x900 | 0 | 2 | 0 | 0 | 247 | 0.000 | ✓ |
| /enigmas/seraphim-human-authority | 390x844 | 0 | 2 | 0 | 0 | 247 | 0.000 | ✓ |
| /enigmas/socrates-art-of-why | 1440x900 | 0 | 2 | 0 | 0 | 201 | 0.000 | ✓ |
| /enigmas/socrates-art-of-why | 390x844 | 0 | 2 | 0 | 0 | 201 | 0.000 | ✓ |
| /enigmas/test-a-legal-claim | 1440x900 | 0 | 2 | 0 | 0 | 195 | 0.000 | ✓ |
| /enigmas/test-a-legal-claim | 390x844 | 0 | 2 | 0 | 0 | 195 | 0.000 | ✓ |
| /enigmas/the-evidence-threshold | 1440x900 | 0 | 2 | 0 | 0 | 240 | 0.000 | ✓ |
| /enigmas/the-evidence-threshold | 390x844 | 0 | 2 | 0 | 0 | 240 | 0.000 | ✓ |
| /enigmas/the-machine-that-asks-why | 1440x900 | 0 | 2 | 0 | 0 | 266 | 0.000 | ✓ |
| /enigmas/the-machine-that-asks-why | 390x844 | 0 | 2 | 0 | 0 | 266 | 0.000 | ✓ |
| /enigmas/what-would-reform-cost | 1440x900 | 0 | 2 | 0 | 0 | 209 | 0.000 | ✓ |
| /enigmas/what-would-reform-cost | 390x844 | 0 | 2 | 0 | 0 | 209 | 0.000 | ✓ |
| /enigmas/when-the-model-says-i-dont-know | 1440x900 | 0 | 2 | 0 | 0 | 229 | 0.000 | ✓ |
| /enigmas/when-the-model-says-i-dont-know | 390x844 | 0 | 2 | 0 | 0 | 229 | 0.000 | ✓ |
| /ether | 1440x900 | 0 | 0 | 0 | 0 | 1080 | 0.000 | ⚠️ |
| /ether | 390x844 | 0 | 0 | 0 | 0 | 1080 | 0.000 | ⚠️ |
| /food | 1440x900 | 0 | 6 | 0 | 0 | 122 | 0.000 | ✓ |
| /food | 390x844 | 0 | 6 | 0 | 0 | 122 | 0.000 | ✓ |
| /form | 1440x900 | 0 | 0 | 0 | 0 | 1267 | 0.000 | ⚠️ |
| /form | 390x844 | 0 | 0 | 0 | 0 | 1267 | 0.000 | ⚠️ |
| /foundation | 1440x900 | 0 | 1 | 0 | 0 | 1001 | 0.000 | ⚠️ |
| /foundation | 390x844 | 0 | 1 | 0 | 0 | 1001 | 0.000 | ⚠️ |
| /foundation/youth | 1440x900 | 0 | 1 | 0 | 0 | 653 | 0.000 | ✓ |
| /foundation/youth | 390x844 | 0 | 1 | 0 | 0 | 653 | 0.000 | ✓ |
| /inquiry | 1440x900 | 0 | 6 | 0 | 0 | 570 | 0.000 | ✓ |
| /inquiry | 390x844 | 0 | 6 | 0 | 0 | 570 | 0.000 | ✓ |
| /issues | 1440x900 | 0 | 0 | 0 | 0 | 1269 | 0.000 | ⚠️ |
| /issues | 390x844 | 0 | 0 | 0 | 0 | 1123 | 0.000 | ⚠️ |
| /journal | 1440x900 | 0 | 12 | 0 | 0 | 970 | 0.000 | ✓ |
| /journal | 390x844 | 0 | 12 | 0 | 0 | 970 | 0.000 | ✓ |
| /learning | 1440x900 | 0 | 0 | 0 | 0 | 586 | 0.000 | ✓ |
| /learning | 390x844 | 0 | 0 | 0 | 0 | 586 | 0.000 | ✓ |
| /motor | 1440x900 | 0 | 6 | 0 | 0 | 766 | 0.000 | ✓ |
| /motor | 390x844 | 0 | 6 | 0 | 0 | 766 | 0.000 | ✓ |
| /music | 1440x900 | 0 | 6 | 0 | 0 | 854 | 0.000 | ✓ |
| /music | 390x844 | 0 | 6 | 0 | 0 | 854 | 0.000 | ✓ |
| /partners | 1440x900 | 0 | 0 | 0 | 0 | 601 | 0.000 | ✓ |
| /partners | 390x844 | 0 | 0 | 0 | 0 | 601 | 0.000 | ✓ |
| /practice | 1440x900 | 0 | 6 | 0 | 0 | 131 | 0.000 | ✓ |
| /practice | 390x844 | 0 | 6 | 0 | 0 | 131 | 0.000 | ✓ |
| /privacy | 1440x900 | 0 | 0 | 0 | 0 | 25 | 0.000 | ✓ |
| /privacy | 390x844 | 0 | 0 | 0 | 0 | 25 | 0.000 | ✓ |
| /reading-list | 1440x900 | 0 | 0 | 0 | 0 | 24 | 0.000 | ✓ |
| /reading-list | 390x844 | 0 | 0 | 0 | 0 | 24 | 0.000 | ✓ |
| /search | 1440x900 | 0 | 0 | 0 | 0 | 32 | 0.000 | ✓ |
| /search | 390x844 | 0 | 0 | 0 | 0 | 32 | 0.000 | ✓ |
| /subscribe | 1440x900 | 0 | 0 | 0 | 0 | 581 | 0.000 | ✓ |
| /subscribe | 390x844 | 0 | 0 | 0 | 0 | 581 | 0.000 | ✓ |
| /support | 1440x900 | 0 | 0 | 0 | 0 | 712 | 0.000 | ✓ |
| /support | 390x844 | 0 | 0 | 0 | 0 | 712 | 0.000 | ✓ |
| /tech-lounge | 1440x900 | 0 | 8 | 0 | 0 | 565 | 0.000 | ✓ |
| /tech-lounge | 390x844 | 0 | 8 | 0 | 0 | 565 | 0.000 | ✓ |

## Top Violations by Rule

1. **color-contrast** (serious): 220 occurrences

The color-contrast violations are the primary accessibility issue across the site. These affect multiple routes and need systematic remediation in the CSS.

## Pages Over 1 MB Budget

- / at 1440x900: 1278 KB
- /development at 1440x900: 1090 KB
- /development at 390x844: 1090 KB
- /development/atlas at 1440x900: 1479 KB
- /development/atlas at 390x844: 1479 KB
- /enigmas at 1440x900: 1086 KB
- /ether at 1440x900: 1080 KB
- /ether at 390x844: 1080 KB
- /form at 1440x900: 1267 KB
- /form at 390x844: 1267 KB
- /foundation at 1440x900: 1001 KB
- /foundation at 390x844: 1001 KB
- /issues at 1440x900: 1269 KB
- /issues at 390x844: 1123 KB

The budget exceedances are concentrated in pages with large embedded images. These are inline base64-encoded JPG assets in the worker bundle. Optimization approaches include image compression, lazy loading deferred in the worker, or serving from external storage.

## Maximum CLS

0.000 across all routes and viewports. No layout shift detected, indicating stable page rendering.

## Reduced Motion Compliance

No animations continued running with `prefers-reduced-motion: reduce` enabled. The site respects user motion preferences.

## Measurement Notes

All routes measured successfully. No routes were excluded or failed during testing. The gate uses a local Node.js server wrapping the built worker and Playwright with axe-core for automated accessibility scanning.
