# Publication Name Configuration

## Overview

The publication name is configured through a single canonical value: `PUBLICATION_NAME` in `src/publication-config.mjs`.

**Current value:** `SAVRONO` (working name, not legally cleared)

This value is a working name and remains subject to change. See #107 and #140 for name clearance and finalization.

## The `__PUBLICATION_NAME__` Token

Templates can use the `__PUBLICATION_NAME__` token, which the build replaces with the configured publication name (HTML-escaped).

**Use for:** HTML text and attributes only  
**Do NOT use for:** `<script>` JSON-LD or RSS XML (these require their own encoding and currently use the parent name)

## How to Rename

1. Change `PUBLICATION_NAME` in `src/publication-config.mjs`
2. Run `npm ci && npm run build && npm test`
3. All tests must pass before committing

The build will fail if any `__PUBLICATION_NAME__` token survives into the compiled output.

## Image Stamps

Image metadata stamps (e.g., "Property of Infinity Enterprises") are governed separately by #140 and are configured in `scripts/image-stamp.json`. These are outside the scope of `PUBLICATION_NAME`.

## Hardcoded Spot Inventory

This inventory documents all existing hardcoded publication name references as of commit `1c776957669540cf8f7bdba81e58679108766a39`.

### Classification

- **Publication name:** References to the publication's identity (will be replaced with `__PUBLICATION_NAME__` token in future briefs)
- **Issue label:** Issue numbering and cover labels (owned by #13, separate from publication name)
- **Parent company:** References to the parent organization "Infinity Enterprises" (kept as-is)
- **Tooling/docs:** References in documentation, scripts, and workflows (allowed, not templates)
- **Path references:** Design folder names and asset filenames (kept for backwards compatibility)

### Publication Name (Masthead and Voice)

These references represent the publication's identity and will be replaced with the `__PUBLICATION_NAME__` token in subsequent changes:

| File | Line(s) | String | Context |
|------|---------|--------|---------|
| `src/home.html` | 1 | `Infinity Enterprises` | Site header `.site-brand` text |
| `src/home.html` | 1 | `· Infinity Enterprises` | Page title suffix |
| `src/home.html` | Multiple | `From Infinity`, `Infinity after hours`, `INFINITY`, `not an Infinity news report` | Cover copy and labels |
| `src/about.html` | 1 | `Infinity Enterprises` | Site header and title |
| `src/admin.html` | 1 | `Infinity Enterprises` | Site header and title |
| `src/atlas.html` | 1 | `Infinity Enterprises` | Site header and title |
| `src/development.html` | 1 | `Infinity Enterprises` | Site header and title |
| `src/diana.html` | 1 | `Infinity Enterprises` | Site header and title |
| `src/enigma-article.html` | 1 | `Infinity Enterprises` | Site header and title |
| `src/enigmas.html` | 1 | `Infinity Enterprises` | Site header and title |
| `src/foundation.html` | 1 | `Infinity Enterprises` | Site header and title |
| `src/journal.html` | 1 | `Infinity Enterprises` | Site header and title |
| `src/learning.html` | 1 | `Infinity Enterprises` | Site header and title |
| `src/osint.html` | 1 | `Infinity Enterprises` | Site header and title |
| `src/standards.html` | 1 | `Infinity Enterprises` | Site header and title |
| `src/tech-lounge.html` | 1 | `Infinity Enterprises` | Site header and title |
| `src/youth.html` | 1 | `Infinity Enterprises` | Site header and title |
| `src/motor.html` | 1 | `Infinity Enterprises` | Site header and title |
| `src/ether.html` | 1 | `Infinity Enterprises` | Site header and title |
| `src/not-found.html` | 1 | `Infinity Enterprises` | Site header and title |
| `src/publication-pages.mjs` | 5 | `Infinity Enterprises` | Site header in `shell()` function |
| `src/publication-pages.mjs` | 6 | `· Infinity Enterprises` | Title suffix in page templates |
| `src/publication-pages.mjs` | 33 | `Food enters Infinity` | Food desk copy |
| `src/publication-pages.mjs` | 37 | `original notes from Infinity`, `not Infinity reporting` | Daily Desk copy |
| `src/publication-pages.mjs` | 39 | `Infinity Enterprises` | Search page subtitle |
| `src/publication-pages.mjs` | 41 | `Infinity Enterprises` | Subscribe page form copy |
| `src/publication-pages.mjs` | 43 | `Partner with Infinity` | Partnerships page title |
| `src/standards.html` | Multiple | `Infinity is a magazine…` | Editorial standards copy |
| `src/dispatch.js` | Multiple | `Infinity editorial picks`, `Outside feed unavailable` | Feed fallback messages |
| `src/journal.html` | Multiple | `Infinity on Substack` | Journal page copy |
| `src/tech-lounge.html` | Multiple | `Infinity on Substack` | Tech Lounge copy |
| `build.mjs` | 121 | `Explore Infinity` | Table of contents label |
| `build.mjs` | 123 | `Infinity / The complete index` | Home department index label |
| `build.mjs` | 85 | `Infinity Enterprises` | RSS feed title and description |
| `build.mjs` | 111 | `By Infinity Enterprises Editorial` | Article credit line |
| `build.mjs` | 124 | `Infinity Enterprises` | Fallback page title |

### Issue Label (#13 - Cover and Issue Numbering)

These references are owned by #13 (issue numbering system) and are separate from the publication name:

| File | Line(s) | String | Context |
|------|---------|--------|---------|
| `src/home.html` | 1 | `The September Issue` | Page title and cover copy |
| `src/home.html` | Multiple | `Volume 01 · September 2026`, `September 2026` | Cover stamps and splash kicker |
| `src/home.html` | 1 | `· September 2026` | Footer date |
| `src/publication-pages.mjs` | 6 | `· September 2026` | Footer in `shell()` function |
| `src/not-found.html` | 1 | `· September 2026` | Footer date |

### Parent Company (Keep As-Is)

These references to the parent organization remain as "Infinity Enterprises":

| File | Line(s) | String | Context |
|------|---------|--------|---------|
| `build.mjs` | 113 | `Infinity Enterprises` | JSON-LD author Organization in article schema |
| `src/about.html` | Multiple | Various | About page company information |
| `src/foundation.html` | Multiple | `Infinity Foundation` | Foundation page content |
| `src/feeds.js` | Multiple | `Infinity Enterprises` | SEC User-Agent string |
| `scripts/image-stamp.json` | 1 | `Property of Infinity Enterprises` | Image metadata stamp |

### Tooling and Documentation (Allowed, Not Templates)

These references exist in documentation, scripts, and workflows (not runtime templates):

| File | Line(s) | String | Context |
|------|---------|--------|---------|
| `AGENTS.md` | 21 | `SAVRONO` | Default value documentation |
| `tools/activation-watch.mjs` | 82 | `SAVRONO Activation Watch` | Heading in activation watch script (#122) |
| `.github/workflows/activation-watch.yml` | 1 | `SAVRONO` | Workflow name |
| `.github/workflows/activation-watch.yml` | 16 | `savrano` | Concurrency group name (lowercase variant) |

### Path References (Design Assets, Keep for Compatibility)

These references are path segments and filenames for design assets, not reader-facing text:

| File | Line(s) | String | Context |
|------|---------|--------|---------|
| `README.md` | Multiple | `design/sovrano-v1/` | Design folder path reference |
| `scripts/check-image-metadata` | Multiple | `sovrano-plate.png`, `design/sovrano-v1/` | Asset path and filename checks |
| `test/image-metadata.test.sh` | Multiple | `design/sovrano-v1/`, `sovrano-plate.png` | Path references in image metadata tests |

Changing these paths would break the Image Metadata Check. They are preserved for backwards compatibility.

## Test Protection

The test file `test-publication-name.js` includes:

1. **Config validation:** Ensures `PUBLICATION_NAME` is a non-empty string
2. **HTML escaping:** Verifies `applyPublicationName()` properly escapes HTML entities
3. **Hardcoding guard:** Fails if any source file hardcodes publication name variants
4. **Build verification:** Ensures no `__PUBLICATION_NAME__` tokens remain in built output
5. **Main-release guard:** Prevents working names from reaching the `main` branch

Run `npm test` to verify all checks pass.

## Future Work

Briefs 02 and 03 will adopt the `__PUBLICATION_NAME__` token in page templates, replacing the hardcoded "Infinity Enterprises" references listed in the Publication Name section above.
