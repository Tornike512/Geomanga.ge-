"use client";

import { useCallback, useState } from "react";
import { AlertModal, type AlertType } from "@/components/alert-modal";

export function useAlertModal() {
  const [state, setState] = useState<{
    open: boolean;
    message: string;
    type: AlertType;
  }>({ open: false, message: "", type: "error" });

  const showAlert = useCallback(
    (message: string, type: AlertType = "error") => {
      setState({ open: true, message, type });
    },
    [],
  );

  const handleClose = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const AlertModalComponent = state.open ? (
    <AlertModal
      message={state.message}
      type={state.type}
      onClose={handleClose}
    />
  ) : null;

  return { showAlert, AlertModalComponent };
}
