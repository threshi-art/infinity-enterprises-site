# Accessibility and Performance Baseline

**Date:** 2026-09-28
**Commit:** bf5065071e895120dd106bd59fa15c8e39bc9594
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
| /enigmas/seraphim-human-authority | 1440x900 | 0 | 0 | 0 | 0 | 203 | 0.000 | ✓ |
| /enigmas/seraphim-human-authority | 390x844 | 0 | 0 | 0 | 0 | 203 | 0.000 | ✓ |
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

## Needs Manual Review (color-contrast incomplete)

axe-core could not automatically determine contrast for 513 text elements (text over images, gradients, pseudo-elements). These require manual inspection.

### Count by Route

| Route | 1440x900 | 390x844 |
|-------|----------|----------|
| / | 10 | 10 |
| /about | 2 | 2 |
| /about/diana | 5 | 5 |
| /blog | 0 | 5 |
| /daily-desk | 0 | 2 |
| /development | 5 | 5 |
| /development/atlas | 130 | 130 |
| /enigmas | 0 | 1 |
| /ether | 28 | 28 |
| /food | 4 | 7 |
| /form | 11 | 9 |
| /foundation | 5 | 5 |
| /foundation/youth | 8 | 8 |
| /inquiry | 0 | 4 |
| /journal | 5 | 9 |
| /learning | 6 | 6 |
| /motor | 13 | 13 |
| /music | 4 | 8 |
| /practice | 0 | 4 |
| /tech-lounge | 7 | 9 |

### Elements by Route

**/** (10 at 1440x900):
- `.splash-kicker` [bgGradient] - "Infinity Enterprises · September 2026"
- `.splash-kicker > span` [other] - "·"
- `.splash-orbit` [other] - "∞"
- `.splash-wordmark` [bgOverlap] - "INFINITY"
- `.splash-edition` [bgOverlap] - "INTELLIGENCE / RESEARCH / CULTURE"
  ...and 5 more

**/about** (2 at 1440x900):
- `.about-hero-inner > .kicker` [pseudoContent] - "02 / About"
- `h1` [pseudoContent] - "Thought intostructure."

**/about/diana** (5 at 1440x900):
- `.cue[href$="about"]` [pseudoContent] - "← About the Enterprise"
- `.diana-hero-content > .kicker` [pseudoContent] - "Infinity Enterprises / For my mother"
- `#diana-title` [pseudoContent] - "Diana."
- `.diana-hero-content > p` [pseudoContent] - "A name carried through ancient stories. A life tha..."
- `.cue[href$="#name"]` [pseudoContent] - "Read her story ↓"

**/blog** (0 at 1440x900):

**/daily-desk** (0 at 1440x900):

**/development** (5 at 1440x900):
- `.hero-copy > .kicker` [pseudoContent] - "Infinity Enterprises / The working issue"
- `#page-title` [pseudoContent] - "Work inmotion."
- `em` [pseudoContent] - "motion."
- `.hero-copy > p` [pseudoContent] - "Some ideas are already running. Some are being tes..."
- `.hero-link` [pseudoContent] - "Explore the projects ↓"

**/development/atlas** (130 at 1440x900):
- `article[data-field="AI"]:nth-child(1) > .card-top > .index` [bgGradient] - "01"
- `article[data-field="AI"]:nth-child(1) > .card-top > .stage` [bgGradient] - "Active build"
- `article[data-field="AI"]:nth-child(1) > h3` [bgGradient] - "Seraphim & EiRAM"
- `article[data-field="AI"]:nth-child(1) > .desc` [bgGradient] - "A governed AI platform and evidence analysis engin..."
- `article[data-field="AI"]:nth-child(1) > .card-bottom > .discipline` [bgGradient] - "AI systems architecture"
  ...and 125 more

**/enigmas** (0 at 1440x900):

**/ether** (28 at 1440x900):
- `#cosmic-groove > .scene-content > div:nth-child(1) > .scene-no` [pseudoContent] - "01 / Arrival · 00:00"
- `#cosmic-groove > .scene-content > div:nth-child(1) > h2` [pseudoContent] - "CosmicGroove"
- `#cosmic-groove > .scene-content > div:nth-child(1) > p` [pseudoContent] - "Warm bass, slow orbit. The door opens somewhere be..."
- `#cosmic-groove > .scene-content > div:nth-child(1) > .scene-actions > button` [pseudoContent] - "Play this movement ↗"
- `#cosmic-groove > .scene-content > div:nth-child(1) > .scene-actions > a[target="_blank"][rel="noopener noreferrer"]` [pseudoContent] - "Open on YouTube ↗"
  ...and 23 more

