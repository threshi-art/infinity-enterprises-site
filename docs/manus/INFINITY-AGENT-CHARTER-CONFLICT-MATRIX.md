# Infinity Agent Charter Conflict Matrix

**Status:** Phase 2 primary-ballot assessment. Six raw attributable ballots are preserved in [`INFINITY-AGENT-CHARTER-PHASE-2-PRIMARY-BALLOTS.md`](INFINITY-AGENT-CHARTER-PHASE-2-PRIMARY-BALLOTS.md). Codex is the critical outstanding architecture response. No charter authority is active.

> **Evidence-weight rule:** Do not report “six agents agree” as architectural evidence. The Doctor’s ballot identifies shared model ancestry and sequential visibility as correlation risks. This matrix assesses arguments, constraints, and provenance—not numerical vote counts.

## Primary-supported clarifications and new risk items

| Item | Primary evidence | Clarification / risk | Operational consequence | Required next step | Seraphim? | Chris? |
|---|---|---|---|---|---:|---:|
| `studio` gate is an audited rule | Forge; Ember | Forge owns/audits the rule; this does not require Forge personally to approve every `studio` merge | Avoids creating a manual queue bottleneck while preserving controls | Define the rule, audit evidence, exception path, and merge executor in future RAA | Yes | Yes |
| Asset completion | Ember | Asset is not Done until integrated and checked at 390 and 1440; media defects need written objective criteria | Asset-only merge cannot close user-visible performance/visual acceptance | Add target-viewport and objective-defect evidence to media acceptance | No | No |
| Worker bundle growth | Forge | Base64 image variants increase Worker bundle size; Sites bundle limit is unmeasured | #37 integration can produce an undetected deployment/runtime limit | Measure before/after bundle; include only variants pages use | Yes | No |
| Audio static-media risk | Ember | Audio must not be inlined into the Worker; load separate files after opt-in; Sites static serving is unverified | #88 can negate image-weight gains or require an architectural change | Confirm Sites static-media behavior before #88 integration; set per-file/total budgets | Yes | No |
| `studio` versus `main` drift | Forge | Release slices enlarge as `studio` accumulates reviewed work while `main` waits | Release review complexity and risk rise over time | Define lane limit, release cadence, and Seraphim stand-in/timeout rule | Yes | Yes |
| Live verification observability | Puck | Public verification covers routes, statuses, visible behavior, and headers—not deployed Sites version identity | Live check cannot independently prove version provenance | Publisher posts version/time; verifier checks live behavior against that record | Yes | No |
| PR head versus merge state | Puck; Conduit | Exact-head approval may not cover a new base/merge result; base movement is a separate integrity risk | A reviewed head can merge with unreviewed base changes | Require green merge-commit checks and re-read of combined diff when base moves; decide strict-base protection separately | Yes | Yes |
| Production-data observability | Conduit | Conduit has no direct production DB access; verification is public APIs plus posted Sites/database evidence | Charter must not claim unavailable access or false independence | Define observable API checks, producer evidence, verifier scope, and rollback decision threshold | Yes | No |
| Intake versus assignment | Turris | Turris routes/logs asks; does not assign implementation or author Ready Cards; Manus begins coordination once Ready | Avoids governance role silently becoming delivery authority | State routing, Ready authoring, and delivery handoff explicitly | Yes | Yes |
| Decision index | Turris; issue #107 | #107 is an index to primary sources, not a substitute for them | Prevents paraphrased index entries from manufacturing decisions | Maintain source links/status and preserve original evidence | No | No |
| Red Team sampling | The Doctor | Red Team selects samples randomly or by risk; authors do not choose their own samples | Author-selected sampling could skip higher-risk work | Define independent selection mechanism and record selection rationale | Yes | Yes |
| Model ancestry and evidence weight | The Doctor | Correlated agents and sequentially visible ballots do not create independent corroboration | Consensus count may overstate confidence | Require argument/provenance analysis and a second independent model review for same-family-only items | Yes | Yes |

