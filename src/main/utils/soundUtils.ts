import sound from "sound-play";
import { app } from "electron";
import path from "path";

export type SoundType = "whisper" | "teleport" | "notification" | "ping";

export const playSound = async (soundType: SoundType = "notification") => {
  try {
    const soundPath = getSoundPath(soundType);
    await sound.play(soundPath);
  } catch (error) {
    // Fallback to system beep
    process.stdout.write("\x07");
  }
};

const getSoundPath = (soundType: SoundType): string => {
  const basePath = app.isPackaged
    ? path.join(process.resourcesPath, "sounds")
    : path.join(process.cwd(), "src", "renderer", "assets", "sounds");

  switch (soundType) {
    case "whisper":
      return path.join(basePath, "whisper.mp3");
    case "teleport":
      return path.join(basePath, "teleport.mp3");
    case "notification":
      return path.join(basePath, "ding.wav");
    case "ping":
      return path.join(basePath, "ping.mp3");
    default:
      return path.join(basePath, "ding.wav");
  }
};

export const playWhisperSound = async () => await playSound("whisper");
export const playTeleportSound = async () => await playSound("teleport");
export const playPingSound = async () => await playSound("ping");
export const playNotificationSound = async () =>
  await playSound("notification");
