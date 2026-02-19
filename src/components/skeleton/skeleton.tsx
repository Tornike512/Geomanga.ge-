import { cn } from "@/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[3px] bg-[var(--elevated)]",
        className,
      )}
      aria-live="polite"
      aria-busy="true"
    />
  );
}