## Genuine disagreements

No direct contradiction exists among the six received ballots. Their shared “YES” statements are not treated as a weighted consensus. The following are open design questions or authority collisions, not settled outcomes:

- the future relationship among Seraphim, Codex, Cursor, and the current `main`/Sites publication policy;
- merge-commit/base-movement enforcement versus an up-to-date branch-protection setting;
- the future executor of eligible `studio` merges versus Forge’s rule-audit accountability;
- static-media serving on the Sites platform before #88 audio integration;
- fast-lane/full-lane risk classification and whether/when The Doctor’s Red Team sampling and diversity controls apply; and
- trusted Owner attribution when operational tools use a shared account.

## Authority collision matrix

| Topic | Current/source evidence | Proposed or unresolved direction | Operational consequence | Required resolver |
|---|---|---|---|---|
| `main` release authority | `AGENTS.md` names Codex/Cursor for review and merge; #107 says Codex publishes Sites separately today | Proposed Seraphim-centered architecture/release role must be reconciled, not assumed | Duplicate gates or false transfer of authority | Seraphim then Chris |
| ChatGPT Sites publication and live verification | Current owner index says Codex publishes and checks live result; Puck separates publisher version record from public verification | Publication and independent verification must be separate functions with explicit evidence handoff | Self-attestation or unprovable version claims | Seraphim then Chris |
| `studio` integration | Forge/Ember describe audited merge rule, not a personal Forge queue; charter proposal assigns Manus delivery after Ready | Gate ownership, merge execution, and non-author evidence must be distinct | Bottleneck or bypass of integration safeguards | Seraphim then Chris |
| Production database verification | Conduit’s direct access is absent | Verification must stay within observable APIs and posted environment evidence | False claims of data validation or access | Seraphim |
| Generic Grok versus named candidate | “Grok” has no accountable identity; #107 records The Doctor as provisional candidate | Candidate status must not become automatic authority | Unclear reviewer provenance/conflicts | Seraphim then Chris |
| Shared-account owner attribution | #107 explicitly treats unconfirmed shared-account statements as non-decisions | Reliable owner-decision provenance remains needed | Accidental policy manufacture through relays/comments | Chris, with Turris index controls |

## Unresolved Seraphim decisions

1. Reconcile `main`, production-migration, Sites publication, and live-verification RAA with current Codex/Cursor policy.
2. Define the audited `studio` merge rule, base-movement/merge-commit validation, exception path, and merge executor.
3. Determine whether strict up-to-date protection applies to `main`, `studio`, both, or neither; preserve Puck’s lighter combined-state rule if strict protection is not selected.
4. Establish Worker bundle budgets and static-media serving behavior before #37 integration completion and #88 audio integration.
5. Define publication evidence, public live-verification evidence, and the limitation that public verification does not prove deployed version identity.
6. Define Conduit’s observable migration preflight/post-release verification scope, execution authority, and explicit database rollback owner.
7. Define Red Team candidate scope, independent sample selection, model-diversity triggers, and blocker escalation.
8. Define fast/full lane classification, reclassification, and the limit/cadence for `studio` versus `main` drift.

## Unresolved Chris decisions

1. Ratify, modify, or reject Seraphim’s future Charter v1.0.
2. Confirm the proposed organization design, including Rank 3A peer-group wording and titles.
3. Confirm or revise The Doctor’s provisional candidate status and any future named Red Team authority.
4. Approve or reject future release/publication/verification and eligible `studio` execution authority arrangements.
5. Decide the trusted attribution method for Owner decisions made through shared tools/accounts.
6. Retain Owner approval for product, editorial, public IA, rights, expenditure, and material-risk decisions.

## Disposition rules

- A direct primary ballot is preserved verbatim; a source index links evidence but does not replace it.
- A genuine conflict requires incompatible, attributable primary positions.
- An authority collision requires Seraphim reconciliation and Chris decision where authority, risk acceptance, or organization changes.
- No row is silently resolved by Manus; no proposed authority is activated by this matrix.
