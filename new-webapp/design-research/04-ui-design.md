# 04 — UI Design (Desktop Monitor)

> Design-phase reference. Not for implementation until README status is `COMPLETED`.
> Every decision traces to a research finding in `02-usability-analysis.md` /
> `03-monitor-and-users.md` (cited as [F#] findings / [C#] constraints).

## Design principle

**Functionality first.** The image gets the screen; the chrome gets out of the
way. The design is derived from how physicians already read on RadiAnt/Weasis/PACS
[F1–F6], and from the calibrated-monitor + dark-room + time-pressure constraints
[C1–C8]. It is intentionally *not* a conventional/commercial app layout.

## Layout — "image-first" single-screen

```
┌──────────────────────────────────────────────────────────────────────────┐
│ PT-**** · Prostate mpMRI · 2026-08-22             [T2 ax] [DWI] [ADC]   [≡] │  A  header (thin)
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  PT-****                                                          T2 TSE ax│  ← corner overlays
│  MR                                                                        │    (on the image)
│                                                                            │
│                                                                            │
│                          MRI SLICE (canvas)                                │  B  viewport
│                       Cornerstone3D — full area                            │     (fills all
│                                                                            │      free space)
│                                                                            │
│                                                                            │
│  WW 400  WC 40                                              Slice 12 / 30  │  ← corner overlays
├──────────────────────────────────────────────────────────────────────────┤
│ ◐W/L  ↕Scroll  🔍Zoom  ✋Pan  ⟲Reset      ▮▮▮▮▮▮▮▮●▮▮▮▮▮  12/30   ▶cine   │  C  action bar
└──────────────────────────────────────────────────────────────────────────┘
                                                            [i] metadata (togged)
```

The right **metadata panel is hidden by default** and toggled with `I`. When open
it overlays/pushes from the right; reading does not require it to be visible.

### Zones

| Zone | Purpose | Rationale |
|------|---------|-----------|
| **A. Header (thin, ~32px)** | Patient/study one-liner + sequence switch + menu | Identifiers must be visible [F6][C5]; sequence switch for mpMRI [F5][C4] |
| **B. Viewport (everything else)** | The image, full calibrated area | Image-first [F4]; faithful rendering [C1] |
| **C. Action bar (thin, ~40px)** | Active tool state + slice slider + cine | Redundant slice controls [F3]; visible tool state [F1] |
| **Overlays (on image)** | Identifiers, slice index, WW/WC | Standard clinical overlays [F6] |
| **Metadata panel (hidden)** | Full DICOM metadata, on demand | Peripheral/collapsible [F4][C3] |

## Visual language (from monitor/user constraints)

- **Dark theme only** for the reading view: near-black background (`#0a0a0a`),
  chrome in dark grays (`#1a1a1a`/`#2a2a2a`), muted light-gray text [C2][C6].
- **No large bright surfaces**, no white panels, no animated transitions, no
  drop-shadow decoration [C2][F-anti-patterns].
- **Image area is sacred**: no app-side gamma/tone/color; UI colors never overlap
  the image; overlays are semi-transparent monochrome text [C1].
- **No color-only meaning**: active tool shown by text + highlight, not hue alone
  [C7].
- Typography: a single legible sans-serif, small sizes; numbers (slice index,
  WW/WC) are the most prominent text.

## The core reading loop (must be frictionless) [F1][F2]

1. Load a DICOM series → viewport fills, defaults applied.
2. **Scroll** slices (arrows / slider / two-finger scroll / `S`-tool drag).
3. **Window/Level** by dragging (or `W` then drag).
4. **Zoom / Pan** as needed.
5. Switch **sequence** (T2 / DWI / ADC) — 1/2/3 keys.

Everything in this loop is reachable without opening a menu.

## Sequence switching (v1: FR-007) [F5][C4]

The header shows the study's series as compact toggles: `[T2 ax] [DWI] [ADC]`.
Selecting one loads it into the viewport, preserving slice index where anatomically
sensible. Keys `1..9` map to the first N series. This is the seed for **v2
side-by-side comparison + synchronized scroll** — the layout reserves the concept
now so it need not be rebuilt [F5].

## States

- **Empty**: centered dropzone ("Drop DICOM files / click to browse"), dark. No
  other chrome.
- **Loading**: thin progress indicator over the viewport; non-blocking; the UI
  states how many files parsed.
- **Error**: concise inline banner (e.g. "3 of 40 files were not valid DICOM —
  skipped"); valid images still open [F-anti-patterns: no modal walls].
- **Reading**: the layout above.

## What we deliberately exclude in v1

Toolbars full of rarely used icons, ribbon menus, dashboards, theming options,
onboarding tours, cards, marketing chrome. These fail the functionality-first test
and the dark/calibrated-monitor constraints.

## Wireframe — empty state

```
┌──────────────────────────────────────────────────────────┐
│ Prostate MRI Viewer                                    [≡] │
├──────────────────────────────────────────────────────────┤
│                                                            │
│                                                            │
│                ┌────────────────────────────┐              │
│                │      Drop DICOM files       │              │
│                │      or click to browse     │              │
│                │   folder or .dcm series     │              │
│                └────────────────────────────┘              │
│                                                            │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

## Wireframe — metadata panel open (toggle `I`)

```
┌───────────────────────────────────────────┬────────────────┐
│  ... viewport ...                          │ Metadata    [x]│
│                                            │ Patient        │
│                                            │  ID   ****     │
│                                            │  Sex  M        │
│                                            │ Study          │
│                                            │  Date 2026-...  │
│                                            │  Desc mpMRI    │
│                                            │ Series         │
│                                            │  T2 TSE ax     │
│                                            │  MR · 512×512  │
│                                            │  30 slices     │
│  WW 400 WC 40                  Slice 12/30 │  TR/TE ...     │
├────────────────────────────────────────────┴───────────────┤
│ ◐W/L ↕Scroll 🔍Zoom ✋Pan ⟲Reset  ▮▮▮●▮▮▮ 12/30  ▶cine       │
└──────────────────────────────────────────────────────────────┘
```

## Traceability matrix (design ← research)

| Design decision | Traces to |
|-----------------|-----------|
| Image-first, everything-else-thin layout | F4, C2 |
| Dark theme, low-luminance chrome, no bright surfaces | C2, C6, F4 |
| No app-side image processing; faithful pixels | C1 (GSDF) |
| Persistent corner overlays (ID, slice, WW/WC) | F6, C5 |
| Keyboard-first, frictionless core loop | F1, F2, C3 |
| Redundant slice controls (arrows/slider/two-finger scroll/cine) | F3, C6 |
| Sequence toggles + comparison-ready IA | F5, C4 |
| Familiar mouse/key mappings, no novel gestures | F1, F2, C4 |
| Inline non-blocking errors, no modal walls | anti-patterns |
| Metadata hidden by default | F4, C3 |
