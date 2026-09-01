# 06 — Rendering Approach & UI Framework Rationale

> Design-phase reference. Not for implementation until README status is `COMPLETED`.

## The client's directive

> Use a specialized framework for medical image visualization. If none fits, do
> **not** adopt a heavy UI framework built to look fancy — build a minimal one
> **specific to this app**. Functionality first.

This document separates two distinct concerns that are often conflated:

1. **Image rendering engine** (pixels, DICOM, WebGL) — specialized, must not be
   hand-rolled.
2. **UI layer** (layout, buttons, panels, shortcuts) — must be minimal and
   purpose-built, not a decorative component library.

## Decision 1 — Rendering engine: use Cornerstone3D (specialized)

Medical image rendering is **not** a place to build from scratch: it requires
correct DICOM parsing, transfer-syntax handling, VOI LUT (window/level), GPU
rendering, and — critically — **GSDF-faithful** pixel handling [S1]. Cornerstone3D
is the specialized, open-source, standards-oriented engine for this (it powers OHIF
[S11]).

**Use Cornerstone3D for:** DICOM parsing/decoding, the viewport, window/level,
stack scrolling, zoom/pan tools, and viewport overlays. Building these ourselves
would risk clinical correctness and calibration fidelity.

## Decision 2 — UI layer: build a minimal, purpose-specific UI (no fancy framework)

For the **surrounding UI** (header, action bar, slice slider, metadata panel,
dropzone, cheat-sheet), we do **not** pull in a heavyweight component/design-system
library (e.g. large Material/enterprise UI kits). Those optimize for
conventional-app aesthetics that the research explicitly rejects [F4, C2]: bright
surfaces, cards, elevation/shadows, animations — all counterproductive on a
dark, calibrated reading monitor.

Instead:

- Build a **small set of bespoke components** (see `docs/architecture/design-v1.md`
  §7) styled with **plain CSS / Tailwind utilities** to the dark, low-luminance,
  image-first spec in `04-ui-design.md`.
- The UI's job is to be **invisible**: thin chrome, no decoration, keyboard-first.
- This keeps the bundle small, the surface faithful to calibration, and the design
  fully under our control.

### Why not a full turnkey viewer (OHIF) as the UI?

OHIF is excellent but is a **large React application** with its own extensive UI and
extension system [S11]. On the `vue3` branch we want (a) Vue 3 and (b) a minimal
purpose-built UI. We therefore use the **Cornerstone3D engine directly** and build
our own thin Vue UI — matching the client's "don't adopt a fancy framework"
directive while still standing on a specialized rendering core.

## Resulting stack (design-phase recommendation)

| Concern | Choice | Type |
|---------|--------|------|
| DICOM parse + decode | `@cornerstonejs/dicom-image-loader` + `dicom-parser` | Specialized engine |
| Rendering + tools | `@cornerstonejs/core` + `@cornerstonejs/tools` | Specialized engine |
| App shell / UI | Vue 3 (Composition API) + bespoke components | Purpose-built, minimal |
| Styling | Tailwind CSS utilities, dark theme | Minimal, no component kit |
| State | Pinia | Minimal |

## Guardrails (must hold in implementation)

1. **No app-side image processing** beyond DICOM VOI LUT (window/level). No gamma,
   sharpening, color mapping, or "auto-enhance" — it would break GSDF calibration
   [S1][C1].
2. **No decorative UI library**; components are hand-built to the dark, image-first
   spec.
3. **Chrome stays thin and low-luminance**; the image owns the screen.
4. UI must remain **framework-swappable in spirit**: rendering logic lives in
   composables around Cornerstone3D, so the same core backs the React branch
   (`original-design`).

## Traceability

| Decision | Traces to |
|----------|-----------|
| Specialized engine (Cornerstone3D) for pixels | S1, S11, clinical correctness |
| No heavy/fancy UI framework | client directive, F4, C2 |
| Bespoke minimal Vue UI, dark/image-first | 04-ui-design.md, C2, C6 |
| No app-side image processing | S1 (GSDF), C1 |
| Rendering isolated in composables | reuse across vue3/React branches |
