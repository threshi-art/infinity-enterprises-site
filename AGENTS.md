# Working in the shared Infinity site repository

These instructions apply to this `infinity-enterprises-site` repository. The parent `Infinity` OneDrive folder contains other projects and files; leave them alone unless the task explicitly concerns them.

## Two GitHub branches

- `studio` is the single shared working branch for Cursor, Grok bots, Manus, Codex, and other contributors. Do not create a branch for each agent as the normal workflow.
- `main` is the reviewed release source. Codex coordinates release review, integration, OneDrive sync, and the separate live Sites publication step.
- Forge is the GitHub steward when given repository access. Forge may triage issues, update PR status and descriptions, note ownership and overlap, keep `studio` aligned with `main`, and prepare release PRs or verified Sites source mirror updates for Codex review.
- Each contributor uses a separate local clone or worktree, checked out on `studio`. The OneDrive clone stays on `main` as the owner's clean release copy. Never have multiple agents edit the same local checkout.

## Intake and release authority

- Chris sends feature requests and changes to Codex. Codex decides whether a GitHub issue is needed, writes the scope and acceptance criteria when it is, and assigns the work to Forge, Cursor, Manus, another Grok bot, or Codex.
- Forge keeps the issue queue, pull request descriptions, and `studio` branch health current. Forge may prepare a release pull request but does not accept, approve, or merge one into `main`.
- Only Codex and Cursor are authorized to perform the final code review, acceptance, approval, and merge of pull requests into `main`. Others may provide findings and comments for them to assess. Codex remains responsible for live Sites publication.
- These are team permissions. GitHub cannot distinguish AIs that use the same GitHub identity, so this rule is not technically enforced until contributors have distinct identities and an appropriate branch rule.

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
- Every PR into `studio` follows the PR template sections: Description, Related Issue (using `Refs #N`), Objective Evidence & Screenshots (with Before/After table), Type of Change & Corrective Action (listing what actually changed, and identifying content preserved, moved, or removed), Checklist, and Final notes to reviewer (naming the peer reviewer). Release PRs from `studio` to `main` list `Closes #N` only when the issue's full acceptance criteria are satisfied; use `Refs #N` for partial work or work still waiting on live, phone, or migration checks. Merging to `main` does not publish the live Site, and GitHub auto-closing an issue is not proof the work is complete. For a release PR carrying multiple issues, repeat the problem, corrective action, and evidence record per issue. Forge or Codex may prepare a release pull request from `studio` to `main` and link the included issues. Codex or Cursor reviews the build and diff, coordinates a pause on pushes to `studio`, and merges accepted releases. After a merge commit lands, Forge or Codex fast forwards `studio` to the new `main` before the next release cycle.
- Do not commit `dist/`, `node_modules/`, credentials, `.env` files, visitor data, or private engineering documents.

## Review and merge into studio

- No PR merges without a non-author review that covers the exact head. The author or its cloud agent performs the merge.
- One other contributor posts a review comment in the policy's evidence format. Puck is the default reviewer. Forge reviews Ember's and Conduit's code PRs and all art PRs.
- A review says which parts were read and which parts only the build proves. The proof that code runs is a green build on the exact head commit, not a reviewer's read.
- Reviews are comments, not GitHub approvals. Every contributor posts through the owner's single GitHub account, and GitHub doesn't let an account approve its own PR, so branch protection can't require an approval. The non-author review rule (no PR merges without a non-author review that covers the exact head) holds only because every contributor follows it.
- A PR may be merged into `studio` only when every required check (Build, and Accessibility and Performance) is green on the exact head commit, and the latest non-author review covers that exact commit with no open blocker or major findings. Minor findings may be deferred to a follow-up PR when the merge comment lists them. If the review has any blocker or major findings, the author fixes them on the same branch and the reviewer re-checks at the new head. A new push means a new review is needed.
- After the merge conditions are met, the author's cloud agent merges into `studio` with a normal merge commit (no squash on `studio`, so release slices keep their history). The merge comment links the review comment it relied on and names the head commit that was built.
- Art PRs are opened and merged by the art author's own cloud agent and change only asset files and manifests, never page code. The reviewer checks file paths, file weight and how the art looks on the page.
- `main` is unchanged: Codex or Cursor reviews and squash-merges release PRs.
- Work pushed straight to `studio` before the PR flow was adopted may finish that way. Everything new goes through a PR.

## Publishing and syncing

- A GitHub merge does not publish the live ChatGPT Site. Codex publishes through the Sites project. Forge may prepare the resulting GitHub mirror update only after verifying the exact published Sites version and source commit; Codex or Cursor reviews the record before release.
- The publishing machine runs its own copy of the sync script from outside the repo. The helper updates the clean `main` clone only by fast forward. If it stops for local edits, authentication, or diverged history, inspect the work; do not bypass its checks.
