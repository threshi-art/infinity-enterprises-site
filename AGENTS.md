# Working in the shared Infinity site repository

These instructions apply to this `infinity-enterprises-site` repository. The parent `Infinity` OneDrive folder contains other projects and files; leave them alone unless the task explicitly concerns them.

## Two GitHub branches

- `studio` is the single shared working branch for Cursor, Grok bots, Manus, Codex, and other contributors. Do not create a branch for each agent as the normal workflow.
- `main` is the reviewed release source. Codex coordinates release review, integration, OneDrive sync, and the separate live Sites publication step.
- Forge is the GitHub steward when given repository access. Forge may triage issues, update PR status and descriptions, note ownership and overlap, keep `studio` aligned with `main`, and prepare release PRs or verified Sites source mirror updates for Codex review.
- Each contributor uses a separate local clone or worktree, checked out on `studio`. The OneDrive clone stays on `main` as Chris's clean release copy. Never have multiple agents edit the same local checkout.

## Intake and release authority

### Chain of command

Chris (owner) sets priorities and makes final product decisions. The principal architect holds architecture authority and reviews major technical gates, returning only at the implementation tranche gate. Echo (deputy solutions architect) supervises daily execution.

### Intake and assignment

Chris sends feature requests and changes to Codex, who triages them. Codex decides whether a GitHub issue is needed, writes the scope and acceptance criteria when it is, and routes the work to the appropriate contributor.

### Work flow and queues

Manus maintains the Ready, Next, and Planned queues. Each contributor claims one item at a time by posting their claim on the issue before starting. After finishing, they pull the next compatible Ready item.

### Contributor roles

- **Forge**: Engineering, source integration, design implementation, `studio` health, release preparation, and GitHub stewardship.
- **Turris**: Coordination, #107 decision index, routing, and status tracking.
- **Conduit**: Integrations, data, privacy, membership systems, analytics, and platform interfaces.
- **Puck**: Research, exact-head verification, evidence, accessibility, and source/rights checks.
- **The Doctor**: Red-team review, security/privacy/rights reasoning.
- **Ember**: Art and sound, ad hoc (request 1:1 via Echo).
- **Manus**: Ready/Next/Planned queues and dependency management.
- **Codex and Cursor**: Implementation and release work where assigned.

### Merge authority

Echo may merge a pull request to `main` only when all of the following conditions hold:

- CI passes
- An exact-head review is current
- No unresolved review comments
- No conflicts
- No open architecture, security, privacy, rights, or owner-decision issue

Separation of duties: Echo never merges a PR that Echo launched or reviewed alone. Puck or Forge signs off on the exact head first. Each exact-head sign-off comment must name the reviewing bot and quote the full 40-character head SHA it checked. The merger then merges pinned to that same SHA (the connector's merge `sha` field, or `gh pr merge --match-head-commit <sha>`), so any push after review makes the merge fail (HTTP 409). GitHub cannot enforce this rule because every bot posts as the same account (threshi-art), so branch protection stays at 0 required approvals and the rule is written and auditable. Codex and Cursor may still merge where assigned.

### Release and publication

A GitHub merge to `main` does not publish the live Site. The principal architect (Codex) reviews `main` and publishes the live Sites deployment. The release chain is: source work → review → `studio` integration → release candidate → `main` → Sites publication → live verification.

### Escalation

Escalate to Chris for unresolved product or editorial decisions, material spend, legal/name clearance, rights acceptance, and public business commitments.

Escalate to the principal architect for material architecture changes, conflicting subsystem contracts, cross-workstream changes, uncertain security/privacy architecture, changes to release controls, major migrations or irreversible production actions, evidence contradicting the architecture, and the implementation tranche gate.

## Take a task

- Read this file, `README.md`, `site-source.json`, and `git status --short --branch` before editing. Fetch the latest GitHub state.
- Track each feature or bug in a GitHub issue with Issue, Description of problem, Root cause, Objective evidence, Proposed corrective action, and acceptance criteria. Mark an unverified root cause as unknown or a hypothesis. Comment with the working agent's name, current status, and files being changed so overlapping work is visible.
- Preserve existing pages, articles, images, assets, and history. If another agent has uncommitted or overlapping changes, coordinate in the issue before editing those files.
- Make focused, complete, buildable commits on `studio` and reference the issue number in the commit or issue comment. Run `npm ci` and `npm run build` for code changes before pushing.

## Share changes safely

- Before pushing, fetch `studio` again. If it advanced, integrate those commits in your own clone and resolve conflicts before pushing. Push normally; retry after another fetch if GitHub rejects a nonfastforward push. Never force push, reset away another person's work, or use `git clean` to resolve a conflict.
- Keep unfinished experiments local until they are ready for other contributors. Stop and coordinate if changes to the same files cannot be combined safely.
- Every PR restates the problem, records the corrective action actually taken, cites objective evidence at the exact head commit, and gives the codeowner or reviewer concrete next steps. For a release with multiple issues, repeat that record per issue. Use `Closes` only when all acceptance criteria are met; use `Refs` for partial or pending live verification. Forge may prepare a release pull request from `studio` to `main` and link the included issues. The reviewer evaluates the build and diff, coordinates a pause on pushes to `studio`, and merges accepted releases. After a merge commit lands, Forge fast forwards `studio` to the new `main` before the next release cycle.
- Do not commit `dist/`, `node_modules/`, credentials, `.env` files, visitor data, or private engineering documents.

## Publishing and syncing

- A GitHub merge does not publish the live ChatGPT Site. The principal architect (Codex) publishes through the Sites project. Forge may prepare the resulting GitHub mirror update only after verifying the exact published Sites version and source commit; the reviewer examines the record before release.
- The publishing machine runs its own copy of the sync script from outside the repo. The helper updates the clean `main` clone only by fast forward. If it stops for local edits, authentication, or diverged history, inspect the work; do not bypass its checks.

## Constraints and standing rules

- SAVRONO is a working name behind a single `PUBLICATION_NAME` config value. It may be renamed before launch.
- Pull requests #77, #97, and #101 are historical reference and must not merge as-is.
- Never force-push to `main` or `studio` without the owner's explicit approval.
