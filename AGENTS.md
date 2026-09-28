# Working in the shared Infinity site repository

These instructions apply to this `infinity-enterprises-site` repository. The parent `Infinity` OneDrive folder contains other projects and files; leave them alone unless the task explicitly concerns them.

## Two GitHub branches

- `studio` is the single shared working branch for Cursor, Grok bots, Manus, Codex, and other contributors. Do not create a branch for each agent as the normal workflow.
- `main` is the reviewed release source. Codex coordinates release review, integration, OneDrive sync, and the separate live Sites publication step.
- Forge is the GitHub steward when given repository access. Forge may triage issues, update PR status and descriptions, note ownership and overlap, keep `studio` aligned with `main`, and prepare release PRs or verified Sites source mirror updates for Codex review.
- Each contributor uses a separate local clone or worktree, checked out on `studio`. The OneDrive clone stays on `main` as Chris's clean release copy. Never have multiple agents edit the same local checkout.

## Intake and release authority

- Chris sends feature requests and changes to Codex. Codex decides whether a GitHub issue is needed, writes the scope and acceptance criteria when it is, and assigns the work to Forge, Cursor, Manus, another Grok bot, or Codex.
- Forge keeps the issue queue, pull request descriptions, and `studio` branch health current. Forge may prepare a release pull request but does not accept, approve, or merge one into `main`.
- Only Codex and Cursor are authorized to perform the final code review, acceptance, approval, and merge of pull requests into `main`. Others may provide findings and comments for them to assess. Codex remains responsible for live Sites publication.
- These are team permissions. GitHub cannot distinguish AIs that use the same GitHub identity, so this rule is not technically enforced until contributors have distinct identities and an appropriate branch rule.

## Take a task

- Read this file, `README.md`, `site-source.json`, and `git status --short --branch` before editing. Fetch the latest GitHub state.
- Track each feature or bug in a GitHub issue using the issue template sections: Description, Steps to Reproduce (for bugs), Expected Behavior, Actual Behavior (for bugs), Root Cause, Proposed Corrective Action, Objective Evidence & Screenshots, Environment, Acceptance criteria (for features), and Owner and handoff. The workflow is aligned with ISO 9001:2015 (evidence-based decision making, documented nonconformities and corrective actions) and ISO/IEC/IEEE 12207 (configuration and maintenance management) principles. Mark an unverified root cause as unknown or a hypothesis. Comment with the working agent's name, current status, and files being changed so overlapping work is visible.
- This repository is public: never put personal details (emails, account names, tokens, IP addresses) in screenshots, logs or the Environment section.
- Preserve existing pages, articles, images, assets, and history. If another agent has uncommitted or overlapping changes, coordinate in the issue before editing those files.
- Each issue ships as a pull request into `studio` that follows the PR template and uses `Refs #N`. Make focused, complete, buildable commits on a branch cut from `studio` and reference the issue number in the commit or issue comment. Run `npm ci` and `npm run build` for code changes before pushing.
- For work finished without a PR (for example a comment-only task), post a completion comment on the issue with these sections: Root Cause, Corrective Action Taken, Objective Evidence, Environment, Final notes to reviewer.

## Share changes safely

- Before pushing, fetch `studio` again. If it advanced, integrate those commits in your own clone and resolve conflicts before pushing. Push normally; retry after another fetch if GitHub rejects a nonfastforward push. Never force push, reset away another person's work, or use `git clean` to resolve a conflict.
- Keep unfinished experiments local until they are ready for other contributors. Stop and coordinate if changes to the same files cannot be combined safely.
- Every PR into `studio` follows the PR template sections: Description, Related Issue (using `Refs #N`), Objective Evidence & Screenshots (with Before/After table), Type of Change & Corrective Action (listing what actually changed), Checklist, and Final notes to reviewer. Release PRs from `studio` to `main` list `Closes #N` for each issue they carry, because GitHub only auto-closes issues on merges into the default branch. Forge or Codex may prepare a release pull request from `studio` to `main` and link the included issues. Codex or Cursor reviews the build and diff, coordinates a pause on pushes to `studio`, and merges accepted releases. After a merge commit lands, Forge or Codex fast forwards `studio` to the new `main` before the next release cycle.
- Do not commit `dist/`, `node_modules/`, credentials, `.env` files, visitor data, or private engineering documents.

## Publishing and syncing

- A GitHub merge does not publish the live ChatGPT Site. Codex publishes through the Sites project. Forge may prepare the resulting GitHub mirror update only after verifying the exact published Sites version and source commit; Codex or Cursor reviews the record before release.
- The publishing machine runs its own copy of the sync script from outside the repo. The helper updates the clean `main` clone only by fast forward. If it stops for local edits, authentication, or diverged history, inspect the work; do not bypass its checks.
