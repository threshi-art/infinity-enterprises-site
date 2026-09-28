# Ukraine desk base map

| file | purpose |
|---|---|
| `base.svg` | Base map for the Ukraine desk. It is a fixed backdrop that the page draws event markers over. It has no text, no markers, no front lines and no occupied-area shading. |

- **Size:** 34,240 bytes. SHA-256 `b90beabf7d72061f0f524a80e9694be2ea13950e131aa2daf2badd35c7fe4073`.
- **Accessibility:** the root has `aria-hidden="true"` and no `role`. It is decorative, and the page supplies any text alternative.
- **Read-only:** placement code reads this file and never edits it.

## Geometry contract

All values are attributes on the root `<svg>`, so placement code reads them from the file instead of hard-coding them.

| attribute | value |
|---|---|
| `data-projection` | `equirectangular` (plain: x is linear in longitude, y is linear in latitude, north at the top) |
| `data-west` / `data-east` | `22.0` / `40.5` (degrees east) |
| `data-south` / `data-north` | `44.0` / `52.5` (degrees north) |
| `data-center-lat` | `48.25`, which is (south + north) / 2 |
| `viewBox` | `0 0 1000 690.00` |
| `preserveAspectRatio` | `xMidYMid meet` |

The `viewBox` math works like this. Width divided by height equals (east − west) × cos(centre latitude) / (north − south), which is 18.5 × cos(48.25°) / 8.5 = 18.5 × 0.665882 / 8.5 = 1.449272. With W = 1000, H = 1000 / 1.449272 = 690.0017, rounded to `690.00`. The cosine factor is a single constant, so the mapping stays linear:

```
x = (lon - west) / (east - west) * W
y = (north - lat) / (north - south) * H
```

The corners map to (0,0), (1000,0), (0,690) and (1000,690), and the centre maps to (500,345). Kyiv (30.52 E, 50.45 N) maps to (460.54, 166.41). A point outside the box has no position on this map. Ukraine, including Crimea, spans 22.13–40.16 E and 44.38–52.37 N, so it sits inside the box without clipping. All geometry is clipped to the box.

These attributes are the only copy of the box and the `viewBox`. Placement code must read them from this file and never keep a second copy in config or JS. An `<img>` tag or a CSS background hides the attributes from page scripts, so code that reads them must inline the SVG or fetch it and parse it. Markers belong in `viewBox` units, inside the SVG's own coordinate system, not in CSS pixels. The read-back test works the height out from the attributes and compares it with the `viewBox` to within 0.01, so a change to one without the other fails the test.

## Source and license

- **Data:** Natural Earth, **version 5.1.2** (tag `v5.1.2` of `nvkelso/natural-earth-vector`, commit `f1890d9f152c896d250a77557a5751a93d494776`), 1:10m scale. **Public domain** (https://www.naturalearthdata.com/about/terms-of-use/). No attribution is required, and the SVG comment credits it anyway.
- **Files used** (from `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/<path>`):
  - `10m_cultural/ne_10m_admin_0_countries_ukr` (Admin 0, **Ukraine point of view**): neighbouring country shapes and the Ukraine outline check.
  - `10m_cultural/ne_10m_admin_1_states_provinces`: Ukraine's 27 first-level units (24 oblasts, Crimea, Kyiv City and Sevastopol). Their union forms the Ukraine fill and outline.
  - `10m_physical/ne_10m_lakes`: the Dnipro reservoirs, the Dniester estuary and the Syvash.
  - `10m_physical/ne_10m_rivers_lake_centerlines`: the Dnipro only.
- **Why the point-of-view file:** Natural Earth's default `ne_10m_admin_0_countries` (and its `_iso` file) put Crimea inside Russia. The Ukraine point-of-view file follows the internationally recognised boundary (UN General Assembly resolution 68/262) and puts Crimea and Sevastopol inside Ukraine. Within this box it is identical to Natural Earth's USA point-of-view file. Choosing the point of view is an editorial decision for the site owner.
- **Kakhovka Reservoir left out:** Natural Earth v5.1.2 still shows the reservoir full, but it drained after the Kakhovka dam was destroyed in June 2023. Drawing it would show a body of water that no longer exists. The Dnipro centreline still runs through that stretch.
- **Processing:** features were extracted around the box and simplified with topology-preserving Douglas–Peucker at a 1,500 m interval (about 1.1 px at W = 1000), so shared borders stay shared. They were then projected with the formula above, clipped to the box, and written with coordinates rounded to 0.1 px. Fragments under 1 px² were dropped. The file is generated from the data and not drawn by hand.

## Styling hooks

Draw order and default fills or strokes. The page can restyle any of them through these classes.

| class | default |
|---|---|
| `.sea` | full-size rect, fill `#0d0f14` (opaque background) |
| `.countries` | wrapper group for the land shapes |
| `.land` | the 9 neighbouring countries, fill `#1a1d24`, each with `data-a3` (BGR, BLR, HUN, MDA, POL, ROU, RUS, SRB, SVK) |
| `.ua` | Ukraine including Crimea, fill `#242833`, `data-a3="UKR"` |
| `.lake` | fill `#0d0f14` |
| `.river` | the Dnipro, stroke `#0d0f14` |
| `.oblast` | internal boundaries, stroke `#cfc8bd` at 0.22 opacity |
| `.border` | neighbouring borders and coasts, stroke `#cfc8bd` at 0.35 opacity |
| `.ua-outline` | Ukraine border and coast, stroke `#f4efe6` at 0.6 opacity |

Every stroke uses `vector-effect="non-scaling-stroke"`, so line weights stay the same at any display size.
