import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ViewerTool } from '@/types/dicom';

/**
 * Viewport interaction state: current slice, window/level, active left-drag tool.
 * Kept separate from studyStore (which holds the image data).
 */
export const useViewportStore = defineStore('viewport', () => {
  const sliceIndex = ref(0);
  const numSlices = ref(0);
  const windowWidth = ref(400);
  const windowCenter = ref(40);
  const activeTool = ref<ViewerTool>('windowLevel'); // OQ-1: default = Window/Level

  const sliceLabel = computed(() =>
    numSlices.value > 0 ? `${sliceIndex.value + 1} / ${numSlices.value}` : '– / –',
  );

  function setSlice(index: number): void {
    if (numSlices.value === 0) return;
    sliceIndex.value = Math.max(0, Math.min(index, numSlices.value - 1));
  }

  function stepSlice(delta: number): void {
    setSlice(sliceIndex.value + delta);
  }

  function setNumSlices(n: number): void {
    numSlices.value = Math.max(0, n);
    if (sliceIndex.value > numSlices.value - 1) {
      sliceIndex.value = Math.max(0, numSlices.value - 1);
    }
  }

  function setWindowLevel(ww: number, wc: number): void {
    windowWidth.value = Math.max(1, Math.round(ww));
    windowCenter.value = Math.round(wc);
  }

  function setActiveTool(tool: ViewerTool): void {
    activeTool.value = tool;
  }

  function reset(): void {
    sliceIndex.value = 0;
    numSlices.value = 0;
    windowWidth.value = 400;
    windowCenter.value = 40;
    activeTool.value = 'windowLevel';
  }

  return {
    sliceIndex,
    numSlices,
    windowWidth,
    windowCenter,
    activeTool,
    sliceLabel,
    setSlice,
    stepSlice,
    setNumSlices,
    setWindowLevel,
    setActiveTool,
    reset,
  };
});
