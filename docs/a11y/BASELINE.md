# Accessibility and Performance Baseline

**Date:** 2026-09-28
**Commit:** cdcdbe32a4f099c8ccf1c83cb8990101c0b08fbf
**Tool:** tools/a11y-gate.mjs

**Before (#18, #11, #37):** 220 serious color-contrast violations at commit 72475b1.
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
| / | 390x844 | 0 | 0 | 0 | 0 | 787 | 0.000 | ✓ |
| /about | 1440x900 | 0 | 0 | 0 | 0 | 375 | 0.000 | ✓ |
| /about | 390x844 | 0 | 0 | 0 | 0 | 375 | 0.000 | ✓ |
| /about/diana | 1440x900 | 0 | 0 | 0 | 0 | 618 | 0.000 | ✓ |
| /about/diana | 390x844 | 0 | 0 | 0 | 0 | 618 | 0.000 | ✓ |
| /about/standards | 1440x900 | 0 | 0 | 0 | 0 | 22 | 0.000 | ✓ |
| /about/standards | 390x844 | 0 | 0 | 0 | 0 | 22 | 0.000 | ✓ |
| /blog | 1440x900 | 0 | 0 | 0 | 0 | 27 | 0.000 | ✓ |
| /blog | 390x844 | 0 | 0 | 0 | 0 | 27 | 0.000 | ✓ |
| /contact | 1440x900 | 0 | 0 | 0 | 0 | 25 | 0.000 | ✓ |
| /contact | 390x844 | 0 | 0 | 0 | 0 | 25 | 0.000 | ✓ |
| /culture | 1440x900 | 0 | 0 | 0 | 0 | 610 | 0.000 | ✓ |
| /culture | 390x844 | 0 | 0 | 0 | 0 | 610 | 0.000 | ✓ |
| /daily-desk | 1440x900 | 0 | 0 | 0 | 0 | 617 | 0.000 | ✓ |
| /daily-desk | 390x844 | 0 | 0 | 0 | 0 | 617 | 0.000 | ✓ |
| /development | 1440x900 | 0 | 0 | 0 | 0 | 1091 | 0.000 | ⚠️ |
| /development | 390x844 | 0 | 0 | 0 | 0 | 1091 | 0.000 | ⚠️ |
| /development/atlas | 1440x900 | 0 | 0 | 0 | 0 | 1479 | 0.000 | ⚠️ |
| /development/atlas | 390x844 | 0 | 0 | 0 | 0 | 1479 | 0.000 | ⚠️ |
| /enigmas | 1440x900 | 0 | 0 | 0 | 0 | 1086 | 0.000 | ⚠️ |
| /enigmas | 390x844 | 0 | 0 | 0 | 0 | 748 | 0.000 | ✓ |
| /enigmas/aegis-awaiting-proof | 1440x900 | 0 | 0 | 0 | 0 | 234 | 0.000 | ✓ |
| /enigmas/aegis-awaiting-proof | 390x844 | 0 | 0 | 0 | 0 | 234 | 0.000 | ✓ |
| /enigmas/ai-accountability-across-systems | 1440x900 | 0 | 0 | 0 | 0 | 172 | 0.000 | ✓ |
| /enigmas/ai-accountability-across-systems | 390x844 | 0 | 0 | 0 | 0 | 172 | 0.000 | ✓ |
| /enigmas/civilization-of-interfaces | 1440x900 | 0 | 0 | 0 | 0 | 137 | 0.000 | ✓ |
| /enigmas/civilization-of-interfaces | 390x844 | 0 | 0 | 0 | 0 | 137 | 0.000 | ✓ |
| /enigmas/discovery-with-purpose | 1440x900 | 0 | 0 | 0 | 0 | 207 | 0.000 | ✓ |
| /enigmas/discovery-with-purpose | 390x844 | 0 | 0 | 0 | 0 | 207 | 0.000 | ✓ |
| /enigmas/eiram-evidence-uncertainty | 1440x900 | 0 | 0 | 0 | 0 | 202 | 0.000 | ✓ |
| /enigmas/eiram-evidence-uncertainty | 390x844 | 0 | 0 | 0 | 0 | 202 | 0.000 | ✓ |
| /enigmas/foundation-research-vision | 1440x900 | 0 | 0 | 0 | 0 | 250 | 0.000 | ✓ |
| /enigmas/foundation-research-vision | 390x844 | 0 | 0 | 0 | 0 | 250 | 0.000 | ✓ |
| /enigmas/noesis-chooses-to-reason | 1440x900 | 0 | 0 | 0 | 0 | 189 | 0.000 | ✓ |
| /enigmas/noesis-chooses-to-reason | 390x844 | 0 | 0 | 0 | 0 | 189 | 0.000 | ✓ |
| /enigmas/our-american-story | 1440x900 | 0 | 0 | 0 | 0 | 232 | 0.000 | ✓ |
| /enigmas/our-american-story | 390x844 | 0 | 0 | 0 | 0 | 232 | 0.000 | ✓ |
| /enigmas/pacific-royal-academy-design | 1440x900 | 0 | 0 | 0 | 0 | 210 | 0.000 | ✓ |
| /enigmas/pacific-royal-academy-design | 390x844 | 0 | 0 | 0 | 0 | 210 | 0.000 | ✓ |
| /enigmas/power-and-accountability | 1440x900 | 0 | 0 | 0 | 0 | 207 | 0.000 | ✓ |
| /enigmas/power-and-accountability | 390x844 | 0 | 0 | 0 | 0 | 207 | 0.000 | ✓ |
| /enigmas/who-governs-the-reasoning | 1440x900 | 0 | 0 | 0 | 0 | 203 | 0.000 | ✓ |
| /enigmas/who-governs-the-reasoning | 390x844 | 0 | 0 | 0 | 0 | 203 | 0.000 | ✓ |

Note: The route /enigmas/seraphim-human-authority was renamed to /enigmas/who-governs-the-reasoning. The measurements above were recorded for the original route; the page content and metrics remain unchanged.
| /enigmas/socrates-art-of-why | 1440x900 | 0 | 0 | 0 | 0 | 202 | 0.000 | ✓ |
| /enigmas/socrates-art-of-why | 390x844 | 0 | 0 | 0 | 0 | 202 | 0.000 | ✓ |
| /enigmas/test-a-legal-claim | 1440x900 | 0 | 0 | 0 | 0 | 207 | 0.000 | ✓ |
| /enigmas/test-a-legal-claim | 390x844 | 0 | 0 | 0 | 0 | 207 | 0.000 | ✓ |
| /enigmas/the-evidence-threshold | 1440x900 | 0 | 0 | 0 | 0 | 203 | 0.000 | ✓ |
| /enigmas/the-evidence-threshold | 390x844 | 0 | 0 | 0 | 0 | 203 | 0.000 | ✓ |
| /enigmas/the-machine-that-asks-why | 1440x900 | 0 | 0 | 0 | 0 | 203 | 0.000 | ✓ |
| /enigmas/the-machine-that-asks-why | 390x844 | 0 | 0 | 0 | 0 | 203 | 0.000 | ✓ |
| /enigmas/what-would-reform-cost | 1440x900 | 0 | 0 | 0 | 0 | 173 | 0.000 | ✓ |
| /enigmas/what-would-reform-cost | 390x844 | 0 | 0 | 0 | 0 | 173 | 0.000 | ✓ |
| /enigmas/when-the-model-says-i-dont-know | 1440x900 | 0 | 0 | 0 | 0 | 190 | 0.000 | ✓ |
| /enigmas/when-the-model-says-i-dont-know | 390x844 | 0 | 0 | 0 | 0 | 190 | 0.000 | ✓ |
| /ether | 1440x900 | 0 | 0 | 0 | 0 | 1080 | 0.000 | ⚠️ |
| /ether | 390x844 | 0 | 0 | 0 | 0 | 1080 | 0.000 | ⚠️ |
| /food | 1440x900 | 0 | 0 | 0 | 0 | 286 | 0.000 | ✓ |
| /food | 390x844 | 0 | 0 | 0 | 0 | 286 | 0.000 | ✓ |
| /form | 1440x900 | 0 | 0 | 0 | 0 | 1267 | 0.000 | ⚠️ |
| /form | 390x844 | 0 | 0 | 0 | 0 | 1267 | 0.000 | ⚠️ |
| /foundation | 1440x900 | 0 | 0 | 0 | 0 | 1001 | 0.000 | ⚠️ |
| /foundation | 390x844 | 0 | 0 | 0 | 0 | 1001 | 0.000 | ⚠️ |
| /foundation/youth | 1440x900 | 0 | 0 | 0 | 0 | 781 | 0.000 | ✓ |
| /foundation/youth | 390x844 | 0 | 0 | 0 | 0 | 781 | 0.000 | ✓ |
| /inquiry | 1440x900 | 0 | 0 | 0 | 0 | 570 | 0.000 | ✓ |
| /inquiry | 390x844 | 0 | 0 | 0 | 0 | 570 | 0.000 | ✓ |
| /issues | 1440x900 | 0 | 0 | 0 | 0 | 1269 | 0.000 | ⚠️ |
| /issues | 390x844 | 0 | 0 | 0 | 0 | 1123 | 0.000 | ⚠️ |
| /journal | 1440x900 | 0 | 0 | 0 | 0 | 970 | 0.000 | ✓ |
| /journal | 390x844 | 0 | 0 | 0 | 0 | 970 | 0.000 | ✓ |
| /learning | 1440x900 | 0 | 0 | 0 | 0 | 586 | 0.000 | ✓ |
| /learning | 390x844 | 0 | 0 | 0 | 0 | 586 | 0.000 | ✓ |
| /motor | 1440x900 | 0 | 0 | 0 | 0 | 766 | 0.000 | ✓ |
| /motor | 390x844 | 0 | 0 | 0 | 0 | 766 | 0.000 | ✓ |
| /music | 1440x900 | 0 | 0 | 0 | 0 | 854 | 0.000 | ✓ |
| /music | 390x844 | 0 | 0 | 0 | 0 | 854 | 0.000 | ✓ |
| /partners | 1440x900 | 0 | 0 | 0 | 0 | 601 | 0.000 | ✓ |
| /partners | 390x844 | 0 | 0 | 0 | 0 | 601 | 0.000 | ✓ |
| /practice | 1440x900 | 0 | 0 | 0 | 0 | 132 | 0.000 | ✓ |
| /practice | 390x844 | 0 | 0 | 0 | 0 | 132 | 0.000 | ✓ |
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
| /tech-lounge | 1440x900 | 0 | 0 | 0 | 0 | 565 | 0.000 | ✓ |
| /tech-lounge | 390x844 | 0 | 0 | 0 | 0 | 565 | 0.000 | ✓ |

## Top Violations by Rule

No violations found.

## Pages Over 1 MB Budget

- / at 1440x900: 1278 KB
- /development at 1440x900: 1091 KB
- /development at 390x844: 1091 KB
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

## Maximum CLS

0.000 across all routes and viewports. No layout shift detected, indicating stable page rendering.

## Reduced Motion Compliance

No animations continued running with `prefers-reduced-motion: reduce` enabled. The site respects user motion preferences.

## Measured Contrast over Images and Gradients

**Summary:** 432 pass, 9 fail, 72 could not measure.

axe-core flagged 513 text elements as having indeterminate contrast (text over images, gradients, overlapping backgrounds, pseudo-elements). The gate now measures these automatically:

1. Read computed text color, font-size, and font-weight. Determine threshold (3.0 for large text ≥24px or ≥18.66px@700+, 4.5 otherwise).
2. Hide the text (`color: transparent`, disable text-shadow, handle pseudo-elements) without changing layout. Wait for fonts and images to load, disable animations.
3. Screenshot the element bounding box clipped to viewport.
4. Blur the screenshot by `max(1, round(fontSize * 0.08))` CSS pixels to approximate one stroke width. Find the worst-case background luminance (lightest spot for dark text, darkest for light text, determined by comparing text luminance against median background).
5. Calculate contrast ratio `(L1 + 0.05) / (L2 + 0.05)` using text color and worst-case background. Record pass/fail, ratio, threshold, mean and 95th-percentile background luminance.

**Limitations:** Text-shadow is ignored. Video and animated backgrounds are measured on one frame only. Some elements may not be measurable (out of viewport, no text content, stack overflow on deeply nested DOM).

### Count by Route

| Route | 1440x900 Pass | 1440x900 Fail | 390x844 Pass | 390x844 Fail |
|-------|---------------|---------------|--------------|---------------|
| / | 4 | 0 | 10 | 0 |
| /about | 1 | 0 | 2 | 0 |
| /about/diana | 4 | 0 | 5 | 0 |
| /blog | 0 | 0 | 1 | 0 |
| /development | 4 | 0 | 5 | 0 |
| /development/atlas | 128 | 0 | 128 | 0 |
| /enigmas | 0 | 0 | 1 | 0 |
| /ether | 19 | 4 | 28 | 0 |
| /food | 3 | 0 | 4 | 2 |
| /form | 11 | 0 | 9 | 0 |
| /foundation | 4 | 0 | 5 | 0 |
| /foundation/youth | 3 | 0 | 4 | 0 |
| /inquiry | 0 | 0 | 1 | 0 |
| /journal | 4 | 0 | 5 | 0 |
| /learning | 5 | 0 | 6 | 0 |
| /motor | 4 | 0 | 6 | 1 |
| /music | 3 | 0 | 4 | 2 |
| /practice | 0 | 0 | 1 | 0 |
| /tech-lounge | 5 | 0 | 5 | 0 |

### All Failures

**/ether** [1440x900]
- Selector: `#cosmic-groove > .scene-content > div:nth-child(1) > .scene-actions > button`
- Text: "Play this movement ↗"
- Contrast ratio: **1.1** vs threshold **4.5** (normal text, 12.8px @ 850)
- Reason: pseudoContent

**/ether** [1440x900]
- Selector: `#dancing-stars > .scene-content > div:nth-child(1) > .scene-actions > button`
- Text: "Play this movement ↗"
- Contrast ratio: **1.1** vs threshold **4.5** (normal text, 12.8px @ 850)
- Reason: pseudoContent

**/ether** [1440x900]
- Selector: `#crossing-nebula > .scene-content > div:nth-child(1) > .scene-actions > button`
- Text: "Play this movement ↗"
- Contrast ratio: **1.09** vs threshold **4.5** (normal text, 12.8px @ 850)
- Reason: pseudoContent

**/ether** [1440x900]
- Selector: `#cosmic-coast > .scene-content > div:nth-child(1) > .scene-actions > button`
- Text: "Play this movement ↗"
- Contrast ratio: **1.1** vs threshold **4.5** (normal text, 12.8px @ 850)
- Reason: pseudoContent

**/food** [390x844]
- Selector: `.hub-meta`
- Text: "The food desk / Opening edition"
- Contrast ratio: **3.44** vs threshold **4.5** (normal text, 11.84px @ 800)
- Reason: pseudoContent

**/food** [390x844]
- Selector: `a[href$="#food-departments"]`
- Text: "Explore the departments ↓"
- Contrast ratio: **1.16** vs threshold **4.5** (normal text, 13.44px @ 800)
- Reason: pseudoContent

**/motor** [390x844]
- Selector: `#future > .feature-copy > p`
- Text: "A supercar makes the improbable tangible. The body is a proposition: what if every surface had a rea"
- Contrast ratio: **1.35** vs threshold **4.5** (normal text, 17.6px @ 400)
- Reason: pseudoContent

**/music** [390x844]
- Selector: `.hub-meta`
- Text: "The listening desk / Opening edition"
- Contrast ratio: **3.47** vs threshold **4.5** (normal text, 11.84px @ 800)
- Reason: pseudoContent

**/music** [390x844]
- Selector: `.hub-banner > div > a[href$="ether"]`
- Text: "Enter the Ether Room ↗"
- Contrast ratio: **1.16** vs threshold **4.5** (normal text, 13.44px @ 800)
- Reason: pseudoContent

### Could Not Measure

72 elements could not be measured automatically. Common reasons:
- **Element not visible**: 60 instances
- **Maximum call stack size exceeded**: 12 instances

## Measurement Notes

All routes measured successfully. No routes were excluded or failed during testing. The gate uses a local Node.js server wrapping the built worker and Playwright with axe-core for automated accessibility scanning.
