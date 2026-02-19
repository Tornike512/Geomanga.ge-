import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[3px] border border-[var(--border)] bg-[var(--card)] p-6 transition-colors duration-100",
        "hover:border-[var(--border-hover)]",
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
        "font-semibold text-2xl text-[var(--foreground)] leading-tight",
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
