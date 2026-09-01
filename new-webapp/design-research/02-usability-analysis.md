# 02 — Usability Analysis of Leading MRI/PACS Viewers

> Design-phase reference. Not for implementation until README status is `COMPLETED`.
> Sources cited as [S#] refer to `01-sources.md`. Summaries are paraphrased.

## Method

We examined the interaction models of widely used, standards-compliant DICOM
viewers — **RadiAnt** [S5], **Weasis** [S6–S8], **MicroDICOM** [S9], and the
open-source web viewer **OHIF** [S11] — to find the interaction conventions that
specialized physicians already expect. The goal is convergence: where independent
professional tools agree, that pattern is a de-facto standard we should honor.

## Finding 1 — The primary interactions are few and physical

Across viewers, day-to-day reading revolves around a small set of manipulations,
mapped primarily to the **mouse**, not menus:

| Interaction | RadiAnt default [S5] | Convergent expectation |
|-------------|----------------------|------------------------|
| Scroll through slices | Left button + drag | The single most frequent action |
| Window/Level (brightness/contrast) | Middle button + drag | Constantly adjusted while reading |
| Zoom | Right button + drag | Frequent |
| Pan | 4th button (or modifier) + drag | Frequent when zoomed |
| Measure length | 5th button / tool | Occasional |

**Implication:** the core reading loop is *scroll + window/level + zoom + pan*.
These must be immediate, low-friction, and available without opening menus.

## Finding 2 — Single-key tool switching is standard

MicroDICOM exposes single-letter shortcuts for tools [S9], e.g. windowing `W`,
zoom `Z`, pan `P`, scroll `F`, plus measurement tools (`D` distance, `A` angle,
`E` ellipse, `R` rectangle) and cine play/pause on Enter.

**Implication:** physicians expect **one-key tool switching** and keyboard-driven
navigation. A design that forces mouse trips to a toolbar for every tool change is
slower than what they already use.

## Finding 3 — Series scrolling is a first-class, named action

Weasis documents "Series Scroll" as a core navigation action for moving through the
images of the current series [S7]. Cine (auto-play through slices) is a common
convenience [S9].

**Implication:** slice navigation deserves dedicated, redundant controls: mouse
wheel, drag, arrow keys, a slider, and optional cine.

## Finding 4 — Layout is dense, dark, and image-first

Professional viewers dedicate almost the entire screen to the image. Chrome
(toolbars, panels) is minimal, dark, and secondary. Weasis organizes the workspace
around a central viewer panel with dockable side panels and tab controls [S6].

**Implication:** our layout must be **image-first** with a dark theme; metadata and
tools are peripheral and collapsible. No decorative chrome.

## Finding 5 — Multiparametric prostate reading needs sequence comparison

Prostate mpMRI reading combines **T2-weighted**, **DWI**, and **ADC** (and
sometimes DCE) sequences; PI-RADS scoring depends on looking across them
[S17–S19]. Radiologists routinely compare sequences side by side and cross-
reference the same anatomical level.

**Implication (roadmap):** even though v1 is a single-series 2D viewer, the design
must anticipate a **sequence switcher** now (v1: FR-007) and **side-by-side
comparison / synchronized scrolling** later (v2+). The information architecture
should not have to be rebuilt to add these.

## Finding 6 — Overlays carry essential clinical context

Viewers persistently display orientation markers and burned-in text overlays
(patient/series identifiers, slice index, window settings, scale). These are part
of safe reading, not decoration.

**Implication:** the viewport must show corner overlays: identifiers, slice index
(e.g. 12/30), and current WW/WC. Cornerstone3D can render these.

## Anti-patterns to avoid (from the client's brief)

- **Conventional-app UX criteria** (marketing-style dashboards, animated
  transitions, card layouts) waste screen space and attention. Rejected.
- **Modal-heavy workflows**: interrupting reading with dialogs is slow. Prefer
  inline, keyboard-driven actions.
- **Hidden primary actions**: scroll / W-L / zoom / pan must never be buried in
  menus.

## Synthesis → design inputs

1. Optimize the **scroll + window/level + zoom + pan** loop above everything else.
2. Provide **single-key tool switching** and full keyboard navigation, mirroring
   conventions users already know (W/L, Z, P, scroll, arrows, cine).
3. **Image-first, dark, dense** layout; peripheral collapsible panels.
4. Persistent **viewport overlays** (identifiers, slice index, WW/WC).
5. Design the information architecture to extend to **sequence switching and
   side-by-side comparison** without a rewrite.
6. Redundant slice controls: wheel, drag, arrows, slider, cine.
