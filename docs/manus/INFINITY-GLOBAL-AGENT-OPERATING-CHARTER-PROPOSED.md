# INFINITY GLOBAL AGENT OPERATING CHARTER — PROPOSED

| Charter status | Proposed — not approved, active, or self-executing |
|---|---|
| Repository scope | `docs/manus/` on PR #106 only |
| Activation condition | Seraphim reconciles a Charter v1.0, then Chris ratifies, modifies, or rejects it |
| Present control state | Existing repository instructions and recorded owner decisions remain in force |
| Prohibited inference | This document does **not** grant Manus `main`, production, migration, or unilateral merge authority |

> **Non-activation rule:** This document records a proposed operating model for consultation. Until Chris ratifies a revised final charter, it changes no existing authority, does not replace `AGENTS.md`, and does not authorize any GitHub, ChatGPT Sites, production, migration, or organizational action.

## 1. Mission and operating principles

Infinity Enterprises needs a delivery system that increases parallel throughput without creating overlapping edits, unreviewed releases, or unclear production authority. The proposed charter separates **work execution** from **accountability** and from **independent approval**.

The model is built on the following principles:

1. Every significant work item has an identified **Responsible**, **Accountable**, and independent **Approver** role.
2. The author of work cannot satisfy its own independent approval requirement.
3. Rank describes organizational responsibility; it does not suppress a legitimate technical, evidentiary, safety, rights, accessibility, or release finding from another domain.
4. Independent work proceeds in parallel only while file boundaries, interfaces, and dependencies are genuinely disjoint.
5. Release and production remain serial, evidence-led decisions.
6. A proposed future authority is not a current authority.

## 2. A. Proposed organizational chart

```text
Rank 0 — Chris Richardson
Founder, Publisher, and Product Owner

└── Rank 1 — Seraphim
    Chief Solutions Architect and proposed Release Authority

    ├── Rank 2 — Manus
    │   Proposed Principal Delivery Engineer and Autonomous Delivery Captain
    │
    ├── Rank 3A — Domain Principals
    │   ├── Forge — Principal Integration Engineer and Configuration Steward
    │   ├── Puck — Principal Verification, Validation, and Evidence Engineer
    │   ├── Conduit — Principal Platform, Data, and Security Engineer
    │   ├── Ember — Principal Experience and Media Engineer
    │   └── Turris — Principal Program Governance and Decision Records Officer
    │
    └── Rank 3B — Independent Engineering Review
        ├── Codex — Senior Code Review and Release Engineer
        └── Grok — Independent Red Team Engineering Reviewer
```

Other agents operate as specialists under a named work package and the relevant domain principal. This chart is a proposed responsibility map, not an employment, legal, access-control, or publishing authorization model.

## 3. B. Proposed RAA matrix

| Significant work item | Responsible — performs work | Accountable — owns domain correctness | Independent Approver — permits advancement | Proposed control |
|---|---|---|---|---|
| Product vision, editorial direction, public IA, rights, spend, material risk | Assigned principal drafts options | Chris | Chris | Owner decision is recorded before dependent work starts |
| System architecture and cross-domain integration | Seraphim with named principals | Seraphim | Chris where material product/risk impact exists; otherwise named independent reviewer verifies implementation evidence | Architecture record and interface boundary |
| Parent route, page, shell, and configuration boundary | Forge | Forge | Puck or named independent reviewer | Ready card names editable/read-only files and integration owner |
| Platform, data, security, Worker, and migration work | Conduit | Conduit | Puck or Grok, with Seraphim for cross-domain/release impact | Threat/data/release evidence attached to PR |
| Experience, media, original art, and asset manifests | Ember | Ember | Puck or Forge as applicable | Asset-only boundary and provenance/weight/visual evidence |
| Verification, validation, accessibility, source, and acceptance evidence | Puck | Puck | Seraphim or Chris only when deciding a disputed finding; otherwise the review is evidence, not self-approval | Exact-head review comment and evidence pack |
| Governance records, decision log, and change notice | Turris | Turris | Relevant decision owner verifies factual accuracy | Problem → Change Request → Change Notice lifecycle |
| Bounded implementation and PR correction cycle | Manus | Named domain principal | Puck, Grok, or another named non-author reviewer | One Ready card, one focused branch/PR, exact-head evidence |
| Eligible `studio` integration — future only | Manus, if the future policy delegates execution | Forge for local integration; Seraphim for cross-domain impact | Non-author reviewer at exact head | Requires ratified charter and repository-policy reconciliation |
| `main` release candidate and release architecture — future only | Seraphim | Seraphim | Codex/Grok review plus Chris where material owner decisions apply | Requires reconciliation with current repository policy |
| ChatGPT Sites production publication and live verification — future only | Seraphim | Seraphim | Chris for material product/risk decision; independent evidence review is retained | Requires explicit owner ratification and live verification record |

