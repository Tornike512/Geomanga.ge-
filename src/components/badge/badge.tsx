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
        "inline-flex items-center rounded-[3px] px-2 py-0.5 font-medium text-xs tracking-wide",
        {
          // Default — muted surface
          "border border-[var(--border)] bg-[var(--elevated)] text-[var(--muted-foreground)]":
            variant === "default",
          // Secondary — violet accent tint
          "border border-[var(--accent)]/25 bg-[var(--accent-muted)] text-[var(--accent)]":
            variant === "secondary",
          // Success — green
          "border border-green-700/40 bg-green-900/30 text-green-400":
            variant === "success",
          // Warning — yellow
          "border border-yellow-700/40 bg-yellow-900/20 text-yellow-400":
            variant === "warning",
          // Danger — red
          "border border-red-700/40 bg-red-900/20 text-red-400":
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
