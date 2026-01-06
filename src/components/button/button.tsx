import { cn } from "@/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
  variant?: "default" | "ghost" | "outline" | "destructive";
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
        // Base styles - uppercase, bold, sharp corners, transitions
        "inline-flex items-center justify-center rounded-none font-bold uppercase tracking-tighter transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFE104] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B]",
        "disabled:pointer-events-none disabled:opacity-50",
        "active:scale-95",
        // Variant styles
        {
          // Primary (Accent) - acid yellow with black text
          "bg-[#DFE104] text-[#000000] hover:scale-105": variant === "default",
          // Ghost - transparent with off-white text
          "text-[#FAFAFA] hover:text-[#DFE104]": variant === "ghost",
          // Outline - 2px border, fills on hover
          "border-2 border-[#3F3F46] bg-transparent text-[#FAFAFA] hover:border-[#FAFAFA] hover:bg-[#FAFAFA] hover:text-[#000000]":
            variant === "outline",
          // Destructive - red with white text
          "bg-red-600 text-[#FAFAFA] hover:scale-105 hover:bg-red-700":
            variant === "destructive",
        },
        // Size styles
        {
          "h-14 px-8 text-base": size === "default",
          "h-10 px-4 text-sm": size === "sm",
          "h-20 px-12 text-lg": size === "lg",
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
          LOADING...
        </>
      ) : (
        children
      )}
    </button>
  );
};
