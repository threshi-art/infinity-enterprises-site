# Infinity Enterprises product plan

**Status:** Working product architecture, recorded September 28, 2026. This document guides design and issue planning. It does not approve a new public route, editorial claim, paid feature, or live release. Chris makes product and editorial decisions in the decision log.

## Purpose and reader

Infinity Enterprises is a public editorial home, a workshop for ideas, and a record of work. Its opening should be beautiful and welcoming; its deeper reporting, essays, research, culture, music, and projects should reward curiosity. It speaks to people whose identity is larger than their job: people who work hard and still care about art, food, machines, sound, technology, law, and the world. Accessibility to that reader matters more than assuming an executive title or income.

The experience has one recognizable house identity and distinct room atmospheres. A visitor can arrive for a car, a restaurant, or a visual feature and find a carefully sourced question worth staying with. The site is openly evolving, but a published factual claim still needs evidence and an editor.

## Editorial shape

| Layer | Reader promise | Initial treatment |
|---|---|---|
| Current issue | A strong visual opening and a small set of selected stories | A flagship feature, Editorial Picks, clear paths into the rooms, and an archive |
| Recurring desk | A dependable view of what is happening | Stable navigation beneath changing leads; dated outside links and original context |
| Distinct rooms | Culture, MOTOR, Food, The Practice, Music and the other subjects have their own pace | Shared masthead and controls, room specific visual and sound language |
| Deeper work | Research, original essays, OSINT methods, policy thinking, and working projects | Separate reporting, analysis, opinion, and project states; visible sources and uncertainty |

The repository README records a ten section public map: The Daily Desk, Culture, MOTOR, Food, The Practice, Music, Academic Journal, Tech Lounge, In Development, and About. Chris's later discussion raised a possible Reading Room containing The Daily Desk. **That hierarchy is an open decision on #60.** The older fourteen department page and earlier nine room design studies remain historical source and are not permission to change the public menu. Do not silently replace existing public labels or routes.

Proposed editorial areas for exploration, without new top level routes yet:

- **The Daily Desk:** recurring news links, concise context, and clear source dates. Agentic@Enigmas is its opinion room under the current map.
- **OSINT:** methods and evidence led work with explicit sourcing, limitations, and editorial review. A source directory does not imply every source or claim is verified.
- **The Tank:** outside thinkers and original policy or economic analysis, with permissions or links to their own work. No contributor or commission is implied before agreement.
- **Gray zone:** cross subject explainers that trace a cause, consequence, evidence, and unknowns.
- **Music and Ether:** a few featured listening journeys with creator credit, archive access, and sound only after a visitor's explicit action. Preserve the existing Ether Slot 01 journey.

The final names, hierarchy, editorial charter, and placement of OSINT, The Tank, law, and the gray zone require Chris's decision and their own bounded issues. The Reading Room option can be modeled as an editorial environment without creating a route while that decision is open.

## Content and data contracts

An original story needs at least an ID, title, canonical route, section, story type, summary, named human editor, publication state and date, byline or authorship disclosure, source references, and image provenance. An outside link additionally needs the publisher, original URL, source date if available, last checked time, and a label that tells the reader they are leaving Infinity. Approved published records alone may enter public lists, feeds, previews, or responses. Drafts and scheduled future copy stay behind a server side eligibility boundary.

Label an item by its actual type and evidence, such as reporting, analysis, opinion, research, outside link, or project update. Do not assign an outlet a blanket political leaning by intuition. If the publication later offers perspective labels, define a documented, reviewable method at the item level first. Do not republish third party articles, images, audio, or maps without rights; link and attribute where appropriate.

Keep the initial platform a single Sites Worker with source controlled assets and editorial manifests. Add persistence only where a capability needs it, such as an approved feed snapshot cache or private scheduling. Specify the schema, stale state, failure behavior, owner, and migration preflight before publishing that capability. Do not add a new service or paid account just to support a speculative feature.

## Delivery sequence

| Increment | Scope | Exit evidence |
|---|---|---|
| 1. Stabilize | Reviewed phone header, overflow, contrast, and other independent fixes | Exact head checks, phone and desktop inspection, Sites publication, live version and route checks |
| 2. Editorial spine | Current issue flow, repeatable story metadata, outside link treatment, archives | Readers can find a lead, a recurring desk item, and an older piece; publication controls prevent drafts from leaking |
| 3. Room identities | Subject specific visual and sound treatment while preserving Ether, FORM, MOTOR, original essays, learning paths, foundation concepts, and the project ledger | Keyboard, phone, sound, reduced motion, and visual review per room |
| 4. Deeper desks | OSINT, outside thinkers, policy and cross subject work after charter and placement decisions | Named editor, source trail, rights and review evidence, clear distinction between reporting and opinion |
| 5. Membership experiment | Test reader demand before accounts, paywalls, or commissions | An approved offer, cost and privacy review, measured reader feedback, and a reversible test |

Release small coherent slices from `studio` to `main`. A green build does not approve art or factual claims. The author records exact files and tests; a different agent reviews the exact head; Codex or Cursor reviews and merges a release; Codex publishes through Sites and verifies the live route and version. A source merge, a saved Sites version, and a successful live deployment are separate facts. A rollback restores the previous known good Sites version and records what was reverted.

## Decision rights and evidence

Chris owns product direction, editorial approval, spending, and public section choices. Codex owns architecture and release recommendations, with Cursor an authorized `main` reviewer and merger under `AGENTS.md`. Forge stewards issues and `studio`; the PR author may merge to `studio` after independent exact head review and green required checks. Puck supplies verification and findings, Ember assets, Conduit integrations and operational evidence, and Turris the decision log. An agent owns the accuracy of the work it reports. A shared GitHub account does not authenticate which person or agent made a statement.

Record decisions with date and a direct Chris source. A comment written under the shared account alone is not owner approval. See [AGENTS.md](../AGENTS.md) for the operative contribution and release rules and [#60](https://github.com/threshi-art/infinity-enterprises-site/issues/60) for the open hierarchy decision.
