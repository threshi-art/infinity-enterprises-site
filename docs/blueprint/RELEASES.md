# Publication Blueprint: Release Dependency Board

**Issue:** #60, section A  
**Date:** 2026-09-27

## Overview

This board sequences focused pull requests from `studio` to `main` in a coherent order. Each release has a clear owner, evidence gate, and acceptance criteria. **Live Sites publication is a separate step owned by Codex** after each merge.

**Key rules:**

- Every PR restates the problem, records the corrective action, cites objective evidence at the exact head commit, and gives the reviewer concrete next steps.
- PRs into `main` follow Merge authority in AGENTS.md. Other contributors provide findings but do not merge.
- Live Sites publication and release sync copy sync are separate verified steps after each merge.
- No owned-domain task appears anywhere in this plan (excluded by owner direction).

---

## Release Order

### Phase 1: Immediate Corrections (Independent, Visitor-Facing)

| Order | Slice | Issue(s) | Owner | Evidence Gate | Notes |
|---|---|---|---|---|---|
| **1** | Ether phone player fix | #55 / #57 | Forge (via Cursor agent) | Phone screenshots at 320px, 360px, 390px showing iframe ≥200×200px; desktop unchanged; build passes | Only visitor-facing fix on `main`. Independent of all other work. Ships first. |
| **2** | Privacy cleanup | #58 / #59 | Forge | `git grep` searches for machine paths, host names, and emails show no hits (or justified exceptions); build passes; installer logic confirmed | Removes machine-specific paths and host names from current files. Separate studio commit already exists (`3751f89`, `c1de8ab`). Squash-merge with automatic co-author trailer removed. |

**Phase 1 evidence:** Both PRs provide before/after grep output, build logs, and objective verification at the exact head.

---

### Phase 2: Repository Foundations (No Visitor Impact)

These slices prepare the repository for collaborative work without changing the live site.

| Order | Slice | Commits / PR | Owner | Evidence Gate | Notes |
|---|---|---|---|---|---|
| **3** | Evidence templates + AGENTS.md | #26 / S2 from PR #27 | Forge | Templates exist in `docs/`; AGENTS.md updated; no machine paths reintroduced (see #58) | Cherry-picking `8881684` alone would reintroduce machine paths. S2 must include `3751f89`'s AGENTS.md change or be re-cut from studio's current AGENTS.md. |
| **4** | CODEOWNERS | S3 from PR #27 (`98beae1`) | Forge | File exists; build passes | New file only. Independent. |
| **5** | LICENSE notice | S4 from PR #27 (`7fab241`) | Forge / Codex | File exists; rights wording approved by Codex | Separate rights decision. Codex approval required. |
| **6** | SOVRANO v1 design pack | #28 / S5 from PR #27 (`671cbf6`) | Ember / Forge | `design/sovrano-v1/` directory complete; ASSETS.md manifest present; build passes | Repo-only reference material. Does not change site pages. |
| **7** | Redesign boards, covers, textures | #33, #34 / S6 from PR #27 (`5470b91`, `b87dff5`) | Ember | Both commits cherry-picked in order; manifest lists source, dimensions, and licenses | Keep both commits in order. Covers and textures are reference material; not yet integrated into site. |
| **8** | README refresh | S7 from PR #27 (`5fd1054`, `80bd7be`) | Forge | Build passes; no conflict with #58's README change | Could conflict with S1b's README change. Needs rebase check against `main` after #59 lands. Depends on S4 (LICENSE) and S6 (design pack). |
| **9** | Issue wireframe mocks | #29 / S8 from PR #27 (`a41f1f9`) | Forge | `design/issue-mocks/` present; HTML and PNG files intact | Repo-only. Mocks for #33 and #42. |
| **10** | Ether five-journey spec | #56 / S9 from PR #27 (`c1b14dc`) | Forge | `docs/superpowers/specs/2026-09-27-ether-room-five-journeys-design.md` present | Spec only, not implementation. Guides #56 build. |

**S10 (sync-script default path, `e5879f4`) is dropped:** Superseded by #58's mandatory `-Destination` change.

**Phase 2 evidence:** Each slice provides file lists, manifests, and build logs. No live site changes.

---

