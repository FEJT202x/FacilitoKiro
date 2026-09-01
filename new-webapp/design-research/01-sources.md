# 01 — Consulted Sources

> Design-phase reference. Not for implementation until README status is `COMPLETED`.

All summaries elsewhere in this directory paraphrase these sources. Content was
rephrased for compliance with licensing restrictions; no source is quoted beyond
brief fragments.

## Standards & official bodies

| # | Source | Link | Used for |
|---|--------|------|----------|
| S1 | DICOM PS3.14 — Grayscale Standard Display Function (GSDF), NEMA | https://dicom.nema.org/medical/dicom/current/output/pdf/part14.pdf | Grayscale calibration standard for diagnostic displays |
| S2 | AAPM Task Group 18 — Assessment of Display Performance for Medical Imaging Systems | https://pmc.ncbi.nlm.nih.gov/articles/PMC3045187/ | Display QA, max room lighting method |
| S3 | ACR–AAPM–SIIM Technical Standard for Electronic Practice of Medical Imaging | https://gravitas.acr.org/PPTS/GetDocumentView?docId=136 | Ambient luminance, display requirements |
| S4 | Radiology monitor luminance technical guide (industry) | https://synergymedco.com/how-to-choose-radiology-monitor-luminance-a-technical-guide-for-diagnostic-precision/ | ACR/AAPM luminance benchmarks (350 cd/m² general) |

## Usability / interaction references (viewers)

| # | Source | Link | Used for |
|---|--------|------|----------|
| S5 | RadiAnt DICOM Viewer — Mouse functions | https://www.radiantviewer.com/dicom-viewer-manual/mouse_functions.html | Default mouse mapping conventions |
| S6 | Weasis — Keyboard & mouse shortcuts | https://weasis.org/en/basics/shortcuts/ | Shortcut categories, panel/tab controls |
| S7 | Weasis — DICOM 2D viewer tutorial | https://weasis.org/en/tutorials/dicom-2d-viewer/ | Series scroll, 2D viewer behaviors |
| S8 | Weasis — MPR tutorial | https://weasis.org/en/tutorials/mpr/ | Crosshair/MPR interaction model (future v2) |
| S9 | MicroDICOM — Keyboard shortcuts | https://www.microdicom.com/dicom-viewer-user-manual/keyboard-shortcuts.html | Single-key tool shortcuts (W/L, zoom, pan, scroll, cine) |
| S10 | dcm4che / Weasis — Keyboard and Mouse Shortcuts | https://dcm4che.atlassian.net/wiki/x/AwA4 | Selection vs drawing mode interactions |
| S11 | OHIF Viewer (open-source, Cornerstone3D-based) | https://ohif.org/ | Reference web viewer built on Cornerstone3D |

## Ergonomics & reading environment

| # | Source | Link | Used for |
|---|--------|------|----------|
| S12 | "Ambient illumination revisited" (PubMed 17278493) | https://pubmed.ncbi.nlm.nih.gov/17278493/ | Low ambient light vs eye strain trade-off |
| S13 | "Optimization of Reading Conditions for Flat Panel Displays" (PMC3045187) | https://pmc.ncbi.nlm.nih.gov/articles/PMC3045187/ | TG18 max room lighting guidance |
| S14 | "Environmental Designs for Reading from Imaging Workstations" (PMC3045139) | https://pmc.ncbi.nlm.nih.gov/articles/PMC3045139/ | Reading-room ergonomics/architecture |
| S15 | "Features to Consider When Selecting Displays for Remote Reading" (PMC8589297) | https://pmc.ncbi.nlm.nih.gov/articles/PMC8589297/ | Remote/home reading display factors |
| S16 | Optimum display luminance vs evening ambient illuminance (ResearchGate) | https://www.researchgate.net/publication/351225629 | Visual fatigue vs luminance/illuminance ranges |

## Prostate MRI clinical workflow

| # | Source | Link | Used for |
|---|--------|------|----------|
| S17 | PI-RADS v2 synopsis (PMC6364687) | https://pmc.ncbi.nlm.nih.gov/articles/PMC6364687/ | Multiparametric reading, sequence roles |
| S18 | PI-RADS 2.1 & structured reporting (PMC8410719) | https://pmc.ncbi.nlm.nih.gov/articles/PMC8410719/ | T2/DWI/DCE scoring, zonal assessment |
| S19 | mpMRI + PI-RADS v2.1 state-of-the-art protocol (JBSR) | https://jbsr.be/articles/10.5334/jbsr.1943 | T2-WI + DWI + DCE combination |
| S20 | AUA SOP for prostate mpMRI | https://www.auanet.org/guidelines-and-quality/guidelines/other-clinical-guidance/mri-of-the-prostate-sop | Staging/management context |

## Notes on access

- DICOM PS3.14 (S1) and TG18 (S2) are the authoritative technical references for
  grayscale calibration and display QA; they inform *constraints* on our viewer,
  not features we implement in v1.
- Viewer docs (S5–S10) are used to extract **convergent interaction conventions**
  that specialized physicians already expect — the basis of our shortcut design.
