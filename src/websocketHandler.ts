import { WebSocket } from "ws";
import { ipcMain } from "electron";

let activeSocket: WebSocket | null = null;

export function setupWebSocketHandlers() {
  // Handle connection request from renderer
  ipcMain.on("ws-connect", (event, { wsUri, sessionId }) => {
    // Close existing connection if any
    if (activeSocket) {
      activeSocket.close();
      activeSocket = null;
    }

    try {
      console.log(`Connecting to WebSocket: ${wsUri}`);

      // Add headers with the session cookie
      const socket = new WebSocket(wsUri, {
        headers: {
          Cookie: `POESESSID=${sessionId}`,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Origin: "https://www.pathofexile.com",
          Referer: "https://www.pathofexile.com/trade",
        },
      });

      socket.on("open", () => {
        console.log("WebSocket connection opened");
        event.sender.send("ws-connected");
      });

      socket.on("message", (data) => {
        try {
          const parsedData = JSON.parse(data.toString());
          console.log("Received message:", parsedData);
          event.sender.send("ws-message", parsedData);
        } catch (e) {
          console.error("Error parsing message:", e);
        }
      });

      socket.on("error", (error) => {
        console.error("WebSocket error:", error);
        event.sender.send("ws-error", error.message);
      });

      socket.on("close", (code, reason) => {
        console.log(`WebSocket connection closed: ${code} - ${reason}`);
        event.sender.send("ws-disconnected");
        activeSocket = null;
      });

      activeSocket = socket;
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      event.sender.send("ws-error", error.message);
    }
  });

  // Handle disconnect request from renderer
  ipcMain.on("ws-disconnect", () => {
    if (activeSocket) {
      activeSocket.close();
      activeSocket = null;
    }
  });
}
