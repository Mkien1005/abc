import { io } from "socket.io-client";
import { BASE_URL } from "./data_config";

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(accessToken) {
    if (this.socket) {
      this.disconnect();
    }
    this.socket = io(BASE_URL, {
      auth: { accessToken },
      withCredentials: true,
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("Socket connected");
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    this.socket.on("connect_error", (err) => {
      console.error("Connect error:", err.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.socket) return;

    this.socket.on(event, callback);
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  off(event, callback) {
    if (!this.socket) return;

    this.socket.off(event, callback);
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  removeAllListeners() {
    if (!this.socket) return;

    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach((callback) => {
        this.socket.off(event, callback);
      });
    });
    this.listeners.clear();
  }
}

export const socketService = new SocketService();
