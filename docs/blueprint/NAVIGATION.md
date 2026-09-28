# Publication Blueprint: Navigation Model

**Issue:** #60, section A  
**Date:** 2026-09-27

## Overview

The navigation system must accommodate 14 editorial departments while remaining usable on desktop (1440px) and phone (390px). Not all departments need to be visible at once; a balanced approach uses a primary navigation bar with an accessible index or drawer for the full list.

## Proposed Navigation Structure

### Primary Navigation (Always Visible)

The masthead remains constant across all rooms:

- **SOVRANO@Infini** (working masthead; may change to final approved identity)
- **Sound toggle** (off by default, visitor choice remembered)
- **Contents menu** (existing collapsible details element on mobile, may become a full drawer)

### Top-Level Departments (14)

The full editorial map, organized for discoverability:

1. **Home / Current Issue** — Cinematic splash (skippable), cover story, Editorial Picks
2. **Fin@Tech** — Financial technology desk (new, flat route: `/fintech`)
3. **The Reading Room** — Outside Signals, Editorial Picks, Agentic@Enigmas, The Daily Desk (Breaking, World, U.S., Business, Science, OSINT / Tradecraft)
4. **Culture** — Fashion, art, screen, nightlife
5. **Travel & Leisure** — Travel, yachting, exotic places
6. **Pets** — Curated reader pet portraits and gallery
7. **Motor** — Supercars, classics, racing (visual gallery and future editorial desks)
8. **Food** — Recipes, chef spotlight, food science, drinks, restaurant radar, nutrition
9. **Forge & Flow** — Training, recovery, meditation, martial arts, sport; includes FORM
10. **Music** — Ether Room, artist profiles, album reviews, production, underground spotlight
11. **Academic Journal** — Research papers, case studies, policy analysis, peer commentary, data and methods
12. **Tech@Lounge** — Gadgets, AI & robotics, software, cybersecurity, future tech, developer corner
13. **In Development** — AI studio, project ledger (Atlas), systems in progress
14. **About the Enterprise** — Purpose, editorial standards, Foundation concepts

Privacy, contact, subscribe, partners, and support remain utility links outside the editorial departments.

### Navigation Approach: Hybrid Model

**Desktop (1440px):**

- **Primary bar** (8 to 10 slots): Home, The Daily Desk, Culture, Motor, Food, Music, In Development, About, plus a "Departments" or "All Sections" link
- **Departments index page** (at `/departments` or revealed via drawer): Full 14-department list with short descriptions, accessible by keyboard and screen reader
- **Footer links:** Legal, contact, subscribe, RSS

**Phone (390px):**

- **Collapsible menu** (existing Contents `<details>` element or drawer): All 14 departments in a vertical list
- **No horizontal scroll:** All touch targets at least 24×24 CSS px
- **Current section marked** with `aria-current="page"` and a visual indicator (not color alone)

### Subsection Access

Departments with many subsections (The Reading Room, Music, Food, Forge & Flow) provide internal navigation on their landing pages:

- **The Reading Room** landing links to Outside Signals, Agentic@Enigmas, and The Daily Desk; Academic Journal remains a separate top-level department
- **Music** landing links to Ether Room, artist profiles, and editorial desks
- **Food** and **Forge & Flow** use the existing `departments()` layout from `src/publication-pages.mjs`

### Current Issues and Proposed Routes

