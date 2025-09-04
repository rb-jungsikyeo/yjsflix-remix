import { cn } from "~/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantClasses = {
  default: "bg-gray-700 text-gray-200",
  success: "bg-green-900/50 text-green-400",
  warning: "bg-yellow-900/50 text-yellow-400",
  error: "bg-red-900/50 text-red-400",
  info: "bg-blue-900/50 text-blue-400"
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-0.5",
  lg: "text-base px-3 py-1"
};

export function Badge({ 
  children, 
  variant = "default", 
  size = "md",
  className 
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export function RatingBadge({ rating }: { rating: number }) {
  const getVariant = () => {
    if (rating >= 8) return "success";
    if (rating >= 6) return "warning";
    return "error";
  };

  return (
    <Badge variant={getVariant()} size="sm" className="font-semibold">
      <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      {rating.toFixed(1)}
    </Badge>
  );
}