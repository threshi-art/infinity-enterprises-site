# Infinity Enterprises — Accelerated Global Delivery Workflow

**Status:** Proposed for Chris’s review with GPT/Seraphim and the six Grok bots
**Purpose:** Replace round-robin coordination with a controlled parallel pipeline that produces auditable, mergeable pull requests without letting bot activity alter the live OpenAI Site outside Seraphim’s release lane.

> **Core rule:** A bot may research, draft, test, or review in parallel. Only one named owner may modify a defined source-file boundary at a time, and every source change ends in one focused pull request.

---

## 1. Current operational picture

### GitHub snapshot — 29 September 2026, 1:56 PM PT

- **71 open issues** remain. Most are design, decision, parent-integration, or deployment work—not immediately code-ready work.
- **Six open PRs** are currently clean and have passing Build + report-only Accessibility/Performance checks:

| PR | Target | What it is | Current closeout need |
|---|---|---|---|
| [#104](https://github.com/threshi-art/infinity-enterprises-site/pull/104) | `studio` | Public repository-hygiene documentation | Independent docs/security review |
| [#102](https://github.com/threshi-art/infinity-enterprises-site/pull/102) | `studio` | Image-weight WebP exports and manifest | Asset, route-coverage, and visual review |
| [#101](https://github.com/threshi-art/infinity-enterprises-site/pull/101) | `studio` | Product architecture and editorial plan | Independent editorial/docs review |
| [#77](https://github.com/threshi-art/infinity-enterprises-site/pull/77) | `studio` | Canonical page-layout studies | Resolve existing comments, then approve |
| [#103](https://github.com/threshi-art/infinity-enterprises-site/pull/103) | `main` | Focused release slice 3a, no migrations | Release-scope review and explicit production approval |
| [#97](https://github.com/threshi-art/infinity-enterprises-site/pull/97) | `main` | Broader release slice 3 | Decide whether it is superseded by #103 or is the intended release candidate |

- There are **no active or failed current Actions runs**. Earlier cancelled Accessibility runs were caused by the workflow’s `cancel-in-progress` setting; the latest runs for the active PR heads are successful.
- The a11y job is **report-only**. A green result proves the job ran; it does not by itself mean the report has no findings.

### Principal bottleneck

The constraining resource is **not coding capacity or CI**. It is a missing single-threaded **release/merge lane**:

1. PRs sit green without assigned independent reviewers;
2. overlapping release PRs remain open at the same time;
3. parent owners issue draft handoffs, while implementers wait for a formal Ready marker;
4. production authority is blurred between GitHub `main` and the OpenAI/ChatGPT Sites deployment.

This workflow resolves those four constraints.

---

## 2. Authority and responsibility model

| Role | Primary responsibility | May modify source? | May merge? | May update/publish the actual OpenAI Site? |
|---|---|---:|---:|---:|
| **Chris** | Product owner; makes material editorial, hierarchy, public-route, data-rights, cost, and production decisions | Optional | Final authority | Final authority |
| **Seraphim (GPT/Codex)** | Production integrator and release owner; reconciles `main` with the real ChatGPT/OpenAI Site | Yes, in its assigned integration boundary | Yes, after gates | **Yes — exclusive execution lane** |
| **Manus** | Implementation for bounded specialist slices; release captain/merge-queue preparation; test and evidence verification | Yes, only in a posted Ready boundary | Only after the policy below is approved | **No** — never manually alters the production Site |
| **Forge** | Parent owner and integration architect; owns route/page/shell decisions, editable-file boundaries, and Ready cards | Yes, in parent integration PRs | No self-merge | No |
| **Ember** | Original visual and audio assets, asset manifests, provenance and visual QA | Yes, asset-only boundaries | No self-merge | No |
| **Puck** | Source/reuse verification, factual review, accessibility/acceptance evidence, independent review | Normally no implementation source changes | No | No |
| **Conduit** | Data, Worker/backend, privacy/security contracts, migrations, server-test review | Yes, in bounded backend PRs | No self-merge | No |
| **Turris** | Issue hygiene, decision log, release ledger, handoff normalization, stale/duplicate detection | No production feature changes | No | No |
| **Grok code/release bot** | Independent code review, test-gap review, and regression analysis | Only when explicitly assigned a disjoint slice | No self-merge | No |

> If the sixth Grok identity has a different name, assign it the **Grok code/release bot** function above. Do not duplicate Seraphim’s production role or Manus’s implementation role.

### Non-negotiable separation

- **Seraphim alone** executes actual ChatGPT/OpenAI Site updates and any real production publication.
- **No agent merges its own PR.**
- **No direct `main` pushes.** Production release is always a reviewed PR plus Seraphim’s explicit deployment/release record.
- A manifest, map, editorial hierarchy, source, asset, route, or database policy remains unchanged unless Chris has made that decision in an issue comment or a linked decision record.

---

## 3. The new workflow: One board, five lanes, hard gates

### A. One authoritative control board

Use **issue #64 as the release control room** until a GitHub Project board is configured. Every active item must have:

- one `owner:*` label;
- one status label: `status:blocked`, `status:ready`, `status:in-progress`, `status:needs-review`, `status:merge-queue`, `status:awaiting-release`, or `status:released`;
- one parent issue, if it is a child slice;
- one named non-author reviewer;
- one exact branch and PR link once work starts.

Turris updates this board only when a status actually changes. No general status chatter.

### B. Record lifecycle: problem → change → notice

To eliminate repeated debate, distinguish GitHub pull requests from change-management records:

| Lifecycle | GitHub label | Required content |
|---|---|---|
| **Problem record** | `record:problem` | Observed fact, reproduction/evidence, risk, and owner |
| **Change request** | `record:change-request` | Approved desired outcome, exact scope, dependencies, acceptance criteria |
| **Ready implementation card** | `status:ready` | Exact editable/read-only files, interface, tests, evidence, reviewer, rollback/preservation rule |
| **Pull request** | `status:needs-review` | One focus, exact head SHA, test output, evidence links, issue reference |
| **Change notice** | `record:change-notice` + `status:released` | Merge SHA, production result, release time, verification, rollback reference |

A bot cannot turn a Problem record into a Change request by itself. Chris or the named parent owner must make the decision visible.

### C. Five concurrent lanes

| Lane | Lead | Parallel work allowed | Output |
|---|---|---|---|
| **1. Decisions and handoffs** | Chris + Forge + Turris | Puck/Conduit can draft options and risks | One decision and one Ready card—not five competing designs |
| **2. Evidence and assets** | Ember + Puck | Asset production, provenance, rights and accessibility checks | Asset-only PRs and evidence packs |
| **3. Bounded implementation** | Manus, Conduit, or Forge | Only when each slice has disjoint editable files | One focused PR per issue |
| **4. Review and closeout** | Manus as release captain; Puck/Grok-Codex as reviewers | Reviews may occur in parallel for different PRs | Approved/changes-requested disposition at exact SHA |
| **5. Integration and production** | Seraphim | Serial only | `studio` integration, one selected `main` release PR, actual Site publication, Change Notice |

### D. Ready-card gate

Before any code bot begins, Forge/Conduit/parent owner posts this compact card on the issue:

```markdown
## Ready — <issue number> — <short slice>
- Branch / target: `manus/<issue>-<short-name>` → `studio`
- Editable: `<exact files>`
- Read-only / preservation: `<exact files and invariants>`
- Interface: `<input/output/event/schema/version>`
- Dependencies already satisfied: `<links and exact commit if applicable>`
- Tests: `<focused test names and scenarios>`
- Evidence: `<build/test output, desktop/phone, a11y/rights/source evidence>`
- Reviewer: `<named non-author>`
- Integration owner: `<name>`
- Rollback: `revert this PR; no migration/data/publication side effect in this slice`
```

No edits outside that card. If a requirement changes, the parent owner edits/reposts the card; the implementer stops and rebases scope.

---

## 4. Fast execution plan

### Sprint 0 — clear the release traffic jam (today)

**Objective:** convert the six green PRs into a single, unambiguous release plan before adding more parent-integrated work.

1. **Turris:** create one #64 merge queue table listing #104, #102, #101, #77, #103, and #97 with target branch, exact head SHA, reviewer, test state, a11y-report state, and disposition.
2. **Puck:** independently review #102 (asset manifest, route coverage, resized image claims, visual checks) and #77 (accessibility/preservation checks).
3. **Grok code/release bot:** independently review #104 and #101 for correctness, public-information hygiene, and stale/conflicting statements.
4. **Forge:** resolve outstanding comments on #77 and #103, or mark each comment as non-blocking with a reason.
5. **Seraphim + Chris:** choose **one** main-release path:
   - **Recommended working default:** treat #103 as the focused release candidate because it is newer and explicitly migration-free; either close #97 as superseded or state exactly why both releases are necessary.
   - Never merge #97 and #103 into `main` as overlapping “maybe” releases.
6. **Manus:** prepare the merge queue, inspect exact PR heads and workflow artifacts, verify all review gates, and perform the merge operation **only if Chris/Seraphim adopts the delegated-merge policy below**.

### Sprint 1 — ship an isolated Manus feature PR

**Priority: #88, opt-in room ambience controller.**

The latest Forge/Ember handoff chain supplies a bounded, high-value implementation slice:

- editable: `src/music.js`, `test-room-sound.js`, and the `package.json` test-script entry;
- read-only: worker, build, templates, styles, Ether script, assets and manifest;
- uses the existing accessible `#music-toggle`, route-keyed fixture manifest, local preference, and existing `infinity-audio-start` Ether-suppression event;
- no media assets, no new licenses, no page markup, no worker changes, and no production release.

**Execution:** Manus posts/receives a formal Ready line on #88, branches from current `studio`, implements and tests the controller, opens **one PR into `studio`**, and names Puck as independent reviewer. Seraphim integrates only after the PR is approved.

**Why #88 first:** it is a real product increment, has a tight boundary, avoids unresolved public hierarchy decisions, and does not depend on live data, assets, routes, a database, or production deployment.

### Sprint 2 — second isolated logic slice

**Candidate: #94, schedule-eligibility evaluator—not the database, API, editor view, or release automation.**

Its pure evaluator slice can be a second, independently reviewable PR only after Forge records the final Ready card that ratifies the existing Puck/Conduit contract:

- `src/schedule-eligibility.js`
- `test-schedule-eligibility.js`
- one test-script entry

It should have controlled-clock tests and fail closed; it must not create a route, a table, a migration, an editor UI, a scheduled publisher, or any public content.

### Explicitly defer until their real blockers close

| Issue | Do not start until |
|---|---|
| #81 ledger | Forge posts its exact mount/preview-evidence method; no orphan visual module |
| #82 Ukraine map | Named editor, placement, public framing, and final parent Ready card; no unsourced war claims |
| #87 doors | Room tokens, mount and transition contract exist |
| #89 story selector | #13 cover and issue-numbering decision is recorded |
| #90 moderator UI | Moderator/storage/retention and authenticated server contract are decided |
| #91 Ether journeys | Final editable/read-only boundary and source/playable decisions are recorded |
| #92 splash | Chris selects the splash concept and Forge posts boundary |
| #93 contributor profiles | Contributor schema, approved identities, named editor, and disclosure wording exist |

This is speed through **fewer false starts**, not speed through broad speculative coding.

---

## 5. Merge and release policy

### Manus delegated-merge policy

If Chris approves this policy once, Manus may merge a PR **to `studio` only** when all of the following are true:

1. target branch is `studio` and the PR is clean;
2. Build is green at the exact current head;
3. the report-only a11y artifact is reviewed by the named reviewer where the PR changes a visual surface;
4. one named **non-author** reviewer has left an explicit approval or an issue comment with a clear approval at that exact SHA;
5. all blocking review comments are resolved or explicitly dispositioned by the reviewer;
6. PR scope matches its Ready card, contains no migration, secret, production setting, third-party license, or public content-policy change;
7. no other open PR modifies the same source boundary in a conflicting way;
8. Manus records merge SHA and result in #64 as a Change Notice.

### Main and production policy

- **Seraphim controls `main` release PR selection, merge execution, OpenAI Site update, and publication verification.**
- `main` releases require the above checks plus a release-scope comparison to identify superseded PRs and migrations.
- No agent treats “merged” as “live.” Seraphim posts the Change Notice only after verifying the actual deployed route/build.
- A defect found after merge is a new Problem record with a rollback/revert link, not a quiet patch to production.

---

## 6. Communication cadence

### What bots post

- **Implementer:** one start note, one PR summary, one completion note.
- **Reviewer:** one approve/request-changes comment with specific SHA and findings.
- **Parent owner:** one Ready card or one concise blocker card.
- **Turris:** status labels/ledger updates only.
- **Seraphim:** integration/release/publishing Change Notices.

### What bots stop doing

- No “draft handoff” is treated as approval.
- No five-bot replies to a single status update.
- No re-litigating decisions that Chris already recorded.
- No generic “CI green, therefore merge” conclusion.
- No code PR that changes integration files owned by another bot.
- No manual production update outside Seraphim’s lane.

### Daily two-message rhythm

1. **Start-of-cycle board:** Turris posts changed statuses, Ready cards, blockers requiring Chris, and the merge queue.
2. **End-of-cycle release note:** Manus posts PR/test/review state; Seraphim posts `studio`, `main`, and actual Site state.

That is enough coordination. Everything else is work.

---

## 7. Paste-ready directive for GPT / the bot room

```markdown
# Adopted delivery protocol — Infinity Enterprises

We are moving from discussion-first coordination to a five-lane delivery system.

1. Chris owns material product, editorial, rights, hierarchy, cost, and production decisions.
2. Seraphim is the sole production integrator: only Seraphim updates or publishes the actual OpenAI/ChatGPT Site. No direct main pushes.
3. Manus owns bounded implementation slices and release closeout. Every Manus code change becomes one focused PR into studio; Manus does not merge its own PR or touch production.
4. Forge owns parent integration and must post one formal Ready card before any child implementation starts: exact editable/read-only files, interface, tests, evidence, reviewer, integration owner, and rollback rule.
5. Ember owns original assets/provenance; Puck owns source/rights/accessibility evidence and independent review; Conduit owns backend/security/data contracts; Turris owns the #64 decision and release ledger; the Grok code/release bot performs independent code/test review.
6. No bot begins from a draft. No bot works outside its exact file boundary. No agent treats a green report-only a11y check as a zero-finding signoff.
7. A non-author reviewer approves the exact head before a studio merge. Manus may merge to studio only under the recorded delegated-merge checklist. Seraphim alone selects, merges, and verifies main/production releases.
8. Current immediate sequence:
   - Turris builds the #64 merge queue for #104, #102, #101, #77, #103, and #97.
   - Review and resolve those PRs; Seraphim/Chris choose #103 or #97 as the sole current main release path.
   - Forge posts #88 Ready; Manus ships the bounded #88 ambience-controller PR into studio.
   - Then Forge posts #94 Ready for the pure schedule-eligibility evaluator; Manus ships that as a separate PR.
9. Do not start #81, #82, #87, #89–#93 until their listed parent decisions and Ready cards exist.
10. Every merged/released change gets a Change Notice: merge SHA, production state, verification, and rollback link.

The purpose is faster delivery through explicit ownership, parallel evidence/review, and serial integration—not through overlapping speculative edits.
```

---

## 8. Decision requested

Approve or adjust these three operating choices:

1. **Manus merge authority:** may Manus merge clean, independently approved `studio` PRs under the checklist, while Seraphim retains `main` and production authority?
2. **Release candidate:** is #103 the selected successor to #97, or should #97 and #103 be compared by Seraphim before either reaches `main`?
3. **Immediate implementation:** confirm #88 as Manus’s next source PR, followed by the isolated #94 evaluator only after its Ready card is posted.
