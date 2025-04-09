import { WebSocket } from "ws";
import { ipcMain } from "electron";
import { apiHeaders } from "./poe-live-search/api";

let activeSocket: WebSocket | null = null;

export function setupWebSocketHandlers() {
  // Handle connection request from renderer
  ipcMain.on("ws-connect", (event, { wsUri, sessionId }) => {
    // Close existing connection if any
    if (activeSocket) {
      console.log("Closing existing WebSocket connection");
      activeSocket.close();
      activeSocket = null;
    }

    try {
      console.log(`Attempting to connect to WebSocket: ${wsUri}`);
      console.log(`Using session ID: ${sessionId.substring(0, 5)}...`); // Only log first few chars for security

      // Add headers with the session cookie
      const socket = new WebSocket(wsUri, {
        headers: apiHeaders(),
      });

      console.log("WebSocket instance created, waiting for connection...");

      socket.on("open", () => {
        console.log("WebSocket connection successfully opened");
        console.log("Ready state:", socket.readyState);
        event.sender.send("ws-connected");
      });

      socket.on("message", (data) => {
        try {
          const parsedData = JSON.parse(data.toString());
          console.log("Reeived WebSocket message:", parsedData);
          event.sender.send("ws-message", parsedData);
        } catch (e) {
          console.error("Error parsing WebSocket message:", e);
          console.log("Raw message data:", data.toString());
        }
      });

      socket.on("error", (error) => {
        console.error("WebSocket error occurred:", error);
        console.log("Error details:", JSON.stringify(error, null, 2));
        event.sender.send("ws-error", error.message);
      });

      socket.on("close", (code, reason) => {
        console.log(`WebSocket connection closed with code: ${code}`);
        console.log(`Close reason: ${reason || "No reason provided"}`);
        event.sender.send("ws-disconnected");
        activeSocket = null;
      });

      socket.on("unexpected-response", (request, response) => {
        console.error(`Unexpected WebSocket response: ${response.statusCode}`);
        console.log("Response headers:", response.headers);
        event.sender.send(
          "ws-error",
          `Unexpected response: ${response.statusCode}`
        );
      });

      activeSocket = socket;
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      console.log("Error stack:", error.stack);
      event.sender.send("ws-error", error.message);
    }
  });

  // Handle disconnect request from renderer
  ipcMain.on("ws-disconnect", () => {
    if (activeSocket) {
      console.log("Manually disconnecting WebSocket");
      activeSocket.close();
      activeSocket = null;
    } else {
      console.log("No active WebSocket connection to disconnect");
    }
  });
}
