import React, { useState, useEffect } from "react";
import ModalBase from "src/renderer/components/Modal";
import { useGridConfig } from "src/shared/store/hooks";
import { GridConfig } from "src/shared/store/storeUtils";
import {
  Cog6ToothIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";

interface GridSettingsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const GridSettingsModal: React.FC<GridSettingsModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [gridConfig, updateGridConfig] = useGridConfig();
  const [tempConfig, setTempConfig] = useState<GridConfig>(gridConfig);
  const [screens, setScreens] = useState<{ id: number; label: string }[]>([]);

  useEffect(() => {
    setTempConfig(gridConfig);
  }, [gridConfig]);

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

  const handleSave = () => {
    updateGridConfig(tempConfig);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempConfig(gridConfig);
    setIsOpen(false);
  };

  const handlePreview = async () => {
    try {
      const { electronAPI } = await import("../../../api/electronAPI");
      await electronAPI.screen.showGridOverlay({
        width: tempConfig.width,
        height: tempConfig.height,
        x: tempConfig.x,
        y: tempConfig.y,
        screenIndex: tempConfig.screenIndex,
      });
      updateGridConfig({ ...tempConfig, isVisible: true });
    } catch (error) {
      console.error("Failed to show grid overlay:", error);
    }
  };

  const handleHide = async () => {
    try {
      const { electronAPI } = await import("../../../api/electronAPI");
      await electronAPI.screen.hideGridOverlay();
      updateGridConfig({ ...tempConfig, isVisible: false });
    } catch (error) {
      console.error("Failed to hide grid overlay:", error);
    }
  };

  const handleInputChange = (
    field: keyof GridConfig,
    value: string | number | boolean
  ) => {
    setTempConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <ModalBase isOpen={isOpen} onClose={handleCancel}>
      <div className="space-y-6">
        {/* Modal Title */}
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Grid Overlay Settings
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure the 12x12 grid overlay for stash positioning
          </p>
        </div>

        {/* Grid Visibility Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Grid Overlay</h3>
            <p className="text-sm text-gray-500">
              Show a 12x12 grid overlay on your screen for stash positioning
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={tempConfig.isVisible ? handleHide : handlePreview}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                tempConfig.isVisible
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {tempConfig.isVisible ? (
                <>
                  <EyeSlashIcon className="h-4 w-4" />
                  <span>Hide</span>
                </>
              ) : (
                <>
                  <EyeIcon className="h-4 w-4" />
                  <span>Preview</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Grid Position and Size */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              X Position (pixels from left)
            </label>
            <input
              type="number"
              value={tempConfig.x}
              onChange={(e) => handleInputChange("x", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Y Position (pixels from top)
            </label>
            <input
              type="number"
              value={tempConfig.y}
              onChange={(e) => handleInputChange("y", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Width (pixels)
            </label>
            <input
              type="number"
              value={tempConfig.width}
              onChange={(e) => handleInputChange("width", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height (pixels)
            </label>
            <input
              type="number"
              value={tempConfig.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="400"
            />
          </div>
        </div>

        {/* Screen Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Screen
          </label>
          <select
            value={tempConfig.screenIndex}
            onChange={(e) =>
              handleInputChange("screenIndex", parseInt(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {screens.map((screen) => (
              <option key={screen.id} value={screen.id}>
                {screen.label}
              </option>
            ))}
          </select>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            How to use:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Set the position and size to match your stash area</li>
            <li>• Use "Preview" to see the grid overlay on your screen</li>
            <li>
              • The grid will highlight the correct cell when you teleport to an
              item
            </li>
            <li>
              • Grid coordinates correspond to stash.x and stash.y from
              teleported items
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Settings
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default GridSettingsModal;
