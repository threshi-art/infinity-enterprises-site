# SOVRANO INFINITUM: design pack v1 (DRAFT)

Prepared by Forge (engineering/design partner) for Infinity Enterprises, 27 September 2026.
This folder is a design reference only. **Nothing in it is live.** It is not site code and is not part of the production build.

## Status
- DRAFT mockups only. Placeholder copy throughout.
- All imagery is AI-generated illustration (made by Ember). It does not show real people or models. Images are 1024x576 or 1280x720 and need upscaling before any full-bleed use.
- The crest year MMXXVI is a placeholder.
- Open items: (1) cover story: pending, (2) crest founding year.

## Decisions

### Name
- **SOVRANO INFINITUM.** The second word is swappable per section (for example SOVRANO Motore, SOVRANO Moda).
- Homepage masthead = **SOVRANO Infinitum**, using Ember's ivory + champagne wordmark (see `masthead/`). No oxblood on the navy homepage.
- Merch carries SOVRANO INFINITUM.

### Homepage
- Keeps the current live design: navy #0c1a2a, cream #f4f1eb, rust #c77c55, a big serif cover story beside a full-height image, sound toggle, section bar.
- Only the masthead and the menu change.
- Mock: `forge-web-mocks/pages/home-nocturne.png` (source `home-nocturne.html`). This is the chosen homepage.
- Cover story: pending. The cover slot in the mock is a placeholder; the image shown there is Ember's Daily Desk cover used as a stand-in. Ember supplies a final navy/rust cover image when the story is chosen.

### Sections (menu order)
1. The Daily Desk (News)
2. Mercati (Markets)
3. Cultura (Culture; Moda = fashion subsection)
4. Motore (Motor)
5. Tempo Libero (Leisure: travel, yachting, reader pets gallery)
6. Tavola (Food)
7. Sport (Forge & Flow)
8. Tech (Lounge)
9. The Reading Room (Long reads)

Footer: House of SOVRANO, Infinity Enterprises (About + In Development), Shop (test mode only), Newsletter (The Letter).

Full sitemap draft: `ia/sitemap-v1.md`.

### Section themes: "one house, ten rooms"
Each section page gets its own theme. Shared across all: the masthead, the fonts (Bodoni Moda / Playfair Display / Inter Tight), the hairline rule, the grid and the focus ring.
Mock: `forge-web-mocks/pages/vibes.png` (source `vibes.html`).

| Theme | Page | Background | Ink | Accent |
|---|---|---|---|---|
| Maison | House of SOVRANO | #3a1015 | #f3ece0 | #cdb27a |
| Nocturne | The Daily Desk | #0c1a2a | #f4f1eb | #c77c55 |
| Ledger | Mercati | #0f2620 | #f1ece0 | #cdb27a |
| Atelier | Cultura | #f4f1eb | #1b1216 | #8a2a30 |
| Paddock | Motore | #121316 | #f3ece0 | #cdb27a |
| Riviera | Tempo Libero | #eef2f1 | #10262b | #0f5663 |
| Trattoria | Tavola | #f6ece0 | #2a1a12 | #8a3f1c |
| Arena | Sport | #181b20 | #f2f0ea | #e2b93b |
| Circuit | Tech | #0d0f13 | #e8ecef | #7fcfe0 |
| Library | The Reading Room | #17121b | #ebe3d5 | #cdb27a |

- Paddock: race red #d4202a is for lines only (3.6:1), never text.
- All text pairs pass WCAG AA. Never put rust text on cream (2.9:1).

### Story data shape
`{ section, subsection?, tags: [editors-pick, featured, current-issue], hero, dek, author, date }`
Homepage highlights are queries on this shape, not hand-placed copies.

### Content rules
- Investing (third-party market news): link out + our own summary + credit.
- Markets pages carry "not investment advice".
- Pets gallery: owner consent required, AI-edit labels, no owner names or locations.
- Gossip only when sourced.
- The Journal cannot claim "peer-reviewed".
- Ads: no real brand logos or names; no Tiffany blue, no Ferrari red.

## What's in this folder
- `ASSETS.md`: Ember's asset manifest (what each image is for, sources and font license).
- `forge-web-mocks/pages/`: page mocks (HTML + PNG): home-nocturne (chosen homepage), home (earlier Maison-style home), vibes (ten section themes), hq / hq-phone / hq-board (House of SOVRANO).
- `forge-web-mocks/ads/`: ad and social format mocks (leaderboard, MPU, share card, IG post, story, Maison, and two contact sheets). The ad image is a crop of Ember's `editorial-art/01-penthouse-portrait.png`.
- `forge-web-mocks/shorts/`: 9x16 reveal short (`sovrano-reveal-9x16.mp4`, 9 s), its source `reveal.html` (append `#<seconds>` to the URL to see a single frame), and a strip preview.
- `sovrano-crest/`: crest, badges, favicons, and the generator script.
- `masthead/`: SOVRANO Infinitum wordmark and crest lockup (ivory + champagne), preview on navy, generator script.
- `editorial-art/`: Ember's AI-generated editorial illustrations and `covers/` (one per section), with prompts and notes.
- `logo-drafts/`: earlier wordmark explorations, reference only, not for shipping.
- `ia/sitemap-v1.md`: sitemap draft.

The HTML mocks use relative paths (pages/ loads sibling PNGs and `../../editorial-art/covers/`), so keep this folder layout intact and open any `.html` directly in a browser. The generator scripts (`*.py`) contain absolute paths from the machine they were made on and are kept for reference only.

(c) Infinity Enterprises. All rights reserved (see repository LICENSE).
