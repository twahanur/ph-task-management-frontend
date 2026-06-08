"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2, X, ExternalLink } from "lucide-react";
import { useSocket } from "@/provider/SocketProvider";
import { deleteNotification, deleteAllNotifications } from "@/service/notificationService/notification.service";
import Link from "next/link";

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const TYPE_COLOR: Record<string, string> = {
    card_assigned: "silver-btn",
    card_unassigned: "bg-slate-500",
    card_status_changed: "silver-btn",
    card_commented: "silver-btn",
    card_due_soon: "silver-btn",
    member_added: "silver-btn",
    member_removed: "silver-btn",
};

export default function NotificationBell() {
    const {
        notifications,
        unreadCount,
        isLoadingNotifications,
        markRead,
        markAllRead,
        refetchNotifications,
    } = useSocket();

    const [isOpen, setIsOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleMarkRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await markRead(id);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeletingId(id);
        try {
            await deleteNotification(id);
            await refetchNotifications();
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteAll = async () => {
        await deleteAllNotifications();
        await refetchNotifications();
    };

    return (
        <div ref={panelRef} className="relative">
            {/* Bell Button */}
            <button
                id="notification-bell-btn"
                onClick={() => setIsOpen((v) => !v)}
                className="relative p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-250/50 transition cursor-pointer"
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 flex items-center justify-center silver-btn text-white text-[9px] font-bold rounded-full leading-none shadow">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div
                    id="notification-panel"
                    className="absolute right-0 top-full mt-2 w-80 sm:w-96 silver-metallic border border-gray-300 rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden"
                    style={{ maxHeight: "min(520px, 80vh)" }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <Bell size={15} className="text-gray-500" />
                            <span className="font-semibold text-sm text-gray-800">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="silver-btn text-red-650 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {unreadCount} unread
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    title="Mark all as read"
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 transition cursor-pointer"
                                >
                                    <CheckCheck size={15} />
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={handleDeleteAll}
                                    title="Clear all"
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 transition cursor-pointer"
                                >
                                    <Trash2 size={15} />
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-650 hover:bg-gray-200/50 transition cursor-pointer"
                            >
                                <X size={15} />
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto custom-scrollbar flex-1 bg-transparent">
                        {isLoadingNotifications && (
                            <div className="py-10 flex justify-center">
                                <div className="w-5 h-5 border-2 border-gray-550 border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}

                        {!isLoadingNotifications && notifications.length === 0 && (
                            <div className="py-12 flex flex-col items-center gap-2 text-gray-450">
                                <Bell size={28} />
                                <p className="text-xs font-medium">No notifications yet</p>
                            </div>
                        )}

                        {!isLoadingNotifications &&
                            notifications.map((n) => {
                                const dot = TYPE_COLOR[n.type] || "silver-btn";
                                return (
                                    <div
                                        key={n.id}
                                        className={`group flex gap-3 px-4 py-3 border-b border-gray-200 last:border-b-0 transition hover:bg-gray-200/20 ${!n.is_read ? "bg-gray-200/10" : ""}`}
                                    >
                                        {/* Dot */}
                                        <div className="flex-shrink-0 mt-1">
                                            <span className={`w-2 h-2 rounded-full block ${dot} ${n.is_read ? "opacity-35" : "opacity-100"}`} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-semibold leading-snug ${n.is_read ? "text-gray-500" : "text-gray-800"}`}>
                                                {n.title}
                                            </p>
                                            <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed line-clamp-2">
                                                {n.message}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="text-[10px] text-gray-400">{timeAgo(n.created_at)}</span>
                                                {n.action_url && (
                                                    <Link
                                                        href={n.action_url}
                                                        onClick={() => setIsOpen(false)}
                                                        className="text-[10px] text-gray-600 hover:text-gray-800 font-semibold flex items-center gap-0.5 transition"
                                                    >
                                                        View <ExternalLink size={9} />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                                            {!n.is_read && (
                                                <button
                                                    onClick={(e) => handleMarkRead(n.id, e)}
                                                    title="Mark as read"
                                                    className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 transition cursor-pointer"
                                                >
                                                    <Check size={13} />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => handleDelete(n.id, e)}
                                                disabled={deletingId === n.id}
                                                title="Delete"
                                                className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 transition cursor-pointer disabled:opacity-40"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
}
