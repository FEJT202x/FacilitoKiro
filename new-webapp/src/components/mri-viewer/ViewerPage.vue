<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import DicomDropzone from './DicomDropzone.vue';
import DicomViewport from './DicomViewport.vue';
import ViewerToolbar from './ViewerToolbar.vue';
import MetadataPanel from './MetadataPanel.vue';
import LoadingOverlay from './LoadingOverlay.vue';
import { useCornerstone } from '@/composables/useCornerstone';
import { useDicomLoader } from '@/composables/useDicomLoader';
import { useStudyStore } from '@/stores/studyStore';
import { useViewportStore } from '@/stores/viewportStore';
import type { ViewerTool, Voi } from '@/types/dicom';

const cornerstone = useCornerstone();
const loader = useDicomLoader();
const study = useStudyStore();
const viewport = useViewportStore();

const { activeSeries, series, activeSeriesId, hasStudy } = storeToRefs(study);
const { sliceIndex, numSlices, activeTool } = storeToRefs(viewport);
const { isLoading, progress, error } = loader;

const viewportRef = ref<InstanceType<typeof DicomViewport> | null>(null);
const showMetadata = ref(false);
const cinePlaying = ref(false);
let cineTimer: number | null = null;

const initialVoi = computed<Voi | undefined>(() => {
  const first = activeSeries.value?.instances[0];
  if (first?.windowWidth && first?.windowCenter !== undefined) {
    return { windowWidth: first.windowWidth, windowCenter: first.windowCenter };
  }
  return undefined;
});

onMounted(async () => {
  await cornerstone.init();
  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
  stopCine();
});

async function onFilesSelected(files: File[]): Promise<void> {
  const loaded = await loader.loadSeries(files);
  study.addSeries(loaded);
}

function onViewportReady(count: number): void {
  viewport.setNumSlices(count);
  viewport.setSlice(0);
  if (initialVoi.value) {
    viewport.setWindowLevel(initialVoi.value.windowWidth, initialVoi.value.windowCenter);
  }
}

function selectTool(tool: ViewerTool): void {
  viewport.setActiveTool(tool);
}

function resetView(): void {
  viewportRef.value?.resetCamera();
}

function selectSeries(id: string): void {
  study.setActiveSeries(id);
}

// ---- Cine ------------------------------------------------------------------
function toggleCine(): void {
  cinePlaying.value ? stopCine() : startCine();
}
function startCine(): void {
  if (numSlices.value === 0) return;
  cinePlaying.value = true;
  cineTimer = window.setInterval(() => {
    const next = (sliceIndex.value + 1) % numSlices.value;
    viewport.setSlice(next);
  }, 1000 / 15); // ~15 fps
}
function stopCine(): void {
  cinePlaying.value = false;
  if (cineTimer !== null) {
    clearInterval(cineTimer);
    cineTimer = null;
  }
}

// ---- Keyboard shortcuts (design-research/05-interactions.md) ----------------
function onKeydown(e: KeyboardEvent): void {
  // Ignore when typing in an input.
  if (e.target instanceof HTMLInputElement) return;

  switch (e.key) {
    // Slice navigation (primary path for the 2-button trackpad)
    case 'ArrowDown':
    case 'ArrowRight':
      viewport.stepSlice(1);
      e.preventDefault();
      break;
    case 'ArrowUp':
    case 'ArrowLeft':
      viewport.stepSlice(-1);
      e.preventDefault();
      break;
    case 'PageDown':
      viewport.stepSlice(10);
      e.preventDefault();
      break;
    case 'PageUp':
      viewport.stepSlice(-10);
      e.preventDefault();
      break;
    case 'Home':
      viewport.setSlice(0);
      break;
    case 'End':
      viewport.setSlice(numSlices.value - 1);
      break;
    case ' ':
      toggleCine();
      e.preventDefault();
      break;
    // Tools
    case 'w':
    case 'W':
      selectTool('windowLevel');
      break;
    case 's':
    case 'S':
      selectTool('scroll');
      break;
    case 'z':
    case 'Z':
      selectTool('zoom');
      break;
    case 'p':
    case 'P':
      selectTool('pan');
      break;
    case 'r':
    case 'R':
      resetView();
      break;
    // Window/level nudges
    case '[':
      viewport.setWindowLevel(viewport.windowWidth - 20, viewport.windowCenter);
      applyWindowLevel();
      break;
    case ']':
      viewport.setWindowLevel(viewport.windowWidth + 20, viewport.windowCenter);
      applyWindowLevel();
      break;
    case '-':
      viewport.setWindowLevel(viewport.windowWidth, viewport.windowCenter - 10);
      applyWindowLevel();
      break;
    case '=':
      viewport.setWindowLevel(viewport.windowWidth, viewport.windowCenter + 10);
      applyWindowLevel();
      break;
    case '0':
      if (initialVoi.value) {
        viewport.setWindowLevel(initialVoi.value.windowWidth, initialVoi.value.windowCenter);
        applyWindowLevel();
      }
      break;
    // Panels
    case 'i':
    case 'I':
      showMetadata.value = !showMetadata.value;
      break;
    case 'Escape':
      showMetadata.value = false;
      break;
    default:
      // Series switch 1..9
      if (/^[1-9]$/.test(e.key)) {
        const idx = Number(e.key) - 1;
        if (series.value[idx]) selectSeries(series.value[idx].seriesInstanceUID);
      }
  }
}

