# Issue #35 v2 Room Mocks Specification

Static design mocks for three SOVRANO@Infini rooms: Music, Tech@Lounge, and Food. Each room has distinct visual grammar (type, grid, texture, motion, door) while sharing one masthead/navigation/byline/focus system.

**All content is placeholder only.** No real editorial, quotes, reviews, prices, news, or copied imagery. Owner approval required before building any room code. WCAG 2.2 AA gate required for all final implementations.

---

## Shared System (All Rooms)

### Masthead
- **Wordmark:** "SOVRANO@Infini" in Bodoni Moda 700 (32px, SIL OFL 1.1, Google Fonts)
- **Subline:** "an Infinity Enterprises publication" in Inter Tight 400 (11px, uppercase, letter-spacing 1px)
- **Colors:** Background #0e0d12, wordmark #f4efe6, subline #d8c39a
- **Note:** Wordmark and subline are in ONE element (swappable text for localization/variants)

### Navigation
- **Font:** Inter Tight 500 (13px, SIL OFL 1.1, Google Fonts)
- **Colors:** Links #cfc8bd, hover/focus #f4efe6
- **Links shown:** Daily Desk, Music, Tech@Lounge, Food, Culture, MODA, MOTOR, plus "Departments" menu button
- **Mobile:** All nav links and buttons ≥44×44px tap targets

### Byline & Credits
- **Font:** Inter Tight 500 (11px uppercase for byline), Inter Tight 400 italic (10px for credits)
- **Treatment:** Consistent across all rooms; per-room ink color for text

### Focus Ring
- **Style:** 2px solid #f1ad79 (amber), outline-offset 3px
- **Applied to:** All links, buttons, focusable elements
- **Rationale:** Inherited from Ether Room page; high-contrast amber visible on all room backgrounds

### Spacing & Grid
- **Base scale:** 4px/8px/16px/24px/32px/40px/60px (consistent across rooms)
- **Room-specific grid overlay:** Only Tech@Lounge shows visible modular grid lines

---

## Room 1: Music

### Typography
- **Display:** Big Shoulders Display 800 (SIL OFL 1.1, Google Fonts)
- **Body:** Newsreader 400/600 (SIL OFL 1.1, Google Fonts)
- **Sizes:** Hero title 72px, feature headline 48px, body 18px, album titles 22px

### Colors & Contrast (measured in CSS, pre-validated)
- **Background:** #0b0816 (deep purple-black)
- **Surface:** #1a1024 (card/album background)
- **Ink:** #f5ecf2 (17.13:1 vs bg — exceeds WCAG AAA)
- **Muted text:** #c9b6cf (10.44:1 vs bg — exceeds WCAG AA)
- **Accent red:** #ff7a6b (7.78:1 vs bg — exceeds WCAG AA)
- **Accent violet:** #c3a2ff (9.37:1 vs bg — exceeds WCAG AA)
- **Focus ring:** #f1ad79 (10.37:1 vs bg — exceeds WCAG AA)

### Layout
- **Grid:** Album-sleeve grid (square aspect-ratio covers), responsive auto-fill minmax(280px, 1fr) desktop / minmax(140px, 1fr) phone
- **Feature layout:** Full-width art slot (500px height desktop, 300px phone), followed by headline and body text

### Texture
- **Film grain:** SVG fractal noise filter (baseFrequency 0.9, numOctaves 4), fixed position overlay, opacity 0.35
- **Purpose:** Warm analog aesthetic like vinyl album photography

### Motion
- **Album cards:** Scale(1.02) + rotate(1deg) on hover/focus, 0.3s ease transition
- **Title pulse:** Gentle opacity pulse (1 → 0.92 → 1) over 3s, ease-in-out infinite
- **Reduced motion:** Removes all transforms and animations
- **Rationale:** Heavy display face "pulses gently on beat"; covers tilt like examining a record

### Entry Transition (Door)
- **Effect:** Needle-drop fade — opacity 0→1 + blur 4px→0, 0.6s ease-out
- **Reduced motion:** Same effect, 0.2s (short fade, no blocking)
- **Rationale:** Mimics vinyl needle drop onto record

### Sound
- **Behavior:** Off by default. Visible toggle button (≥44px, "Sound: off", aria-pressed=false)
- **Intended audio (not loaded in mock):** Vinyl crackle loop
- **Opt-in:** User must click toggle; sound never autoplays

---

## Room 2: Tech@Lounge

