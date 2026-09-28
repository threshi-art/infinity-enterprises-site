# Infinity page layout templates

**Status:** owner selected the combined system in issue #76: A for the front page, B for visual departments, and C for reading and research, with a dedicated Major Feature cover section. Chris selected **SOVRANO INFINITUM** for the masthead. This is not a live page or a replacement for an approved room. Open [reference.html](reference.html) in a browser to see the responsive layouts. Its images are existing repository assets; illustrative copy is marked as such.

Desktop preview boards use a **1600 × 900 (16:9)** frame. The phone studies remain 390 × 900 portrait. These are viewports into scrolling pages, not fixed page heights.

| Direction | Desktop | Phone | Suggested use |
|---|---|---|---|
| A · Cinematic feature | [Preview](a-desktop.webp) | [Preview](a-phone.webp) | Alternate hero for feature-led departments |
| B · Gallery chapters | [Preview](b-desktop.webp) | [Preview](b-phone.webp) | Motor, travel, culture, image-led departments |
| C · Reading and reporting | [Preview](c-desktop.webp) | [Preview](c-phone.webp) | Daily Desk, Academic Journal, essays and reporting |
| Major Feature cover | [Preview](feature-desktop.webp) | [Preview](feature-phone.webp) | Home Current Issue centerpiece |

The cover section borrows the editorial *scale* of a newsmagazine cover without borrowing another publication's mark or exact cover design. Its art, headline and frame are Infinity's own. It opens the Current Issue after the splash, then hands off to Editorial Picks.

**How to read the studies:** each board illustrates a layout pattern, not another consecutive section of one page. On `/`, the Major Feature **replaces A's hero band**, so `cover.jpg` appears once before Editorial Picks. A's image-led hero remains a possible opening for a feature-led department. B uses MOTOR art to illustrate a gallery chapter; the existing `/motor` experience is governed by D. The HTML study demonstrates responsive flow and controls, while the boards show the approved composition. If their example copy differs, follow the flow here and verify final editorial text in its own issue.

## Which reference wins

1. The actual existing page and its behavior are the preservation baseline: [`src/home.html`](../../src/home.html), [`src/ether.html`](../../src/ether.html), [`src/motor.html`](../../src/motor.html), [`src/form.html`](../../src/form.html), existing article routes, learning paths, foundation concepts, and the projects ledger. The source mirror may lag the published Site; compare with the live route before replacing a visual treatment.
2. Check [`docs/blueprint/NAVIGATION.md`](../../docs/blueprint/NAVIGATION.md) against the recorded ten-section public map before integrating a page. This guide describes layout, not a route migration.
3. This kit defines the visual grammar for new pages and review of changes. Its illustrated text and crops are examples, not approved editorial or final imagery.
4. Where this kit conflicts with [`design/sovrano-v1/`](../sovrano-v1/) on **page composition or the masthead name**, this kit wins. The older pack's room colors, motifs, and other compatible visual work remain useful. The department examples below record the earlier #60 outline; they do not authorize public routes or menu labels. Check the recorded owner decision and current navigation blueprint before applying a composition.
5. [`design/issue-mocks/`](../issue-mocks/) explores possible room directions. A mock is not permission to overwrite an existing page or change a locked journey. Resolve a conflict with the owner in the relevant issue.

The A/B/C labels describe **composition families, not identical page layouts**. A room can vary its grid, typography, color, texture, motif, transition, and editorial pacing inside its family. Music, Tech@Lounge, and Food should remain unmistakably different even with their text blurred, as #35 requires. Do not flatten #31's room identities into one reusable card grid.

## The house style

Think of a cinematic magazine: **a single arresting opening, then an editorial sequence with deliberate changes of scale**. Each page should have a reason to scroll. One strong image and a short line can carry more weight than twelve equal cards. The identity holds across rooms, but each subject gets its own lighting, pace, and visual grammar.

