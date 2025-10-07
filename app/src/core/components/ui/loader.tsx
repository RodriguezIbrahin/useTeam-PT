import { cn } from "@/core/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Loader({ size = "md", className }: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-primary border-t-transparent",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface LoaderDotsProps {
  className?: string;
}

export function LoaderDots({ className }: LoaderDotsProps) {
  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="status"
      aria-label="Loading"
    >
      <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface LoaderPulseProps {
  className?: string;
}

export function LoaderPulse({ className }: LoaderPulseProps) {
  return (
    <div
      className={cn(
        "h-8 w-8 animate-pulse rounded-full bg-primary/20",
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