function applyWindowLevel(): void {
  viewportRef.value?.setWindowLevel(viewport.windowWidth, viewport.windowCenter);
}
</script>

<template>
  <div class="flex h-full w-full flex-col bg-viewer-bg text-viewer-fg">
    <!-- A. Header (thin) -->
    <header
      class="flex h-8 shrink-0 items-center justify-between border-b border-viewer-border bg-viewer-chrome px-3 text-xs"
    >
      <span class="truncate text-viewer-fg-dim">
        <template v-if="activeSeries">
          {{ activeSeries.patient.id }} · {{ activeSeries.study.studyDescription ?? 'Prostate mpMRI' }}
          · {{ activeSeries.study.studyDate ?? '' }}
        </template>
        <template v-else>Prostate MRI Viewer</template>
      </span>

      <div class="flex items-center gap-1">
        <!-- Sequence switcher (T2 / DWI / ADC ...) -->
        <button
          v-for="(s, i) in series"
          :key="s.seriesInstanceUID"
          type="button"
          class="rounded px-2 py-0.5"
          :class="
            activeSeriesId === s.seriesInstanceUID
              ? 'text-viewer-fg ring-1 ring-viewer-accent'
              : 'text-viewer-fg-dim hover:text-viewer-fg'
          "
          :title="`${s.seriesDescription ?? s.modality} (${i + 1})`"
          @click="selectSeries(s.seriesInstanceUID)"
        >
          {{ s.seriesDescription ?? s.modality }}
        </button>
        <button
          type="button"
          class="ml-2 text-viewer-fg-dim hover:text-viewer-fg"
          title="Toggle metadata (I)"
          @click="showMetadata = !showMetadata"
        >
          ≡
        </button>
      </div>
    </header>

    <!-- Middle: viewport (+ optional metadata panel) -->
    <div class="relative flex min-h-0 flex-1">
      <div class="relative min-h-0 flex-1">
        <DicomViewport
          v-if="hasStudy && activeSeries"
          ref="viewportRef"
          :image-ids="activeSeries.imageIds"
          :slice-index="sliceIndex"
          :active-tool="activeTool"
          :initial-voi="initialVoi"
          @ready="onViewportReady"
        />
        <DicomDropzone v-else :disabled="isLoading" @files-selected="onFilesSelected" />

        <LoadingOverlay
          :loading="isLoading"
          :progress="progress"
          :error="error"
          @dismiss="error = null"
        />
      </div>

      <MetadataPanel
        v-if="showMetadata"
        :series="activeSeries"
        @close="showMetadata = false"
      />
    </div>

    <!-- C. Action bar -->
    <ViewerToolbar
      v-if="hasStudy"
      :active-tool="activeTool"
      :slice-index="sliceIndex"
      :num-slices="numSlices"
      :cine-playing="cinePlaying"
      @tool-change="selectTool"
      @slice-change="viewport.setSlice"
      @reset-view="resetView"
      @toggle-cine="toggleCine"
    />
  </div>
</template>
