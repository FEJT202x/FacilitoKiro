<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';
import { useViewport } from '@/composables/useViewport';
import type { ViewerTool, Voi } from '@/types/dicom';

const props = defineProps<{
  imageIds: string[];
  sliceIndex: number;
  activeTool: ViewerTool;
  initialVoi?: Voi;
}>();

const emit = defineEmits<{ (e: 'ready', numSlices: number): void }>();

const viewportEl = ref<HTMLDivElement | null>(null);
const viewport = useViewport(viewportEl);

// Load / reload the stack whenever the image set changes.
watch(
  () => props.imageIds,
  async (ids) => {
    if (ids.length === 0) return;
    await viewport.loadStack(ids, props.initialVoi);
    viewport.setActiveTool(props.activeTool);
    emit('ready', ids.length);
  },
  { immediate: true },
);

watch(
  () => props.sliceIndex,
  (index) => viewport.setSlice(index),
);

watch(
  () => props.activeTool,
  (tool) => viewport.setActiveTool(tool),
);

// Expose imperative helpers to the parent (window/level, reset).
defineExpose({
  setWindowLevel: (ww: number, wc: number) => viewport.setWindowLevel(ww, wc),
  resetCamera: () => viewport.resetCamera(),
});

onBeforeUnmount(() => viewport.destroy());
</script>

<template>
  <div
    ref="viewportEl"
    class="cs-viewport h-full w-full bg-black"
    tabindex="0"
    aria-label="MRI viewport"
    oncontextmenu="return false"
  />
</template>
