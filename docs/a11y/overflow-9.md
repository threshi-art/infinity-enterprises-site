# Mobile Horizontal Overflow Fix (Issue #9)

## Summary

Fixed horizontal overflow on mobile viewports (320px and 390px) across all sitemap pages. The root cause was large display headings containing single long words that couldn't wrap, extending beyond the viewport width.

## Root Cause

Two pages had horizontal overflow:

### 1. /enigmas (414px at 390px viewport, 373px at 320px viewport)

**Offending element:** `.masthead h1 em` containing the text "Enigmas"

**Measurement:** The `<em>Enigmas</em>` element had `rectRight: 413.8px` on a 390px viewport, causing 24px overflow.

**Cause:** The heading used `font: 400 clamp(3.5rem,16vw,5.5rem)/.88 Georgia,serif` (from the `@media(max-width:660px)` breakpoint), which at 390px evaluates to 62.4px. The word "Enigmas" with this font size and letter-spacing (`-.085em`) didn't wrap and extended past the viewport.

**Technical details:**
- Computed font-size: 62.4px
- white-space: normal
- No overflow-wrap property set
- The word "Enigmas" is unbreakable without explicit wrapping

### 2. /blog (437px at 390px viewport, 436px at 320px viewport)

**Offending element:** `.hub-hero h1` containing "Agentic@Enigmas."

**Measurement:** The H1's scrollWidth was 414px, but the section.hub-hero scrollWidth was 437px, indicating the heading content extended beyond the viewport.

**Cause:** The heading used `font: 400 clamp(3.9rem,9vw,9.5rem)/.95 Georgia,serif`, which at 390px evaluates to 62.4px (3.9rem). The text "Agentic@Enigmas." at this size couldn't wrap properly.

**Technical details:**
- Computed font-size: 62.4px
- white-space: normal
- No overflow-wrap property set
- The compound word "Agentic@Enigmas" is difficult to break without explicit wrapping

## Fix Applied

Added `overflow-wrap: anywhere` to the affected heading styles. This CSS property allows the browser to break long unbreakable strings at any character to prevent overflow.

### Changes Made

**File:** `src/publication.css`
- Added `overflow-wrap:anywhere` to `.hub-hero h1`

**File:** `src/enigmas.html`
- Added `overflow-wrap:anywhere` to `.masthead h1`

### Why `overflow-wrap: anywhere`

- **overflow-wrap: anywhere** - Allows breaks within words if no otherwise acceptable break points in the line. This is the most aggressive wrapping and prevents overflow in all cases.
- **Alternative considered:** `overflow-wrap: break-word` - Similar but only breaks if the word would overflow, preserving word boundaries when possible. `anywhere` is more reliable for preventing overflow.
- **Not used:** Reducing font-size further would compromise the design intent.
- **Not used:** `word-break: break-all` - Too aggressive, breaks mid-word even when not necessary.

## Verification

### Before Fix

| Route | Width | scrollWidth | clientWidth | Overflow |
|-------|-------|-------------|-------------|----------|
| /blog | 320px | 436px | 320px | 116px |
| /blog | 390px | 437px | 390px | 47px |
| /enigmas | 320px | 373px | 320px | 53px |
| /enigmas | 390px | 414px | 390px | 24px |

### After Fix

| Route | Width | scrollWidth | clientWidth | Overflow |
|-------|-------|-------------|-------------|----------|
| /blog | 320px | 320px | 320px | 0px |
| /blog | 390px | 390px | 390px | 0px |
| /enigmas | 320px | 320px | 320px | 0px |
| /enigmas | 390px | 390px | 390px | 0px |

### All Routes Summary

**Before:** 2 routes failing (2 at 390px, 2 at 320px)  
**After:** 0 routes failing (0 at 390px, 0 at 320px)

All 48 sitemap routes now pass the test: `scrollWidth === clientWidth` at both 320px and 390px.

## Desktop Verification

Confirmed that the 1440px desktop layout on /, /enigmas, and /blog remains visually unchanged:

- The `overflow-wrap: anywhere` property only affects layout when text would otherwise overflow
- At 1440px, the headings have ample space and natural line breaks occur at word boundaries
- No visual regression observed

## Evidence