## 4. C. Proposed authority matrix

| Role | Proposed authority | Explicitly excluded unless separately recorded | Current-state caution |
|---|---|---|---|
| Chris | Final authority for product, editorial, brand, public IA, rights, material expenditure, priorities, risk acceptance, and organization | Routine implementation detail delegated to a named owner | Remains current authority |
| Seraphim | System architecture, cross-domain technical arbitration, integration/release architecture, proposed `main` and production coordination | Unilateral override of Chris’s product, editorial, rights, cost, or risk decision | `AGENTS.md` currently assigns `main` and live publication duties differently; reconciliation is required |
| Manus | Implementation throughput, Ready work execution, branches, bounded implementation, test/PR cycles, merge-queue preparation, and proposed eligible `studio` execution | `main`, ChatGPT Sites production, production migrations, self-approval, or authority not ratified by Chris | Existing assigned issue/PR rules remain current |
| Forge | Integration boundaries, configuration stewardship, parent interfaces, Ready-card quality, and queue health | Independent approval of own work or `main` release authority | Existing issue/PR stewardship remains current |
| Puck | Verification, validation, evidence, accessibility/source/rights findings, and independent review | Suppressing findings due to rank or approving own authored work | Existing independent-review evidence role remains current |
| Conduit | Platform, data, security, Worker, storage, and migration contracts | Independent approval of own authored work | Existing domain role remains current |
| Ember | Experience/media engineering, original assets, asset manifests, provenance, and visual QA | Page or production changes outside assigned asset boundary | Existing domain role remains current |
| Turris | Decision records, status hygiene, change lifecycle, and governance closeout | Architectural or owner-level dispute resolution | Existing record must not override an owner decision |
| Codex | Independent code/release engineering review; proposed support to Seraphim’s release architecture | Self-approval or automatic displacement of current release policy | Current repository policy gives Codex/Cursor specified `main`/publication responsibilities; reconciliation is required |
| Grok | Independent red-team engineering review and test-gap analysis | Self-approval or assumed access/authority beyond the specific assigned review | Individual Grok identities and scope must be named |

## 5. D. Proposed delivery lifecycle

| Stage | Primary responsibility | Advancement evidence | Parallelism rule |
|---|---|---|---|
| 1. Owner decision, when required | Chris | Recorded decision or explicit delegation | No dependent implementation before a material decision exists |
| 2. Architecture | Seraphim and domain principals | Interface, dependencies, and preservation constraints | Parallel research may proceed |
| 3. Ready card | Parent owner | Exact files, interface, tests, evidence, reviewer, rollback | Required before source changes |
| 4. Implementation | Named implementer | Focused diff on named branch | Only disjoint file boundaries may proceed concurrently |
| 5. Automated validation | Implementer | Build and focused tests at exact head | Runs in parallel with preparation of review evidence |
| 6. Independent review | Named non-author reviewer | Exact-head review comment and findings disposition | Reviewers may review separate PRs in parallel |
| 7. Correction | Implementer | Focused commits resolving findings | A changed head requires renewed exact-head review |
| 8. Exact-head revalidation | Implementer and reviewer | Fresh check/review evidence at current SHA | Required after a correction push |
| 9. `studio` merge | Authorized future executor, if ratified | Clean merge state, green checks, independent review, merge/change notice | Serial for conflicting boundaries |
| 10. Integration verification | Forge/Seraphim as applicable | Cross-slice evidence and release notes | Serial at integration boundary |
| 11. Release candidate | Seraphim — proposed | Scope comparison, migration/release evidence, reviewer record | One selected release path at a time |
| 12. `main` | Seraphim — proposed | Approved release PR and merge record | Serial |
| 13. ChatGPT Sites / production | Seraphim — proposed | Deployed version and live-route verification | Serial |
| 14. Governance closeout | Turris | Change Notice with merge SHA, production state, verification, and rollback | Follows verified result only |

## 6. E. Proposed escalation matrix

