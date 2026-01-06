import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        // Base styles - sharp corners, 2px border, flat (no shadow)
        "rounded-none border-2 border-[#3F3F46] bg-[#09090B] p-8 transition-all duration-300",
        // Hover state - flood with accent color, invert all text
        "group hover:border-[#DFE104] hover:bg-[#DFE104]",
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
        "font-bold text-3xl uppercase leading-none tracking-tighter",
        "text-[#FAFAFA] group-hover:text-[#000000]",
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
    <div
      className={cn("text-[#FAFAFA] group-hover:text-[#000000]", className)}
      {...props}
    >
      {children}
    </div>
  );
}
