"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function LoadingSpinner({
  className,
  size = "default",
  variant = "default",
  ...props
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const variantClasses = {
    default: "text-primary",
    muted: "text-muted-foreground",
    white: "text-white",
    destructive: "text-destructive",
  };

  return (
    <Loader2
      className={cn(
        "animate-spin",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export function LoadingDots({ className, ...props }) {
  return (
    <div className={cn("flex justify-center gap-1", className)} {...props}>
      <span
        className="w-2 h-2 rounded-full bg-primary animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="w-2 h-2 rounded-full bg-primary animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="w-2 h-2 rounded-full bg-primary animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}

export function LoadingPulse({ className, children, ...props }) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      {children}
    </div>
  );
}