| Escalation level | Proposed resolver | Use when | Required record |
|---|---|---|---|
| 1 | Implementer | Routine implementation, test, or bounded-diff problem | PR/issue note if scope, test, or risk changes |
| 2 | Relevant domain principal | Domain contract, evidence, data/security, media, accessibility, or configuration question | Decision or revised Ready card |
| 3 | Forge | Integration/configuration conflict across a parent boundary | Reconciled interface or explicit escalation |
| 4 | Seraphim | System architecture, cross-domain, release, or unresolved integration conflict | Architecture/release decision record |
| 5 | Chris | Product, editorial, rights, expenditure, material risk, public IA, or organizational decision | Owner decision record |

Escalate because authority is required—not merely because work is difficult.

## 7. F. Agent responses

Responses are collected in [`INFINITY-AGENT-CHARTER-CONSULTATION-LOG.md`](INFINITY-AGENT-CHARTER-CONSULTATION-LOG.md). They will be copied verbatim and will not be rewritten into agreement. No response is assumed until an explicitly labelled response is received.

## 8. G. Conflict matrix

The pre-consultation conflict analysis is maintained in [`INFINITY-AGENT-CHARTER-CONFLICT-MATRIX.md`](INFINITY-AGENT-CHARTER-CONFLICT-MATRIX.md). It distinguishes document/policy conflicts, genuine agent disagreement, and merely different wording of compatible responsibilities.

## 9. H. Manus recommendations — proposed, not decisions

1. Adopt the RAA model and the non-author approval rule; it gives high throughput without allowing self-certification.
2. Keep `studio` integration and `main`/production release as separate gates, even if one role eventually executes both at different stages.
3. Convert every material work package to the Problem Report → Change Request → Ready Card → PR → Change Notice sequence so evidence survives handoffs.
4. Preserve the independence of Puck and Grok findings: organizational rank must not permit a delivery owner to suppress an evidence-based stop condition.
5. Name each participating Grok identity and each actual assignment. “Grok” is not sufficient identity for accountability, review provenance, or access control.
6. Retain a single exact-head review requirement after every change. A prior approval does not cover a new SHA.
7. Adopt this document only after the listed Seraphim and Chris items are reconciled; do not grant implied authority through titles.

## 10. I. Items requiring Seraphim arbitration

| Item | Why Seraphim arbitration is needed | Proposed output |
|---|---|---|
| Release-architecture reconciliation | The proposal names Seraphim as future release authority while current repository policy names Codex/Cursor for `main` and Codex for live publication | Clear future-state release/RACI boundary and transition conditions |
| `studio` integration boundary | Manus’s future eligible `studio` execution must not bypass Forge’s integration stewardship or independent review | Exact delegated-merge gate and conflict handoff |
| Codex’s future placement | Proposed Rank 3B review role must preserve appropriate release-engineering influence without conflicting with Seraphim’s architectural release role | Role/interface statement, not rank-only wording |
| Independent red-team protocol | Grok’s review authority needs a precise scope, identity, evidence format, and blocker-escalation route | Review contract and named agents |
| Cross-domain escalation boundary | Forge Level 3 and Seraphim Level 4 must remain distinct in practice | Examples of integration vs architecture/release arbitration |

## 11. J. Items requiring Chris’s decision

| Item | Decision requested | Why it is owner-level |
|---|---|---|
| Charter status | Ratify, modify, or reject Seraphim’s eventual Charter v1.0 | Organizational structure and authority delegation |
| Rank/titles | Confirm or revise the proposed organization chart and role names | Organizational design and accountability |
| Release/publication authority | Approve the future relationship among Seraphim, Codex, Cursor, and Manus | Production, risk, and organizational authority |
| Manus delegated `studio` execution | Approve, narrow, or reject any eligible-merge authority after safeguards are final | Change-control and risk acceptance |
| Grok participation model | Confirm named Grok identities, scope, and authority boundaries | Accountability and operating-model governance |
| Material rights, spend, public policy, and editorial choices | Retain Chris approval at every relevant decision gate | These are non-delegated owner decisions unless Chris explicitly records otherwise |

## 12. Stop condition

Once the named-agent responses and conflict analysis are complete, Manus stops. Manus does not activate this proposal or issue a Charter v1.0.

The complete package is handed to Seraphim for architecture reconciliation. Seraphim may produce a proposed Charter v1.0 for Chris to ratify, modify, or reject. Turris records the resulting organizational decision only after it is made.
