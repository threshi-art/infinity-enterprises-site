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

| File | Location | String | Context |
|------|----------|--------|---------|
| `src/home.html` | `<a class="site-brand">` | `Infinity Enterprises` | Site header brand text |
| `src/home.html` | `<title>` | `· Infinity Enterprises` | Page title suffix |
| `src/home.html` | `<span class="hub-meta">` | `From Infinity` | Section labels (multiple) |
| `src/home.html` | Cover copy | `Infinity after hours`, `INFINITY`, `not an Infinity news report` | Cover stamps and text |
| `src/about.html` | `<a class="site-brand">`, `<title>` | `Infinity Enterprises` | Site header and title |
| `src/admin.html` | `<a class="site-brand">`, `<title>` | `Infinity Enterprises` | Site header and title |
| `src/atlas.html` | `<a class="site-brand">`, `<title>` | `Infinity Enterprises` | Site header and title |
| `src/development.html` | `<a class="site-brand">`, `<title>` | `Infinity Enterprises` | Site header and title |
| `src/diana.html` | `<a class="site-brand">`, `<title>` | `Infinity Enterprises` | Site header and title |
| `src/enigma-article.html` | `<a class="site-brand">`, `<title>` | `Infinity Enterprises` | Site header and title |
| `src/enigmas.html` | `<a class="site-brand">`, `<title>` | `Infinity Enterprises` | Site header and title |
| `src/foundation.html` | `<a class="site-brand">`, `<title>` | `Infinity Enterprises` | Site header and title |
| `src/journal.html` | `<a class="site-brand">`, `<title>` | `Infinity Enterprises` | Site header and title |
| `src/learning.html` | `<a class="site-brand">`, `<title>` | `Infinity Enterprises` | Site header and title |
| `src/osint.html` | `<a class="site-brand">`, `<title>` | `Infinity Enterprises` | Site header and title |
| `src/standards.html` | `<a class="site-brand">`, `<title>` | `Infinity Enterprises` | Site header and title |
| `src/tech-lounge.html` | `<a class="site-brand">`, `<title>` | `Infinity Enterprises` | Site header and title |
| `src/youth.html` | `<a class="site-brand">`, `<title>` | `Infinity Enterprises` | Site header and title |
| `src/motor.html` | `<a class="site-brand">`, `<title>` | `Infinity Enterprises` | Site header and title |
| `src/ether.html` | `<a class="site-brand">`, `<title>` | `Infinity Enterprises` | Site header and title |
| `src/not-found.html` | `<a class="site-brand">`, `<title>` | `Infinity Enterprises` | Site header and title |
| `src/publication-pages.mjs` | `header` const | `Infinity Enterprises` | Site header in `shell()` function |
| `src/publication-pages.mjs` | `shell()` title | `· Infinity Enterprises` | Title suffix in page templates |
| `src/publication-pages.mjs` | `/food` route | `Food enters Infinity` | Food desk copy |
| `src/publication-pages.mjs` | `/daily-desk` route | `original notes from Infinity`, `not Infinity reporting` | Daily Desk copy |
| `src/publication-pages.mjs` | `/search` route | `Infinity Enterprises` | Search page subtitle |
| `src/publication-pages.mjs` | `/subscribe` route | `Infinity Enterprises` | Subscribe page form copy |
| `src/publication-pages.mjs` | `/partners` route | `Partner with Infinity` | Partnerships page title |
| `src/standards.html` | Page body | `Infinity is a magazine…` | Editorial standards copy |
| `src/dispatch.js` | Fallback strings | `Infinity editorial picks`, `Outside feed unavailable` | Feed fallback messages |
| `src/journal.html` | Page body | `Infinity on Substack` | Journal page copy |
| `src/tech-lounge.html` | Page body | `Infinity on Substack` | Tech Lounge copy |
| `build.mjs` | `mainNav` const | `Explore Infinity` | Table of contents label |
| `build.mjs` | `homeIndex` const | `Infinity / The complete index` | Home department index label |
| `build.mjs` | `feedXml` const | `Infinity Enterprises` | RSS feed title and description |
| `build.mjs` | Article credit replace | `By Infinity Enterprises Editorial` | Article credit line |
| `build.mjs` | `page()` fallback | `Infinity Enterprises` | Fallback page title |

### Issue Label (#13 - Cover and Issue Numbering)

These references are owned by #13 (issue numbering system) and are separate from the publication name:

| File | Location | String | Context |
|------|----------|--------|---------|
| `src/home.html` | `<title>` | `The September Issue` | Page title and cover copy |
| `src/home.html` | Cover stamps | `Volume 01 · September 2026`, `September 2026` | Cover stamps and splash kicker |
| `src/home.html` | `<footer>` | `· September 2026` | Footer date |
| `src/publication-pages.mjs` | `shell()` footer | `· September 2026` | Footer in `shell()` function |
| `src/not-found.html` | `<footer>` | `· September 2026` | Footer date |

### Parent Company (Keep As-Is)

These references to the parent organization remain as "Infinity Enterprises":

| File | Location | String | Context |
|------|----------|--------|---------|
| `build.mjs` | JSON-LD `author` field | `Infinity Enterprises` | JSON-LD author Organization in article schema |
| `src/about.html` | Page body | Various | About page company information |
| `src/foundation.html` | Page body | `Infinity Foundation` | Foundation page content |
| `src/feeds.js` | User-Agent header | `Infinity Enterprises` | SEC User-Agent string |
| `scripts/image-stamp.json` | `stamp` field | `Property of Infinity Enterprises` | Image metadata stamp |

### Tooling and Documentation (Allowed, Not Templates)

These references exist in documentation, scripts, and workflows (not runtime templates):

| File | Location | String | Context |
|------|----------|--------|---------|
| `AGENTS.md` | Line 21 | `SAVRONO` | Default value documentation |
| `tools/activation-watch.mjs` | Line 82 | `SAVRONO Activation Watch` | Heading in activation watch script (#122) |
| `.github/workflows/activation-watch.yml` | `name` field | `SAVRONO` | Workflow name |
| `.github/workflows/activation-watch.yml` | `concurrency.group` | `savrano` | Concurrency group name (lowercase variant) |

### Path References (Design Assets, Keep for Compatibility)

These references are path segments and filenames for design assets, not reader-facing text:

| File | Location | String | Context |
|------|----------|--------|---------|
| `README.md` | Path references | `design/sovrano-v1/` | Design folder path reference |
| `scripts/check-image-metadata` | Path checks | `sovrano-plate.png`, `design/sovrano-v1/` | Asset path and filename checks |
| `test/image-metadata.test.sh` | Path checks | `design/sovrano-v1/`, `sovrano-plate.png` | Path references in image metadata tests |

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
