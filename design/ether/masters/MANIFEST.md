# #56 Ether Room scenes and mood cards: manifest

Made 2026-09-27. Every image here is image-generated with manual cleanup (AI generated). Credit line for the page: "Scenes: AI generated for Infinity Enterprises". It covers these new files only.

## Folder layout (mirrors the repo)

- `design/ether/masters/`: masters (1600x900 JPEG q95, 4:4:4), card masters, this manifest, `measure.json`, contact sheets, and the scripts in `src/` that produced everything. Not published.
- `src/assets/ether/`: web scenes, 1600x900 WebP q78, every file under 250 KB.
- `src/assets/ether/cards/`: 800x800 WebP mood cards.

## Process

1. Generated at 1280x720 with an AI image model. Prompts asked for no people, text, signs, logos or lettering. The exact prompt text for each scene was not saved, so the art direction column below describes the intent instead of quoting prompts.
2. `src/process.py`: Lanczos upscale to 1600x900, mid-tone and highlight lift outside the text zone, burn inside the zone if it ran hot, 6% more saturation. Late Night Soul 1 is the approved v4 draft and skipped this step.
3. `src/lighten.py`: an extra lift for Mutant Groove 1 and Spy Lounge 4 (gamma 0.72, gain 1.25, light 0.6px blur to keep grain down), with a 260px feather so the zone edge has no seam. The zone keeps 35% of the lift. Mean luminance went from 29 to 52 for Mutant Groove 1 and from 27 to 50 for Spy Lounge 4, so the set now sits between 42 and 77.
4. `src/measure.py` and `src/lightest.py`: the zone numbers and contrast figures below.
5. `src/cards.py`: 900x900 square crops scaled to 800x800, plus the procedural Noir Jazz card.

Text zone: the left 58% of the width and the bottom 45% of the height (x 0 to 928, y 495 to 900 at 1600x900). Phone crop: 506x900 of the master, with the text column being the left 354px of the crop.

## Scenes

| File (web) | Mood / source | Bytes (web) | Mean lum | Zone p95 (0-255) | Phone object-position x | Alt text |
|---|---|---|---|---|---|---|
| `late-night-soul-1.webp` | Late Night Soul | 129,428 | 72.6 | 66.7 | 18% | A violet sitting room at dusk with a velvet armchair and a lit lamp beside an arched window over a city skyline. |
| `late-night-soul-2.webp` | Late Night Soul | 157,118 | 61.2 | 25.7 | 44% | A dark room looking out through rain-streaked windows at glowing city lights at dusk. |
| `late-night-soul-3.webp` | Late Night Soul | 69,580 | 48.3 | 17.5 | 40% | An upright bass leaning against a glowing speaker, lit by a small lamp in a dim violet room. |
| `late-night-soul-4.webp` | Late Night Soul | 52,558 | 62.8 | 26.6 | 45% | A record player on a low cabinet beside a window overlooking a city at dusk. |
| `mutant-groove-1.webp` | Mutant Groove | 109,248 | 51.9 | 32.0 | 50% | A plum-colored listening room with velvet curtains, tall speakers, a lamp and a velvet sofa, with a thin cyan light streak on the wall. |
| `mutant-groove-2.webp` | Mutant Groove | 198,950 | 49.1 | 20.6 | 41% | A dark violet room where liquid chrome pours from the ceiling around a speaker. |
| `mutant-groove-3.webp` | Mutant Groove | 66,786 | 70.4 | 45.2 | 10% | A glowing staircase of colored blocks floating in violet haze among drifting shards. |
| `mutant-groove-4.webp` | Mutant Groove | 50,528 | 77.0 | 50.6 | 41% | A dim room with a large window onto a hazy shoreline, with debris drifting past outside. |
| `spy-lounge-1.webp` | Spy Lounge / Y-Lr487H1iU | 88,440 | 60.6 | 26.7 | 47% | A dark wood-paneled lounge with leather armchairs and a drink on a side table, overlooking an airfield where a propeller airliner waits at sunset. |
| `spy-lounge-2.webp` | Spy Lounge / Y-Lr487H1iU | 81,038 | 62.2 | 30.4 | 50% | A desk with a brass lamp, a camera, papers and a briefcase in a dark office, with a city at dusk through the window. |
| `spy-lounge-3.webp` | Spy Lounge / aQvB872MZL8 | 106,774 | 42.4 | 26.8 | 50% | A red lounge with curved booth seating and bar stools beneath a round window showing Earth from orbit. |
| `spy-lounge-4.webp` | Spy Lounge / aQvB872MZL8 | 127,514 | 49.9 | 26.3 | 49% | A red egg chair and a martini on a side table beside a curved window onto a starry sky and a crescent moon. |

