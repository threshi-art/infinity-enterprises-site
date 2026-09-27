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
- Track each feature or bug in a GitHub issue with a goal and acceptance criteria. Comment with the working agent's name, current status, and files being changed so overlapping work is visible.
- Preserve existing pages, articles, images, assets, and history. If another agent has uncommitted or overlapping changes, coordinate in the issue before editing those files.
- Make focused, complete, buildable commits on `studio` and reference the issue number in the commit or issue comment. Run `npm ci` and `npm run build` for code changes before pushing.

## Share changes safely

- Before pushing, fetch `studio` again. If it advanced, integrate those commits in your own clone and resolve conflicts before pushing. Push normally; retry after another fetch if GitHub rejects a nonfastforward push. Never force push, reset away another person's work, or use `git clean` to resolve a conflict.
- Keep unfinished experiments local until they are ready for other contributors. Stop and coordinate if changes to the same files cannot be combined safely.
- Forge or Codex may prepare a release pull request from `studio` to `main` and link the included issues. Codex or Cursor reviews the build and diff, coordinates a pause on pushes to `studio`, and merges accepted releases. After a merge commit lands, Forge or Codex fast forwards `studio` to the new `main` before the next release cycle.
- Do not commit `dist/`, `node_modules/`, credentials, `.env` files, visitor data, or private engineering documents.

## Publishing and syncing

- A GitHub merge does not publish the live ChatGPT Site. Codex publishes through the Sites project. Forge may prepare the resulting GitHub mirror update only after verifying the exact published Sites version and source commit; Codex or Cursor reviews the record before release.
- On Goliath, the Windows task `Infinity Enterprises Source Sync` runs `tools\SyncInfinityOneDrive.ps1` at sign in and every 15 minutes while Chris is signed in. `tools\InstallInfinitySyncTask.ps1` installs or updates the task. The helper updates the clean `main` clone only by fast forward. If it stops for local edits, authentication, or diverged history, inspect the work; do not bypass its checks.
