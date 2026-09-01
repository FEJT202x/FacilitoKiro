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

### 7.5 Component hierarchy diagram

```
App.vue
└── ViewerPage.vue                     ← layout + orchestration
    ├── ViewerToolbar.vue              ← tool buttons + slice indicator
    ├── DicomDropzone.vue              ← shown only when no series is loaded
    ├── DicomViewport.vue              ← owns the Cornerstone viewport element
    │   └── LoadingOverlay.vue         ← shown while parsing / on error
    └── MetadataPanel.vue              ← patient/study/series metadata
```

### 7.6 Component interaction (props down / events up / store)

```
                          ┌─────────────────────────┐
                          │        ViewerPage        │
                          │  (reads Pinia stores)    │
                          └───────────┬─────────────┘
        props / events                │            props / events
      ┌───────────────┬───────────────┼───────────────┬───────────────┐
      v               v               v               v               v
┌───────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
│ Viewer    │  │ Dicom      │  │ Dicom      │  │ Metadata   │  │ Loading    │
│ Toolbar   │  │ Dropzone   │  │ Viewport   │  │ Panel      │  │ Overlay    │
└─────┬─────┘  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘
      │              │               │               │               │
  @tool-change   @files-        useViewport()     props:          props:
  @slice-change  selected       binds element     series          loading,
      │              │          + tools            (from store)    error
      v              v               │
 viewportStore   useDicomLoader ─────┘
 (activeTool,    -> studyStore
  sliceIndex,      (series,
  ww/wc)           metadata)

Legend:
  - props flow DOWN (parent -> child)
  - events flow UP  (child -> parent, e.g. @files-selected, @tool-change)
  - shared state lives in Pinia stores (studyStore, viewportStore)
  - composables (useViewport / useDicomLoader) bridge to Cornerstone3D
```

Data direction rule: **props down, events up, shared state in Pinia.** Components
never call Cornerstone3D directly except `DicomViewport`, which delegates to
`useViewport()`.

### 7.7 Interface contracts (TypeScript)

Data model (`src/types/dicom.ts`):

```typescript
export interface PatientInfo {
  id: string;             // de-identified in v1
  name?: string;
  sex?: 'M' | 'F' | 'O';
  age?: string;
}

export interface StudyInfo {
  studyInstanceUID: string;
  studyDescription?: string;
  studyDate?: string;
}

export interface DicomInstanceMetadata {
  sopInstanceUID: string;
  instanceNumber: number;
  rows: number;
  columns: number;
  windowWidth?: number;
  windowCenter?: number;
  imagePositionPatient?: [number, number, number];
}

export interface DicomSeries {
  seriesInstanceUID: string;
  seriesDescription?: string;   // e.g. "T2 TSE ax", "DWI", "ADC"
  modality: string;             // "MR"
  imageIds: string[];           // ordered Cornerstone imageIds
  instances: DicomInstanceMetadata[];
  patient: PatientInfo;
  study: StudyInfo;
}

export type ViewerTool = 'zoom' | 'pan' | 'windowLevel' | 'scroll';
```

Component prop/event contracts:

```typescript
// DicomDropzone.vue
defineProps<{ disabled?: boolean }>();
defineEmits<{ (e: 'files-selected', files: File[]): void }>();

// DicomViewport.vue
defineProps<{ imageIds: string[]; sliceIndex: number; activeTool: ViewerTool }>();
defineEmits<{ (e: 'slice-change', index: number): void }>();

// ViewerToolbar.vue
defineProps<{ activeTool: ViewerTool; sliceIndex: number; numSlices: number }>();
defineEmits<{
  (e: 'tool-change', tool: ViewerTool): void;
  (e: 'slice-change', index: number): void;
  (e: 'reset-view'): void;
}>();

// MetadataPanel.vue
defineProps<{ series: DicomSeries | null }>();

// LoadingOverlay.vue
defineProps<{ loading: boolean; error?: string | null; progress?: number }>();
```

Composable signatures (`src/composables/`):

```typescript
// useCornerstone.ts
function useCornerstone(): {
  init(): Promise<void>;
  isInitialized: Ref<boolean>;
  teardown(): void;
};

// useDicomLoader.ts
function useDicomLoader(): {
  isLoading: Ref<boolean>;
  progress: Ref<number>;
  error: Ref<string | null>;
  loadSeries(files: File[]): Promise<DicomSeries>;
};

// useViewport.ts
function useViewport(element: Ref<HTMLDivElement | null>): {
  loadStack(imageIds: string[], initialVoi?: { ww: number; wc: number }): Promise<void>;
  setSlice(index: number): void;
  setWindowLevel(ww: number, wc: number): void;
  setActiveTool(tool: ViewerTool): void;
  resetCamera(): void;
};
```

