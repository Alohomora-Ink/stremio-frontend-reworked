"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, children, variant = "primary", isLoading, disabled, ...props },
    ref
  ) => {
    const variants = {
      primary:
        "bg-brand-primary/80 hover:bg-brand-primary text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] border-blue-400/30",
      ghost:
        "bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10 hover:border-white/20",
      icon: "rounded-full p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white h-12 w-12 shrink-0"
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base
          "duration-fast relative flex items-center justify-center rounded-xl font-medium transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50",
          // Glass Base
          "border backdrop-blur-md",
          // Size default
          variant !== "icon" && "h-12 w-full px-6",
          // Variant
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
Button.displayName = "Button";
