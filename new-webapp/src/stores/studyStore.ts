import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { DicomSeries } from '@/types/dicom';

/**
 * Holds the loaded study: one or more series (e.g. T2 / DWI / ADC) and which
 * series is currently active in the viewport.
 */
export const useStudyStore = defineStore('study', () => {
  const series = ref<DicomSeries[]>([]);
  const activeSeriesId = ref<string | null>(null);

  const activeSeries = computed<DicomSeries | null>(
    () => series.value.find((s) => s.seriesInstanceUID === activeSeriesId.value) ?? null,
  );

  const hasStudy = computed(() => series.value.length > 0);

  function addSeries(newSeries: DicomSeries): void {
    const exists = series.value.some(
      (s) => s.seriesInstanceUID === newSeries.seriesInstanceUID,
    );
    if (!exists) {
      series.value.push(newSeries);
    }
    if (activeSeriesId.value === null) {
      activeSeriesId.value = newSeries.seriesInstanceUID;
    }
  }

  function setActiveSeries(seriesInstanceUID: string): void {
    if (series.value.some((s) => s.seriesInstanceUID === seriesInstanceUID)) {
      activeSeriesId.value = seriesInstanceUID;
    }
  }

  function reset(): void {
    series.value = [];
    activeSeriesId.value = null;
  }

  return { series, activeSeriesId, activeSeries, hasStudy, addSeries, setActiveSeries, reset };
});
