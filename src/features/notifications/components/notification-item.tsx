"use client";

import { useRouter } from "next/navigation";
import type { Notification } from "@/types/notification.types";
import { formatRelativeTime } from "@/utils/formatters";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: number) => void;
  onNavigate?: () => void;
}

function getNotificationUrl(notification: Notification): string | null {
  const { type, chapter_id, comment_id } = notification;

  if (type === "new_chapter" && chapter_id) {
    return `/read/${chapter_id}`;
  }

  if (
    (type === "reply_to_comment" || type === "comment_on_manga") &&
    chapter_id
  ) {
    if (comment_id) return `/read/${chapter_id}#comment-${comment_id}`;
    return `/read/${chapter_id}`;
  }

  return null;
}

export function NotificationItem({
  notification,
  onMarkRead,
  onNavigate,
}: NotificationItemProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkRead(notification.id);
    }
    const url = getNotificationUrl(notification);
    if (url) {
      onNavigate?.();
      router.push(url);
    }
  };

  const url = getNotificationUrl(notification);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--muted)]/30 ${
        notification.is_read ? "opacity-60" : ""
      } ${url ? "cursor-pointer" : "cursor-default"}`}
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
