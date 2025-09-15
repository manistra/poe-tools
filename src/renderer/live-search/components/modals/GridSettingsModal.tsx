import React, { useState, useEffect } from "react";
import ModalBase from "src/renderer/components/Modal";
import Input from "src/renderer/components/Input";
import Button from "src/renderer/components/Button";
import { useGridConfig } from "src/shared/store/hooks";
import { useGridOverlay } from "src/renderer/hooks/useGridOverlay";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

interface GridSettingsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
}

const GridSettingsModal: React.FC<GridSettingsModalProps> = ({
  isOpen,
  setIsOpen,
  setIsSettingsOpen,
}) => {
  const [gridConfig, updateGridConfig] = useGridConfig();
  const [screens, setScreens] = useState<{ id: number; label: string }[]>([]);
  const { showGridOverlay, hideGridOverlay, updateGridPosition } =
    useGridOverlay();

  const [isGridActuallyVisible, setIsGridActuallyVisible] =
    useState<boolean>(false);

  // Check actual grid visibility when modal opens
  useEffect(() => {
    if (isOpen) {
      checkGridVisibility();
    }
  }, [isOpen]);

  const checkGridVisibility = async () => {
    // Since we removed isGridVisible, we'll use a simple approach
    // The grid visibility state is managed by the modal's local state
    // This will be updated when Preview/Hide buttons are clicked
    console.log(
      "Grid visibility check - using local state:",
      isGridActuallyVisible
    );
  };

  const updateGridInRealTime = async (newConfig: typeof gridConfig) => {
    if (isGridActuallyVisible) {
      try {
        console.log("Updating grid position in real-time:", newConfig);
        await updateGridPosition(newConfig);
      } catch (error) {
        console.error("Failed to update grid position:", error);
      }
    }
  };

  useEffect(() => {
    // Get available screens
    const getScreens = async () => {
      try {
        const { electronAPI } = await import("../../../api/electronAPI");
        const screenList = await electronAPI.screen.getDisplays();
        setScreens(
          screenList.map((screen: any, index: number) => ({
            id: index,
            label: `Screen ${index + 1}${
              screen.label ? ` - ${screen.label}` : ""
            }`,
          }))
        );
      } catch (error) {
        console.error("Failed to get screens:", error);
        setScreens([{ id: 0, label: "Screen 1" }]);
      }
    };

    if (isOpen) {
      getScreens();
    }
  }, [isOpen]);

  const handlePreview = async () => {
    try {
      await showGridOverlay(0, 0); // Default highlight coordinates
      setIsGridActuallyVisible(true);
    } catch (error) {
      console.error("Failed to show grid overlay:", error);
    }
  };

  const handleHide = async () => {
    try {
      await hideGridOverlay();
      setIsGridActuallyVisible(false);
    } catch (error) {
      console.error("Failed to hide grid overlay:", error);
    }
  };

  const handleInputChange = (
    field: keyof typeof gridConfig,
    value: string | number
  ) => {
    const newConfig = {
      ...gridConfig,
      [field]: value,
    };
    updateGridConfig(newConfig);

    // Update grid in real-time if it's visible
    updateGridInRealTime(newConfig);
  };

  return (
    <ModalBase
      onClose={() => {
        setIsOpen(false);
        setIsSettingsOpen(true);
      }}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="card max-w-2xl w-full"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="space-y-4 border-b border-gray-700 pb-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              Grid Overlay Settings
            </h3>
            <p className="text-sm text-gray-400">
              Configure the 12x12 grid overlay for stash positioning
            </p>
          </div>

          {/* Grid Visibility Toggle */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">
                  Grid Overlay
                </h3>
                <p className="text-sm text-gray-400">
                  Show a 12x12 grid overlay on your screen for stash positioning
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="small"
                  variant="success"
                  onClick={handlePreview}
                  className="flex items-center space-x-2"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>Preview</span>
                </Button>
                <Button
                  size="small"
                  variant="danger"
                  onClick={handleHide}
                  className="flex items-center space-x-2"
                >
                  <EyeSlashIcon className="h-4 w-4" />
                  <span>Hide</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Grid Position and Size */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              Position & Size
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="X Position (pixels from left)"
                type="number"
                value={gridConfig.x}
                onChange={(value) => handleInputChange("x", value)}
                placeholder="100"
              />

              <Input
                label="Y Position (pixels from top)"
                type="number"
                value={gridConfig.y}
                onChange={(value) => handleInputChange("y", value)}
                placeholder="100"
              />

              <Input
                label="Width (pixels)"
                type="number"
                value={gridConfig.width}
                onChange={(value) => handleInputChange("width", value)}
                placeholder="400"
              />

              <Input
                label="Height (pixels)"
                type="number"
                value={gridConfig.height}
                onChange={(value) => handleInputChange("height", value)}
                placeholder="400"
              />
            </div>
          </div>

          {/* Screen Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              Display Settings
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Display Screen
              </label>
              <select
                value={gridConfig.screenIndex}
                onChange={(e) =>
                  handleInputChange("screenIndex", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 backdrop-blur-xl bg-gray-900 outline-none border border-gray-800 rounded-sm placeholder-gray-500 focus:border-gray-700"
              >
                {screens.map((screen) => (
                  <option key={screen.id} value={screen.id}>
                    {screen.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-950/40 border border-blue-800 rounded-sm p-4">
            <h4 className="text-sm font-medium text-blue-200 mb-2">
              How to use:
            </h4>
            <ul className="text-sm text-blue-300 space-y-1">
              <li>• Set the position and size to match your stash area</li>
              <li>• Use "Preview" to see the grid overlay on your screen</li>
              <li>
                • The grid will highlight the correct cell when you teleport to
                an item
              </li>
              <li>
                • Grid coordinates correspond to stash.x and stash.y from
                teleported items
              </li>
            </ul>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button
            size="small"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </div>
      </div>
    </ModalBase>
  );
};

export default GridSettingsModal;
