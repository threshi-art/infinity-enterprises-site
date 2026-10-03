# SAVRONO Activation Board

> **CONTROL RECORD · REPOSITORY-NATIVE · HUMAN-MAINTAINED**
>
> Make the next safe move: **one complete Ready contract → one focused branch/PR → one independent review → separately governed release and Sites publication.**

This is a compact coordination surface for the SAVRONO implementation program. It is designed to render cleanly in GitHub, live beside the source, and be linked from the [Control Tower Wiki page](https://github.com/threshi-art/infinity-enterprises-site/wiki/Control-Tower) **after this file is merged and independently reviewed**.

> [!IMPORTANT]
> This board is **not live telemetry**. GitHub Issues, pull requests, checks, and issue comments remain authoritative for exact scope, acceptance criteria, review state, and branch heads. A GitHub merge is never a ChatGPT Sites publication.

---

## Signal strip

| Program state | Operating rule | Current execution order |
| --- | --- | --- |
| **Architecture:** locked | Do not reopen settled parent/publication decisions inside an implementation slice. | **#88 → #94** |
| **Implementation:** contract-gated | A queue position is not permission to write source. A parent owner posts `Ready` first. | Serial, focused, reviewable |
| **Release:** independent lane | Source work, `studio` integration, `main` release, and Sites publication are distinct states. | Codex governs publication |

```text
READY CARD → FOCUSED BRANCH → EXACT-HEAD REVIEW → STUDIO INTEGRATION
                                              ↓
                                  SEPARATE RELEASE / SITES GATE
```

---

## Activation rail

> **Manual status snapshot · 2026-10-02:** recheck the cited issue, pull request, exact head, and review comments before acting. This page intentionally does not replace their live records.

### 01 · Now: unlock Manus’s next focused source PR

| Packet | Status | Single action that unlocks it | Implementer after Ready |
| --- | --- | --- | --- |
| [#88 · Room ambience controller](https://github.com/threshi-art/infinity-enterprises-site/issues/88) | **Corrective PR [#124](https://github.com/threshi-art/infinity-enterprises-site/pull/124) open; current checks and fresh exact-head rereviews pending** | Puck reviews code/evidence; Ember reviews **manifest handling only** against the current PR head. | Manus: `manus/88-room-ambience` into `studio` |

**#88 preservation boundary**

- Editable only: `src/music.js`, root `test-room-sound.js`, and one `package.json` test-script entry.
- Read-only: `src/ether.js`, page/templates, `build.mjs`, `src/worker.js`, CSS, `src/departments.mjs`, manifest, and audio assets.
- Existing `#music-toggle` remains the mount point. There is no markup change, Ether change, or audio-asset addition.
- Sound defaults off. Placeholder rows request nothing. Missing/invalid manifest or media fails safely to the current drone. Ether’s existing event suppresses ambience.
- Puck performs the non-author exact-head code/evidence review. Ember checks **manifest handling only**. Forge owns the separate manifest-injection integration.

> [!NOTE]
> Forge posted the parent Ready marker in [issue comment 5946533264](https://github.com/threshi-art/infinity-enterprises-site/issues/88#issuecomment-5946533264). Manus pushed the current corrective #124 head after the prior review hold; the remaining gate is fresh non-author exact-head review plus current checks, not a new source branch or a #94 start.

### 02 · Next: stage the serial follow-on

| Packet | Status | Allowed first slice | Explicitly excluded |
| --- | --- | --- | --- |
| [#94 · Schedule eligibility evaluator](https://github.com/threshi-art/infinity-enterprises-site/issues/94) | **Staged, not Ready** | Pure `isEligible(item, now, approvedEditors, currentHash)` logic with controlled-clock tests after Forge posts Ready. | Database, migration, API, editor UI, public preview, job, service account, or unpublished copy. |

The proposed narrow boundary is:

```text
Editable:  src/schedule-eligibility.js
           test-schedule-eligibility.js
           package.json (one test-script entry)

Read-only: db/schema.ts, drizzle/, src/worker.js, src/admin.html,
           build.mjs, and all public editorial data
```

An empty approved-editor list is a valid fixture and holds every item. The evaluator must report reasons, fail closed on malformed input or errors, and never decide publication on its own. Forge’s current staged contract says #94 becomes Ready only **after #88’s source PR merges into `studio`**, because both slices edit the same `package.json` test-script line. Green #88 checks alone do not open #94.

### 03 · Hold: resolve one named gate, not a cloud of uncertainty

| Packet | Controlling gate | Assigned decision/evidence owner | What must not happen early |
| --- | --- | --- | --- |
| [#81](https://github.com/threshi-art/infinity-enterprises-site/issues/81) | Sample-data placement | Owner / parent owner | Present samples as market prices |
| [#82](https://github.com/threshi-art/infinity-enterprises-site/issues/82) | Named editor + reviewed static source basis | Editorial owner + Puck | Draw inferred front lines or make a live-map claim |
| [#87](https://github.com/threshi-art/infinity-enterprises-site/issues/87) | Parent route/transition interface | Forge | Guess the room/door contract |
| [#89](https://github.com/threshi-art/infinity-enterprises-site/issues/89) | #13 Cover Story and issue-numbering decision | Chris + Forge | Select or invent current-issue material |
| [#90](https://github.com/threshi-art/infinity-enterprises-site/issues/90) | Moderator/storage/retention/access contract | Chris + Conduit | Create public upload or client-side publish behavior |
| [#91](https://github.com/threshi-art/infinity-enterprises-site/issues/91) | Verified sources, chosen timing, curated marks, final handoff | Puck + Chris + Forge | Mark unverified media playable |
| [#92](https://github.com/threshi-art/infinity-enterprises-site/issues/92) | Splash choice + component boundary | Chris + Forge | Build a first-arrival treatment without selected concept |
| [#93](https://github.com/threshi-art/infinity-enterprises-site/issues/93) | Approved contributor records + named human editor | Chris + Forge | Invent people, bios, photos, or approvals |

---

## Ready-card entry test

A source slice starts only after its parent owner posts **every** required element on the child issue:

| Required field | Why it exists |
| --- | --- |
| `Status: Ready` | Makes the parent owner’s go/no-go decision explicit. |
| One bounded child issue + target branch | Prevents a broad program task from becoming an unreviewable implementation bundle. |
| Exact editable and read-only files | Prevents file-boundary collisions and accidental integration work. |
| Interface / mount point / data contract | Lets the implementation and review agree on the system seam. |
| Dependencies and preservation rules | Keeps existing source, rights, security, and editorial constraints intact. |
| Tests and required evidence | Defines what evidence proves the bounded slice, including phone/desktop checks where visual. |
| Named independent reviewer | Keeps the author from self-reviewing the head they wrote. |
| Release / Sites boundary | Prevents a focused source PR from becoming an implied release or publication decision. |

<details>
<summary><strong>Copy: Ready reply format</strong></summary>

```markdown
## Ready
- Slice:
- Target branch: studio
- Exact editable files:
- Read-only / preservation boundary:
- Interface / mount point:
- Tests and required evidence:
- Independent reviewer:
- Release / Sites boundary:
```
</details>

<details>
<summary><strong>Copy: Blocked reply format</strong></summary>

```markdown
## Blocked
- Single blocker:
- Decision or evidence owner:
- Smallest next action:
- What remains explicitly out of scope:
```
</details>

---

## How to use this board

1. **Start with the rail.** Work the first listed packet only when its status becomes `Ready` on GitHub.
2. **Read the issue.** This page does not supersede the issue body, its latest parent-owner handoff, or the exact current branch state.
3. **Claim before editing.** The assigned contributor records branch and expected files on the issue, then works one compatible slice at a time.
4. **Review the exact head.** The reviewer names the bot, quotes the full head SHA, distinguishes code read from build proof, and records blockers or deferred minor findings.
5. **Do not collapse states.** A branch, PR, `studio` merge, `main` merge, and Sites publication are separate evidence events.

---

## Wiki integration rule

The Control Tower Wiki remains the high-level orientation surface. This repository file is the durable, reviewable implementation companion.

**After the documentation PR is merged to `studio` and has a recorded non-author exact-head review**, add this single bridge under the Wiki Control Tower’s delivery/control section:

```markdown
- [Repository-native SAVRONO Activation Board](https://github.com/threshi-art/infinity-enterprises-site/blob/studio/docs/operations/SAVRONO-ACTIVATION-BOARD.md) — compact Ready/Next/Hold operating view; issues and pull requests remain authoritative.
```

Do not add a Wiki link to an unmerged branch. Do not copy mutable issue state into multiple pages without a dated source snapshot.

---

## Boundaries

- This file does not create, close, reassign, merge, publish, deploy, schedule, or automate work.
- It does not alter the public SAVRONO site, Worker, routes, navigation, source assets, or ChatGPT Sites configuration.
- It does not assert that the working name **SAVRONO** is cleared or final.
- It preserves the standing rule: **only a complete parent Ready card authorizes a new focused source slice.**

**Maintainer:** Manus maintains the Ready / Next / Planned orientation; parent owners maintain their own contracts; GitHub remains the system of record.