Spy Lounge 1 and 2 go with the first Spy Lounge source (`Y-Lr487H1iU`); 3 and 4 go with the second (`aQvB872MZL8`). Mutant Groove 3: the phone crop at 10% keeps the text column dark but drops the glowing staircase. The final choice between that crop and the centred crop with the scrim is made from the rendered-page contrast check.

## Contrast for white text, before the scrim (pessimistic)

Method as agreed in the room: WCAG relative luminance, Gaussian blur of 3px at 1600 wide (about one letter stroke), take the lightest point in the zone, and turn it into a contrast ratio against white. The 95th percentile is context only. No scrim or text gradient is applied, so the real page will score higher. Once these files are committed, the automated check in `tools/a11y-gate.mjs` measures the rendered page and its result replaces these numbers.

Pass marks: 4.5 to 1 for body text, 3 to 1 for large text (24px and up, or about 19px bold).

| Scene | Desktop zone lightest | Desktop zone p95 | Phone column, bottom 45%, lightest | Phone column, full height, lightest |
|---|---|---|---|---|
| late-night-soul-1 | 2.8 | 9.44 | 8.68 | 7.41 |
| late-night-soul-2 | 2.48 | 17.39 | 6.4 | 1.99 |
| late-night-soul-3 | 16.03 | 18.58 | 17.37 | 6.74 |
| late-night-soul-4 | 5.9 | 17.27 | 5.9 | 1.72 |
| mutant-groove-1 | 9.61 | 15.9 | 11.07 | 5.78 |
| mutant-groove-2 | 1.8 | 17.68 | 4.85 | 1.22 |
| mutant-groove-3 | 5.36 | 13.01 | 16.52 | 3.32 |
| mutant-groove-4 | 7.49 | 12.66 | 8.54 | 1.53 |
| spy-lounge-1 | 5.76 | 17.22 | 7.3 | 1.22 |
| spy-lounge-2 | 3.84 | 16.04 | 4.39 | 4.39 |
| spy-lounge-3 | 4.48 | 15.41 | 4.48 | 1.04 |
| spy-lounge-4 | 2.29 | 15.27 | 5.76 | 3.25 |

Four scenes fall under 3 to 1 at their desktop lightest spot: Late Night Soul 1 (2.8), Late Night Soul 2 (2.48), Mutant Groove 2 (1.8) and Spy Lounge 4 (2.29). In all four the hot spot is at the top-right corner of the zone (x 800 to 928, y 495 to 650): the lamp, window light or chrome at the zone edge. Every pixel over the limit sits right of x 800, so text that stays within the left 50% of the width avoids it. I have not tested these scenes under the page scrim; the automated check will. Spy Lounge 4 measured 2.46 before the lift, so the lift did not cause it. Spy Lounge 2 and 3 pass the large-text mark only. The full-height phone numbers include the sky and windows above the text, so treat them as a worst case.

## Mood cards (800x800)

| File | Source | Crop x0 (of 1600) | Bytes | Alt text |
|---|---|---|---|---|
| `card-cosmic-funk.webp` | existing ether-1.jpg (original untouched) | 580 | 80,036 | A space lounge with a turntable in front of a window onto a ringed planet. |
| `card-mutant-groove.webp` | mutant-groove-3 master | 470 | 47,856 | A glowing staircase of colored blocks floating in violet haze among drifting shards. |
| `card-late-night-soul.webp` | late-night-soul-1 master | 680 | 80,806 | A violet sitting room at dusk with a velvet armchair and a lit lamp beside an arched window over a city skyline. |
| `card-spy-lounge.webp` | spy-lounge-3 master | 620 | 82,200 | A red lounge with curved booth seating and bar stools beneath a round window showing Earth from orbit. |
| `card-noir-jazz-upcoming.webp` | procedural (src/cards.py, seed 56) | — | 4,138 | Decorative (empty alt). The page supplies the "Upcoming" text. |

The Noir Jazz card is a textless charcoal-navy field with a faint haze at the top right and fine grain. Its lightest spot is 7.95 to 1 against white. The Cosmic Funk card is a new crop of the existing scene and does not fall under the new credit line.

## Content check

Checked by eye at full size, including close-ups of the camera in Spy Lounge 2 and the airliner in Spy Lounge 1. No people, no readable text, no logos or trademarks, and no aircraft markings.

## Files not included

`raw/` (generator outputs), `rejected/` (first Mutant Groove 2) and the pre-lift versions of Mutant Groove 1 and Spy Lounge 4 stay on my side.
