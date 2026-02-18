"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BellIcon } from "@/assets";
import { Button } from "@/components/button";
import { useMarkAllRead } from "../hooks/use-mark-all-read";
import { useMarkRead } from "../hooks/use-mark-read";
import { useNotifications } from "../hooks/use-notifications";
import { useUnreadCount } from "../hooks/use-unread-count";
import { NotificationItem } from "./notification-item";

interface NotificationBellProps {
  isLoggedIn: boolean;
}

export function NotificationBell({ isLoggedIn }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { data: unreadData } = useUnreadCount(isLoggedIn);
  const { data: notificationsData } = useNotifications(
    {},
    isLoggedIn && isOpen,
  );
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const unreadCount = unreadData?.count ?? 0;

  // Position panel below the button using its bounding rect
  const openPanel = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPanelStyle({
        position: "fixed",
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen(true);
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  const panel = isOpen
    ? createPortal(
        <div
          ref={panelRef}
          style={panelStyle}
          className="z-[9999] w-80 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-xl"
        >
          <div className="flex items-center justify-between border-[var(--border)] border-b px-4 py-3">
            <span className="font-semibold text-sm">შეტყობინებები</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[var(--accent)] text-xs hover:underline"
              >
                ყველა წაკითხული
              </button>
            )}
          </div>

          <div className="max-h-96 divide-y divide-[var(--border)] overflow-y-auto">
            {!notificationsData || notificationsData.items.length === 0 ? (
              <p className="px-4 py-6 text-center text-[var(--muted-foreground)] text-sm">
                შეტყობინება არ არის
              </p>
            ) : (
              notificationsData.items.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onMarkRead={(id) => markRead.mutate(id)}
                />
              ))
            )}
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        onClick={() => (isOpen ? setIsOpen(false) : openPanel())}
        className="relative h-auto p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        aria-label="შეტყობინებები"
      >
        <BellIcon width={20} height={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-0.5 font-bold text-[10px] text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      {panel}
    </div>
  );
}
