# The New Age of Anime Studio: handoff for Claude Code

Single pinned 16:9 stage. One scroll-progress value `p` (0 to 1) drives every beat. Source of truth: `anime-studio.html`.

## Placeholders to replace
- `[Studio name]` (header, hero subline)
- `hello@yourstudio.example` (button mailto and note under it)
- Chapter names: Welcome, Look closer, How we work, Action and suspense, Next episode

## Design tokens
Ink `#05060b`, text `#f4f6fb`, muted `#c3cadb`, single accent `#d42a40` (final button only).
Display: Dela Gothic One. Body: Zen Kaku Gothic New. Text sizes in `cqw` so they scale with the 16:9 frame.

## Timeline (q = p / 0.84 for the first four beats; the last two use p directly)
| Beat | Range | What happens | Frames |
|---|---|---|---|
| 1 Reveal | q .03-.20 | Headline fades, circle of light opens from the eyes | 01_hat |
| 2 Pull-down | q .20-.40 | Zoom and rotate toward the eyes, color drains to B&W, fades to black | 01_hat |
| 3 Fall | q .30-.46 | Twins fall in from the top; studio panel fades in at right (q .50-.56) | 02_twins |
| 4 Handoff | q .66-.80 | Sniper slides off left, officer slides in from right | 03_sniper to 04_officer |
| 5 Kick | q .80-.99 | Speed lines, zoom, shake, white flash, glass shards, settle | 04_officer |
| 6 Morning | p .86-.92 | Crossfade to the waking-up frame | 05_morning |
| 7 Close | p .94-1 | "Bring us your next episode." and the red button | 05_morning |

The black-and-white cloaked manga figure is intentionally cut. Reduced motion: crossfades only, no zoom, shake, flash, shards or speed lines.

## Storyboard and video shots
Storyboard in Higgsfield. Generate each transition with **Kling** (not Seedance). In the Higgsfield catalog the right model is **Kling 3.0 Omni (Frames)** (`kling_o3_flf`): first frame plus optional last frame, 3-15 s, 16:9, mode `std` / `pro` / `4k`. Use `pro`, sound `off`. Start and end frames are in `kling_frames/`. Negative prompt for all: photorealism, 3D render, text, watermark, extra characters, face morphing.

1. **Reveal, pull-down, fall** (start `01_hat`, end `02_twins`, 8 s): Slow push-in on a figure in a white top hat, eyes hidden in shadow. A circle of cold light opens from the eyes outward. The camera dives into the eyes in a fast spiral, color drains to high-contrast black and white ink, the frame goes to black, then a boy with round glasses and his upside-down twin fall in from the top and settle on white. Flat 2D anime, hand-drawn look.
2. **Handoff** (start `03_sniper`, end `04_officer`, 5 s): Horizontal whip pan. The sniper over the city skyline slides off to the left with motion blur while the blonde woman in the blue police uniform slides in from the right and stops, composed.
3. **Kick** (start `04_officer`, end `04_officer`, 5 s): She snaps a high kick toward the camera, her boot fills the lens, white impact flash, glass shatters outward in shards and fades, then she settles back into her end pose.
4. **Morning** (start `04_officer`, end `05_morning`, 5 s): White flash dissolve into the sunlit bedroom, the child finishing a stretch.

Acceptance gate: review each clip, re-roll as needed, and only then wire it in. Keep the stills as fallback.

## Wiring accepted videos
Approximate scroll ranges in `p`: shot 1 about .03-.42, shot 2 about .55-.67, shot 3 about .67-.83, shot 4 about .86-.92. Add one `<video muted playsinline preload="auto">` layer per shot above the stills, visible only inside its range, with `currentTime = seg(p, from, to) * duration`. `anime-studio.html` has a `VIDEOS` hook that attaches a video to an existing still layer; extend it to per-shot layers. Encode every frame as a keyframe so scrubbing is smooth:
`ffmpeg -i in.mp4 -an -c:v libx264 -g 1 -crf 20 -pix_fmt yuv420p out.mp4`

## Performance notes
- Scroll progress is smoothed per frame in a rAF loop that stops when settled, so it follows the display refresh rate. No idle animation.
- The B&W drain uses a pre-made grayscale twin of the hat frame instead of a CSS filter on a 4K layer.
- Four 4K frames plus two smaller ones decode to roughly 130 MB. If a target device struggles, downscale to 2560 px wide.
- `2.jpg` and `4.jpg` are 1536x1024; replace with 16:9 4K when available. The wall poster in `05_morning` carries text that is not the studio's; crop or replace it.

## Procedural clips (stand-in for Kling)
`clips/` holds four 1920x1080, 30 fps, all-keyframe MP4s rendered by `render_clips.py` (Python, OpenCV, ffmpeg) from the stills, using the same motion as the page: hat to twins (6 s), sniper to officer (4 s), kick (5 s), officer to morning (3 s). They are computed motion, not AI-generated. Replace any of them with an accepted Kling clip using the same file name and the wiring notes above. The kick clip's end frame matches `04_officer`, so clips can be swapped one at a time.
