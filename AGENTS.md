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

Chris sends feature requests and changes to Codex. Echo (deputy solutions architect) routes requests alongside Codex. Codex decides whether a GitHub issue is needed, writes the scope and acceptance criteria when it is, and routes the work to the appropriate contributor.

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

Echo may merge a pull request to `main` or `studio` only when all of the following conditions hold:

- CI passes
- An exact-head review is current
- No unresolved review comments
- No conflicts
- No open architecture, security, privacy, rights, or owner-decision issue

Separation of duties: The sign-off must come from a bot that didn't launch, write or push to the PR, and Echo never merges a PR Echo launched or reviewed alone. Puck or Forge signs off on the exact head first. Each exact-head sign-off comment must name the reviewing bot and quote the full 40-character head SHA it checked. The merger then merges pinned to that same SHA (the connector's merge `sha` field, or `gh pr merge --match-head-commit <sha>`), so any push after review makes the merge fail (HTTP 409). GitHub cannot enforce this rule because every bot posts as the same account (threshi-art), so branch protection stays at 0 required approvals and the rule is written and auditable. Codex and Cursor may still merge where assigned.

Making independence checkable: Every PR body names its launching bot ("Launched by: <bot>"). Every sign-off (a review or comment) names the reviewing bot and quotes the full 40-character head SHA. Before merging, the merger checks that the two names differ and that the SHA matches the current head. If either check fails, don't merge.

### Release and publication

A GitHub merge to `main` does not publish the live Site. The principal architect (Codex) reviews `main` and publishes the live Sites deployment. The release chain is: source work → review → `studio` integration → release candidate → `main` → Sites publication → live verification.

### Escalation

Escalate to Chris for unresolved product or editorial decisions, material spend, legal/name clearance, rights acceptance, and public business commitments.

Escalate to the principal architect for material architecture changes, conflicting subsystem contracts, cross-workstream changes, uncertain security/privacy architecture, changes to release controls, major migrations or irreversible production actions, evidence contradicting the architecture, and the implementation tranche gate.

## Assigning work to agents

- Labels are the assignment. Every open issue and PR carries exactly one `owner:<agent>` label. Current labels: owner:forge, owner:codex, owner:conduit, owner:puck, owner:ember, owner:manus, owner:chris. Adding a new agent means creating its owner label first.
- Only the current owner, Chris, or Codex changes an issue's owner label; a handoff is recorded in a comment.
- Status labels show where it stands: `status:in-progress` means the owner is actively working it, so nobody else starts overlapping work; `status:needs-review` means work is up and needs a non-author review at the current head. No status label means unclaimed or waiting.
- Before starting, check the issue's labels and the open PRs. If another owner label plus status:in-progress is present, do not start; comment instead.
- To claim: set your owner label and status:in-progress, then post a comment that starts with your agent name, gives your status, and lists the files you expect to change.
- Branches are named `<agent>/<issue>-<slug>` (for example `forge/67-header-brand`), and PR titles include the issue number.
- When the PR opens, move the issue and PR to status:needs-review and name the reviewer, who must be a different agent from the author. When the PR merges into studio, remove status:needs-review, keep the owner label, and set status:awaiting-release; the issue stays open until the release PR to main lists it. When the owner hands off, switch the owner label and record the handoff in a comment.
- Because the GitHub author is always threshi-art, the agent name in the comment or PR body is the record of who did the work.
- When one agent's piece of work sits inside an issue another agent owns, open a sub-issue under the parent (for example 'Art: #71 channel posters'). The sub-issue carries its own owner and status labels and its own branch (for example `ember/71-posters`); the parent keeps its owner.

## Take a task

- Read this file, `README.md`, `site-source.json`, and `git status --short --branch` before editing. Fetch the latest GitHub state.
- Track each feature or bug in a GitHub issue using the issue template sections: Description, Steps to Reproduce (for bugs), Expected Behavior, Actual Behavior (for bugs), Root Cause, Proposed Corrective Action, Objective Evidence & Screenshots, Environment, Acceptance criteria, and Owner and handoff. The workflow is aligned with ISO 9001:2015 (evidence-based decision making, documented nonconformities and corrective actions) and ISO/IEC/IEEE 12207 (configuration and maintenance management) principles. Mark an unverified root cause as unknown or a hypothesis. Comment with the working agent's name, current status, and files being changed so overlapping work is visible.
- This repository is public: never put personal details (emails, account names, tokens, IP addresses) in screenshots, logs or the Environment section.
- Preserve existing pages, articles, images, assets, and history. If another agent has uncommitted or overlapping changes, coordinate in the issue before editing those files.
- Each issue ships as a pull request into `studio` that follows the PR template and uses `Refs #N`. Make focused, complete, buildable commits on a branch cut from `studio` and reference the issue number in the commit or issue comment. Run `npm ci` and `npm run build` for code changes before pushing.
- For work finished without a PR (for example a comment-only task), post a completion comment on the issue with these sections: Root Cause, Corrective Action Taken, Objective Evidence, Environment, Final notes to reviewer.

