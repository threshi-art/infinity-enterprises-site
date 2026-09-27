# Working in the shared Infinity site repository

These instructions apply to this `infinity-enterprises-site` repository. The parent `Infinity` OneDrive folder contains other projects and files; leave them alone unless the task explicitly concerns them.

## Before changing files

- Read this file, `README.md`, `site-source.json`, and `git status --short --branch`. Check the current branch and fetch the latest GitHub state before starting.
- Track each feature or bug in a GitHub issue. Agree on scope and acceptance criteria there. Link each change to its issue in a pull request.
- Treat existing uncommitted changes as someone else's work. If their owner or purpose is unclear, pause that edit and coordinate rather than overwriting it.
- Preserve existing pages, articles, images, assets, and project history. Rearrange or extend them as requested; do not remove them to make a merge easier.

## Working together

- GitHub `main` is the shared source record. The OneDrive clone is a convenient local copy. Only one writer should edit that checkout at a time.
- For simultaneous work, use a separate checkout outside the shared OneDrive folder and a task branch such as `work/cursor/motor-gallery`. Do not have multiple agents switch branches or edit the same shared working tree.
- Commit focused changes and open a pull request to `main`. Codex coordinates review, integration, OneDrive sync, and the separate live Sites publication step. Other agents can contribute through issues and pull requests.
- Do not use `git reset --hard`, `git clean`, force push, or a destructive checkout to resolve conflicts or dirty state. Keep the changes intact and resolve ownership first.
- Run `npm ci` and `npm run build` in your own checkout before proposing code changes. Do not commit `dist/`, `node_modules/`, credentials, `.env` files, visitor data, or private engineering documents.

## Publishing and syncing

- A GitHub push does not publish the live ChatGPT Site. After an accepted change, publish through the Sites project and record the exact published Sites version and source commit in `site-source.json` when bringing that source back to GitHub.
- On the Windows PC, `tools\SyncInfinityOneDrive.ps1` updates the clean `main` clone only by fast forward. If it stops for local edits or diverged history, inspect the work; do not bypass its checks.
