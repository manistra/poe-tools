import { useCallback, useRef } from "react";
import { useGridConfig } from "src/shared/store/hooks";
import { electronAPI } from "../api/electronAPI";

export const useGridOverlay = () => {
  const [gridConfig, updateGridConfig] = useGridConfig();
  const gridConfigRef = useRef(gridConfig);

  // Keep ref updated with latest config
  gridConfigRef.current = gridConfig;

  const showGridOverlay = useCallback(async (highlightX: number = 0, highlightY: number = 0) => {
    try {

      await hideGridOverlay()
      console.log("useGridOverlay: Showing grid overlay with config:", gridConfigRef.current, "highlight:", { highlightX, highlightY });

      // Force close any existing grid first

      await electronAPI.screen.hideGridOverlay();

      // Show new grid
      await electronAPI.screen.showGridOverlay({
        width: gridConfigRef.current.width,
        height: gridConfigRef.current.height,
        x: gridConfigRef.current.x,
        y: gridConfigRef.current.y,
        screenIndex: gridConfigRef.current.screenIndex,
        highlightX,
        highlightY,
      });



      console.log("useGridOverlay: Grid overlay shown successfully");
    } catch (error) {
      console.error("useGridOverlay: Failed to show grid overlay:", error);
      throw error;
    }
  }, []); // No dependencies - uses ref

  const hideGridOverlay = useCallback(async () => {
    try {
      console.log("useGridOverlay: Hiding grid overlay");

      await electronAPI.screen.hideGridOverlay();


      console.log("useGridOverlay: Grid overlay hidden successfully");
    } catch (error) {
      console.error("useGridOverlay: Failed to hide grid overlay:", error);
      throw error;
    }
  }, []);


  const updateGridPosition = useCallback(async (config: {
    width: string;
    height: string;
    x: string;
    y: string;
    screenIndex: number;
  }) => {
    try {
      console.log("useGridOverlay: Updating grid position:", config);
      const { electronAPI } = await import("../api/electronAPI");
      await electronAPI.screen.updateGridPosition(config);
      console.log("useGridOverlay: Grid position updated successfully");
    } catch (error) {
      console.error("useGridOverlay: Failed to update grid position:", error);
      throw error;
    }
  }, []);

  return {
    showGridOverlay,
    hideGridOverlay,
    updateGridPosition,
    gridConfig,
  };
};
