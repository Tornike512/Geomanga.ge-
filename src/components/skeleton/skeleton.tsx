import { cn } from "@/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        // Minimalist Dark skeleton - subtle shimmer on layered slate
        "animate-pulse rounded-lg bg-[var(--muted)]/40 backdrop-blur-sm",
        className,
      )}
      aria-live="polite"
      aria-busy="true"
    />
  );
}
