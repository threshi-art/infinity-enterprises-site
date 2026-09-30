# Infinity Agent Charter Review Prompt

**Review target:** [`INFINITY-GLOBAL-AGENT-OPERATING-CHARTER-PROPOSED.md`](INFINITY-GLOBAL-AGENT-OPERATING-CHARTER-PROPOSED.md)
**Status:** Consultation only. The charter is proposed, inactive, and does not change current authority.

## Purpose

Provide an independent response to the proposed Infinity Global Agent Operating Charter. Identify concrete authority ambiguities, implementation hazards, evidence gaps, and necessary safeguards. Do not assume the proposal is approved merely because it has been circulated.

## Submission rule

Post a dedicated comment on issue #105 beginning with `## <Agent name> — charter review`. Do not edit another agent’s response. Manus will copy received responses verbatim into the consultation log and will not rewrite them into agreement.

Because GitHub comments use a shared account, identify the agent role in the heading and state whether the response is a direct role response or a specialist input. A comment does not confer authority or alter a recorded owner decision.

## Questions for every reviewer

1. Which proposed responsibilities, RAA assignments, lifecycle gates, or escalation steps are sound as written?
2. Which terms or boundaries are ambiguous, overlapping, technically unsafe, or inconsistent with current recorded repository policy?
3. Does any proposal let an author approve its own work, evade exact-head review, or imply unapproved `main`/production authority?
4. What evidence, interface, acceptance criterion, or decision record would be necessary for your domain to operate safely?
5. Which points require Seraphim’s architecture arbitration, and which require Chris’s owner decision?
6. Are any apparent conflicts merely different descriptions of compatible responsibilities? Explain why.
7. State one recommended change, deletion, or guardrail in priority order.

## Domain focus

| Reviewer | Focus requested |
|---|---|
| Forge | Parent integration ownership, `studio` boundary, Ready-card quality, configuration stewardship, and Level 3 vs Level 4 escalation |
| Puck | Independence of validation/review, exact-head evidence, accessibility/source/rights stop conditions, and review-proof integrity |
| Conduit | Platform/data/security/migration contracts, production risk, access boundaries, and fail-closed controls |
| Ember | Asset/media boundaries, provenance, review criteria, and the relation of experience work to integration work |
| Turris | Decision-record lifecycle, label/status governance, Change Notice integrity, and auditability of handoffs |
| Codex | Current versus proposed `main`/release/publication responsibilities, code-review independence, and transition risk |
| Grok | Red-team review scope, identity/accountability, adversarial test expectations, and escalation of material findings |

## Response format

```markdown
## <Agent name> — charter review

**Response type:** Direct role response | Specialist input
**Scope reviewed:** <sections/files>
**Position:** Support | Support with changes | Object | Insufficient information

### Findings
1. <finding and evidence>

### Conflicts or ambiguities
| Topic | Current/proposed text | Consequence | Recommended disposition | Seraphim? | Chris? |
|---|---|---|---|---|---|

### Required safeguards or acceptance evidence
- <item>

### Recommended change
<precise wording, deleted authority, new gate, or decision needed>

### Stop condition
<State what must remain blocked until resolved.>
```

## Non-negotiable boundaries

- This consultation does not activate the proposed charter.
- No contributor gains `main`, ChatGPT Sites production, production-migration, or self-approval authority through a response.
- Existing repository instructions, current issue ownership, and recorded Chris decisions remain in force until Chris explicitly changes them.
- A legitimate technical or evidentiary finding may not be discarded solely because the finding came from a lower-ranked role.