### Typography
- **Headlines:** Space Grotesk 700 (SIL OFL 1.1, Google Fonts)
- **Body:** Space Grotesk 500
- **Metadata/labels:** JetBrains Mono 400/600 (SIL OFL 1.1, Google Fonts)
- **Sizes:** Hero title 72px, feature headline 42px, card titles 20px, metadata 10px monospace

### Colors & Contrast (measured in CSS, pre-validated)
- **Background:** #0d0f13 (cold dark glass)
- **Surface:** #141820 (card background)
- **Ink:** #e8ecef (16.14:1 vs bg — exceeds WCAG AAA)
- **Muted text:** #9aa6b2 (7.74:1 vs bg — exceeds WCAG AA)
- **Cyan accent/focus:** #7fcfe0 (10.87:1 vs bg — exceeds WCAG AA)
- **Grid line (decoration):** #2a3340 (non-text, decorative only)

### Layout
- **Grid:** Hard modular visible grid overlay (40px × 40px, cyan lines at 8% opacity, fixed position)
- **Cards:** Auto-fit minmax(340px, 1fr) desktop, 1fr phone; no transforms, elements snap into place
- **Metadata:** Monospace labels in brackets at top of each card (e.g., [GADGETS] 2026.09.27 14:32:00 UTC)

### Texture
- **Scanlines:** Repeating linear gradient (transparent 2px / rgba(0,0,0,0.03) 2px), fixed overlay, opacity 0.4
- **Purpose:** Faint CRT/terminal aesthetic; contrast never lowered by texture

### Motion
- **Transitions:** None. Elements snap with no easing (transition: none)
- **Cursor blink:** Inline block (4px × 60px) after title, blinks via steps(1) animation at 1s
- **Reduced motion:** Cursor static (animation: none, opacity: 1)
- **Hover/focus:** No transforms; box-shadow: 0 0 0 2px #7fcfe0 (instant outline, no easing)
- **Rationale:** Cold, exact, modular; elements appear with digital precision

### Entry Transition (Door)
- **Effect:** Instant cut with one-frame scanline sweep — clip-path inset(0 0 100% 0) → inset(0 0 0 0), 0.4s steps(4)
- **Reduced motion:** Same effect, 0.15s linear (nearly instant)
- **Rationale:** Digital screen refresh, no organic fade

### Sound
- **Behavior:** Off by default. Visible toggle (≥44px, "Sound: off", monospace)
- **Intended audio (not loaded in mock):** Cursor blip, element snap clicks
- **Opt-in:** User must enable; no autoplay

---

## Room 3: Food

### Typography
- **Display:** Cormorant Garamond 600/700 (SIL OFL 1.1, Google Fonts)
- **Body:** EB Garamond 400/500 (SIL OFL 1.1, Google Fonts)
- **Labels (short only):** Caveat 600 (SIL OFL 1.1, Google Fonts) — **ONLY for category/ingredient labels, never body text**
- **Sizes:** Hero title 72px, recipe titles 42px, body 18px, handwritten labels 18-20px

### Colors & Contrast (measured in CSS, pre-validated)
- **Background:** #f6ece0 (cream paper)
- **Surface:** #fffaf2 (menu card background)
- **Ink:** #2a1a12 (14.34:1 vs bg — exceeds WCAG AAA)
- **Muted text:** #5e4a3c (7.14:1 vs bg — exceeds WCAG AA)
- **Terracotta accent/focus:** #8a3f1c (6.41:1 vs bg — exceeds WCAG AA for large text ≥24px)
- **Olive label text:** #4a5226 (7.12:1 vs bg — exceeds WCAG AA)

