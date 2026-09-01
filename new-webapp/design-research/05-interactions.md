# 05 — Interaction Design (Keyboard & Mouse)

> Design-phase reference. Not for implementation until README status is `COMPLETED`.
> Mappings converge with established viewers [S5][S6][S9] so physicians reuse
> existing muscle memory [F1][F2][C4]. Sources/findings per `01`/`02`/`03`.

## Design rules

1. **Match convention, don't invent.** Defaults mirror RadiAnt/MicroDICOM so users
   are productive immediately [C4].
2. **Keyboard-first.** Every core action has a key; the pointer is for direct
   manipulation on the image [F2].
3. **2-button trackpad only (v1 constraint).** No wheel, no middle button, no
   4th/5th buttons. The keyboard is the primary navigation path; two-finger scroll
   is an optional accelerator [C6].
4. **Single active "left-drag tool"** switched by one key; **right-drag = zoom**
   (fixed) [F1].

## Input device (v1): 2-button trackpad, no wheel

Target workstations have a **two-button trackpad** — no scroll wheel, no middle
button, no 4th/5th buttons. Interactions must work with: left button, right button,
an optional **two-finger scroll** gesture (browsers report it as wheel events), and
the keyboard. The **keyboard is the reliable primary** for navigation.

### Pointer mapping (2 buttons)

| Input | Action | Note |
|-------|--------|------|
| **Left drag** | Active tool (default: Window/Level) | Tool switched by keys [F1] |
| **Right drag** | Zoom | Fixed (matches RadiAnt right-drag zoom [S5]) |
| **Shift + left drag** | Pan | No middle button needed [C6] |
| **Two-finger scroll** (if available) | Scroll slices | Optional accelerator; not required [F3] |
| **Double-click** | Fit image to viewport | Quick reset of pan/zoom |
| **Right-click (no drag)** | Context menu: tools + presets | Discoverability with only 2 buttons |

> Because there is **no wheel or middle button**, the reliable path for slice
> navigation is the **keyboard** (arrows / PageUp-Down / Home-End) and the on-screen
> **slider**; two-finger scroll is a convenience when the trackpad supports it.

## Keyboard — tools (single key) [S9]

| Key | Tool / Action |
|-----|---------------|
| `W` | Window/Level tool (left-drag adjusts WW/WC) |
| `S` | Scroll/stack tool (left-drag scrolls) |
| `Z` | Zoom tool |
| `P` | Pan tool |
| `R` | Reset view (fit + default WW/WC) |

## Keyboard — navigation

| Key | Action |
|-----|--------|
| `↓` / `↑` or `→` / `←` | Next / previous slice |
| `Page Down` / `Page Up` | Jump 10 slices |
| `Home` / `End` | First / last slice |
| `Space` | Play/pause cine [S9] |
| `1` … `9` | Switch to series 1…9 (T2/DWI/ADC…) [F5] |
| `I` | Toggle metadata panel |
| `F` | Toggle fullscreen |
| `?` | Show shortcut cheat-sheet overlay |
| `Esc` | Close panel/overlay; cancel |

## Keyboard — window/level presets

Prostate MRI benefits from quick preset recall [S17-S19]; presets are confirmed in
Open question OQ-3.

| Key | Action |
|-----|--------|
| `[` / `]` | Decrease / increase window width |
| `-` / `=` | Decrease / increase window center |
| `0` | Reset WW/WC to the series' stored VOI |

## Cine (auto-scroll) [S9]

- `Space` toggles play/pause; speed adjustable (default ~15 fps), loops the series.
- Cine stops on any manual scroll input.

## Discoverability

- A persistent, unobtrusive `?` hint sits in the corner; pressing `?` opens a
  **cheat-sheet overlay** listing all shortcuts (dark, dismiss with `Esc`).
- The action bar shows the **active tool** as text + highlight (not color alone
  [C7]).

## Accessibility

- All actions are keyboard-reachable; no action is mouse-only.
- Focus order is logical; the viewport is focusable for key navigation.
- Shortcuts avoid clashing with common screen-reader/browser keys where feasible.

## Decisions (resolved open questions)

Resolved by the maintainer, adjusted to the research and the 2-button trackpad
constraint. Rationale is traced to findings [F#] / constraints [C#] / sources [S#].

- **OQ-1 → DECIDED: default left-drag = Window/Level.** W/L is the most
  continuously adjusted parameter and needs 2-axis drag precision the keyboard
  serves poorly. Slice navigation is well covered by keyboard + slider + optional
  two-finger scroll, so the single left-drag tool is best spent on W/L by default.
  Pressing `S` switches left-drag to slice-scrub for physicians who prefer dragging.
  [F1, F2, C3]
- **OQ-2 → DECIDED: two-finger scroll = slice navigation** (never zoom), matching
  universal convention [F3]. Zoom is right-drag or the `Z` tool [S5]. Since the
  wheel is not guaranteed, keyboard/slider remain the primary slice controls [C6].
- **OQ-3 → DECIDED: use the series' DICOM-stored VOI LUT** as the default
  window/level, plus **recallable manual presets** (the mechanism is designed).
  We do **not hardcode arbitrary numeric WW/WC presets** in v1: inventing numbers
  without real sample data or the client's radiologists would violate faithful-
  rendering principles [S1] and PI-RADS reading practice [S17-S19]. Per-sequence
  numeric presets are captured later from real data/radiologist input (tracked,
  non-blocking).
- **OQ-4 → RESOLVED by constraint: 2-button trackpad only.** No wheel, middle, or
  extra buttons. Keyboard is the primary navigation path; two-finger scroll is an
  optional accelerator. All mappings above respect this [C6].

## Traceability

| Interaction decision | Traces to |
|-----------------------|-----------|
| Keyboard/slider = primary slice nav; two-finger scroll optional | F3, C6 |
| Single-key tools (W/S/Z/P/R) | F2, S9 |
| Fixed right-drag=zoom; Shift+left=pan (no middle/wheel) | F1, S5, C6 |
| Cine on Space | F3, S9 |
| Series keys 1..9 | F5 |
| Cheat-sheet + text tool state | F2, C7 |
| Keyboard-reachable everything | C3, accessibility |
