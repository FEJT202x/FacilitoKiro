<script setup lang="ts">
import type { ViewerTool } from '@/types/dicom';

const props = defineProps<{
  activeTool: ViewerTool;
  sliceIndex: number;
  numSlices: number;
  cinePlaying: boolean;
}>();

const emit = defineEmits<{
  (e: 'tool-change', tool: ViewerTool): void;
  (e: 'slice-change', index: number): void;
  (e: 'reset-view'): void;
  (e: 'toggle-cine'): void;
}>();

const tools: { id: ViewerTool; label: string; key: string }[] = [
  { id: 'windowLevel', label: 'W/L', key: 'W' },
  { id: 'scroll', label: 'Scroll', key: 'S' },
  { id: 'zoom', label: 'Zoom', key: 'Z' },
  { id: 'pan', label: 'Pan', key: 'P' },
];

function onSlider(event: Event): void {
  const value = Number((event.target as HTMLInputElement).value);
  emit('slice-change', value);
}
</script>

<template>
  <div
    class="flex h-10 shrink-0 items-center gap-3 border-t border-viewer-border bg-viewer-chrome px-3 text-sm"
  >
    <!-- Tools: active state shown by text + highlight, not color alone -->
    <div class="flex items-center gap-1">
      <button
        v-for="tool in tools"
        :key="tool.id"
        type="button"
        class="rounded px-2 py-1"
        :class="
          props.activeTool === tool.id
            ? 'bg-viewer-accent/20 text-viewer-fg ring-1 ring-viewer-accent'
            : 'text-viewer-fg-dim hover:text-viewer-fg'
        "
        :aria-pressed="props.activeTool === tool.id"
        :title="`${tool.label} (${tool.key})`"
        @click="emit('tool-change', tool.id)"
      >
        {{ tool.label }}
      </button>
      <button
        type="button"
        class="rounded px-2 py-1 text-viewer-fg-dim hover:text-viewer-fg"
        title="Reset view (R)"
        @click="emit('reset-view')"
      >
        Reset
      </button>
    </div>

    <!-- Slice slider -->
    <div class="flex flex-1 items-center gap-2">
      <input
        type="range"
        class="flex-1 accent-viewer-accent"
        min="0"
        :max="Math.max(0, numSlices - 1)"
        :value="sliceIndex"
        :disabled="numSlices === 0"
        aria-label="Slice"
        @input="onSlider"
      />
      <span class="w-16 text-right tabular-nums text-viewer-fg-dim">
        {{ numSlices > 0 ? sliceIndex + 1 : 0 }} / {{ numSlices }}
      </span>
    </div>

    <!-- Cine -->
    <button
      type="button"
      class="rounded px-2 py-1"
      :class="cinePlaying ? 'text-viewer-fg ring-1 ring-viewer-accent' : 'text-viewer-fg-dim hover:text-viewer-fg'"
      :disabled="numSlices === 0"
      title="Cine play/pause (Space)"
      @click="emit('toggle-cine')"
    >
      {{ cinePlaying ? '⏸ Cine' : '▶ Cine' }}
    </button>
  </div>
</template>
