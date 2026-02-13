"use client";

import { useCallback, useRef, useState } from "react";
import { ConfirmModal } from "@/components/confirm-modal";

export function useConfirmModal() {
  const [state, setState] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({ open: true, message });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    resolveRef.current?.(true);
    resolveRef.current = null;
    setState({ open: false, message: "" });
  }, []);

  const handleCancel = useCallback(() => {
    resolveRef.current?.(false);
    resolveRef.current = null;
    setState({ open: false, message: "" });
  }, []);

  const ConfirmModalComponent = state.open ? (
    <ConfirmModal
      message={state.message}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return { confirm, ConfirmModalComponent };
}
