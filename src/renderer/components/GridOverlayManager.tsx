import React, { useEffect } from "react";
import { useGridConfig } from "src/shared/store/hooks";

const GridOverlayManager: React.FC = () => {
  const [gridConfig] = useGridConfig();

  useEffect(() => {
    const manageOverlay = async () => {
      try {
        const { electronAPI } = await import("../api/electronAPI");

        if (gridConfig.isVisible) {
          await electronAPI.screen.showGridOverlay({
            width: gridConfig.width,
            height: gridConfig.height,
            x: gridConfig.x,
            y: gridConfig.y,
            screenIndex: gridConfig.screenIndex,
          });
        } else {
          await electronAPI.screen.hideGridOverlay();
        }
      } catch (error) {
        console.error("Failed to manage grid overlay:", error);
      }
    };

    manageOverlay();
  }, [
    gridConfig.isVisible,
    gridConfig.width,
    gridConfig.height,
    gridConfig.x,
    gridConfig.y,
    gridConfig.screenIndex,
  ]);

  return null; // This component doesn't render anything
};

export default GridOverlayManager;
