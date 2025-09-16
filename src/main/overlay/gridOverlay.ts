import { BrowserWindow, screen } from "electron";

let overlayWindow: BrowserWindow | null = null;
let isInitialized = false;

// Function to ensure overlay properties are correctly set
const ensureOverlayProperties = (): void => {
  if (!overlayWindow || overlayWindow.isDestroyed()) {
    return;
  }
  overlayWindow.setAlwaysOnTop(true, "screen-saver");
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  overlayWindow.setIgnoreMouseEvents(true);
};

// Grid overlay HTML content (static, no dynamic highlighting)
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
      display: flex; align-items: center; justify-content: center;
    }
    .grid-cell.highlighted { 
      background: rgba(255, 165, 0, 0.2); border: 2px solid rgba(255, 165, 0, 1); 
      animation: pulse 1s infinite; z-index: 10; 
    }
    .coordinate-label {
      color: rgba(162, 145, 98, 0.5);
      font-size: 2vw;
      text-align: center;
      pointer-events: none;
      user-select: none;
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
      
      // Calculate x, y coordinates
      const x = i % 12;
      const y = Math.floor(i / 12);
      
      // Create coordinate label
      const coordinateLabel = document.createElement("div");
      coordinateLabel.className = "coordinate-label";
      coordinateLabel.textContent = \`\${x}\${y}\`;
      
      cell.appendChild(coordinateLabel);
      gridContainer.appendChild(cell);
      cells.push(cell);
    }
    console.log("Grid cells generated:", cells.length);
    
    // Function to highlight a specific cell
    window.highlightCell = function(x, y) {
      // Clear all highlights first
      cells.forEach(cell => cell.classList.remove('highlighted'));
      
      if (x >= 0 && x < 12 && y >= 0 && y < 12) {
        const cellIndex = y * 12 + x;
        if (cellIndex >= 0 && cellIndex < 144) {
          cells[cellIndex].classList.add('highlighted');
          console.log("Highlighted cell at coordinates:", { x, y, cellIndex });
        }
      }
    };
    
    // Function to clear all highlights
    window.clearHighlights = function() {
      cells.forEach(cell => cell.classList.remove('highlighted'));
      console.log("Cleared all highlights");
    };
  </script>
</body>
</html>`;

// Initialize the overlay window on app start
export const initializeOverlayWindow = (config: {
  width: string;
  height: string;
  x: string;
  y: string;
  screenIndex: number;
}): void => {
  if (isInitialized && overlayWindow && !overlayWindow.isDestroyed()) {
    console.log("Overlay window already initialized");
    return;
  }

  console.log("Initializing overlay window with config:", config);

  const displays = screen.getAllDisplays();
  const targetDisplay = displays[config.screenIndex] || displays[0];

  const windowX = parseInt(config.x) + (targetDisplay?.bounds.x || 0);
  const windowY = parseInt(config.y) + (targetDisplay?.bounds.y || 0);
  const windowWidth = parseInt(config.width);
  const windowHeight = parseInt(config.height);

  console.log("Window position:", {
    x: windowX,
    y: windowY,
    width: windowWidth,
    height: windowHeight,
  });

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
      show: false, // Don't show immediately
      focusable: false, // Prevent the overlay from taking focus
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false,
      },
    });

    // Load the grid overlay HTML
    overlayWindow.loadURL(
      `data:text/html;charset=utf-8,${encodeURIComponent(gridHTML)}`
    );

    // Set overlay properties for fullscreen compatibility
    overlayWindow.setAlwaysOnTop(true, "screen-saver");
    overlayWindow.setVisibleOnAllWorkspaces(true, {
      visibleOnFullScreen: true,
    });

    // Set a title for easier identification
    overlayWindow.setTitle("Grid Overlay");

    // Make the overlay ignore mouse events (click-through)
    overlayWindow.setIgnoreMouseEvents(true);

    // Handle overlay window closed
    overlayWindow.on("closed", () => {
      console.log("Overlay window closed event fired");
      overlayWindow = null;
      isInitialized = false;
    });

    // Handle window focus events to maintain overlay properties
    overlayWindow.on("focus", () => {
      console.log("Overlay window focused");
      ensureOverlayProperties();
    });

    overlayWindow.on("blur", () => {
      console.log("Overlay window blurred");
      ensureOverlayProperties();
    });

    // Handle window show/hide events
    overlayWindow.on("show", () => {
      console.log("Overlay window shown");
      ensureOverlayProperties();
    });

    overlayWindow.on("hide", () => {
      console.log("Overlay window hidden");
    });

    // Add error handling for load failures
    overlayWindow.webContents.on(
      "did-fail-load",
      (event, errorCode, errorDescription, validatedURL) => {
        console.error(
          "Grid overlay failed to load:",
          errorCode,
          errorDescription,
          validatedURL
        );
      }
    );

    // Add success handler for load
    overlayWindow.webContents.on("did-finish-load", () => {
      console.log("Grid overlay finished loading");
      isInitialized = true;
    });

    console.log("Overlay window created successfully");
  } catch (error) {
    console.error("Failed to create overlay window:", error);
  }
};

// Show the overlay window
export const showOverlayWindow = (highlightX = 0, highlightY = 0): void => {
  if (!overlayWindow || overlayWindow.isDestroyed()) {
    console.log("Overlay window not initialized or destroyed");
    return;
  }

  console.log("Showing overlay window with highlight:", {
    highlightX,
    highlightY,
    currentState: {
      isInitialized,
      windowExists: !!overlayWindow,
      windowDestroyed: overlayWindow?.isDestroyed(),
    },
  });

  // Ensure overlay properties are set for fullscreen compatibility
  ensureOverlayProperties();

  // Show the window
  overlayWindow.show();

  // Highlight the specified cell
  if (overlayWindow.webContents) {
    overlayWindow.webContents.executeJavaScript(`
      window.highlightCell(${highlightX}, ${highlightY});
    `);
  }

  // Log final state
  console.log("Overlay window show completed:", {
    windowVisible: overlayWindow.isVisible(),
    windowFocused: overlayWindow.isFocused(),
  });
};

// Hide the overlay window
export const hideOverlayWindow = (): void => {
  if (!overlayWindow || overlayWindow.isDestroyed()) {
    console.log("Overlay window not initialized or destroyed");
    return;
  }

  console.log("Hiding overlay window");
  // Hide the window
  overlayWindow.hide();
};

// Update overlay window position and size
export const updateOverlayPosition = (config: {
  width: string;
  height: string;
  x: string;
  y: string;
  screenIndex: number;
}): void => {
  if (!overlayWindow || overlayWindow.isDestroyed()) {
    console.log("Overlay window not initialized or destroyed");
    return;
  }

  const displays = screen.getAllDisplays();
  const targetDisplay = displays[config.screenIndex] || displays[0];

  const windowX = parseInt(config.x) + (targetDisplay?.bounds.x || 0);
  const windowY = parseInt(config.y) + (targetDisplay?.bounds.y || 0);
  const windowWidth = parseInt(config.width);
  const windowHeight = parseInt(config.height);

  console.log("Updating overlay position:", {
    x: windowX,
    y: windowY,
    width: windowWidth,
    height: windowHeight,
  });

  // Update window position and size
  overlayWindow.setBounds({
    x: windowX,
    y: windowY,
    width: windowWidth,
    height: windowHeight,
  });
};

// Destroy the overlay window (for cleanup)
export const destroyOverlayWindow = (): void => {
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    console.log("Destroying overlay window");
    overlayWindow.close();
    overlayWindow = null;
    isInitialized = false;
  }
};
