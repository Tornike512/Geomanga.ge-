import { cn } from "@/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
  variant?: "default" | "ghost" | "outline" | "destructive" | "unstyled";
  size?: "default" | "sm" | "lg";
}

export const Button = ({
  children,
  className,
  type = "button",
  loading,
  ref,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) => {
  return (
    <button
      ref={ref}
      type={type}
      disabled={loading || props.disabled}
      className={cn(
        // Base styles - Minimalist Dark: smooth, refined, no uppercase
        variant !== "unstyled" &&
          "inline-flex cursor-pointer items-center justify-center font-medium tracking-normal transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        "disabled:pointer-events-none disabled:opacity-50",
        variant !== "unstyled" && "active:scale-[0.98]", // Subtle press effect
        // Variant styles
        {
          // Primary (Amber) - warm glow on hover
          "rounded-lg border border-transparent bg-[var(--accent)] text-[var(--accent-foreground)] shadow-sm hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:brightness-110":
            variant === "default",
          // Ghost - transparent, subtle hover
          "rounded-lg text-[var(--foreground)] hover:bg-white/5":
            variant === "ghost",
          // Outline - glass effect border
          "rounded-lg border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:border-[var(--border-hover)] hover:bg-white/5":
            variant === "outline",
          // Destructive - red with amber focus
          "rounded-lg border border-transparent bg-red-600 text-white shadow-sm hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:brightness-110":
            variant === "destructive",
          // Unstyled - minimal styling, allows full customization via className
          "": variant === "unstyled",
        },
        // Size styles (not applied for unstyled variant)
        variant !== "unstyled" && {
          "h-11 px-6 py-3 text-base": size === "default",
          "h-9 px-4 py-2 text-sm": size === "sm",
          "h-12 px-8 py-4 text-lg": size === "lg",
        },
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="-ml-1 mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Loading"
            role="img"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};
