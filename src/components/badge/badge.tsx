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
        // Base styles - soft rounded, medium tracking, no uppercase (refined, not shouting)
        "inline-flex items-center rounded-md px-3 py-1 font-medium text-xs tracking-wide transition-all duration-200",
        {
          // Default - muted slate with subtle glow
          "border border-[var(--border)] bg-[var(--muted)]/60 text-[var(--muted-foreground)] backdrop-blur-sm":
            variant === "default",
          // Secondary - amber accent with glow
          "border border-[var(--accent)]/30 bg-[var(--accent-muted)] text-[var(--accent)] shadow-[0_0_20px_rgba(245,158,11,0.15)]":
            variant === "secondary",
          // Success - green with subtle glow
          "border border-green-500/30 bg-green-500/15 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]":
            variant === "success",
          // Warning - yellow/orange with glow
          "border border-yellow-500/30 bg-yellow-500/15 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.1)]":
            variant === "warning",
          // Danger - red with subtle glow
          "border border-red-500/30 bg-red-500/15 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)]":
            variant === "danger",
        },
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