**/food** (4 at 1440x900):
- `.hub-meta` [pseudoContent] - "The food desk / Opening edition"
- `div > h2` [pseudoContent] - "A table is a world."
- `div > p` [pseudoContent] - "Every plate has a history. Every good recipe begin..."
- `a[href$="#food-departments"]` [pseudoContent] - "Explore the departments ↓"

**/form** (11 at 1440x900):
- `strong` [other] - "FORM"
- `.identity > span` [other] - "Martial arts / A visual meditation"
- `#music-toggle` [other] - "Sound on"
- `a` [other] - "Exit ↗"
- `.overline` [other] - "01 / The practice"
  ...and 6 more

**/foundation** (5 at 1440x900):
- `.hero-content > .eyebrow` [pseudoContent] - "Infinity Enterprises / A charitable vision"
- `#title` [pseudoContent] - "The InfinityFoundation."
- `em` [pseudoContent] - "Foundation."
- `.hero-content > p` [pseudoContent] - "Research that asks harder questions. Education tha..."
- `small` [pseudoContent] - "Proposed nonprofit initiative / In development"

**/foundation/youth** (8 at 1440x900):
- `.hero-copy > .eyebrow` [pseudoContent] - "The Infinity Foundation / Helping Youth"
- `#page-title` [pseudoContent] - "A futureworth giving."
- `em` [pseudoContent] - "worth giving."
- `.hero-copy > p` [pseudoContent] - "Care for children who need stability. An academy b..."
- `#academy > .wrap > .eyebrow` [pseudoContent] - "02 / The academic center"
  ...and 3 more

**/inquiry** (0 at 1440x900):

**/journal** (5 at 1440x900):
- `.mast-row > div:nth-child(1) > .eyebrow` [bgGradient] - "Infinity Enterprises / Research Journal"
- `#journal-title` [bgGradient] - "Ideas underexamination."
- `em` [bgGradient] - "examination."
- `.mast-note` [bgGradient] - "Volume 01 / Working notesResearch highlights from ..."
- `strong` [bgGradient] - "Volume 01 / Working notes"

**/learning** (6 at 1440x900):
- `.mast-inner > div:nth-child(1) > .eyebrow` [pseudoContent] - "Infinity Enterprises / Learning Center"
- `#title` [pseudoContent] - "Learn thenext language."
- `em` [pseudoContent] - "next language."
- `.mast-inner > div:nth-child(1) > p` [pseudoContent] - "Process, Tools, and Skills for an Agentic World."
- `.edition` [pseudoContent] - "A working referenceFollow a method. Learn the tool..."
  ...and 1 more

**/motor** (13 at 1440x900):
- `.hero-copy > .label` [pseudoContent] - "Infinity Enterprises / Automotive edition 01"
- `#motor-title` [pseudoContent] - "Objects of motionMOTOR"
- `#motor-title > span` [pseudoContent] - "Objects of motion"
- `.hero-bottom > p` [pseudoContent] - "Some machines take us places. Others make us want ..."
- `a[href$="#opening"]` [pseudoContent] - "Enter the exhibition ↓"
  ...and 8 more

**/music** (4 at 1440x900):
- `.hub-meta` [pseudoContent] - "The listening desk / Opening edition"
- `div > h2` [pseudoContent] - "Follow the frequency."
- `.hub-banner > div > p` [pseudoContent] - "Scroll through image, rhythm, and atmosphere in th..."
- `.hub-banner > div > a[href$="ether"]` [pseudoContent] - "Enter the Ether Room ↗"

**/practice** (0 at 1440x900):

**/tech-lounge** (7 at 1440x900):
- `.shell > .micro` [pseudoContent] - "Infinity Enterprises / Tech culture"
- `#lounge-title` [pseudoContent] - "Tech@Lounge."
- `.cover > .shell > p` [pseudoContent] - "A room for the machines, ideas, and strange future..."
- `.jump` [pseudoContent] - "Enter the lounge ↓"
- `.issue-strip > span:nth-child(1)` [pseudoContent] - "Volume 01 / After hours"
  ...and 2 more

### Common Reasons

- **bgGradient**: 283 instances
- **pseudoContent**: 173 instances
- **other**: 54 instances
- **bgOverlap**: 3 instances

## Measurement Notes

All routes measured successfully. No routes were excluded or failed during testing. The gate uses a local Node.js server wrapping the built worker and Playwright with axe-core for automated accessibility scanning.
