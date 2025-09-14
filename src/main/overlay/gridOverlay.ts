import { BrowserWindow, screen } from "electron";

let overlayWindow: BrowserWindow | null = null;
const overlayWindows: Set<BrowserWindow> = new Set();

export const createOverlayWindow = (config: {
  width: string;
  height: string;
  x: string;
  y: string;
  screenIndex: number;
  highlightX: number;
  highlightY: number;
}): void => {
  // Always hide and delete all existing windows first
  console.log("Creating new overlay window - cleaning up all existing windows first");
  hideOverlayWindow();

  const displays = screen.getAllDisplays();
  const targetDisplay = displays[config.screenIndex] || displays[0];

  console.log("Creating new overlay window with config:", config);
  console.log("Available displays:", displays.map((d, i) => ({ index: i, bounds: d.bounds, label: d.label })));
  console.log("Target display:", targetDisplay?.bounds);

  const windowX = parseInt(config.x) + (targetDisplay?.bounds.x || 0);
  const windowY = parseInt(config.y) + (targetDisplay?.bounds.y || 0);
  const windowWidth = parseInt(config.width);
  const windowHeight = parseInt(config.height);

  console.log("Window position:", { x: windowX, y: windowY, width: windowWidth, height: windowHeight });

  // Create grid overlay HTML content
  const gridHTML = `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.25); overflow: hidden; 
      font-family: Arial, sans-serif; 
    }
    .grid-container { 
      width: 100%; height: 100%; display: grid; 
      grid-template-columns: repeat(12, 1fr); grid-template-rows: repeat(12, 1fr); 
      gap: 0; background: transparent; padding: 0; 
    }
      .grid-cell { 
        background: transparent; border: 1px solid rgba(162, 145, 98, 0.3); 
        transition: all 0.2s ease; position: relative; min-height: 20px; min-width: 20px; 
      }
      .grid-cell.highlighted { 
        background: rgba(255, 165, 0, 0.2); border: 2px solid rgba(255, 165, 0, 1); 
        animation: pulse 1s infinite; z-index: 10; 
      }
    @keyframes pulse { 0%, 100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
  </style>
</head>
<body>
  <div class="grid-container" id="gridContainer"></div>
  <script>
    console.log("Grid overlay loaded");
    const gridContainer = document.getElementById("gridContainer");
    const cells = [];
    
    // Create 12x12 grid (144 cells)
    for (let i = 0; i < 144; i++) {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      cell.dataset.index = i.toString();
      gridContainer.appendChild(cell);
      cells.push(cell);
    }
    console.log("Grid cells generated:", cells.length);
    
    // Highlight the specified cell on creation
    const highlightX = ${config.highlightX};
    const highlightY = ${config.highlightY};
    console.log("Highlighting cell on creation:", { x: highlightX, y: highlightY });
    
    if (highlightX >= 0 && highlightX < 12 && highlightY >= 0 && highlightY < 12) {
      const cellIndex = highlightY * 12 + highlightX;
      if (cellIndex >= 0 && cellIndex < 144) {
        cells[cellIndex].classList.add('highlighted');
        console.log("Successfully highlighted cell at index:", cellIndex, "for coordinates:", { x: highlightX, y: highlightY });
      } else {
        console.log("Invalid cell index calculated:", cellIndex);
      }
    } else {
      console.log("Invalid highlight coordinates:", { x: highlightX, y: highlightY });
    }
    
  </script>
</body>
</html>`;

  try {
    overlayWindow = new BrowserWindow({
      width: windowWidth,
      height: windowHeight,
      x: windowX,
      y: windowY,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      resizable: false,
      hasShadow: false,
      skipTaskbar: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false,
      },
    });

    // Load the grid overlay using data URL to avoid file path issues
    overlayWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(gridHTML)}`);

    // Set a title for easier identification
    overlayWindow.setTitle("Grid Overlay");

    // Make the overlay ignore mouse events (click-through)
    overlayWindow.setIgnoreMouseEvents(true);

    // Handle overlay window closed
    overlayWindow.on("closed", () => {
      console.log("Overlay window closed event fired");
      if (overlayWindow) {
        overlayWindows.delete(overlayWindow);
      }
      overlayWindow = null;
    });

    // Show the window when ready
    overlayWindow.once("ready-to-show", () => {
      console.log("Overlay window ready to show");
      overlayWindow?.show();
      console.log("Overlay window shown, visible:", overlayWindow?.isVisible());
    });

    // Add error handling for load failures
    overlayWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
      console.error("Grid overlay failed to load:", errorCode, errorDescription, validatedURL);
    });

    // Add success handler for load
    overlayWindow.webContents.on("did-finish-load", () => {
      console.log("Grid overlay finished loading");
    });

    // Add to overlay windows set
    overlayWindows.add(overlayWindow);
    console.log("Overlay window created successfully and added to set");
  } catch (error) {
    console.error("Failed to create overlay window:", error);
  }
};

export const hideOverlayWindow = (): void => {
  console.log("hideOverlayWindow called, overlayWindow exists:", !!overlayWindow);
  console.log("Total overlay windows in set:", overlayWindows.size);
  
  // Close all overlay windows
  overlayWindows.forEach((window, index) => {
    console.log(`Closing overlay window ${index}:`, {
      isVisible: window.isVisible(),
      isDestroyed: window.isDestroyed()
    });
    
    if (!window.isDestroyed()) {
      console.log(`Closing overlay window ${index}...`);
      window.close();
    }
  });
  
  // Clear the set
  overlayWindows.clear();
  
  // Reset the main reference
  overlayWindow = null;
  console.log("All overlay windows closed and references cleared");
};

// Export function to get overlay window reference
export const getOverlayWindow = (): BrowserWindow | null => {
  return overlayWindow;
};

// Export function to update existing overlay position and size
export const updateOverlayPosition = (config: {
  width: string;
  height: string;
  x: string;
  y: string;
  screenIndex: number;
}): void => {
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    console.log("Updating overlay position and size:", config);
    
    const displays = screen.getAllDisplays();
    const targetDisplay = displays[config.screenIndex] || displays[0];
    
    const windowX = parseInt(config.x) + (targetDisplay?.bounds.x || 0);
    const windowY = parseInt(config.y) + (targetDisplay?.bounds.y || 0);
    const windowWidth = parseInt(config.width);
    const windowHeight = parseInt(config.height);
    
    console.log("New window position:", { x: windowX, y: windowY, width: windowWidth, height: windowHeight });
    
    // Update window position and size
    overlayWindow.setBounds({
      x: windowX,
      y: windowY,
      width: windowWidth,
      height: windowHeight
    });
    
    console.log("Overlay position and size updated");
  } else {
    console.log("No overlay window available for position update");
  }
};
