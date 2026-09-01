# Design Research — Prostate MRI Viewer

> ## ✅ STATUS: COMPLETED — APPROVED FOR IMPLEMENTATION
>
> The design research and the resulting UI/interaction design have been reviewed
> and **approved**. Implementation may proceed based on these documents and the
> reconciled formal design at `docs/architecture/design-v1.md`.
>
> Changes after approval must follow the SDD Post-Change Workflow (commit + update
> docs) and, if they alter design intent, be re-approved here.

---

## Completion Gate

| Field | Value |
|-------|-------|
| **Status** | `COMPLETED` |
| **Approved by** | Client (project owner) |
| **Approved date** | 2026-08-22 |

The design is approved. Resolved decisions (see `05-interactions.md` "Decisions")
and the 2-button trackpad input constraint are now the basis for implementation.

---

## Purpose

This directory documents, following the client's methodology:

1. **Research** on the usability of the leading, standards-compliant MRI viewers,
   the professional (calibratable) monitor context, and the constraints of the
   target users (specialized physicians).
2. A **simple, functional UI design** derived *from that research* — not from
   conventional/commercial app criteria — with keyboard and mouse shortcuts, for a
   desktop monitor.
3. The **rendering approach**: use a specialized medical-imaging engine for pixels;
   build a minimal, purpose-specific UI rather than a heavy commercial UI framework.

**Guiding principle (client): functionality first.** Visual polish is secondary;
every decision must trace back to a research finding or a functional need.

## Contents

| File | Description |
|------|-------------|
| `01-sources.md` | List of consulted pages/standards with links |
| `02-usability-analysis.md` | Analysis of leading MRI/PACS viewers' usability |
| `03-monitor-and-users.md` | Professional monitor calibration + physician user constraints |
| `04-ui-design.md` | The simple, functional UI design (monitor) |
| `05-interactions.md` | Keyboard & mouse shortcut design |
| `06-rendering-approach.md` | Rendering engine vs custom UI rationale |

## Relationship to the rest of the repo

- This directory **feeds** the formal design at
  `docs/architecture/design-v1.md` and the spec at `docs/specifications/v1.md`.
- When status becomes `COMPLETED`, the approved decisions are merged into those
  documents, and only then does implementation begin (per the SDD Post-Change
  Workflow in `.kiro/steering/`).

## Compliance note

Research summaries paraphrase third-party sources; each is cited inline in
`01-sources.md`. Content was rephrased for compliance with licensing restrictions.
