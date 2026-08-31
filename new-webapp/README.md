# Prostate MRI Viewer

A web-based DICOM medical imaging viewer for prostate cancer MRI scans, built with Vue 3, TypeScript, and Cornerstone3D.

## Overview

This project follows an **iterative development approach** where specifications evolve over time:

| Version | Description | Status |
|---------|-------------|--------|
| v1 | Basic MRI image viewer | In Development |
| v2 | Multi-sequence support | Planned |
| v3 | DICOM integration | Planned |
| v4 | Advanced visualization | Planned |

## Current Specification (v1)

**Goal:** A simple MRI image viewer for prostate cancer imaging.

### Features
- View MRI scan images in 2D
- Basic image navigation (zoom, pan)
- Simple interface for clinical review

## Project Structure

```
prostate-mri-viewer/
├── .kiro/                      # Kiro configuration
│   ├── steering/              # Steering files for team standards
│   ├── hooks/                 # Kiro hooks for automation
│   ├── specs/                 # Feature specifications
│   └── agents/                # Custom agent configurations
├── projects/                  # Project environments
│   └── sandbox/              # Development environment
├── src/                       # Source code
│   ├── components/           # Vue 3 components (.vue)
│   ├── services/             # API services
│   └── utils/                # Utility functions
├── tests/                     # Test files
├── docs/                      # Documentation
└── scripts/                   # Build and automation scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd projects/sandbox
npm install
npm start
```

## Development

See `.kiro/steering/` for detailed development workflows and specifications.

## Versioning

This project uses semantic versioning. Each version has its own specification document in `docs/specifications/`.

## License

MIT License