### 7.8 UI / Interface design (wireframes)

**A. Empty state — no series loaded**

```
┌────────────────────────────────────────────────────────────┐
│  Prostate MRI Viewer                                    (⚙)  │  <- app header
├────────────────────────────────────────────────────────────┤
│                                                              │
│            ┌──────────────────────────────────┐             │
│            │                                    │             │
│            │        (^) Drop DICOM files        │             │
│            │           or click to browse       │             │
│            │                                    │             │
│            │     Supports .dcm files / series   │             │
│            └──────────────────────────────────┘             │
│                    (DicomDropzone)                           │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

**B. Loaded state — viewing a series**

```
┌────────────────────────────────────────────────────────────┐
│  Prostate MRI Viewer                    Series: T2 TSE ax v  │  header + sequence switch
├──────────────────────────────────────────────┬─────────────┤
│ [Zoom] [Pan] [W/L] [Scroll] [Reset]           │  Metadata   │  <- ViewerToolbar
│                                                │             │
│  ┌──────────────────────────────────────────┐ │  Patient    │
│  │                                          │ │  ID: ****    │
│  │                                          │ │  Sex: M      │
│  │            MRI slice (canvas)            │ │             │
│  │          Cornerstone3D viewport          │ │  Study      │
│  │                                          │ │  Date: ...   │
│  │                                          │ │  Desc: ...   │
│  │                                          │ │             │
│  │                                          │ │  Series     │
│  │  WW: 400  WC: 40           Slice 12 / 30 │ │  MR · T2 ax  │
│  └──────────────────────────────────────────┘ │  512 x 512   │
│  |------------------o-----------------------|  │ (MetadataPanel)
│         slice slider (1 ... 30)                │             │
├──────────────────────────────────────────────┴─────────────┤
│  Status: 30 slices loaded · GPU rendering                    │  <- status bar
└──────────────────────────────────────────────────────────────┘
   (DicomViewport = central canvas; overlays show WW/WC + slice index)
```

**C. Loading / error state (LoadingOverlay over the viewport)**

```
┌──────────────────────────────────────────┐     ┌──────────────────────────────┐
│                                          │     │  (!) Could not read file      │
│            Parsing DICOM...              │     │  "scan.txt" is not valid      │
│         ############........  68%        │ or  │  DICOM. Other files loaded.   │
│                                          │     │              [ Dismiss ]      │
└──────────────────────────────────────────┘     └──────────────────────────────┘
```

**Layout notes**
- 3-zone desktop layout: top toolbar, central viewport (flex-grow), right metadata
  panel (fixed ~280px). Status bar at the bottom.
- Viewport overlays (WW/WC bottom-left, slice index bottom-right) are drawn by
  Cornerstone3D, not DOM.
- Sequence switcher (top-right) lists series of the loaded study (v1: FR-007).
- Tailwind CSS; dark theme by default (standard for radiology reading).

> **Approved UI/interaction source of truth:** `design-research/` (Status:
> COMPLETED, approved 2026-08-22). The wireframes here are consistent with it; the
> research directory holds the full rationale, sources, and traceability.

### 7.9 Interaction model (approved — 2-button trackpad, keyboard-first)

v1 targets a **2-button trackpad** (no wheel, no middle/extra buttons). The
**keyboard is the primary navigation path**; two-finger scroll is an optional
accelerator. Faithful rendering only — no app-side gamma/tone/color (GSDF).

**Pointer (2 buttons):**

| Input | Action |
|-------|--------|
| Left drag | Active tool (default **Window/Level**) |
| Right drag | Zoom (fixed) |
| Shift + left drag | Pan |
| Two-finger scroll (if available) | Scroll slices (optional) |
| Double-click | Fit to viewport |
| Right-click (no drag) | Context menu: tools + presets |

**Keyboard:**

| Keys | Action |
|------|--------|
| Arrows / PageUp-Down / Home-End | Slice navigation (primary) |
| `W` `S` `Z` `P` `R` | Window/Level · Scroll-drag · Zoom · Pan · Reset |
| `[` `]` · `-` `=` · `0` | Window width · window center · reset to stored VOI |
| `Space` | Cine play/pause |
| `1`…`9` | Switch series (T2/DWI/ADC…) |
| `I` · `F` · `?` · `Esc` | Metadata · Fullscreen · Cheat-sheet · Close/cancel |

**Window/Level policy:** default to the series' **DICOM-stored VOI LUT**; provide
recallable manual presets. No hardcoded numeric WW/WC presets in v1.

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