### Phase 3: Shared Infrastructure (Foundation for All Rooms)

These issues build the shell, navigation, splash, and homepage that all departments depend on. They ship before any individual room.

| Order | Slice | Issue(s) | Owner | Evidence Gate | Notes |
|---|---|---|---|---|---|
| **11** | Shared shell: masthead, menu, footer | #30 | Forge | Every page renders the same shell; no overflow at 390px; contrast passes WCAG AA; keyboard and screen reader tested; build passes | Folds in or closes #9 and #11 (mobile overflow, contrast). Depends on #8 (base styles, must land first). |
| **12** | Room system: data-driven theming | #31 | Forge | One data file holds all 14 room specs; pages pick their room from section; every text/background pair passes WCAG AA; fonts self-hosted or licensed; build passes | Blocks all room issues. Defines colors, type, layout, motion, sound, texture, door per department. |
| **13** | Doors: section transitions | #32 | Forge | Doors work in Chrome and Safari; reduced-motion tested; no layout shift or focus loss; back button works; build passes | Depends on #31 (room system). View Transitions API with reduced-motion fallback. |
| **14** | Room sound: loops and entry sounds | #33 | Forge (player), Ember (assets) | Nothing plays until visitor turns sound on; loops seamless; every file has source and license (CC0 or original); audio not downloaded while sound off; iOS Safari tested; build passes | Depends on #31. Ember delivers assets first; Forge builds player. |
| **15** | Room art: covers and textures | #34 | Ember | One cover and phone crop per room (14 total); textures tile seamlessly, <30KB each; manifest lists source, tool, dimensions; text over covers passes WCAG AA | Depends on #31. Ember delivers assets; Forge integrates. |
| **16** | Splash: cinematic opening | #61 | Forge (interaction), Ember (art), Codex (concept approval) | Two concepts reviewed; Chris chooses one; Enter/Skip visible and keyboard-operable; no sound before visitor action; reduced-motion static version tested; slow connection fallback; returning visitors can skip; build passes | Coordinates with #30 (shell) and #36 (homepage). Concept approval gate before implementation. |
| **17** | Homepage: masthead and data-driven highlights | #36 | Forge | Existing stories migrated to data shape; homepage renders from queries; looks same as today apart from masthead, menu, queries; build passes | Depends on #30 (shell), #61 (splash), #13 (cover story decision). |

**Phase 3 evidence:** Each issue provides axe-core reports, WCAG contrast checks, keyboard/screen-reader walkthroughs, desktop (1440px) and mobile (390px) screenshots, and build logs.

---

### Phase 4: Departments in Coherent Slices

Individual departments ship in groups that make editorial sense. Each department issue must pass the #37 accessibility and performance gate before closing.

#### Slice A: The Reading Room and The Daily Desk

| Issue | Department | Owner | Evidence Gate | Dependencies |
|---|---|---|---|---|
| #39 | The Daily Desk (subsection of The Reading Room) | Forge | #37 gate (axe, contrast, reduced motion, page weight); ticker labeled sample data if no live source; build passes | #31, #37, #38 (live data) |
| #48 | The Reading Room (top-level hub) | Forge | #37 gate; line length and text size suit long reading; build passes | #31, #37 |

**Evidence:** axe reports, contrast tables, page-weight measurements, screenshots.

#### Slice B: Culture and Music

| Issue | Department | Owner | Evidence Gate | Dependencies |
|---|---|---|---|---|
| #41 | Culture | Forge | #37 gate; blurred-text test passes; build passes | #31, #37 |
| #42 | Music (top-level, with Ether sub-room) | Forge | Music pages use Music sub-room, not Cultura; tilt and pulse respond to keyboard; blurred-text test passes and differs from Tech and Food; #37 gate; build passes | #31, #37, #35 (mock approval) |
| #54 | Ether Room: mood stations (Phase 1) | Forge (build), Ember (art), Puck (source checks) | 3+ moods, each with 1+ working station; existing cosmic funk journey preserved; keyboard and screen reader tested; no audio before tap; mood switch fades; removed video shows fallback; CSP allows embed; #37 gate; build passes | #42, #15 (CSP) |
| #56 | Ether Room: five-journey landing | Forge (build), Ember (art), Puck (source checks) | Five slots appear; slot 01 unchanged; slots 02, 03, 05 playable with original art; Noir Jazz visibly upcoming; build passes | #54 |

