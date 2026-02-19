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
          "bg-[var(--elevated)] text-[var(--muted-foreground)]":
            variant === "default",
          // Secondary — violet accent tint
          "bg-[var(--accent-muted)] text-[var(--accent)]":
            variant === "secondary",
          // Success — green
          "bg-green-500/20 text-green-400": variant === "success",
          // Warning — yellow
          "bg-yellow-500/20 text-yellow-400": variant === "warning",
          // Danger — red
          "bg-red-500/20 text-red-400": variant === "danger",
        },
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
