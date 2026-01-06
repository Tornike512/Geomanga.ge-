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
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold text-xs transition-colors",
        {
          "bg-gray-100 text-gray-800": variant === "default",
          "bg-blue-100 text-blue-800": variant === "secondary",
          "bg-green-100 text-green-800": variant === "success",
          "bg-yellow-100 text-yellow-800": variant === "warning",
          "bg-red-100 text-red-800": variant === "danger",
        },
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
