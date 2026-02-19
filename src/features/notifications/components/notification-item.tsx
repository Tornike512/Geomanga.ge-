"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getMangaDetail } from "@/features/manga/api/get-manga-detail";
import type { Notification } from "@/types/notification.types";
import { formatRelativeTime } from "@/utils/formatters";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: number) => void;
  onNavigate?: () => void;
}

export function NotificationItem({
  notification,
  onMarkRead,
  onNavigate,
}: NotificationItemProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = async () => {
    if (!notification.is_read) {
      onMarkRead(notification.id);
    }

    const { type, chapter_id, comment_id, manga_id } = notification;

    // New chapter → go to manga page
    if (type === "new_chapter" && manga_id) {
      setIsNavigating(true);
      try {
        const manga = await getMangaDetail(manga_id);
        onNavigate?.();
        router.push(`/manga/${manga.slug}`);
      } finally {
        setIsNavigating(false);
      }
      return;
    }

    // Reply or comment on chapter → go to reader and scroll to comment
    if (
      (type === "reply_to_comment" || type === "comment_on_manga") &&
      chapter_id
    ) {
      onNavigate?.();
      if (comment_id) {
        router.push(`/read/${chapter_id}#comment-${comment_id}`);
      } else {
        router.push(`/read/${chapter_id}#comments`);
      }
      return;
    }

    // Comment on manga page (no chapter) → go to manga page
    if (type === "comment_on_manga" && manga_id) {
      setIsNavigating(true);
      try {
        const manga = await getMangaDetail(manga_id);
        onNavigate?.();
        router.push(`/manga/${manga.slug}`);
      } finally {
        setIsNavigating(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isNavigating}
      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--muted)]/30 ${
        notification.is_read ? "opacity-60" : ""
      } ${isNavigating ? "opacity-50" : ""}`}
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
