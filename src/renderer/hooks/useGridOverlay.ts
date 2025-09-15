import { useCallback, useRef } from "react";
import { useGridConfig, useGridEnabled } from "src/shared/store/hooks";
import { electronAPI } from "../api/electronAPI";

export const useGridOverlay = () => {
  const [gridConfig] = useGridConfig();
  const [gridEnabled] = useGridEnabled();
  const gridConfigRef = useRef(gridConfig);
  const gridEnabledRef = useRef(gridEnabled);

  // Keep refs updated with latest values
  gridConfigRef.current = gridConfig;
  gridEnabledRef.current = gridEnabled;

  const showGridOverlay = useCallback(
    async (highlightX = 0, highlightY = 0) => {
      try {
        // Check if grid is enabled before showing
        if (!gridEnabledRef.current) {
          console.log(
            "useGridOverlay: Grid overlay is disabled, skipping show"
          );
          return;
        }

        console.log("useGridOverlay: Showing grid overlay with highlight:", {
          highlightX,
          highlightY,
        });

        // Show the persistent grid overlay
        await electronAPI.screen.showGridOverlay(highlightX, highlightY);

        console.log("useGridOverlay: Grid overlay shown successfully");
      } catch (error) {
        console.error("useGridOverlay: Failed to show grid overlay:", error);
        throw error;
      }
    },
    []
  ); // No dependencies - uses ref

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

  const updateGridPosition = useCallback(
    async (config: {
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
    },
    []
  );

  return {
    showGridOverlay,
    hideGridOverlay,
    updateGridPosition,
    gridConfig,
  };
};
