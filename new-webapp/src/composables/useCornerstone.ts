import { ref } from 'vue';
import { init as coreInit } from '@cornerstonejs/core';
import { init as toolsInit } from '@cornerstonejs/tools';
import * as cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';

/**
 * One-time initialization of the Cornerstone3D core, the tools library, and the
 * DICOM image loader (which registers the `wadouri:` / `dicomfile:` schemes and
 * spins up decoding web workers).
 *
 * NOTE: Cornerstone's exact init signature varies across major versions. This
 * targets the 1.x line pinned in package.json. Validate against the installed
 * version after `npm install` (see app README — the sandbox cannot install deps).
 */

let initialized = false;
const isInitialized = ref(false);

export function useCornerstone() {
  async function init(): Promise<void> {
    if (initialized) {
      isInitialized.value = true;
      return;
    }

    // Wire the DICOM image loader to the core + configure decoding web workers.
    cornerstoneDICOMImageLoader.external.cornerstone = await import('@cornerstonejs/core');
    cornerstoneDICOMImageLoader.external.dicomParser = await import('dicom-parser');

    cornerstoneDICOMImageLoader.configure({
      useWebWorkers: true,
      decodeConfig: {
        convertFloatPixelDataToInt: false,
      },
    });

    // Initialize core (GPU rendering) and tools.
    await coreInit();
    await toolsInit();

    initialized = true;
    isInitialized.value = true;
  }

  function teardown(): void {
    // Cornerstone cleans up rendering engines individually (see useViewport).
    // Global teardown is intentionally a no-op in v1.
    isInitialized.value = false;
  }

  return { init, isInitialized, teardown };
}
