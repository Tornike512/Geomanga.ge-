import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        // Glass effect background with backdrop blur
        "flex h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-2 text-[var(--foreground)] text-base backdrop-blur-sm transition-all duration-200 sm:h-11 sm:px-4 sm:py-3 sm:text-base",
        // Placeholder styling
        "placeholder:text-[var(--muted-foreground)]",
        // Focus state - amber glow
        "focus:border-[var(--accent)]/50 focus:shadow-[0_0_20px_rgba(245,158,11,0.1)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
