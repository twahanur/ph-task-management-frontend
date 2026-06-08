"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { connectSocket, getSocket } from "@/utills/connectSocket";
import { useUser } from "./AuthProvider";
import { getAccesstoken } from "@/service/authService";
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/service/notificationService/notification.service";

// ─── Notification type ────────────────────────────────────────────────────────
export interface TNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  related_type: string | null;
  related_id: string | null;
  created_at: string;
  action_url: string | null;
}

// ─── Context type ─────────────────────────────────────────────────────────────
type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
  // notifications
  notifications: TNotification[];
  unreadCount: number;
  isLoadingNotifications: boolean;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  refetchNotifications: () => Promise<void>;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export default function SocketProvider({
  tenantSlug: ssrTenantSlug,
  token: ssrToken,
  children,
  enabled = true,
}: {
  tenantSlug?: string;
  token?: string;
  children: React.ReactNode;
  enabled?: boolean;
}) {
  const { user } = useUser();
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  // Fetch token on client side when user changes
  useEffect(() => {
    if (user) {
      getAccesstoken().then((tok) => {
        setClientToken(tok);
      });
    } else {
      setClientToken(null);
    }
  }, [user]);

  const activeToken = clientToken || ssrToken;
  const activeTenantSlug = user?.tenantSlug || ssrTenantSlug || "";
  const isCurrentlyEnabled = enabled || !!user;

  // ── HTTP: initial load ────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!isCurrentlyEnabled || !activeToken) return;
    setIsLoadingNotifications(true);
    try {
      const [notifRes, countRes] = await Promise.all([
        getNotifications(),
        getUnreadCount(),
      ]);
      if (notifRes?.success && notifRes.data) {
        if (Array.isArray(notifRes.data.notifications)) {
          setNotifications(notifRes.data.notifications);
        } else if (Array.isArray(notifRes.data)) {
          setNotifications(notifRes.data);
        }
      } else if (Array.isArray(notifRes)) {
        setNotifications(notifRes);
      }

      if (notifRes?.data?.unreadCount !== undefined) {
        setUnreadCount(notifRes.data.unreadCount);
      } else if (countRes?.data?.count !== undefined) {
        setUnreadCount(countRes.data.count);
      } else if (typeof countRes?.count === "number") {
        setUnreadCount(countRes.count);
      }
    } catch (e) {
      console.error("Failed to load notifications", e);
    } finally {
      setIsLoadingNotifications(false);
    }
  }, [isCurrentlyEnabled, activeToken]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ── HTTP: mark one read ───────────────────────────────────────────────────
  const markRead = useCallback(
    async (id: string) => {
      // Optimistic local update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));

      try {
        await markNotificationRead(id);
      } catch (e) {
        console.error("markRead failed", e);
        fetchNotifications(); // re-sync on failure
      }

      // Tell other tabs via socket
      const socket = getSocket();
      socket?.emit("notification:read", id);
    },
    [fetchNotifications]
  );

  // ── HTTP: mark all read ───────────────────────────────────────────────────
  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    try {
      await markAllNotificationsRead();
    } catch (e) {
      console.error("markAllRead failed", e);
      fetchNotifications();
    }

    const socket = getSocket();
    socket?.emit("notification:read-all");
  }, [fetchNotifications]);

  // ── Socket setup ──────────────────────────────────────────────────────────
  const listenersAttachedRef = useRef(false);

  useEffect(() => {
    if (!isCurrentlyEnabled || !activeToken) return;

    const socket = connectSocket(activeToken, activeTenantSlug);

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("connect_error", () => setIsConnected(false));

    if (!listenersAttachedRef.current) {
      listenersAttachedRef.current = true;

      // New notification pushed by the server
      socket.on("notification:new", (notification: TNotification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      // Badge count updated by server (after any mutation)
      socket.on("notification:unread-count", ({ count }: { count: number }) => {
        setUnreadCount(count);
      });

      // Another tab of the same user marked one notification as read
      socket.on("notification:read", (notificationId: string) => {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      });

      // Another tab marked all as read
      socket.on("notification:read-all", () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
      });
    }

    return () => {
      socket.disconnect();
      listenersAttachedRef.current = false;
    };
  }, [isCurrentlyEnabled, activeTenantSlug, activeToken]);

  return (
    <SocketContext.Provider
      value={{
        socket: getSocket(),
        isConnected,
        notifications,
        unreadCount,
        isLoadingNotifications,
        markRead,
        markAllRead,
        refetchNotifications: fetchNotifications,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
