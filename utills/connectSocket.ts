/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from "@/config";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token?: string, tenantSlug?: string) => {
  if (socket) {
    const currentToken = (socket.auth as any)?.token;
    if (token && currentToken !== token) {
      console.log("🔄 Token changed, recreating socket connection...");
      socket.disconnect();
      socket = null;
    }
  }

  if (!socket) {
    // Fallback to the origin of next_public_base_api if next_public_ws_url is undefined
    let wsUrl = config.next_public_ws_url;
    if (!wsUrl && config.next_public_base_api) {
      try {
        wsUrl = new URL(config.next_public_base_api).origin;
      } catch (e) {
        console.error("Failed to parse base API URL for websocket:", e);
      }
    }
    
    // Default to window.location.origin if still not set (client-side only)
    if (!wsUrl && typeof window !== "undefined") {
      wsUrl = window.location.origin;
    }

    socket = io(wsUrl || "", {
      transports: ["polling", "websocket"], // Allow polling fallback for compatibility
      withCredentials: true,
      auth: token ? { token } : undefined,
      extraHeaders: tenantSlug ? { "x-tenant-slug": tenantSlug } : undefined,
    });

    socket.on("connect", () => {
      console.log("✅ connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ connect_error:", err.message);
    });
  }

  // 🔥 THIS IS THE FIX
  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

export const getSocket = () => socket;
