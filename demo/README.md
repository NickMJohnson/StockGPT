# StockGPT — Demo Video

A polished ~38-second product walkthrough of StockGPT, built with [Remotion](https://remotion.dev).

| File | What it is |
|---|---|
| `stockgpt-demo.mp4` | The final video — 1920×1080, 30 fps, ~38s, H.264 (~7.7 MB) |
| `stockgpt-demo-poster.png` | A poster / thumbnail frame |
| `remotion/` | The Remotion source project used to render the video |

## What's in the video
An intro title card, eight scenes (each with an animated caption on the left and
the live app in a browser frame on the right), and an outro card:

1. **Search** — enter a ticker (landing page)
2. **Choose a filing** — the 10-K / 10-Q picker from SEC EDGAR
3. **AI Summary** — Claude's plain-English briefing
4. **Trends** — revenue, free cash flow, net-margin charts
5. **Statements** — the five-year income statement
6. **Key Ratios** — the 12-ratio grid
7. **AI Lab** — a custom ratio + chart generated from a natural-language prompt
8. **Chat** — asking the assistant a question about the filing

Every screen is a **real screenshot of the running app** driving the live backend
(SEC EDGAR + Claude) against Apple's FY2025 10-K — captured with Playwright, then
composited and animated in Remotion.

## Re-rendering / editing
The screenshots live in `remotion/public/shots/`. To rebuild the video:

```bash
cd demo/remotion
npm install
npm run render          # writes out/stockgpt-demo.mp4
# or, to tweak interactively:
npm run studio
```

Timing, copy, and scene order are all in `remotion/src/constants.ts`.
Colors/fonts are in `remotion/src/theme.ts`.

### Compressing for GitHub

Remotion's raw output is ~24 MB, but GitHub caps drag-and-drop attachments at
**10 MB**. The committed file is re-encoded to ~7.7 MB with no visible quality
loss (the content is mostly static, so it compresses well):

```bash
ffmpeg -i out/stockgpt-demo.mp4 \
  -c:v libx264 -profile:v high -crf 24 -preset veryslow \
  -pix_fmt yuv420p -movflags +faststart -an \
  ../stockgpt-demo.mp4
```

Keep it under 10 MB if you want to upload it to a GitHub comment for an
inline player.

To regenerate the underlying screenshots, run the app locally (backend on :8000,
frontend on :5173) and re-run the Playwright capture script that produced
`public/shots/` (see the project root `CLAUDE.md` for how to start both servers).
