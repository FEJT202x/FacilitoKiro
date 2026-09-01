// Domain types for the MRI viewer.
// See docs/architecture/design-v1.md §7.7 (interface contracts).

export interface PatientInfo {
  /** De-identified in v1. */
  id: string;
  name?: string;
  sex?: 'M' | 'F' | 'O';
  age?: string;
}

export interface StudyInfo {
  studyInstanceUID: string;
  studyDescription?: string;
  studyDate?: string;
}

export interface DicomInstanceMetadata {
  sopInstanceUID: string;
  instanceNumber: number;
  rows: number;
  columns: number;
  /** VOI LUT window width from the DICOM header, if present. */
  windowWidth?: number;
  /** VOI LUT window center from the DICOM header, if present. */
  windowCenter?: number;
  imagePositionPatient?: [number, number, number];
}

export interface DicomSeries {
  seriesInstanceUID: string;
  seriesDescription?: string; // e.g. "T2 TSE ax", "DWI", "ADC"
  modality: string; // "MR"
  /** Ordered Cornerstone imageIds (one per slice). */
  imageIds: string[];
  instances: DicomInstanceMetadata[];
  patient: PatientInfo;
  study: StudyInfo;
}

/** The left-drag tool currently active. */
export type ViewerTool = 'windowLevel' | 'scroll' | 'zoom' | 'pan';

/** Window/level pair (VOI). */
export interface Voi {
  windowWidth: number;
  windowCenter: number;
}
