# Project Structure

This document defines the architecture and organization of the Prostate MRI Viewer project using the SDD (Structure-Definition-Development) methodology.

## Overview

The SDD methodology divides development into three phases:
1. **Structure** - Define the architecture and directory layout
2. **Definition** - Define requirements, specifications, and conventions
3. **Development** - Execute the actual implementation

**Important:** This project follows an **iterative development approach** where specifications evolve over time:
- **Initial phase:** Simple, high-level requirements
- **Ongoing:** Specifications become more detailed based on feedback
- **Production:** Requirements continue to evolve based on user feedback and clinical needs

## Project Architecture

```
prostate-mri-viewer/
├── .kiro/                      # Kiro configuration
│   ├── steering/              # Steering files for team standards
│   │   ├── structure.md       # This file - architecture definition
│   │   ├── definition.md      # Requirements and specifications
│   │   └── development.md     # Development workflows
│   ├── hooks/                 # Kiro hooks for automation
│   ├── specs/                 # Feature specifications
│   │   └── v1/               # Versioned specifications
│   └── agents/                # Custom agent configurations
├── projects/                  # Project environments
│   └── sandbox/              # Development environment
├── src/                       # Source code
│   ├── components/           # React components
│   │   └── mri-viewer/       # MRI viewer specific components
│   ├── services/             # API services
│   ├── utils/                # Utility functions
│   └── types/                # TypeScript type definitions
├── tests/                     # Test files
├── docs/                      # Documentation
│   ├── architecture/         # Architecture decisions
│   ├── api/                  # API documentation
│   └── specifications/       # Evolving specifications
├── scripts/                   # Build and automation scripts
├── data/                      # Sample medical data (DICOM, etc.)
└── README.md                  # Project overview
```

## Directory Purposes

### `.kiro/`
Contains all Kiro-specific configuration files that define how the agent operates on this project.

### `projects/`
Holds different project environments (sandbox, development, staging, production).

### `src/`
Main source code directory, organized by feature or module.

### `tests/`
All test files organized by test type (unit, integration, e2e).

### `docs/`
Project documentation including architecture decisions, API docs, and user guides.

### `docs/specifications/`
**Evolving specifications** - specifications are versioned and updated as the project evolves.

### `scripts/`
Build, deployment, and automation scripts.

### `data/`
Sample medical imaging data for development and testing (DICOM files, etc.).

## Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 18, TypeScript, Vite | Modern SPA base |
| Rendering | Cornerstone3D (WebGL) | GPU-accelerated DICOM/MRI rendering (v1) |
| DICOM loading | @cornerstonejs/dicom-image-loader + dicom-parser | Parse DICOM P10, register image loaders (v1) |
| Backend | Node.js, Express.js | DICOMweb proxy / metadata API (v4+) |
| Database | PostgreSQL + JSONB | Store DICOM metadata, annotations (v4+) |
| PACS/Storage | Orthanc (DICOMweb) | Server-backed image storage (v4+) |
| Infrastructure | Docker, GitHub Actions | CI/CD and containerization |
| Medical Standards | DICOM, DICOMweb, HL7 | Medical imaging standards |

## Conventions

- All configuration files in `.kiro/` should be version controlled
- Steering files define team standards and are not modified by agents without review
- Specifications in `specs/` are versioned and evolve throughout development
- Use semantic versioning for releases
- Follow medical imaging best practices (DICOM compliance)
- **Iterative development:** Specifications start simple and become more detailed over time

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

## References

- [[file:definition.md]] - Requirements and specifications (iterative)
- [[file:development.md]] - Development workflows and processes