| Element | Baseline | Where to check |
|---|---|---|
| Shell | Compact dark masthead, clear Contents access, visible sound control only where relevant, quiet footer | `src/site.css` and the current page |
| Core palette | Ink `#08101a`, paper `#f4f1eb`, rust `#c77c55`; dark navy feature field and warm cream reading field | `src/site.css`, `src/publication.css` |
| Typography | Small tracked sans labels and navigation; generous, expressive serif headlines and article text; rare display type in a room with a reason | Existing home and publication pages |
| Image | Full bleed or generous editorial crop, an intentional focal point and readable text zone; preserve the original image as an asset | Home, MOTOR, Ether, FORM |
| Rhythm | Opening image → orientation → lead feature → asymmetric secondary stories → deeper departments/related work → quiet exit | Home and department examples below |
| Controls | Legible at rest, high contrast on focus; sound off until chosen; visible controls over immersive images | `src/site.css`, `src/ether.html`, `src/form.html` |

Do not turn every department into the same three-card grid. Do not paste a photo above a title as the entire composition. Do not make every piece of text faint: quiet captions still need readable contrast. Motion serves an entrance or transition, then yields to reading. Reduced-motion visitors get the content without a blocking animation. A cinematic splash is skippable, and never hides navigation.

Use dark rust `#8a4526` for small text on paper; `#c77c55` is an accent and fails small-text contrast on `#f4f1eb`. Treat the previews as composition studies, not a pixel-perfect type specification. The smallest visible label in a new page should be at least 10 CSS px, with readable contrast and larger text where practical.

## Page flows

### A. Front page · `/`

**Desktop:** skippable, silent opening → compact masthead → **Major Feature cover and story introduction** → Editorial Picks as deliberately unequal stories → three distinct windows into Culture, Motor, and Food → additional sections and development → footer. The Major Feature reads as an issue cover: portrait art with a bold house title and headline, paired with a spacious introduction and one clear Read feature action. An opening may be cinematic; the front page must still give immediate access to Contents and the issue.

**Phone:** opening with visible Skip → the cover art occupies its own generous portrait panel → feature headline and introduction follow → picks stack by editorial rank → Culture, Motor, Food appear as full-width chapters. Keep text on a deliberately dark or quiet part of each image or in its own paper panel. No horizontal strip as the only way to reach a feature.

### B. Department landing · most sections

**Desktop:** room-specific hero and short thesis → two lead features at different scales → restrained subsection index → one immersive or reported feature → recent stories → cross-room door. A subsection is a heading and editorial entry point, not a pile of identical tiles.

**Phone:** hero crop is art-directed for the subject → lead first, second story next → subsections as a vertical list → later features. Header and Contents remain reachable. Existing department pages are the starting point; a new template should wrap their content rather than discard it.

### C. Reading and reporting · Reading Room, Daily Desk, Journal, articles

**Desktop:** clear title and scope → one lead with evidence/byline/date → topical index → readable story or feed rows → sources/methods/related reading. Use paper to make reading comfortable. The Daily Desk separates reporting from **Agentic@Enigmas** opinion, and labels outside links as outside links. Journal pages give abstracts, methods, and citations real space.

**Phone:** title and lead first; indexes collapse to a simple vertical list; article measure remains readable. A feed failure is honestly labeled and cannot masquerade as live news. Finance data gets timestamps, source, and delayed/unavailable states before any analysis.

### D. Immersive room · Ether, MOTOR, FORM

These are intentionally **not interchangeable department cards**. The image or scene occupies the viewport. Controls are sparse but findable, text is short, and transitions follow the room's character. Give each scene a real route back to its parent department and the publication menu.

