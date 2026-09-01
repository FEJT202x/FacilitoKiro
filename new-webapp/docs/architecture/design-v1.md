# Design Document — Prostate MRI Viewer (v1)

**Branch:** `vue3`
**Version:** 1.0 (DICOM 2D viewer)
**Status:** Design — pending review
**Date:** 2026-08-22

---

## 1. Purpose

This document describes the design of **v1** of the Prostate MRI Viewer on the
`vue3` branch: a web-based **DICOM** viewer for prostate cancer MRI scans, built
with **Vue 3 + TypeScript + Cornerstone3D**. It also records the project's
methodology, the key decisions taken so far, and the branch structure agreed with
the client, so anyone joining the project has full context in a single place.

---

## 2. Branch Structure (important context)

The project is developed on **three parallel branches**. This was agreed
explicitly to let two teams work in parallel on two frontend approaches that share
the same DICOM/Cornerstone3D core.

| Branch | Frontend | Base commit | Purpose |
|--------|----------|-------------|---------|
| **`vue3`** | Vue 3 (Composition API) + Pinia | `9283ddb` | Alternative version (this design) |
| **`original-design`** | React | `d19bd99` | Original design, for the parallel team |
| **`feature/prostate-mri-viewer`** | Vue 3 (currently) | `9283ddb` | Feature branch backing **PR #2** |

### Note on `feature/prostate-mri-viewer` / PR #2

Because the Vue 3 changes were committed **on top of** the original React work,
`feature/prostate-mri-viewer` and its **PR #2** currently point to the **same Vue 3
commit** as the `vue3` branch (`9283ddb`). They are therefore identical right now.

By decision, **the three branches are kept as-is** (no destructive reset/force-push
was performed):
- `vue3` → Vue 3 development (this branch)
- `original-design` → React development (parallel team, at `d19bd99`)
- `feature/prostate-mri-viewer` → left untouched (still Vue 3 tip)

Both frontend versions share the **same medical-imaging core** (DICOM +
Cornerstone3D), so work is not duplicated at the domain level — only the UI layer
differs.

---

## 3. Methodology — SDD (Structure → Definition → Development)

The project follows the **SDD** methodology, driven by Kiro steering files under
`.kiro/steering/`:

1. **Structure** (`structure.md`) — architecture and directory layout.
2. **Definition** (`definition.md`) — requirements, specifications, conventions.
3. **Development** (`development.md`) — workflows, coding standards, CI/CD.

### Iterative delivery

The client specifies **as development progresses**: requirements start simple and
grow in detail, even in production. Each version has its own spec in
`docs/specifications/` (`v1.md`, `v2.md`, …).

| Version | Scope | Complexity |
|---------|-------|------------|
| **v1** | DICOM 2D viewer (single series, window/level, slice scroll) | Medium |
| v2 | Multi-planar reconstruction (axial/sagittal/coronal) | Medium |
| v3 | Segmentation visualization / overlays | Complex |
| v4 | DICOMweb + PACS integration (server-backed) | Complex |
| v5 | Clinical workflow tools (annotations, measurements, reporting) | Advanced |
| v6+ | Production-ready with feedback | Evolving |

### Post-Change Workflow (mandatory)

After **any** change (code or documentation): make the change → test → **commit**
(`<type>: <description>`) → **update documentation** → update the relevant spec in
`docs/specifications/`. Documented in all three steering files.

---

## 4. Key Decisions So Far

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | **DICOM from v1** (not JPEG/PNG) | MRI scans are clinical DICOM data — multi-slice series with metadata, pixel spacing, and window/level. Requested by the client. |
| D2 | **Cornerstone3D** as rendering engine | De-facto standard for web medical imaging (engine behind OHIF); WebGL GPU rendering; robust DICOM parsing; scales to MPR/segmentation/PACS without a rewrite. |
| D3 | **Vue 3 (Composition API)** as frontend | Team familiarity. Cornerstone3D is framework-agnostic, so the core is unaffected. |
| D4 | **Pinia** for state | Official Vue 3 state library; simple, typed. |
| D5 | **Client-side only in v1** | Patient data never leaves the browser in v1 (privacy). Server/PACS deferred to v4. |
| D6 | **Three parallel branches** | Vue 3 alternative + React original, developed in parallel; shared DICOM core. |

Rejected: Canvas + JPEG/PNG (inadequate for clinical data); dwv (lighter but does
not scale as far as Cornerstone3D); OHIF as a base (built on React — we integrate
Cornerstone3D directly with Vue instead).

