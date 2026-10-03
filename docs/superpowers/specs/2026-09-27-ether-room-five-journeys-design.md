# Ether Room: five journey collection

Date: 2026-09-27
Status: Design for owner review
Issue: #56
Working publication name: SOVRANO@Infini, an Infinity Enterprises publication

## Intent

Turn the Ether Room into a collection with five visible slots. Preserve the existing four-scene Cosmic Groove experience exactly as slot 01, including its current `/ether` URL. Build new immersive scroll journeys for Mutant Groove, Late Night Soul, and Spy Lounge from the videos Chris supplied. Noir Jazz is a visible upcoming slot until Chris selects its source. This adds to the site; it does not discard existing content.

A successful visitor experience starts at a five-card listening index, enters a full-screen sequence of original scenes, presses Play once, and can scroll between verified movements while the source changes appropriately. The current journey continues to behave as it does today.

## Route and navigation design

- `/ether/rooms`: the five-slot landing page. Music navigation and any new Ether Room entry point lead here. The page has a text link to the original source for each playable card.
- `/ether`: the existing Cosmic Groove experience. Do not rewrite, move, redirect, or change its four images, four start times, video ID, controls, markup, or audio behavior under this issue. Slot 01 links to it.
- `/ether/mutant-groove`, `/ether/late-night-soul`, `/ether/spy-lounge`: new journeys. A clear link returns to the five-slot index. Each route is directly loadable and responds correctly when shared or refreshed.
- Slot 04 Noir Jazz is a card on the index with an honest Upcoming state and no Play action. It does not have a fake journey route.
- Existing links to `/ether` stay valid. The published brand title is a working value, so page semantics and routes must not depend on its exact spelling.

The index shows five large album sleeve cards in a deliberate sequence. Each card has a number, title, one-line mood, image, source credit or Upcoming status, and one clear action. On mobile, cards stack in reading order. The first viewport explains that sound starts only after a visitor action.

## Source records and editorial truth

One source record per supplied video stores its canonical URL, video ID, displayed title, creator credit after verification, checked date, embedding result, and any verified chapter or curated movement starts. A movement has a short editorial title, source video ID, start seconds, image, alt text, and a note identifying whether the time was provided by the creator or selected by the publication. Never infer individual song names from a continuous mix.

| Slot | State | Source |
| --- | --- | --- |
| 01 Cosmic Groove | Existing, unchanged | `8kr7fyOGEMw` through existing `/ether` |
| 02 Mutant Groove | New immersive journey | `nDYqZDjh3Eo` |
| 03 Late Night Soul | New immersive journey | `wbbn_yUi4_0` |
| 04 Noir Jazz | Upcoming | No source selected |
| 05 Spy Lounge | New immersive journey, two source sequence | `Y-Lr487H1iU` beginning no earlier than the owner's linked 1015-second reference, followed by `aQvB872MZL8` |

Puck verifies exact title, creator, duration, chapter data if published, embeddability, and selected start marks before the corresponding journey is marked Playable. If the creator does not publish chapters, the team may choose editorial movement marks after listening and record them explicitly as curated marks. Source verification is an evidence gate, not an invitation to guess times.

The Spy Lounge request to “blend” means one continuous editorial atmosphere across two source videos. It does not create, host, record, or imply a remixed audio file. The player makes the source change visible and credits both creators. The first source uses the owner's link with `t=1015s` as a reference point, subject to duration and playback verification.

## Journey behavior

Each new journey has four full-height scenes, an image unique to its movement, a title, short copy, an illustrative rhythm graphic, a Play or Resume control, and a direct link to the source video at the selected start time. The art directions are:

1. Mutant Groove: a familiar velvet listening room that becomes warped chrome, then an impossible dance floor, then an uncanny dawn. Broken geometry and surprising color shifts suggest musical mutation.
2. Late Night Soul: a warm analog listening room, city lights through rain, a bass-lit midnight interior, and the hush before sunrise. Rich amber, plum, tobacco, and indigo, without depicting identifiable performers.
3. Spy Lounge: departure lounge and travel dossier mood for the first source; a deeper crimson orbital lounge mood for the second. The change of video is an explicit chapter boundary, with no borrowed film stills, marks, or recognizable brand imagery.

