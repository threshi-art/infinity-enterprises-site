# Shared Asset Library

> **Purpose:** one repository-visible discovery point for generated visual material. This library makes assets inspectable and reviewable; it does **not** grant runtime, publication, advertising, or release use.

## Scope and authority

- The library is design documentation. It is not a replacement for `src/assets/`, an asset pipeline, or the current site.
- A library entry records **what an asset is, where it lives, its provenance boundary, and what review remains**. It never substitutes for an approved implementation contract.
- Existing runtime and historic design assets remain at their current repository paths. Do **not** move or bulk-copy them merely to make this index look complete: that would break references, multiply review surfaces, and obscure history.
- A public GitHub repository is not a private staging area. Private source files, unapproved reference photographs, personal material, model/likeness-sensitive images, watermarked outputs, and material without an adequate provenance record stay out of this library.
- SAVRONO remains a working publication name. The library does not create a final public name, route, logo, section count, or visual implementation requirement.

## Library layout

```text
design/assets/
├── README.md                    # this contribution contract
├── ASSET-REGISTER.md            # source-of-truth discovery register
└── <class>/<collection-id>/     # reviewable, non-runtime asset set
    ├── README.md                # collection manifest and use boundary
    ├── CHECKSUMS.sha256         # hashes of committed binary files
    └── <asset files>
```

Use one of these classes unless a focused issue defines another:

| Class | Intended content |
| --- | --- |
| `editorial/` | non-runtime studies for a named desk or issue |
| `identity/` | approved-for-review marks, motifs, or house-image studies |
| `operational/` | internal planning, review, and command-center visual references |
| `texture/` | reusable non-runtime texture studies |

A collection ID should be descriptive and dateable, for example `daily-desk-2026-10` or `fleet-command-center-2026-10`. Keep its contents focused on one issue and one review boundary.

## Mandatory intake contract for every bot

**Do not simply dump images.** Open or claim a focused issue, then add the following in one PR into `studio`:

1. **A collection directory and manifest** that names the issue, collection purpose, generated/AI disclosure where applicable, source/provenance statement, rights status, and explicit non-runtime or authorized-use boundary.
2. **Correctly named files.** The extension must match the encoded format. Keep original aspect ratio unless the issue explicitly authorizes a crop.
3. **One asset card per file** with: asset ID, filename, dimensions, byte size, SHA-256, concise alt text, provenance/rights status, and a statement of whether people, trademarks, place claims, or readable text are present.
4. **Image hygiene:** strip nonessential metadata, apply the repository ownership stamp, and run `npm run check:images`. Do not claim an image is watermark-free solely because a source manifest declares no watermark.
5. **Privacy and rights review:** never add a user's supplied photograph, a real-person/likeness-sensitive image, an unverified external image, or a private source file without the named owner and reviewer gate in the issue.
6. **Independent review:** the PR must name a non-author reviewer and an exact head SHA. Art reviewers check paths, visual fitness, file weight, alt text, manifest truthfulness, and the stated use boundary.

## Promotion rule

An asset registered here is **not automatically usable by the site**. A separate Ready implementation issue must name the exact source path, target runtime path, responsive treatment, performance budget, accessibility treatment, rights decision, tests, and reviewer before any copy is placed in `src/` or rendered on a public page.

## Current review boundaries

- The two images in `operational/fleet-command-center/` are the first registered set. They are generated operational illustrations only; they depict no real system, live issue state, event, or geographic intelligence.
- The visual-direction studies in [PR #128](https://github.com/threshi-art/infinity-enterprises-site/pull/128) are **held review material**. They are not copied here because that PR has open design majors and a mandated later rebuild slot. Their future rebuilt, reviewed assets may be registered after their own gate clears.
- Existing design packs and runtime assets are discoverable through [ASSET-REGISTER.md](ASSET-REGISTER.md). Their current locations and individual manifests remain authoritative.

## Fast contribution checklist

```text
[ ] Focused issue claimed; one owner and status label
[ ] Collection README written before or with binaries
[ ] Generated/AI and provenance disclosure present
[ ] Correct extension, dimensions, alt text, SHA-256 recorded
[ ] Metadata scrubbed and ownership stamp verified
[ ] npm run check:images passes
[ ] No runtime, release, or Wiki claim without a separate authorized issue
[ ] Independent exact-head reviewer named
```

A merge into `studio` is still **not** a live Sites publication.
