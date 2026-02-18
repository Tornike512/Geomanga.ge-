"use client";

import type { Notification } from "@/types/notification.types";
import { formatRelativeTime } from "@/utils/formatters";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: number) => void;
}

export function NotificationItem({
  notification,
  onMarkRead,
}: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.is_read) {
      onMarkRead(notification.id);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--muted)]/30 ${
        notification.is_read ? "opacity-60" : ""
      }`}
    >
      {!notification.is_read && (
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
      )}
      {notification.is_read && <span className="mt-1.5 h-2 w-2 shrink-0" />}
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug">{notification.message}</p>
        <p className="mt-0.5 text-[var(--muted-foreground)] text-xs">
          {formatRelativeTime(notification.created_at)}
        </p>
      </div>
    </button>
  );
}
