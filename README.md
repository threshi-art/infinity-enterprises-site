<div align="center">

![Infinity Enterprises Masthead](docs/readme/banner.png)

[![CI](https://github.com/threshi-art/infinity-enterprises-site/actions/workflows/ci.yml/badge.svg?branch=studio)](https://github.com/threshi-art/infinity-enterprises-site/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-All%20rights%20reserved-8b1e2d)](LICENSE)
[![Live Site](https://img.shields.io/website?url=https%3A%2F%2Finfinity-enterprises.infinity-ent-8507.chatgpt.site%2F&label=live%20site&up_message=online&down_message=down&up_color=c9a86a&down_color=critical)](https://infinity-enterprises.infinity-ent-8507.chatgpt.site/)

</div>

# The September Issue / Infinity Enterprises

**Infinity Enterprises is an independent publication and working portfolio for intelligent systems, research, technology culture, law, and civic ideas.**

<div align="center">

| | |
|:---:|:---:|
| ![The Daily Desk](docs/readme/gallery/cover-daily-desk.webp)<br>*The Daily Desk* | ![Reading Room](docs/readme/gallery/cover-reading-room.webp)<br>*Reading Room* |
| ![Tech Lounge](docs/readme/gallery/cover-tech.webp)<br>*Tech Lounge* | ![MODA](docs/readme/gallery/cover-moda.webp)<br>*MODA* |

*Design reference only, not the final design.*

![Room covers board (drafts), see #34](design/sovrano-v1/redesign/boards/issue-34-covers-board.jpg)

*Room covers board (drafts), see #34*

</div>

---

## What is here

Source mirror for the [Infinity Enterprises publication](https://infinity-enterprises.infinity-ent-8507.chatgpt.site/).

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

This GitHub repository is a public source mirror for Cursor and other collaborators. A GitHub commit alone does not publish the live Site. The live version is built and deployed through the ChatGPT Sites project identified in `.openai/hosting.json`. After publishing, bring the resulting source changes and exact Sites version back to this mirror.

The current mirror records Sites version 28 at source commit `c520fc35270cbadeeda7e5ab051266fa23927e93` in `site-source.json`.

Do not commit runtime secrets, subscriber addresses, contact messages, or proprietary engineering documents. The staff area uses hosted secrets. The Foundation and Pacific Royal Academy are concept briefs, not claims of an operating institution. Music playback links to its original YouTube publisher.

Read [AGENTS.md](AGENTS.md) before contributing. All agents use the shared GitHub `studio` branch from separate local checkouts and coordinate work in issues. Send requests to Codex for triage and assignment. Forge maintains issues, PRs, and the shared branch. Releases from `studio` to `main` follow Merge authority in AGENTS.md; Codex handles live publication.

## Publishing copy

A maintainer keeps a synced working copy that follows `main` for publishing to the live site. Machine-specific setup is kept out of this public repository. A GitHub push alone does not publish the live Site.

## License

All rights reserved. See [LICENSE](LICENSE). The code is visible for reference; it is not open source.
