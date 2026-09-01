<script setup lang="ts">
import type { DicomSeries } from '@/types/dicom';

defineProps<{ series: DicomSeries | null }>();
const emit = defineEmits<{ (e: 'close'): void }>();
</script>

<template>
  <aside
    class="flex h-full w-[280px] shrink-0 flex-col border-l border-viewer-border bg-viewer-panel text-sm"
    aria-label="DICOM metadata"
  >
    <header class="flex items-center justify-between border-b border-viewer-border px-3 py-2">
      <span class="text-viewer-fg">Metadata</span>
      <button
        class="text-viewer-fg-dim hover:text-viewer-fg"
        type="button"
        aria-label="Close metadata panel"
        @click="emit('close')"
      >
        ✕
      </button>
    </header>

    <div v-if="series" class="flex-1 overflow-y-auto px-3 py-2">
      <section class="mb-3">
        <h3 class="mb-1 text-xs uppercase tracking-wide text-viewer-fg-dim">Patient</h3>
        <dl class="space-y-0.5">
          <div class="flex justify-between"><dt class="text-viewer-fg-dim">ID</dt><dd>{{ series.patient.id }}</dd></div>
          <div class="flex justify-between"><dt class="text-viewer-fg-dim">Sex</dt><dd>{{ series.patient.sex ?? '—' }}</dd></div>
          <div class="flex justify-between"><dt class="text-viewer-fg-dim">Age</dt><dd>{{ series.patient.age ?? '—' }}</dd></div>
        </dl>
      </section>

      <section class="mb-3">
        <h3 class="mb-1 text-xs uppercase tracking-wide text-viewer-fg-dim">Study</h3>
        <dl class="space-y-0.5">
          <div class="flex justify-between"><dt class="text-viewer-fg-dim">Date</dt><dd>{{ series.study.studyDate ?? '—' }}</dd></div>
          <div class="flex justify-between gap-2"><dt class="text-viewer-fg-dim">Desc</dt><dd class="text-right">{{ series.study.studyDescription ?? '—' }}</dd></div>
        </dl>
      </section>

      <section>
        <h3 class="mb-1 text-xs uppercase tracking-wide text-viewer-fg-dim">Series</h3>
        <dl class="space-y-0.5">
          <div class="flex justify-between gap-2"><dt class="text-viewer-fg-dim">Desc</dt><dd class="text-right">{{ series.seriesDescription ?? '—' }}</dd></div>
          <div class="flex justify-between"><dt class="text-viewer-fg-dim">Modality</dt><dd>{{ series.modality }}</dd></div>
          <div class="flex justify-between"><dt class="text-viewer-fg-dim">Slices</dt><dd>{{ series.imageIds.length }}</dd></div>
          <div class="flex justify-between">
            <dt class="text-viewer-fg-dim">Matrix</dt>
            <dd>{{ series.instances[0]?.columns ?? '—' }} × {{ series.instances[0]?.rows ?? '—' }}</dd>
          </div>
        </dl>
      </section>
    </div>

    <div v-else class="flex-1 px-3 py-2 text-viewer-fg-dim">No series loaded.</div>
  </aside>
</template>
