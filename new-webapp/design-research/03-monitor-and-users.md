# 03 — Professional Monitor & User Constraints

> Design-phase reference. Not for implementation until README status is `COMPLETED`.
> Sources cited as [S#] refer to `01-sources.md`. Summaries are paraphrased.

## Part A — The display is a calibrated, professional monitor

The target screen is a professional, **calibratable** diagnostic monitor, not a
consumer display. Two standards govern this context:

### DICOM GSDF (PS3.14) [S1]
The DICOM Grayscale Standard Display Function defines how pixel values map to
perceived luminance so that images look consistent across calibrated displays.
Diagnostic monitors are calibrated to GSDF.

**Design consequence:**
- Our app must **not apply its own gamma, color filters, or tone curves** to the
  image. We render pixel data faithfully and let the calibrated display + the
  DICOM VOI LUT (window/level) do their job. Any "beautifying" image processing
  would break calibration and is prohibited.
- UI chrome colors must never bleed into or tint the image area.

### AAPM TG18 [S2][S13] and ACR/AAPM luminance benchmarks [S3][S4]
TG18 provides display QA methods, including guidance for maximum room lighting.
Industry summaries of ACR/AAPM cite a **minimum luminance around 350 cd/m² for
general radiology** (higher for mammography) [S4].

**Design consequence:**
- Assume a high-luminance grayscale-calibrated panel. The image region should be
  able to occupy the full calibrated area, unobstructed.
- Avoid bright, large UI surfaces adjacent to the image that would raise perceived
  ambient light and reduce contrast discrimination.

## Part B — Reading environment (ambient light) [S12][S13][S16]

Reading rooms are kept dark to preserve contrast in dark image regions, but very
low light can cause eye strain [S12]. TG18 gives a method to determine the maximum
acceptable room lighting for a given display [S13]. Studies relate visual fatigue
to the balance between screen luminance and ambient illuminance [S16].

**Design consequence:**
- Default to a **dark UI theme** to match reading-room conditions and avoid glare.
- Keep non-image UI at **low luminance** (dark grays, muted text) so it does not
  compete with the image or fatigue the eyes.
- Do not use large white backgrounds anywhere in the reading view.

## Part C — Target users: specialized physicians

The users are specialized physicians (e.g. radiologists) reading prostate mpMRI.
Their constraints and expectations, derived from workflow and ergonomics sources
[S14][S15][S17–S19]:

| Constraint | Implication for our UI |
|------------|------------------------|
| **High volume, time-pressured reading** | Minimize clicks; keyboard-first; the core loop must be instantaneous |
| **Already trained on RadiAnt/Weasis/PACS conventions** | Reuse familiar mouse/key mappings; don't invent novel gestures |
| **Eyes on the image, not the chrome** | Controls peripheral/collapsible; overlays on the image itself |
| **Multiparametric comparison (T2/DWI/ADC)** [S17-S19] | Fast sequence switching now; comparison later |
| **Prolonged sessions → fatigue** [S12][S16] | Dark theme, low-luminance chrome, no animation/flicker |
| **Precision matters (diagnosis)** | Faithful rendering; visible WW/WC and slice index; no auto image "enhancement" |
| **Mixed input hardware** (mouse, sometimes limited buttons) | Don't rely on 4th/5th mouse buttons; provide modifier/keyboard equivalents |
| **Accuracy of identifiers** | Persistent patient/series/slice overlays to prevent mix-ups |

### Accessibility / practical notes
- Some users may have limited color vision; **do not encode critical information in
  color alone** — use text/position too. Grayscale image integrity is paramount.
- Support left- and right-handed mouse use where feasible via configurable mappings
  (future); v1 ships sensible defaults matching RadiAnt/MicroDICOM.

## Consolidated constraints for the design

1. **Faithful rendering only** — no app-side gamma/tone/color processing (GSDF).
2. **Dark, low-luminance UI**; image-first; no large bright surfaces.
3. **Keyboard-first, few-clicks** interaction for high-volume time-pressured work.
4. **Familiar conventions** from established viewers; no novel gestures.
5. **Persistent overlays** for identifiers, slice index, WW/WC.
6. **No reliance on exotic mouse buttons**; provide keyboard/modifier equivalents.
7. **No color-only information encoding**.
8. Design must extend to **sequence comparison** for mpMRI without rework.