---

## 5. v1 Requirements (summary)

**Functional:** load & parse DICOM (P10 + common transfer syntaxes); render slices
with correct window/level (VOI LUT); load a full series and scroll slices; zoom,
pan, window/level tools; display DICOM metadata; load from local storage (drag &
drop / picker); switch between sequences of a study.

**Non-functional:** GPU-accelerated smooth scrolling; handle large series
(hundreds of slices) without freezing; responsive desktop UI; clear errors on
malformed DICOM; patient data stays client-side.

---

## 6. Architecture (v1)

### 6.1 High-level

```
┌────────────────────────────────────────────────────────────┐
│                        Browser (SPA)                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │                   Vue 3 App                          │    │
│  │                                                      │    │
│  │  Views/Components (.vue)      Pinia Stores           │    │
│  │  ┌──────────────────────┐   ┌────────────────────┐  │    │
│  │  │ ViewerPage           │   │ studyStore         │  │    │
│  │  │  ├ DicomDropzone     │◄──┤  (series, slices,  │  │    │
│  │  │  ├ DicomViewport     │   │   activeSeriesId)  │  │    │
│  │  │  ├ ViewerToolbar     │   │ viewportStore      │  │    │
│  │  │  └ MetadataPanel     │   │  (ww/wc, zoom, idx)│  │    │
│  │  └──────────┬───────────┘   └────────────────────┘  │    │
│  │             │ uses                                   │    │
│  │  Composables (useXxx.ts)                             │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │ useCornerstone()  — init engine/tools/loaders │  │    │
│  │  │ useDicomLoader()  — files → imageIds          │  │    │
│  │  │ useViewport()     — bind viewport, tools      │  │    │
│  │  └──────────────────────┬───────────────────────┘  │    │
│  └─────────────────────────┼──────────────────────────┘    │
│                            │ wraps                           │
│  ┌─────────────────────────▼──────────────────────────┐    │
│  │              Cornerstone3D (WebGL)                   │    │
│  │  @cornerstonejs/core   — RenderingEngine, viewports │    │
│  │  @cornerstonejs/tools  — Zoom, Pan, StackScroll,    │    │
│  │                          WindowLevel                 │    │
│  │  @cornerstonejs/dicom-image-loader + dicom-parser   │    │
│  └─────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
```

### 6.2 Layered responsibilities

- **Components (`.vue`)** — presentation and user interaction only. No direct
  Cornerstone API calls beyond a mounted viewport element ref.
- **Composables** — encapsulate Cornerstone3D lifecycle and DICOM logic; the
  bridge between the framework-agnostic engine and Vue reactivity.
- **Pinia stores** — application state (loaded series, active series, current
  slice index, window/level, zoom). No rendering logic.
- **Cornerstone3D** — all pixel handling, GPU rendering, DICOM decoding.

This keeps the medical-imaging core **decoupled from Vue**, which is exactly why
the same core can back the React branch.

---

## 7. Component & Module Design

### 7.1 Vue components (`src/components/mri-viewer/`)

| Component | Responsibility |
|-----------|----------------|
| `ViewerPage.vue` | Top-level layout; wires dropzone, toolbar, viewport, metadata |
| `DicomDropzone.vue` | Drag & drop / file picker for DICOM files; emits selected files |
| `DicomViewport.vue` | Owns the viewport DOM element; delegates to `useViewport()` |
| `ViewerToolbar.vue` | Tool buttons (zoom, pan, window/level, scroll), slice indicator |
| `MetadataPanel.vue` | Displays patient / study / series / sequence metadata |
| `LoadingOverlay.vue` | Progress + error state while parsing DICOM |

### 7.2 Composables (`src/composables/`)

| Composable | Responsibility |
|------------|----------------|
| `useCornerstone.ts` | One-time init of Cornerstone3D core, tools, and DICOM image loader; teardown |
| `useDicomLoader.ts` | Parse `File[]` → register imageIds; extract metadata; sort slices; report progress/errors |
| `useViewport.ts` | Create/attach a Stack viewport to an element; load imageIds; expose setSlice, setWindowLevel, resetCamera |

### 7.3 Pinia stores (`src/stores/`)

| Store | State | Actions |
|-------|-------|---------|
| `studyStore.ts` | `series[]`, `activeSeriesId`, `metadata` | `addSeries`, `setActiveSeries` |
| `viewportStore.ts` | `sliceIndex`, `numSlices`, `windowWidth`, `windowCenter`, `zoom`, `activeTool` | `setSlice`, `setWindowLevel`, `setActiveTool`, `reset` |

