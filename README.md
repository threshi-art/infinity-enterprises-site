# Infinity Enterprises website

Source for the Infinity Enterprises portfolio and the Infinity Foundation concept pages.

Live Site: https://infinity-enterprises.infinity-ent-8507.chatgpt.site/

## Pages

Home, About, Project Atlas, In Development, Research Journal, Learning Center, The Infinity Foundation, Helping Youth, and For Diana.

## Build

Requires Node.js 20 or newer. Run `npm run build`. The build writes the Cloudflare Worker bundle to `dist/server/index.js` from the source pages and local image assets. The 94 item roadmap catalog is stored in `src/roadmaps.json`.

## Access and configuration

The deployed Site uses runtime environment variables `PIN_CODE`, `GUEST_PIN_CODE`, and `SESSION_SECRET`. Their values are intentionally absent from this repository. The public Site remains behind its existing PIN screen. Do not commit PINs, session secrets, or user data.

## Source and deployment

This repository is a curated mirror of the ChatGPT Sites source. The live Site continues to deploy through its existing Sites source repository. A GitHub push alone does not publish the website. After editing and publishing the Site, mirror the source changes here and update `site-source.json` with the exact Sites source commit and version. Omit generated `dist/` output from GitHub; a clean build regenerates it.

The Foundation and Pacific Royal Academy pages are concept briefs. They do not assert completed charitable recognition, an operating school, or open residential care.
