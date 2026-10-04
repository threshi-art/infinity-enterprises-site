# Shared Asset Register

> **Discovery register, not a runtime manifest.** This document identifies the public repository locations and review state of known visual collections. The linked collection manifest remains the source of truth for each collection's detailed provenance and rights boundary.

## Status key

| Status | Meaning |
| --- | --- |
| **Registered** | This library contains the binaries, manifest, and checksum record. Non-runtime unless an approved implementation issue says otherwise. |
| **Referenced** | Public repository collection remains in its existing location and is discoverable here; it has not been moved or duplicated. |
| **Held** | Review material exists in a PR or controlled workstream but cannot be copied, promoted, or treated as approved. |
| **Unclassified** | Material exists in the repository, but this register does not assert it is generated art, cleared for reuse, or fit for migration. |

## Registered collections

| Collection ID | Location | Contents | Status | Use boundary | Governing record |
| --- | --- | --- | --- | --- | --- |
| `OPS-FLEET-2026-10` | [`operational/fleet-command-center/`](operational/fleet-command-center/) | 2 generated operational illustrations | **Registered** | Review and command-center reference only; no runtime, editorial, geographic, or live-state claim | [Collection manifest](operational/fleet-command-center/README.md), #169 |

## Referenced collections

| Collection / record | Existing location | Status | Why it remains there | Review / use boundary |
| --- | --- | --- | --- | --- |
| Ether Room scene and mood-card masters | [`../ether/masters/MANIFEST.md`](../ether/masters/MANIFEST.md) | **Referenced** | Existing master, web-asset, and card paths are already referenced by the Ether implementation | Manifest specifies generated-art credit and room-specific constraints; no bulk move |
| Draft design pack and editorial art | [`../sovrano-v1/README.md`](../sovrano-v1/README.md) | **Referenced** | Historical design-pack organization and existing mock references must remain stable | Draft/reference only; its older public-map and naming statements are not current architecture authority |
| Issue mockups | [`../issue-mocks/README.md`](../issue-mocks/README.md) | **Referenced** | HTML/PNG pairs are issue evidence, not a reusable image library | Placeholder wireframes; not a public-design approval or runtime asset grant |
| Runtime asset tree | [`../../src/assets/`](../../src/assets/) | **Unclassified** | Moving or duplicating site assets would risk broken paths and performance drift | Individual source, rights, and runtime decisions remain with the implementation issue; add future collection records here rather than bulk copying |

## Held review material

| Collection / record | Location | Status | Hold reason | Required next step |
| --- | --- | --- | --- | --- |
| SAVRONO visual-direction review packet: six desk studies and one historical board | [PR #128](https://github.com/threshi-art/infinity-enterprises-site/pull/128) | **Held** | Four material desk-identity findings remain open; the House Figure replacement and the privacy-corrected Wiki bridge have their own gates; the mandated merge order requires a later rebuild | Rebuild from current `studio` at its final sequence slot, then obtain the required image, provenance, design, and exact-head reviews before any library registration |

## Registration rule

When a new collection is approved for **review visibility**, add one row above and link its collection README. When an asset is approved for runtime, record the implementation issue that grants the promotion; do not imply runtime approval simply because the binary is visible in this register.
