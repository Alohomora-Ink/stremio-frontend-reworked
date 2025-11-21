"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface LiquidGlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  isLoading?: boolean;
}

export const LiquidGlassButton = forwardRef<
  HTMLButtonElement,
  LiquidGlassButtonProps
>(
  (
    { className, children, variant = "primary", isLoading, disabled, ...props },
    ref
  ) => {
    const variants = {
      primary:
        "bg-blue-600/80 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] border-blue-400/30",
      secondary:
        "bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10 hover:border-white/20"
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "relative flex h-12 w-full items-center justify-center rounded-xl border font-medium transition-all duration-300 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
          "backdrop-blur-md",
          variants[variant],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

LiquidGlassButton.displayName = "LiquidGlassButton";
