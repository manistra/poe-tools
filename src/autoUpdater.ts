import { app } from "electron";
import { updateElectronApp } from "update-electron-app";

export function setupAutoUpdater() {
  const repo = "manistra/poe-tools"; // Replace with your GitHub username/repo

  updateElectronApp({
    repo,
    updateInterval: "1 hour",
    logger: {
      log: (...args) => console.log("[Auto-updater]", ...args),
      error: (...args) => console.error("[Auto-updater]", ...args),
      info: (...args) => console.info("[Auto-updater]", ...args),
      warn: (...args) => console.warn("[Auto-updater]", ...args),
    },
  });

  console.log(`Auto-updater initialized for ${repo} (v${app.getVersion()})`);
}
