import { cn } from "@/utils/cn";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-10 w-10",
  lg: "h-16 w-16",
};

const borderWidths = {
  sm: "2px",
  md: "3px",
  lg: "4px",
};

export function Spinner({ size = "lg", className }: SpinnerProps) {
  return (
    <div
      className={cn("animate-spin rounded-full", sizeClasses[size], className)}
      style={{
        borderWidth: borderWidths[size],
        borderStyle: "solid",
        borderColor: "#f59e0b",
        borderTopColor: "transparent",
      }}
      role="status"
      aria-label="იტვირთება"
    >
      <span className="sr-only">იტვირთება...</span>
    </div>
  );
}
