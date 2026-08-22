# Project Structure

This document defines the architecture and organization of the FacilitoKiro project using the SDD (Structure-Definition-Development) methodology.

## Overview

The SDD methodology divides development into three phases:
1. **Structure** - Define the architecture and directory layout
2. **Definition** - Define requirements, specifications, and conventions
3. **Development** - Execute the actual implementation

## Project Architecture

```
FacilitoKiro/
├── .kiro/                      # Kiro configuration
│   ├── steering/              # Steering files for team standards
│   │   ├── structure.md       # This file - architecture definition
│   │   ├── definition.md      # Requirements and specifications
│   │   └── development.md     # Development workflows
│   ├── hooks/                 # Kiro hooks for automation
│   ├── specs/                 # Feature specifications
│   └── agents/                # Custom agent configurations
├── projects/                  # Project directories
│   └── sandbox/              # Main workspace
├── src/                       # Source code
├── tests/                     # Test files
├── docs/                      # Documentation
├── scripts/                   # Build and automation scripts
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

### `scripts/`
Build, deployment, and automation scripts.

## Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | [To be defined] | Framework, UI library |
| Backend | [To be defined] | Runtime, framework |
| Database | [To be defined] | Type, provider |
| Infrastructure | [To be defined] | Hosting, CI/CD |
| Testing | [To be defined] | Framework, coverage |

## Conventions

- All configuration files in `.kiro/` should be version controlled
- Steering files define team standards and are not modified by agents without review
- Specifications in `specs/` must be approved before development begins
- Use semantic versioning for releases

## References

- [[file:definition.md]] - Requirements and specifications
- [[file:development.md]] - Development workflows and processes