**Evidence:** #35 three-room mock (Music, Tech, Food) approved by Chris before #42 starts. Each issue provides axe reports, screenshots, and blurred-text test results.

#### Slice C: Motor, Food, Forge & Flow

| Issue | Department | Owner | Evidence Gate | Dependencies |
|---|---|---|---|---|
| #43 | Motor | Forge | Side-scroll rail keyboard and touch tested; race red only for lines; blurred-text test; #37 gate; build passes | #31, #37 |
| #45 | Food (formerly Tavola) | Forge | Handwritten face only for short labels; blurred-text test differs from Music and Tech; #37 gate; build passes | #31, #37, #35 (mock approval) |
| #46 | Forge & Flow (formerly Sport) | Forge | Door passes three-flashes rule; blurred-text test; #37 gate; build passes | #31, #37 |

**Evidence:** Each issue provides #37 gate results and screenshots.

#### Slice D: Tech@Lounge and Fin@Tech

| Issue | Department | Owner | Evidence Gate | Dependencies |
|---|---|---|---|---|
| #47 | Tech@Lounge | Forge | Scanlines never lower contrast below AA; blurred-text test differs from Music and Food; #37 gate; build passes | #31, #37, #35 (mock approval) |
| #40 / Fin@Tech | Fin@Tech (market data and terminal aesthetics, adapted from Mercati/Ledger) | Forge (display), Conduit (data) | No number relies on color alone; blurred-text test; #37 gate; disclaimer and sample-data labels present; build passes | #31, #37, #38 (live data) |

**Evidence:** Each issue provides #37 gate results. Fin@Tech inherits Mercati's Ledger aesthetics (monospace numerals, ruled rows, terminal grid).

#### Slice E: Travel & Leisure and In Development

| Issue | Department | Owner | Evidence Gate | Dependencies |
|---|---|---|---|---|
| #44 | Travel & Leisure (formerly Tempo Libero) | Forge | Parallax off with reduced motion; no layout shift; blurred-text test; #37 gate; build passes | #31, #37 |
| #50 | Pets gallery (top-level department) | Conduit (upload, storage, review), Forge (display) | No submission visible before approval; metadata stripped on upload; consent required; file type, size, rate limits enforced; build passes | #30, owner decisions (approver, storage) |
| (none) | In Development (no redesign issue; existing pages preserved) | Forge | Existing `/development` and `/development/atlas` pages preserved; integrated into new navigation | #30 (shell) |

**Evidence:** Each issue provides #37 gate results. #50 requires owner decisions on approver and storage before implementation.

---

### Phase 5: Signature Experiences (Own Evidence Gates)

These features have their own evidence and validation gates beyond the standard #37 checklist.

| Issue | Feature | Owner | Evidence Gate | Dependencies |
|---|---|---|---|---|
| #38 | Live data: Daily Desk ticker, Fin@Tech numbers | Conduit (feeds), Forge (display) | #10 fixed first; ticker falls back to last good headlines; no figure without live source or "Sample data" label; no secrets in repo; build passes | #10, #39, #40/Fin@Tech, owner decision (market-data license) |
| #49 | Outside feeds: market news, Substack Picks | Conduit (feeds), Forge (display) | Every source has terms noted; no copied article body; fallback tested; build passes | #10, #40/Fin@Tech, #47, owner decisions (newsletters, summary authorship) |
| FORM | FORM visual meditation (existing page preserved, integrated into Forge & Flow) | Forge | Existing `/form` experience preserved; linked from `/practice`; build passes | #30 (shell), #46 (Forge & Flow) |

**Evidence:** Each issue provides feed-failure tests, sample-data label verification, and build logs.

---

### Phase 6: Editorial Operations (After Content Is Live)

These issues improve the editorial workflow but do not block the initial publication.

