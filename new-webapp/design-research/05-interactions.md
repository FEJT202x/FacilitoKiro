# 05 — Interaction Design (Keyboard & Mouse)

> Design-phase reference. Not for implementation until README status is `COMPLETED`.
> Mappings converge with established viewers [S5][S6][S9] so physicians reuse
> existing muscle memory [F1][F2][C4]. Sources/findings per `01`/`02`/`03`.

## Design rules

1. **Match convention, don't invent.** Defaults mirror RadiAnt/MicroDICOM so users
   are productive immediately [C4].
2. **Keyboard-first.** Every core action has a key; the mouse is for direct
   manipulation on the image [F2].
3. **No reliance on 4th/5th mouse buttons** — provide modifier/keyboard equivalents
   [C6].
4. **Single active "left-drag tool"** switched by one key, plus fixed
   right/middle/wheel behaviors that rarely change (like RadiAnt) [F1].

## Mouse — default mapping

| Input | Action | Note |
|-------|--------|------|
| **Wheel** | Scroll slices | Most frequent action; always active [F3] |
| **Left drag** | Active tool (default: Window/Level) | Tool chosen by toolbar/keys [F1] |
| **Middle drag** | Pan | Fixed |
| **Right drag** | Zoom | Fixed (matches RadiAnt right-drag zoom [S5]) |
| **Double-click** | Fit image to viewport | Quick reset of pan/zoom |
| **Shift + left drag** | Pan (equivalent, no middle button needed) | For limited mice [C6] |
| **Ctrl + left drag** | Zoom (equivalent) | For limited mice [C6] |

> Rationale: RadiAnt uses left-drag to browse slices and middle-drag for
> window/level [S5]. We instead keep the **wheel** for slice scrolling (universal
> and always-on) and make **left-drag = the selected tool**, defaulting to
> Window/Level, which is the most continuously adjusted parameter while reading.
> This is documented as an explicit divergence for review (see Open question OQ-1).

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

## Open questions for review

- **OQ-1**: Default left-drag = Window/Level (our proposal) vs left-drag = Scroll
  (RadiAnt default [S5]). Which matches the client's radiologists' habit?
- **OQ-2**: Should the wheel scroll slices (our default) or zoom? Convention favors
  slice scroll; confirm.
- **OQ-3**: Preferred prostate WW/WC presets (per sequence: T2 vs DWI vs ADC)?
- **OQ-4**: Are 4th/5th mouse buttons available on the clinical workstations, or
  must we assume a 3-button mouse only?

## Traceability

| Interaction decision | Traces to |
|-----------------------|-----------|
| Wheel = slice scroll, always on | F3 |
| Single-key tools (W/S/Z/P/R) | F2, S9 |
| Fixed right=zoom, middle=pan + modifier equivalents | F1, S5, C6 |
| Cine on Space | F3, S9 |
| Series keys 1..9 | F5 |
| Cheat-sheet + text tool state | F2, C7 |
| Keyboard-reachable everything | C3, accessibility |
