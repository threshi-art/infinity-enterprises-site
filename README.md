# Infinity Enterprises website

Source mirror for the [Infinity Enterprises publication](https://infinity-enterprises.infinity-ent-8507.chatgpt.site/).

## What is here

The magazine covers The Daily Desk, Culture, MOTOR, Food, The Practice, Music, the Academic Journal, Tech Lounge, In Development, and About. Agentic@Enigmas is the Daily Desk opinion room. The existing Ether Room, FORM, MOTOR gallery, original essays, project ledger, learning paths, and foundation concepts remain in the source.

The site runs as a Cloudflare compatible Worker on ChatGPT Sites. Its HTML, CSS, JavaScript, editorial catalogs, and original JPG illustrations are in `src/`. Older PNG assets remain in the repository for continuity, while the current build uses JPG assets. `build.mjs` generates `dist/server/index.js`. That generated file is deliberately not mirrored.

## Work locally

Use Node.js 20 or newer:

```sh
npm ci
npm run build
```

The result is `dist/server/index.js`, a Worker exporting `fetch(request, env)`. The database schema is in `db/schema.ts`, with generated migration files in `drizzle/`. Keep applied migrations immutable and create a new migration after schema changes.

## Publishing and collaboration

This GitHub repository is a source mirror for Cursor and other collaborators. A GitHub commit alone does not publish the live Site. The live version is built and deployed through the ChatGPT Sites project identified in `.openai/hosting.json`. After publishing, bring the resulting source changes and exact Sites version back to this mirror.

The current mirror records Sites version 28 at source commit `c520fc35270cbadeeda7e5ab051266fa23927e93` in `site-source.json`.

Do not commit runtime secrets, subscriber addresses, contact messages, or proprietary engineering documents. The staff area uses hosted secrets. The Foundation and Pacific Royal Academy are concept briefs, not claims of an operating institution. Music playback links to its original YouTube publisher.

## OneDrive copy on Chris's Windows PC

The requested folder is `C:\Users\cyber\OneDrive\Documents\Projects\Websites\Infinity`. It should be a Git clone of this repository so Cursor and other collaborators see the same source.

For the first copy, run this in PowerShell when the destination is absent or empty:

```powershell
git clone https://github.com/threshi-art/infinity-enterprises-site.git "C:\Users\cyber\OneDrive\Documents\Projects\Websites\Infinity"
```

For later updates, run `tools\SyncInfinityOneDrive.ps1` from a clone of this repository. The helper fetches `main` and accepts only a fast forward. It stops when there are local edits or an unrelated folder, protecting collaborators' work. GitHub sign in may be required for this private repository.
