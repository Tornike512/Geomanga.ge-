import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        // Glass effect card - semi-transparent with backdrop blur
        "rounded-lg border border-[var(--border)] bg-[var(--card)] p-8 backdrop-blur-sm transition-all duration-300 ease-out",
        // Hover state - brightened border, slightly more opaque, subtle scale
        "hover:scale-[1.02] hover:border-[var(--border-hover)] hover:bg-[rgba(26,26,36,0.8)] hover:shadow-[0_10px_15px_rgba(0,0,0,0.3)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("mb-6 flex flex-col space-y-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: CardProps) {
  return (
    <h3
      className={cn(
        "font-semibold text-2xl text-[var(--foreground)] leading-tight tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("text-[var(--foreground)]", className)} {...props}>
      {children}
    </div>
  );
}
