import { app, ipcMain, BrowserWindow } from "electron";
import { updateElectronApp } from "update-electron-app";

export function setupAutoUpdater() {
  const repo = "manistra/poe-tools"; // Replace with your GitHub username/repo

  // Create a function to send update status to renderer
  const sendStatusToWindow = (status: string) => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      windows[0].webContents.send("update-status", status);
    }
  };

  updateElectronApp({
    repo,
    updateInterval: "1 hour",
    logger: {
      log: (...args) => {
        console.log("[Auto-updater]", ...args);
        sendStatusToWindow(`log: ${args.join(" ")}`);
      },
      error: (...args) => {
        console.error("[Auto-updater]", ...args);
        sendStatusToWindow(`error: ${args.join(" ")}`);
      },
      info: (...args) => {
        console.info("[Auto-updater]", ...args);
        sendStatusToWindow(`info: ${args.join(" ")}`);
      },
      warn: (...args) => {
        console.warn("[Auto-updater]", ...args);
        sendStatusToWindow(`warn: ${args.join(" ")}`);
      },
    },
    notifyUser: true,
  });

  console.log(`Auto-updater initialized for ${repo} (v${app.getVersion()})`);

  // Set up IPC handlers for the renderer to check update status
  ipcMain.handle("get-app-version", () => {
    return app.getVersion();
  });
}