Screenshots at `/opt/cursor/artifacts/overflow-9/`:
- `enigmas-390-after.png` - /enigmas at 390px after fix
- `enigmas-1440-after.png` - /enigmas at 1440px after fix (desktop unchanged)
- `blog-390-after.png` - /blog at 390px after fix

## What the Previous Attempt Got Wrong

The previous attempt incorrectly identified links INSIDE `.room-bar` and `.dept-index` as offenders. However, these elements have `overflow-x: auto`, which means their children are clipped within a scrollable container and cannot widen the page. The real offenders were the large display headings in the main content area, found through bisection by hiding each child of `<body>` and recursively narrowing down to the specific element causing overflow.

## Acceptance Criteria Met

- ✅ `scrollWidth === clientWidth` at 390px and 320px on every sitemap page (48/48 routes pass)
- ✅ Contents button fully visible and opens the panel within the viewport
- ✅ Desktop 1440px header unchanged (verified on /, /enigmas, /blog)
- ✅ `npm ci && npm run build` passes
- ✅ No use of `overflow-x: hidden` on html or body
- ✅ No content hidden or navigation removed
- ✅ Minimal CSS change at the source (single property addition per affected selector)

## Commit Details

Fixed mobile horizontal overflow by adding `overflow-wrap: anywhere` to large display headings in `.hub-hero h1` (publication.css) and `.masthead h1` (enigmas.html). This allows long unbreakable words to wrap within the viewport on mobile devices.

Refs #9

## Follow-up: Preventing Mid-Word Breaks (Commit f6fbd12 → TBD)

The initial fix (f6fbd12) successfully eliminated horizontal overflow but caused visible mid-word breaks in the masthead: "Agentic@Enigm / as" on /enigmas and "Agentic@Enig / mas." on /blog.

### Changes Made

1. **Added `<wbr>` tags** for natural break points:
   - `/enigmas`: Changed `<h1>Agentic@<em>Enigmas</em></h1>` to `<h1>Agentic@<wbr><em>Enigmas</em></h1>`
   - `/blog`: Modified `shell()` function in `src/publication-pages.mjs` to insert `<wbr>` after "@" in "Agentic@Enigmas"

2. **Reduced minimum font sizes** to prevent word breaking:
   - `.masthead h1`: Changed from `clamp(4.1rem, 10vw, 10rem)` to `clamp(3rem, 10vw, 10rem)`
   - `.masthead h1` at 660px breakpoint: Changed from `clamp(3.5rem, 16vw, 5.5rem)` to `clamp(2.8rem, 16vw, 5.5rem)`
   - `.hub-hero h1`: Changed from `clamp(3.9rem, 9vw, 9.5rem)` to `clamp(3rem, 9vw, 9.5rem)`

3. **Kept `overflow-wrap: anywhere`** as a safety net

### Verification Results

**ScrollWidth tests at 320px, 360px, 390px, 430px:**
- All 48 sitemap routes: `scrollWidth === clientWidth` ✓

**Word wrapping tests:**
- `/enigmas .masthead h1`: No words wrapped at any tested width ✓
- `/blog .hub-hero h1`: No words wrapped at any tested width ✓
- Verified using Range.getClientRects() - all words have exactly 1 rect

**Desktop 1440px consistency:**
- `/enigmas`: fontSize 144px, bounding box 1376×127px (unchanged)
- `/blog`: fontSize 129.6px, bounding box 1100×123px (unchanged)

### Note on Earlier 408px Measurements

The original issue description mentioned "most other pages and all articles 408px" at 390px. This measurement was taken without mobile emulation (`isMobile: false`), which renders a desktop scrollbar. The desktop layout uses `100vw` elements that include the scrollbar width (~18px), causing the apparent overflow. With proper mobile emulation (`isMobile: true, hasTouch: true`), those pages already passed at 390px in the initial measurement and were not affected by this fix.

### Evidence

Screenshots were captured at 320px and 390px for /enigmas and /blog during verification, showing natural line breaks after the '@' symbol. All 48 sitemap routes were tested with mobile emulation (`isMobile: true, hasTouch: true`) to ensure scrollWidth === clientWidth at all tested widths.

All headings now break at "Agentic@" / "Enigmas" instead of mid-word, preserving the design intent while maintaining no horizontal overflow.
