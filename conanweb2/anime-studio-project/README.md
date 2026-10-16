# The New Age of Anime Studio

Scroll-driven 16:9 portfolio page. One timeline, driven by scroll progress `p`.

## Run
```
cd anime-studio-project
python3 -m http.server 8000
```
Open http://localhost:8000. Use a local server, not a double-click, so the video can seek.

## Files
- `index.html` the whole page (HTML, CSS, JS in one file)
- `assets/` still frames (4K hat, twins, sniper; 1536x1024 officer and morning) and the grayscale twin used for the black-and-white drain
- `clips/0_hat_reveal_1080p.mp4` the AI clip used for beat 1 (scrubbed by scroll, upscaled to 1080p)
- `clips/1_` to `4_` procedural stand-in clips (not used by the page yet; they match the CSS/JS motion)
- `kling_frames/` start frames for generating more clips in Higgsfield with Kling
- `tools/render_clips.py` renders the procedural clips (Python, OpenCV, ffmpeg); run from `tools/`
- `HANDOFF.md` timeline, storyboard and prompts

## Placeholders to replace
`[Studio name]`, `hello@yourstudio.example`, and the five chapter names.

## Starter prompt for Claude Code
"Read HANDOFF.md and index.html. Keep the single-timeline design. Add a per-shot `<video>` layer system so accepted clips in clips/ can be scrubbed by scroll, then wire clip 0 (already in) and any new clips I drop into clips/. Keep reduced-motion crossfades and visible keyboard focus."

## Note on the video
`index.html` loads the clip as a Blob so scroll-scrubbing works even on servers without HTTP Range support (such as `python3 -m http.server`). On `file://` it falls back to a direct load, which may not seek. For production hosting, use a host that supports Range requests (any normal static host does).