- **Ether Room `/ether`:** the existing Cosmic Groove opening/slot 01 remains intact. The five-slot lobby is a separate addition under Music. A selected journey changes image and sound together as the visitor moves; sound starts only after explicit user action. Preserve creator credit, playable/upcoming truth, player close, keyboard access, and mobile playback behavior. See #56 for room-specific release decisions.
- **MOTOR `/motor`:** treat supercars and classics as objects of desire: detail → silhouette → full reveal → craft/history. Keep its charcoal, oxblood, and cream atmosphere. Racing can enter as a different pace. Avoid a showroom grid or a giant pasted car photo with little editorial direction.
- **FORM:** preserve full-viewport martial arts and meditation imagery, nearly invisible but readable captions, discreet previous/next arrows, and optional ambient music. Pose, breath, energy, and purpose take precedence over combat instruction. Keep the route from Forge & Flow easy to find.

## Historical department composition examples

This table records the department outline in #60 as historical layout examples. The approved public map has ten sections: The Daily Desk, Culture, MOTOR, Food, The Practice, Music, Academic Journal, Tech Lounge, In Development, and About. Re-key the examples to that map during integration; do not create routes from the older table. The A/B/C composition families do not depend on the older names.

The layouts are families, not rigid component inventories. The distinguishing column is what gives each page its own character. The first two features named in the owner outline are editorial slots, not instructions to invent stories.

| Department | Template | Distinguishing treatment and entry sequence |
|---|---|---|
| Home / Current Issue | Major Feature, then A's editorial rhythm | Splash, flagship cover and story, Editorial Picks, Culture/Motor/Food windows; do not repeat A's sample hero |
| Fin@Tech | C with B opening | Market theater with timestamped data and source notes; analysis distinct from prices and promotion |
| The Reading Room | C | A quiet doorway to Outside Signals, Editorial Picks, Agentic@Enigmas, Daily Desk |
| Culture | B | Fashion, art, screen and nightlife as scene changes, with prominent feature photography |
| Travel & Leisure | B | Expansive destination image, itinerary/story, slower pacing and tactile details |
| Pets | B, gallery variation | Hero portrait and curated reader-submitted gallery; consent/credit and status visible, no implied submission without approval |
| Motor | D with B editorial exits | Existing MOTOR presentation leads; racing and reviews enter afterward |
| Food | B | Sensory lead, then recipes, people, science, drinks, places; not a uniform recipe grid |
| Forge & Flow | B to D | Practice and recovery lead to FORM's still, full-screen sequence; sport coverage remains accessible |
| Music | B to D | Editorial music landing opens Ether Room prominently; five journeys have their own art and truthful playback state |
| Academic Journal | C | Research, abstract, methods, evidence, peer commentary; deliberate reading measure |
| Tech@Lounge | B/C hybrid | More precise modular rhythm for devices, AI, security, software; keep sources and dates clear |
| In Development | B/C hybrid | Projects as honest working states and milestones, not invented product launches |
| About the Enterprise | C | Purpose, people/Diana, standards, provenance, and clear ownership |

## Review contract for every bot and reviewer

Attach a 1440px desktop and 390px phone capture to any page pull request. In the description, identify the template family, the existing route used as the baseline, the visual reason for deviations, and what happens to its images, links, editorial content, sound, keyboard flow, and reduced motion. Test the actual first viewport, one middle transition, and the exit on both sizes. Check a quiet caption over the brightest and darkest image positions. Verify every source/date/credit claim independently; this kit contains no reporting.

Before changing Ether, MOTOR, or FORM, compare the proposed page side by side with its current published experience and cite the relevant issue. Keep every existing asset and route until an explicit replacement is approved. If a proposed room mock conflicts with this preservation rule, raise it in the issue rather than silently swapping the aesthetic.

## Reproducing the preview boards

Run `python design/page-templates/render_studies.py` from a checkout with the current `src/assets/` files. It writes self-contained SVG studies beside this guide. To reproduce the committed WebP previews, export each SVG with Inkscape at its declared page size, then convert to WebP with ImageMagick quality 72. For example: `inkscape design/page-templates/a-desktop.svg --export-filename=/tmp/a-desktop.png` and `convert /tmp/a-desktop.png -quality 72 design/page-templates/a-desktop.webp`. The SVGs and intermediate PNGs are generation outputs, not committed assets.
