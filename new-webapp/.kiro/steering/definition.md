# Project Definition

This document defines the requirements, specifications, and conventions for the Prostate MRI Viewer project using the SDD (Structure-Definition-Development) methodology.

## Project Overview

**Project Name:** Prostate MRI Viewer  
**Purpose:** Web-based medical imaging viewer for prostate cancer MRI scans  
**Methodology:** SDD (Structure-Definition-Development) - **Iterative Development**

**Important:** This project follows an **iterative development approach** where specifications evolve over time. The current version (v1) provides the basic foundation, and specifications will be refined and expanded as development progresses.

---

## Current Specification: Version 1.0 (Initial)

### What is being built in this phase:

**A DICOM-based MRI viewer for prostate cancer imaging.**

MRI scans are medical DICOM data — not flat images. From v1 the viewer works with
real DICOM files, preserving clinical metadata, pixel spacing, and window/level.

- Load and parse DICOM files (single files and multi-slice series)
- Render MRI slices with correct grayscale window/level (VOI LUT)
- Navigate slices within a series (scroll/stack)
- Basic navigation: zoom, pan, window/level adjustment
- Display DICOM metadata (patient, study, series, sequence)

### Iterative Nature:

| Phase | Scope | Complexity |
|-------|-------|------------|
| v1 | DICOM 2D viewer (single series, window/level, slice scroll) | Medium |
| v2 | Multi-planar reconstruction (axial/sagittal/coronal) | Medium |
| v3 | Segmentation visualization / overlays | Complex |
| v4 | DICOMweb + PACS integration (server-backed) | Complex |
| v5 | Clinical workflow tools (annotations, measurements, reporting) | Advanced |
| v6+ | Production-ready with feedback | Evolving |

## Requirements

### Functional Requirements (v1 - DICOM Viewer)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | Load and parse DICOM files (P10, common transfer syntaxes) | High |
| FR-002 | Render MRI slices with correct window/level (VOI LUT) | High |
| FR-003 | Load a full DICOM series and scroll through slices | High |
| FR-004 | Basic navigation: zoom, pan, window/level | High |
| FR-005 | Display DICOM metadata (patient/study/series/sequence) | High |
| FR-006 | Load DICOM from local storage (drag & drop / file picker) | High |
| FR-007 | Switch between MRI sequences within a study | Medium |

### Non-Functional Requirements (v1)

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-001 | GPU-accelerated rendering, smooth slice scrolling | High |
| NFR-002 | Handle large series (hundreds of slices) without freezing | High |
| NFR-003 | Responsive UI on desktop | High |
| NFR-004 | Clear error handling for malformed/unsupported DICOM | High |
| NFR-005 | Patient data stays client-side (no upload in v1) | High |

## Technical Specifications (v1)

### Architecture

```
┌───────────────────────────────────────────────┐
│               Client Browser                   │
│  ┌─────────────────────────────────────────┐  │
│  │   MRI Viewer (React + TypeScript)       │  │
│  │   ┌───────────────────────────────────┐ │  │
│  │   │ Cornerstone3D (WebGL rendering)   │ │  │
│  │   │  - Viewport / stack rendering     │ │  │
│  │   │  - VOI LUT (window/level)         │ │  │
│  │   │  - Tools: zoom, pan, scroll, WWWC │ │  │
│  │   └───────────────────────────────────┘ │  │
│  │   ┌───────────────────────────────────┐ │  │
│  │   │ DICOM Image Loader (dicom-parser) │ │  │
│  │   │  - Parse P10 + transfer syntaxes  │ │  │
│  │   │  - Extract metadata               │ │  │
│  │   └───────────────────────────────────┘ │  │
│  └─────────────────────────────────────────┘  │
└───────────────────────────────────────────────┘
```

### Technology Stack (v1)

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 18, TypeScript, Vite | Modern SPA base |
| Rendering | **Cornerstone3D** (`@cornerstonejs/core`, `@cornerstonejs/tools`) | GPU-accelerated medical image rendering |
| DICOM loading | `@cornerstonejs/dicom-image-loader` + `dicom-parser` | Parse DICOM P10 and register image loaders |
| State | React Context / Zustand | Viewport & UI state |
| Styling | Tailwind CSS | Medical UI design |
| Build/Test | Vite, Vitest, React Testing Library | Dev tooling |

