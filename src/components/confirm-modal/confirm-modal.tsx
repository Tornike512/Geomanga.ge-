"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/button";

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsVisible(true));
    });
  }, []);

  const animateOut = useCallback((callback: () => void) => {
    setIsVisible(false);
    setTimeout(callback, 200);
  }, []);

  const handleCancel = useCallback(() => {
    animateOut(onCancel);
  }, [animateOut, onCancel]);

  const handleConfirm = useCallback(() => {
    animateOut(onConfirm);
  }, [animateOut, onConfirm]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCancel();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleCancel]);

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
        onClick={handleCancel}
        tabIndex={-1}
        aria-label="Close confirm modal"
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
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
            <svg
              className="h-7 w-7 text-red-400"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>

          {/* Message */}
          <p className="text-[var(--foreground)] text-base leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-3 px-6 pt-2 pb-6">
          <Button variant="outline" onClick={handleCancel}>
            გაუქმება
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            წაშლა
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
