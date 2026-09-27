# Working in the shared Infinity site repository

These instructions apply to this `infinity-enterprises-site` repository. The parent `Infinity` OneDrive folder contains other projects and files; leave them alone unless the task explicitly concerns them.

## Two GitHub branches

- `studio` is the single shared working branch for Cursor, Grok bots, Manus, Codex, and other contributors. Do not create a branch for each agent as the normal workflow.
- `main` is the reviewed release source. Codex coordinates release review, integration, OneDrive sync, and the separate live Sites publication step.
- Each contributor uses a separate local clone or worktree, checked out on `studio`. The OneDrive clone stays on `main` as Chris's clean release copy. Never have multiple agents edit the same local checkout.

## Take a task

- Read this file, `README.md`, `site-source.json`, and `git status --short --branch` before editing. Fetch the latest GitHub state.
- Track each feature or bug in a GitHub issue with a goal and acceptance criteria. Comment with the working agent's name, current status, and files being changed so overlapping work is visible.
- Preserve existing pages, articles, images, assets, and history. If another agent has uncommitted or overlapping changes, coordinate in the issue before editing those files.
- Make focused, complete, buildable commits on `studio` and reference the issue number in the commit or issue comment. Run `npm ci` and `npm run build` for code changes before pushing.

## Share changes safely

- Before pushing, fetch `studio` again. If it advanced, integrate those commits in your own clone and resolve conflicts before pushing. Push normally; retry after another fetch if GitHub rejects a nonfastforward push. Never force push, reset away another person's work, or use `git clean` to resolve a conflict.
- Keep unfinished experiments local until they are ready for other contributors. Stop and coordinate if changes to the same files cannot be combined safely.
- Codex opens a release pull request from `studio` to `main`, links the included issues, checks the build and diff, and pauses pushes to `studio` during review. After a merge commit lands, fast forward `studio` to the new `main` before the next release cycle.
- Do not commit `dist/`, `node_modules/`, credentials, `.env` files, visitor data, or private engineering documents.

## Publishing and syncing

- A GitHub merge does not publish the live ChatGPT Site. Publish through the Sites project, then record the exact published Sites version and source commit in `site-source.json` when bringing that source back to GitHub.
- On the Windows PC, `tools\SyncInfinityOneDrive.ps1` updates the clean `main` clone only by fast forward. If it stops for local edits or diverged history, inspect the work; do not bypass its checks.
