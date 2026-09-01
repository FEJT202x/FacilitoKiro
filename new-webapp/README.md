# Prostate MRI Viewer

A web-based DICOM medical imaging viewer for prostate cancer MRI scans, built with Vue 3, TypeScript, and Cornerstone3D.

## Overview

This project follows an **iterative development approach** where specifications evolve over time:

| Version | Description | Status |
|---------|-------------|--------|
| v1 | DICOM 2D viewer (single series, window/level, slice scroll) | Scaffolded |
| v2 | Multi-planar reconstruction | Planned |
| v3 | Segmentation overlays | Planned |
| v4 | DICOMweb + PACS integration | Planned |

## Current Specification (v1)

**Goal:** a DICOM-based 2D MRI viewer. MRI scans are clinical DICOM data (not flat
images), so the viewer works with real DICOM files from the start.

### Features (v1)
- Load & parse DICOM files/series from local storage (drag & drop / picker)
- Render slices with correct window/level (VOI LUT), GPU-accelerated
- Scroll through slices; zoom, pan, window/level tools
- Display DICOM metadata (patient / study / series)
- Sequence switcher (T2 / DWI / ADC …)
- Keyboard-first interaction for a **2-button trackpad** workstation

## Design provenance

The UI/interaction design is **research-driven and approved**:

- `design-research/` — approved research + UI design (Status: COMPLETED).
  Sources: DICOM PS3.14 (GSDF), AAPM TG18, ACR, RadiAnt/Weasis/MicroDICOM
  shortcut conventions, PI-RADS, ergonomics studies.
- `docs/architecture/design-v1.md` — formal design (architecture, components,
  interaction model).
- `docs/specifications/v1.md` — v1 specification.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3 (Composition API, `<script setup>`), TypeScript |
| Build/Dev | Vite |
| Rendering | Cornerstone3D (`@cornerstonejs/core`, `@cornerstonejs/tools`) |
| DICOM | `@cornerstonejs/dicom-image-loader` + `dicom-parser` |
| State | Pinia |
| Styling | Tailwind CSS (dark, image-first theme) |
| Testing | Vitest + Vue Test Utils |

## Project structure

```
new-webapp/
├── design-research/          # Approved research + UI design (source of truth)
├── docs/
│   ├── architecture/design-v1.md
│   └── specifications/v1.md
├── src/
│   ├── components/mri-viewer/  # ViewerPage, DicomViewport, DicomDropzone,
│   │                           # ViewerToolbar, MetadataPanel, LoadingOverlay
│   ├── composables/            # useCornerstone, useDicomLoader, useViewport
│   ├── stores/                 # studyStore, viewportStore (Pinia)
│   ├── types/                  # dicom.ts
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
└── vite.config.ts
```

## Getting started

> ⚠️ **Dependency installation requires internet access.** This scaffold was
> generated in a sandbox with **no external network** (`INTEGRATIONS_ONLY`), so
> `npm install` was **not** run here and the app has **not** been built or tested
> in this environment. Run the steps below in an environment with npm registry
> access.

### Prerequisites
- Node.js 18+ (tested target: Node 22)
- npm (or pnpm/yarn)

### Install & run

```bash
cd new-webapp
npm install
npm run dev        # start Vite dev server
```

Then open the printed local URL and drop a DICOM series onto the viewer.

### Other scripts

```bash
npm run build      # type-check (vue-tsc) + production build
npm run preview    # preview the production build
npm run lint       # ESLint (Vue + TS)
npm run test       # Vitest (run once)
npm run typecheck  # vue-tsc --noEmit
```

## Interaction (2-button trackpad + keyboard)

**Pointer:** left-drag = active tool (default Window/Level) · right-drag = zoom ·
Shift+left-drag = pan · double-click = fit · two-finger scroll = slices (if
available).

**Keyboard:**

| Keys | Action |
|------|--------|
| Arrows / PageUp-Down / Home-End | Slice navigation |
| `W` `S` `Z` `P` `R` | Window/Level · Scroll · Zoom · Pan · Reset |
| `[` `]` · `-` `=` · `0` | Window width · center · reset to stored VOI |
| `Space` | Cine play/pause |
| `1`…`9` | Switch series |
| `I` · `Esc` | Toggle metadata · close |

## Important implementation note

Cornerstone3D's API differs across major versions. The composables target the
**1.x** line pinned in `package.json`. After `npm install`, verify the init calls
in `src/composables/useCornerstone.ts` and the tool bindings in
`src/composables/useViewport.ts` against the installed version, and run
`npm run typecheck`.

## Rendering guardrails (from approved design)

- **No app-side image processing** beyond the DICOM VOI LUT (window/level). No
  gamma, sharpening, or color mapping — it would break GSDF calibration.
- Dark, low-luminance chrome; the image owns the screen.
- No color-only information encoding.

## License

MIT
