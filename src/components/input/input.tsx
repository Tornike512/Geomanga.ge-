import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-[3px] border border-[var(--border)] bg-[var(--elevated)] px-2 py-2 text-[var(--foreground)] text-base transition-colors duration-100 sm:h-11 sm:px-4 sm:py-3 sm:text-base",
        "placeholder:text-[var(--muted-foreground)]",
        "focus:border-[var(--accent)]/60 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/30",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}
