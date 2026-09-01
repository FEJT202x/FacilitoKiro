<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ disabled?: boolean }>();
const emit = defineEmits<{ (e: 'files-selected', files: File[]): void }>();

const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

function onDrop(event: DragEvent): void {
  isDragging.value = false;
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    emit('files-selected', Array.from(files));
  }
}

function onPick(event: Event): void {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    emit('files-selected', Array.from(target.files));
  }
}
</script>

<template>
  <div class="flex h-full w-full items-center justify-center">
    <button
      type="button"
      :disabled="disabled"
      class="flex w-96 flex-col items-center gap-2 rounded border-2 border-dashed px-8 py-12 text-center transition-colors"
      :class="isDragging ? 'border-viewer-accent bg-viewer-chrome' : 'border-viewer-border'"
      @click="fileInput?.click()"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <span class="text-2xl text-viewer-fg-dim">⤓</span>
      <span class="text-viewer-fg">Drop DICOM files</span>
      <span class="text-sm text-viewer-fg-dim">or click to browse a folder / .dcm series</span>
      <input
        ref="fileInput"
        type="file"
        multiple
        accept=".dcm,application/dicom"
        class="hidden"
        @change="onPick"
      />
    </button>
  </div>
</template>
