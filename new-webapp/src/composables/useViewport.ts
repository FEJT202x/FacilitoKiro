import { type Ref } from 'vue';
import { RenderingEngine, Enums, type Types } from '@cornerstonejs/core';
import {
  ToolGroupManager,
  WindowLevelTool,
  PanTool,
  ZoomTool,
  StackScrollTool,
  Enums as csToolsEnums,
  addTool,
} from '@cornerstonejs/tools';
import type { ViewerTool, Voi } from '@/types/dicom';

/**
 * Binds a Cornerstone3D Stack viewport to a DOM element and exposes the
 * imperative operations the UI needs. Tool bindings implement the approved
 * 2-button-trackpad interaction model (design-research/05-interactions.md):
 *   - Left drag   = active tool (default Window/Level)
 *   - Right drag  = Zoom (fixed)
 *   - Shift+Left  = Pan (no middle button on a 2-button trackpad)
 */

const RENDERING_ENGINE_ID = 'mri-rendering-engine';
const VIEWPORT_ID = 'mri-viewport';
const TOOL_GROUP_ID = 'mri-tool-group';

const { MouseBindings } = csToolsEnums;

let renderingEngine: RenderingEngine | null = null;

export function useViewport(element: Ref<HTMLDivElement | null>) {
  function ensureToolGroup(): ReturnType<typeof ToolGroupManager.getToolGroup> {
    let toolGroup = ToolGroupManager.getToolGroup(TOOL_GROUP_ID);
    if (toolGroup) return toolGroup;

    addTool(WindowLevelTool);
    addTool(PanTool);
    addTool(ZoomTool);
    addTool(StackScrollTool);

    toolGroup = ToolGroupManager.createToolGroup(TOOL_GROUP_ID)!;
    toolGroup.addTool(WindowLevelTool.toolName);
    toolGroup.addTool(PanTool.toolName);
    toolGroup.addTool(ZoomTool.toolName);
    toolGroup.addTool(StackScrollTool.toolName);

    // Fixed bindings (do not change with the active tool):
    // Right drag = Zoom; Shift + Left drag = Pan.
    toolGroup.setToolActive(ZoomTool.toolName, {
      bindings: [{ mouseButton: MouseBindings.Secondary }],
    });
    toolGroup.setToolActive(PanTool.toolName, {
      bindings: [{ mouseButton: MouseBindings.Primary, modifierKey: csToolsEnums.KeyboardBindings.Shift }],
    });

    return toolGroup;
  }

  async function loadStack(imageIds: string[], initialVoi?: Voi): Promise<void> {
    if (!element.value) throw new Error('Viewport element is not mounted.');

    if (!renderingEngine) {
      renderingEngine = new RenderingEngine(RENDERING_ENGINE_ID);
    }

    const viewportInput: Types.PublicViewportInput = {
      viewportId: VIEWPORT_ID,
      element: element.value,
      type: Enums.ViewportType.STACK,
    };
    renderingEngine.enableElement(viewportInput);

    const toolGroup = ensureToolGroup();
    toolGroup!.addViewport(VIEWPORT_ID, RENDERING_ENGINE_ID);

    const viewport = renderingEngine.getViewport(VIEWPORT_ID) as Types.IStackViewport;
    await viewport.setStack(imageIds, 0);

    if (initialVoi) {
      viewport.setProperties({
        voiRange: voiToRange(initialVoi),
      });
    }

    viewport.render();
    setActiveTool('windowLevel'); // OQ-1 default
  }

  function getViewport(): Types.IStackViewport | null {
    if (!renderingEngine) return null;
    return renderingEngine.getViewport(VIEWPORT_ID) as Types.IStackViewport;
  }

  function setSlice(index: number): void {
    const vp = getViewport();
    if (!vp) return;
    vp.setImageIdIndex(index);
    vp.render();
  }

  function setWindowLevel(ww: number, wc: number): void {
    const vp = getViewport();
    if (!vp) return;
    vp.setProperties({ voiRange: voiToRange({ windowWidth: ww, windowCenter: wc }) });
    vp.render();
  }

  /** Map the active tool to the LEFT mouse button (primary). */
  function setActiveTool(tool: ViewerTool): void {
    const toolGroup = ToolGroupManager.getToolGroup(TOOL_GROUP_ID);
    if (!toolGroup) return;

    const toolName = toolNameFor(tool);
    // Reset primary binding to the chosen tool; keep Zoom(right)/Pan(shift+left).
    [WindowLevelTool, ZoomTool, PanTool, StackScrollTool].forEach((t) => {
      if (t.toolName !== toolName) {
        toolGroup.setToolPassive(t.toolName);
      }
    });
    toolGroup.setToolActive(toolName, {
      bindings: [{ mouseButton: MouseBindings.Primary }],
    });
    // Re-assert the fixed secondary/shift bindings.
    toolGroup.setToolActive(ZoomTool.toolName, {
      bindings: [{ mouseButton: MouseBindings.Secondary }],
    });
    toolGroup.setToolActive(PanTool.toolName, {
      bindings: [{ mouseButton: MouseBindings.Primary, modifierKey: csToolsEnums.KeyboardBindings.Shift }],
    });
  }

  function resetCamera(): void {
    const vp = getViewport();
    if (!vp) return;
    vp.resetCamera();
    vp.resetProperties();
    vp.render();
  }

  function destroy(): void {
    if (renderingEngine) {
      renderingEngine.destroy();
      renderingEngine = null;
    }
    const toolGroup = ToolGroupManager.getToolGroup(TOOL_GROUP_ID);
    if (toolGroup) ToolGroupManager.destroyToolGroup(TOOL_GROUP_ID);
  }

  return { loadStack, setSlice, setWindowLevel, setActiveTool, resetCamera, destroy };
}

function toolNameFor(tool: ViewerTool): string {
  switch (tool) {
    case 'windowLevel':
      return WindowLevelTool.toolName;
    case 'zoom':
      return ZoomTool.toolName;
    case 'pan':
      return PanTool.toolName;
    case 'scroll':
      return StackScrollTool.toolName;
  }
}

/** Convert WW/WC to the {lower, upper} range Cornerstone expects. */
function voiToRange(voi: Voi): { lower: number; upper: number } {
  const lower = voi.windowCenter - voi.windowWidth / 2;
  const upper = voi.windowCenter + voi.windowWidth / 2;
  return { lower, upper };
}
