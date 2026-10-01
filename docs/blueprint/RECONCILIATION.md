# Publication Blueprint: Issue Reconciliation

**Issue:** #60, section A  
**Date:** 2026-09-27

## Purpose

This document reconciles the earlier redesign issues (#29–#50) and feature issues (#54–#56, #58) with the updated publication map in #60. Where scopes overlap or conflict, it states which approach wins and what changes.

**Default rule:** Issue #60's 14-department taxonomy, naming, and placement win on editorial structure. Older issues win on their implementation details (technical approach, accessibility rules, asset production) unless those details conflict with the #60 map.

---

## Issue-by-Issue Reconciliation

### #29: Redesign Tracker (Ten Rooms vs Fourteen Departments)

**Original scope:** Ten-room taxonomy using Italian names: The Daily Desk (Nocturne), Mercati (Ledger), Cultura (Atelier), Music (sub-room of Cultura), Motore (Paddock), Tempo Libero (Riviera), Tavola (Trattoria), Sport (Arena), Tech (Circuit), The Reading Room (Library). Each room has its own colors, type, layout, motion, sound, texture, and door.

**#60 map:** Fourteen departments with English names: Home/Current Issue, Fin@Tech, The Reading Room, Culture, Travel & Leisure, Pets, Motor, Food, Forge & Flow, Music, Academic Journal, Tech@Lounge, In Development, About. Utility links remain outside the editorial map. Music is a top-level department.

**What changes:**

1. **Taxonomy:** #60's 14-department map wins. The ten-room model is a valuable implementation frame for visual theming; it does not override the editorial structure.
2. **Naming:** English department names win (Culture, Motor, Food, Music) over Italian room names (Cultura, Motore, Tavola). The Reading Room, The Daily Desk, and Tech@Lounge keep their established names.
3. **Music placement:** Music becomes a top-level department housing the Ether Room (per #60), not a sub-room of Cultura (per #29 #41 #42). The `/music` and `/ether` routes are preserved.
4. **Fin@Tech:** A new department in #60, not present in #29.
5. **Forge & Flow vs Sport:** #29 called it "Sport (Arena)." #60 calls it "Forge & Flow" (training, recovery, meditation, martial arts, sport). The existing `/practice` route remains.

**What #29 contributes:** The room system (#31), doors (#32), sound (#33), textures (#34), accessibility gate (#37), and per-room visual identity remain valid implementation methods. Ember's covers and textures (#33 #34) are essential assets. The shared shell (#30) is the foundation for all pages.

**Biggest conflicts:**

- **Ten rooms vs 14 departments:** #60 wins on taxonomy; #29's visual theming adapts to the new structure.
- **Italian vs English names:** English wins for public-facing labels; Italian names may remain as internal room identifiers in the room data file.
- **Music nested under Cultura vs Music as its own department:** #60 wins; Music is top-level.
- **Daily Desk as a room vs part of The Reading Room:** #60 makes The Daily Desk a subsection of The Reading Room department. The `/daily-desk` route is preserved.

**Resolution:** #29 sub-issues (#30–#50) proceed as implementation work under the #60 map. Each room issue adapts its department name and placement to match #60. The room system's visual theming (type, motion, sound, texture, doors) remains the implementation method.

---

### #30: Shared Shell (Masthead and Menu)

**Original scope:** SOVRANO Infinitum masthead, nine-section menu (The Daily Desk, Mercati, Cultura, Motore, Tempo Libero, Tavola, Sport, Tech, The Reading Room), footer.

**#60 adjustment:** The masthead becomes **SOVRANO@Infini** (working title; final approval pending). The menu accommodates 14 departments, not nine sections. The shell remains the foundation for all pages.

**What changes:** Menu labels and count. The shared-shell approach (#30) is correct; the department list updates to match #60.

**Resolution:** #30 proceeds with the updated department list from `NAVIGATION.md`. The masthead, footer, focus ring, and accessibility rules stay as originally scoped.

---

### #31: Room System (Data-Driven Theming)

**Original scope:** One room spec per section, stored as data: colors, type, layout, motion, sound, texture, door. Subrooms for subsections (e.g., Music within Cultura).

**#60 adjustment:** The room system adapts to 14 departments instead of ten. Subrooms still apply (e.g., Ether Room within Music, FORM within Forge & Flow).

**What changes:** Room count and department names. The data-driven theming approach is correct.

**Resolution:** #31 proceeds with 14 room specs. The `subrooms` feature accommodates Ether, FORM, and other distinct experiences within a parent department.

---

### #32: Doors (Transitions Between Sections)

**Original scope:** View Transitions API for cross-document navigation; each room defines its door (cut, fade, wipe, slide, page turn). Reduced-motion swaps every door for a short cross-fade or none.

**#60 adjustment:** None. Doors apply to all 14 departments.

**Resolution:** #32 proceeds unchanged. Every department gets a door definition in its room spec.

---

### #33: Room Sound (Ambient Loops and Entry Sounds)

**Original scope:** One quiet loop and one entry sound per room. Off by default, visitor choice remembered. Teletype tick (Daily Desk), vinyl crackle (Music), page turn (Reading Room), cursor blip (Tech), plate clink (Tavola), engine idle (Motore), crowd hum (Sport), waves (Tempo Libero).

**#60 adjustment:** Sound assets adapt to 14 departments. Some sounds reuse across similar themes; others are new (e.g., Fin@Tech may use a trading-floor tone).

**What changes:** Asset list and mapping. The off-by-default, visitor-controlled player remains.

**Resolution:** Ember produces sound assets per the #60 map. #33 proceeds with updated department names.

---

### #34: Room Art (Covers and Textures)

**Original scope:** One cover and phone crop per room; tiling textures (paper grain, film grain, scanlines). Manifest records source, tool, dimensions.

**#60 adjustment:** Covers adapt to 14 departments. Some existing covers remain (Daily Desk, Reading Room, Tech, Moda/Culture); new covers needed (Fin@Tech, Travel & Leisure, Forge & Flow, Music).

**What changes:** Cover count and assignments.

**Resolution:** Ember produces covers per the #60 map. #34 proceeds with updated department names and cover assignments.

---

### #35: Mock Review (Music, Tech, Tavola)

**Original scope:** Three side-by-side mocks (Music, Tech, Tavola) for owner approval before room build. Music must not feel like Tech or Tavola.

**#60 adjustment:** Tavola becomes **Food**; the three-room differentiation test remains valid. Music is now top-level, not a sub-room of Culture.

**What changes:** Department names in the mock labels.

**Resolution:** #35 proceeds with Music, Tech, and Food as the three-room comparison. Approval remains an owner gate before building those rooms.

---

### #36: Homepage (Masthead and Data-Driven Highlights)

**Original scope:** Homepage keeps Nocturne look; new masthead (SOVRANO Infinitum); highlights filled from story tags (`current-issue`, `editors-pick`, `featured`).

**#60 adjustment:** Homepage becomes the first stop after the cinematic splash (#61). The masthead is **SOVRANO@Infini** (working title). The data-driven highlights approach is correct.

**What changes:** Masthead wording; splash precedes the homepage.

**Resolution:** #36 proceeds with the updated masthead and the splash integration from #61.

---

### #37: Accessibility and Performance Gate

**Original scope:** Every room must pass axe-core (WCAG 2.2 AA), color-not-alone rule, reduced motion, keyboard path, and page-weight budget before closing.

**#60 adjustment:** None. The gate applies to all 14 departments.

**Resolution:** #37 proceeds unchanged. Every department issue passes the gate.

---

### #38: Live Data (Daily Desk Ticker and Mercati Numbers)

**Original scope:** Daily Desk ticker from free news feeds; Mercati numbers from a licensed market-data API. Sample data labeled until a source is licensed.

**#60 adjustment:** The Daily Desk is now a subsection of The Reading Room. Fin@Tech (new department) may also need market data. Mercati as a separate department does not appear in #60; its content merges into Fin@Tech or The Daily Desk's business subsection.

**What changes:** Department placement. "Mercati" as a standalone room name does not appear in #60; its market-data display moves to Fin@Tech or The Daily Desk.

**Resolution:** #38's live-data approach applies to Fin@Tech and The Daily Desk. Conduit owns feed integration. The "Not investment advice" disclaimer and sample-data labels remain mandatory.

---

### #39–#48: Individual Room Issues

Each room issue (#39 The Daily Desk, #40 Mercati, #41 Cultura, #42 Music, #43 Motore, #44 Tempo Libero, #45 Tavola, #46 Sport, #47 Tech, #48 The Reading Room) adapts its department name and placement to match #60:

| Issue | Original Room Name | #60 Department Name | Route | Resolution |
|---|---|---|---|---|
| #39 | The Daily Desk (Nocturne) | The Reading Room / The Daily Desk | `/daily-desk` | Subsection of The Reading Room; visual theming stays |
| #40 | Mercati (Ledger) | Fin@Tech (or merged into Daily Desk) | `/fintech` (new) | Market-data display moves to Fin@Tech; "Mercati" name may stay as internal room ID |
| #41 | Cultura (Atelier) | Culture | `/culture` | English name; visual theming stays |
| #42 | Music (sub-room of Cultura) | Music (top-level department) | `/music` | Promoted to top-level; Ether Room stays at `/ether` |
| #43 | Motore (Paddock) | Motor | `/motor` | English name; visual theming stays |
| #44 | Tempo Libero (Riviera) | Travel & Leisure | `/travel` (new) | English name; Pets is a separate department |
| #45 | Tavola (Trattoria) | Food | `/food` | English name; visual theming stays |
| #46 | Sport (Arena) | Forge & Flow | `/practice` | Forge & Flow menu label; visual theming stays |
| #47 | Tech (Circuit) | Tech@Lounge | `/tech-lounge` | Existing name and route preserved; visual theming stays |
| #48 | The Reading Room (Library) | The Reading Room (top-level department) | `/reading-room` (new hub) | Existing `/enigmas`, `/journal`, `/learning` preserved as subsections |

**Resolution:** Each room issue proceeds with its visual theming, accessibility, and asset work under the updated department name and placement from #60. The room system (#31) accommodates the name changes without code rewrites.

---

### #49: Outside Feeds (Market News and Substack Picks)

**Original scope:** Mercati market-news feed; Tech's Substack Picks feed. Each item shows headline, link, credit, and our own summary.

**#60 adjustment:** Mercati content moves to Fin@Tech. Substack Picks stays in Tech@Lounge.

**What changes:** Department placement for market-news feed.

**Resolution:** #49 proceeds with feeds for Fin@Tech (market news) and Tech@Lounge (Substack Picks). Conduit owns feed integration.

---

### #50: Pets Gallery Submissions

**Original scope:** Upload form, consent, metadata stripping, review queue. Display in Tempo Libero.

**#60 adjustment:** Tempo Libero becomes **Travel & Leisure**. Pets gallery remains a subsection.

**What changes:** Department name.

**Resolution:** #50 proceeds with the gallery under Travel & Leisure. Conduit owns upload, storage, and review queue.

---

### #54: The Ether Room (Mood Stations and Future Radio)

**Original scope:** Mood selector over curated YouTube stations; future path to our own radio station. Music streams as you scroll; choose the mood of your dimension.

**#60 adjustment:** Music is a top-level department; the Ether Room is its signature experience. The `/ether` route is preserved.

**What changes:** Music is no longer nested under Cultura; it is top-level.

**Resolution:** #54 proceeds under the Music department. The Ether Room remains at `/ether` and is linked prominently from `/music`.

---

### #55: Ether Room Phone Player Fix

**Original scope:** Fix the phone player's 170×96px size to meet YouTube's 200×200 minimum.

**#60 adjustment:** None. This is an isolated fix.

**Resolution:** #55 ships independently as #57 (first in the release order). No conflicts with #60.

---

### #56: Ether Room Five-Journey Landing Page

**Original scope:** Five-slot landing page; preserve slot 01 (cosmic funk) unchanged; add Mutant Groove, Late Night Soul, Spy Lounge; Noir Jazz remains upcoming.

**#60 adjustment:** None. This is an Ether Room implementation detail.

**Resolution:** #56 proceeds unchanged. The five-journey design is the approved Ether Room structure.

---

### #58: Privacy Cleanup (Remove Machine-Specific Details)

**Original scope:** Remove machine paths, host names, and local task details from `README.md`, `AGENTS.md`, and sync scripts.

**#60 adjustment:** None. This is a repository hygiene fix.

**Resolution:** #58 ships as #59 (second in the release order). No conflicts with #60.

---

## Open Decisions for Chris

The following decisions remain open and should be resolved before the affected issues close:

1. **Final masthead identity:** SOVRANO@Infini is the working title. Infinity Enterprises is the company name. Which appears in the masthead?
4. **Tavola subsections:** Recipes, Restaurants, Wine, or a single Food feed?
5. **Crest founding year:** MMXXVI (2026) is a placeholder. Confirm or change.
6. **Market-data source and license:** Required before #38 can show live Fin@Tech numbers.
7. **Substack Picks newsletters:** Which newsletters go in Tech@Lounge's Substack Picks feed?
8. **Pets gallery approver and storage:** Who approves submissions, and where are photos stored?
9. **#35 three-room mock approval:** Music, Tech, Food side-by-side mock must be approved before building those rooms.
10. **#61 splash concept approval:** Two opening concepts for the cinematic splash; Chris chooses one before implementation.
11. **Noir Jazz (Ether Room slot 04):** No music source selected yet. Remains "upcoming" until a source is chosen.
12. **Owned domain:** Excluded by owner direction; no task should include domain acquisition or DNS setup.

---

## Biggest Conflicts Between #29 and #60

1. **Ten rooms vs 14 departments:** #29 organized the site as ten visually distinct rooms with Italian names. #60 reorganizes as 14 editorially distinct departments with English names. The visual theming from #29 adapts to the 14-department structure.

2. **Music nested under Cultura vs Music as its own department:** #29 made Music a sub-room of Cultura (Atelier). #60 promotes Music to a top-level department. Resolution: Music is top-level; Ether Room is its signature experience.

3. **Italian room names (Mercati, Motore, Tavola, Tempo Libero, Sport) vs English department names (Fin@Tech, Motor, Food, Travel & Leisure, Forge & Flow):** #60 uses English names for public-facing labels. Italian names may remain as internal room identifiers in the data file.

4. **Daily Desk as a standalone room vs Daily Desk as part of The Reading Room:** #60 makes The Daily Desk a subsection of The Reading Room department. The `/daily-desk` route is preserved; the navigation shows it as a subsection.

5. **Mercati as a standalone department vs Fin@Tech:** #29 proposed Mercati (Ledger) as a financial room with terminal aesthetics. #60 calls the financial department **Fin@Tech**. "Mercati" may remain as a subsection name or internal room identifier.

---

## Summary

- **Taxonomy and naming:** #60 wins on the 14-department map and English names.
- **Implementation methods:** #29's room system, doors, sound, textures, and accessibility gate remain valid.
- **Music placement:** #60 wins; Music is top-level, not a sub-room of Culture.
- **Daily Desk placement:** #60 makes it a subsection of The Reading Room; the route is preserved.
- **Every issue proceeds** with its technical and asset work under the updated #60 structure.
- **Open decisions:** 12 items listed above for Chris to resolve.

---

**Next step:** Build the release dependency board in `RELEASES.md` using this reconciliation and the updated department map.
