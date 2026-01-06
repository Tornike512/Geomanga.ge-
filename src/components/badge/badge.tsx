import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface BadgeProps extends ButtonHTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "danger";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        // Base styles - sharp corners, uppercase, minimal padding, border
        "inline-flex items-center rounded-none border-2 px-3 py-1 font-bold text-xs uppercase tracking-wide transition-colors",
        {
          // Default - muted with border
          "border-[#3F3F46] bg-[#27272A] text-[#A1A1AA]": variant === "default",
          // Secondary - accent colored
          "border-[#DFE104] bg-transparent text-[#DFE104]":
            variant === "secondary",
          // Success - green
          "border-green-500 bg-transparent text-green-500":
            variant === "success",
          // Warning - yellow/orange
          "border-yellow-500 bg-transparent text-yellow-500":
            variant === "warning",
          // Danger - red
          "border-red-500 bg-transparent text-red-500": variant === "danger",
        },
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