Playback starts only after a click or keyboard action. Before that, scrolling changes the active visual scene but never starts sound. After playback begins, selecting a different scene seeks to its verified start. Keep one active YouTube privacy-enhanced embed; clear the old iframe before loading a different video ID, so two recordings never play at once. A same-video movement also seeks by updating the embed as the existing page does. Browsers can block autoplay after a seek or source change: leave the scene selected, show a Resume action, and never state that playback succeeded merely because the iframe URL changed. Close stops playback and returns the interface to a silent state. Navigating to another journey stops the current player.

Do not turn scrolling into a rapid series of seeks: choose the scene with the largest meaningful intersection, commit after a short stability interval, and ignore repeated events for the active scene. Reduced motion removes decorative movement, not navigation or controls. The rhythm graphic remains labeled illustrative; it is not a measured waveform.

## Visual system and assets

The page should feel like an editorial listening environment. Images command the viewport, titles have quiet negative space, and controls remain readable without covering the subject. The three new journeys share navigation, controls, focus treatment, and source-credit conventions but each has its own palette and progression. Preserve the existing four `src/assets/ether-*.jpg` files unchanged.

Ember supplies twelve new scene masters, plus responsive exports and card crops derived from those masters. The asset manifest records each file's source scene, pixel dimensions, export format, generation tool and prompt when known, production status, alt text, and confirmation that it contains no real person, trademark, or readable generated text. If a generation detail is unavailable, the manifest says unknown. The masters and web exports are committed to a feature branch and opened as a pull request into `studio`. Measure page weight and provide mobile crops before release.

## Accessibility and failure behavior

The index and journey controls work with keyboard and visible focus. Text over art meets WCAG AA contrast, using a solid or graded backing when needed. Images have meaningful alt text or are marked decorative when the adjacent text already describes them. The active scene and source are announced without repeatedly interrupting assistive technology. Sound is opt in. Reduced motion eliminates pulsing and large transitions. The mobile player leaves the scene title and controls usable.

If a source fails to embed, offer its original YouTube link and a truthful availability message. Do not substitute another video silently. If a verified movement start exceeds the actual duration or a source disappears, the related journey cannot be labeled Playable until corrected. The landing page remains functional when a source is unavailable.

## Delivery sequence and review gates

1. Forge records the route and source model and builds the index with five cards. Slot 01 points to `/ether`; Noir Jazz remains Upcoming.
2. Ember supplies the twelve original masters, web exports, phone crops, and manifest. Forge integrates them into the three new journeys.
3. Puck verifies the four supplied new video URLs, the two-source sequence, creator attribution, embed behavior, durations, and each proposed movement time. Record check dates and any unavailable source.
4. Forge implements playback and scene selection with tests for silent first load, scene selection, source switch, Close, blocked autoplay fallback, keyboard behavior, and reduced motion.
5. Review the exact head: open a pull request into `studio`, confirm `npm ci && npm run build` passes, perform desktop and phone manual checks, source playback tests, image weight verification, and accessibility results. CI must be green on the exact head commit, and an exact-head review sign-off is current, before the pinned merge. The pull request carries the issue-to-action evidence record.
6. Codex or Cursor reviews and accepts a release to `main`. Live Sites publication, source mirror verification, and OneDrive synchronization are separate release steps.

The new routes may land incrementally only if each card reflects the true state. No incomplete journey gets an active Play label. No implementation under this issue changes application credentials, deploys the live site, merges a pull request, or closes #56 without the acceptance evidence.

## Open editorial state

Noir Jazz has no selected source, so its card remains Upcoming. Chris may later choose music and open a focused implementation issue. SOVRANO@Infini remains a working title; changing it later must not require rebuilding the journey data. The final movement names and times for the three new journeys are recorded only after source verification and editorial listening, never invented to fill the design document.
