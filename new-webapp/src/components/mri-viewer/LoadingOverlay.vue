<script setup lang="ts">
defineProps<{
  loading: boolean;
  error?: string | null;
  progress?: number;
}>();

const emit = defineEmits<{ (e: 'dismiss'): void }>();
</script>

<template>
  <!-- Loading progress overlay -->
  <div
    v-if="loading"
    class="pointer-events-none absolute inset-0 flex items-center justify-center bg-viewer-bg/70"
  >
    <div class="w-72 rounded border border-viewer-border bg-viewer-panel p-4">
      <p class="mb-2 text-sm text-viewer-fg">Parsing DICOM…</p>
      <div class="h-1.5 w-full overflow-hidden rounded bg-viewer-border">
        <div
          class="h-full bg-viewer-accent transition-[width] duration-150"
          :style="{ width: `${progress ?? 0}%` }"
        />
      </div>
      <p class="mt-1 text-right text-xs text-viewer-fg-dim">{{ progress ?? 0 }}%</p>
    </div>
  </div>

  <!-- Non-blocking error banner (valid images still open) -->
  <div
    v-else-if="error"
    class="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded border border-viewer-border bg-viewer-panel px-4 py-2 text-sm text-viewer-fg shadow"
    role="alert"
  >
    <span class="mr-3">⚠ {{ error }}</span>
    <button
      class="text-viewer-accent hover:underline"
      type="button"
      @click="emit('dismiss')"
    >
      Dismiss
    </button>
  </div>
</template>