**Why Cornerstone3D:** it is the de-facto standard for web medical imaging (the
engine behind the OHIF Viewer), provides robust DICOM parsing and WebGL rendering,
and scales from a single 2D viewer up to MPR, segmentation, and PACS integration
without rewriting the core. This avoids building a throwaway JPEG/PNG prototype
for genuine clinical DICOM data.

### Next Steps (Future Versions)

- Multi-planar reconstruction (MPR) via Cornerstone3D volume viewports
- 3D volume rendering
- Segmentation overlay and labelmaps
- DICOMweb (WADO-RS/QIDO-RS) + PACS (e.g. Orthanc) integration
- Clinical annotations, measurements, and structured reporting

## Conventions (v1)

### Code Style

| Language | Style Guide | Linter |
|----------|-------------|--------|
| TypeScript | Airbnb Style Guide | ESLint |
| React | React Hooks best practices | React Testing Library |

### Git Conventions

- Branch naming: `feature/`, `v1/`, `v2/`, `bugfix/`
- Commit message format: `<type>: <description>`
- Version tags: `v1.0.0`, `v1.1.0`, etc.
- PR template: `.kiro/specs/pr_template.md`

### File Naming

- Components: `PascalCase.tsx`, `PascalCase.ts`
- Utilities: `camelCase.ts`
- Tests: `*.test.tsx`, `*.spec.ts`
- MRI viewer components: `src/components/mri-viewer/`

## Acceptance Criteria (v1)

- Users can load real DICOM files/series from local storage (drag & drop or picker)
- MRI slices render with correct window/level (VOI LUT) and grayscale
- Users can scroll through all slices of a series smoothly
- Zoom, pan, and window/level adjustment work correctly
- DICOM metadata (patient, study, series, sequence) is displayed
- Malformed or unsupported DICOM files produce a clear error message
- Large series (hundreds of slices) load without freezing the UI

## References

- [[file:structure.md]] - Project structure and architecture
- [[file:development.md]] - Development workflows and processes

---

## Evolution Plan

Specifications will be updated as the project evolves:

1. **Version 1.0** - Basic MRI viewer (current)
2. **Version 1.1** - Multi-sequence support
3. **Version 2.0** - DICOM integration
4. **Version 3.0** - Advanced visualization
5. **Production** - Clinical workflow integration

Each version will have its own specification document in `docs/specifications/`

---

## Development Notes

### Iterative Development Process

1. **Start Simple** - Begin with basic, well-defined features
2. **Get Feedback** - Show working software to stakeholders
3. **Refine Requirements** - Update specifications based on real-world use
4. **Add Complexity** - Incrementally add more features and sophistication
5. **Production Ready** - Refine for clinical use with all required features

### Specification Versioning

- Version documents are stored in `docs/specifications/`
- Each version has its own file: `v1.md`, `v2.md`, etc.
- Current active version is referenced in `definition.md`
- Old versions are preserved for reference

---

## Post-Change Workflow

### After Any Change (Code or Documentation)

When a change is made to the project (whether in code or documentation), the following must be done:

1. **Make the change** - Update code, configuration, or documentation
2. **Test the change** - Run tests to verify the change works correctly
3. **Commit the change** - Use descriptive commit messages following the format: `<type>: <description>`
4. **Update documentation** - Ensure all relevant documentation reflects the change
5. **Update specifications** - If the change affects functionality, update the relevant specification in `docs/specifications/`

### Git Workflow

```bash
# 1. Make your changes (code or documentation)
# 2. Test the changes
# 3. Stage changes
git add .

# 4. Commit with descriptive message
git commit -m "feat: add image loading functionality"

# 5. Update documentation if needed
# 6. Push to repository
git push origin feature/your-feature
```

### Commit Message Format

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Version Updates

- Update `version` in `package.json` following semantic versioning
- Create a new version document in `docs/specifications/vX.md`
- Tag the release: `git tag v1.0.0`