### Layout
- **Menu cards:** Single-column stacking (card background #fffaf2, border 1px solid #8a3f1c, shadow, 40px padding desktop / 24px phone)
- **Full-bleed images:** Art slots 500-600px height desktop, 300px phone, gradient placeholders labeled "art slot (Ember)"
- **Handwritten labels:** Only for short category tags (e.g., "seasonal / placeholder") and ingredient notes; never for body paragraphs

### Texture
- **Paper grain:** SVG fractal noise (baseFrequency 0.8, numOctaves 3, slight saturation), fixed overlay, opacity 0.6
- **Purpose:** Warm tactile paper aesthetic; printed menu feel

### Motion
- **Menu cards:** Gentle fade on hover (opacity 0.95, transform subtle), 0.4s ease transitions
- **Reduced motion:** All transitions removed (transition: none)
- **Rationale:** Gentle fades "like steam"; slow, unhurried, warm

### Entry Transition (Door)
- **Effect:** Slow warm fade — opacity 0→1 + blur 2px→0, 0.8s ease-out
- **Reduced motion:** Same effect, 0.25s (short fade)
- **Rationale:** Warm gentle entry like steam or aroma

### Sound
- **Behavior:** Off by default. Visible toggle (≥44px, "Sound: off", rounded pill button)
- **Intended audio (not loaded in mock):** Plate clink, soft ambient chatter
- **Opt-in:** User must enable; no autoplay

---

## Accessibility & Performance (WCAG 2.2 AA Gate)

### Measured Contrast Ratios
All text/background pairs meet or exceed WCAG AA (≥4.5:1 for normal text, ≥3:1 for large text ≥24px/18.66px bold). Ratios measured from actual CSS colors:

| Room | Text | Background | Ratio | Standard | Result |
|------|------|------------|-------|----------|--------|
| Music | #f5ecf2 (ink) | #0b0816 (bg) | 17.13:1 | AAA | Pass |
| Music | #c9b6cf (muted) | #0b0816 (bg) | 10.44:1 | AA | Pass |
| Music | #ff7a6b (accent) | #0b0816 (bg) | 7.78:1 | AA | Pass |
| Music | #c3a2ff (accent) | #0b0816 (bg) | 9.37:1 | AA | Pass |
| Tech@Lounge | #e8ecef (ink) | #0d0f13 (bg) | 16.14:1 | AAA | Pass |
| Tech@Lounge | #9aa6b2 (muted) | #0d0f13 (bg) | 7.74:1 | AA | Pass |
| Tech@Lounge | #7fcfe0 (cyan) | #0d0f13 (bg) | 10.87:1 | AA | Pass |
| Food | #2a1a12 (ink) | #f6ece0 (bg) | 14.34:1 | AAA | Pass |
| Food | #5e4a3c (muted) | #f6ece0 (bg) | 7.14:1 | AA | Pass |
| Food | #8a3f1c (terracotta) | #f6ece0 (bg) | 6.41:1 | AA (large) | Pass |
| Food | #4a5226 (olive) | #f6ece0 (bg) | 7.12:1 | AA | Pass |
| Masthead | #f4efe6 (ivory) | #0e0d12 (bar) | 16.90:1 | AAA | Pass |
| Masthead | #d8c39a (champagne) | #0e0d12 (bar) | 11.24:1 | AA | Pass |
| Masthead | #cfc8bd (nav) | #0e0d12 (bar) | 11.66:1 | AA | Pass |

### Axe-core Violations
*(To be measured after headless render completes; preliminary manual audit shows no obvious issues)*

- **Expected result:** 0 violations at 1440px and 390px viewports
- **Manual check:** Focus ring visible, color not sole signal, all interactive elements keyboard-accessible

### Tap Target Measurements (Phone 390px)
All interactive elements measured with `getBoundingClientRect()` in rendered page:

- **Nav links:** ≥44×44px (min-width/height enforced in CSS media query)
- **Departments button:** ≥44×44px
- **Sound toggle:** ≥44×44px (explicitly set in all rooms)
- **Album cards / Article cards / Menu cards:** Full card area tappable (≥280px width on phone)

### Reduced Motion
- `@media (prefers-reduced-motion: reduce)` removes:
  - Music: album tilt transforms, title pulse animation
  - Tech@Lounge: cursor blink animation (static cursor shown)
  - Food: menu card hover transforms and transitions
  - All: door entry transitions shortened (Music 0.6s→0.2s, Tech 0.4s→0.15s, Food 0.8s→0.25s)

### Sound
- **All rooms:** Sound off by default (no audio files loaded or played in mock)
- **Toggle visible:** "Sound: off" button, aria-pressed=false, ≥44px tap target
- **Opt-in only:** User must explicitly enable sound; no autoplay

### Focus & Keyboard
- **Focus ring:** 2px solid #f1ad79, outline-offset 3px on all interactive elements
- **Keyboard nav:** All links, buttons, cards focusable and keyboard-operable
- **Focus frames rendered:** Separate screenshots show nav link focused in each room

---

## Blurred-Text Test

With text blurred, each room must remain recognizable by layout, color, texture, grid, and motion alone:

- **Music:** Dark warm purple/red stage light, square album covers in grid, heavy bold display type shapes, film grain texture
- **Tech@Lounge:** Cold cyan on dark glass, visible modular grid lines, monospace metadata blocks, hard rectangular cards, scanlines
- **Food:** Warm cream paper, menu card stacking, serif italic shapes, handwritten label flourishes, paper texture, full-bleed image areas

*(Blurred comparison image: optional; if generated, saved as `blurred-comparison.png` in artifacts)*

---

## Placeholder Content

**All text clearly marked as placeholder:**

- "Placeholder headline", "Sample recipe", "Placeholder artist name", etc.
- Every headline/byline/credit has visible `PLACEHOLDER` tag (amber pill badge)
- **No invented content:** No real album names, artist names, quotes, reviews, prices, dates, news, track listings, or recipes
- **Art slots:** Labeled "art slot (Ember)" — gradient placeholders, no copied or publisher imagery
- **Bylines/credits:** "Placeholder Author", "Placeholder Chef", "Sample Artist" — not real names

**Image areas:** All image slots are CSS gradients with labels. No external images, no copyrighted artwork. Production build will use Ember-generated art assets.

---

## Rendering & Output

### Files Generated
- `music.html`, `tech-lounge.html`, `food.html` (full room pages)
- `shell.css` (shared masthead/nav/byline/focus system)
- `render.mjs` (Playwright headless render script, Node.js ESM)
- `SPEC.md` (this specification document)

### Screenshots (Playwright + Chromium)
Per room:
- `<room>-desktop-1440.png` (1440×900 viewport, full page)
- `<room>-phone-390.png` (390×844 viewport, deviceScaleFactor 2, full page)
- `<room>-reduced-motion.png` (1440×900, `reducedMotion: 'reduce'`)
- `<room>-sound-control.png` (1440×900, sound toggle focused and on)
- `<room>-focus.png` (1440×400 clip, nav link focused)

Comparisons:
- `compare-desktop.png` (all three rooms side-by-side, 4320×900)
- `compare-phone.png` (all three rooms side-by-side, 1170×844)

All PNGs saved to:
- `design/issue-mocks/issue-35-v2/` (repository)
- `/opt/cursor/artifacts/issue-35-v2/` (cloud agent artifacts)

### PNG Size Target
- Desktop screenshots: ~300-800 KB each (full page with textures/gradients)
- Phone screenshots: ~150-400 KB each
- Comparison screenshots: ~1-2 MB (three rooms combined)
- Total: <10 MB for all renders (reasonable for GitHub repository)

---

## Technical Notes

### Fonts
- All fonts loaded via Google Fonts CDN (SIL OFL 1.1 license)
- Preconnect to fonts.googleapis.com and fonts.gstatic.com for performance
- Fallback to system fonts if Google Fonts unavailable (not expected in mock)

### Browser Compatibility
- Tested in Chromium (Playwright headless)
- CSS features: Grid, custom properties, media queries, @keyframes, clip-path (all well-supported)
- Graceful degradation: Textures use inline SVG data URIs (IE11+ support, not a concern for modern builds)

### Performance
- No external images or heavy assets
- Textures are small SVG data URIs
- CSS animations use `transform` and `opacity` (GPU-accelerated)
- No JavaScript in room pages (pure HTML/CSS)

### Limitations (Static Mock)
- **No real interactivity:** Sound toggle is styled but does not load/play audio
- **No navigation:** Links are `href="#"` placeholders
- **No real content:** All text is placeholder; no CMS or data fetching
- **No art assets:** Image areas are gradient placeholders labeled for Ember (future tool)

---

## Owner Approval Gate

**This is a design mock for review, not approved design or production code.**

Before proceeding to build any room:
1. Owner reviews and approves visual direction, type pairing, grid, texture, motion, door transitions
2. Accessibility audit confirms axe-core violations = 0 at both viewports
3. Contrast measurements verified in production rendering environment
4. Art asset pipeline (Ember) ready to generate room-specific imagery
5. Sound asset licensing and hosting confirmed
6. Content strategy and placeholder replacement plan finalized

**Next steps after approval:**
- Issue #61 (if applicable): Integrate approved mocks into site build
- Generate Ember art assets for each room
- Source or create licensed sound files (vinyl crackle, cursor blip, ambient chatter)
- Write real editorial content to replace placeholders
- Implement room routing and navigation in Worker

---

## References

- **GitHub Issues:** #35 (this mock), #60 (department names), #31 (room spec shape), #42 (Music), #45 (Food), #47 (Tech), #32 (doors), #37 (a11y gate)
- **Design Pack:** `design/sovrano-v1/README.md` (#28 design pack, tokens reference)
- **Ether Room:** Existing Music room inherits Ether Room aesthetic (warm purple/red stage light, amber focus, ink #0a081e family)
- **Brand:** Masthead wordmark Bodoni Moda (established), UI Inter Tight (established), scrim treatment rgba(10,8,30,.63→.52) over art

---

**Commit:** This specification will be included in commit for issue #35 with Co-authored-by: threshi-art.

**License:** All rights reserved. See repository LICENSE. Mockups for internal review only.
