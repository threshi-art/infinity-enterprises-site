# Traceability and Review Protocol

## Why this record exists

The Wiki contains useful architecture and design controls, while issues and PRs contain active delivery evidence. Without a shared evidence block, a contributor can cite a mood board as authority, lose an asset boundary, or implement an obsolete desk map. This protocol closes that interface.

## Minimum evidence block for future design work

Every future design issue, Ready card, and PR should include:

```md
## Preservation and design traceability
- Owner / architecture authority: [#107 and #60]
- Federated art direction / desk bible: [#109 and relevant desk record]
- Existing source, route, and asset baseline: [commit / file / route]
- Asset provenance and disclosure status: [record]
- Design-study reference and exact reviewed head: [link + SHA]
- Runtime authorization: [Ready card link or none]
```

The corresponding Wiki record should include:

```md
## Implementation evidence
- Active issue / Ready contract: [link or none]
- Design-study PR and exact reviewed head: [link + SHA]
- Runtime PR: [link or none]
- Release/publication state: not implied by this record
```

## Current crosswalk

| Need | Current record | Closure provided by #127 package |
| --- | --- | --- |
| Owner architecture | #107, #60, Wiki SAVRONO Publication Architecture | Repeats authoritative separation of parent, publication, desks, and companion products. |
| Page-family reference | #76 | Links design studies to current desk structure without a runtime claim. |
| Federated art direction | #109 | Supplies a reviewable catalogue, Tech desk bible, and outward-reference / rights controls. |
| Current visual-vibe study | #125 / PR #126 `7a5fb0a8f7fb7781748d62761400d1e8b698a4e0` | Preserves PR #126 as a separate narrow study; does not copy or revise its files. |
| Historical visual evidence | Historical board, legacy #47 | Labels historical/exploratory rather than allowing an old map to become current authority. |
| Asset rights boundary | Current scattered source/review material | Adds a classified intake register and production metadata requirements. |
| Future runtime work | Later desk-specific Ready contract | Requires exact files, preservation baseline, tests, visual evidence, reviewer, and branch. |

## Review responsibilities for this one package

| Reviewer | Required focus |
| --- | --- |
| Puck | Provenance, rights/disclosure language, stale-authority risk, and exact-head evidence. |
| Ember | Federated desk differentiation, art direction, and whether the package accidentally flattens desk identity. |
| Forge | Current-source preservation, integration implications, package boundary, and future implementation feasibility. |
| Principal architect | Architecture, documentation coherence, and separation of current authority from historical studies. |
| Echo | Merge only after green required checks and exact-head independent comments agree. |

## Review route

- **Issue #127** is the central scope/decision thread.
- **The #127 PR** is the central exact-head and line-level review thread.
- Do not ask reviewers to make scope decisions in PR #126, #109, legacy #47, or loose chat replies; link material back to #127 instead.
- A studio merge is documentation/design-asset integration only. It does not publish the ChatGPT Site.
