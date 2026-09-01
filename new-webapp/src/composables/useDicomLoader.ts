import { ref } from 'vue';
import * as cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';
import { metaData } from '@cornerstonejs/core';
import type {
  DicomSeries,
  DicomInstanceMetadata,
  PatientInfo,
  StudyInfo,
} from '@/types/dicom';

/**
 * Parse local DICOM File objects into an ordered Cornerstone series.
 *
 * v1 keeps everything client-side (no upload). Files that are not valid DICOM
 * are skipped with a collected error, so a mixed drop still opens the good ones.
 */
export function useDicomLoader() {
  const isLoading = ref(false);
  const progress = ref(0);
  const error = ref<string | null>(null);

  function readString(imageId: string, tag: string): string | undefined {
    const md = metaData.get('instance', imageId) as Record<string, unknown> | undefined;
    const value = md?.[tag];
    return value === undefined || value === null ? undefined : String(value);
  }

  async function loadSeries(files: File[]): Promise<DicomSeries> {
    isLoading.value = true;
    progress.value = 0;
    error.value = null;

    const dicomFiles = files.filter((f) => !f.name.toLowerCase().endsWith('.txt'));
    const skipped: string[] = [];
    const imageIds: string[] = [];
    const instances: DicomInstanceMetadata[] = [];

    try {
      for (let i = 0; i < dicomFiles.length; i++) {
        const file = dicomFiles[i];
        try {
          // Registers the file and returns a `dicomfile:` imageId.
          const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);
          // Force metadata to be parsed so we can read header tags.
          await cornerstoneDICOMImageLoader.wadouri.loadImage(imageId).promise;

          const instanceMeta = extractInstanceMetadata(imageId);
          imageIds.push(imageId);
          instances.push(instanceMeta);
        } catch {
          skipped.push(file.name);
        }
        progress.value = Math.round(((i + 1) / dicomFiles.length) * 100);
      }

      if (imageIds.length === 0) {
        throw new Error('No valid DICOM images were found in the selection.');
      }

      // Sort slices by InstanceNumber (fallback: keep load order).
      const order = imageIds
        .map((id, idx) => ({ id, n: instances[idx].instanceNumber, meta: instances[idx] }))
        .sort((a, b) => a.n - b.n);

      const sortedImageIds = order.map((o) => o.id);
      const sortedInstances = order.map((o) => o.meta);

      if (skipped.length > 0) {
        error.value = `${skipped.length} file(s) were not valid DICOM and were skipped.`;
      }

      return buildSeries(sortedImageIds, sortedInstances);
    } finally {
      isLoading.value = false;
    }
  }

  function extractInstanceMetadata(imageId: string): DicomInstanceMetadata {
    return {
      sopInstanceUID: readString(imageId, 'sopInstanceUID') ?? imageId,
      instanceNumber: Number(readString(imageId, 'instanceNumber') ?? 0),
      rows: Number(readString(imageId, 'rows') ?? 0),
      columns: Number(readString(imageId, 'columns') ?? 0),
      windowWidth: numberOrUndefined(readString(imageId, 'windowWidth')),
      windowCenter: numberOrUndefined(readString(imageId, 'windowCenter')),
    };
  }

  function buildSeries(
    imageIds: string[],
    instances: DicomInstanceMetadata[],
  ): DicomSeries {
    const first = imageIds[0];
    const patient: PatientInfo = {
      id: readString(first, 'patientId') ?? 'UNKNOWN',
      name: readString(first, 'patientName'),
      sex: (readString(first, 'patientSex') as PatientInfo['sex']) ?? undefined,
      age: readString(first, 'patientAge'),
    };
    const study: StudyInfo = {
      studyInstanceUID: readString(first, 'studyInstanceUID') ?? 'UNKNOWN',
      studyDescription: readString(first, 'studyDescription'),
      studyDate: readString(first, 'studyDate'),
    };

    return {
      seriesInstanceUID: readString(first, 'seriesInstanceUID') ?? `series-${Date.now()}`,
      seriesDescription: readString(first, 'seriesDescription'),
      modality: readString(first, 'modality') ?? 'MR',
      imageIds,
      instances,
      patient,
      study,
    };
  }

  return { isLoading, progress, error, loadSeries };
}

function numberOrUndefined(v: string | undefined): number | undefined {
  if (v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}
