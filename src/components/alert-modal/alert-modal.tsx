"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/button";

export type AlertType = "error" | "success" | "warning";

interface AlertModalProps {
  message: string;
  type: AlertType;
  onClose: () => void;
}

const ICON_PATHS: Record<AlertType, string> = {
  error:
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
  success:
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  warning: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
};

const TYPE_STYLES: Record<AlertType, { accent: string; bg: string }> = {
  error: {
    accent: "text-red-400",
    bg: "bg-red-500/10",
  },
  success: {
    accent: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  warning: {
    accent: "text-amber-400",
    bg: "bg-amber-500/10",
  },
};

export function AlertModal({ message, type, onClose }: AlertModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsVisible(true));
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleClose]);

  const styles = TYPE_STYLES[type];

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <Button
        variant="unstyled"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
        tabIndex={-1}
        aria-label="Close alert modal"
      >
        <span className="sr-only">Close</span>
      </Button>

      {/* Modal */}
      <div
        className={`relative z-10 mx-4 flex w-full max-w-md flex-col rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-2xl transition-all duration-200 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex flex-col items-center px-6 pt-8 pb-4 text-center">
          {/* Icon */}
          <div
            className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${styles.bg}`}
          >
            <svg
              className={`h-7 w-7 ${styles.accent}`}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d={ICON_PATHS[type]} />
            </svg>
          </div>

          {/* Message */}
          <p className="text-[var(--foreground)] text-base leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-center px-6 pt-2 pb-6">
          <Button onClick={handleClose} className="min-w-[100px]">
            OK
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
