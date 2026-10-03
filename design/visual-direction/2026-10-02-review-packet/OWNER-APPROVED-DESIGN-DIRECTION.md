# SAVRONO Design Direction Update — Owner-Approved Record

**Status:** Owner-approved on 2026-10-02. This source-controlled record is review evidence for #127. It still authorizes no runtime, public-site, deployment, or ChatGPT Sites change.

**Design authority hierarchy:**

1. **Owner architecture:** Infinity Enterprises is the parent company; SAVRONO is the flagship quarterly publication.
2. **Publisher controls:** evidence, attribution, rights, accessibility, corrections, disclosure, and reader agency.
3. **Federated desk direction:** every SAVRONO desk may be a distinct visual and editorial journey. No fixed-count visual formula is being reintroduced.
4. **Implementation:** only an issue with a complete Ready contract may translate the direction into runtime source.

## 1. Clear recommendation

Do **not** add the supplied images to PR [#126](https://github.com/threshi-art/infinity-enterprises-site/pull/126).

PR #126 is intentionally narrow: a two-file, design-only concept reference at exact head `7a5fb0a8f7fb7781748d62761400d1e8b698a4e0`. Its acceptance criteria require the concept board to remain a non-runtime study, preserve the current site, and avoid implying that illustrative imagery is production-ready. Adding raw screenshots, personal photos, a DNG, and a new digital-model system would turn it into a materially different asset-rights and art-direction PR.

> **Correct lane:** preserve PR #126 as the visual-vibe anchor, then create a **separate, design-only SAVRONO Visual Direction and Asset Intake package** under the existing #109 guidance once this draft is approved. It will be documentation and original generated design studies only, not a site redesign or deployment.

This keeps the review evidence intelligible:

| Record | Role | Must not become |
| --- | --- | --- |
| #107 / #60 | Owner architecture | A visual implementation ticket |
| #76 | Page-family and federated-principles design documentation | A runtime redesign authorization |
| #109 | Federated art direction and source/rights guidance | A Ready card by itself |
| #125 / PR #126 | Preserved visual-vibe concept | A production template or asset library |
| Proposed follow-on package | Desk bibles, asset provenance, generated studies, digital-model rules | A public-site change |
| Later Ready contract | One bounded runtime implementation slice | A blanket authorization |

## 2. Direction extracted from the supplied references

The references support a coherent house principle, but **not a uniform look**:

> **SAVRONO is cinematic, material, intelligent, and composed. Each desk chooses its own sensory system. The publisher provides the rules of trust, not a template that makes every desk look identical.**

### House constants

| Constant | Meaning in practice |
| --- | --- |
| **Editorial cinema** | Deliberate crops, atmospheric light, strong negative space, cover-level hierarchy, and images that make a claim rather than fill a card. |
| **Material intelligence** | Machinery, print, food, garments, archives, instruments, landscapes, and interfaces are treated as physical evidence with surface and consequence. |
| **Warm/cold tension** | Warm amber, paper, and dusk may coexist with cold cyan, graphite, signal green, or ultraviolet. The accent is desk-specific, not a universal brand palette. |
| **Readable rigor** | Large editorial type, compact metadata, visible provenance, and captions that distinguish reporting, art, archive, illustration, and opinion. |
| **No borrowed identity** | Third-party screenshots and copyrighted poster/art direction are reference material only. SAVRONO must not reproduce their layouts, marks, or imagery. |
| **Reader agency** | Outbound links identify the original publisher/creator and why the reader may want to follow. No disguised aggregation, copied work, or faux newsroom claims. |

### References: how they may and may not be used

| Reference group | Reading | Permitted design lesson | Not authorized for runtime use |
| --- | --- | --- | --- |
| Black holes, eclipse, star field | Scale, gravity, heat, darkness, threshold | Use contrast, radial light, and controlled voids for original Tech, cover, or transition studies | Reusing those images or their embedded type without rights/provenance |
| Vintage computing / futuristic woman screenshots | Retro-future objecthood, human scale against technology | Use tangible machines, sculptural interfaces, and human presence instead of generic SaaS UI | Copying frames, wardrobe, creator marks, or platform UI |
| 9/11 memorial graphic and CNN screen | Somber editorial hierarchy and the difference between reporting and spectacle | Use restraint, source-forward captions, and documentary scale for Daily Desk only | Reusing the imagery, logos, type treatment, or presenting unverified claims |
| Food photographs / steak screenshot | Appetite, heat, texture, preparation as material culture | Lifestyle food can be intimate, sensory, and photographer-led | Recipe instructions, health claims, third-party food photography, or promotional restaurant claims without approval |
| Mercedes photograph | Motion, silhouette, detail, place | MOTOR can be owner-observed, machine-specific, and photographic | Brand endorsement, unverified specifications, or reused third-party car imagery |
| Paddington / dogs image | Whimsy, memory, companionship | A reminder that Lifestyle may admit play and personal texture where it is editorially relevant | Use of Paddington imagery or character association in SAVRONO branding |
| Owner-supplied RAW candidate | Unclassified candidate source photo | Potential owner-supplied editorial image after conversion and provenance confirmation | Any repository or public use before rights, subject, caption, and location context are recorded |

### Asset intake finding

The owner-supplied RAW candidate remains excluded. Current tooling could not render it; that is a tooling limitation, not a content judgment. It remains private until it is converted, inspected, captioned, and its rights confirmed.

## 3. Digital model / house figure proposal

The supplied repeated woman references are treated as an **owner-supplied digital-model reference**, not as an assumed real staff member, journalist, source, or public person.

### Recommended positioning

Use her as SAVRONO’s **House Figure**, a recurring fictional visual presence. She is a visual narrator of atmosphere and transition, not a fake reporter or an implied endorser.

| Approved candidate use | Guardrail |
| --- | --- |
| Feature-cover art and issue promotion | Label generated or illustrated material when a reasonable reader could mistake it for reportage. |
| Opinion, culture, food, and fashion/design background art | She never substitutes for the author, subject, or evidence. |
| Transitions, masthead motion, memes, and ad concepts | No political, medical, financial, or product endorsement without a separate approved disclosure and campaign scope. |
| Tech Lounge visual essays | She may be a nocturnal guide, archivist, or observer, but not the source of technical/security facts. |
| Limited editorial-story characters | A character card states that she is fictional/generated, not an actual contributor. |

### Required pre-publication control record

Before the first public deployment, create a **Digital Model Identity Sheet** with:

1. Working name and one-paragraph persona. The name remains an owner decision.
2. Canonical references, allowed variations, wardrobe/setting boundaries, and prohibited portrayals.
3. Confirmation that the source is owned/licensed for this use, or a model release if the figure corresponds to a real person.
4. Disclosure language for generated/illustrated uses.
5. A negative list: no invented news events, no fabricated documentary photographs, no fake staff identity, no endorsement implication, no sexualized use, no political persuasion in her voice without a separate owner decision.
6. Versioned provenance for every generated derivative used outside a private mood board.

**Recommended first visual role:** not a cartoon mascot. Use a poised, editorial **house figure** with a recognizable silhouette and restrained styling. This is durable enough for cover art and short-form social composition without making the publication feel like a character franchise.

## 4. Tech Lounge: current state and proposed desk bible

### What exists today

**Tech Lounge has not disappeared.** The current studio source and live route are `/tech-lounge`, with a dedicated `tech-lounge.html`, `tech-lounge.jpg`, and `tech-macro.jpg`. Its current mode is a sophisticated *after-hours technology salon*:

- ink-black / aubergine base;
- warm ivory editorial display type;
- amber and violet accents;
- vintage computing, instruments, semiconductor macro photography, and external reading;
- sections for a visual wall, reading desk, and archive screen;
- `Gadgets`, `AI & Robotics`, `Software & Apps`, `Cybersecurity`, `Future Tech`, and `Developer Corner` as current legacy departments.

That page is visually strong and worth preserving as an evidence baseline. It should **not** be flattened into a blue generic technology dashboard.

### Why it feels absent from the current design direction

The Wiki correctly lists **Tech Lounge** as an authoritative SAVRONO desk, but it does not yet give the desk a current, detailed visual bible. The legacy open issue [#47](https://github.com/threshi-art/infinity-enterprises-site/issues/47), *“Room: Tech (Circuit), cold and exact,”* is still written against the earlier redesign map and says it is waiting on an old approval chain. It calls for a cold circuit grid that conflicts, in tone, with the later current `Tech@Lounge` design.

> The solution is not to choose one and discard the other. Treat the **warm, after-hours lounge** as the emotional arrival and the **cold circuit system** as the precision layer inside it.

### Proposed Tech Lounge direction: **The Afterimage Workshop**

| Layer | Direction |
| --- | --- |
| **Editorial premise** | Technology is an object, system, labor practice, cultural force, and source of strange futures. The desk enjoys it without worshipping it. |
| **Arrival** | Dark room, tangible hardware, desk lamp / monitor glow, one statement image. The reader enters a place, not a dashboard. |
| **Information system** | Hard modular grid, monospace labels, source cards, small evidence panels, explicit status labels: *reported*, *essay*, *archive*, *speculative*, *in development*. |
| **Palette** | Obsidian `#080a0d`; smoky aubergine `#171320`; warm paper `#f1ebe3`; circuit cyan `#a9eaf5`; signal amber `#e9bb82`; optional ultraviolet `#6f4a87`. Cyan is an instrument color, not the full background. |
| **Typography** | Editorial serif for the question or essay title; clean grotesk for news hierarchy; mono only for metadata, provenance, technical concepts, and state. |
| **Image grammar** | Original macro hardware, archival computing, workbench scenes, nocturnal interiors, satellite or infrastructure texture, and original conceptual imagery with no embedded claims. |
| **Motion** | Discrete scan / settle, understated cursor or state change, no ornamental floating neon. All optional motion honors reduced-motion preference. |
| **Sound** | Opt-in only. A soft instrument / contact-mic / circuitry atmosphere, never auto-play and never necessary for comprehension. |
| **House figure** | Optional, occasional observer in an editorial art treatment. Never used as a factual technology authority or to dramatize a security incident. |

### Tech Lounge desk clusters

| Current topic | Proposed editorial treatment |
| --- | --- |
| Gadgets | **Objects Under Examination**: design, repairability, ergonomics, supply chain, and lived utility. |
| AI & Robotics | **Bodies and Models**: systems meeting work, art, physical environments, and institutions. |
| Software & Apps | **Interfaces with Consequences**: tools, defaults, permissions, and behavioral design. |
| Cybersecurity | **The Trust Boundary**: evidence-led reporting, public advisories, defensive literacy, and no simulated real-time threat theater. |
| Future Tech | **The Long Bet**: clearly labeled speculative, emerging, or early-stage work. |
| Developer Corner | **The Workbench**: annotated methods, tools, and source-forward build notes. |

### What needs an owner/reviewer decision before runtime work

1. Whether **Tech Lounge** keeps its current `@` spelling publicly or normalizes to “Tech Lounge” while retaining it as a visual mark.
2. Whether its current six legacy department names are revised to the proposed cluster names or merely given new editorial framing.
3. The first actual Tech Lounge content package and rights-cleared art assets.
4. A Ready card naming the exact source files, preservation baseline, tests, visual evidence, reviewer, and target branch.

## 5. Proposed generated image set — design-only, before any runtime use

Generate these as original, text-free design studies. They will be reviewed against the references and placed in a **private design-review packet first**, not committed to a runtime asset directory.

| ID | Study | Brief | Intended validation |
| --- | --- | --- | --- |
| VD-01 | **Federated House Atlas** | A cinematic, text-free mosaic showing nine different SAVRONO atmospheres joined by a subtle publisher geometry. | Demonstrates federation without a common template. |
| VD-02 | **Tech Lounge / Afterimage Workshop** | An analog-digital workbench at night: CRT phosphor, modular instrument panel, macro circuitry, graphite, amber, restrained cyan. | Confirms the Tech desk remains editorial, tactile, and not SaaS. |
| VD-03 | **House Figure / Editorial Arrival** | The owner-supplied digital model as a poised, fictional editorial observer in a timeless black-and-amber photographic setting. No branded uniform or headline text. | Tests repeatable visual identity without impersonation or endorsement. |
| VD-04 | **Lifestyle / Material Table** | Original, non-instructional still life of food, textile, ceramic, and botanical texture; no cannabis promotion and no recipe apparatus. | Separates Lifestyle from generic luxury advertising. |
| VD-05 | **MOTOR / Motion Study** | Original machine image emphasizing surface, speed, engineering detail, and play. No recognizable marque or unlicensed livery. | Anchors broad motion and machines without making MOTOR only automotive. |
| VD-06 | **Daily Desk / Evidence Field** | An original archival-document and city-light composition with structured caption space but no real event claim. | Tests a restrained reporting mode distinct from the cinematic art desks. |

**Non-negotiable:** generated concepts are never evidence, reporting photography, or a substitute for original/cleared issue art.

## 6. Wiki ↔ issue ↔ PR traceability audit

### What is working

The control chain exists. The current Wiki contains authoritative architecture, decision, workstream, and status records. The detailed action plan and workstream ownership page link to a large portion of the active issue set. Current core records identify the SAVRONO structure and distinguish design documentation from runtime authority.

Relevant active controls include:

- [#76](https://github.com/threshi-art/infinity-enterprises-site/issues/76): page-family and federated-visual-principles documentation;
- [#109](https://github.com/threshi-art/infinity-enterprises-site/issues/109): federated desk-journey art direction and source/rights guidance;
- [#125](https://github.com/threshi-art/infinity-enterprises-site/issues/125) / [PR #126](https://github.com/threshi-art/infinity-enterprises-site/pull/126): current limited visual-direction concept study;
- Wiki **Decision Register**, **SAVRONO Publication Architecture**, **Design System**, **Federated Editorial Worlds**, **Brand Positioning and Marketing**, **Visual System and Layouts**, **Detailed Action Plan**, and **Workstream Ownership**.

### What is missing

The traceability is **directionally sound but not yet closed-loop**:

| Finding | Mechanism | Risk | Proposed correction |
| --- | --- | --- | --- |
| Brand, Federated Editorial Worlds, and Visual System pages do not directly cite #109 or PR #126. | They explain the visual rules but lack exact evidence links. | A later contributor can use a generic mood statement instead of the current reviewed artifact. | Add a compact *Design Authority and Evidence* block on each page. |
| PR #126 holds a concept but is intentionally only two files. | It cannot hold raw photos, model references, rights statements, or a full desk bible. | Scope creep or accidental assumption that concept-board imagery is production art. | Preserve its scope and use a separate, reviewed asset-intake / direction package. |
| Tech Lounge has a strong existing route but no current-desk bible. | Old #47 and newer Tech Lounge source are not reconciled. | The next implementer chooses between conflicting eras or produces generic tech UI. | Add the **Afterimage Workshop** desk bible to the #109 follow-on package and link it to #47 as historical input. |
| There is no asset provenance register for the supplied set. | Screenshots, owner photos, and a digital model have different rights implications. | Copyright, source, disclosure, and release errors. | Create a non-public intake register first, then include only cleared/original assets in a source-controlled design library. |
| Issue/PR evidence is not systematically enforced. | Links are maintained manually. | Drift between owner decision, documentation, PR scope, and runtime work. | Add a required four-line PR/Ready-card evidence block and later a small validation script under a dedicated Ready contract. |

### Minimum reusable evidence block

Every future design issue, Ready card, and PR should contain these exact fields:

```md
## Authority and preservation
- Owner/architecture authority: [link]
- Design direction / desk bible: [link]
- Existing source, route, and asset baseline to preserve: [commit/file/route]
- Asset provenance and disclosure status: [record]
```

The corresponding Wiki record should contain:

```md
## Implementation evidence
- Active issue / Ready contract: [link or none]
- Design-study PR and exact reviewed head: [link + SHA]
- Runtime PR: [link or none]
- Release/publication state: not implied by this record
```

## 7. Proposed follow-on package after approval

### Scope: documentation and design studies only

1. A **SAVRONO Visual Direction Catalogue** in the Wiki, linked to the reviewed design source rather than duplicating generated embedded-text art.
2. A **Tech Lounge / Afterimage Workshop** desk-bible page, explicitly connecting current route evidence, historical #47 input, and current #109 direction.
3. A private/controlled **Asset Intake Register** that classifies every supplied image as:
   - reference only;
   - owner-photo candidate pending rights/caption;
   - generated design study;
   - approved source asset.
4. A **Digital Model Identity Sheet**, stored outside the public runtime asset path until rights and persona decisions are complete.
5. The six original generated design studies listed above, each text-free, provenance-marked, and reviewed as conceptual art.
6. Cross-links that close the Wiki ↔ #109 ↔ #125/PR #126 loop without changing the live site.

### Explicitly outside scope

- no source/runtime route, navigation, HTML, CSS, JavaScript, Worker, build, deployment, or ChatGPT Sites publication change;
- no copying of the supplied third-party screenshots, marks, or images;
- no public claim that the digital model is a real contributor;
- no use of the DNG or personal photo candidates until rights and caption metadata exist;
- no replacement or merge of PR #126’s exact reviewed design-study asset.

## 8. Owner approval recorded

The owner approved the following on 2026-10-02. They are now carried through the single #127 review hub; independent review still applies:

1. **Use the House Figure framing** for the digital model, subject to a later name/persona/rights sheet.
2. **Adopt the Tech Lounge “Afterimage Workshop” direction**: warm editorial lounge as arrival; cold circuit rigor as its information layer.
3. **Keep PR #126 unchanged** and create a separate design-only package for the intake register, generated studies, Tech desk bible, and traceability links.
4. **Generate VD-01 through VD-06 as original, text-free design studies** for private review before any source-control filing.
5. **Treat external screenshots as visual references only** and require a rights/provenance decision before any supplied photo becomes a repository or runtime asset.

The visual studies and handoffs are now included in this package. No runtime work may begin unless a later Ready card authorizes an exact source boundary.