| Issue | Feature | Owner | Evidence Gate | Notes |
|---|---|---|---|---|
| #10 | Fix broken outside feed | Conduit | Feed returns items; fallback on failure tested; build passes | Blocks #38 and #49. May ship earlier if prioritized. |
| (none) | Newsletter and analytics | Conduit | Email delivery configured and tested; analytics privacy-compliant and disclosed | Ships only after subscriber list and delivery service are ready. |
| (none) | Link checks and broken-reference audit | Forge | Automated or manual check of all internal and external links; dead links reported | Continuous maintenance; not a blocker for initial publication. |
| (none) | Sponsorships and clearly labeled ads | Forge / Codex | Ad placements clearly labeled; Google advertising privacy disclosures updated; consent controls if required | Only after editorial content is live and audience measurement exists. No claims of revenue or audience size before verification. |

**Evidence:** Each operational issue provides test results and updated privacy disclosures where applicable.

---

## Live Sites Publication (Separate Step After Each Merge)

**Owner:** Codex

**Process:**

1. An accepted PR from `studio` to `main` is merged under Merge authority in AGENTS.md.
2. Codex publishes the new `main` head through the Sites project (identified in `.openai/hosting.json`).
3. Codex verifies the exact published Sites version and source commit.
4. Forge prepares the resulting GitHub mirror update only after verifying the published version.
5. Codex or Cursor reviews the mirror-update record before it lands.
6. After a release is squash-merged, bring `studio` up to date by merging `main` into `studio` through a normal pull request under Merge authority in AGENTS.md.

**No GitHub merge alone publishes the live Site.** Publication and release sync copy sync are separate verified steps.

---

## Acceptance Criteria Summary

Every pull request must include:

- **Problem restatement:** What was wrong or missing?
- **Corrective action:** What was done?
- **Objective evidence:** grep results, build logs, axe reports, screenshots, test results at the exact head commit.
- **Reviewer next steps:** What should the reviewer check?

Every room issue (#39–#48, #40/Fin@Tech) must pass the #37 gate:

- axe-core (WCAG 2.2 AA) with zero violations at 1440px and 390px
- Color is never the only signal
- Reduced motion removes movement; sound off by default
- Keyboard path through menu, room, and article works with visible focus
- Page weight <1MB transferred on first load with sound off; no layout shift

---

## Open Decisions That Block Releases

The following decisions must be resolved before the affected issues can close:

1. **#35 three-room mock approval (Chris):** Blocks #42 (Music), #45 (Food), #47 (Tech@Lounge).
2. **#61 splash concept approval (Chris):** Blocks #61 (splash implementation).
3. **#13 cover story decision (Chris):** Blocks #36 (homepage highlights).
4. **Market-data source and license (Chris):** Blocks #38 (live Fin@Tech numbers).
5. **Substack Picks newsletters (Chris):** Blocks #49 (Tech@Lounge feed).
6. **Pets gallery approver and storage (Chris):** Blocks #50 (Pets upload and review).
7. **Final masthead identity (Chris):** SOVRANO@Infini is working title; final approval needed for #30 (shell).
8. **Forge & Flow:** #60 sets the menu label; keep `/practice` as the existing route.
9. **OSINT & Tradecraft:** Place under the Daily Desk within The Reading Room, per #60.
10. **Tavola subsections (Chris):** Recipes, Restaurants, Wine, or single feed? Affects #45 (Food).

---

## Summary

- **Phase 1:** Two immediate corrections (#57 Ether phone, #59 privacy cleanup) ship first.
- **Phase 2:** Repository foundations (templates, CODEOWNERS, LICENSE, design pack, README, mocks, Ether spec) prepare the repo without changing the site.
- **Phase 3:** Shared infrastructure (shell, room system, doors, sound, art, splash, homepage) ships before any room.
- **Phase 4:** Departments ship in coherent slices (Reading Room/Daily Desk, Culture/Music, Motor/Food/Forge & Flow, Tech@Lounge/Fin@Tech, Travel & Leisure/In Development).
- **Phase 5:** Signature experiences (live data, outside feeds, FORM) have their own evidence gates.
- **Phase 6:** Editorial operations (newsletter, link checks, ads) ship after content is live.
- **Live Sites publication:** Separate step owned by Codex after each merge.
- **No owned-domain task** appears anywhere in this plan.

---

**Next step:** Use this board to track progress, coordinate overlapping work, and prepare focused pull requests in the defined order.
