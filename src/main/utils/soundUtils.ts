import player from "play-sound";

const audioPlayer = player({});

export type SoundType = "whisper" | "teleport" | "notification" | "ping";

export const playSound = (soundType: SoundType = "notification") => {
  try {
    const soundPath = getSoundPath(soundType);
    audioPlayer.play(soundPath, (err: any) => {
      if (err) {
        console.error("Failed to play sound:", err);
        // Fallback to system beep
        process.stdout.write("\x07");
      }
    });
  } catch (error) {
    console.error("Failed to play sound:", error);
    // Fallback to system beep
    process.stdout.write("\x07");
  }
};

const getSoundPath = (soundType: SoundType): string => {
  const basePath = "src/renderer/assets/sounds";
  switch (soundType) {
    case "whisper":
      return `${basePath}/whisper.mp3`;
    case "teleport":
      return `${basePath}/teleport.mp3`;
    case "notification":
      return `${basePath}/ding.mp3`;
    case "ping":
      return `${basePath}/ping.mp3`;
    default:
      return `${basePath}/ding.mp3`;
  }
};

export const playWhisperSound = () => playSound("whisper");
export const playTeleportSound = () => playSound("teleport");
export const playPingSound = () => playSound("ping");
export const playNotificationSound = () => playSound("notification");
