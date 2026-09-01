# Session Log & Handoff — Prostate MRI Viewer

> Purpose: preserve the full context of the working sessions so nothing is lost and
> work can resume cleanly. This is a narrative record of decisions and state, kept
> in the repo alongside the code and design docs.

**Last updated:** 2026-08-22 (end of session — pausing, continuing next day)
**Active branch:** `vue3`
**Repo:** FEJT202x/FacilitoKiro · project dir: `new-webapp/`

---

## 1. What this project is

A web-based **DICOM MRI viewer for prostate cancer imaging**, developed inside the
`FacilitoKiro` repo under `new-webapp/`. Built with an **iterative** delivery model
(v1 simple → grows toward production) using the **SDD** methodology (Structure →
Definition → Development) driven by `.kiro/steering/` files.

---

## 2. Branch structure (three parallel branches — kept intentionally)

| Branch | Frontend | Base commit | Role |
|--------|----------|-------------|------|
| `vue3` | Vue 3 + Pinia | tip `8d25b51` | **Primary work** — approved design + v1 scaffold |
| `original-design` | React | `d19bd99` | Original design, for a parallel team |
| `feature/prostate-mri-viewer` | Vue 3 | `9283ddb` | Backs **PR #2**; currently == vue3 up to the Vue switch |
| `main` | — | — | Base; contains the `.kiro` SDD template (merged via PR #1) |

All three feature branches are pushed to `origin`. No destructive resets were done.
Both frontends share the **same DICOM/Cornerstone3D core**; only the UI layer differs.

### Pull Requests
- **PR #1** (merged): added the `.kiro` SDD methodology template to `main`.
- **PR #2** (open): `feature/prostate-mri-viewer` → `main` (Vue 3 project baseline).

---

## 3. Chronology of decisions (the "conversation" record)

1. **`.kiro` SDD template** created (steering: structure/definition/development;
   hooks; specs; agents) and committed to the repo (PR #1).
2. **New project** started under `new-webapp/` from the template.
3. Project defined as a **Prostate MRI Viewer**, iterative (v1→v6+).
4. **DICOM from v1** — corrected after the client noted "MRI scans are not
   drawings": dropped the JPEG/PNG idea; DICOM is a v1 core requirement.
5. **Rendering engine = Cornerstone3D** (de-facto standard, GSDF-faithful, powers
   OHIF). Documented in `docs/specifications/v1.md`.
6. **Frontend = Vue 3** (team familiarity). Created `vue3` branch as the alternative;
   `original-design` keeps the React version; both share the core.
7. **Design document** `docs/architecture/design-v1.md` written, then extended with
   **component diagrams**, **interaction diagrams**, **TypeScript interface
   contracts**, and **UI wireframes**.
8. **Research-driven UI** per client methodology → `design-research/` directory with
   a **gating README** (could not be used for implementation until `COMPLETED`).
   Sources: DICOM PS3.14/GSDF, AAPM TG18, ACR, RadiAnt/Weasis/MicroDICOM shortcut
   conventions, PI-RADS, ergonomics studies.
9. **Input constraint changed** to a **2-button trackpad** (no wheel/middle/extra).
   Open questions resolved accordingly (see §4).
10. **Design APPROVED** by client → `design-research/README` set to `COMPLETED`
    (2026-08-22); design-v1 reconciled with the approved interaction model.
11. **v1 scaffold implemented** on `vue3` (Vue 3 + Vite + TS + Pinia + Tailwind +
    Cornerstone3D). Committed `8d25b51`.
12. **Environment check**: this sandbox **cannot run `npm install`** — the egress
    proxy blocks the npm registry (403). See §6.

---

## 4. Resolved design decisions (interaction)

- **OQ-1:** default **left-drag = Window/Level**; `S` switches left-drag to slice
  scrub.
- **OQ-2:** **two-finger scroll = slice navigation** (never zoom); keyboard/slider
  are the primary slice controls.
- **OQ-3:** default window/level = the **series' DICOM-stored VOI LUT**; recallable
  manual presets; **no hardcoded numeric WW/WC presets** in v1.
- **OQ-4:** **2-button trackpad only**; right-drag = zoom, Shift+left = pan.

Guardrails: **no app-side image processing** beyond VOI LUT (GSDF fidelity); dark
low-luminance image-first UI; no color-only encoding.

---

## 5. Current state of the code (v1 scaffold on `vue3`)

```
new-webapp/
├── design-research/            # APPROVED research + UI design (source of truth)
│   ├── README.md               # Status: COMPLETED (approved 2026-08-22)
│   ├── 01-sources.md … 06-rendering-approach.md
├── docs/
│   ├── architecture/design-v1.md
│   ├── specifications/v1.md
│   └── SESSION-LOG.md          # ← this file
├── src/
│   ├── components/mri-viewer/  # ViewerPage, DicomViewport, DicomDropzone,
│   │                           # ViewerToolbar, MetadataPanel, LoadingOverlay
│   ├── composables/            # useCornerstone, useDicomLoader, useViewport
│   ├── stores/                 # studyStore, viewportStore (Pinia)
│   ├── types/dicom.ts
│   ├── App.vue, main.ts, style.css
├── index.html, package.json, vite.config.ts, tsconfig*.json,
├── tailwind.config.js, postcss.config.js, eslint.config.js, .gitignore
```

**Status:** code complete as a scaffold; **not built/tested** in this environment.

---

## 6. Environment limitation (important for next session)

- Sandbox network mode: `INTEGRATIONS_ONLY`. The egress proxy **blocks the npm
  registry** — verified: `npm install vue` → **403 Forbidden**.
- Also, `NODE_OPTIONS` points to a missing `proxy-bootstrap.js`; plain `node` needs
  `NODE_OPTIONS=` cleared to run.
- Consequence: **cannot** `npm install`, run the dev server, `vue-tsc`, or Vitest
  **here**. Do this in an environment with npm access:
  ```bash
  cd new-webapp
  npm install
  npm run dev
  npm run typecheck
  ```

---

## 7. Open items / TODO for next session

1. **Validate Cornerstone3D API** against the installed version after `npm install`
   — check `src/composables/useCornerstone.ts` (init) and `useViewport.ts` (tool
   bindings). The code targets the **1.x** line pinned in `package.json`.
2. Run `npm run typecheck` and `npm run lint`; fix any issues.
3. Test the core loop with a real DICOM series (load, scroll, W/L, zoom, pan,
   sequence switch, cine, metadata panel, keyboard shortcuts).
4. Optionally: extract pure logic (VOI conversion, slice sorting, metadata parse)
   into testable modules + add Vitest tests.
5. Confirm prostate WW/WC presets with real data/radiologist input (OQ-3 follow-up).
6. Decide what to do with `feature/prostate-mri-viewer` / PR #2 (leave, or repoint).
7. Consider opening a PR for `vue3` when ready.

---

## 8. How to resume quickly

```bash
git fetch origin
git checkout vue3        # primary work
git log --oneline -8     # review recent commits
# read: design-research/README.md, docs/architecture/design-v1.md,
#       docs/specifications/v1.md, and this SESSION-LOG.md
```

Steering (`.kiro/steering/`) mandates the **Post-Change Workflow**: after any change
→ commit (`<type>: <description>`) → update docs → update the relevant spec.
