import { WebSocket } from "ws";
import { ipcMain } from "electron";

interface WebSocketConnection {
  id: string;
  socket: WebSocket;
  searchId: string;
}

const activeSockets = new Map<string, WebSocketConnection>();

export function setupWebSocketHandlers() {
  // Handle connection request from renderer
  ipcMain.on("ws-connect", (event, { wsUri, sessionId, searchId }) => {
    // Close existing connection for this search if any
    if (activeSockets.has(searchId)) {
      activeSockets.get(searchId)?.socket.close();
      activeSockets.delete(searchId);
    }

    try {
      console.log(`Connecting to WebSocket: ${wsUri} for search: ${searchId}`);

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

      const connection: WebSocketConnection = {
        id: searchId,
        socket,
        searchId,
      };

      socket.on("open", () => {
        console.log(`WebSocket connection opened for search: ${searchId}`);
        activeSockets.set(searchId, connection);
        event.sender.send("ws-connected", searchId);
      });

      socket.on("message", (data) => {
        try {
          const parsedData = JSON.parse(data.toString());
          console.log(`Received message from ${searchId}:`, parsedData);
          event.sender.send("ws-message", searchId, parsedData);
        } catch (e) {
          console.error(`Error parsing message from ${searchId}:`, e);
        }
      });

      socket.on("error", (error) => {
        console.error(`WebSocket error for ${searchId}:`, error);
        event.sender.send("ws-error", searchId, error.message);
      });

      socket.on("close", (code, reason) => {
        console.log(
          `WebSocket connection closed for ${searchId}: ${code} - ${reason}`
        );
        activeSockets.delete(searchId);
        event.sender.send("ws-disconnected", searchId);
      });
    } catch (error) {
      console.error(`Failed to create WebSocket for ${searchId}:`, error);
      event.sender.send("ws-error", searchId, error.message);
    }
  });

  // Handle disconnect request from renderer
  ipcMain.on("ws-disconnect", (event, searchId?: string) => {
    if (searchId) {
      // Disconnect specific search
      if (activeSockets.has(searchId)) {
        activeSockets.get(searchId)?.socket.close();
        activeSockets.delete(searchId);
        console.log(`Disconnected WebSocket for search: ${searchId}`);
      }
    } else {
      // Disconnect all
      console.log("Disconnecting all WebSocket connections");
      for (const [id, connection] of activeSockets) {
        connection.socket.close();
        console.log(`Disconnected WebSocket for search: ${id}`);
      }
      activeSockets.clear();
    }
  });
}