| Department | Current Route | Proposed Route | Notes |
|---|---|---|---|
| Home | `/` | `/` | Preserve; add splash (#61) |
| Fin@Tech | None | `/fintech` | New flat route |
| The Reading Room | `/enigmas`, `/journal`, `/learning` | `/reading-room` (hub), subsections stay | New hub page; existing routes preserved via links |
| Culture | `/culture` | `/culture` | Preserve |
| Travel & Leisure | None | `/travel` | New flat route; Pets at `/pets` |
| Pets | None | `/pets` | New top-level gallery, separate from Travel & Leisure |
| Motor | `/motor` | `/motor` | Preserve |
| Food | `/food` | `/food` | Preserve |
| Forge & Flow | `/practice` | `/practice` | Preserve; menu label may say "Forge & Flow" |
| Music | `/music` | `/music` | Preserve; Ether Room at `/ether` stays |
| Academic Journal | `/inquiry` | `/inquiry` | Preserve |
| Tech@Lounge | `/tech-lounge` | `/tech-lounge` | Preserve |
| In Development | `/development` | `/development` | Preserve |
| About | `/about` | `/about` | Preserve |

**Critical constraint:** The Worker does not support new nested routes (e.g., `/reading-room/essays`). All new routes must be flat pages or query-based. Existing nested routes (`/about/standards`, `/about/diana`, `/development/atlas`) remain because they are explicitly registered in the Worker.

### Accessibility and Usability

- **Keyboard navigation:** Full traversal of menu, skip link, visible focus ring
- **Screen reader:** Landmarks (`<nav>`, `<main>`), `aria-current` for the active section, `aria-label` for navigation regions
- **Reduced motion:** No animated drawer slides or transitions; instant open/close
- **No horizontal overflow** at 390px
- **Contrast:** All text/background pairs pass WCAG 2.2 AA in every room theme
- **Touch targets:** Minimum 24×24 CSS px on mobile

### Existing Cultura/Culture Links

The current site uses "Culture" as a landing page at `/culture`. Some earlier design discussions used "Cultura" as a room name. The approved #60 map uses **Culture** as the department name. The navigation must preserve existing `/culture` links and not break incoming bookmarks or references.

### Music and Ether Room Placement

The #60 map makes **Music** a top-level department that houses the Ether Room. Earlier issue #29 nested Music under Cultura. The final navigation reflects the #60 decision:

- **Music** appears as a top-level menu item
- **/ether** remains the Ether Room route (preserved, no redirect)
- The Music landing page (`/music`) links prominently to the Ether Room

### Sport vs Forge & Flow

Issue #29 originally called the department "Sport." The #60 map calls it **Forge & Flow** (training, recovery, meditation, martial arts, sport). The existing route stays `/practice`; the page may retain its earlier “The Practice” title as the room evolves.

### OSINT & Tradecraft Placement

Issue #29 proposed OSINT & Tradecraft as a Daily Desk subsection. The #60 map places the Daily Desk within The Reading Room, with OSINT & Tradecraft under that desk.

### All Departments Index

A dedicated `/departments` page or revealed drawer provides:

- All 14 departments in order
- One-sentence description per department
- Keyboard-navigable, with focus visible
- Works at 390px and 1440px

This index ensures discoverability without crowding the primary navigation.

### Implementation Notes

1. **Shared shell** (issue #30) builds the masthead, menu, and footer as one reusable component.
2. **Room system** (issue #31) stores department names and routes in a data file, making menu updates a data change rather than a markup rewrite.
3. **Doors** (issue #32) handle transitions between sections; navigation itself is instant.
4. **Homepage** (issue #36) uses the new masthead and data-driven highlights; the menu is part of the shell.

### Footer

The footer remains consistent across all pages:

- **House of SOVRANO** (or final approved publication identity)
- **Infinity Enterprises:** About, In Development
- **Utility links:** Issues, Contact, Subscribe, Privacy
- **Copyright notice:** "Infinity Enterprises · September 2026"

## Summary

- **Hybrid navigation:** Primary bar (8–10 slots) + full departments index or drawer
- **Flat routes only for new pages** (constraint: Worker does not support new nested routes)
- **Accessibility:** Keyboard, screen reader, reduced motion, contrast, touch targets
- **Preserve existing routes:** All current pages remain accessible; redirects or links where names change
- **Open decision for Chris:** Final masthead identity

---

**Next step:** Reconcile this navigation model with issues #29–#50 in `RECONCILIATION.md`.
