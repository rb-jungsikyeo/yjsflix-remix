import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "~/utils/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "text" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = "primary", 
    size = "md",
    fullWidth = false,
    isLoading = false,
    disabled,
    children,
    ...props 
  }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      secondary: "bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500",
      text: "text-gray-300 hover:text-white hover:bg-white/10 focus:ring-white/30",
      ghost: "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 focus:ring-gray-500"
    };
    
    const sizes = {
      sm: "text-xs px-3 py-1.5 rounded",
      md: "text-sm px-4 py-2 rounded-md",
      lg: "text-base px-6 py-3 rounded-lg",
      xl: "text-lg px-8 py-4 rounded-lg"
    };
    
    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg 
            className="animate-spin -ml-1 mr-3 h-5 w-5" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
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
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";