### 7.4 Types (`src/types/`)

`dicom.ts` — `DicomSeries`, `DicomInstanceMetadata`, `PatientInfo`, `StudyInfo`,
`ViewerTool` (`'zoom' | 'pan' | 'windowLevel' | 'scroll'`).

---

## 8. Core Flows

### 8.1 Load & display a DICOM series

```
User drops DICOM files
      │
      ▼
DicomDropzone → emits File[]
      │
      ▼
useDicomLoader.loadSeries(files)
   ├─ parse each file (dicom-parser)
   ├─ create imageIds (dicomImageLoader)
   ├─ read metadata (patient/study/series, rows/cols, WW/WC)
   ├─ sort by InstanceNumber / ImagePositionPatient
   └─ return { imageIds, metadata }
      │
      ▼
studyStore.addSeries(...) + setActiveSeries(id)
      │
      ▼
useViewport.loadStack(imageIds)
   ├─ RenderingEngine.getViewport().setStack(imageIds)
   ├─ apply default VOI (WW/WC from metadata)
   └─ render()
      │
      ▼
MetadataPanel shows metadata · ViewerToolbar enables tools
```

### 8.2 Slice navigation & window/level

- **Scroll:** mouse wheel / slider → `viewportStore.setSlice(i)` →
  `useViewport` sets the stack image index → re-render.
- **Window/Level:** WW/WC drag tool updates `viewportStore` → `setProperties({ voiRange })`.
- **Zoom/Pan:** handled by Cornerstone3D tools bound to the active tool from the toolbar.

---

## 9. Directory Layout (v1, `vue3` branch)

```
new-webapp/
├── .kiro/                      # SDD steering, hooks, specs, agents
├── docs/
│   ├── architecture/design-v1.md   # ← this document
│   └── specifications/v1.md        # v1 spec
├── src/
│   ├── components/mri-viewer/       # ViewerPage, DicomViewport, ...
│   ├── composables/                 # useCornerstone, useDicomLoader, useViewport
│   ├── stores/                      # studyStore, viewportStore (Pinia)
│   ├── services/                    # (future) DICOMweb client
│   ├── types/                       # dicom.ts
│   ├── App.vue
│   └── main.ts
├── tests/                           # Vitest + Vue Test Utils
└── package.json
```

---

## 10. Tech Stack (v1)

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3 (Composition API, `<script setup>`), TypeScript |
| Build/Dev | Vite |
| Rendering | Cornerstone3D (`@cornerstonejs/core`, `@cornerstonejs/tools`) |
| DICOM | `@cornerstonejs/dicom-image-loader` + `dicom-parser` |
| State | Pinia |
| Styling | Tailwind CSS |
| Testing | Vitest + Vue Test Utils |
| Lint | ESLint + eslint-plugin-vue |

---

## 11. Error Handling & Edge Cases

- Non-DICOM or corrupt files → caught in `useDicomLoader`, surfaced via
  `LoadingOverlay` with a clear message; other valid files still load.
- Unsupported transfer syntax → explicit message; log the syntax UID.
- Large series → parse/decode incrementally; show progress; avoid blocking the UI
  (decoding runs in Cornerstone web workers).
- Missing WW/WC in metadata → fall back to min/max pixel range.

---

## 12. Testing Strategy (v1)

- **Unit:** composables (`useDicomLoader` sorting/metadata; store actions).
- **Component:** `DicomDropzone` (file selection), `ViewerToolbar` (tool switching),
  `MetadataPanel` (rendering) with Vue Test Utils.
- **Fixtures:** small anonymized DICOM samples in `data/` (kept out of any upload).
- Cornerstone rendering itself is integration-tested manually in v1 (WebGL/canvas
  is hard to unit test); automated visual tests deferred.

---

## 13. Out of Scope for v1

MPR, 3D volume rendering, segmentation overlays, DICOMweb/PACS, annotations,
measurements, reporting, authentication, multi-user. All tracked in the version
roadmap (section 3) and future `docs/specifications/vX.md`.

---

## 14. Open Questions (for client)

1. Expected DICOM sources for v1 — only local files, or a sample dataset to bundle?
2. Target sequences to prioritize (T2, DWI, ADC) for the sequence switcher?
3. Any required window/level presets for prostate MRI?
4. Browser/desktop targets for v1?