## Share changes safely

- Before pushing, fetch `studio` again. If it advanced, integrate those commits in your own clone and resolve conflicts before pushing. Push normally; retry after another fetch if GitHub rejects a nonfastforward push. Never force push, reset away another person's work, or use `git clean` to resolve a conflict.
- Keep unfinished experiments local until they are ready for other contributors. Stop and coordinate if changes to the same files cannot be combined safely.
- Every PR into `studio` follows the PR template sections: Description, Related Issue (using `Refs #N`), Objective Evidence & Screenshots (with Before/After table), Type of Change & Corrective Action (listing what actually changed, and identifying content preserved, moved, or removed), Checklist, and Final notes to reviewer (naming the peer reviewer). Release PRs from `studio` to `main` list `Closes #N` only when the issue's full acceptance criteria are satisfied; use `Refs #N` for partial work or work still waiting on live, phone, or migration checks. Merging to `main` does not publish the live Site, and GitHub auto-closing an issue is not proof the work is complete. For a release PR carrying multiple issues, repeat the problem, corrective action, and evidence record per issue. Forge may prepare a release pull request from `studio` to `main` and link the included issues. The reviewer evaluates the build and diff, coordinates a pause on pushes to `studio`, and merges accepted releases. After a release is squash-merged to `main`, bring `studio` up to date by merging `main` into `studio` through a normal pull request (no force push), and compare by content, not commit SHA.
- Do not commit `dist/`, `node_modules/`, credentials, `.env` files, visitor data, or private engineering documents.

## Review and merge into studio

- No PR merges without a non-author review that covers the exact head. The author or its cloud agent performs the merge.
- One other contributor posts a review comment in the policy's evidence format. Puck is the default reviewer. Forge reviews Ember's and Conduit's code PRs and all art PRs.
- A review says which parts were read and which parts only the build proves. The proof that code runs is a green build on the exact head commit, not a reviewer's read.
- Reviews are comments, not GitHub approvals. Every contributor posts through the owner's single GitHub account, and GitHub doesn't let an account approve its own PR, so branch protection can't require an approval. The non-author review rule (no PR merges without a non-author review that covers the exact head) holds only because every contributor follows it.
- A PR may be merged into `studio` only when every required check (Build, and Accessibility and Performance) is green on the exact head commit, and the latest non-author review covers that exact commit with no open blocker or major findings. Minor findings may be deferred to a follow-up PR when the merge comment lists them. If the review has any blocker or major findings, the author fixes them on the same branch and the reviewer re-checks at the new head. A new push means a new review is needed.
- Merges into `studio` follow Merge authority above. The merger uses a normal merge commit (no squash on `studio`, so release slices keep their history), pinned to the reviewed head SHA. The merge comment links the review comment it relied on and names the head commit that was built.
- Art PRs are opened by the art author's own cloud agent and merged under Merge authority and change only asset files and manifests, never page code. The reviewer checks file paths, file weight and how the art looks on the page.
- Release PRs to `main` follow the Merge authority section: a clean PR with a current exact-head sign-off from an independent bot is squash-merged pinned to that SHA.
- Work pushed straight to `studio` before the PR flow was adopted may finish that way. Everything new goes through a PR.

## Publishing and syncing

- A GitHub merge does not publish the live ChatGPT Site. The principal architect (Codex) publishes through the Sites project. Forge may prepare the resulting GitHub mirror update only after verifying the exact published Sites version and source commit; the reviewer examines the record before release.
- The publishing machine runs its own copy of the sync script from outside the repo. The helper updates the clean `main` clone only by fast forward. If it stops for local edits, authentication, or diverged history, inspect the work; do not bypass its checks.

## Constraints and standing rules

- SAVRONO is a working name behind a single `PUBLICATION_NAME` config value. It may be renamed before launch.
- Pull requests #77, #97, and #101 are historical reference and must not merge as-is.
- Never force push to `main` or `studio`.
